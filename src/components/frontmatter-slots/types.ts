/**
 * FrontmatterSlots component props
 * Renders article metadata: subjects as tag pills, timestamps in monospace, and language indicator
 */
export interface FrontmatterSlotsProps {
  /** Subject tags for categorization (1-10 items per schema) */
  subjects: string[]
  /** ISO 639-1 language code */
  lang: string
  /** Article metadata timestamps and author info */
  metadata?: ArticleMetadataSlots | undefined
  /** i18n labels for display strings */
  labels?: FrontmatterLabels | undefined
  /** Optional CSS class for additional styling */
  class?: string
}

/**
 * i18n labels for FrontmatterSlots display strings
 * Matches the TranslationStrings.article section
 */
export interface FrontmatterLabels {
  subjectsLabel: string
  published: string
  updated: string
  byAuthor: string
  version: string
  readInLang: string
}

/**
 * Metadata sub-fields used by FrontmatterSlots
 * Subset of ArticleMetadata focused on display fields
 */
export interface ArticleMetadataSlots {
  created_at?: string
  updated_at?: string
  author?: string
  version?: number
}
