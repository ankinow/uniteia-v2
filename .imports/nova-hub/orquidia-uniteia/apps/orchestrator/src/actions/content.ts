/**
 * Content Generation Actions
 * SOTA 2026: AI-powered content generation with autonomous staging workflow
 *
 * Features:
 * - Batch generation (up to 10 pages per workflow)
 * - Staging flow: draft → review → publish
 * - Integration with ai-core ContentGenerator and OrchestratorAgent
 * - Rate limiting: 50 pages/day
 * - Provider priority: Gemini → Workers AI → (future APIs)
 */

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getAuthContext } from '../lib/auth-middleware'
import {
  type ContentStatus,
  type WorkflowConfig,
  archiveContent,
  createWorkflow,
  executeWorkflow,
  getContentPagesByStatus,
  publishContent,
  submitForReview,
} from '../lib/content-pipeline'
import { checkRateLimit } from '../lib/rate-limit'

// =============================================================================
// INPUT SCHEMAS
// =============================================================================

const CreateWorkflowInput = z.object({
  name: z.string().min(3).max(100),
  templateType: z.enum(['hub', 'comparison', 'guide', 'ranking']),
  targetProductIds: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'informative']).optional(),
  maxPages: z.number().int().min(1).max(10).optional().default(10),
  autoPublish: z.boolean().optional().default(false),
  seoOptimize: z.boolean().optional().default(true),
})

const WorkflowIdInput = z.object({
  workflowId: z.string().uuid(),
  config: CreateWorkflowInput.optional(),
})

const PageIdInput = z.object({
  pageId: z.string().uuid(),
})

const GetContentInput = z.object({
  status: z.enum(['draft', 'review', 'published', 'archived']),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
})

// =============================================================================
// WORKFLOW ACTIONS
// =============================================================================

/**
 * Create a new content generation workflow
 * Returns workflow ID for tracking
 */
export const createContentWorkflow = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => CreateWorkflowInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof CreateWorkflowInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required' }
      }

      if (!auth.isAdmin) {
        return { success: false, error: 'Admin access required' }
      }

      const config: WorkflowConfig = {
        name: data.name,
        templateType: data.templateType,
        targetProductIds: data.targetProductIds,
        keywords: data.keywords,
        tone: data.tone,
        maxPages: data.maxPages,
        autoPublish: data.autoPublish,
        seoOptimize: data.seoOptimize,
      }

      const { workflowId } = await createWorkflow(config)

      return {
        success: true,
        workflowId,
        message: `Workflow created successfully. Will generate up to ${data.maxPages} pages.`,
      }
    } catch (error) {
      console.error('[CONTENT] Failed to create workflow:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create workflow',
      }
    }
  })

/**
 * Execute a workflow - starts the content generation process
 */
export const executeContentWorkflow = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => WorkflowIdInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof WorkflowIdInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required' }
      }

      if (!auth.isAdmin) {
        return { success: false, error: 'Admin access required' }
      }

      const result = await executeWorkflow(data.workflowId, data.config)

      return {
        success: result.status === 'completed',
        workflowId: result.workflowId,
        status: result.status,
        totalPages: result.totalPages,
        completedPages: result.completedPages,
        failedPages: result.failedPages,
        pages: result.pages,
      }
    } catch (error) {
      console.error('[CONTENT] Failed to execute workflow:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute workflow',
      }
    }
  })

// =============================================================================
// CONTENT MANAGEMENT ACTIONS
// =============================================================================

/**
 * Submit content for review (draft → review)
 */
export const submitContentForReview = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => PageIdInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof PageIdInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required' }
      }

      await submitForReview(data.pageId)

      return {
        success: true,
        pageId: data.pageId,
        status: 'review',
        message: 'Content submitted for review',
      }
    } catch (error) {
      console.error('[CONTENT] Failed to submit for review:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit for review',
      }
    }
  })

/**
 * Publish content (review/draft → published)
 * Requires admin access
 */
export const publishContentPage = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => PageIdInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof PageIdInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required' }
      }

      if (!auth.isAdmin) {
        return { success: false, error: 'Admin access required to publish content' }
      }

      await publishContent(data.pageId)

      return {
        success: true,
        pageId: data.pageId,
        status: 'published',
        message: 'Content published successfully',
      }
    } catch (error) {
      console.error('[CONTENT] Failed to publish:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to publish content',
      }
    }
  })

/**
 * Archive content (published → archived)
 */
export const archiveContentPage = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => PageIdInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof PageIdInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required' }
      }

      await archiveContent(data.pageId)

      return {
        success: true,
        pageId: data.pageId,
        status: 'archived',
        message: 'Content archived successfully',
      }
    } catch (error) {
      console.error('[CONTENT] Failed to archive:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive content',
      }
    }
  })

/**
 * Get content pages by status
 */
export const getContentByStatus = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => GetContentInput.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof GetContentInput> }) => {
    try {
      const auth = await getAuthContext()

      if (!auth.isAuthenticated) {
        return { success: false, error: 'Authentication required', pages: [] }
      }

      const pages = await getContentPagesByStatus(data.status, data.limit, data.offset)

      return {
        success: true,
        status: data.status,
        pages,
        count: pages.length,
      }
    } catch (error) {
      console.error('[CONTENT] Failed to get content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get content',
        pages: [],
      }
    }
  })

// =============================================================================
// =============================================================================
