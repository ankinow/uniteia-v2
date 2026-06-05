/**
 * icon-set.tsx — APEX Knowledge Cluster icons with neon glow
 *
 * APEX = the umbrella signal at the frontier of AI. All icons
 * share a visual language: neon coral (#ff2a6d) for APEX and its
 * derivatives, neon cyan (#05d9e8) for support infrastructure.
 *
 * SVG inline, bundle-safe (<1KB each).
 */

import { component$ } from '@builder.io/qwik'

export type ClusterIcon =
  | 'apex'
  | 'apex-overview'
  | 'apex-quickstart'
  | 'apex-flow'
  | 'mcp'
  | 'magica'
  | 'magica-quickstart'
  | 'magica-mcp-server'
  | 'tencent-cloud'
  | 'signals'
  | 'frontier'
  | 'aether'

const NEON_CORAL = '#ff2a6d'
const NEON_CYAN = '#05d9e8'

// APEX cluster + its derivative signals pulse in coral;
// support tooling (signals, frontier, aether) glows in cyan.
const CORAL_SET = new Set<ClusterIcon>([
  'apex',
  'apex-overview',
  'apex-quickstart',
  'apex-flow',
  'mcp',
  'magica',
  'magica-quickstart',
  'magica-mcp-server',
  'tencent-cloud',
])

interface ClusterIconProps {
  name: ClusterIcon
  size?: number
  class?: string
}

export const ClusterIcon = component$<ClusterIconProps>(({ name, size = 24, class: classList }) => {
  const color = CORAL_SET.has(name) ? NEON_CORAL : NEON_CYAN

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={classList}
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    >
      {ICONS[name]}
    </svg>
  )
})

// biome-ignore lint/suspicious/noExplicitAny: SVG fragment per icon name
const ICONS: Record<string, any> = {
  // APEX — crown / summit marker with rising signal
  apex: (
    <>
      <path d="M3 18l4-7 4 4 4-9 4 12 2-4" />
      <circle cx="11" cy="11" r="1.2" fill="#ff2a6d" />
      <path d="M3 21h18" opacity="0.5" />
    </>
  ),
  // APEX overview — summit radar pulse
  'apex-overview': (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" opacity="0.55" />
      <circle cx="12" cy="12" r="10" opacity="0.3" />
    </>
  ),
  // APEX quickstart — instant on (lightning + play)
  'apex-quickstart': (
    <>
      <polygon points="13,2 3,14 11,14 10,22 20,10 12,10" />
      <circle cx="20" cy="4" r="1.5" fill="#ff2a6d" stroke="none" />
    </>
  ),
  // APEX flow — signal routing (arrow + node)
  'apex-flow': (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 11l10-4M7 13l10 4" />
    </>
  ),
  // MCP — three node mesh
  mcp: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M8 7l8 4M8 17l8-4" />
    </>
  ),
  // MAGICA — magic wand
  magica: (
    <>
      <path d="M14 4l6 6-9 9-6-6z" />
      <path d="M4 20l4-4" />
      <circle cx="18" cy="4" r="1.5" />
      <path d="M21 8l1 1M8 1l1 1" opacity="0.6" />
    </>
  ),
  'magica-quickstart': (
    <>
      <path d="M3 12h4l3-9 4 18 3-9h4" />
    </>
  ),
  'magica-mcp-server': (
    <>
      <rect x="3" y="5" width="18" height="4" rx="1" />
      <rect x="3" y="11" width="18" height="4" rx="1" />
      <rect x="3" y="17" width="18" height="4" rx="1" />
      <circle cx="7" cy="7" r="0.6" fill="#ff2a6d" stroke="none" />
      <circle cx="7" cy="13" r="0.6" fill="#ff2a6d" stroke="none" />
      <circle cx="7" cy="19" r="0.6" fill="#ff2a6d" stroke="none" />
    </>
  ),
  'tencent-cloud': (
    <>
      <path d="M7 18a4 4 0 010-8 6 6 0 0111-1 4 4 0 011 8H7z" />
    </>
  ),
  // signals — bar chart growing
  signals: (
    <>
      <rect x="4" y="15" width="3" height="6" rx="0.5" />
      <rect x="9" y="11" width="3" height="10" rx="0.5" />
      <rect x="14" y="7" width="3" height="14" rx="0.5" />
      <rect x="19" y="3" width="3" height="18" rx="0.5" />
    </>
  ),
  // frontier — compass / north star
  frontier: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,4 15,12 12,20 9,12" />
    </>
  ),
  // aether — flowing wave
  aether: (
    <>
      <path d="M5 12c0-3 1.5-5 4-5s4 2.5 4 5c0 2.5 1.5 5 4 5s4-2 4-5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
}

// Niche slugs -> icon mapping. Apex cluster + its 4 derivatives get
// dedicated visuals; everything else falls back to a generic signal.
export function nicheToIcon(slug: string): ClusterIcon {
  const map: Record<string, ClusterIcon> = {
    apex: 'apex',
    'apex-overview': 'apex-overview',
    'apex-quickstart': 'apex-quickstart',
    'apex-flow': 'apex-flow',
    mcp: 'mcp',
    magica: 'magica',
    'magica-quickstart': 'magica-quickstart',
    'magica-mcp-server': 'magica-mcp-server',
    'tencent-cloud-deal-stack-builders': 'tencent-cloud',
  }
  return map[slug] ?? 'signals'
}
