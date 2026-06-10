import { Slot, component$ } from '@builder.io/qwik'

export type BauhausMood = 'blackout' | 'voltage' | 'signal'

export interface BauhausSectionProps {
  mood?: BauhausMood
  as?: 'section' | 'div' | 'header'
  class?: string
}

/**
 * BauhausSection — A bold, geometric container for high-impact content.
 * Implements section-level color choreography and bold typography defaults.
 */
export const BauhausSection = component$<BauhausSectionProps>(
  ({ mood = 'blackout', as: Tag = 'section', class: className = '' }) => {
    const moodClass = {
      blackout: 'section-blackout',
      voltage: 'section-voltage',
      signal: 'section-signal',
    }[mood]

    return (
      <Tag
        class={`bauhaus-section relative overflow-hidden py-24 px-6 md:px-12 ${moodClass} ${className}`}
      >
        {/* Background geometric accent (optional based on mood) */}
        {mood === 'blackout' && (
          <div
            class="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-12deg] translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          />
        )}

        <div class="max-w-7xl mx-auto relative z-10">
          <Slot />
        </div>
      </Tag>
    )
  }
)

/**
 * BauhausGrid — A disciplined geometric grid for cards and content.
 */
export const BauhausGrid = component$<{ columns?: number; class?: string }>(
  ({ columns = 3, class: className = '' }) => {
    const gridCols =
      {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      }[columns as 1 | 2 | 3 | 4] || 'grid-cols-1 md:grid-cols-3'

    return (
      <div
        class={`grid ${gridCols} gap-px bg-[var(--color-border)] border border-[var(--color-border)] ${className}`}
      >
        <Slot />
      </div>
    )
  }
)

/**
 * BauhausCard — A sharp, geometric tile for the BauhausGrid.
 */
export const BauhausCard = component$<{ class?: string; href?: string }>(
  ({ class: className = '', href }) => {
    const isLink = !!href
    const Tag = isLink ? 'a' : 'div'

    return (
      <Tag
        {...(isLink ? { href } : {})}
        class={`bauhaus-card group relative p-8 bg-[var(--color-bg-primary)] hover:bg-[var(--color-accent)] transition-colors duration-400 ease-out ${className}`}
      >
        <Slot />
        {/* Visual indicator for interactive cards */}
        {href && (
          <div class="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
            <span class="text-xl">→</span>
          </div>
        )}
      </Tag>
    )
  }
)
