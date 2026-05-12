export interface LayoutEntry {
  id: string
  label: string
  allowedBlocks: Set<string> | null
  forbiddenBlocks: Set<string>
}

const ALL_BLOCKS: Set<string> | null = null

const layouts: LayoutEntry[] = [
  {
    id: 'visual-explainer-v1',
    label: 'Visual Explainer',
    allowedBlocks: ALL_BLOCKS,
    forbiddenBlocks: new Set(),
  },
  {
    id: 'opportunity-map-v1',
    label: 'Opportunity Map',
    allowedBlocks: ALL_BLOCKS,
    forbiddenBlocks: new Set(['ReferralCTA', 'FakeUrgencyBanner']),
  },
  {
    id: 'comparison-v1',
    label: 'Comparison',
    allowedBlocks: ALL_BLOCKS,
    forbiddenBlocks: new Set(),
  },
  {
    id: 'ops-lab-fixture-v1',
    label: 'Ops Lab Fixture',
    allowedBlocks: ALL_BLOCKS,
    forbiddenBlocks: new Set(),
  },
]

const registry = new Map<string, LayoutEntry>()
for (const entry of layouts) {
  registry.set(entry.id, entry)
}

export function getLayout(layoutId: string): LayoutEntry | undefined {
  return registry.get(layoutId)
}

export function hasLayout(layoutId: string): boolean {
  return registry.has(layoutId)
}

export function getAllowedBlockKinds(layoutId: string): Set<string> | null {
  const layout = registry.get(layoutId)
  return layout?.allowedBlocks ?? null
}

export function getForbiddenBlocks(layoutId: string): Set<string> {
  const layout = registry.get(layoutId)
  return layout?.forbiddenBlocks ?? new Set()
}

export function listLayoutIds(): string[] {
  return layouts.map(l => l.id)
}
