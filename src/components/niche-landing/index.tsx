import { component$ } from '@builder.io/qwik'
import { DopamineCard } from '~/components/dopamine-card'
import { useI18n } from '~/i18n/context'
import { getLucideIconClass } from '~/utils/icon-classes'
import type { NicheLandingProps } from './types'

/**
 * NicheLanding - Full landing page for a niche topic
 *
 * Renders:
 * - Niche header with Lucide icon, localized title and description
 * - Placeholder article list area
 * - Grid of related niche cards (using DopamineCard for engagement)
 *
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const NicheLanding = component$<NicheLandingProps>(
  ({ niche, otherNiches, lang, class: classList }) => {
    const { t } = useI18n()
    const iconClass = getLucideIconClass(niche.icon)

    return (
      <div
        data-testid={`niche-landing-${niche.slug}`}
        class={['max-w-4xl mx-auto px-4 py-8', classList]}
      >
        {/* Niche header */}
        <header class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            {iconClass && <div class={iconClass} aria-hidden="true" />}
            <h1 class="text-3xl font-bold text-bone leading-tight">{niche.title[lang]}</h1>
          </div>
          <p class="text-bone-muted text-lg leading-relaxed max-w-2xl">{niche.description[lang]}</p>
        </header>

        {/* Placeholder article list area */}
        <section class="mb-12" aria-label={t.niche.topicsLabel}>
          <h2 class="text-xl font-semibold text-bone mb-4">
            {t.niche.articleCount.replace('{count}', '0')}
          </h2>
          <div
            class="border border-dashed border-action/20 rounded-lg p-8 text-center text-bone-muted"
            data-testid="niche-articles-placeholder"
          >
            <p>{t.niche.exploreNiche.replace('{niche}', niche.title[lang])}</p>
          </div>
        </section>

        {/* Related niches grid — using DopamineCard for richer engagement */}
        {otherNiches.length > 0 && (
          <section aria-label={t.niche.allNiches}>
            <h2 class="text-xl font-semibold text-bone mb-4">{t.niche.allNiches}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherNiches.map(related => (
                <DopamineCard
                  key={related.slug}
                  title={related.title[lang]}
                  description={related.description[lang]}
                  href={`/${lang}/n/${related.slug}`}
                  icon={related.icon}
                  lang={lang}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }
)

export type { NicheLandingProps } from './types'
