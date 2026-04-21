import type { SupportedLanguage } from '../i18n/types'

/**
 * Localized title for a niche — one string per supported language
 */
export type NicheTitle = Record<SupportedLanguage, string>

/**
 * Localized description for a niche — one string per supported language
 */
export type NicheDescription = Record<SupportedLanguage, string>

/**
 * A single niche entry as defined in config/niches.yaml
 */
export interface NicheConfig {
  /** URL slug — must match SLUG_PATTERN in url-validation.ts */
  slug: string
  /** Lucide icon name (e.g. "Bot", "PenTool") */
  icon: string
  /** Localized title in all supported languages */
  title: NicheTitle
  /** Localized description in all supported languages */
  description: NicheDescription
}

/**
 * Top-level array of niche entries (the full config/niches.yaml shape)
 */
export type NichesConfig = NicheConfig[]

/**
 * Validation error for a single niche config entry
 */
export interface NicheValidationError {
  /** Slug of the entry that failed validation (absent if slug itself is missing/invalid) */
  slug?: string
  /** List of validation error messages */
  errors: string[]
}
