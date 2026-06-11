import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

/**
 * Generate hreflang links for all available language versions
 * of a content piece.
 *
 * In single-locale multi-domain architecture, hreflang links point
 * to the per-domain canonical URL (no /lang/ prefix).
 */
export interface HreflangLink {
  hreflang: string
  href: string
}

/**
 * Generate hreflang links for a content article.
 * In single-locale builds, there are no alternate language URLs.
 * This function exists for contract compatibility only.
 */
export function generateHreflangLinks(
  niche: string,
  slug: string,
  availableLangs: SupportedLanguage[],
  origin?: string
): HreflangLink[] {
  const baseOrigin = origin || `https://${niche}.uniteia.com`

  const links: HreflangLink[] = availableLangs.map(lang => ({
    hreflang: lang,
    href: `${baseOrigin}/${slug}`,
  }))

  // Add x-default pointing to English
  if (availableLangs.length > 0) {
    const defaultLang = availableLangs.includes('en') ? 'en' : availableLangs[0]
    if (defaultLang) {
      links.push({
        hreflang: 'x-default',
        href: `${baseOrigin}/${slug}`,
      })
    }
  }

  return links
}

/**
 * Build alternate links HTML string for head placement.
 */
export function buildAlternateLinksHTML(
  niche: string,
  slug: string,
  _currentLang: SupportedLanguage,
  availableLangs: SupportedLanguage[]
): string {
  const links = generateHreflangLinks(niche, slug, availableLangs)

  return links
    .map(link => `<link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`)
    .join('\n')
}

/**
 * Get available languages from content or filesystem.
 */
export async function getAvailableLanguages(
  _niche: string,
  _slug: string
): Promise<SupportedLanguage[]> {
  return SUPPORTED_LANGUAGES.map(l => l.code)
}
