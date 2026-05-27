/**
 * Auto-generate AetherHanddrawCollage props from frontmatter CanvasSceneGraph.
 *
 * Every article with `canvas` frontmatter gets a hand-drawn editorial collage.
 * No LLM needed — the canvas data (nodes, connectors, tone) maps directly to
 * SVG collage primitives (shapes, arrows, annotations).
 *
 * @see AetherHanddrawCollage, CanvasSceneGraph
 */

import type { CollageArrow, CollageNode, CollageNote } from '~/components/moodboard-aether'
import type { CanvasNodeDef, CanvasSceneGraph } from '~/types/content'

// Aether OS OKLCH palette
const PALETTE = {
  indigo: 'oklch(0.55 0.15 270)',
  amber: 'oklch(0.65 0.18 85)',
  teal: 'oklch(0.55 0.12 200)',
  rose: 'oklch(0.55 0.16 10)',
  mint: 'oklch(0.60 0.10 160)',
  fill: 'oklch(0.40 0.14 270)',
} as const

/** Maps canvas node type to collage shape */
const CANVAS_TO_SHAPE: Record<string, CollageNode['shape']> = {
  hero: 'hexagon',
  card: 'rounded-rect',
  'image-cluster': 'diamond',
  'connector-label': 'circle',
}

/** Maps canvas connector type to arrow color */
const CONNECTOR_COLORS: Record<string, string> = {
  solid: PALETTE.indigo,
  dashed: PALETTE.indigo,
  glow: PALETTE.teal,
  ink: PALETTE.amber,
}

/**
 * Layout canvas nodes in a grid and generate collage props.
 * Maps each CanvasNodeDef to a CollageNode with computed position,
 * each connector to a CollageArrow, and generates annotation notes.
 */
export function canvasToCollageProps(
  canvas: CanvasSceneGraph,
  options?: {
    width?: number
    height?: number
  }
): {
  title: string
  nodes: CollageNode[]
  arrows: CollageArrow[]
  notes: CollageNote[]
  tone: 'obsidian' | 'parchment' | 'transparent'
  width: number
  height: number
} {
  const w = options?.width ?? 800
  const h = options?.height ?? 500
  const canvasNodes = canvas.nodes ?? []
  const canvasConnectors = canvas.connectors ?? []

  // Build node map for connector resolution
  const nodeMap = new Map<string, CanvasNodeDef>()
  for (const n of canvasNodes) {
    nodeMap.set(n.id, n)
  }

  // Layout: compute positions for each canvas node
  const positions = layoutNodes(canvasNodes, w, h)

  // Convert canvas nodes → collage nodes
  const collageNodes: CollageNode[] = canvasNodes.map(n => {
    const pos = positions.get(n.id) ?? { x: w / 2, y: h / 2 }
    return {
      cx: pos.x,
      cy: pos.y,
      r: nodeRadius(n.type),
      label: nodeLabel(n),
      shape: CANVAS_TO_SHAPE[n.type ?? 'card'] ?? 'circle',
      fill: PALETTE.fill,
      wobble: true,
    }
  })

  // Convert connectors → collage arrows
  const collageArrows: CollageArrow[] = canvasConnectors.map(c => {
    const fromPos = positions.get(c.from) ?? { x: w * 0.1, y: h * 0.5 }
    const toPos = positions.get(c.to) ?? { x: w * 0.9, y: h * 0.5 }
    return {
      path: bezierPath(fromPos.x, fromPos.y, toPos.x, toPos.y),
      color: CONNECTOR_COLORS[c.type ?? 'solid'] ?? PALETTE.indigo,
      strokeWidth: c.type === 'glow' ? 3 : 2.5,
      animated: true,
    }
  })

  // Generate annotation notes from connector labels
  const collageNotes: CollageNote[] = canvasConnectors
    .filter(c => c.label)
    .map((c, i) => {
      const fromP = positions.get(c.from)
      const toP = positions.get(c.to)
      const midX = ((fromP?.x ?? 0) + (toP?.x ?? w)) / 2
      const midY = ((fromP?.y ?? 0) + (toP?.y ?? h)) / 2
      return {
        x: midX - 70,
        y: midY - 25 + (i % 3) * 10,
        text: c.label ?? '',
        width: 140,
        height: 40,
        rotation: (i % 3) - 1,
      }
    })

  // Map canvas tone to collage tone
  const toneMap: Record<string, 'obsidian' | 'parchment' | 'transparent'> = {
    obsidian: 'obsidian',
    parchment: 'parchment',
    'warm-gray': 'obsidian',
  }
  const tone = toneMap[canvas.tone ?? 'obsidian'] ?? 'obsidian'

  return {
    title: 'Content Graph',
    nodes: collageNodes,
    arrows: collageArrows,
    notes: collageNotes,
    tone,
    width: w,
    height: h,
  }
}

/** Layout canvas nodes in a responsive grid within the SVG viewport */
function layoutNodes(
  nodes: CanvasNodeDef[],
  canvasW: number,
  canvasH: number
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const count = nodes.length

  if (count === 0) return positions

  const padding = 80
  const usableW = canvasW - padding * 2
  const usableH = canvasH - padding * 2

  // Grid layout: try to fit nodes in a roughly square grid
  const cols = Math.ceil(Math.sqrt(count * (canvasW / canvasH)))
  const rows = Math.ceil(count / cols)
  const cellW = usableW / cols
  const cellH = usableH / rows

  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const node = nodes[i]
    if (!node) continue
    positions.set(node.id, {
      x: padding + cellW * (col + 0.5),
      y: padding + cellH * (row + 0.5),
    })
  }

  return positions
}

/** Compute a short display label for a canvas node */
function nodeLabel(node: CanvasNodeDef): string {
  // Use the section as label, cleaned up. Convert to string first (section can be number).
  const section = String(node.section ?? node.type ?? 'node')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
  return section.length > 16 ? `${section.slice(0, 14)}…` : section
}

/** Compute node radius based on type */
function nodeRadius(type: string): number {
  switch (type) {
    case 'hero':
      return 35
    case 'image-cluster':
      return 28
    default:
      return 30
  }
}

/** Generate a quadratic bezier path between two points with slight curve offset */
function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  // Offset the control point perpendicular to the line
  const _offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3
  const cpX = midX - dy * 0.15
  const cpY = midY + dx * 0.15
  return `M ${x1.toFixed(0)} ${y1.toFixed(0)} Q ${cpX.toFixed(0)} ${cpY.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`
}
