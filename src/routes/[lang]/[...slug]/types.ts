/**
 * Types for the [lang]/[...slug] content route
 * Defines the typed content returned by the routeLoader$
 */
import type { SupportedLanguage } from '~/i18n/types'

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
