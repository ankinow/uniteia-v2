import { component$ } from '@builder.io/qwik'
import { UpsilonSigil } from '~/components/upsilon-sigil'
import { useI18n } from '~/i18n/context'
import { signalsIndex } from '~/routing/routes'

/**
 * 404 Not Found Error Page Component
 *
 * Light Minimal UI (Vercel/BMC aesthetics):
 * - Clean white background card with rounded corners and light gray border
 * - Watermark Upsilon Sigil
 * - 'Return to Apex' CTA pill button (#0070f3)
 * - Multilingual support (en/pt/es/fr/de/it/ja/zh)
 */
export const NotFound = component$(() => {
  return (
    <main class="flex-1 flex items-center justify-center px-4 py-24 bg-[#FAFAFA]">
      <ErrorContent />
    </main>
  )
})

const ErrorContent = component$(() => {
  const { lang, t } = useI18n()
  return (
    <div
      class="surface-panel bg-[#FFFFFF] border border-[#EAEAEA] rounded-2xl p-10 max-w-md w-full mx-auto text-center shadow-sm relative overflow-hidden flex flex-col items-center justify-center"
      data-testid="error-content"
    >
      {/* Background Watermark Upsilon Sigil */}
      <div class="absolute -right-8 -bottom-8 pointer-events-none opacity-[0.03] rotate-12">
        <UpsilonSigil size={192} variant="watermark" animated={true} color="var(--color-bone)" />
      </div>

      {/* Large 404 text */}
      <div class="text-7xl font-bold tracking-tight text-[#0070f3] mb-6" data-testid="error-code">
        404
      </div>

      {/* Error title */}
      <h1 class="text-2xl font-bold text-[#171717] mb-3 tracking-tight" data-testid="error-title">
        {t.errorPages['404'].title}
      </h1>

      {/* Error message */}
      <p class="text-sm text-[#666666] mb-8 leading-relaxed max-w-xs" data-testid="error-message">
        {t.errorPages['404'].message}
      </p>

      {/* Return to Apex CTA (BMC pill style) */}
      <a
        href={signalsIndex(lang.value)}
        class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0070f3] hover:bg-[#0070f3]/90 text-white font-medium rounded-full shadow-sm hover:shadow active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 z-10"
        data-testid="error-home-link"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t.errorPages['404'].backHome}
      </a>
    </div>
  )
})
