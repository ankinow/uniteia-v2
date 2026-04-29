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
  const tail = pathname === '/n' || pathname === '/n/' ? '' : pathname.slice('/n'.length)
  return `/${lang}/n${tail}${search}`
}
