import { Slot, component$ } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Breadcrumb } from '~/components/breadcrumb'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { signalsIndex } from '~/routing/routes'

export const onRequest: RequestHandler = async event => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  await onLanguageNegotiation(event)
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ headers }) => {
  const lang = headers.get('x-negotiated-lang')
  if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)) return lang as SupportedLanguage
  return DEFAULT_LANGUAGE
})

export default component$(() => {
  const langSignal = useLanguage()
  const lang = langSignal.value
  useProvideI18n(lang)
  const t = getTranslation(lang)

  return (
    <SiteShell>
      {/* Header — clean, minimal */}
      <div q:slot="header" class="w-full bg-void/90 backdrop-blur-sm border-b border-white/5">
        <nav
          aria-label="Primary navigation"
          class="flex items-center justify-between px-4 md:px-8 py-3"
          data-testid="main-nav"
        >
          <a
            href={signalsIndex(lang)}
            class="text-bone/70 hover:text-bone transition-colors text-sm font-medium"
          >
            {t.nav.topics}
          </a>
          <LangSwitcher />
        </nav>

        {/* Breadcrumb sub-bar */}
        <div class="px-4 md:px-8 py-1.5 border-t border-white/5 bg-deep/50">
          <Breadcrumb />
        </div>
      </div>

      {/* Main Content */}
      <div class="flex-1 flex flex-col min-w-0">
        <div class="site-main flex-1" id="main-content">
          <Slot />
        </div>
      </div>

      {/* Footer */}
      <div q:slot="footer">
        <Footer />
      </div>
    </SiteShell>
  )
})
