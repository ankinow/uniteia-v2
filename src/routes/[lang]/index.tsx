import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { MasterOpenCanvas } from '~/components/master-open-canvas'
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
        decisionNodes={[
          {
            id: 'signal-intake',
            label: 'Signal Intake',
            outcome: 'real-time multi-source ingestion',
          },
          {
            id: 'knowledge-clusters',
            label: 'Knowledge Clusters',
            outcome: 'cross-domain graph synthesis',
            children: [
              {
                id: 'verified',
                label: 'Verified Signals',
                outcome: 'editorial review + source attestation',
              },
              {
                id: 'frontier',
                label: 'Frontier Streams',
                outcome: 'emerging patterns, low-latency',
              },
            ],
          },
          {
            id: 'delivery',
            label: 'Delivery Layer',
            outcome: '8-locale static-first CF Pages',
          },
        ]}
        class="mb-4"
      />

      {featuredSignals.length > 0 && (
        <section>
          <h2 class="text-xl font-bold font-pixel text-bone mb-4 uppercase tracking-wider">
            Featured Signals
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSignals.map(signal => (
              <a
                key={signal.node.id}
                href={signal.href}
                class="border border-action/20 hover:border-action bg-void/raised rounded-lg p-4 transition-all duration-200 block"
              >
                <p class="font-semibold text-bone">{signal.node.title}</p>
                <p class="text-sm text-bone-muted mt-1 line-clamp-2">{signal.node.summary}</p>
                <div class="flex gap-3 mt-2 text-xs">
                  <span class="text-cyan">Q{signal.node.metrics.graphScore.toFixed(0)}</span>
                  <span class="text-bone-muted uppercase">{signal.node.locale}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {knowledgeClusters.length > 0 && (
        <section>
          <h2 class="text-xl font-bold font-pixel text-bone mb-4 uppercase tracking-wider">
            Knowledge Clusters
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {knowledgeClusters.map(cluster => (
              <a
                key={cluster.nicheSlug}
                href={cluster.href}
                class="border border-action/20 hover:border-action bg-void/raised rounded-lg p-4 transition-all duration-200 block"
              >
                <p class="font-semibold text-bone">{cluster.label}</p>
                <p class="text-sm text-bone-muted mt-1">
                  {cluster.articleCount} signal{cluster.articleCount !== 1 ? 's' : ''} · &empty;
                  {cluster.avgGraphScore.toFixed(0)}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {frontierStreams.length > 0 && (
        <section>
          <h2 class="text-xl font-bold font-pixel text-bone mb-4 uppercase tracking-wider">
            Frontier Streams
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frontierStreams.map(stream => (
              <a
                key={stream.node.id}
                href={stream.href}
                class="border border-action/20 hover:border-action bg-void/raised rounded-lg p-4 transition-all duration-200 block"
              >
                <p class="font-semibold text-bone">{stream.node.title}</p>
                <p class="text-sm text-bone-muted mt-1 line-clamp-2">{stream.node.summary}</p>
                <p class="text-xs text-bone-muted mt-1">
                  Freshness: {stream.node.metrics.freshnessScore.toFixed(0)}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

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
