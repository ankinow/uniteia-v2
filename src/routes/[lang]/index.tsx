import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { CanvasSurface } from '~/components/canvas-surface'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { JSONLD } from '~/components/json-ld'
import { MasterOpenCanvas } from '~/components/master-open-canvas'
import { OnboardingFlow } from '~/components/onboarding-flow'
import {
  ScrollContentCanvas,
  ScrollDepthCardEnhancer,
  ScrollHeroOrganism,
} from '~/components/scroll-driven'
import { SignalChip } from '~/components/signal-chip'
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
  const sortedClusters = [...knowledgeClusters].sort((a, b) =>
    a.nicheSlug === 'apex' ? -1 : b.nicheSlug === 'apex' ? 1 : 0
  )

  return (
    <div class="space-y-12 p-6 md:p-8 mx-auto max-w-4xl">
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
      <OnboardingFlow locale={lang} siteName={siteName} />
      {/* M012 S07: ScrollHeroOrganism — 5-layer parallax hero */}
      <ScrollHeroOrganism
        layers={[
          {
            content: (
              <div class="absolute inset-0 bg-gradient-to-b from-void via-void/60 to-void" />
            ),
            speed: 0.15,
          },
          {
            content: (
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(100,220,255,0.05),transparent_70%)]" />
            ),
            speed: 0.3,
          },
          {
            content: <div class="absolute inset-0 grain-4k opacity-25" />,
            speed: 0.6,
          },
          {
            content: (
              <MasterOpenCanvas
                variant="parchment"
                title={t.homepage.networkState}
                decisionNodes={(() => {
                  const clusterNodes = sortedClusters.map(c => ({
                    id: c.nicheSlug,
                    label: c.label,
                    outcome: `${t.homepage.signalCount.replace('{count}', c.articleCount.toString())} · Q${c.avgGraphScore.toFixed(0)}`,
                  }))
                  const rootNode = {
                    id: 'signal-intake',
                    label: t.homepage.signalIntake,
                    outcome: `${t.homepage.signalCount.replace('{count}', new Set([...featuredSignals, ...frontierStreams].map(s => s.node.id)).size.toString())} ${t.homepage.curatedAcross.replace('{count}', clusterNodes.length.toString())}`,
                    children: clusterNodes.length > 0 ? clusterNodes : undefined,
                  }
                  const deliveryNode = {
                    id: 'delivery',
                    label: t.homepage.deliveryLayer,
                    outcome: `${SUPPORTED_LANGUAGES.length}-locale CF Pages · sitemap · search index`,
                  }
                  return [rootNode, deliveryNode]
                })()}
                class="mb-4"
              />
            ),
            speed: 1.0,
          },
          {
            content: (
              <div class="absolute bottom-12 left-0 right-0 text-center text-sm tracking-[0.3em] uppercase text-bone/25">
                {t.homepage.networkState}
              </div>
            ),
            speed: 1.5,
          },
        ]}
      />

      <CanvasSurface tone="parchment" class="mt-8">
        <ScrollContentCanvas class="my-8">
          {featuredSignals.length > 0 && (
            <section class="mb-10">
              <h2
                class="text-xl font-bold font-pixel text-bone mb-6 uppercase tracking-wider scroll-reveal text-wrap:balance"
                data-step="1"
              >
                {t.homepage.featuredSignals}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredSignals.map((signal, i) => (
                  <a
                    key={signal.node.id}
                    href={signal.href}
                    class="block no-underline scroll-reveal"
                    data-step={String(i + 2)}
                  >
                    <ScrollDepthCardEnhancer>
                      <CinematicDepthCard
                        {...(signal.node.visualStyle
                          ? { visualStyle: signal.node.visualStyle }
                          : {})}
                        layer={i % 3}
                      >
                        <div class="p-5">
                          <p class="font-semibold text-bone text-base leading-tight">
                            {signal.node.title}
                          </p>
                          <p class="text-sm text-bone mt-2 line-clamp-2 leading-relaxed">
                            {signal.node.summary}
                          </p>
                          <div class="flex gap-3 mt-3 text-xs">
                            <SignalChip
                              metric={signal.node.metrics.graphScore}
                              label={t.signal.qualityLabel}
                              variant="analyst"
                              trend={signal.node.metrics.graphScore >= 70 ? 'up' : 'stable'}
                            />
                            <span class="text-bone/50 uppercase tracking-wider">
                              {signal.node.locale}
                            </span>
                          </div>
                        </div>
                      </CinematicDepthCard>
                    </ScrollDepthCardEnhancer>
                  </a>
                ))}
              </div>
            </section>
          )}

          {sortedClusters.length > 0 && (
            <section class="mb-10">
              <h2
                class="text-xl font-bold font-pixel text-bone mb-6 uppercase tracking-wider scroll-reveal text-wrap:balance"
                data-step="1"
              >
                {t.homepage.knowledgeClusters}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedClusters.map((cluster, i) => (
                  <a
                    key={cluster.nicheSlug}
                    href={cluster.href}
                    class="block no-underline scroll-reveal"
                    data-step={String(i + 2)}
                  >
                    <ScrollDepthCardEnhancer>
                      <CinematicDepthCard variant="subtle" layer={i % 2}>
                        <div class="p-5">
                          <p class="font-semibold text-bone text-base">{cluster.label}</p>
                          <p class="text-sm text-bone mt-2 tabular-nums">
                            {t.homepage.signalCount.replace(
                              '{count}',
                              cluster.articleCount.toString()
                            )}{' '}
                            ·{' '}
                            <span
                              aria-label={`Signal Origin Score ${cluster.avgGraphScore.toFixed(0)} — Aether Gate 7/7`}
                              data-tooltip="Signal Origin Score — the vacuum where the signal emerges"
                              class="cursor-help"
                            >
                              &empty; {cluster.avgGraphScore.toFixed(0)}
                            </span>
                          </p>
                        </div>
                      </CinematicDepthCard>
                    </ScrollDepthCardEnhancer>
                  </a>
                ))}
              </div>
            </section>
          )}

          {frontierStreams.length > 0 && (
            <section class="mb-10">
              <h2
                class="text-xl font-bold font-pixel text-bone mb-6 uppercase tracking-wider scroll-reveal text-wrap:balance"
                data-step="1"
              >
                {t.homepage.frontierStreams}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {frontierStreams.map((stream, i) => (
                  <a
                    key={stream.node.id}
                    href={stream.href}
                    class="block no-underline scroll-reveal"
                    data-step={String(i + 2)}
                  >
                    <ScrollDepthCardEnhancer>
                      <CinematicDepthCard variant="card" layer={i % 2}>
                        <div class="p-5">
                          <p class="font-semibold text-bone text-base leading-tight">
                            {stream.node.title}
                          </p>
                          <p class="text-sm text-bone mt-2 line-clamp-2 leading-relaxed">
                            {stream.node.summary}
                          </p>
                          <div class="flex gap-2 mt-2">
                            <SignalChip
                              metric={stream.node.metrics.freshnessScore}
                              label={t.signal.freshnessLabel}
                              variant="curator"
                              trend={
                                stream.node.metrics.freshnessScore >= 70
                                  ? 'up'
                                  : stream.node.metrics.freshnessScore >= 40
                                    ? 'stable'
                                    : 'down'
                              }
                            />
                          </div>
                        </div>
                      </CinematicDepthCard>
                    </ScrollDepthCardEnhancer>
                  </a>
                ))}
              </div>
            </section>
          )}
        </ScrollContentCanvas>
      </CanvasSurface>

      {featuredSignals.length === 0 &&
        knowledgeClusters.length === 0 &&
        frontierStreams.length === 0 && (
          <section class="text-center py-20">
            <p class="text-bone-muted text-lg">{t.homepage.noSignals}</p>
            <a
              href={`/${lang}/signals`}
              class="inline-block mt-4 text-cyan hover:text-cyan/80 transition-colors"
            >
              {t.homepage.browseTopics} &rarr;
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
