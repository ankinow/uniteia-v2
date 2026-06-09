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

// v3.2 — VisualAsset now imported from shared @uniteia/content-node-contract
import type { VisualAsset } from '@uniteia/content-node-contract'
export type { VisualAsset }

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
