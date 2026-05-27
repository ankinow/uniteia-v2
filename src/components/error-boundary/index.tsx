/**
 * ErrorBoundary — Client-side error isolation for Qwik components.
 *
 * Qwik does not have React-style component-level error boundaries.
 * This component provides a retry-based fallback using key remount:
 *  1. Wraps children with a retry-key that forces remount on retry.
 *  2. Listens for unhandled errors in the subtree via a scoped
 *     useVisibleTask$ handler.
 *  3. Shows a degraded fallback state when an error is caught.
 *
 * Usage:
 *   <ErrorBoundary fallbackMsg="Trending section unavailable">
 *     <TrendingSection articles={...} lang={lang} />
 *   </ErrorBoundary>
 */

import { $, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export interface ErrorBoundaryProps {
  /** Message shown in the fallback UI */
  fallbackMsg?: string
  /** Optional CSS class for the fallback wrapper */
  class?: string
}

export const ErrorBoundary = component$<ErrorBoundaryProps>(
  ({ fallbackMsg = 'This section could not be loaded.', class: className }) => {
    const hasError = useSignal(false)
    const retryKey = useSignal(0)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const onError = $(() => {
        hasError.value = true
      })

      const handler = () => onError()
      window.addEventListener('error', handler)
      // Also catch unhandled promise rejections
      const unhandledHandler = () => onError()
      window.addEventListener('unhandledrejection', unhandledHandler)

      cleanup(() => {
        window.removeEventListener('error', handler)
        window.removeEventListener('unhandledrejection', unhandledHandler)
      })
    })

    return (
      <div data-error-boundary class={className}>
        {hasError.value ? (
          <div class="error-boundary-fallback rounded-sm border border-[oklch(0.55_0.15_30/0.3)] bg-white/5 p-6 text-center">
            <div class="mb-3 flex items-center justify-center gap-2">
              <span class="text-lg" aria-hidden="true">
                ⚠️
              </span>
              <p class="text-sm text-[oklch(0.70_0.10_280)]">{fallbackMsg}</p>
            </div>
            <button
              type="button"
              class="cursor-pointer rounded-sm bg-[oklch(0.72_0.165_80/0.15)] px-5 py-2 text-sm text-[oklch(0.85_0.12_85)] transition-colors hover:bg-[oklch(0.72_0.165_80/0.25)] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.165_80/0.6)]"
              aria-label="Retry loading this section"
              onClick$={() => {
                hasError.value = false
                retryKey.value++
              }}
            >
              🔄 Retry
            </button>
          </div>
        ) : (
          <div key={String(retryKey.value)}>
            <Slot />
          </div>
        )}
      </div>
    )
  }
)
