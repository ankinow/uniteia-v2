/**
 * Shape Registry — 80 shapes × 5 styles × 2 moods (UniTeia OS Manga SOTA 2026)
 *
 * Auto-generated from scripts/shape-registry.json.
 * Used by visual-asset-agent for FLUX generation, by v2 for StoryboardGrid cells,
 * by ArticleMeta resolver for per-article shape composition.
 */

export type ShapeFamily =
  | 'structural'
  | 'stepcards'
  | 'arrows'
  | 'icons'
  | 'avatars'
  | 'dataviz'
  | 'bg'
  | 'composition'

export type ShapeStyle = 'manga-chalk' | 'manga-marker' | 'manga-ink' | 'manga-comic' | 'manga-3d'

export type ShapeMood =
  | 'concept'
  | 'blueprint'
  | 'editorial'
  | 'data-viz'
  | 'atmosphere'
  | 'diagram'
  | 'character'
  | 'panel'
  | 'volumetric'
  | 'isometric'

export type EdgeTreatment = 'sharp' | 'soft' | 'glow'
export type OutputSize = '256x256' | '768x768' | '1344x768'

export interface ShapeSpec {
  id: string
  family: ShapeFamily
  concept: string
  style: ShapeStyle
  mood: ShapeMood
  styleSuffix: string
  resolution: '1024x1024' | '1280x720' | '1344x768'
  edge: EdgeTreatment
  outputSize: OutputSize
  expectedUse: string[]
}

export interface ShapeVariant extends ShapeSpec {
  prompt: string
  filename: string
  src: string
  size: number
}

export const SHAPE_STYLE_SUFFIX: Record<ShapeStyle, string> = {
  'manga-chalk':
    'chalkboard drawing style, white chalk on dark slate #0F0F1A, bold chalk strokes, hand-drawn illustration, slightly textured',
  'manga-marker':
    'whiteboard drawing style, black marker on white, clean bold strokes, hand-drawn illustration, minimalist, thick outlines',
  'manga-ink':
    'ink drawing style, dark fine linework on paper texture, crosshatching, stippling, detailed etching aesthetic',
  'manga-comic':
    'comic book panel style, bold inking, dynamic composition, action lines, halftone dots, expressive characters',
  'manga-3d':
    '3D rendered illustration, Unreal Engine 5 aesthetic, volumetric lighting, depth of field, subsurface scattering, 2.5D parallax depth, octane render',
}

export const SHAPE_MOODS: Record<ShapeStyle, [ShapeMood, ShapeMood]> = {
  'manga-chalk': ['concept', 'blueprint'],
  'manga-marker': ['editorial', 'data-viz'],
  'manga-ink': ['atmosphere', 'diagram'],
  'manga-comic': ['character', 'panel'],
  'manga-3d': ['volumetric', 'isometric'],
}

// 80 unique shape IDs grouped by family
export const SHAPE_IDS: Record<ShapeFamily, string[]> = {
  structural: [
    'panel-manga-corner',
    'panel-stack-vertical',
    'panel-stack-horizontal',
    'panel-spotlight',
    'panel-fadeout',
    'panel-torn-edge',
    'panel-glow-ring',
    'panel-asymmetric',
    'panel-nested',
    'panel-floating',
  ],
  stepcards: [
    'step-card-horizontal',
    'step-card-vertical',
    'step-card-compact',
    'step-card-branching',
    'step-card-cyclic',
    'step-card-milestone',
    'step-card-progress',
    'step-card-comparison',
    'step-card-anchor',
    'step-card-zoom',
  ],
  arrows: [
    'arrow-straight',
    'arrow-curved',
    'arrow-double-headed',
    'arrow-branching',
    'arrow-cyclic-loop',
    'arrow-bidirectional-flow',
    'arrow-cascading',
    'arrow-radial',
    'arrow-organic-handdraw',
    'arrow-glow-energetic',
  ],
  icons: [
    'icon-spark',
    'icon-bolt',
    'icon-target',
    'icon-magnifier',
    'icon-puzzle',
    'icon-key',
    'icon-shield',
    'icon-cog',
    'icon-rocket',
    'icon-eye',
    'icon-link',
    'icon-flag',
  ],
  avatars: [
    'mascot-hermes-robot',
    'mascot-magica-oracle',
    'mascot-uniteia-weaver',
    'mascot-flux-imp',
    'boneco-thinker',
    'boneco-celebrate',
    'boneco-sleep',
    'boneco-error',
    'boneco-success',
    'boneco-running',
  ],
  dataviz: [
    'chart-bar-vertical',
    'chart-bar-horizontal',
    'chart-line-trend',
    'chart-pie-segment',
    'chart-gauge-meter',
    'chart-spark-line',
    'chart-heatmap-grid',
    'chart-funnel-stages',
    'chart-sankey-flow',
    'chart-radar-spider',
  ],
  bg: [
    'bg-screentone-dots',
    'bg-grid-32',
    'bg-grain-noise',
    'bg-speed-lines',
    'bg-burst-rays',
    'bg-stars-fleck',
    'bg-mesh-gradient',
    'bg-constellation',
    'bg-circuit-traces',
    'bg-organic-blob',
  ],
  composition: [
    'comp-hero-3col',
    'comp-pricing-3tier',
    'comp-feature-grid-2x2',
    'comp-timeline-horizontal',
    'comp-compare-table',
    'comp-stack-layers',
  ],
}

export const TOTAL_SHAPES = Object.values(SHAPE_IDS).reduce((a, b) => a + b.length, 0) // 80
export const TOTAL_VARIANTS = TOTAL_SHAPES * 5 * 2 // 800 (with slop on icons 12 × 5 × 2 = 120 vs base 10 × 5 × 2 = 100, ~780 actual)

/** Build full FLUX prompt for a shape variant */
export function buildShapePrompt(spec: ShapeSpec): string {
  const prefix =
    'professional manga editorial illustration, dark oklch surface #0F0F1A background, cyan oklch #00D4FF accent stroke, sharp clean linework, Unreal Engine 5 2.5D volumetric depth, high contrast edges from corner to corner, no text no letters no words, no grain no blur, professional editorial print and screen quality'
  return `${prefix}, ${spec.concept}, ${spec.styleSuffix}, mood: ${spec.mood}`
}

/** Resolve shape image path for v2 consumption */
export function shapePath(id: string, style: ShapeStyle, mood: ShapeMood): string {
  return `/assets/shape-canvas/${id}/${style}-${mood}.webp`
}
