import { $, Slot, component$, useOnWindow, useSignal } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { NavTree } from '~/components/nav-tree'
import { SidebarScrollGlow } from '~/components/scroll-driven'
import { Sidebar } from '~/components/sidebar'
import { SiteShell } from '~/components/site-shell'
import { getPublicNavigation } from '~/content-graph/projections'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { signalsIndex } from '~/routing/routes'
import type { NichesConfig } from '~/types/niche'
import { type NavigationData, deriveNavigation } from '~/utils/content-loader'
import { getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'

export const onRequest: RequestHandler = async event => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  await onLanguageNegotiation(event)

  // Set security headers
  event.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  event.headers.set('X-Frame-Options', 'DENY')
  event.headers.set('X-Content-Type-Options', 'nosniff')
  event.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  event.headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  )
  event.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  )
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

export const useSidebarNavigation = routeLoader$(async ({ headers }) => {
  const lang = (headers.get('x-negotiated-lang') as SupportedLanguage) ?? DEFAULT_LANGUAGE
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const niches = await loadNichesConfig()
  return getPublicNavigation(contentGraphProvider, niches, lang)
})

export default component$(() => {
  const langSignal = useLanguage()
  const nichesSignal = useNiches()
  const nicheSignal = useNiche()
  const navSignal = useNavigation()
  const sidebarNavSignal = useSidebarNavigation()
  const lang = langSignal.value
  const topicsOpen = useSignal(false)

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
          <a href={signalsIndex(lang)} class="text-bone-muted hover:text-bone transition-colors">
            {t.nav.topics}
          </a>
          <LangSwitcher />
        </nav>

        {/* Dynamic Niche Navigation (Auto-derived) */}
        <div class="px-4 md:px-8 py-2 border-b border-action/5 bg-void/50 backdrop-blur-sm sticky top-0 z-40">
          <NavTree
            navData={navSignal.value}
            currentLang={lang}
            currentNiche={nicheSignal.value}
            nicheSlugMap={nicheSlugMap}
          />
        </div>
      </div>

      {/* Layout de duas colunas */}
      <div class="flex min-h-screen">
        {/* Sidebar - JRPG Style (apenas desktop) */}
        <aside class="hidden md:block w-64 flex-shrink-0">
          <SidebarScrollGlow>
            <Sidebar navigationItems={sidebarNavSignal.value} />
          </SidebarScrollGlow>
        </aside>

        {/* Main Content */}
        <div class="flex-1 flex flex-col min-w-0">
          <div class="site-main flex-1">
            <Slot />
          </div>

          <footer class="site-footer" data-testid="site-footer">
            <Footer />
          </footer>
        </div>
      </div>
    </SiteShell>
  )
})
