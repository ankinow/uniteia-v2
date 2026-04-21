import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { loadNichesConfig, findNicheBySlug } from '~/utils/niche-loader'
import { getTranslation } from '~/i18n/context'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { SupportedLanguage } from '~/i18n/types'
import { NicheLanding } from '~/components/niche-landing'
import type { NicheRouteData } from './types'

/** Quick lookup set for valid language codes */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map((l) => l.code))

/**
 * routeLoader$ that loads the niches config, finds the niche matching
 * the URL slug, validates the language param, and returns typed
 * NicheRouteData or throws 404.
 *
 * All Node.js imports are inside loadNichesConfig (which uses dynamic
 * import() per D001), so this loader is fully server-only.
 */
export const useNicheData = routeLoader$<NicheRouteData>(
  async ({ params, error }) => {
    const lang = params.lang
    const nicheSlug = params.niche

    // Validate language parameter
    if (!lang || !VALID_LANG_CODES.has(lang)) {
      throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
    }

    // Load and validate niches from config
    const niches = await loadNichesConfig()

    // Find the matching niche
    const niche = findNicheBySlug(niches, nicheSlug)
    if (!niche) {
      console.warn(
        `[niche-loader] Niche not found for slug: "${nicheSlug}"`,
      )
      throw error(404, `Niche not found: ${nicheSlug}`)
    }

    // Return current niche + all other niches for the related grid
    const otherNiches = niches.filter((n) => n.slug !== nicheSlug)

    return { niche, otherNiches }
  },
)

/**
 * Niche landing page component
 * Renders the NicheLanding component with data from the route loader.
 * Language is read from URL params (already validated by routeLoader$).
 */
export default component$(() => {
  const data = useNicheData()
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'

  return (
    <NicheLanding
      niche={data.value.niche}
      otherNiches={data.value.otherNiches}
      lang={lang}
    />
  )
})

/**
 * Document head — sets page title and meta description from niche data
 */
export const head: DocumentHead = ({ resolveValue, params }) => {
  const data = resolveValue(useNicheData)
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  const title = `${data.niche.title[lang]} | UniTeia`
  const description = data.niche.description[lang]

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
    ],
  }
}
