import { contentGraphProvider } from '~/content-graph.generated'
import type { ContentLocale } from '~/content-graph/contracts/node'
import type { RouteContract } from '~/content-graph/contracts/routing'
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

export class AppRoutes implements RouteContract {
  home(locale: ContentLocale): string {
    return `/${locale}`
  }

  signalsIndex(locale: ContentLocale): string {
    return `/${locale}/signals`
  }

  signal(locale: ContentLocale, niche: string, slug: string): string {
    return `/${locale}/signals/${niche}/${slug}`
  }

  localized(currentPath: string, targetLocale: ContentLocale): string {
    try {
      const url = new URL(currentPath, 'https://uniteia.com')
      const query = url.search
      const hash = url.hash
      const pathname = url.pathname
      const parts = pathname.split('/').filter(Boolean)

      if (parts.length === 0) {
        return `/${targetLocale}${query}${hash}`
      }

      let localePart = parts[0] ?? 'en'
      let rest = parts.slice(1)

      const isLocale = /^[a-z]{2}(-[A-Z]{2})?$/.test(localePart)
      if (!isLocale) {
        localePart = 'en'
        rest = parts
      }

      if (rest.length === 0) {
        return `/${targetLocale}${query}${hash}`
      }

      if (rest[0] === 'signals' && rest.length >= 3) {
        const niche = rest[1] as string
        const slug = rest[2] as string

        const node = contentGraphProvider.getNode(slug, localePart as ContentLocale)
        if (node) {
          const targetNode = contentGraphProvider
            .getGroup(node.canonicalSlug)
            ?.find(n => n.locale === targetLocale)
          if (targetNode) {
            const targetNiche = targetNode.niche[0] ?? 'apex'
            return `/${targetLocale}/signals/${targetNiche}/${targetNode.slug}${query}${hash}`
          }
        }
        return `/${targetLocale}/signals/${niche}/${slug}${query}${hash}`
      }

      if (rest[0] === 'signals' && rest.length === 2) {
        const niche = rest[1] as string
        return `/${targetLocale}/signals/${niche}${query}${hash}`
      }

      return `/${targetLocale}/${rest.join('/')}${query}${hash}`
    } catch {
      return `/${targetLocale}`
    }
  }
}

export const routes = new AppRoutes()
