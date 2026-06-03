import { $, Slot, component$, useOnWindow, useSignal } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { AgentStatus } from '~/components/agent-status'
import { AnalogConnector } from '~/components/analog-connector'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { NavTree } from '~/components/nav-tree'
import { SiteShell } from '~/components/site-shell'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { signalsIndex } from '~/routing/routes'
import type { NichesConfig } from '~/types/niche'
import { type NavigationData, deriveNavigation } from '~/utils/content-loader'
import { getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'

export const onRequest: RequestHandler = async event => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  await onLanguageNegotiation(event)
  // Security headers applied at edge only (functions/[[route]].ts + _headers)
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ headers }) => {
  const lang = headers.get('x-negotiated-lang')
  if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)) return lang as SupportedLanguage
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

/**
 * Derive navigation structure from content files.
 * Build-time only - runs during Vite build using import.meta.glob.
 * Results are memoized for dev build performance.
 */
export const useNavigation = routeLoader$<NavigationData>(async () => {
  return await deriveNavigation()
})

export default component$(() => {
  const langSignal = useLanguage()
  const nichesSignal = useNiches()
  const nicheSignal = useNiche()
  const navSignal = useNavigation()
  const lang = langSignal.value
  const topicsOpen = useSignal(false)
  const isDronePlaying = useSignal(true)
  const toggleDrone = $(() => {
    isDronePlaying.value = !isDronePlaying.value
    if (isDronePlaying.value) {
      import('~/utils/aether-sound').then(m => m.startAmbientDrone())
    } else {
      import('~/utils/aether-sound').then(m => m.stopAmbientDrone())
    }
  })

  useProvideI18n(lang)

  // Get translation directly for layout use since useI18n()
  // only works in children of this component.
  const t = getTranslation(lang)

  const nicheSlugMap = Object.fromEntries(
    nichesSignal.value.map(niche => [niche.slug, getNicheSlug(niche, lang)])
  )

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
      {/* Header - mantido no mobile conforme solicitado */}
      <div q:slot="header" class="w-full">
        <nav
          aria-label="Primary navigation"
          class="nav flex items-center justify-between px-4 md:px-8 py-4 border-b border-action/10"
          data-testid="main-nav"
        >
          <a
            href={signalsIndex(lang)}
            class="text-bone-muted hover:text-bone transition-colors focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
          >
            {t.nav.topics}
          </a>
          <LangSwitcher />
          {/* Agent status indicator */}
          <AgentStatus state="idle" size="sm" compact class="ml-auto mr-2" t={t.agent} />
          {/* Sound toggle */}
          <button
            type="button"
            class="ml-2 text-bone-muted hover:text-action transition-colors text-sm px-2 py-1"
            aria-label={isDronePlaying.value ? 'Mute ambient sound' : 'Enable ambient sound'}
            onClick$={toggleDrone}
          >
            {isDronePlaying.value ? '🔊' : '🔇'}
          </button>
        </nav>

        {/* Dynamic Niche Navigation (Auto-derived) */}
        <div class="px-4 md:px-8 py-2 border-b border-action/5 bg-void/50 backdrop-blur-sm sticky top-0 z-40">
          <NavTree
            navData={navSignal.value}
            niches={nichesSignal.value}
            currentLang={lang}
            currentNiche={nicheSignal.value}
            nicheSlugMap={nicheSlugMap}
          />
        </div>
      </div>

      {/* Main Content — sidebar banida (2-col Living Brief layout nos children) */}
      <div class="flex-1 flex flex-col min-w-0" data-analog-container>
        {/* M019: Edge data will be wired when homepage projection moves to layout-level routeLoader */}
        <AnalogConnector edges={[]} variant="glow" animated />
        <div class="site-main flex-1" id="main-content">
          <Slot />
        </div>

        <footer class="site-footer" data-testid="site-footer">
          <Footer />
        </footer>
      </div>
    </SiteShell>
  )
})
