import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { BauhausSection } from '~/components/bauhaus-section'
import { BentoCell, BentoGrid } from '~/components/bento-grid'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { GenerativeHero } from '~/components/generative-hero'
import { ClusterIcon, nicheToIcon } from '~/components/icon-set/icon-set'
import { JSONLD } from '~/components/json-ld'
import { getHomepageProjection } from '~/content-graph/projections'
import type { HomepageProjection } from '~/content-graph/projections'
import { toBcp47 } from '~/i18n/bcp47'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { getBuildLocale } from '~/utils/build-locale'
import { loadNichesConfig } from '~/utils/niche-loader'

export const onStaticGenerate = () => {
  const lang = getBuildLocale()
  return {
    params: [{ lang }],
  }
}

export const useHomepageData = routeLoader$<HomepageProjection>(async ({ params }) => {
  const lang = (params.lang as SupportedLanguage) ?? 'en'
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const niches = await loadNichesConfig()
  return getHomepageProjection(contentGraphProvider, niches, lang)
})

export default component$(() => {
  const homepage = useHomepageData()
  const loc = useLocation()
  const lang = (loc.params.lang as SupportedLanguage) ?? 'en'
  const t = getTranslation(lang)
  const siteName = t.seo.siteName
  const { featuredSignals, knowledgeClusters, frontierStreams } = homepage.value

  const sortedClusters = [...knowledgeClusters]
    .filter(c => c.articleCount > 0 || c.nicheSlug === 'apex')
    .sort((a, b) => {
      if (a.nicheSlug === 'apex') return -1
      if (b.nicheSlug === 'apex') return 1
      return b.avgGraphScore - a.avgGraphScore
    })

  return (
    <div class="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24 space-y-24">
      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: `https://uniteia.com/${lang}`,
          description: t.seo.topicsDescription,
          inLanguage: toBcp47(lang),
          publisher: {
            '@type': 'Organization',
            name: siteName,
            url: 'https://uniteia.com',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `https://uniteia.com/${lang}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero — sunset sky background */}
      <div class="sunset-sky -mx-4 sm:-mx-6 -mt-12 md:-mt-24 px-4 sm:px-6 pt-12 md:pt-24 pb-8 mb-8">
        <GenerativeHero clusters={sortedClusters} lang={lang} t={t.generativeHero} />
      </div>

      {/* Mission */}
      <BauhausSection mood="voltage" as="section" class="!py-12 !px-6">
        <div class="flex flex-col md:flex-row gap-8 md:gap-16 items-center max-w-4xl mx-auto">
          <div class="flex-1 text-center md:text-left">
            <span class="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]/60 font-mono mb-4 block">
              {t.generativeHero.apexBadge}
            </span>
            <h2 class="text-2xl md:text-3xl font-display text-bone leading-tight mb-4">
              {t.onboarding.step1.title}
            </h2>
            <p class="text-bone-muted text-sm md:text-base leading-relaxed max-w-lg">
              {t.onboarding.step1.desc}
            </p>
          </div>
          <div class="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--sp-ember)]/10 border-2 border-[var(--color-accent)]/20 flex items-center justify-center">
            <span class="text-4xl md:text-5xl font-display text-[var(--color-accent)]/70 font-bold">
              ∞
            </span>
          </div>
        </div>
      </BauhausSection>

      {/* Featured Signals */}
      {featuredSignals.length > 0 && (
        <section aria-label={t.homepage.featuredSignals}>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono">
              {t.homepage.featuredSignals}
              <span class="ml-3 text-[var(--color-accent)] tabular-nums opacity-60">
                {featuredSignals.length}
              </span>
            </h2>
          </div>
          <BentoGrid cellHeight="auto" gap="1.5rem">
            {featuredSignals.map((signal, idx) => {
              return (
                <BentoCell key={signal.node.id} size={idx === 0 ? 'wide' : 'default'} as="article">
                  <a
                    href={signal.href}
                    class="block h-full no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-[0.98] transition-transform duration-100"
                  >
                    <CinematicDepthCard
                      {...(signal.node.visualStyle ? { visualStyle: signal.node.visualStyle } : {})}
                      class="h-full transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-[var(--color-accent)]/10"
                    >
                      <div class="p-4 md:p-5">
                        <p class="font-bold text-bone text-base md:text-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-200">
                          {signal.node.title}
                        </p>
                        <p class="text-xs md:text-sm text-bone-muted mt-2 line-clamp-3 leading-relaxed">
                          {signal.node.summary}
                        </p>
                        <div class="flex items-center gap-4 mt-4">
                          <span class="text-[9px] text-bone/40 uppercase tracking-[0.2em] font-mono border-2 border-[var(--color-accent)]/20 px-1.5 py-0.5 bg-[var(--color-deep)]">
                            {signal.node.locale}
                          </span>
                          {signal.node.qualityScore != null && (
                            <div class="flex items-center gap-1.5">
                              <span class="text-[9px] text-bone/30 font-mono uppercase tracking-widest">
                                Score
                              </span>
                              <span class="text-[11px] text-neon-amber font-mono tabular-nums font-bold">
                                ∅{signal.node.qualityScore.toFixed(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CinematicDepthCard>
                  </a>
                </BentoCell>
              )
            })}
          </BentoGrid>
        </section>
      )}

      {/* Knowledge Clusters */}
      {sortedClusters.length > 0 && (
        <BauhausSection
          mood="voltage"
          as="section"
          class="!py-12 !px-0"
          aria-label={t.homepage.knowledgeClusters}
        >
          <div class="px-0 sm:px-6">
            <h2 class="text-xs uppercase tracking-[0.3em] text-bone/50 font-mono mb-6 px-0">
              {t.homepage.knowledgeClusters}
            </h2>
            <div class="flex flex-wrap gap-3">
              {sortedClusters.map(cluster => (
                <a
                  key={cluster.nicheSlug}
                  href={cluster.href}
                  class="inline-flex items-center gap-3 px-5 py-2.5 border-2 border-[var(--color-accent)]/10 bg-[var(--color-deep)] hover:bg-[var(--color-mid)] hover:border-[var(--color-accent)]/40 transition-[color,background-color,border-color,transform] duration-100 active:scale-[0.96] no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  {cluster.nicheSlug === 'apex' && (
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
                    </span>
                  )}
                  <ClusterIcon
                    name={nicheToIcon(cluster.nicheSlug)}
                    size={18}
                    class="text-bone/40 group-hover:text-[var(--color-accent)] transition-colors"
                  />
                  <span class="text-sm md:text-base font-medium text-bone/70 group-hover:text-bone transition-colors">
                    {cluster.label}
                  </span>
                  <span class="text-[10px] text-bone/20 font-mono tabular-nums ml-2 bg-[var(--color-accent)]/10 px-1.5 py-0.5">
                    {cluster.articleCount}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </BauhausSection>
      )}

      {/* Frontier streams */}
      {frontierStreams.length > 0 && (
        <section aria-label={t.homepage.frontierStreams}>
          <div class="flex items-center gap-3 mb-6">
            <span class="w-1.5 h-1.5 bg-neon-rose rounded-full animate-pulse" />
            <h2 class="text-[10px] uppercase tracking-[0.4em] text-bone/40 font-mono">
              {t.homepage.frontierStreams}
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-full">
            {frontierStreams.map(stream => {
              return (
                <a
                  key={stream.node.id}
                  href={stream.href}
                  class="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-[0.98] transition-transform duration-100"
                >
                  <CinematicDepthCard
                    variant="card"
                    class="hover:border-[var(--color-accent)]/20 transition-colors"
                  >
                    <div class="flex items-start gap-3 p-4">
                      <div class="min-w-0">
                        <p class="font-medium text-bone text-sm leading-tight group-hover:text-neon-rose transition-colors">
                          {stream.node.title}
                        </p>
                        <p class="text-xs text-bone/50 mt-1 line-clamp-2">{stream.node.summary}</p>
                      </div>
                    </div>
                  </CinematicDepthCard>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Network State / Mission — teal section with dark text for contrast */}
      <BauhausSection mood="signal" as="section" class="!py-12 !px-6">
        <div class="max-w-3xl mx-auto text-center">
          <span class="text-[10px] uppercase tracking-[0.3em] text-black/40 font-mono mb-4 block">
            {t.homepage.networkState}
          </span>
          <h2 class="text-xl md:text-2xl font-display text-black/80 leading-tight mb-4">
            {t.onboarding.step2.title}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {t.onboarding.step2.cards.map(card => (
              <div key={card.label} class="bg-black/10 p-4 border-2 border-black/20">
                <span class="text-black/70 text-xs font-mono uppercase tracking-widest">
                  {card.label}
                </span>
                <p class="text-[#1a1a1a] text-xs mt-2 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </BauhausSection>

      {/* Empty state */}
      {featuredSignals.length === 0 &&
        knowledgeClusters.length === 0 &&
        frontierStreams.length === 0 && (
          <section class="text-center py-24">
            <p class="text-bone/50 text-lg font-display">{t.homepage.noSignals}</p>
            <a
              href={`/${lang}/signals`}
              class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 border-2 border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors duration-100 active:scale-[0.96] no-underline"
            >
              {t.homepage.browseTopics} →
            </a>
          </section>
        )}
    </div>
  )
})

export const head: DocumentHead = ({ params }) => {
  const lang = (params.lang as SupportedLanguage) ?? 'en'
  const t = getTranslation(lang)
  const siteName = t.seo.siteName
  const baseUrl = 'https://uniteia.com'
  const localeUrl = `${baseUrl}/${lang}`
  const title = `${siteName} — ${t.nav.home}`
  const description = t.seo.topicsDescription

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: localeUrl },
      { property: 'og:locale', content: toBcp47(lang) },
      { property: 'og:site_name', content: siteName },
      { property: 'og:image', content: `${baseUrl}/og-image.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${baseUrl}/og-image.png` },
    ],
    links: [{ rel: 'canonical', href: localeUrl }],
    fonts: [],
  }
}
