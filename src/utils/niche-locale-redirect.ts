import { countryToLang } from '../i18n/geo-map'
import { parseAcceptLanguage } from '../i18n/middleware'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/types'

const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export function chooseNicheFallbackLocale(
  acceptLanguage: string | null,
  countryCode: string | null = null,
  cookieLang: string | null = null
): SupportedLanguage {
  // 1. Check for language cookie first
  if (cookieLang && VALID_LANG_CODES.has(cookieLang)) {
    return cookieLang as SupportedLanguage
  }

  // 2. Try CF-IPCountry (edge signal)
  if (countryCode) {
    return countryToLang(countryCode)
  }

  // 3. Try Accept-Language fallback
  const preferredLang = parseAcceptLanguage(acceptLanguage)
  return preferredLang || 'pt' // default to pt for niche fallback if nothing detected
}

export function buildNicheLocaleRedirectPath(
  pathname: string,
  search: string,
  acceptLanguage: string | null,
  countryCode: string | null = null,
  cookieLang: string | null = null
): string {
  const lang = chooseNicheFallbackLocale(acceptLanguage, countryCode, cookieLang)

  // Normalize pathname to remove trailing slash for comparison
  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname

  const tail = normalizedPath === '/signals' ? '' : normalizedPath.slice('/signals'.length)

  // Ensure /signals or /signals/ goes to /pt/signals (no trailing slash)
  // Ensure /signals/tail goes to /pt/signals/tail
  return `/${lang}/signals${tail}${search}`
}
