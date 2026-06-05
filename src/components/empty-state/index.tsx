import { component$ } from '@builder.io/qwik'
import { UpsilonSigil } from '~/components/upsilon-sigil'

export interface EmptyStateProps {
  title?: string
  description?: string
}

/**
 * EmptyState — Light Minimal placeholder component
 *
 * Renders the brand mark UpsilonSigil in its watermark variant.
 */
export const EmptyState = component$<EmptyStateProps>(
  ({ title = 'No content found', description = 'Check back later or adjust your filters.' }) => {
    return (
      <div
        class="empty-state text-center py-16 px-6 flex flex-col items-center justify-center relative overflow-hidden"
        data-testid="empty-state"
      >
        <UpsilonSigil
          size={80}
          variant="watermark"
          animated={true}
          color="var(--color-bone-muted)"
          class="opacity-15 mb-4"
        />
        <h3 class="text-lg font-semibold text-bone mb-2">{title}</h3>
        <p class="text-sm text-bone-muted max-w-sm">{description}</p>
      </div>
    )
  }
)
