import type { ContentLocale } from '~/content-graph/contracts/node'
import type { RouteContract } from '~/content-graph/contracts/routing'
import { LOCALE_CODES } from '~/edge/contract.v1'
import type { SupportedLanguage } from '~/i18n/types'

const LOCALE_SET = new Set<string>(LOCALE_CODES)

/**
 * Lazy accessor for the content graph provider.
 * Avoids static import of ~88KB graph data in the shared client bundle.
 */
let _graphProvider: import('~/content-graph/contracts/provider').ContentGraphProvider | null = null
let _graphPromise: Promise<void> | null = null

async function ensureGraphProvider(): Promise<void> {
  if (_graphProvider) return
  if (_graphPromise) return _graphPromise
  _graphPromise = (async () => {
    const mod = await import('~/content-graph.generated')
    _graphProvider = mod.contentGraphProvider
  })()
  return _graphPromise
}

function getGraphProvider():
  | import('~/content-graph/contracts/provider').ContentGraphProvider
  | null {
  return _graphProvider
}

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
  // x-default hreflang should point to the language-agnostic landing page.
  // When niche+slug are given (article pages), point to the English version
  // of the same article. Otherwise fall back to the English homepage.
  const path = slug && niche ? `/en/signals/${niche}/${slug}` : '/en/'
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

      // Validate locale using the authoritative LOCALE_CODES set
      // (not a regex, which would accept any 2-letter code like 'xx' or 'zz')
      const isLocale = LOCALE_SET.has(localePart)
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

        const provider = getGraphProvider()
        // NOTE: provider can be null if the lazy-load hasn't resolved yet
        // or if the content graph module failed to load. In that case we
        // fall through to the generic path reconstruction below, which
        // preserves the original niche/slug segments — correct fallback
        // behavior: locale switches still work, just without canonical
        // slug resolution across languages.
        if (provider) {
          const node = provider.getNode(slug, localePart as ContentLocale)
          if (node) {
            const targetNode = provider
              .getGroup(node.canonicalSlug)
              ?.find(n => n.locale === targetLocale)
            if (targetNode) {
              const targetNiche = targetNode.niche[0] ?? 'apex'
              return `/${targetLocale}/signals/${targetNiche}/${targetNode.slug}${query}${hash}`
            }
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

// Eagerly start loading the content graph provider in the background.
// When ready, subsequent localized() calls use graph-aware locale switching.
ensureGraphProvider()

export const routes = new AppRoutes()
