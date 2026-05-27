export type ContentLocale = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh'

export type ContentNodeVisibility = 'draft' | 'review' | 'published'
export type ContentNodeLifecycle =
  | 'generated'
  | 'verified'
  | 'reviewed'
  | 'published'
  | 'deprecated'
export type ContentNodeVerdict = 'safe' | 'caution' | 'unsafe'
export type VisualStyle = 'signal-grid' | 'material-myth' | 'editorial-collage'

/** Visual asset reference from Content Package Contract v2 (L2 bridge) */
export interface VisualAsset {
  /** Asset type from factory pipeline */
  type: 'handdraw-svg' | 'procedural-sprite' | 'moodboard' | 'polaroid-set' | 'dataviz'
  /** Relative path within Content Package (e.g., assets/moodboard-main.svg) */
  path: string
  /** Visual style variant (e.g., 'aether-handdrawn', 'aether-default') */
  style: string
  /** Aether OKLCH palette used */
  colors?: string[]
  /** File size in bytes */
  fileSize?: number
  /** Whether the asset passed quality gate */
  valid?: boolean
}

export interface ContentNode {
  id: string
  locale: ContentLocale
  canonicalLocale: ContentLocale
  slug: string
  canonicalSlug: string
  title: string
  summary: string
  niche: string[]
  tags: string[]
  entities: string[]
  qualityScore: number
  trustScore: number
  visibility: ContentNodeVisibility
  lifecycle: ContentNodeLifecycle
  verdict: ContentNodeVerdict
  routes: {
    canonical: string
    aliases: string[]
  }
  alternates: Partial<Record<ContentLocale, string>>
  related: string[]
  seo: {
    noindex: boolean
    priority: number
  }
  timestamps: {
    createdAt: string
    updatedAt: string
  }
  metrics: {
    edgeRank: number
    semanticDensity: number
    freshnessScore: number
    graphScore: number
  }
  visualStyle?: VisualStyle
  sketchnoteSpecId?: string
  /** Visual asset from factory (L2 bridge) — moodboard, SVG, etc. */
  visualAsset?: VisualAsset
}

export interface ContentNodeInput {
  path: string
  niche: string
  locale: string
  slug: string
  title: string
  body: string
  frontmatter: Record<string, unknown>
  metadata?: Record<string, unknown>
}
