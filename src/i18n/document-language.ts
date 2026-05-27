import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from './types'

const SUPPORTED_LANGUAGE_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(language => language.code))

export function resolveDocumentLanguageFromPathname(
  pathname: string | null | undefined
): SupportedLanguage {
  if (!pathname) return DEFAULT_LANGUAGE

  const trimmedPath = pathname.replace(/^\/+/, '')
  const firstSegment = trimmedPath.split('/', 1)[0]

  // Handle regional variants: 'pt-BR' → 'pt', 'en-US' → 'en'
  const baseLang = firstSegment?.split('-')[0]

  if (baseLang && SUPPORTED_LANGUAGE_CODES.has(baseLang)) {
    return baseLang as SupportedLanguage
  }

  return DEFAULT_LANGUAGE
}
