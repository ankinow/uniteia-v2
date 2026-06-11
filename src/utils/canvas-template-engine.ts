/**
 * canvas-template-engine.ts — Deterministic canvas YAML/collage generator
 * No LLM calls. 4 layouts: neural-branch, timeline-spiral, editorial-collage, constellation.
 * @see scripts/manifest-schema.ts for CanvasDef/CanvasNode types
 */

// ─── Types (mirrored from manifest-schema.ts) ───
export type CanvasTone = 'warm-gray' | 'parchment' | 'obsidian' | 'neural-blue' | 'coral'
export type CanvasLayout =
  | 'neural-branch'
  | 'timeline-spiral'
  | 'editorial-collage'
  | 'constellation'
  | 'storyboard'
export type CanvasNodeType = 'hero' | 'card' | 'grid' | 'insight' | 'timeline' | 'quote'

// Internal alias
type CL = CanvasLayout

export interface CanvasNode {
  id: string
  section: string
  type: CanvasNodeType
}
export interface CanvasDef {
  tone: CanvasTone
  layout: CL
  nodes: CanvasNode[]
}
export interface ArticleMetadata {
  tags: string[]
  niche: string
  bodySample: string
}

// ─── Template presets ───
const PRESETS: Record<string, { layout: CL; tone: CanvasTone; labels: string[] }> = {
  'neural-branch': {
    layout: 'neural-branch',
    tone: 'neural-blue',
    labels: ['Overview', 'Brain', 'Planning', 'Memory', 'Tools', 'Impact'],
  },
  'timeline-spiral': {
    layout: 'timeline-spiral',
    tone: 'parchment',
    labels: [
      'Introduction',
      'Early Stage',
      'Evolution',
      'Comparison',
      'Current State',
      'Future Outlook',
    ],
  },
  'editorial-collage': {
    layout: 'editorial-collage',
    tone: 'warm-gray',
    labels: ['Getting Started', 'Step 1', 'Step 2', 'Step 3', 'Result', 'Next Steps'],
  },
  constellation: {
    layout: 'constellation',
    tone: 'obsidian',
    labels: ['Overview', 'Key Concepts', 'Applications', 'Ecosystem', 'Resources'],
  },
}

// ─── Tag→template mapping (first match wins) ───
const TAG_MAP: Array<{ tags: string[]; tpl: string }> = [
  { tags: ['ai-agents', 'beginners'], tpl: 'neural-branch' },
  { tags: ['comparison', 'benchmark'], tpl: 'timeline-spiral' },
  { tags: ['tutorial', 'guide', 'development'], tpl: 'editorial-collage' },
]

// ─── Helpers ───
function h2s(body: string): string[] {
  const out: string[] = []
  for (const line of body.split('\n')) {
    const m = line.match(/^##\s+(.+)/)
    if (m?.[1]) {
      const c = m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim()
      if (c) out.push(c)
    }
  }
  return out
}
function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}
function uid(base: string, used: Set<string>): string {
  let id = base
  let c = 1
  while (used.has(id)) id = `${base}-${c++}`
  return id
}

// ─── Generic builder for sequential templates ───
function buildSequential(
  labels: string[],
  presetKey: 'timeline-spiral' | 'editorial-collage' | 'constellation',
  tone?: CanvasTone,
  typeFn?: (i: number, total: number) => CanvasNodeType
): CanvasDef {
  const p = PRESETS[presetKey]
  if (!p) throw new Error(`Unknown canvas preset: ${presetKey}`)
  const useLabels = labels.length >= 2 ? labels : p.labels
  const used = new Set<string>()
  const nodes: CanvasNode[] = []
  for (let i = 0; i < Math.min(useLabels.length, 12); i++) {
    const label = useLabels[i]
    if (!label) continue
    const id = uid(kebab(label), used)
    used.add(id)
    const type = typeFn ? typeFn(i, useLabels.length) : i === 0 ? 'hero' : 'card'
    nodes.push({ id, section: label, type })
  }
  return { tone: tone ?? p.tone, layout: p.layout, nodes }
}

// ─── neural-branch: tree structure with hero at root ───
function buildNeuralBranch(labels: string[], tone?: CanvasTone): CanvasDef {
  const p = PRESETS['neural-branch']
  if (!p) throw new Error('Unknown canvas preset: neural-branch')
  const useLabels = labels.length >= 2 ? labels : p.labels
  const used = new Set<string>()
  const nodes: CanvasNode[] = [{ id: 'hero', section: useLabels[0] ?? 'Overview', type: 'hero' }]
  used.add('hero')
  const rest = useLabels.slice(1)
  for (let i = 0; i < Math.min(rest.length, 11); i++) {
    const label = rest[i]
    if (!label) continue
    const id = uid(kebab(label), used)
    used.add(id)
    nodes.push({ id, section: label, type: 'card' })
  }
  return { tone: tone ?? p.tone, layout: p.layout, nodes: nodes.slice(0, 12) }
}

