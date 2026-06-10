export const SUPPORTED_SCHEMA_VERSION = 'uniteia-content-package/v1'
export type SchemaVersion = typeof SUPPORTED_SCHEMA_VERSION

export interface ManifestContentTitle {
  [locale: string]: string
}

export interface ManifestContentDescription {
  [locale: string]: string
}

export interface ManifestLayout {
  layoutId: string
  designProfile: string
  density: 'comfortable' | 'compact' | 'spacious'
  audience: string
}

export interface ManifestQuality {
  publishable: boolean
  /** v3.2 — Granular 0-100 score from W16 QualityAuditorAgent.
   *  If absent, content was NOT audited (placeholder qualityScore=50). */
  overallScore?: number
  sourceCount: number
  trustLevel: 'high' | 'medium' | 'low'
  blockers: string[]
  warnings: string[]
}

export interface ManifestHashes {
  contentHash: string
  manifestHash: string
}

export interface ManifestProvenance {
  exportedAt: string
  exportTool: string
}

export interface Manifest {
  schemaVersion: string
  contentId: string
  sourceProject: string
  targetProject: string
  status: 'draft' | 'published' | 'archived'
  contentType: string
  canonicalSlug: string
  title: ManifestContentTitle
  description: ManifestContentDescription
  locales: string[]
  layout: ManifestLayout
  tags: Record<string, string[]>
  quality: ManifestQuality
  sources: Array<{ title: string; url: string }>
  hashes: ManifestHashes
  provenance: ManifestProvenance
  /** v3.2 — Design tokens bridging factory→frontend (Content Package Contract v3).
   *  Consumed by v2 for glassmorphism policy enforcement + color calibration. */
  designTokens?: {
    schemaVersion: string
    colorProfile: string
    assembly?: {
      bg: string
      borderColor: string
      borderWidth: number
      padding: number
      canvasWidth: number
    }
    typography?: {
      captionFont: string
      monoFont: string
      displayFont: string
    }
    persistencePolicy: 'flat-2d' | 'css-3d' | 'parallax'
    glassmorphismPolicy: 'forbidden' | 'allowed'
  }
}

export const ALLOWED_CONTENT_TYPES = new Set([
  'opportunity_map',
  'comparison',
  'visual_explainer',
  'guide',
  'report',
])

export const ALLOWED_STATUSES = new Set(['draft', 'published', 'archived'])
export const ALLOWED_DENSITIES = new Set(['comfortable', 'compact', 'spacious'])
export const ALLOWED_TRUST_LEVELS = new Set(['high', 'medium', 'low'])

export function validateManifest(raw: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['manifest must be an object'] }
  }

  const m = raw as Record<string, unknown>

  if (m.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    errors.push(`unsupported schemaVersion: ${m.schemaVersion ?? 'undefined'}`)
  }

  if (!m.contentId || typeof m.contentId !== 'string') {
    errors.push('contentId is required and must be a string')
  }

  if (m.status && !ALLOWED_STATUSES.has(m.status as string)) {
    errors.push(`invalid status: ${m.status}`)
  }

  if (m.contentType && !ALLOWED_CONTENT_TYPES.has(m.contentType as string)) {
    errors.push(`unknown contentType: ${m.contentType}`)
  }

  if (!m.layout || typeof m.layout !== 'object') {
    errors.push('layout is required')
  } else {
    const layout = m.layout as Record<string, unknown>
    if (!layout.layoutId || typeof layout.layoutId !== 'string') {
      errors.push('layout.layoutId is required')
    }
    if (layout.density && !ALLOWED_DENSITIES.has(layout.density as string)) {
      errors.push(`invalid density: ${layout.density}`)
    }
  }

  if (!m.quality || typeof m.quality !== 'object') {
    errors.push('quality is required')
  } else {
    const q = m.quality as Record<string, unknown>
    if (typeof q.publishable !== 'boolean') {
      errors.push('quality.publishable must be a boolean')
    }
    if (q.trustLevel && !ALLOWED_TRUST_LEVELS.has(q.trustLevel as string)) {
      errors.push(`invalid trustLevel: ${q.trustLevel}`)
    }
  }

  if (!Array.isArray(m.locales) || m.locales.length === 0) {
    errors.push('locales must be a non-empty array')
  }

  if (!m.hashes || typeof m.hashes !== 'object') {
    errors.push('hashes is required')
  }

  if (!m.provenance || typeof m.provenance !== 'object') {
    errors.push('provenance is required')
  }

  return { valid: errors.length === 0, errors }
}
