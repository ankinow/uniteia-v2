import type { SupportedLanguage } from '~/i18n/types'

export function localed(lang: SupportedLanguage): string {
  return `/${lang}`
}

export function signalsIndex(lang: SupportedLanguage): string {
  return `/${lang}/signals`
}

export function nicheIndex(lang: SupportedLanguage, niche: string): string {
  return `/${lang}/signals/${niche}`
}

export function signalPage(lang: SupportedLanguage, niche: string, slug: string): string {
  return `/${lang}/signals/${niche}/${slug}`
}

export function searchPage(lang: SupportedLanguage, q?: string): string {
  return q ? `/${lang}/search?q=${encodeURIComponent(q)}` : `/${lang}/search`
}

export function staticPage(lang: SupportedLanguage, page: 'privacy' | 'terms'): string {
  return `/${lang}/${page}`
}

export function canonicalUrl(origin: string, path: string): string {
  const url = new URL(path, origin)
  return url.href
}

export function alternateUrl(
  origin: string,
  lang: SupportedLanguage,
  niche?: string,
  slug?: string
): string {
  const path = slug && niche ? `/${lang}/signals/${niche}/${slug}` : `/${lang}/signals`
  return new URL(path, origin).href
}

export function xdefaultUrl(origin: string, niche?: string, slug?: string): string {
  const path = slug && niche ? `/en/signals/${niche}/${slug}` : '/en/signals'
  return new URL(path, origin).href
}