// ─── Other templates ───
function buildTimeline(labels: string[], tone?: CanvasTone): CanvasDef {
  return buildSequential(labels, 'timeline-spiral', tone, (i, total) =>
    i === 0 ? 'hero' : i === total - 1 ? 'insight' : 'card'
  )
}
function buildEditorial(labels: string[], tone?: CanvasTone): CanvasDef {
  return buildSequential(labels, 'editorial-collage', tone, (i, total) =>
    i === 0 ? 'hero' : i === total - 1 ? 'grid' : 'card'
  )
}
function buildConstellation(labels: string[], tone?: CanvasTone): CanvasDef {
  return buildSequential(labels, 'constellation', tone, i =>
    i === 0 ? 'hero' : i % 3 === 0 ? 'insight' : 'card'
  )
}

function resolveTemplate(tags: string[]): string {
  for (const e of TAG_MAP) if (e.tags.some(t => tags.includes(t))) return e.tpl
  return 'constellation'
}

// ─── Public API ───
export function generateCanvas(article: ArticleMetadata, tone?: CanvasTone): CanvasDef {
  const headings = h2s(article.bodySample)
  const tpl = resolveTemplate(article.tags)
  switch (tpl) {
    case 'neural-branch':
      return buildNeuralBranch(headings, tone)
    case 'timeline-spiral':
      return buildTimeline(headings, tone)
    case 'editorial-collage':
      return buildEditorial(headings, tone)
    default:
      return buildConstellation(headings, tone)
  }
}

// ─── Collage layout engine ───
interface Pt {
  x: number
  y: number
}
interface Edge {
  fromId: string
  toId: string
}

const _NW = 200
const NH = 140
const GAP = 50
const PAL: Record<string, string> = {
  indigo: 'oklch(0.55 0.15 270)',
  amber: 'oklch(0.65 0.18 85)',
  teal: 'oklch(0.55 0.12 200)',
  rose: 'oklch(0.55 0.16 10)',
  mint: 'oklch(0.60 0.10 160)',
  fill: 'oklch(0.40 0.14 270)',
}

function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  return `M ${x1.toFixed(0)} ${y1.toFixed(0)} Q ${(mx - dy * 0.15).toFixed(0)} ${(my + dx * 0.15).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`
}

function positions(nodes: CanvasNode[], layout: CL, w: number, h: number): Map<string, Pt> {
  const pos = new Map<string, Pt>()
  const cx = w / 2
  const cy = h / 2
  const pad = 60
  const n = nodes.length
  if (n === 0) return pos

  switch (layout) {
    case 'neural-branch': {
      const root = nodes[0]
      if (root) pos.set(root.id, { x: cx, y: pad * 1.2 })
      const kids = nodes.slice(1)
      const kc = kids.length
      if (kc === 0) break
      const uw = w - pad * 2
      const sx = pad + (uw - uw * 0.8) / 2
      const perRow = Math.ceil(kc / 2)
      for (let i = 0; i < kc; i++) {
        const nd = kids[i]
        if (!nd) continue
        const row = Math.floor(i / perRow)
        const col = i % perRow
        const rc = row === 0 ? perRow : kc - perRow
        const sp = (uw * 0.8) / Math.max(rc, 1)
        const off = (uw * 0.8 - sp * (rc - 1)) / 2
        pos.set(nd.id, { x: sx + off + col * sp, y: pad * 1.2 + NH + GAP + row * (NH + GAP) })
      }
      break
    }
    case 'timeline-spiral': {
      for (let i = 0; i < n; i++) {
        const nd = nodes[i]
        if (!nd) continue
        const a = i * 1.2
        const r = 60 + i * 50
        pos.set(nd.id, { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r + i * 10 })
      }
      break
    }
    case 'editorial-collage': {
      const zones = [
        { x: pad, y: pad, iw: w * 0.6 - pad, ih: h * 0.35 },
        { x: w * 0.65, y: pad, iw: w * 0.3 - pad, ih: h * 0.15 },
        { x: w * 0.65, y: h * 0.22, iw: w * 0.3 - pad, ih: h * 0.15 },
        { x: pad, y: h * 0.42, iw: w * 0.45 - pad, ih: h * 0.3 },
        { x: w * 0.5, y: h * 0.42, iw: w * 0.45 - pad, ih: h * 0.3 },
      ]
      for (let i = 0; i < n; i++) {
        const nd = nodes[i]
        const z = zones[i % zones.length]
        if (!nd || !z) continue
        pos.set(nd.id, {
          x: z.x + z.iw / 2 + (Math.random() - 0.5) * 20,
          y: z.y + z.ih / 2 + (Math.random() - 0.5) * 20,
        })
      }
      break
    }
    default: {
      // constellation
      for (let i = 0; i < n; i++) {
        const nd = nodes[i]
        if (!nd) continue
        if (i === 0) {
          pos.set(nd.id, { x: cx, y: cy })
          continue
        }
        const a = ((i - 1) / (n - 1)) * Math.PI * 2
        const r = Math.min(w, h) * 0.35
        pos.set(nd.id, {
          x: cx + Math.cos(a) * r + (Math.random() - 0.5) * 30,
          y: cy + Math.sin(a) * r + (Math.random() - 0.5) * 30,
        })
      }
    }
  }
  return pos
}

