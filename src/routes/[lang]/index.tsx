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

  // APEX-first: apex articles pinned to top, then rest by score
  const sortedClusters = [...knowledgeClusters].sort((a, b) => {
    if (a.nicheSlug === 'apex') return -1
    if (b.nicheSlug === 'apex') return 1
    return b.avgGraphScore - a.avgGraphScore
  })

  // Pluralization helper
  const p = (key: 'signalCount' | 'curatedAcross', count: number): string => {
    if (count === 1)
      return (
        (t.homepage as Record<string, string>)[`${key}One`] ??
        t.homepage[key].replace('{count}', '1')
      )
    return t.homepage[key].replace('{count}', count.toString())
  }

  return (
    <div class="mx-auto max-w-5xl px-4 sm:px-6 py-8 md:py-12">
      {/* JSON-LD: WebSite + Organization + SearchAction */}
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
        <section class="mt-14" aria-label={t.homepage.featuredSignals}>
          <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono mb-5">
            {t.homepage.featuredSignals}
            <span class="ml-2 text-neon-cyan tabular-nums">{featuredSignals.length}</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredSignals.map(signal => (
              <a
                key={signal.node.id}
                href={signal.href}
                class="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-xl"
              >
                <CinematicDepthCard
                  {...(signal.node.visualStyle ? { visualStyle: signal.node.visualStyle } : {})}
                  class="transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-neon-cyan/5"
                >
                  <div class="p-5">
                    <p class="font-semibold text-bone text-base leading-tight group-hover:text-neon-cyan transition-colors duration-200">
                      {signal.node.title}
                    </p>
                    <p class="text-sm text-bone/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {signal.node.summary}
                    </p>
                    <div class="flex items-center gap-3 mt-3">
                      <span class="text-xs text-bone/40 uppercase tracking-wider font-mono">
                        {signal.node.locale}
                      </span>
                      {signal.node.qualityScore != null && (
                        <span class="text-xs text-neon-amber font-mono tabular-nums">
                          ∅{signal.node.qualityScore.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </CinematicDepthCard>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Clusters: niche pills — compact navigation */}
      {sortedClusters.length > 0 && (
        <section class="mt-12" aria-label={t.homepage.knowledgeClusters}>
          <h2 class="text-xs uppercase tracking-[0.3em] text-bone/40 font-mono mb-4">
            {t.homepage.knowledgeClusters}
          </h2>
          <div class="flex flex-wrap gap-2.5">
            {sortedClusters.map(cluster => (
              <a
                key={cluster.nicheSlug}
                href={cluster.href}
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bone/10 bg-deep hover:bg-mid hover:border-neon-cyan/30 transition-all duration-150 no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
              >
                <ClusterIcon name={nicheToIcon(cluster.nicheSlug)} size={16} />
                <span class="text-sm text-bone group-hover:text-bone transition-colors">
                  {cluster.label}
                </span>
                <span class="text-xs text-bone/40 font-mono tabular-nums ml-1">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {frontierStreams.map(stream => (
              <a
                key={stream.node.id}
                href={stream.href}
                class="block no-underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-rose rounded-lg"
              >
                <CinematicDepthCard
                  variant="card"
                  class="hover:border-neon-rose/20 transition-colors"
                >
                  <div class="p-4">
                    <p class="font-medium text-bone text-sm leading-tight group-hover:text-neon-rose transition-colors">
                      {stream.node.title}
                    </p>
                    <p class="text-xs text-bone/50 mt-1 line-clamp-2">{stream.node.summary}</p>
                  </div>
                </CinematicDepthCard>
              </a>
            ))}
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
      <footer class="mt-20 pt-8 border-t border-bone/5 text-center">
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
