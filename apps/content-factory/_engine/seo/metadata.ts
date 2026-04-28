import { ALL_LANGS, type SupportedLang } from '../i18n/headings'

const BASE_DOMAIN = 'https://uniteia.com'

export interface HreflangLink {
  rel: 'canonical' | 'alternate'
  hreflang?: string
  href: string
}

export function generateSeoMetadata(slug: string, currentLang: SupportedLang) {
  const canonical = `${BASE_DOMAIN}/${currentLang}/${slug}`

  const alternates: HreflangLink[] = ALL_LANGS.map(lang => ({
    rel: 'alternate',
    hreflang: lang === 'zh' ? 'zh-Hans' : lang, // Map zh to Hans as per spec
    href: `${BASE_DOMAIN}/${lang}/${slug}`,
  }))

  // Add x-default (English is our canonical fallback)
  alternates.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${BASE_DOMAIN}/en/${slug}`,
  })

  return {
    canonical,
    alternates,
  }
}

export function generateJsonLd(core: any, slug: string, lang: SupportedLang) {
  const baseUrl = `${BASE_DOMAIN}/${lang}/${slug}`
  const lastReviewed =
    core.seo?.freshness_policy?.last_reviewed_at ||
    core.updated ||
    core.created ||
    new Date().toISOString()

  const graph = [
    {
      '@type': 'Article',
      '@id': `${baseUrl}#article`,
      headline: core.entity,
      description: core.summaries?.summary_one_liner,
      inLanguage: lang,
      dateModified: lastReviewed,
      author: {
        '@type': 'Organization',
        name: 'UniTeia',
        url: BASE_DOMAIN,
      },
      about: {
        '@type': 'Thing',
        name: core.entity,
        sameAs: core.official_url,
      },
    },
  ]

  // Add Review if score exists
  if (core.verdict?.score !== undefined) {
    graph.push({
      '@type': 'Review',
      '@id': `${baseUrl}#review`,
      itemReviewed: {
        '@type': 'Product',
        name: core.entity,
        url: core.official_url,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: core.verdict.score,
        bestRating: '10',
        worstRating: '0',
      },
      author: {
        '@type': 'Organization',
        name: 'UniTeia',
      },
    } as any)
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
