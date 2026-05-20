/**
 * Parse Accept-Language header — pure function, no framework dependencies.
 *
 * Extracted from i18n/middleware.ts to eliminate tree-shaking risk
 * when imported by edge functions and niche-locale-redirect.
 *
 * Contract version: v1 (2026-05-20)
 */

import { LOCALE_CODES, type SupportedLocale } from './contract.v1'

const LOCALE_SET = new Set<string>(LOCALE_CODES)

/**
 * Parse Accept-Language header and return the best matching supported locale.
 * Returns null if no match found.
 */
export function parseAcceptLanguage(header: string | null): SupportedLocale | null {
  if (!header) return null

  const languages = header
    .split(',')
    .map(entry => {
      const parts = entry.trim().split(';')
      const code = parts[0] ?? ''
      const qValue = parts[1] ?? 'q=1'
      const quality = Number.parseFloat(qValue.split('=')[1] ?? '1')
      return { code: code.trim().toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { code } of languages) {
    // Exact match
    if (LOCALE_SET.has(code)) {
      return code as SupportedLocale
    }
    // Base language match (e.g., 'en-us' → 'en')
    const baseLang = code.split('-')[0] ?? ''
    if (LOCALE_SET.has(baseLang)) {
      return baseLang as SupportedLocale
    }
  }

  return null
}
