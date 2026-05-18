import { component$ } from '@builder.io/qwik'
import { getLucideIconClass } from '~/utils/icon-classes'
import { getNicheSlug } from '~/utils/niche-loader'
import type { NicheCardProps, NicheCardSize } from './types'

const SIZE_STYLES: Record<
  NicheCardSize,
  { wrapper: string; title: string; padding: string; glass: boolean }
> = {
  hero: {
    wrapper: 'col-span-2',
    title: 'text-xl font-display font-semibold',
    padding: 'p-6',
    glass: true,
  },
  medium: {
    wrapper: 'col-span-1',
    title: 'text-base font-display font-semibold',
    padding: 'p-4',
    glass: false,
  },
  compact: {
    wrapper: 'col-span-1',
    title: 'text-sm font-display font-medium',
    padding: 'p-3',
    glass: false,
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
        class={[
          'niche-card block border border-action/20 hover:border-action transition-all duration-300 ease-warm bg-void/raised',
          styles.padding,
          size === 'hero' ? 'glass-heavy sm:col-span-2' : 'col-span-1',
          classList,
        ]}
      >
        <div class="flex items-start gap-3">
          {iconClass && (
            <div
              class={[iconClass, size === 'compact' ? 'text-lg' : 'text-xl']}
              aria-hidden="true"
            />
          )}
          <div class="min-w-0">
            <h2 class={['text-bone leading-tight', styles.title]}>{niche.title[lang]}</h2>
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
