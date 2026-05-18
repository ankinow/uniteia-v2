import { component$ } from '@builder.io/qwik'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { DepthCard } from '~/components/depth-card'
import { DepthSection } from '~/components/depth-section'
import { DopamineCard } from '~/components/dopamine-card'
import { VisualDNAIntegrator } from '~/components/visual-dna-integrator'
import { useI18n } from '~/i18n/context'
import { nicheIndex } from '~/routing/routes'
import { getLucideIconClass } from '~/utils/icon-classes'
import { getNicheSlug } from '~/utils/niche-loader'
import type { NicheLandingProps } from './types'

/**
 * NicheLanding - Full landing page for a niche topic
 *
 * Renders:
 * - Niche header with Lucide icon, localized title and description (CinematicDepthCard hero variant)
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
        {/* Niche header — CinematicDepthCard with hero variant for 2.5D glass depth */}
        <DepthSection as="div" depth="front" class="mb-10">
          <CinematicDepthCard variant="hero" class="w-full">
            <div class="p-6 md:p-8">
              <div class="flex items-center gap-4 mb-4">
                {iconClass && <div class={iconClass} aria-hidden="true" />}
                <h1 class="text-3xl font-bold text-bone leading-tight font-display">
                  {niche.title[lang]}
                </h1>
              </div>
              <p class="text-bone-muted text-lg leading-relaxed max-w-2xl">
                {niche.description[lang]}
              </p>
            </div>
          </CinematicDepthCard>
        </DepthSection>

        {/* Article list area — VisualDNAIntegrator for editorial collage depth treatment */}
        <DepthSection
          depth="mid"
          class="mb-12 transition-all duration-300 ease-warm"
          aria-label={t.niche.topicsLabel}
        >
          <VisualDNAIntegrator variant="editorial-collage" class="w-full">
            <DepthCard depth="mid" class="p-6 md:p-8">
              <h2 class="text-xl font-semibold text-bone mb-4 font-display">
                {t.niche.articleCount.replace('{count}', localizedArticles.length.toString())}
              </h2>
              {localizedArticles.length > 0 ? (
                <div class="grid grid-cols-1 gap-4">
                  {localizedArticles.map(article => (
                    <DopamineCard
                      key={article.slug}
                      title={article.title}
                      description={article.summary ?? ''}
                      href={`/${lang}/signals/${niche.slugs[lang]}/${article.slug}`}
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
          </VisualDNAIntegrator>
        </DepthSection>

        {/* Related niches grid — using DopamineCard for richer engagement */}
        {otherNiches.length > 0 && (
          <DepthSection depth="back" aria-label={t.niche.allNiches}>
            <DepthCard depth="back" class="p-6 md:p-8">
              <h2 class="text-xl font-semibold text-bone mb-4 font-display">{t.niche.allNiches}</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherNiches.map(related => (
                  <DopamineCard
                    key={related.slug}
                    title={related.title[lang]}
                    description={related.description[lang]}
                    href={nicheIndex(lang, getNicheSlug(related, lang))}
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
