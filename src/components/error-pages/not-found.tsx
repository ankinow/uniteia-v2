import { component$ } from '@builder.io/qwik'
import { useI18n } from '~/i18n/context'

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
  return (
    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <ErrorContent />
    </main>
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
        class="error-title text-3xl md:text-4xl font-semibold mb-4 text-bone"
        data-testid="error-title"
      >
        {t.errorPages['404'].title}
      </h1>

      {/* Error message */}
      <p
        class="error-message text-lg md:text-xl text-bone-muted mb-8 leading-relaxed"
        data-testid="error-message"
      >
        {t.errorPages['404'].message}
      </p>

      {/* Navigation back to home */}
      <a
        href="/"
        class="error-home-link inline-flex items-center gap-2 px-6 py-3 bg-action text-void font-semibold rounded-lg hover:bg-action/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 focus-visible:ring-offset-void"
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
