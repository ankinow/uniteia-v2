/**
 * Types for the [lang]/[...slug] content route
 * Defines the typed content returned by the routeLoader$
 */
import type { SupportedLanguage } from '~/i18n/types'
import type { VerdictLevel } from '~/components/editorial-verdict/types'

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
