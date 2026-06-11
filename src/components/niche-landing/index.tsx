import { component$ } from '@builder.io/qwik'
import { Boneco } from '~/components/boneco'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { DepthSection } from '~/components/depth-section'
import { DopamineCard } from '~/components/dopamine-card'
import { ErrorBoundary } from '~/components/error-boundary'
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
        {/* Niche header — CinematicDepthCard with craft washi tape */}
        <DepthSection as="div" depth="front" class="mb-2">
          <CinematicDepthCard variant="hero" class="w-full washi-tape washi-tape-teal">
            <div class="p-6 md:p-8">
              <div class="flex items-center gap-4 mb-4">
                {iconClass && <div class={iconClass} aria-hidden="true" />}
                <h1 class="text-2xl font-bold text-bone leading-tight font-display text-wrap:balance">
                  {niche.title[lang]}
                </h1>
              </div>
              <p class="text-bone text-lg leading-relaxed max-w-2xl">{niche.description[lang]}</p>
            </div>
          </CinematicDepthCard>
        </DepthSection>

        {/* Article list — craft section with mascot watermark */}
        <ErrorBoundary fallbackMsg="Article Grid">
          <section
            class="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-[#131820] border border-white/5 craft-card"
            data-blur="lg"
          >
            {/* Unified Mascot Watermark */}
            <Boneco
              emotion="happy"
              scale={1.5}
              class="mascot-watermark opacity-5 absolute -bottom-4 -right-4 pointer-events-none"
            />
            <div
              class="grain-4k absolute inset-0 pointer-events-none opacity-30"
              aria-hidden="true"
            />
            <div class="relative z-[var(--z-raised)]">
              <h2 class="text-xl md:text-2xl font-display tracking-[-1px] text-bone mb-6">
                {t.niche.articleCount.replace('{count}', localizedArticles.length.toString())}
              </h2>
              {localizedArticles.length > 0 ? (
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localizedArticles.map((article, i) => (
                    <ErrorBoundary key={article.slug} fallbackMsg="Article Card">
                      <article aria-label={article.title}>
                        <DopamineCard
                          class={i === 0 ? 'md:col-span-2' : ''}
                          title={article.title}
                          description={article.summary ?? ''}
                          href={`/signals/${niche.slugs[lang]}/${article.slug}`}
                          lang={lang}
                          data-testid="article-card"
                        />
                      </article>
                    </ErrorBoundary>
                  ))}
                </div>
              ) : (
                <div
                  class="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6"
                  data-testid="niche-articles-placeholder"
                >
                  {/* Kawaii sparkle icon — inline SVG */}
                  <svg
                    class="w-16 h-16 text-cyan/30 animate-breathe"
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M32 4L35.5 26.5L32 28L28.5 26.5L32 4Z"
                      fill="currentColor"
                      class="opacity-60"
                    />
                    <path
                      d="M32 60L28.5 37.5L32 36L35.5 37.5L32 60Z"
                      fill="currentColor"
                      class="opacity-60"
                    />
                    <path
                      d="M4 32L26.5 28.5L28 32L26.5 35.5L4 32Z"
                      fill="currentColor"
                      class="opacity-60"
                    />
                    <path
                      d="M60 32L37.5 35.5L36 32L37.5 28.5L60 32Z"
                      fill="currentColor"
                      class="opacity-60"
                    />
                    <circle cx="32" cy="32" r="8" fill="currentColor" class="opacity-40" />
                    <circle cx="32" cy="32" r="3" fill="currentColor" />
                  </svg>
                  <div>
                    <h3 class="text-xl font-display text-bone mb-2">
                      {t.niche.exploreNiche.replace('{niche}', niche.title[lang])}
                    </h3>
                    <p class="text-bone-muted max-w-md mx-auto">
                      {t.niche.comingSoon
                        ? t.niche.comingSoon.replace('{niche}', niche.title[lang])
                        : `We're curating the first articles for ${niche.title[lang]}. Explore related topics below.`}
                    </p>
                  </div>
                  {/* Quick link to other niches */}
                  {otherNiches.length > 0 && (
                    <div class="flex flex-wrap justify-center gap-2 pt-2">
                      {otherNiches.slice(0, 3).map(related => (
                        <a
                          key={related.slug}
                          href={nicheIndex(lang, getNicheSlug(related, lang))}
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                 bg-white/5 hover:bg-white/10 text-bone-muted hover:text-bone
                                 border border-white/5 hover:border-white/10
                                 transition-colors duration-200"
                        >
                          {related.icon && (
                            <span class={getLucideIconClass(related.icon)} aria-hidden="true" />
                          )}
                          {related.title[lang]}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </ErrorBoundary>

        {/* Related niches — filter out empty ones unless it's APEX */}
        <ErrorBoundary fallbackMsg="Related Niches">
          {otherNiches.length > 0 && (
            <section
              class="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-[#131820] border border-white/5"
              data-blur="lg"
              aria-label={t.niche.allNiches}
            >
              <div
                class="grain-4k absolute inset-0 pointer-events-none opacity-30"
                aria-hidden="true"
              />
              <div class="relative z-[var(--z-raised)]">
                <h2 class="text-xl md:text-2xl font-display tracking-[-1px] text-bone mb-6">
                  {t.niche.allNiches}
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherNiches
                    .filter(
                      related =>
                        articles.some(a => a.lang === lang && a.slug.includes(related.slug)) ||
                        related.slug === 'apex'
                    )
                    .map(related => (
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
        </ErrorBoundary>
      </div>
    )
  }
)
