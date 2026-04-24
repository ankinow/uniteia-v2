import { component$ } from '@builder.io/qwik'
import { Footer } from '~/components/footer'
import { LangSwitcher } from '~/components/lang-switcher'
import { SiteShell } from '~/components/site-shell'
import { useI18n, useProvideI18n } from '~/i18n/context'
import { DEFAULT_LANGUAGE } from '~/i18n/types'

/**
 * 404 Not Found Error Page Component
 *
 * Follows JRPG-brutalist aesthetic:
 * - Minimal animation (respects prefers-reduced-motion)
 * - SolarLanso dark-first color palette
 * - Clear error message with navigation back to home
 * - Multilingual support (en/pt/es/ja/zh)
 */
export const NotFound = component$(() => {
  useProvideI18n(DEFAULT_LANGUAGE)
  return (
    <SiteShell>
      <div q:slot="header" class="w-full">
        <nav
          class="nav flex items-center justify-between px-4 md:px-8 py-4 border-b border-action/10"
          data-testid="main-nav"
        >
          <a
            href="/"
            class="brand flex items-center gap-2 text-xl font-bold text-bone-primary hover:text-action transition-colors"
            data-testid="nav-logo"
          >
            <span class="text-action">Uni</span>
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
      </div>
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
      {/* Large 404 number */}
      <div class="error-code text-8xl md:text-9xl font-bold mb-8" data-testid="error-code">
        <span class="text-action">404</span>
      </div>

      {/* Error title */}
      <h1
        class="error-title text-3xl md:text-4xl font-semibold mb-4 text-bone-primary"
        data-testid="error-title"
      >
        {t.errorPages['404'].title}
      </h1>

      {/* Error message */}
      <p
        class="error-message text-lg md:text-xl text-bone-secondary mb-8 leading-relaxed"
        data-testid="error-message"
      >
        {t.errorPages['404'].message}
      </p>

      {/* Navigation back to home */}
      <a
        href="/"
        class="error-home-link inline-flex items-center gap-2 px-6 py-3 bg-action text-void font-semibold rounded-lg hover:bg-action/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-2 focus:ring-offset-void"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t.errorPages['404'].backHome}
      </a>

      {/* Decorative element - JRPG brutalist aesthetic */}
      <div class="mt-16 flex items-center justify-center gap-4 opacity-30">
        <div class="w-16 h-px bg-action" />
        <div class="w-3 h-3 border-2 border-action" />
        <div class="w-16 h-px bg-action" />
      </div>
    </div>
  )
})