function edges(nodes: CanvasNode[], layout: CL): Edge[] {
  const e: Edge[] = []
  const ids = nodes.map(n => n.id)
  if (ids.length < 2) return e
  const root = ids[0]
  switch (layout) {
    case 'neural-branch':
      for (let i = 1; i < ids.length; i++) {
        const c = ids[i]
        if (root && c) e.push({ fromId: root, toId: c })
      }
      break
    case 'timeline-spiral':
    case 'editorial-collage':
      for (let i = 1; i < ids.length; i++) {
        const p = ids[i - 1]
        const c = ids[i]
        if (p && c) e.push({ fromId: p, toId: c })
      }
      break
    default:
      for (let i = 1; i < ids.length; i++) {
        const c = ids[i]
        if (root && c) e.push({ fromId: root, toId: c })
      }
      for (let i = 2; i < ids.length; i += 2) {
        const a = ids[i - 1]
        const b = ids[i]
        if (a && b) e.push({ fromId: a, toId: b })
      }
  }
  return e
}

// ─── Public API: generateCollageProps ───
export function generateCollageProps(
  canvas: CanvasDef,
  opts: { width: number; height: number }
): Record<string, unknown> {
  const { width: w, height: h } = opts
  const { nodes, layout, tone } = canvas
  const ps = positions(nodes, layout, w, h)
  const es = edges(nodes, layout)

  const cn = nodes.map(n => {
    const p = ps.get(n.id) ?? { x: w / 2, y: h / 2 }
    const r = n.type === 'hero' ? 40 : n.type === 'insight' ? 28 : 32
    return {
      cx: Math.round(p.x),
      cy: Math.round(p.y),
      r,
      label: n.section.length > 18 ? `${n.section.slice(0, 16)}…` : n.section,
      shape: n.type === 'hero' ? 'hexagon' : n.type === 'insight' ? 'diamond' : 'rounded-rect',
      fill: PAL.fill,
      wobble: true,
      id: n.id,
    }
  })

  const ar = es.map((e, i) => {
    const fp = ps.get(e.fromId) ?? { x: w * 0.1, y: h * 0.5 }
    const tp = ps.get(e.toId) ?? { x: w * 0.9, y: h * 0.5 }
    return {
      id: `arrow-${i}`,
      path: bezier(fp.x, fp.y, tp.x, tp.y),
      color: i % 3 === 0 ? PAL.indigo : i % 3 === 1 ? PAL.teal : PAL.amber,
      strokeWidth: 2.5,
      animated: true,
    }
  })

  const nt = es.map((e, i) => {
    const fp = ps.get(e.fromId)
    const tp = ps.get(e.toId)
    const mx = ((fp?.x ?? 0) + (tp?.x ?? w)) / 2
    const my = ((fp?.y ?? 0) + (tp?.y ?? h)) / 2
    return {
      x: Math.round(mx - 70),
      y: Math.round(my - 20 + (i % 3) * 8),
      text: '',
      width: 140,
      height: 40,
      rotation: (i % 3) - 1,
    }
  })

  const tm: Record<string, string> = {
    obsidian: 'obsidian',
    parchment: 'parchment',
    'warm-gray': 'obsidian',
    'neural-blue': 'obsidian',
    coral: 'obsidian',
  }
  return {
    title: 'Canvas Collage',
    nodes: cn,
    arrows: ar,
    notes: nt,
    tone: tm[tone] ?? 'obsidian',
    width: w,
    height: h,
    layout,
  }
}
