import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { CinematicDepthCard } from '~/components/cinematic-depth'
import { MasterOpenCanvas } from '~/components/master-open-canvas'
import { ScrollContentCanvas } from '~/components/scroll-driven'
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
  const { featuredSignals, knowledgeClusters, frontierStreams } = homepage.value

  return (
    <div class="space-y-12 p-6 md:p-8 mx-auto max-w-4xl">
      {/* M012: MasterOpenCanvas — sketchnote hero */}
      <MasterOpenCanvas
        title="UniTeia Network State"
        decisionNodes={(() => {
          const clusterNodes = knowledgeClusters.map(c => ({
            id: c.nicheSlug,
            label: c.label,
            outcome: `${c.articleCount} signals · Q${c.avgGraphScore.toFixed(0)}`,
          }))
          const rootNode = {
            id: 'signal-intake',
            label: 'Signal Intake',
            outcome: `${featuredSignals.length + frontierStreams.length} signals curated across ${clusterNodes.length} niches`,
            children: clusterNodes.length > 0 ? clusterNodes : undefined,
          }
          const deliveryNode = {
            id: 'delivery',
            label: 'Delivery Layer',
            outcome: `${SUPPORTED_LANGUAGES.length}-locale CF Pages · sitemap · search index`,
          }
          return [rootNode, deliveryNode]
        })()}
        class="mb-4"
      />

      <ScrollContentCanvas class="my-8">
        {featuredSignals.length > 0 && (
          <section class="mb-10">
            <h2
              class="text-xl font-bold font-pixel text-paper-text mb-6 uppercase tracking-wider scroll-reveal"
              data-step="1"
            >
              Featured Signals
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSignals.map((signal, i) => (
                <a
                  key={signal.node.id}
                  href={signal.href}
                  class="block no-underline scroll-reveal"
                  data-step={String(i + 2)}
                >
                  <CinematicDepthCard variant="card" layer={i % 3}>
                    <div class="p-5">
                      <p class="font-semibold text-bone text-base leading-tight">
                        {signal.node.title}
                      </p>
                      <p class="text-sm text-bone/70 mt-2 line-clamp-2 leading-relaxed">
                        {signal.node.summary}
                      </p>
                      <div class="flex gap-3 mt-3 text-xs">
                        <span class="text-cyan font-mono">
                          Q{signal.node.metrics.graphScore.toFixed(0)}
                        </span>
                        <span class="text-bone/50 uppercase tracking-wider">
                          {signal.node.locale}
                        </span>
                      </div>
                    </div>
                  </CinematicDepthCard>
                </a>
              ))}
            </div>
          </section>
        )}

        {knowledgeClusters.length > 0 && (
          <section class="mb-10">
            <h2
              class="text-xl font-bold font-pixel text-paper-text mb-6 uppercase tracking-wider scroll-reveal"
              data-step="1"
            >
              Knowledge Clusters
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {knowledgeClusters.map((cluster, i) => (
                <a
                  key={cluster.nicheSlug}
                  href={cluster.href}
                  class="block no-underline scroll-reveal"
                  data-step={String(i + 2)}
                >
                  <CinematicDepthCard variant="subtle" layer={i % 2}>
                    <div class="p-5">
                      <p class="font-semibold text-bone text-base">{cluster.label}</p>
                      <p class="text-sm text-bone/70 mt-2">
                        {cluster.articleCount} signal{cluster.articleCount !== 1 ? 's' : ''} ·
                        &empty; {cluster.avgGraphScore.toFixed(0)}
                      </p>
                    </div>
                  </CinematicDepthCard>
                </a>
              ))}
            </div>
          </section>
        )}

        {frontierStreams.length > 0 && (
          <section class="mb-10">
            <h2
              class="text-xl font-bold font-pixel text-paper-text mb-6 uppercase tracking-wider scroll-reveal"
              data-step="1"
            >
              Frontier Streams
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {frontierStreams.map((stream, i) => (
                <a
                  key={stream.node.id}
                  href={stream.href}
                  class="block no-underline scroll-reveal"
                  data-step={String(i + 2)}
                >
                  <CinematicDepthCard variant="card" layer={i % 2}>
                    <div class="p-5">
                      <p class="font-semibold text-bone text-base leading-tight">
                        {stream.node.title}
                      </p>
                      <p class="text-sm text-bone/70 mt-2 line-clamp-2 leading-relaxed">
                        {stream.node.summary}
                      </p>
                      <p class="text-xs text-bone/50 mt-2 font-mono">
                        Freshness: {stream.node.metrics.freshnessScore.toFixed(0)}
                      </p>
                    </div>
                  </CinematicDepthCard>
                </a>
              ))}
            </div>
          </section>
        )}
      </ScrollContentCanvas>

      {featuredSignals.length === 0 &&
        knowledgeClusters.length === 0 &&
        frontierStreams.length === 0 && (
          <section class="text-center py-20">
            <p class="text-bone-muted text-lg">No signals published yet in this locale.</p>
            <a
              href={`/${lang}/signals`}
              class="inline-block mt-4 text-cyan hover:text-cyan/80 transition-colors"
            >
              Browse topics &rarr;
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

  return {
    title: `${siteName} — ${t.nav.home}`,
    meta: [
      { name: 'description', content: t.seo.topicsDescription },
      { name: 'robots', content: 'index, follow' },
    ],
  }
}
