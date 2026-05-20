import { Slot, component$, useErrorBoundary } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'

export interface ErrorBoundaryProps {
  label?: string
}

export const ErrorBoundary = component$<ErrorBoundaryProps>(({ label }) => {
  const store = useErrorBoundary()

  return (
    <>
      {store.error ? (
        <div class="border border-dashed border-coral/40 rounded-lg p-6 text-center" role="alert">
          {label && <HudLabel label={label} tone="muted" />}
          <p class="text-bone-muted text-sm mt-2">This section encountered an error.</p>
          <button
            type="button"
            onClick$={() => {
              store.error = undefined
            }}
            class="mt-3 text-xs text-coral hover:text-coral/80 underline underline-offset-2 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <Slot />
      )}
    </>
  )
})
