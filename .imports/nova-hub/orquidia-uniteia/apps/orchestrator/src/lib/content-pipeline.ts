/**
 * Content Generation Pipeline - SOTA 2026
 * Uses uniteia-db.ts for persistence (official path)
 *
 * Templates:
 * - hub: Multi-item editorial hub
 * - comparison: X vs Y comparison
 * - guide: How-to / buying guide
 * - ranking: "Best X for Y" listicle
 */

import { ContentGenerator, OrchestratorAgent } from '@orquestra/ai-core'
import { getEvent } from 'vinxi/http'
import { logAuditEvent, logContentGeneration } from './audit'
import { getAuthContext } from './auth-middleware'
import { contentQueries } from './db'

export type ContentType = 'hub' | 'comparison' | 'guide' | 'ranking'

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

export interface ContentPage {
  id: string
  slug: string
  title: string
  content_html: string
  meta_description?: string
  keywords?: string[]
  content_type: string
  ai_model?: string
  is_published: boolean
  views: number
  created_at: number
  updated_at: number
}

export interface WorkflowConfig {
  name: string
  templateType: 'hub' | 'comparison' | 'guide' | 'ranking'
  targetProductIds?: string[]
  keywords?: string[]
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative'
  maxPages?: number
  autoPublish?: boolean
  seoOptimize?: boolean
}

export interface WorkflowResult {
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  totalPages: number
  completedPages: number
  failedPages: number
  pages: Array<{
    pageId: string
    slug: string
    canonicalPath: string
    status: ContentStatus
    error?: string
  }>
}

interface EditorialPlan {
  name: string
  slugSeed: string
  contentType: ContentType
  itemSlugs: string[]
  canonicalPath: string
}

const workflowRegistry = new Map<string, WorkflowConfig>()

interface BindingEnv {
  DB?: D1Database
  GEMINI_API_KEY?: string
}

function getBindings(): BindingEnv {
  const event = getEvent()
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env ?? {}
}

function getDB(): D1Database | null {
  return getBindings().DB ?? null
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)
}

/**
 * Create a new content generation workflow
 */
export async function createWorkflow(config: WorkflowConfig): Promise<{ workflowId: string }> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) throw new Error('Database not available. Run: npx wrangler dev --remote')
  if (!auth.isAuthenticated) throw new Error('Authentication required')

  const workflowId = crypto.randomUUID()
  await logAuditEvent('workflow_start', 'workflow', {
    resourceId: workflowId,
    details: { config, maxPages: config.maxPages || 1 },
  })

  workflowRegistry.set(workflowId, config)

  return { workflowId }
}

function normalizePageType(templateType: WorkflowConfig['templateType']): {
  contentType: ContentType
  slugPrefix: string
} {
  switch (templateType) {
    case 'hub':
      return { contentType: 'hub', slugPrefix: 'hub' }
    case 'comparison':
      return { contentType: 'comparison', slugPrefix: 'compare' }
    case 'ranking':
      return { contentType: 'ranking', slugPrefix: 'ranking' }
    default:
      return { contentType: 'guide', slugPrefix: 'guia' }
  }
}

function buildEditorialPlans(config: WorkflowConfig): EditorialPlan[] {
  const maxPages = Math.max(1, config.maxPages || 3)
  const { contentType, slugPrefix } = normalizePageType(config.templateType)
  const sourceItems = config.targetProductIds?.filter(Boolean) ||
    config.keywords?.filter(Boolean) || [config.name.toLowerCase().replace(/\s+/g, '-')]

  const plans: EditorialPlan[] = []
  const chunkSize = Math.max(2, Math.ceil(sourceItems.length / maxPages))

  for (let index = 0; index < maxPages; index += 1) {
    const itemSlugs = sourceItems.slice(index * chunkSize, (index + 1) * chunkSize)
    if (itemSlugs.length === 0) {
      break
    }

    const pageName =
      maxPages === 1 ? config.name : `${config.name} ${index + 1}`.replace(/\s+/g, ' ').trim()
    const slugSeed = `${slugPrefix}-${pageName}`
    const slug = generateSlug(slugSeed)
    const canonicalPath =
      contentType === 'hub'
        ? `/hubs/${slug}`
        : contentType === 'comparison'
          ? `/compare/${slug}`
          : contentType === 'ranking'
            ? `/rankings/${slug}`
            : `/guias/${slug}`

    plans.push({
      name: pageName,
      slugSeed,
      contentType,
      itemSlugs,
      canonicalPath,
    })
  }

  return plans
}

/**
 * Generate content using AI with template structure
 */
