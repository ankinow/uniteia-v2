import { $, Slot, component$, useOnWindow, useSignal } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE, type SupportedLanguage } from '~/i18n/types'
import type { NichesConfig } from '~/types/niche'
import { loadNichesConfig } from '~/utils/niche-loader'

export const onRequest: RequestHandler = async event => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  return onLanguageNegotiation(event)
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ headers }) => {
  const lang = headers.get('x-negotiated-lang')
  if (lang && ['en', 'pt', 'es', 'ja', 'zh'].includes(lang)) return lang as SupportedLanguage
  return DEFAULT_LANGUAGE
})

export const useNiche = routeLoader$<string>(({ headers }) => {
  return headers.get('x-negotiated-niche') ?? 'apex'
})

/**
 * Load all niches from config for the Topics dropdown.
 * Uses loadNichesConfig (which uses dynamic imports per D001),
 * so this loader is fully server-only.
 */
export const useNiches = routeLoader$<NichesConfig>(async () => {
  return await loadNichesConfig()
})

export default component$(() => {
  const langSignal = useLanguage()
  const nichesSignal = useNiches()
  const nicheSignal = useNiche()
  const lang = langSignal.value
  const topicsOpen = useSignal(false)

  useProvideI18n(lang)

  // Get translation directly for layout use since useI18n()
  // only works in children of this component.
  const t = getTranslation(lang)

  // Close dropdown on outside click
  useOnWindow(
    'click',
    $((event: Event) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-topics-dropdown]')) {
        topicsOpen.value = false
      }
    })
  )

  return (
    <SiteShell isApexHost={nicheSignal.value === 'apex'}>
      <div q:slot="header" class="w-full">
        <nav
          class="nav flex items-center justify-between px-4 md:px-8 py-4 border-b border-action/10"
          data-testid="main-nav"
        >
          <a
            href={`/${lang}`}
            class="brand flex items-center gap-2 text-xl font-bold text-bone hover:text-action transition-colors"
            data-testid="nav-logo"
          >
            <span class="text-action">Uni</span>
            <span>Teia</span>
          </a>

          <div class="nav-links hidden md:flex items-center gap-6">
            <a href={`/${lang}`} class="text-bone-muted hover:text-bone transition-colors">
              {t.nav.home}
            </a>
            <a href={`/${lang}/about`} class="text-bone-muted hover:text-bone transition-colors">
              {t.nav.about}
            </a>

            {/* Topics dropdown */}
            <div class="relative" data-topics-dropdown>
              <button
                type="button"
                class="appearance-none bg-transparent border-0 p-0 inline-flex items-center gap-1 text-bone-muted hover:text-bone transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                onClick$={() => {
                  topicsOpen.value = !topicsOpen.value
                }}
                data-testid="nav-topics-btn"
                aria-expanded={topicsOpen.value}
                aria-haspopup="true"
              >
                {t.nav.topics}
                <svg
                  class="w-4 h-4 transition-transform"
                  style={{ transform: topicsOpen.value ? 'rotate(180deg)' : '' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  role="img"
                  aria-label="Toggle topics menu"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {topicsOpen.value && nichesSignal.value.length > 0 && (
                <div
                  class="absolute top-full left-0 mt-2 w-56 bg-raised border border-action/20 rounded-lg shadow-lg z-50 py-1"
                  data-testid="nav-topics-dropdown"
                >
                  {nichesSignal.value.map(niche => (
                    <a
                      key={niche.slug}
                      href={`/${lang}/n/${niche.slug}`}
                      class="flex items-center gap-2 px-4 py-2 text-bone-muted hover:text-bone hover:bg-action/5 transition-colors"
                    >
                      <div
                        class={`i-lucide-${niche.icon} text-action text-base shrink-0`}
                        aria-hidden="true"
                      />
                      <span class="truncate">{niche.title[lang]}</span>
                    </a>
                  ))}
                  <div class="border-t border-action/10 my-1" />
                  <a
                    href={`/${lang}/n`}
                    class="flex items-center gap-2 px-4 py-2 text-action hover:bg-action/5 transition-colors font-medium"
                  >
                    {t.niche.allNiches}
                  </a>
                </div>
              )}
            </div>

            <a href={`/${lang}/projects`} class="text-bone-muted hover:text-bone transition-colors">
              {t.nav.projects}
            </a>
            <a href={`/${lang}/blog`} class="text-bone-muted hover:text-bone transition-colors">
              {t.nav.blog}
            </a>
          </div>

          <LangSwitcher />
        </nav>
      </div>
      <Slot />
      <Footer q:slot="footer" />
    </SiteShell>
  )
})
