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
 * Localized niche slugs for the primary routed locales.
 */
export interface NicheSlugs {
  pt: string
  en: string
  es: string
  fr: string
  de: string
  it: string
  ja: string
  zh: string
}

/**
 * A single niche entry as defined in config/niches.yaml
 */
export interface NicheConfig {
  /** Canonical URL slug — kept for back-compat */
  slug: string
  /** Locale-specific routed slugs */
  slugs: NicheSlugs
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