export async function generatePageContent(
  workflowId: string,
  config: WorkflowConfig,
  productData?: {
    title: string
    category: string
    features: string[]
    description?: string
    affiliateLink?: string
  },
  plan?: EditorialPlan,
): Promise<ContentPage> {
  const db = getDB()
  const auth = await getAuthContext()
  const { GEMINI_API_KEY } = getBindings()

  if (!db) throw new Error('Database not available')
  if (!auth.isAuthenticated) throw new Error('Authentication required')
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured')

  const generator = new ContentGenerator(GEMINI_API_KEY)
  const orchestrator = new OrchestratorAgent({ geminiApiKey: GEMINI_API_KEY })
  orchestrator.initialize()
  const normalizedPlan = plan || buildEditorialPlans(config)[0]
  const pageName = plan ? normalizedPlan?.name || config.name : config.name
  const pageType = normalizedPlan?.contentType || normalizePageType(config.templateType).contentType
  const itemSlugs = plan ? normalizedPlan?.itemSlugs || config.targetProductIds || [] : []
  const canonicalPath = normalizedPlan?.canonicalPath || '/guias'

  // Generate content using AI with template structure
  const contentResult = await generator.generate({
    apiKey: GEMINI_API_KEY,
    productName: productData?.title || pageName,
    category: productData?.category || 'General',
    features: productData?.features || (itemSlugs.length > 0 ? itemSlugs : config.keywords || []),
    contentType: pageType === 'hub' ? 'guide' : pageType,
    tone: config.tone || 'professional',
    targetAudience: 'Portuguese-speaking consumers in Brazil',
  })

  const pageId = crypto.randomUUID()
  const slug = plan
    ? generateSlug(normalizedPlan?.slugSeed || contentResult.title)
    : generateSlug(contentResult.title)
  const now = Math.floor(Date.now() / 1000)
  const schemaJson = JSON.stringify({
    pageType,
    itemSlugs,
    canonicalPath,
    seoKeywords: contentResult.seoKeywords,
  })

  // Save using official db helper
  await contentQueries.upsertGeneratedContent(db, {
    productId: itemSlugs[0] || productData?.title?.substring(0, 36) || undefined,
    slug,
    title: contentResult.title,
    contentType: pageType,
    markdown: contentResult.content,
    html: contentResult.content,
    metaDescription: contentResult.metaDescription,
    keywords: JSON.stringify(contentResult.seoKeywords),
    schemaJson,
    aiModel: contentResult.model,
    generationPrompt: `Generated: ${pageName}`,
    agentPipeline: 'orquidia.orchestrator.v1',
    publish: false,
  })

  // Log audit event
  await logContentGeneration(pageId, workflowId, contentResult.model)

  return {
    id: pageId,
    slug,
    title: contentResult.title,
    content_html: contentResult.content,
    meta_description: contentResult.metaDescription,
    keywords: contentResult.seoKeywords,
    content_type: pageType,
    ai_model: contentResult.model,
    is_published: false,
    views: 0,
    created_at: now,
    updated_at: now,
  }
}

/**
 * Execute a workflow - generate all pages
 */
export async function executeWorkflow(
  workflowId: string,
  overrideConfig?: WorkflowConfig,
): Promise<WorkflowResult> {
  const db = getDB()
  if (!db) throw new Error('Database not available')

  const config = overrideConfig ||
    workflowRegistry.get(workflowId) || {
      name: 'Generated Content Hub',
      templateType: 'hub' as const,
      maxPages: 3,
    }
  const plans = buildEditorialPlans(config)
  const maxPages = plans.length

  const results: WorkflowResult['pages'] = []
  let completed = 0
  let failed = 0

  for (const [index, plan] of plans.entries()) {
    try {
      const page = await generatePageContent(workflowId, config, undefined, plan)

      results.push({
        pageId: page.id,
        slug: page.slug,
        canonicalPath: plan.canonicalPath,
        status: page.is_published ? 'published' : 'draft',
      })
      completed += 1
    } catch (error) {
      failed += 1
      results.push({
        pageId: `failed-${index}`,
        slug: plan.slugSeed,
        canonicalPath: plan.canonicalPath,
        status: 'draft',
        error: error instanceof Error ? error.message : 'Generation failed',
      })
    }
  }

  await logAuditEvent(failed === 0 ? 'workflow_complete' : 'workflow_failed', 'workflow', {
    resourceId: workflowId,
    details: { completed, failed, total: maxPages },
    success: failed === 0,
  })

  return {
    workflowId,
    status: failed === 0 ? 'completed' : 'failed',
    totalPages: maxPages,
    completedPages: completed,
    failedPages: failed,
    pages: results,
  }
}

/**
 * Submit content for review
 */
export async function submitForReview(pageId: string): Promise<void> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) throw new Error('Database not available')
  if (!auth.isAuthenticated) throw new Error('Authentication required')

  await logAuditEvent('content_review', 'generated_content', {
    resourceId: pageId,
    details: { action: 'submit_for_review' },
  })
}

/**
 * Publish content
 */
export async function publishContent(pageId: string): Promise<void> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) throw new Error('Database not available')
  if (!auth.isAuthenticated) throw new Error('Authentication required')
  if (!auth.isAdmin) throw new Error('Admin access required to publish')

  await logAuditEvent('publish', 'generated_content', {
    resourceId: pageId,
    details: { published_by: auth.user?.email },
  })
}

/**
 * Archive content
 */
export async function archiveContent(pageId: string): Promise<void> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) throw new Error('Database not available')
  if (!auth.isAuthenticated) throw new Error('Authentication required')

  await logAuditEvent('unpublish', 'generated_content', {
    resourceId: pageId,
    details: { action: 'archive' },
  })
}

/**
 * Get content pages by status
 */
export async function getContentPagesByStatus(
  _status: ContentStatus,
  limit = 20,
  offset = 0,
): Promise<ContentPage[]> {
  const db = getDB()
  if (!db) return []

  const results = await db
    .prepare('SELECT * FROM generated_content ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all<{
      id: string
      slug: string
      title: string
      content_html: string
      meta_description?: string
      keywords?: string
      content_type: string
      ai_model?: string
      is_published: number
      views: number
      created_at: number
      updated_at: number
    }>()

  return (results.results ?? []).map(
    (row: {
      id: string
      slug: string
      title: string
      content_html: string
      meta_description?: string
      keywords?: string
      content_type: string
      ai_model?: string
      is_published: number
      views: number
      created_at: number
      updated_at: number
    }) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      content_html: row.content_html,
      meta_description: row.meta_description,
      keywords: row.keywords ? JSON.parse(row.keywords) : undefined,
      content_type: row.content_type,
      ai_model: row.ai_model,
      is_published: Boolean(row.is_published),
      views: row.views,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }),
  )
}
