import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { Breadcrumb } from '~/components/breadcrumb'
import { NicheCard } from '~/components/niche-card'
import { ScrollDepthCardEnhancer } from '~/components/scroll-driven'
import { BUILD_LOCALE } from '~/build-locale'
import { useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { canonicalUrl } from '~/routing/routes'
import type { NichesConfig } from '~/types/niche'
import { loadNichesConfig } from '~/utils/niche-loader'

/**
 * routeLoader$ that loads all niches from config for the niche index page.
 */
export const useAllNiches = routeLoader$<NichesConfig>(async ({ error }) => {
  // Still validate locale from build env for error handling consistency
  if (!BUILD_LOCALE) {
    throw error(500, 'BUILD_LOCALE not set')
  }
  return await loadNichesConfig()
})

/**
 * Niche index page — renders all niche cards in a grid.
 * In single-locale APEX-only architecture, this will show just the APEX card.
 */
export default component$(() => {
  const nichesSignal = useAllNiches()
  const location = useLocation()
  const lang = BUILD_LOCALE as SupportedLanguage
  const { t } = useI18n()

  return (
    <div class="px-4 py-8" data-testid="niche-index">
      <div class="px-4 pb-4">
        <Breadcrumb />
      </div>
      <div class="mb-8 px-4">
        <h1 class="text-2xl font-bold text-bone font-display">{t.niche.allNiches}</h1>
      </div>

      {nichesSignal.value.length > 0 ? (
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-4">
          {nichesSignal.value.map((niche, index) => {
            const isHero = index === 0
            const isDouble = index > 0 && index % 3 === 0
            const cardSize = isHero ? 'hero' : isDouble ? 'hero' : 'medium'
            return (
              <ScrollDepthCardEnhancer key={niche.slug}>
                <NicheCard niche={niche} lang={lang} size={cardSize} />
              </ScrollDepthCardEnhancer>
            )
          })}
        </div>
      ) : (
        <p class="text-bone-muted">{t.niche.topicsLabel}</p>
      )}
    </div>
  )
})

import { getTranslation } from '~/i18n/context'

export const head: DocumentHead = ({ url }) => {
  const lang = BUILD_LOCALE as SupportedLanguage
  const t = getTranslation(lang)

  return {
    title: t.seo.topicsTitle,
    meta: [
      { name: 'description', content: t.seo.topicsDescription },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, '/signals') },
    ],
  }
}
