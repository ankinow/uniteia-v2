import type { SupportedLanguage } from '~/i18n/types'

/**
 * CJK languages that require Noto Sans font loading
 * These languages need specific font support for proper character rendering
 */
export const CJK_LANGUAGES: readonly SupportedLanguage[] = ['ja', 'zh']

/**
 * Determines if a language requires CJK font loading
 * @param lang - The language code to check
 * @returns true if CJK fonts should be loaded for this language
 */
export function shouldLoadCJKFont(lang: string | null | undefined): boolean {
  if (!lang) return false
  return CJK_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * Get the appropriate font family name for a language
 * @param lang - The language code
 * @returns The font family name to use, or null if no special font needed
 */
export function getFontFamilyForLanguage(lang: string | null | undefined): string | null {
  if (!lang) return null

  switch (lang) {
    case 'ja':
      return 'Noto Sans JP'
    case 'zh':
      return 'Noto Sans SC'
    default:
      return null
  }
}
