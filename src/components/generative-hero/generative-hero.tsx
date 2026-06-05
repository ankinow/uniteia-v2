/**
 * GenerativeHero — Context-Aware Hero Section (Content-Graph Driven)
 *
 * Reads knowledge clusters from the homepage projection to determine
 * the top trending niche, then generates an adaptive gradient mesh
 * with locale-aware text.
 *
 * SSG-safe: all data is static, passed as props at build time.
 * No runtime API calls, no client-side data fetching.
 *
 * Color mapping per niche slug:
 * - apex → cyan (oklch 75% 0.18 200)
 * - prompt-engineering → amber (oklch 72% 0.165 80)
 * - default → indigo (oklch 60% 0.2 265)
 */

import { component$ } from '@builder.io/qwik'
import type { KnowledgeCluster } from '~/content-graph/projections'
import type { SupportedLanguage } from '~/i18n/types'

export interface GenerativeHeroProps {
  class?: string
  clusters: KnowledgeCluster[]
  lang: SupportedLanguage
  t: {
    curating: string // "Curating {niche} signals today"
    topNiches: string // "Top Niches"
  }
}

const NICHE_HUES: Record<string, { h: number; c: number; l: number }> = {
  apex: { h: 200, c: 0.18, l: 75 },
}

function getNicheColor(nicheSlug: string): string {
  const c = NICHE_HUES[nicheSlug] ?? { h: 265, c: 0.2, l: 60 }
  return `oklch(${c.l}% ${c.c} ${c.h})`
}

function getNicheColorDim(nicheSlug: string): string {
  const c = NICHE_HUES[nicheSlug] ?? { h: 265, c: 0.15, l: 45 }
  return `oklch(${c.l}% ${c.c} ${c.h})`
}

export const GenerativeHero = component$<GenerativeHeroProps>(props => {
  const { class: classList, clusters, t } = props

  // Determine top niche by article count
  const sorted = [...clusters].sort((a, b) => b.articleCount - a.articleCount)
  const topNiche = sorted[0]

  const primaryColor = topNiche ? getNicheColor(topNiche.nicheSlug) : getNicheColor('default')
  const dimColor = topNiche ? getNicheColorDim(topNiche.nicheSlug) : getNicheColorDim('default')

  return (
    <div
      class={['generative-hero relative overflow-hidden rounded-3xl p-8 md:p-12', classList]}
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, ${primaryColor} 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 40%, ${dimColor} 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 50% 80%, oklch(25% 0.04 260 / 0.3) 0%, transparent 50%)
        `,
      }}
    >
      {/* Grain overlay */}
      <div
        class="grain-4k absolute inset-0 pointer-events-none z-0 opacity-20"
        aria-hidden="true"
      />

      <div class="relative z-10">
        {topNiche ? (
          <>
            <p class="text-sm font-mono uppercase tracking-[0.2em] text-bone-muted mb-3">
              {t.topNiches}
            </p>
            <h1 class="text-2xl md:text-4xl font-display text-bone leading-tight text-wrap:balance">
              {t.curating.replace('{niche}', topNiche.label)}
            </h1>
            <div class="flex flex-wrap gap-2 mt-4">
              {sorted.slice(0, 3).map(cluster => (
                <a
                  key={cluster.nicheSlug}
                  href={cluster.href}
                  class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: `color-mix(in srgb, ${getNicheColor(cluster.nicheSlug)} 40%, transparent)`,
                    color: getNicheColor(cluster.nicheSlug),
                  }}
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getNicheColor(cluster.nicheSlug) }}
                    aria-hidden="true"
                  />
                  {cluster.label}
                  <span class="opacity-50">· {cluster.articleCount}</span>
                </a>
              ))}
            </div>
          </>
        ) : (
          <p class="text-bone-muted font-mono text-sm uppercase tracking-wider">{t.topNiches}</p>
        )}
      </div>
    </div>
  )
})
