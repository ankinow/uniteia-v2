import { component$ } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE_NAME, type SupportedLanguage } from '~/i18n/types'

export const onRequest: RequestHandler = async ({ cookie, url, request, headers }) => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  return onLanguageNegotiation({ cookie, url, request, headers })
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ cookie, url }) => {
  const cookieLang = cookie.get(LANGUAGE_COOKIE_NAME)?.value
  if (cookieLang && ['en', 'pt', 'es', 'ja', 'zh'].includes(cookieLang))
    return cookieLang as SupportedLanguage
  const urlLang = url.searchParams.get('lang')
  if (urlLang && ['en', 'pt', 'es', 'ja', 'zh'].includes(urlLang))
    return urlLang as SupportedLanguage
  return DEFAULT_LANGUAGE
})

export default component$(() => {
  const langSignal = useLanguage()
  useProvideI18n(langSignal.value)

  return (
    <SiteShell>
      <header q:slot="header" class="site-header w-full">
        <nav
          class="nav flex items-center justify-between px-4 md:px-8 py-4 border-b border-brand-primary/10"
          data-testid="main-nav"
        >
          <a
            href="/"
            class="brand flex items-center gap-2 text-xl font-bold text-bone-primary hover:text-brand-primary transition-colors"
            data-testid="nav-logo"
          >
            <span class="text-brand-primary">Uni</span>
            <span>Teia</span>
          </a>
          <div class="nav-links hidden md:flex items-center gap-6">
            <a href="/" class="text-bone-secondary hover:text-bone-primary transition-colors">
              Home
            </a>
            <a href="/about" class="text-bone-secondary hover:text-bone-primary transition-colors">
              About
            </a>
            <a
              href="/projects"
              class="text-bone-secondary hover:text-bone-primary transition-colors"
            >
              Projects
            </a>
            <a href="/blog" class="text-bone-secondary hover:text-bone-primary transition-colors">
              Blog
            </a>
          </div>
          <LangSwitcher />
        </nav>
      </header>
      <Footer q:slot="footer" />
    </SiteShell>
  )
})
