import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { JSONLD } from '~/components/json-ld'
import { NicheLanding } from '~/components/niche-landing'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import type { NicheArticleEntry } from '~/utils/content-loader'
import { findNicheBySlug, getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'
import { generateWebSiteSchema } from '~/utils/schema-generators'
import type { NicheRouteData } from './types'

type AlternateLink = {
  rel: 'alternate'
  hreflang: SupportedLanguage | 'x-default'
  href: string
}

/** Quick lookup set for valid language codes */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onRequest: RequestHandler = async event => {
  const lang = event.params.lang ?? ''
  const nicheSlug = event.params.niche ?? ''

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw event.error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)

  if (!niche) {
    throw event.error(404, `Niche not found: ${nicheSlug}`)
  }

  const localeSlug = getNicheSlug(niche, lang as SupportedLanguage)
  if (localeSlug !== nicheSlug) {
    throw event.redirect(301, `/${lang}/n/${localeSlug}${event.url.search}`)
  }
}

/**
 * routeLoader$ that loads the niches config, finds the niche matching
 * the URL slug, validates the language param, and returns typed
 * NicheRouteData or throws 404.
 *
 * All Node.js imports are inside loadNichesConfig (which uses dynamic
 * import() per D001), so this loader is fully server-only.
 */
export const useNicheData = routeLoader$<NicheRouteData>(async ({ params, error }) => {
  const lang = params.lang ?? ''
  const nicheSlug = params.niche ?? ''

  // Validate language parameter
  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  // Load and validate niches from config
  const niches = await loadNichesConfig()

  // Find the matching niche
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)
  if (!niche) {
    console.warn(`[niche-loader] Niche not found for slug: "${nicheSlug}"`)
    throw error(404, `Niche not found: ${nicheSlug}`)
  }

  // Return current niche + all other niches for the related grid
  const otherNiches = niches.filter(n => n.slug !== nicheSlug)

  return { niche, otherNiches }
})

export const useNicheArticles = routeLoader$<NicheArticleEntry[]>(async ({ params }) => {
  const lang = params.lang ?? ''
  const nicheSlug = params.niche ?? ''

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)
  if (!niche) return []

  const { contentGraphProvider } = await import('~/content-graph.generated')
  const nodes = contentGraphProvider.getByNiche(niche.slug)

  return nodes
    .filter(n => n.slug !== '_index')
    .map(node => ({
      slug: node.slug,
      lang: node.locale as SupportedLanguage,
      title: node.title,
      updatedAt: node.timestamps.updatedAt,
      summary: node.summary,
      qualityScore: node.qualityScore,
      verdict:
        node.verdict === 'safe' ? 'trusted' : node.verdict === 'unsafe' ? 'flagged' : node.verdict,
    }))
})

/**
 * Niche landing page component
 * Renders the NicheLanding component with data from the route loader.
 * Language is read from URL params (already validated by routeLoader$).
 */
export default component$(() => {
  const data = useNicheData()
  const articles = useNicheArticles()
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'

  const websiteSchema = generateWebSiteSchema({
    name: `${data.value.niche.title[lang]} | UniTeia`,
    url: location.url.href,
    description: data.value.niche.description[lang],
    lang,
  })

  return (
    <>
      <JSONLD data={websiteSchema} />
      <NicheLanding
        niche={data.value.niche}
        otherNiches={data.value.otherNiches}
        articles={articles.value}
        lang={lang}
      />
    </>
  )
})

/**
 * Document head — sets page title and meta description from niche data
 */
export const head: DocumentHead = ({ resolveValue, params, url }) => {
  const data = resolveValue(useNicheData)
  const lang = (params.lang as SupportedLanguage) || 'en'

  const localizedSlug = getNicheSlug(data.niche, lang as SupportedLanguage)
  const canonicalUrl = new URL(`/${lang}/n/${localizedSlug}`, url.origin)
  const pageTitle = `${data.niche.title[lang]} — UniTeia`
  const description = data.niche.description[lang]

  const alternateLinks: AlternateLink[] = SUPPORTED_LANGUAGES.map(l => ({
    rel: 'alternate',
    hreflang: l.code,
    href: new URL(`/${l.code}/n/${getNicheSlug(data.niche, l.code)}`, url.origin).href,
  }))

  alternateLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: new URL(`/en/n/${getNicheSlug(data.niche, 'en')}`, url.origin).href,
  })

  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl.href },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: lang },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl.href }, ...alternateLinks],
  }
}
