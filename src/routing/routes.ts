import type { ContentLocale } from '~/content-graph/contracts/node'
import type { RouteContract } from '~/content-graph/contracts/routing'
import { BUILD_LOCALE } from '~/build-locale'
import type { SupportedLanguage } from '~/i18n/types'

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

/**
 * In single-locale multi-domain architecture, there is no locale prefix.
 */
export function localed(): string {
  return '/'
}

export function signalsIndex(): string {
  return '/signals'
}

export function nicheIndex(niche: string): string {
  return `/signals/${niche}`
}

export function signalPage(niche: string, slug: string): string {
  return `/signals/${niche}/${slug}`
}

export function searchPage(q?: string): string {
  return q ? `/search?q=${encodeURIComponent(q)}` : '/search'
}

export function staticPage(page: 'privacy' | 'terms'): string {
  return `/${page}`
}

export function canonicalUrl(origin: string, path: string): string {
  const url = new URL(path, origin)
  return url.href
}

/**
 * AppRoutes implements RouteContract for single-locale APEX-only architecture.
 * No locale prefix in URLs — locale comes from BUILD_LOCALE env var.
 */
export class AppRoutes implements RouteContract {
  home(_locale?: ContentLocale): string {
    return '/'
  }

  signalsIndex(_locale?: ContentLocale): string {
    return '/signals'
  }

  signal(locale: ContentLocale, niche: string, slug: string): string {
    return `/signals/${niche}/${slug}`
  }

  localized(currentPath: string, targetLocale: ContentLocale): string {
    // In single-locale builds, there's only one locale — just return the current path.
    // The lang switcher is removed; this method exists only for the contract.
    try {
      const url = new URL(currentPath, 'https://uniteia.com')
      return `${url.pathname}${url.search}${url.hash}`
    } catch {
      return '/'
    }
  }
}

// Eagerly start loading the content graph provider in the background.
ensureGraphProvider()

export const routes = new AppRoutes()
