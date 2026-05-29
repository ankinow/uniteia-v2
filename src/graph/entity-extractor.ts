/**
 * entity-extractor.ts
 *
 * P0.1: Parse markdown frontmatter from content/apex/**\/*.md
 * and extract typed entities + edges.
 *
 * Entity extraction rules:
 *   - Each .md file → 1 "article" entity
 *   - subjects[] → "category" entities
 *   - referral_links[] with product-like titles → "product" entities
 *   - URL hostname patterns → "brand" entities
 *
 * Input: path + raw markdown content
 * Output: { article, subjects, products, brands } → Entity[]
 */

import { load as parseYaml } from 'js-yaml'
import type { ContentLocale } from '~/content-graph/contracts/node'
import type { Edge, Entity } from './types'

const YAML_FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export interface ParsedFrontmatter {
  slug: string
  lang: string
  title: string
  verdict?: string
  quality_score?: number
  subjects?: string[]
  referral_links?: Array<{ url: string; title: string }>
  metadata?: {
    created_at?: string
    updated_at?: string
  }
}

export interface ExtractionResult {
  entities: Entity[]
  edges: Edge[]
}

/**
 * Parse YAML frontmatter from raw markdown content.
 */
export function parseFrontmatter(raw: string): ParsedFrontmatter | null {
  const match = raw.match(YAML_FRONTMATTER_RE)
  if (!match) return null

  try {
    const data = parseYaml(match[1]) as Record<string, unknown>
    if (!data || typeof data !== 'object') return null

    const slug = data.slug as string | undefined
    const lang = data.lang as string | undefined
    const title = data.title as string | undefined

    if (!slug || !lang || !title) return null

    return {
      slug,
      lang,
      title,
      ...(data.verdict !== undefined && { verdict: data.verdict as string }),
      ...(data.quality_score !== undefined && { quality_score: data.quality_score as number }),
      ...(data.subjects !== undefined && { subjects: data.subjects as string[] }),
      ...(data.referral_links !== undefined && {
        referral_links: data.referral_links as Array<{ url: string; title: string }>,
      }),
      ...(data.metadata !== undefined && {
        metadata: data.metadata as { created_at?: string; updated_at?: string },
      }),
    }
  } catch {
    return null
  }
}

/**
 * Extract domain from URL for brand detection.
 */
function extractDomain(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return hostname
  } catch {
    return null
  }
}

/**
 * Known brand domains → normalized brand name.
 */
const KNOWN_BRANDS: Record<string, string> = {
  'magica.com': 'Magica',
  'docs.magica.com': 'Magica',
  'try.magica.com': 'Magica',
  'modelcontextprotocol.io': 'MCP',
  'tencentcloud.com': 'Tencent Cloud',
  'www.tencentcloud.com': 'Tencent Cloud',
}

/**
 * Slugify a string for entity IDs.
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract entities and edges from parsed frontmatter.
 */
export function extractEntities(path: string, frontmatter: ParsedFrontmatter): ExtractionResult {
  const entities: Entity[] = []
  const edges: Edge[] = []
  const now = new Date().toISOString()

  const locale = frontmatter.lang as ContentLocale
  const articleId = `${locale}-${frontmatter.slug}`
  const updatedAt = frontmatter.metadata?.updated_at ?? now

  // ── 1. Article entity ──
  entities.push({
    id: articleId,
    type: 'article',
    name: frontmatter.title,
    locale,
    description: `Article about ${frontmatter.subjects?.join(', ') ?? frontmatter.slug}`,
    score: frontmatter.quality_score ?? 50,
    updatedAt,
    metadata: { path, slug: frontmatter.slug, verdict: frontmatter.verdict },
  })

  // ── 2. Subject categories ──
  for (const subject of frontmatter.subjects ?? []) {
    const catId = `category-${slugify(subject)}`
    // Deduplicate categories across articles
    if (!entities.some(e => e.id === catId)) {
      entities.push({
        id: catId,
        type: 'category',
        name: subject.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        score: 100,
        updatedAt: now,
      })
    }
    edges.push({
      source: articleId,
      target: catId,
      kind: 'belongs_to',
      weight: 1.0,
    })
  }

  // ── 3. Products from referral_links ──
  for (const link of frontmatter.referral_links ?? []) {
    const domain = extractDomain(link.url)
    if (!domain) continue

    // Determine if this is a product link or just documentation
    const isProductLink =
      !link.title.toLowerCase().includes('documentation') &&
      !link.title.toLowerCase().includes('docs') &&
      !link.title.toLowerCase().includes('specification')

    // Brand entity
    const brandName = KNOWN_BRANDS[domain] ?? domain
    const brandId = `brand-${slugify(brandName)}`

    if (!entities.some(e => e.id === brandId)) {
      entities.push({
        id: brandId,
        type: 'brand',
        name: brandName,
        url: `https://${domain}`,
        score: 100,
        updatedAt: now,
      })
    }

    // Product entity (for non-documentation links)
    if (isProductLink) {
      const productId = `product-${slugify(link.title)}`
      if (!entities.some(e => e.id === productId)) {
        entities.push({
          id: productId,
          type: 'product',
          name: link.title,
          url: link.url,
          score: 90,
          updatedAt: now,
        })
      }
      edges.push({
        source: articleId,
        target: productId,
        kind: 'has_affiliate',
        weight: 0.8,
        reason: link.title,
      })
    }

    // Edge: article → brand
    edges.push({
      source: articleId,
      target: brandId,
      kind: 'mentions',
      weight: 0.5,
      reason: link.title,
    })
  }

  return { entities, edges }
}

/**
 * Extract entities from raw markdown content (full pipeline).
 */
export function extractFromMarkdown(path: string, raw: string): ExtractionResult {
  const frontmatter = parseFrontmatter(raw)
  if (!frontmatter) return { entities: [], edges: [] }
  return extractEntities(path, frontmatter)
}
