/**
 * GenerativeHero — APEX-Powered Hero Section
 *
 * APEX is the umbrella signal at the frontier of AI. This hero always
 * leads with APEX (the section that defines the entire site) and lists
 * APEX's derivative signals as supporting tracks.
 *
 * Reads knowledge clusters from the homepage projection; resolves the
 * APEX cluster as the headline, surfaces all apex-* signals + the
 * magica-* / mcp-* support tooling as secondary chips.
 *
 * SSG-safe: all data is static, passed as props at build time.
 * No runtime API calls, no client-side data fetching.
 *
 * Color mapping:
 * - apex → oklch(78% 0.18 200) — bright cyan (primary brand)
 * - apex-* derivatives → oklch(70% 0.16 195) — cyan family
 * - magica-* / mcp-* → oklch(72% 0.165 80) — amber
 * - default → oklch(60% 0.2 265) — indigo
 */

import { component$ } from '@builder.io/qwik'
import type { KnowledgeCluster } from '~/content-graph/projections'
import type { SupportedLanguage } from '~/i18n/types'

export interface GenerativeHeroProps {
  class?: string
  clusters: KnowledgeCluster[]
  lang: SupportedLanguage
  t: {
    apexBadge: string // e.g. "APEX · Live"
    headline: string // e.g. "Frontier signals from {count} tracks"
    tracksLabel: string // e.g. "Active tracks"
    tracksLabelOne: string // e.g. "Active track"
    curating?: string // e.g. "Curating"
    topNiches?: string // e.g. "Top niches"
  }
}

const APEX_HUE = { h: 200, c: 0.18, l: 78 }
const APEX_DERIVATIVE_HUE = { h: 195, c: 0.16, l: 70 }
const MAGICA_HUE = { h: 80, c: 0.165, l: 72 }
const DEFAULT_HUE = { h: 265, c: 0.2, l: 60 }

function getNicheColor(nicheSlug: string): string {
  let c
  if (nicheSlug === 'apex') {
    c = APEX_HUE
  } else if (nicheSlug.startsWith('apex-')) {
    c = APEX_DERIVATIVE_HUE
  } else if (nicheSlug.startsWith('magica-') || nicheSlug === 'mcp') {
    c = MAGICA_HUE
  } else {
    c = DEFAULT_HUE
  }
  return `oklch(${c.l}% ${c.c} ${c.h})`
}

function getNicheColorDim(nicheSlug: string): string {
  let c
  if (nicheSlug === 'apex') {
    c = { h: 200, c: 0.15, l: 50 }
  } else if (nicheSlug.startsWith('apex-')) {
    c = { h: 195, c: 0.13, l: 45 }
  } else if (nicheSlug.startsWith('magica-') || nicheSlug === 'mcp') {
    c = { h: 80, c: 0.13, l: 45 }
  } else {
    c = { h: 265, c: 0.15, l: 45 }
  }
  return `oklch(${c.l}% ${c.c} ${c.h})`
}

function rankCluster(slug: string): number {
  if (slug === 'apex') return 0
  if (slug.startsWith('apex-')) return 1
  if (slug.startsWith('magica-') || slug === 'mcp') return 2
  return 3
}

export const GenerativeHero = component$<GenerativeHeroProps>(props => {
  const { class: classList, clusters, t } = props

  // Always lead with APEX; then apex-* derivatives; then supporting tracks
  const sorted = [...clusters].sort((a, b) => {
    const ra = rankCluster(a.nicheSlug)
    const rb = rankCluster(b.nicheSlug)
    if (ra !== rb) return ra - rb
    return b.articleCount - a.articleCount
  })

  const apex = sorted[0]
  const primaryColor = apex ? getNicheColor(apex.nicheSlug) : getNicheColor('default')
  const dimColor = apex ? getNicheColorDim(apex.nicheSlug) : getNicheColorDim('default')

  const totalArticles = clusters.reduce((sum, c) => sum + c.articleCount, 0)
  const activeTracks = clusters.filter(c => c.articleCount > 0).length

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
        {apex ? (
          <>
            <div class="flex items-center gap-3 mb-3">
              <span
                class="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-full border"
                style={{
                  borderColor: `color-mix(in srgb, ${primaryColor} 50%, transparent)`,
                  color: primaryColor,
                }}
              >
                <span
                  class="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: primaryColor }}
                  aria-hidden="true"
                />
                {t.apexBadge}
              </span>
            </div>
            <h1 class="text-2xl md:text-4xl font-display text-bone leading-tight text-wrap:balance">
              {t.headline.replace('{count}', String(activeTracks))}
            </h1>
            <p class="text-sm text-bone-muted mt-2 font-mono">
              {apex.label} · {totalArticles}{' '}
              {totalArticles === 1 ? (t.tracksLabelOne ?? t.tracksLabel) : t.tracksLabel}
            </p>
            <div class="flex flex-wrap gap-2 mt-4">
              {sorted.slice(0, 6).map(cluster => (
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
          <p class="text-bone-muted font-mono text-sm uppercase tracking-wider">{t.tracksLabel}</p>
        )}
      </div>
    </div>
  )
})
