import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { GenerativeHero } from '~/components/generative-hero'
import { ClusterIcon, nicheToIcon } from '~/components/icon-set/icon-set'
import { JSONLD } from '~/components/json-ld'
import { getHomepageProjection } from '~/content-graph/projections'
import type { HomepageProjection } from '~/content-graph/projections'
import { getTranslation } from '~/i18n/context'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { slugToKawaiiMini } from '~/utils/kawaii-thumbnail'
import { loadNichesConfig } from '~/utils/niche-loader'

export const onStaticGenerate = () => {
  return {
    params: SUPPORTED_LANGUAGES.map(l => ({
      lang: l.code,
    })),
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

  // APEX-first: apex articles pinned to top, then rest by score. Filter out empty clusters.
  const sortedClusters = [...knowledgeClusters]
    .filter(c => c.articleCount > 0 || c.nicheSlug === 'apex')
    .sort((a, b) => {
      if (a.nicheSlug === 'apex') return -1
      if (b.nicheSlug === 'apex') return 1
      return b.avgGraphScore - a.avgGraphScore
    })

  return (
    <div class="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24 space-y-24">
      {/* JSON-LD ... */}
      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: `https://uniteia.com/${lang}`,
          description: t.seo.topicsDescription,
          inLanguage: lang,
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

      {/* Hero — clean, direct, context-aware */}
      <GenerativeHero clusters={sortedClusters} lang={lang} t={t.generativeHero} />

      {/* APEX: featured signals — the real content */}
      {featuredSignals.length > 0 && (
        <section aria-label={t.homepage.featuredSignals}>
          <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono mb-8">
            {t.homepage.featuredSignals}
            <span class="ml-3 text-neon-cyan tabular-nums opacity-60">
              {featuredSignals.length}
            </span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>:last-child:nth-child(odd)]:col-span-full">
            {featuredSignals.map(signal => {
              const thumb = slugToKawaiiMini(signal.node.slug)
              return (
                <a
                  key={signal.node.id}
                  href={signal.href}
                  class="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-xl"
                >
                  <CinematicDepthCard
                    {...(signal.node.visualStyle ? { visualStyle: signal.node.visualStyle } : {})}
                    class="h-full transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-neon-cyan/10"
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      width="120"
                      height="120"
                      loading="lazy"
                      decoding="async"
                      class="w-full aspect-[3/2] object-cover rounded-t-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div class="p-6 md:p-8">
                      <p class="font-bold text-bone text-lg md:text-xl leading-tight group-hover:text-neon-cyan transition-colors duration-200">
                        {signal.node.title}
                      </p>
                      <p class="text-sm md:text-base text-bone-muted mt-3 line-clamp-3 leading-relaxed">
                        {signal.node.summary}
                      </p>
                      <div class="flex items-center gap-4 mt-6">
                        <span class="text-[10px] text-bone/30 uppercase tracking-[0.2em] font-mono border border-white/5 px-2 py-0.5 rounded">
                          {signal.node.locale}
                        </span>
                        {signal.node.qualityScore != null && (
                          <div class="flex items-center gap-1.5">
                            <span class="text-[10px] text-bone/20 font-mono">Score</span>
                            <span class="text-xs text-neon-amber font-mono tabular-nums">
                              ∅{signal.node.qualityScore.toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CinematicDepthCard>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Clusters: niche pills — compact navigation */}
      {sortedClusters.length > 0 && (
        <section aria-label={t.homepage.knowledgeClusters}>
          <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono mb-6">
            {t.homepage.knowledgeClusters}
          </h2>
          <div class="flex flex-wrap gap-3">
            {sortedClusters.map(cluster => (
              <a
                key={cluster.nicheSlug}
                href={cluster.href}
                class="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/5 bg-deep hover:bg-mid hover:border-neon-cyan/40 transition-all duration-200 no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
              >
                <ClusterIcon
                  name={nicheToIcon(cluster.nicheSlug)}
                  size={18}
                  class="text-bone/40 group-hover:text-neon-cyan transition-colors"
                />
                <span class="text-sm md:text-base font-medium text-bone/70 group-hover:text-bone transition-colors">
                  {cluster.label}
                </span>
                <span class="text-[10px] text-bone/20 font-mono tabular-nums ml-2 bg-white/5 px-1.5 py-0.5 rounded">
                  {cluster.articleCount}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Frontier streams: compact list */}
      {frontierStreams.length > 0 && (
        <section class="mt-12" aria-label={t.homepage.frontierStreams}>
          <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono mb-4">
            {t.homepage.frontierStreams}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-full">
            {frontierStreams.map(stream => {
              const thumb = slugToKawaiiMini(stream.node.slug)
              return (
                <a
                  key={stream.node.id}
                  href={stream.href}
                  class="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-rose rounded-lg"
                >
                  <CinematicDepthCard
                    variant="card"
                    class="hover:border-neon-rose/20 transition-colors"
                  >
                    <div class="flex items-start gap-3 p-4">
                      <img
                        src={thumb.src}
                        alt={thumb.alt}
                        width="56"
                        height="56"
                        loading="lazy"
                        decoding="async"
                        class="w-14 h-14 rounded-lg object-cover shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                      />
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

      {/* Empty state */}
      {featuredSignals.length === 0 &&
        knowledgeClusters.length === 0 &&
        frontierStreams.length === 0 && (
          <section class="text-center py-24">
            <p class="text-bone/50 text-lg font-display">{t.homepage.noSignals}</p>
            <a
              href={`/${lang}/signals`}
              class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/5 transition-all duration-200 no-underline"
            >
              {t.homepage.browseTopics} →
            </a>
          </section>
        )}

      {/* Footer whisper — locale + deploy info, minimal */}
      <footer class="mt-8 pt-8 border-t border-bone/5 text-center">
        <p class="text-xs text-bone/25 font-mono">
          {siteName} · {lang} · {SUPPORTED_LANGUAGES.length} locales · CF Pages
        </p>
      </footer>
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
      { property: 'og:locale', content: lang },
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
