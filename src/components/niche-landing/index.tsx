import { component$ } from '@builder.io/qwik'
import { NicheCard } from '~/components/niche-card'
import { useI18n } from '~/i18n/context'
import type { NicheLandingProps } from './types'

/**
 * NicheLanding - Full landing page for a niche topic
 *
 * Renders:
 * - Niche header with Lucide icon, localized title and description
 * - Placeholder article list area
 * - Grid of related niche cards (NicheCard components)
 *
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const NicheLanding = component$<NicheLandingProps>(
  ({ niche, otherNiches, lang, class: classList }) => {
    const { t } = useI18n()

    return (
      <div
        data-testid={`niche-landing-${niche.slug}`}
        class={['max-w-4xl mx-auto px-4 py-8', classList]}
      >
        {/* Niche header */}
        <header class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            <div
              class={`i-lucide-${niche.icon} text-brand-primary text-4xl shrink-0`}
              aria-hidden="true"
            />
            <h1 class="text-3xl font-bold text-bone-primary leading-tight">{niche.title[lang]}</h1>
          </div>
          <p class="text-bone-muted text-lg leading-relaxed max-w-2xl">{niche.description[lang]}</p>
        </header>

        {/* Placeholder article list area */}
        <section class="mb-12" aria-label={t.niche.topicsLabel}>
          <h2 class="text-xl font-semibold text-bone-primary mb-4">
            {t.niche.articleCount.replace('{count}', '0')}
          </h2>
          <div
            class="border border-dashed border-brand-primary/20 rounded-lg p-8 text-center text-bone-muted"
            data-testid="niche-articles-placeholder"
          >
            <p>{t.niche.exploreNiche.replace('{niche}', niche.title[lang])}</p>
          </div>
        </section>

        {/* Related niches grid */}
        {otherNiches.length > 0 && (
          <section aria-label={t.niche.allNiches}>
            <h2 class="text-xl font-semibold text-bone-primary mb-4">{t.niche.allNiches}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherNiches.map(related => (
                <NicheCard key={related.slug} niche={related} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }
)

export type { NicheLandingProps } from './types'
