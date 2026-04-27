import type { SupportedLanguage } from './types'

export const SUPPORTED_LOCALES: SupportedLanguage[] = ['en', 'pt', 'es', 'ja', 'zh']

/**
 * Extract the first path segment from a URL pathname
 */
export function extractLocale(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  return segments[0] || null
}

/**
 * Check if a locale string is a supported language code
 */
export function isValidLocale(locale: string): locale is SupportedLanguage {
  return SUPPORTED_LOCALES.includes(locale as SupportedLanguage)
}

/**
 * Validate if the first path segment is a supported locale
 * Returns null for root paths (no locale)
 * Returns the locale if valid, null if invalid
 */
export function validateLocalePath(pathname: string): {
  locale: SupportedLanguage | null
  isValid: boolean
  originalSegment: string | null
} {
  const segment = extractLocale(pathname)

  if (!segment) {
    // Root path - no locale specified
    return { locale: null, isValid: true, originalSegment: null }
  }

  if (isValidLocale(segment)) {
    return { locale: segment, isValid: true, originalSegment: segment }
  }

  // Invalid locale
  return { locale: null, isValid: false, originalSegment: segment }
}
