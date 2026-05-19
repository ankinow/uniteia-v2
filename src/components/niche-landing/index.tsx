import { component$ } from '@builder.io/qwik'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { DepthSection } from '~/components/depth-section'
import { DopamineCard } from '~/components/dopamine-card'
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
        class={['max-w-4xl mx-auto px-4 py-8 space-y-10', classList]}
      >
        {/* Niche header — CinematicDepthCard with hero variant for 2.5D glass depth */}
        <DepthSection as="div" depth="front" class="mb-2">
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

        {/* Article list — canvas-light + grain + ue5-illusion (mixed UI: light content) */}
        <section class="canvas-light ue5-illusion glassmorphism-2 relative overflow-hidden rounded-3xl p-6 md:p-8 grain-4k">
          <div class="paper-fiber" />
          <div class="relative z-[var(--z-raised)]">
            <h2 class="text-2xl font-display tracking-[-1px] text-paper-text mb-6">
              {t.niche.articleCount.replace('{count}', localizedArticles.length.toString())}
            </h2>
            {localizedArticles.length > 0 ? (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localizedArticles.map((article, i) => (
                  <DopamineCard
                    class={i === 0 ? 'md:col-span-2' : ''}
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
                class="border border-dashed border-paper-border rounded-lg p-8 text-center text-paper-text/60"
                data-testid="niche-articles-placeholder"
              >
                <p>{t.niche.exploreNiche.replace('{niche}', niche.title[lang])}</p>
              </div>
            )}
          </div>
        </section>

        {/* Related niches — canvas-light + grain (mixed UI continuity) */}
        {otherNiches.length > 0 && (
          <section
            class="canvas-light ue5-illusion glassmorphism-2 relative overflow-hidden rounded-3xl p-6 md:p-8 grain-4k"
            aria-label={t.niche.allNiches}
          >
            <div class="paper-fiber" />
            <div class="relative z-[var(--z-raised)]">
              <h2 class="text-2xl font-display tracking-[-1px] text-paper-text mb-6">
                {t.niche.allNiches}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          </section>
        )}
      </div>
    )
  }
)

export type { NicheLandingProps } from './types'
