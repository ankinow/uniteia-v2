import { component$ } from '@builder.io/qwik'
import { getLucideIconClass } from '~/utils/icon-classes'
import { getNicheSlug } from '~/utils/niche-loader'
import type { NicheCardProps, NicheCardSize } from './types'

const SIZE_STYLES: Record<NicheCardSize, { title: string; padding: string }> = {
  hero: {
    title: 'text-lg md:text-xl font-display font-semibold',
    padding: 'p-6',
  },
  medium: {
    title: 'text-sm md:text-base font-display font-semibold',
    padding: 'p-4',
  },
  compact: {
    title: 'text-xs md:text-sm font-display font-medium',
    padding: 'p-3',
  },
}

/**
 * NicheCard — Clickable card for a single niche topic
 *
 * Renders niche icon (Lucide via Tailwind iconify), localized title
 * and description, and links to the niche landing page.
 * Supports size variants: hero (large), medium (default), compact (tight).
 *
 * M011 S04: Organic Anti-Grid — size variants + warm easing + display font
 */
export const NicheCard = component$<NicheCardProps>(
  ({ niche, lang, class: classList, size = 'medium' }) => {
    const href = `/${lang}/signals/${getNicheSlug(niche, lang)}`
    const iconClass = getLucideIconClass(niche.icon)
    const styles = SIZE_STYLES[size]

    return (
      <a
        href={href}
        data-testid={`niche-card-${niche.slug}`}
        data-size={size}
        data-surface="niche-card"
        class={[
          'niche-card glassmorphism-2 group block relative overflow-hidden rounded-2xl',
          'transition-transform duration-300 hover:-translate-y-0.5',
          'hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]',
          'hover:border-white/20',
          styles.padding,
          size === 'hero' ? 'sm:col-span-2' : 'col-span-1',
          classList,
        ]}
      >
        {/* Grain overlay */}
        <div
          class="absolute inset-0 bg-[radial-gradient(#ffffff08_0.5px,transparent_1px)] bg-[length:3px_3px] opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        {/* grain-4k tactile overlay */}
        <div
          class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
          aria-hidden="true"
        />
        {/* UE5 glow edge on hover */}
        <div
          class="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-cyan)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          aria-hidden="true"
        />
        <div class="relative z-[var(--z-raised)] flex items-start gap-3">
          {iconClass && (
            <div
              class={[iconClass, size === 'compact' ? 'text-lg' : 'text-xl', 'text-cyan shrink-0']}
              aria-hidden="true"
            />
          )}
          <div class="min-w-0">
            <h2 class={['text-bone leading-tight break-words', styles.title]}>
              {niche.title[lang]}
            </h2>
            {size !== 'compact' && (
              <p class="text-bone-muted text-sm mt-1 leading-relaxed line-clamp-2">
                {niche.description[lang]}
              </p>
            )}
          </div>
        </div>
      </a>
    )
  }
)

export type { NicheCardProps, NicheCardSize } from './types'
