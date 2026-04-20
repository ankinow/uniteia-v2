import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { useI18n, useProvideI18n } from '~/i18n/context'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { DEFAULT_LANGUAGE } from '~/i18n/types'

/**
 * Middleware: Language negotiation for 500 page
 * Runs on every request to determine user's preferred language
 */
export const onRequest = onLanguageNegotiation

/**
 * 500 Internal Server Error Page
 *
 * Follows JRPG-brutalist aesthetic:
 * - Minimal animation (respects prefers-reduced-motion)
 * - SolarLanso dark-first color palette
 * - Clear error message with retry and navigation options
 * - Multilingual support (en/pt/es/ja/zh)
 */
export default component$(() => {
  // Note: For error pages, we use the default language as fallback
  useProvideI18n(DEFAULT_LANGUAGE)

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

      <main class="flex-1 flex items-center justify-center px-4 py-16">
        <ErrorContent />
      </main>

      <Footer q:slot="footer" />
    </SiteShell>
  )
})

/**
 * Error content component with i18n support
 */
const ErrorContent = component$(() => {
  const { t } = useI18n()

  return (
    <div class="error-content text-center max-w-2xl mx-auto">
      {/* Large 500 number */}
      <div class="error-code text-8xl md:text-9xl font-bold mb-8" data-testid="error-code">
        <span class="text-brand-primary">500</span>
      </div>

      {/* Error title */}
      <h1
        class="error-title text-3xl md:text-4xl font-semibold mb-4 text-bone-primary"
        data-testid="error-title"
      >
        {t.errorPages['500'].title}
      </h1>

      {/* Error message */}
      <p
        class="error-message text-lg md:text-xl text-bone-secondary mb-8 leading-relaxed"
        data-testid="error-message"
      >
        {t.errorPages['500'].message}
      </p>

      {/* Retry and Home navigation */}
      <div class="error-actions flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Retry button - reloads the current page */}
        <button
          onClick$={() => window.location.reload()}
          class="retry-button inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-void font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-void"
          data-testid="error-retry-button"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {t.errorPages['500'].retry}
        </button>

        {/* Home link */}
        <a
          href="/"
          class="home-link inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-brand-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-void"
          data-testid="error-home-link"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {t.errorPages['404'].backHome}
        </a>
      </div>

      {/* Decorative element - JRPG brutalist aesthetic */}
      <div class="mt-16 flex items-center justify-center gap-4 opacity-30">
        <div class="w-16 h-px bg-brand-primary" />
        <div class="w-3 h-3 border-2 border-brand-primary" />
        <div class="w-16 h-px bg-brand-primary" />
      </div>
    </div>
  )
})

/**
 * Document head metadata for 500 page
 */
export const head: DocumentHead = {
  title: '500 - Server Error | UniTeia',
  meta: [
    {
      name: 'description',
      content: 'An internal server error occurred. Please try again later.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
}
