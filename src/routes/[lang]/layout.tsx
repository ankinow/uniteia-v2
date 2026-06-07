import { Slot, component$ } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { getTranslation, useProvideI18n } from '~/i18n/context'
import { isValidLocale } from '~/i18n/locale-validation'
import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '~/i18n/types'
import { signalsIndex } from '~/routing/routes'

export const onRequest: RequestHandler = async ({ params, cookie, url, redirect }) => {
  const lang = params.lang
  if (!lang || !isValidLocale(lang)) {
    throw redirect(308, `/en${url.pathname}`)
  }
  if (cookie.get(LANGUAGE_COOKIE_NAME)?.value !== lang) {
    cookie.set(LANGUAGE_COOKIE_NAME, lang, {
      path: '/',
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    })
  }
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ params }) => {
  const lang = params.lang
  if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)) return lang as SupportedLanguage
  return 'en'
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
