/**
 * /insights/visual-quality — Visual Quality Monitoring Dashboard
 *
 * Standalone route (no [lang] param). Displays pipeline quality KPIs,
 * CSS-only flow diagram, method distribution, and latest package feed.
 */
import { Fragment, component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

/* ── Mock data ── */

const KPIS = [
  { label: 'Gate Pass Rate', value: '94.7%', trend: '↑ 2.1%', trendUp: true },
  { label: 'Avg Package Size', value: '12.3 MB', trend: '↓ 8.7 MB', trendUp: false },
  { label: 'SVG vs AI Ratio', value: '78/22%', trend: '↑ 15%', trendUp: true },
  { label: 'Top Failure', value: 'File Size', trend: '34%', trendUp: false },
] as const

const PIPELINE = [
  { label: 'Content', rate: '100%' },
  { label: 'Template Select', rate: '98.2%' },
  { label: 'Generate', rate: '95.1%' },
  { label: 'Optimize', rate: '94.7%' },
  { label: 'Gate', rate: '94.7%' },
] as const

const METHODS = [
  { label: 'SVG', pct: 78, color: 'bg-cyan' },
  { label: 'Ideogram', pct: 15, color: 'bg-amber' },
  { label: 'Screenshot', pct: 5, color: 'bg-rose' },
  { label: 'Unsplash', pct: 2, color: 'bg-mid' },
] as const

const PACKAGES = [
  { name: 'hero-sunset-glow.svg', size: '8.2 MB', method: 'SVG', ok: true },
  { name: 'card-depth-layer.svg', size: '4.1 MB', method: 'SVG', ok: true },
  { name: 'icon-grid-cyber.svg', size: '2.7 MB', method: 'SVG', ok: true },
  { name: 'banner-neon-pulse.png', size: '15.8 MB', method: 'Ideogram', ok: true },
  {
    name: 'hero-flux-dark.png',
    size: '28.4 MB',
    method: 'Ideogram',
    ok: false,
    reason: 'File Size > 25 MB',
  },
  {
    name: 'bg-gradient-jpg.jpg',
    size: '3.1 MB',
    method: 'Screenshot',
    ok: false,
    reason: 'JPEG artifacts > 5%',
  },
] as const

/* ── Sub-components ── */

const KpiCard = component$<{ label: string; value: string; trend: string; trendUp: boolean }>(
  ({ label, value, trend, trendUp }) => (
    <div class="surface-panel rounded-xl p-5 flex flex-col gap-2">
      <span class="text-xs font-mono uppercase tracking-wider text-bone-muted">{label}</span>
      <span class="text-3xl font-display text-bone">{value}</span>
      <span class={`text-xs font-mono ${trendUp ? 'text-cyan' : 'text-rose'}`}>{trend}</span>
    </div>
  )
)

const PipelineFlow = component$(() => (
  <div class="surface-panel rounded-xl p-5">
    <h2 class="text-xs font-mono uppercase tracking-wider text-cyan mb-4">Pipeline Flow</h2>
    <div class="flex flex-wrap items-center gap-2 md:gap-3">
      {PIPELINE.map((stage, i) => (
        <Fragment key={stage.label}>
          <div class="flex flex-col items-center gap-1 min-w-[90px]">
            <span class="text-[10px] font-mono uppercase tracking-wider text-bone-muted">
              {stage.label}
            </span>
            <div class="w-full h-2 bg-void rounded-full overflow-hidden border border-bone/10">
              <div
                class="h-full bg-cyan rounded-full transition-[width]"
                style={{ width: stage.rate }}
              />
            </div>
            <span class="text-[10px] font-mono text-cyan">{stage.rate}</span>
          </div>
          {i < PIPELINE.length - 1 && (
            <span class="text-bone-muted text-xs shrink-0 self-start mt-4">→</span>
          )}
        </Fragment>
      ))}
    </div>
  </div>
))

const MethodBars = component$(() => (
  <div class="surface-panel rounded-xl p-5">
    <h2 class="text-xs font-mono uppercase tracking-wider text-cyan mb-4">Method Distribution</h2>
    <div class="flex flex-col gap-3">
      {METHODS.map(m => (
        <div key={m.label} class="flex items-center gap-3">
          <span class="text-xs font-mono text-bone w-20 shrink-0 text-right">{m.label}</span>
          <div class="flex-1 h-4 bg-void rounded-full overflow-hidden border border-bone/10">
            <div
              class={`h-full rounded-full ${m.color} transition-[width]`}
              style={{ width: `${m.pct}%` }}
            />
          </div>
          <span class="text-xs font-mono text-bone-muted w-10 shrink-0">{m.pct}%</span>
        </div>
      ))}
    </div>
  </div>
))

const PackageFeed = component$(() => (
  <div class="surface-panel rounded-xl p-5">
    <h2 class="text-xs font-mono uppercase tracking-wider text-cyan mb-4">Latest Packages</h2>
    <div class="flex flex-col gap-2">
      {PACKAGES.map(p => (
        <div
          key={p.name}
          class={`flex items-center gap-3 py-2 px-3 rounded-lg border text-xs font-mono ${
            p.ok ? 'border-bone/10 bg-void' : 'border-rose/20 bg-rose/5'
          }`}
        >
          <span class={p.ok ? 'text-cyan' : 'text-rose'}>{p.ok ? '✓' : '✗'}</span>
          <span class="text-bone truncate flex-1 min-w-0">{p.name}</span>
          <span class="text-bone-muted shrink-0">{p.size}</span>
          <span class="text-bone-muted shrink-0">{p.method}</span>
          {!p.ok && p.reason && <span class="text-rose shrink-0 hidden sm:inline">{p.reason}</span>}
        </div>
      ))}
    </div>
  </div>
))

/* ── Main page ── */

export default component$(() => {
  return (
    <div class="min-h-screen bg-void text-bone">
      <div class="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header class="mb-8">
          <p class="text-xs font-mono text-bone-muted uppercase tracking-wider mb-2">
            Pipeline Quality · Real-time Monitor
          </p>
          <h1 class="text-3xl md:text-4xl font-display text-bone mb-2">
            UniTeia <span class="text-cyan">Visual Quality</span> Command Center
          </h1>
          <p class="text-sm text-bone-muted max-w-2xl">
            Gate pass rates, package sizing, method distribution, and rejection feed for the visual
            asset pipeline. Updated every 15 minutes.
          </p>
        </header>

        {/* KPI Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPIS.map(kpi => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Pipeline Flow */}
        <div class="mb-8">
          <PipelineFlow />
        </div>

        {/* Method Distribution + Package Feed */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MethodBars />
          <PackageFeed />
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Visual Quality Command Center · UniTeia',
  meta: [
    {
      name: 'description',
      content:
        'Visual quality monitoring dashboard — pipeline KPIs, method distribution, and package rejection feed for the UniTeia editorial platform.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}
