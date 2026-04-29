import { parseAcceptLanguage } from '../i18n/middleware'

export type NicheFallbackLocale = 'pt' | 'en'

export function chooseNicheFallbackLocale(acceptLanguage: string | null): NicheFallbackLocale {
  const preferredLang = parseAcceptLanguage(acceptLanguage)
  return preferredLang === 'en' || preferredLang === 'pt' ? preferredLang : 'pt'
}

export function buildNicheLocaleRedirectPath(
  pathname: string,
  search: string,
  acceptLanguage: string | null
): string {
  const lang = chooseNicheFallbackLocale(acceptLanguage)

  // Normalize pathname to remove trailing slash for comparison
  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname

  const tail = normalizedPath === '/n' ? '' : normalizedPath.slice('/n'.length)

  // Ensure /n or /n/ goes to /pt/n (no trailing slash)
  // Ensure /n/tail goes to /pt/n/tail
  return `/${lang}/n${tail}${search}`
}
