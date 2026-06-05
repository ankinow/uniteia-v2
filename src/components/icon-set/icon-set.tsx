/**
 * icon-set.tsx — 8 Knowledge Cluster icons with neon glow
 * Coral (#ff2a6d) + cyan (#05d9e8) palette
 * SVG inline, bundle-safe (<1KB each)
 */

import { component$ } from '@builder.io/qwik'

export type ClusterIcon =
  | 'apex'
  | 'mcp'
  | 'magica'
  | 'quickstart'
  | 'signals'
  | 'frontier'
  | 'aether'

const NEON_CORAL = '#ff2a6d'
const NEON_CYAN = '#05d9e8'

const CORAL_SET = new Set<ClusterIcon>(['apex', 'mcp', 'magica', 'aether'])

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICONS: Record<string, any> = {
  apex: (
    <>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
      <path d="M12 14v6M8 20h8" />
    </>
  ),
  mcp: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M8 7l8 4M8 17l8-4" />
    </>
  ),
  magica: (
    <>
      <path d="M14 4l6 6-9 9-6-6z" />
      <path d="M4 20l4-4" />
      <circle cx="18" cy="4" r="1.5" />
    </>
  ),
  quickstart: (
    <>
      <polygon points="13,2 3,14 11,14 10,22 20,10 12,10" />
    </>
  ),
  signals: (
    <>
      <rect x="4" y="15" width="3" height="6" rx="0.5" />
      <rect x="9" y="11" width="3" height="10" rx="0.5" />
      <rect x="14" y="7" width="3" height="14" rx="0.5" />
      <rect x="19" y="3" width="3" height="18" rx="0.5" />
    </>
  ),
  frontier: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,4 15,12 12,20 9,12" />
    </>
  ),
  aether: (
    <>
      <path d="M5 12c0-3 1.5-5 4-5s4 2.5 4 5c0 2.5 1.5 5 4 5s4-2 4-5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
}

export function nicheToIcon(slug: string): ClusterIcon {
  const map: Record<string, ClusterIcon> = {
    apex: 'apex',
    mcp: 'mcp',
    magica: 'magica',
    'magica-quickstart': 'quickstart',
    'tencent-cloud-deal-stack-builders': 'signals',
    'magica-mcp-server': 'mcp',
  }
  return map[slug] ?? 'signals'
}
