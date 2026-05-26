import type { CanvasConnectorDef, CanvasSceneGraph } from '~/types/content'

export type LayoutStrategyName =
  | 'constellation'
  | 'neural-branch'
  | 'timeline-spiral'
  | 'editorial-collage'
  | 'corkboard-scatter'
  | 'masonry-constellation'

export interface LayoutContext {
  scene: CanvasSceneGraph
  containerWidth: number
}

export type LayoutStrategy = (ctx: LayoutContext) => CanvasSceneGraph

function autoConnectors(nodes: CanvasSceneGraph['nodes']): CanvasConnectorDef[] {
  const ids = nodes.filter(n => n.type !== 'connector-label').map(n => n.id)
  if (ids.length < 2) return []
  return ids.slice(1).map((id, i) => {
    const fromId = ids[i]
    if (!fromId) return { id: `auto-conn-${i}`, from: ids[0] ?? id, to: id, type: 'solid' as const }
    return { id: `auto-conn-${i}`, from: fromId, to: id, type: 'solid' as const }
  })
}

const NODE_W = 280
const NODE_H = 200
const GAP = 40

/* ── Constellation: nodes scattered randomly, linked in star pattern ── */
export function constellationLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const cols = Math.min(3, Math.max(2, Math.floor(ctx.containerWidth / (NODE_W + GAP))))
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    const col = i % cols
    const row = Math.floor(i / cols)
    const scatter = () => (Math.random() - 0.5) * 40
    return {
      ...n,
      x: col * (NODE_W + GAP) + scatter(),
      y: row * (NODE_H + GAP) + scatter(),
      width: NODE_W,
      height: NODE_H,
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Neural-branch: tree from first node, children fan out ── */
export function neuralBranchLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    if (i === 0)
      return { ...n, x: ctx.containerWidth / 2 - NODE_W / 2, y: 20, width: NODE_W, height: NODE_H }
    const depth = Math.floor(Math.log2(i))
    const posInLevel = i - (2 ** depth - 1)
    const nodesInLevel = 2 ** depth
    const totalW = nodesInLevel * (NODE_W + GAP) - GAP
    const startX = (ctx.containerWidth - totalW) / 2
    return {
      ...n,
      x: startX + posInLevel * (NODE_W + GAP),
      y: 20 + depth * (NODE_H + GAP * 2),
      width: NODE_W,
      height: NODE_H,
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Timeline-spiral: nodes arranged along an Archimedean spiral ── */
export function timelineSpiralLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const cx = ctx.containerWidth / 2
  const cy = scene.nodes.length * 60
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    const angle = i * 1.2
    const radius = 80 + i * 45
    return {
      ...n,
      x: cx + Math.cos(angle) * radius - NODE_W / 2,
      y: cy + Math.sin(angle) * radius - NODE_H / 2 + i * 30,
      width: NODE_W,
      height: NODE_H,
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Editorial-collage: asymmetric magazine-style layout ── */
export function editorialCollageLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const zones = [
    { x: 20, y: 20, w: ctx.containerWidth * 0.65, h: 260 },
    { x: ctx.containerWidth * 0.7, y: 20, w: ctx.containerWidth * 0.25, h: 120 },
    { x: ctx.containerWidth * 0.7, y: 160, w: ctx.containerWidth * 0.25, h: 120 },
    { x: 20, y: 300, w: ctx.containerWidth * 0.45, h: 200 },
    { x: ctx.containerWidth * 0.5, y: 300, w: ctx.containerWidth * 0.45, h: 200 },
  ]
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    const zone = zones[i % zones.length]
    if (!zone) return n
    return {
      ...n,
      x: zone.x + (Math.random() - 0.5) * 10,
      y: zone.y + (Math.random() - 0.5) * 10,
      width: zone.w,
      height: zone.h,
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Corkboard-scatter: slightly rotated, pinned at random angles ── */
export function corkboardScatterLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const cols = Math.min(3, Math.max(2, Math.floor(ctx.containerWidth / (NODE_W + GAP))))
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    const col = i % cols
    const row = Math.floor(i / cols)
    const scatterX = (Math.random() - 0.5) * 60
    const scatterY = (Math.random() - 0.5) * 30
    return {
      ...n,
      x: col * (NODE_W + GAP) + scatterX,
      y: row * (NODE_H + GAP * 0.5) + scatterY,
      width: NODE_W,
      height: NODE_H,
      variant: 'parchment',
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Masonry-constellation: grid-based, connectors between neighbors ── */
export function masonryConstellationLayout(ctx: LayoutContext): CanvasSceneGraph {
  const { scene } = ctx
  const cols = Math.min(3, Math.max(2, Math.floor(ctx.containerWidth / (NODE_W + GAP))))
  const nodes = scene.nodes.map((n, i) => {
    if (n.x !== undefined && n.y !== undefined) return n
    const col = i % cols
    const row = Math.floor(i / cols)
    const offsetX = row % 2 === 1 ? (NODE_W + GAP) / 2 : 0
    return {
      ...n,
      x: col * (NODE_W + GAP) + offsetX,
      y: row * (NODE_H + GAP),
      width: NODE_W,
      height: row % 3 === 0 ? NODE_H * 0.6 : NODE_H,
    }
  })
  return {
    ...scene,
    nodes,
    connectors: scene.connectors?.length ? scene.connectors : autoConnectors(nodes),
  }
}

/* ── Registry ── */
export const LAYOUT_STRATEGIES: Record<LayoutStrategyName, LayoutStrategy> = {
  constellation: constellationLayout,
  'neural-branch': neuralBranchLayout,
  'timeline-spiral': timelineSpiralLayout,
  'editorial-collage': editorialCollageLayout,
  'corkboard-scatter': corkboardScatterLayout,
  'masonry-constellation': masonryConstellationLayout,
}

export function resolveLayout(scene: CanvasSceneGraph, containerWidth: number): CanvasSceneGraph {
  if (scene.nodes.every(n => n.x !== undefined && n.y !== undefined)) {
    return scene
  }
  const strategy = (scene.style as LayoutStrategyName) || 'constellation'
  const layoutFn = LAYOUT_STRATEGIES[strategy] ?? constellationLayout
  return layoutFn({ scene, containerWidth })
}
