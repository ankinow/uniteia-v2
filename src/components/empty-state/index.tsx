import { component$ } from '@builder.io/qwik'
import { UpsilonSigil } from '~/components/upsilon-sigil'

export interface EmptyStateProps {
  title?: string
  description?: string
  /** CTA button text — renders a link button if provided with ctaHref */
  ctaText?: string
  /** CTA button destination */
  ctaHref?: string
  /** Related topic suggestions rendered below the message */
  relatedTopics?: Array<{ label: string; href: string }>
  /** Optional custom illustration slot — pass an <img> or SVG */
  illustration?: string
  /** Visual variant: 'default' (brand sigil) or 'craft' (mascot-friendly) */
  variant?: 'default' | 'craft'
}

/**
 * EmptyState — Adaptive placeholder for hubs with zero articles,
 * empty search results, or any content-desert page.
 *
 * Variants:
 * - 'default': brand UpsilonSigil watermark (current behavior)
 * - 'craft': larger padding, dashed border, post-it accent, suitable for mascot illustrations
 */
export const EmptyState = component$<EmptyStateProps>(
  ({
    title = 'No content found',
    description = 'Check back later or adjust your filters.',
    ctaText,
    ctaHref,
    relatedTopics,
    illustration,
    variant = 'default',
  }) => {
    const isCraft = variant === 'craft'

    return (
      <div
        class={[
          'empty-state text-center flex flex-col items-center justify-center relative overflow-hidden',
          isCraft ? 'craft-empty-state' : 'py-16 px-6',
        ]}
        data-testid="empty-state"
        data-variant={variant}
      >
        {/* Illustration slot or default sigil */}
        {illustration ? (
          <img
            src={illustration}
            alt=""
            class={
              isCraft
                ? 'w-48 h-48 object-contain mb-6 opacity-70'
                : 'w-40 h-40 object-contain mb-4 opacity-40'
            }
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <UpsilonSigil
            size={isCraft ? 64 : 80}
            variant="watermark"
            animated={true}
            color="var(--color-bone-muted)"
            class={isCraft ? 'opacity-10 mb-6' : 'opacity-15 mb-4'}
          />
        )}

        <h3 class={['font-display font-semibold mb-2', isCraft ? 'text-xl' : 'text-lg']}>
          {title}
        </h3>
        <p class={['text-bone-muted max-w-sm', isCraft ? 'text-base mb-6' : 'text-sm']}>
          {description}
        </p>

        {/* CTA button */}
        {ctaText && ctaHref && (
          <a
            href={ctaHref}
            class={[
              'inline-flex items-center gap-2 font-medium transition-[color,transform] duration-200 active:scale-[0.96]',
              isCraft
                ? 'px-6 py-2.5 rounded-full bg-[var(--color-accent)] text-[var(--color-void)] hover:bg-[var(--color-accent-hi)] kawaii-glow text-sm'
                : 'btn btn-primary text-sm',
            ]}
          >
            {ctaText}
            <span aria-hidden="true">→</span>
          </a>
        )}

        {/* Related topics */}
        {relatedTopics && relatedTopics.length > 0 && (
          <div class={isCraft ? 'mt-8' : 'mt-6'}>
            <p class="text-xs text-bone-muted mb-3 uppercase tracking-wider">
              Explore related topics
            </p>
            <div class="flex flex-wrap gap-2 justify-center">
              {relatedTopics.map(topic => (
                <a
                  key={topic.href}
                  href={topic.href}
                  class="text-xs px-3 py-1.5 rounded-full border border-[var(--color-accent)]/20 text-[var(--color-bone-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors duration-150"
                >
                  {topic.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)
