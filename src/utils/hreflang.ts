import type { SupportedLanguage } from '~/i18n/types'

/**
 * Generate hreflang links for all available language versions
 * of a content piece
 */
export interface HreflangLink {
  hreflang: string
  href: string
}

/**
 * Generate hreflang links for a content article
 * @param niche - The niche subdomain (e.g., 'singularity', 'apex')
 * @param slug - The article slug
 * @param availableLangs - Array of language codes that have translations
 * @returns Array of hreflang link objects
 */
export function generateHreflangLinks(
  niche: string,
  slug: string,
  availableLangs: SupportedLanguage[]
): HreflangLink[] {
  const links: HreflangLink[] = availableLangs.map(lang => ({
    hreflang: lang,
    href: `https://${niche}.uniteia.com/${lang}/${slug}`,
  }))

  // Add x-default pointing to English
  if (availableLangs.length > 0) {
    const defaultLang = availableLangs.includes('en') ? 'en' : availableLangs[0]!
    links.push({
      hreflang: 'x-default',
      href: `https://${niche}.uniteia.com/${defaultLang}/${slug}`,
    })
  }

  return links
}

/**
 * Build alternate links HTML string for head placement
 * @param niche - The niche subdomain
 * @param slug - The article slug
 * @param currentLang - The current language being viewed
 * @param availableLangs - Array of available language codes
 * @returns HTML string with alternate link tags
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
 * Get available languages from content or filesystem
 * This is a simplified version - in production would use content-loader
 */
export async function getAvailableLanguages(
  _niche: string,
  _slug: string
): Promise<SupportedLanguage[]> {
  // Default to all supported languages if no specific data
  return ['en', 'pt', 'es', 'ja', 'zh'] as SupportedLanguage[]
}
