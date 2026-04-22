import type { SupportedLanguage } from '~/i18n/types'
import type { VerdictLevel } from '~/components/editorial-verdict/types'

/**
 * Types for content loading and validation
 * Shared across route handlers and utility modules
 */

/**
 * Referral link from article frontmatter
 */
export interface ReferralLink {
  url: string
  title: string
  description?: string
}

/**
 * Article metadata from frontmatter
 */
export interface ArticleMetadata {
  created_at?: string
  updated_at?: string
  author?: string
  version?: number
}

/**
 * Typed content object returned by the routeLoader$
 * Matches the llm-wiki-v1 JSON Schema
 */
export interface LlmWikiContent {
  slug: string
  lang: SupportedLanguage
  title: string
  content: string
  subjects: string[]
  referral_links: ReferralLink[]
  metadata?: ArticleMetadata
  /** Editorial verdict level (defaults to 'trusted' if absent) */
  verdict?: VerdictLevel
  /** Quality score 0-100 (defaults to 85 if absent) */
  quality_score?: number
}

/**
 * Route parameters extracted from the URL
 */
export interface ContentRouteParams {
  lang: SupportedLanguage
  slug: string
}

/**
 * Validation error details for logging
 */
export interface ContentValidationError {
  slug: string
  lang: string
  errors: string[]
}

/**
 * Error thrown when content loading fails at any pipeline stage.
 * Modeled on NicheValidationError from ~/types/niche.ts.
 *
 * The `phase` field indicates which pipeline step failed:
 * - 'read':   file could not be read from disk
 * - 'parse':  frontmatter parsing failed
 * - 'schema': AJV schema validation failed
 * - 'slug':   slug format validation failed
 */
export class ContentLoaderError extends Error {
  readonly slug: string
  readonly lang: string
  readonly phase: 'read' | 'parse' | 'schema' | 'slug'
  readonly errors: string[]

  constructor(opts: {
    slug: string
    lang: string
    phase: 'read' | 'parse' | 'schema' | 'slug'
    errors: string[]
  }) {
    super(`ContentLoaderError: ${opts.phase} failed for ${opts.lang}/${opts.slug}`)
    this.name = 'ContentLoaderError'
    this.slug = opts.slug
    this.lang = opts.lang
    this.phase = opts.phase
    this.errors = opts.errors
  }
}
