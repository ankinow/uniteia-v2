import { $, Slot, component$ } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$, useNavigate } from '@builder.io/qwik-city'
import { BUILD_LOCALE } from '~/build-locale'
import { CopyCode } from '~/components/copy-code'
import { Footer } from '~/components/footer'
import { SearchInput } from '~/components/search-input'
import { SiteShell } from '~/components/site-shell'
import { ThemeToggle } from '~/components/theme-toggle'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

export const onRequest: RequestHandler = async ({ cookie }) => {
  // In single-locale architecture, we don't negotiate locale from URL.
  // We still set the language cookie for consistency with downstream components.
  const lang = BUILD_LOCALE as SupportedLanguage
  const LANGUAGE_COOKIE_NAME = 'uniteia_lang'
  if (cookie.get(LANGUAGE_COOKIE_NAME)?.value !== lang) {
    cookie.set(LANGUAGE_COOKIE_NAME, lang, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    })
  }
}

export const useLanguage = routeLoader$<SupportedLanguage>(() => {
  return BUILD_LOCALE as SupportedLanguage
})

export default component$(() => {
  const langSignal = useLanguage()
  const lang = langSignal.value
  useProvideI18n(lang)
  const t = getTranslation(lang)
  const nav = useNavigate()

  const handleSearch = $((query: string) => {
    if (query.trim()) {
      nav(`/search?q=${encodeURIComponent(query)}`)
    }
  })

  return (
    <SiteShell>
      <CopyCode />
      {/* Header */}
      <div
        q:slot="header"
        class="w-full bg-void/90 backdrop-blur-sm border-b border-white/5 relative z-[var(--z-overlay)]"
      >
        <nav
          aria-label="Primary navigation"
          class="flex items-center justify-between gap-4 px-4 md:px-8 py-3"
          data-testid="main-nav"
        >
          <div class="flex items-center gap-6">
            <a
              href="/signals"
              class="text-bone/70 hover:text-bone transition-colors text-sm font-medium whitespace-nowrap"
            >
              {t.nav.topics}
            </a>
            <div class="hidden md:block">
              <SearchInput onSearch$={handleSearch} class="max-w-[280px]" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <ThemeToggle />
            {/* LangSwitcher removed — single locale builds */}
            <span class="text-bone/40 text-xs font-mono uppercase tracking-widest">{lang}</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <Slot />

      {/* Footer */}
      <div q:slot="footer">
        <Footer />
      </div>
    </SiteShell>
  )
})
