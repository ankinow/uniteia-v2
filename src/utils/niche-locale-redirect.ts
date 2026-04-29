import { countryToLang } from '../i18n/geo-map'
import { parseAcceptLanguage } from '../i18n/middleware'
import type { SupportedLanguage } from '../i18n/types'

export function chooseNicheFallbackLocale(
  acceptLanguage: string | null,
  countryCode: string | null = null
): SupportedLanguage {
  // 1. Try CF-IPCountry first (edge signal)
  if (countryCode) {
    return countryToLang(countryCode)
  }

  // 2. Try Accept-Language fallback
  const preferredLang = parseAcceptLanguage(acceptLanguage)
  return preferredLang || 'pt' // default to pt for niche fallback if nothing detected
}

export function buildNicheLocaleRedirectPath(
  pathname: string,
  search: string,
  acceptLanguage: string | null,
  countryCode: string | null = null
): string {
  const lang = chooseNicheFallbackLocale(acceptLanguage, countryCode)

  // Normalize pathname to remove trailing slash for comparison
  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname

  const tail = normalizedPath === '/n' ? '' : normalizedPath.slice('/n'.length)

  // Ensure /n or /n/ goes to /pt/n (no trailing slash)
  // Ensure /n/tail goes to /pt/n/tail
  return `/${lang}/n${tail}${search}`
}
