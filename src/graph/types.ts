/**
 * GraphRAG types — Entity, Edge, Graph
 *
 * P0.1: Entity extraction from content/apex/**\/*.md frontmatter.
 * Entity types: article | product | brand | category | benchmark
 */

export type EntityType = 'article' | 'product' | 'brand' | 'category' | 'benchmark'

export type EdgeKind =
  | 'mentions' // article → product/brand
  | 'belongs_to' // article → category, product → category
  | 'verified_by' // benchmark → article
  | 'competes_with' // product → product
  | 'has_affiliate' // article → referral_link
  | 'translated_as' // article ↔ article (same slug, different locale)
  | 'related_to' // article → article (cross-reference)

export interface Entity {
  /** Unique identifier: "{type}-{slug}" */
  id: string
  type: EntityType
  /** Display name */
  name: string
  /** Source locale (for article entities) */
  locale?: string
  /** Short description / summary */
  description?: string
  /** URL reference */
  url?: string
  /** Quality/confidence score 0-100 */
  score: number
  /** When the entity was last updated (ISO) */
  updatedAt: string
  /** Arbitrary metadata */
  metadata?: Record<string, unknown>
}

export interface Edge {
  source: string // entity id
  target: string // entity id
  kind: EdgeKind
  /** Optional weight 0-1 */
  weight?: number
  /** Optional context/reason */
  reason?: string
}

export interface EntityGraph {
  version: 'entity-graph.v1'
  generatedAt: string
  nodes: Entity[]
  edges: Edge[]
  /** Index for fast lookups */
  indexes: {
    byId: Record<string, number>
    byType: Partial<Record<EntityType, string[]>>
    byLocale: Record<string, string[]>
  }
}

/**
 * Schema validation for EntityGraph.
 * Returns array of error messages (empty = valid).
 */
export function validateEntityGraph(graph: unknown): string[] {
  const errors: string[] = []

  if (!graph || typeof graph !== 'object') {
    errors.push('Graph must be an object')
    return errors
  }

  const g = graph as Record<string, unknown>

  if (g.version !== 'entity-graph.v1') {
    errors.push(`Expected version 'entity-graph.v1', got '${String(g.version)}'`)
  }

  if (!Array.isArray(g.nodes)) {
    errors.push('nodes must be an array')
    return errors
  }

  if (!Array.isArray(g.edges)) {
    errors.push('edges must be an array')
    return errors
  }

  const nodeIds = new Set<string>()

  for (let i = 0; i < g.nodes.length; i++) {
    const n = g.nodes[i] as Record<string, unknown>
    if (!n.id || typeof n.id !== 'string') {
      errors.push(`nodes[${i}]: missing or invalid id`)
      continue
    }
    if (
      !n.type ||
      !['article', 'product', 'brand', 'category', 'benchmark'].includes(n.type as string)
    ) {
      errors.push(`nodes[${i}] ("${n.id}"): invalid type "${String(n.type)}"`)
    }
    if (typeof n.name !== 'string' || !n.name) {
      errors.push(`nodes[${i}] ("${n.id}"): missing or invalid name`)
    }
    if (typeof n.score !== 'number' || n.score < 0 || n.score > 100) {
      errors.push(`nodes[${i}] ("${n.id}"): score must be 0-100, got ${String(n.score)}`)
    }
    if (typeof n.updatedAt !== 'string') {
      errors.push(`nodes[${i}] ("${n.id}"): missing updatedAt`)
    }
    nodeIds.add(n.id)
  }

  for (let i = 0; i < g.edges.length; i++) {
    const e = g.edges[i] as Record<string, unknown>
    if (!e.source || typeof e.source !== 'string') {
      errors.push(`edges[${i}]: missing or invalid source`)
      continue
    }
    if (!e.target || typeof e.target !== 'string') {
      errors.push(`edges[${i}]: missing or invalid target`)
      continue
    }
    if (!nodeIds.has(e.source as string)) {
      errors.push(`edges[${i}]: source "${e.source}" not found in nodes`)
    }
    if (!nodeIds.has(e.target as string)) {
      errors.push(`edges[${i}]: target "${e.target}" not found in nodes`)
    }
    if (!e.kind || typeof e.kind !== 'string') {
      errors.push(`edges[${i}]: missing or invalid kind`)
    }
  }

  return errors
}
