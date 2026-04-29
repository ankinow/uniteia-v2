import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { JSONLD } from '~/components/json-ld'
import { NicheLanding } from '~/components/niche-landing'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { SupportedLanguage } from '~/i18n/types'
import { findNicheBySlug, getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'
import { generateWebSiteSchema } from '~/utils/schema-generators'
import type { NicheRouteData } from './types'

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

/**
 * Niche landing page component
 * Renders the NicheLanding component with data from the route loader.
 * Language is read from URL params (already validated by routeLoader$).
 */
export default component$(() => {
  const data = useNicheData()
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
      <NicheLanding niche={data.value.niche} otherNiches={data.value.otherNiches} lang={lang} />
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
  const englishSlug = getNicheSlug(data.niche, 'en')
  const portugueseSlug = getNicheSlug(data.niche, 'pt')
  const canonicalUrl = new URL(`/${lang}/n/${localizedSlug}`, url.origin)
  const pageTitle = `${data.niche.title[lang]} — UniTeia`
  const description = data.niche.description[lang]

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
    links: [
      { rel: 'canonical', href: canonicalUrl.href },
      {
        rel: 'alternate',
        hreflang: 'pt',
        href: new URL(`/pt/n/${portugueseSlug}`, url.origin).href,
      },
      {
        rel: 'alternate',
        hreflang: 'en',
        href: new URL(`/en/n/${englishSlug}`, url.origin).href,
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: new URL(`/en/n/${englishSlug}`, url.origin).href,
      },
    ],
  }
}
