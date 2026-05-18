import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { NicheCard } from '~/components/niche-card'
import { useI18n } from '~/i18n/context'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { canonicalUrl, signalsIndex, xdefaultUrl } from '~/routing/routes'
import type { NichesConfig } from '~/types/niche'
import { loadNichesConfig } from '~/utils/niche-loader'

type AlternateLink = {
  rel: 'alternate'
  hreflang: SupportedLanguage | 'x-default'
  href: string
}

/** Quick lookup set for valid language codes */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onStaticGenerate = () => {
  return {
    params: SUPPORTED_LANGUAGES.map(l => ({
      lang: l.code,
    })),
  }
}

/**
 * routeLoader$ that loads all niches from config for the niche index page.
 * Returns the full NichesConfig array (all validated niches).
 */
export const useAllNiches = routeLoader$<NichesConfig>(async ({ params, error }) => {
  const lang = params.lang

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  return await loadNichesConfig()
})

/**
 * Niche index page — renders all niche cards in a grid.
 * Each card links to its niche landing page at /[lang]/signals/[niche].
 */
export default component$(() => {
  const nichesSignal = useAllNiches()
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const { t } = useI18n()

  return (
    <div class="px-4 py-8" data-testid="niche-index">
      <div class="mb-8 px-4">
        <h1 class="text-3xl font-bold text-bone font-display">{t.niche.allNiches}</h1>
      </div>

      {nichesSignal.value.length > 0 ? (
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4">
          {nichesSignal.value.map((niche, index) => {
            // Organic anti-grid pattern: first niche is hero, then alternate 1-1-2
            const isHero = index === 0
            const isDouble = index > 0 && index % 3 === 0
            const cardSize = isHero ? 'hero' : isDouble ? 'hero' : 'medium'
            return <NicheCard key={niche.slug} niche={niche} lang={lang} size={cardSize} />
          })}
        </div>
      ) : (
        <p class="text-bone-muted">{t.niche.topicsLabel}</p>
      )}
    </div>
  )
})

import { getTranslation } from '~/i18n/context'

export const head: DocumentHead = ({ params, url }) => {
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  const alternateLinks: AlternateLink[] = SUPPORTED_LANGUAGES.map(l => ({
    rel: 'alternate',
    hreflang: l.code,
    href: canonicalUrl(url.origin, signalsIndex(l.code)),
  }))

  alternateLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: xdefaultUrl(url.origin),
  })

  return {
    title: t.seo.topicsTitle,
    meta: [
      { name: 'description', content: t.seo.topicsDescription },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, signalsIndex(lang)) },
      ...alternateLinks,
    ],
  }
}
