import { component$ } from '@builder.io/qwik'
import { DepthCard } from '~/components/depth-card'
import { DepthSection } from '~/components/depth-section'
import { DopamineCard } from '~/components/dopamine-card'
import { useI18n } from '~/i18n/context'
import { getLucideIconClass } from '~/utils/icon-classes'
import { getNicheSlug } from '~/utils/niche-loader'
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
  ({ niche, otherNiches, articles, lang, class: classList }) => {
    const { t } = useI18n()
    const iconClass = getLucideIconClass(niche.icon)

    // Filter articles for current lang
    const localizedArticles = articles.filter(a => a.lang === lang)

    return (
      <div
        data-testid={`niche-landing-${niche.slug}`}
        class={['max-w-4xl mx-auto px-4 py-8 grid-signal', classList]}
      >
        {/* Niche header */}
        <DepthSection as="div" depth="front" class="mb-10">
          <DepthCard depth="front" class="p-6 md:p-8 glass">
            <div class="flex items-center gap-4 mb-4">
              {iconClass && <div class={iconClass} aria-hidden="true" />}
              <h1 class="text-3xl font-bold text-bone leading-tight">{niche.title[lang]}</h1>
            </div>
            <p class="text-bone-muted text-lg leading-relaxed max-w-2xl">
              {niche.description[lang]}
            </p>
          </DepthCard>
        </DepthSection>

        {/* Article list area */}
        <DepthSection depth="mid" class="mb-12" aria-label={t.niche.topicsLabel}>
          <DepthCard depth="mid" class="p-6 md:p-8">
            <h2 class="text-xl font-semibold text-bone mb-4">
              {t.niche.articleCount.replace('{count}', localizedArticles.length.toString())}
            </h2>
            {localizedArticles.length > 0 ? (
              <div class="grid grid-cols-1 gap-4">
                {localizedArticles.map(article => (
                  <DopamineCard
                    key={article.slug}
                    title={article.title}
                    description={article.summary ?? ''}
                    href={`/${lang}/n/${niche.slugs[lang]}/${article.slug}`}
                    score={article.qualityScore ?? 0}
                    verdict={article.verdict as 'trusted' | 'caution' | 'flagged'}
                    lang={lang}
                    data-testid="article-card"
                  />
                ))}
              </div>
            ) : (
              <div
                class="border border-dashed border-action/20 rounded-lg p-8 text-center text-bone-muted"
                data-testid="niche-articles-placeholder"
              >
                <p>{t.niche.exploreNiche.replace('{niche}', niche.title[lang])}</p>
              </div>
            )}
          </DepthCard>
        </DepthSection>

        {/* Related niches grid — using DopamineCard for richer engagement */}
        {otherNiches.length > 0 && (
          <DepthSection depth="back" aria-label={t.niche.allNiches}>
            <DepthCard depth="back" class="p-6 md:p-8">
              <h2 class="text-xl font-semibold text-bone mb-4">{t.niche.allNiches}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherNiches.map(related => (
                  <DopamineCard
                    key={related.slug}
                    title={related.title[lang]}
                    description={related.description[lang]}
                    href={`/${lang}/n/${getNicheSlug(related, lang)}`}
                    icon={related.icon}
                    lang={lang}
                  />
                ))}
              </div>
            </DepthCard>
          </DepthSection>
        )}
      </div>
    )
  }
)

export type { NicheLandingProps } from './types'
