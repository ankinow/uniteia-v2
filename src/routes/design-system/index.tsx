/**
 * UniTeia v2 — Design System Gallery
 *
 * Standalone route (no [lang] param, English only for documentation).
 * Renders all major visual components with descriptions, props tables,
 * and live examples.
 *
 * Route: /design-system
 */

import { Slot, component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

import { AgentStatus } from '~/components/agent-status'
import { Avatar } from '~/components/avatar'
import { BentoCell, BentoGrid } from '~/components/bento-grid'
import { CanvasSurface } from '~/components/canvas-surface'
import {
  ALL_VARIANTS as CINEMATIC_VARIANTS,
  CinematicDepthCard,
} from '~/components/cinematic-depth-card'
import { DepthTilt } from '~/components/depth-tilt'
import { EditorialVerdict } from '~/components/editorial-verdict'
import type { VerdictLevel } from '~/components/editorial-verdict/types'
import { MasterOpenCanvas } from '~/components/master-open-canvas'
import { ScratchDivider } from '~/components/scratch-divider'
import { ScrollReveal } from '~/components/scroll-reveal'
import { ALL_VARIANTS, SignalChip } from '~/components/signal-chip'

// ── Inline DopamineCard display (avoids i18n/store deps outside [lang] routes) ──

const DopamineCardDemo = component$<{ title: string; description: string }>(
  ({ title, description }) => (
    <div class="group relative flex flex-col gap-3 rounded-lg border border-action/20 bg-raised p-4 shadow-d1 h-full">
      <div class="flex items-start gap-3">
        <div
          class="w-5 h-5 rounded bg-cyan/20 flex items-center justify-center text-xs text-cyan"
          aria-hidden="true"
        >
          *
        </div>
        <h3 class="text-base font-semibold text-bone group-hover:text-action transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
      </div>
      <p class="text-sm text-bone leading-relaxed line-clamp-3">{description}</p>
      <div class="mt-auto flex items-center justify-between pt-2">
        <span class="ml-auto text-xs text-action group-hover:text-action-hi transition-colors duration-200">
          Read more →
        </span>
      </div>
    </div>
  )
)

// ── Inline GenerativeHero display (mock data for standalone route) ──
//
// APEX is the only section that powers the entire site. This demo
// surfaces APEX as the headline + the live apex-* derivatives, then
// the magica-* / mcp-* support tracks as chips. Mirrors the real
// GenerativeHero component (kept in sync with src/components/generative-hero/).

const GenerativeHeroDemo = component$(() => {
  const mockClusters = [
    { nicheSlug: 'apex', label: 'Apex Signal', href: '/en/signals/apex', articleCount: 24 },
    {
      nicheSlug: 'apex-overview',
      label: 'Apex Overview',
      href: '/en/signals/apex-overview',
      articleCount: 8,
    },
    {
      nicheSlug: 'apex-quickstart',
      label: 'Apex Quickstart',
      href: '/en/signals/apex-quickstart',
      articleCount: 12,
    },
    { nicheSlug: 'apex-flow', label: 'Apex Flow', href: '/en/signals/apex-flow', articleCount: 6 },
    { nicheSlug: 'magica', label: 'Magica', href: '/en/signals/magica', articleCount: 9 },
    { nicheSlug: 'mcp', label: 'MCP', href: '/en/signals/mcp', articleCount: 15 },
  ]

  const NICHE_HUES: Record<string, { h: number; c: number; l: number }> = {
    apex: { h: 200, c: 0.18, l: 78 },
    'apex-overview': { h: 195, c: 0.16, l: 70 },
    'apex-quickstart': { h: 195, c: 0.16, l: 70 },
    'apex-flow': { h: 195, c: 0.16, l: 70 },
    magica: { h: 80, c: 0.165, l: 72 },
    mcp: { h: 80, c: 0.165, l: 72 },
  }

  const rankCluster = (slug: string): number => {
    if (slug === 'apex') return 0
    if (slug.startsWith('apex-')) return 1
    if (slug.startsWith('magica-') || slug === 'mcp') return 2
    return 3
  }

  const sorted = [...mockClusters].sort((a, b) => {
    const ra = rankCluster(a.nicheSlug)
    const rb = rankCluster(b.nicheSlug)
    if (ra !== rb) return ra - rb
    return b.articleCount - a.articleCount
  })

  const getNicheColor = (slug: string): string => {
    const c = NICHE_HUES[slug] ?? { h: 265, c: 0.2, l: 60 }
    return `oklch(${c.l}% ${c.c} ${c.h})`
  }

  const getNicheColorDim = (slug: string): string => {
    const c = NICHE_HUES[slug] ?? { h: 265, c: 0.15, l: 45 }
    return `oklch(${c.l * 0.6}% ${c.c * 0.85} ${c.h})`
  }

  const apex = sorted[0]!
  const primaryColor = getNicheColor(apex.nicheSlug)
  const dimColor = getNicheColorDim(apex.nicheSlug)
  const totalArticles = mockClusters.reduce((s, c) => s + c.articleCount, 0)
  const activeTracks = mockClusters.filter(c => c.articleCount > 0).length

  return (
    <div
      class="relative overflow-hidden rounded-3xl p-8 md:p-12"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, ${primaryColor} 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 40%, ${dimColor} 0%, transparent 60%),
          radial-gradient(ellipse 70% 50% at 50% 80%, oklch(25% 0.04 260 / 0.3) 0%, transparent 50%)
        `,
      }}
    >
      <div class="relative z-10">
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
            APEX · Live
          </span>
        </div>
        <h1 class="text-2xl md:text-4xl font-display text-bone leading-tight text-wrap:balance">
          Frontier signals from {activeTracks} tracks
        </h1>
        <p class="text-sm text-bone-muted mt-2 font-mono">
          {apex.label} · {totalArticles} active articles
        </p>
        <div class="flex flex-wrap gap-2 mt-4">
          {sorted.slice(0, 6).map(cluster => (
            <span
              key={cluster.nicheSlug}
              class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border"
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
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})

// ── Inline LivingBrief2Col display (mock data for standalone route) ──

const LivingBrief2ColDemo = component$(() => (
  <div class="living-brief-2col flex flex-col md:flex-row min-h-[400px] w-full rounded-xl overflow-hidden border border-action/10">
    {/* Left Panel — Hero */}
    <div
      class="w-full md:w-[35%] flex-shrink-0 p-6 md:p-8 flex flex-col justify-center"
      style={{
        background: 'linear-gradient(135deg, oklch(0.12 0.02 280), oklch(0.18 0.03 280))',
      }}
    >
      <h2
        class="text-2xl md:text-3xl font-display text-bone mb-3"
        style={{ color: 'oklch(0.85 0.15 75)' }}
      >
        The Living Brief
      </h2>
      <p class="text-sm text-bone-muted mb-4" style={{ color: 'oklch(0.65 0.12 280)' }}>
        Editorial command center — a 2-column layout with a dark hero panel and a parchment collage.
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        {['uniteia', 'editorial', 'ai-platform'].map(tag => (
          <span key={tag} class="text-xs font-mono text-bone-muted">
            #{tag}
          </span>
        ))}
      </div>
      <button
        type="button"
        class="px-4 py-2 bg-cyan/20 border border-cyan/50 text-white hover:bg-cyan/30 transition-colors text-xs uppercase tracking-wider self-start"
      >
        Explore
      </button>
    </div>
    {/* Right Panel — Collage */}
    <div
      class="w-full md:w-[65%] flex-1 p-6 md:p-8"
      style={{
        background: 'oklch(0.93 0.03 75)',
        color: 'oklch(0.15 0.02 75)',
      }}
    >
      <p class="font-mono text-sm uppercase tracking-wider mb-4" style={{ opacity: 0.6 }}>
        Collage Area
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div
          class="border-2 border-dashed p-4 text-center"
          style={{ borderColor: 'oklch(0.8 0.04 75)', color: 'oklch(0.4 0.02 75)' }}
        >
          📸 Polaroid
        </div>
        <div
          class="border-2 border-dashed p-4 text-center"
          style={{ borderColor: 'oklch(0.8 0.04 75)', color: 'oklch(0.4 0.02 75)' }}
        >
          📝 Annotation
        </div>
        <div
          class="border-2 border-dashed p-4 text-center col-span-2"
          style={{ borderColor: 'oklch(0.8 0.04 75)', color: 'oklch(0.4 0.02 75)' }}
        >
          ➡️ Arrow flow connection
        </div>
      </div>
    </div>
  </div>
))

// ── Section wrapper ──

const SectionHeading = component$<{ title: string; description: string }>(
  ({ title, description }) => (
    <div class="mb-6">
      <h2 class="text-2xl font-display text-bone mb-2">{title}</h2>
      <p class="text-sm text-bone-muted font-mono">{description}</p>
    </div>
  )
)

const PropsTable = component$<{
  props: { name: string; type: string; default?: string; description: string }[]
}>(({ props }) => (
  <div class="mb-6 overflow-x-auto">
    <table class="w-full text-xs font-mono border-collapse">
      <thead>
        <tr class="border-b border-action/20">
          <th class="text-left py-2 px-3 text-bone-muted font-normal uppercase tracking-wider">
            Prop
          </th>
          <th class="text-left py-2 px-3 text-bone-muted font-normal uppercase tracking-wider">
            Type
          </th>
          <th class="text-left py-2 px-3 text-bone-muted font-normal uppercase tracking-wider">
            Default
          </th>
          <th class="text-left py-2 px-3 text-bone-muted font-normal uppercase tracking-wider">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {props.map(p => (
          <tr key={p.name} class="border-b border-action/5 hover:bg-action/5">
            <td class="py-2 px-3 text-cyan font-semibold">{p.name}</td>
            <td class="py-2 px-3 text-gold">{p.type}</td>
            <td class="py-2 px-3 text-bone-muted">{p.default ?? '—'}</td>
            <td class="py-2 px-3 text-bone">{p.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))

const ComponentSection = component$<{
  title: string
  description: string
  props: { name: string; type: string; default?: string; description: string }[]
}>(({ title, description, props }) => (
  <section class="py-10 border-b border-action/10 last:border-b-0">
    <SectionHeading title={title} description={description} />
    <PropsTable props={props} />
    <div class="mt-6">
      <p class="text-xs font-mono text-bone-muted uppercase tracking-wider mb-3">Live Example</p>
      <div class="p-6 rounded-lg border border-action/10 bg-[oklch(0.14_0.02_280)/0.5]">
        <Slot />
      </div>
    </div>
  </section>
))

// ── Main Page ──

export default component$(() => {
  return (
    <div class="min-h-screen bg-[oklch(0.18_0.02_280)] text-bone">
      <div class="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Page Header */}
        <header class="mb-12 pb-8 border-b border-action/20">
          <h1 class="text-4xl md:text-5xl font-display text-bone mb-3">
            UniTeia <span class="text-cyan">Design System</span>
          </h1>
          <p class="text-base text-bone-muted max-w-2xl">
            Component gallery for UniTeia v2 — Aether OS editorial platform. Each section shows the
            component, its props interface, and a live rendered example.
          </p>
          <div class="flex gap-2 mt-4">
            <span class="inline-flex px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-cyan/30 text-cyan rounded-sm">
              52+ Components
            </span>
            <span class="inline-flex px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-gold/30 text-gold rounded-sm">
              Qwik City
            </span>
            <span class="inline-flex px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-verified/30 text-verified rounded-sm">
              Tailwind v4
            </span>
          </div>
        </header>

        {/* ── 1. SignalChip ── */}
        <ComponentSection
          title="SignalChip"
          description="Agent-intent signal badge with metric, label, trend indicator, and color-coded variant. Used across the Aether OS signal grid."
          props={[
            { name: 'metric', type: 'number', description: 'Numeric value to display' },
            { name: 'label', type: 'string', description: 'Text label for the chip' },
            {
              name: 'trend',
              type: "'up' | 'down' | 'stable'",
              default: "'stable'",
              description: 'Trend direction indicator',
            },
            {
              name: 'variant',
              type: "'moderator' | 'researcher' | 'writer' | 'curator' | 'analyst'",
              default: "'moderator'",
              description: 'Agent-intent color variant',
            },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <div class="flex flex-wrap gap-3 items-center">
            {ALL_VARIANTS.map(variant => (
              <SignalChip
                key={variant}
                variant={variant}
                metric={Math.floor(Math.random() * 100) + 1}
                label={variant}
                trend={variant === 'analyst' ? 'down' : variant === 'curator' ? 'up' : 'stable'}
              />
            ))}
          </div>
        </ComponentSection>

        {/* ── 2. AgentStatus ── */}
        <ComponentSection
          title="AgentStatus"
          description="Agentic status indicator with 5 states: idle, thinking, processing, complete, error. Each state has a unique visual icon and color."
          props={[
            {
              name: 'state',
              type: "'idle' | 'thinking' | 'processing' | 'complete' | 'error'",
              default: "'idle'",
              description: 'Current agent state',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size variant',
            },
            { name: 'label', type: 'string', default: '—', description: 'Explicit label override' },
            { name: 'accent', type: 'string', default: '—', description: 'CSS color override' },
            {
              name: 'compact',
              type: 'boolean',
              default: 'false',
              description: 'Hide label, show icon only',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap gap-4 items-center">
              <AgentStatus state="idle" size="sm" />
              <AgentStatus state="thinking" size="sm" />
              <AgentStatus state="processing" size="sm" />
              <AgentStatus state="complete" size="sm" />
              <AgentStatus state="error" size="sm" />
            </div>
            <div class="flex flex-wrap gap-4 items-center">
              <AgentStatus state="idle" size="md" label="Idle" />
              <AgentStatus state="thinking" size="md" label="Thinking" />
              <AgentStatus state="processing" size="md" label="Processing" />
              <AgentStatus state="complete" size="md" label="Complete" />
              <AgentStatus state="error" size="md" label="Error" />
            </div>
            <div class="flex flex-wrap gap-4 items-center">
              <AgentStatus state="idle" compact />
              <AgentStatus state="thinking" compact />
              <AgentStatus state="processing" compact />
              <AgentStatus state="complete" compact />
              <AgentStatus state="error" compact />
            </div>
          </div>
        </ComponentSection>

        {/* ── 3. DepthTilt ── */}
        <ComponentSection
          title="DepthTilt"
          description="Mouse-reactive 3D perspective tilt wrapper (Apple-like card tilt). Wraps children and applies CSS 3D transform based on pointer position."
          props={[
            {
              name: 'maxTilt',
              type: 'number',
              default: '8',
              description: 'Maximum rotation angle (degrees)',
            },
            {
              name: 'perspective',
              type: 'number',
              default: '1000',
              description: 'CSS perspective in pixels',
            },
            {
              name: 'scale',
              type: 'number',
              default: '1.01',
              description: 'Scale factor on hover',
            },
            {
              name: 'glare',
              type: 'boolean',
              default: 'true',
              description: 'Show radial glare highlight',
            },
            { name: 'speed', type: 'number', default: '300', description: 'Transition speed (ms)' },
            {
              name: 'triggerMode',
              type: "'hover' | 'always' | 'motion'",
              default: "'hover'",
              description: 'When to activate tilt',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <DepthTilt maxTilt={8} perspective={1000} scale={1.02} glare speed={300}>
            <div class="bg-[oklch(0.2_0.04_280)] border border-cyan/20 rounded-lg p-6 max-w-sm cursor-pointer select-none">
              <div class="text-lg font-display text-bone mb-2">Interactive Tilt Card</div>
              <p class="text-sm text-bone-muted">
                Move your cursor over this card to see the 3D tilt effect with glare.
              </p>
              <div class="mt-3 flex gap-2">
                <span class="text-xs font-mono text-cyan">hover me</span>
                <span class="text-xs font-mono text-gold">{'\u2197'} tilt</span>
              </div>
            </div>
          </DepthTilt>
        </ComponentSection>

        {/* ── 4. ScrollReveal ── */}
        <ComponentSection
          title="ScrollReveal"
          description="IntersectionObserver-based stagger reveal animation. Each child element is revealed sequentially as it enters the viewport with configurable direction and timing."
          props={[
            {
              name: 'direction',
              type: "'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'",
              default: "'up'",
              description: 'Animation direction',
            },
            {
              name: 'threshold',
              type: 'number',
              default: '0.1',
              description: 'Intersection threshold',
            },
            {
              name: 'rootMargin',
              type: 'string',
              default: "'0px 0px -50px 0px'",
              description: 'Intersection root margin',
            },
            {
              name: 'staggerDelay',
              type: 'number',
              default: '100',
              description: 'Delay between each child (ms)',
            },
            {
              name: 'duration',
              type: 'number',
              default: '500',
              description: 'Animation duration (ms)',
            },
            { name: 'once', type: 'boolean', default: 'true', description: 'Animate only once' },
            {
              name: 'as',
              type: "'div' | 'section' | 'article' | 'ul' | 'ol'",
              default: "'div'",
              description: 'Container element type',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <ScrollReveal direction="up" staggerDelay={100} duration={500}>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                class="bg-[oklch(0.18_0.03_280)] border border-action/10 rounded p-4 mb-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-cyan/20 flex items-center justify-center text-cyan font-mono text-sm">
                    {i}
                  </div>
                  <div>
                    <div class="text-sm font-display text-bone">Reveal Item {i}</div>
                    <div class="text-xs text-bone-muted">Scroll to see stagger animation</div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </ComponentSection>

        {/* ── 5. CinematicDepthCard ── */}
        <ComponentSection
          title="CinematicDepthCard"
          description="Depth-enhanced card with variants (logic, insight, flow). Includes glass surface, border bloom, grain overlay, and optional focus glow."
          props={[
            {
              name: 'variant',
              type: "'logic' | 'insight' | 'flow'",
              default: "'flow'",
              description: 'Visual variant',
            },
            {
              name: 'glowOnFocus',
              type: 'boolean',
              default: 'false',
              description: 'Enable focus glow effect',
            },
            {
              name: 'elevated',
              type: 'boolean',
              default: 'false',
              description: 'Elevated shadow depth',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CINEMATIC_VARIANTS.map(variant => (
              <CinematicDepthCard key={variant} variant={variant} elevated>
                <div class="p-4">
                  <div class="text-xs font-mono uppercase tracking-wider text-bone-muted mb-1">
                    {variant}
                  </div>
                  <div class="text-lg font-display text-bone">
                    {variant === 'logic'
                      ? '\uD83E\uDDE0'
                      : variant === 'insight'
                        ? '\uD83D\uDCA1'
                        : '\uD83C\uDF0A'}{' '}
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </div>
                  <p class="text-sm text-bone-muted mt-2">
                    {variant === 'logic' && 'Structured reasoning and analysis'}
                    {variant === 'insight' && 'Creative breakthroughs and patterns'}
                    {variant === 'flow' && 'Continuous narrative and motion'}
                  </p>
                </div>
              </CinematicDepthCard>
            ))}
          </div>
        </ComponentSection>

        {/* ── 6. DopamineCard ── */}
        <ComponentSection
          title="DopamineCard"
          description="Route-aware content card with dopamine budget whisper system. Shows interactive hover lift and route budget tracking."
          props={[
            { name: 'title', type: 'string', description: 'Card title' },
            { name: 'description', type: 'string', description: 'Card description' },
            { name: 'href', type: 'string', description: 'Link destination' },
            { name: 'icon', type: 'string', default: '—', description: 'Lucide icon name' },
            { name: 'lang', type: 'SupportedLanguage', description: 'Locale for i18n' },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DopamineCardDemo
              title="Apex Signal Monitor"
              description="Real-time monitoring of apex signals across all niches with trend analysis and anomaly detection."
            />
            <DopamineCardDemo
              title="Editorial Pipeline"
              description="End-to-end editorial workflow from content generation through quality gates to publication."
            />
            <DopamineCardDemo
              title="Agent Dashboard"
              description="Control panel for the Aether OS multi-agent system with live status and resource allocation."
            />
          </div>
        </ComponentSection>

        {/* ── 7. Avatar ── */}
        <ComponentSection
          title="Avatar"
          description="SVG sprite icon wrapper using uniteia-avatars.svg. Provides accessible avatar icons with variant colors and size options."
          props={[
            {
              name: 'variant',
              type: "'robot' | 'human' | 'builder' | 'thinker' | 'neon' | 'badge' | 'star' | 'bulb'",
              default: "'robot'",
              description: 'Avatar visual variant',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg' | 'xl'",
              default: "'md'",
              description: 'Size option',
            },
            { name: 'label', type: 'string', default: '—', description: 'Accessible aria-label' },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <div class="flex flex-wrap gap-4 items-center">
            {(
              ['robot', 'human', 'builder', 'thinker', 'neon', 'badge', 'star', 'bulb'] as const
            ).map(v => (
              <div key={v} class="flex flex-col items-center gap-1">
                <Avatar variant={v} size="md" />
                <span class="text-[10px] font-mono text-bone-muted">{v}</span>
              </div>
            ))}
          </div>
          <div class="flex flex-wrap gap-4 items-center mt-4">
            <div class="flex flex-col items-center gap-1">
              <Avatar variant="robot" size="sm" />
              <span class="text-[10px] font-mono text-bone-muted">sm</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Avatar variant="robot" size="md" />
              <span class="text-[10px] font-mono text-bone-muted">md</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Avatar variant="robot" size="lg" />
              <span class="text-[10px] font-mono text-bone-muted">lg</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <Avatar variant="robot" size="xl" />
              <span class="text-[10px] font-mono text-bone-muted">xl</span>
            </div>
          </div>
        </ComponentSection>

        {/* ── 8. EditorialVerdict ── */}
        <ComponentSection
          title="EditorialVerdict"
          description="Editorial trust indicator badge with three levels: trusted (green), caution (yellow), flagged (red). Used in article headers and signal cards."
          props={[
            {
              name: 'verdict',
              type: "'trusted' | 'caution' | 'flagged'",
              description: 'Verdict level',
            },
            { name: 'lang', type: 'SupportedLanguage', description: 'Locale for i18n labels' },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <div class="flex flex-wrap gap-4 items-center">
            {(['trusted', 'caution', 'flagged'] as VerdictLevel[]).map(v => (
              <EditorialVerdict key={v} verdict={v} lang="en" />
            ))}
          </div>
        </ComponentSection>

        {/* ── 9. AetherAmbient ── */}
        <ComponentSection
          title="AetherAmbient"
          description="Canvas2D animated grain/fog/vortex overlay. Procedural visual texture that runs on a requestAnimationFrame loop. Auto-pauses on reduced-motion preference."
          props={[
            {
              name: 'mode',
              type: "'grain' | 'fog' | 'vortex'",
              default: "'grain'",
              description: 'Noise generation mode',
            },
            { name: 'opacity', type: 'number', default: '0.04', description: 'Overlay opacity' },
            {
              name: 'blendMode',
              type: "'overlay' | 'multiply' | 'screen' | 'normal'",
              default: "'overlay'",
              description: 'CSS mix-blend-mode',
            },
            {
              name: 'density',
              type: 'number',
              default: '1.0',
              description: 'Noise density (0.0-1.0)',
            },
            {
              name: 'speed',
              type: 'number',
              default: '1.0',
              description: 'Animation speed multiplier',
            },
            {
              name: 'color',
              type: 'string',
              default: '—',
              description: 'Optional OKLCH tint color',
            },
            {
              name: 'grainSize',
              type: 'number',
              default: '3',
              description: 'Pixel block size for performance',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="relative h-[200px] rounded-lg overflow-hidden border border-action/10 bg-[oklch(0.12_0.02_280)]">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <p class="text-sm font-mono text-bone-muted">AetherAmbient - Grain mode</p>
                <p class="text-xs text-bone-muted/60 mt-1">Canvas2D procedural noise overlay</p>
                <p class="text-xs text-bone-muted/50 mt-2 italic">
                  (Uses `fixed` positioning - renders full viewport when active)
                </p>
              </div>
            </div>
          </div>
        </ComponentSection>

        {/* ── 10. BioOrganicOverlay ── */}
        <ComponentSection
          title="BioOrganicOverlay"
          description="Canvas2D procedural slow-growing L-system light branches. Grows organic branch structures toward cursor on hover with emerald-green coloring."
          props={[
            { name: 'opacity', type: 'number', default: '0.15', description: 'Overlay opacity' },
            {
              name: 'branchCount',
              type: 'number',
              default: '3',
              description: 'Number of branch roots',
            },
            {
              name: 'growthSpeed',
              type: 'number',
              default: '1',
              description: 'Branch growth speed multiplier',
            },
            {
              name: 'color',
              type: 'string',
              default: "'oklch(65% 0.15 140)'",
              description: 'OKLCH branch color',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="relative h-[200px] rounded-lg overflow-hidden border border-action/10 bg-[oklch(0.12_0.02_280)] flex items-center justify-center">
            <p class="text-sm font-mono text-bone-muted">
              BioOrganicOverlay - Hover to grow branches (Canvas2D)
            </p>
          </div>
        </ComponentSection>

        {/* ── 11. GenerativeHero ── */}
        <ComponentSection
          title="GenerativeHero"
          description="Context-aware hero section that reads knowledge clusters and generates an adaptive gradient mesh with locale-aware text and niche badge links."
          props={[
            {
              name: 'clusters',
              type: 'KnowledgeCluster[]',
              description: 'Knowledge clusters for trending niche detection',
            },
            { name: 'lang', type: 'SupportedLanguage', description: 'Locale for text rendering' },
            {
              name: 't',
              type: '{ curating: string; topNiches: string }',
              description: 'Translation keys for text content',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <GenerativeHeroDemo />
        </ComponentSection>

        {/* ── 12. LivingBrief2Col ── */}
        <ComponentSection
          title="LivingBrief2Col"
          description="Two-column editorial layout: left 35% dark hero panel with glowing title and CTA, right 65% parchment collage with polaroids, arrows, bonecos, labels, and decorative elements."
          props={[
            {
              name: 'hero',
              type: 'LivingBriefHeroProps',
              description: 'Left panel - title, subtitle, hashtags, buttons',
            },
            {
              name: 'collage',
              type: 'LivingBriefCollageProps',
              default: '—',
              description: 'Right panel - polaroids, arrows, labels, bonecos',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <LivingBrief2ColDemo />
        </ComponentSection>

        {/* ── 13. MasterOpenCanvas ── */}
        <ComponentSection
          title="MasterOpenCanvas"
          description="Mixed-media depth canvas with 5-tier variant system: subtle, medium, rich, parchment, obsidian. Features WAAPI spring tilt, corkboard, paper texture, grain overlay, and sticky notes."
          props={[
            {
              name: 'variant',
              type: "'subtle' | 'medium' | 'rich' | 'parchment' | 'obsidian'",
              default: "'medium'",
              description: 'Visual intensity tier',
            },
            { name: 'title', type: 'string', default: '—', description: 'Canvas title heading' },
            {
              name: 'decisionNodes',
              type: 'DecisionNode[]',
              default: '—',
              description: 'Decision flow nodes for DecisionMap',
            },
            {
              name: 'showStickyNote',
              type: 'boolean',
              default: '—',
              description: 'Show sticky note overlay',
            },
            {
              name: 'showCardboard',
              type: 'boolean',
              default: '—',
              description: 'Show cardboard texture layer',
            },
            {
              name: 'static',
              type: 'boolean',
              default: '—',
              description: 'Force static (no tilt animation)',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MasterOpenCanvas variant="subtle" title="Subtle">
              <p class="text-sm text-bone-muted">
                Minimal hint variant with slight grain and no tilt.
              </p>
            </MasterOpenCanvas>
            <MasterOpenCanvas variant="medium" title="Medium" showCardboard>
              <p class="text-sm text-bone-muted">
                Corkboard + paper + ink texture, ±5° WAAPI tilt.
              </p>
            </MasterOpenCanvas>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MasterOpenCanvas variant="parchment" title="Parchment" static>
              <p class="text-sm text-bone-muted">
                Static parchment zone - no tilt, paper-colored surface.
              </p>
            </MasterOpenCanvas>
            <MasterOpenCanvas variant="obsidian" title="Obsidian" static>
              <p class="text-sm text-bone-muted">Dark chrome zone - static, dark glass surface.</p>
            </MasterOpenCanvas>
          </div>
        </ComponentSection>

        {/* ── 14. CanvasSurface ── */}
        <ComponentSection
          title="CanvasSurface"
          description="HTML-in-Canvas progressive enhancement wrapper. Chrome Origin Trial drawElementImage API with feTurbulence parchment noise shader. Falls back to MasterOpenCanvas parchment."
          props={[
            {
              name: 'tone',
              type: "'parchment' | 'obsidian' | 'glass'",
              default: "'parchment'",
              description: 'Visual tone for fallback',
            },
            { name: 'class', type: 'string', default: '—', description: 'Additional CSS classes' },
          ]}
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CanvasSurface tone="parchment">
              <div class="p-4">
                <div class="text-lg font-display mb-2" style={{ color: 'oklch(0.2 0.02 75)' }}>
                  Parchment
                </div>
                <p class="text-sm" style={{ color: 'oklch(0.35 0.02 75)' }}>
                  Warm paper tone with grain texture.
                </p>
              </div>
            </CanvasSurface>
            <CanvasSurface tone="obsidian">
              <div class="p-4">
                <div class="text-lg font-display text-bone mb-2">Obsidian</div>
                <p class="text-sm text-bone-muted">Dark glass tone with chrome surface.</p>
              </div>
            </CanvasSurface>
            <CanvasSurface tone="glass">
              <div class="p-4">
                <div class="text-lg font-display text-bone mb-2">Glass</div>
                <p class="text-sm text-bone-muted">Standard glassmorphism surface.</p>
              </div>
            </CanvasSurface>
          </div>
        </ComponentSection>

        {/* ── 15. StoryboardGrid ── */}
        <ComponentSection
          title="StoryboardGrid"
          description="Editorial CSS Grid layout with SVG arrow connectors. Used in articles to render visual storyboards with cells, arrows, and texture overlays."
          props={[
            {
              name: 'layout',
              type: 'ResolvedLayout',
              description: 'Grid layout with cells, arrows, template areas',
            },
          ]}
        >
          <div class="rounded-lg border border-action/10 p-4 bg-[oklch(0.14_0.02_280)]">
            <p class="text-sm font-mono text-bone-muted mb-3">
              StoryboardGrid requires a <code class="text-cyan">ResolvedLayout</code> object with
              cells and grid templates. Below is a static representation:
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="border border-cyan/30 rounded p-3 bg-[oklch(0.18_0.03_280)]">
                <div class="text-xs font-mono text-cyan mb-1">Cell: intro</div>
                <p class="text-xs text-bone-muted">
                  Introduction cell - the starting point of the narrative flow.
                </p>
              </div>
              <div class="border border-gold/30 rounded p-3 bg-[oklch(0.18_0.03_280)]">
                <div class="text-xs font-mono text-gold mb-1">Cell: development</div>
                <p class="text-xs text-bone-muted">
                  Development cell - connected from intro via SVG arrow.
                </p>
              </div>
              <div class="border border-verified/30 rounded p-3 bg-[oklch(0.18_0.03_280)] col-span-2">
                <div class="text-xs font-mono text-verified mb-1">Cell: conclusion</div>
                <p class="text-xs text-bone-muted">
                  Conclusion cell - final destination of the storyboard path.
                </p>
              </div>
            </div>
          </div>
        </ComponentSection>

        {/* ── 16. ScratchDivider ── */}
        <ComponentSection
          title="ScratchDivider"
          description="Hand-drawn scratch divider with configurable tone and orientation. Used as decorative separators between sections."
          props={[
            {
              name: 'tone',
              type: "'action' | 'curation' | 'verified' | 'muted'",
              default: "'action'",
              description: 'Color tone',
            },
            { name: 'surface', type: 'string', default: '—', description: 'Surface context' },
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: 'Divider direction',
            },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <div class="space-y-4">
            <div>
              <p class="text-xs font-mono text-bone-muted mb-2">
                Horizontal (default, action tone)
              </p>
              <ScratchDivider tone="action" />
            </div>
            <div>
              <p class="text-xs font-mono text-bone-muted mb-2">
                Horizontal (verified tone, surface="dark")
              </p>
              <ScratchDivider tone="verified" surface="dark" />
            </div>
          </div>
        </ComponentSection>

        {/* ── 17. Additional Components ── */}
        <ComponentSection
          title="Additional Components"
          description="The following components are also available in the UniTeia v2 component library but require specific data contexts or are used internally by other components:"
          props={[]}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'AnalogConnector', desc: 'SVG edge connector between nodes' },
              { name: 'AetherCanvasEngine', desc: 'Canvas-based visual graph editor engine' },
              { name: 'DecisionMap', desc: 'Decision flow diagram for lesson plans' },
              { name: 'DepthSurface', desc: '2.5D depth surface wrapper component' },
              { name: 'Footer', desc: 'Site footer with links and branding' },
              { name: 'HudLabel', desc: 'HUD-style label badge' },
              { name: 'LangSwitcher', desc: 'Language selection switcher' },
              { name: 'NavTree', desc: 'Hierarchical navigation tree' },
              { name: 'NicheCard', desc: 'Niche topic preview card' },
              { name: 'QualityRing', desc: 'Quality score ring indicator' },
              { name: 'SignalGrid', desc: 'Signal data grid layout' },
              { name: 'SiteShell', desc: 'Root layout shell wrapper' },
            ].map(c => (
              <div key={c.name} class="border border-action/10 rounded p-3">
                <div class="text-sm font-mono text-cyan mb-1">{c.name}</div>
                <p class="text-xs text-bone-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </ComponentSection>

        {/* ── 18. BentoGrid + BentoCell (R28 island showcase) ── */}
        <ComponentSection
          title="BentoGrid + BentoCell"
          description="Modular CSS Grid layout (SOTA 2026) with size variants — featured (2x2), wide (2x1), tall (1x2), default (1x1). Container queries collapse wide/featured to single column on narrow viewports. 0KB JS — purely structural."
          props={[
            {
              name: 'minCellWidth',
              type: 'string',
              default: "'280px'",
              description: 'Minimum cell width (auto-fit)',
            },
            {
              name: 'cellHeight',
              type: 'string',
              default: "'200px'",
              description: 'Grid auto-rows height',
            },
            {
              name: 'gap',
              type: 'string',
              default: "'1rem'",
              description: 'Grid gap',
            },
            {
              name: 'class',
              type: 'ClassList',
              default: '—',
              description: 'Additional CSS classes',
            },
          ]}
        >
          <BentoGrid minCellWidth="180px" cellHeight="120px" gap="0.75rem" class="my-4">
            <BentoCell
              size="featured"
              class="bg-cyan/5 border border-cyan/30 p-3 text-xs font-mono text-cyan"
            >
              Featured (2x2)
            </BentoCell>
            <BentoCell
              size="wide"
              class="bg-action/5 border border-action/20 p-3 text-xs font-mono text-action"
            >
              Wide (2x1)
            </BentoCell>
            <BentoCell class="bg-curation/5 border border-curation/20 p-3 text-xs font-mono text-bone">
              Default
            </BentoCell>
            <BentoCell class="bg-verified/5 border border-verified/20 p-3 text-xs font-mono text-bone">
              Default
            </BentoCell>
            <BentoCell
              size="tall"
              class="bg-void border border-action/10 p-3 text-xs font-mono text-bone"
            >
              Tall (1x2)
            </BentoCell>
            <BentoCell class="bg-raised p-3 text-xs font-mono text-bone-muted">Default</BentoCell>
          </BentoGrid>
          <p class="text-xs font-mono text-bone-muted mt-3">
            Cells render in <code class="text-cyan">grid-auto-flow: dense</code> order. Border-glow
            hover uses <code class="text-cyan">linear-gradient + mask-composite</code> (no
            box-shadow per design system). P3 wide-gamut accents (
            <code class="text-cyan">.accent-glow</code>, <code class="text-cyan">.border-neon</code>
            ) auto-activate on capable displays.
          </p>
        </ComponentSection>

        {/* ── Footer ── */}
        <footer class="mt-12 pt-8 border-t border-action/10 text-center">
          <p class="text-xs font-mono text-bone-muted">
            UniTeia v2 {'\u00B7'} Design System Gallery {'\u00B7'} {new Date().getFullYear()}
          </p>
          <p class="text-[10px] font-mono text-bone-muted/50 mt-1">
            Qwik City + Tailwind v4 + Cloudflare Pages {'\u00B7'} OKLCH Color System
          </p>
        </footer>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia — Design System Gallery',
  meta: [
    {
      name: 'description',
      content:
        'UniTeia v2 Design System Gallery — component showcase with descriptions, props tables, and live examples.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}
