import { component$ } from '@builder.io/qwik'
import type { NicheCardProps } from './types'

/**
 * NicheCard - Clickable card for a single niche topic
 *
 * Renders niche icon (Lucide via UnoCSS preset-icons), localized title
 * and description, and links to the niche landing page.
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const NicheCard = component$<NicheCardProps>(({ niche, lang, class: classList }) => {
  const href = `/${lang}/n/${niche.slug}`

  return (
    <a
      href={href}
      data-testid={`niche-card-${niche.slug}`}
      class={[
        'niche-card',
        'block',
        'border border-brand-primary/20',
        'hover:border-brand-primary',
        'bg-void/raised',
        'rounded-lg',
        'p-4',
        'transition',
        'duration-200',
        classList,
      ]}
    >
      <div class="flex items-start gap-3">
        <div
          class={`i-lucide-${niche.icon} text-brand-primary text-2xl shrink-0`}
          aria-hidden="true"
        />
        <div class="min-w-0">
          <h3 class="text-bone-primary font-semibold text-base leading-tight">
            {niche.title[lang]}
          </h3>
          <p class="text-bone-muted text-sm mt-1 leading-relaxed">{niche.description[lang]}</p>
        </div>
      </div>
    </a>
  )
})

export type { NicheCardProps } from './types'
