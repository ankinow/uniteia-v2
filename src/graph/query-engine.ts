/**
 * query-engine.ts — P0.2 GraphRAG Query Engine
 *
 * Hybrid search combining:
 *  1. Semantic retrieval (embeddings → cosine similarity)
 *  2. Graph expansion (1-hop neighbor traversal)
 *  3. Keyword pre-filter (BM25-like fallback)
 *
 * Embedding providers:
 *  - NVIDIA NIM (nv-embed-qa-4) for production
 *  - Local keyword fallback for dev/test
 *
 * Usage:
 *   const engine = new QueryEngine(graph)
 *   const results = await engine.search("AI command center", { topK: 5 })
 *   const expanded = engine.expand("en-magica-overview", { depth: 1 })
 */

import { existsSync, readFileSync } from 'node:fs'
import type { Edge, Entity, EntityGraph, EntityType } from './types'

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

export interface SearchOptions {
  /** Max results to return (default: 10) */
  topK?: number
  /** Minimum similarity score 0-1 (default: 0.3) */
  minScore?: number
  /** Filter by entity type */
  typeFilter?: EntityType[]
  /** Filter by locale */
  localeFilter?: string[]
  /** Include 1-hop expansion in results (default: true) */
  expand?: boolean
  /** Graph expansion depth (default: 1) */
  expandDepth?: number
}

export interface ExpandOptions {
  /** Graph traversal depth (default: 1) */
  depth?: number
  /** Edge kinds to traverse (default: all) */
  edgeKinds?: string[]
  /** Include edge metadata in response (default: false) */
  includeEdges?: boolean
}

export interface SearchResult {
  entity: Entity
  /** Semantic similarity score 0-1 */
  score: number
  /** How this result was found */
  source: 'semantic' | 'keyword' | 'graph_expansion'
  /** Expanded neighbors (if expand=true) */
  neighbors?: Entity[]
}

export interface QueryResult {
  results: SearchResult[]
  /** Total results before topK filtering */
  total: number
  /** Query execution time (ms) */
  elapsed: number
  /** Query metadata */
  meta: {
    semanticHits: number
    graphHits: number
    keywordHits: number
  }
}

export interface ExpandResult {
  entity: Entity
  neighbors: Array<{
    entity: Entity
    edge: Edge
    depth: number
  }>
}

// ═══════════════════════════════════════════════════
// Embedding providers
// ═══════════════════════════════════════════════════

export interface EmbeddingProvider {
  name: string
  /** Generate embedding vector for a text string */
  embed(text: string): Promise<number[]> | number[]
  /** Generate embeddings for multiple texts (batched) */
  embedBatch(texts: string[]): Promise<number[][]> | number[][]
  /** Dimensionality of the embedding vectors */
  dimensions: number
}

/**
 * Local keyword-based embedding (TF-IDF-like bag-of-words).
 * Zero dependencies, works offline. Used as fallback when NVIDIA API is unavailable.
 * Produces sparse binary vectors based on token presence.
 */
export class LocalEmbeddingProvider implements EmbeddingProvider {
  name = 'local-keyword'
  dimensions = 1024

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 1)
  }

  private hashToken(token: string): number {
    let hash = 5381
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) + hash + token.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit int
    }
    return Math.abs(hash)
  }

  embed(text: string): number[] {
    const tokens = this.tokenize(text)
    const vec = new Array(this.dimensions).fill(0)

    // Count token frequencies (limited to dimension size)
    const freq = new Map<number, number>()
    for (const token of tokens) {
      const idx = this.hashToken(token) % this.dimensions
      freq.set(idx, (freq.get(idx) ?? 0) + 1)
    }

    // Normalize by max frequency
    const maxFreq = Math.max(...freq.values(), 1)
    for (const [idx, count] of freq) {
      vec[idx] = count / maxFreq
    }

    return vec
  }

  embedBatch(texts: string[]): number[][] {
    return texts.map(t => this.embed(t))
  }
}

/**
 * NVIDIA NIM embedding provider (nv-embed-qa-4).
 * Requires NVIDIA_API_KEY env var.
 * Falls back gracefully if API is unavailable.
 */
export class NvidiaNimEmbeddingProvider implements EmbeddingProvider {
  name = 'nvidia-nv-embed-qa-4'
  dimensions = 1024

  private apiKey: string
  private baseUrl: string
  private model: string

  constructor(opts?: { apiKey?: string; baseUrl?: string; model?: string }) {
    this.apiKey = opts?.apiKey ?? process.env.NVIDIA_API_KEY ?? ''
    this.baseUrl = opts?.baseUrl ?? 'https://ai.api.nvidia.com/v1/embeddings'
    this.model = opts?.model ?? 'nvidia/nv-embed-qa-4'
  }

  async embed(text: string): Promise<number[]> {
    const results = await this.embedBatch([text])
    return results[0]
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      console.warn('[NvidiaNimEmbedding] No API key — falling back to local embeddings')
      return new LocalEmbeddingProvider().embedBatch(texts)
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: texts.map(t => ({ text: t })),
          encoding_format: 'float',
          input_type: 'passage',
        }),
      })

      if (!response.ok) {
        console.warn(`[NvidiaNimEmbedding] API error ${response.status} — falling back`)
        return new LocalEmbeddingProvider().embedBatch(texts)
      }

      const data = (await response.json()) as { data: Array<{ embedding: number[] }> }
      return data.data.map(d => d.embedding)
    } catch (err) {
      console.warn(`[NvidiaNimEmbedding] Request failed: ${err} — falling back`)
      return new LocalEmbeddingProvider().embedBatch(texts)
    }
  }
}

// ═══════════════════════════════════════════════════
// Vector utilities
// ═══════════════════════════════════════════════════

/**
 * Cosine similarity between two vectors.
 * Returns 0-1 (1 = identical direction).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

/**
 * Compute mean vector for a set of vectors (used for multi-vector queries).
 */
export function meanVector(vectors: number[][]): number[] {
  if (vectors.length === 0) return []
  const dim = vectors[0].length
  const sum = new Array(dim).fill(0)
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      sum[i] += v[i]
    }
  }
  return sum.map(s => s / vectors.length)
}

// ═══════════════════════════════════════════════════
// Query engine
// ═══════════════════════════════════════════════════

export class QueryEngine {
  readonly graph: EntityGraph
  private embeddingProvider: EmbeddingProvider
  private precomputedEmbeddings: Map<string, number[]> | null = null

  constructor(graph: EntityGraph, embeddingProvider?: EmbeddingProvider) {
    this.graph = graph
    this.embeddingProvider = embeddingProvider ?? new NvidiaNimEmbeddingProvider()
  }

  /** Override the embedding provider at runtime */
  setEmbeddingProvider(provider: EmbeddingProvider): void {
    this.embeddingProvider = provider
    this.precomputedEmbeddings = null // Invalidate cache
  }

  /** Get the current embedding provider */
  getEmbeddingProvider(): EmbeddingProvider {
    return this.embeddingProvider
  }

  /**
   * Pre-compute embeddings for all entities.
   * Call once at initialization or from build script.
   */
  async precomputeEmbeddings(): Promise<Map<string, number[]>> {
    if (this.precomputedEmbeddings) return this.precomputedEmbeddings

    const texts = this.graph.nodes.map(n => this.entityToText(n))
    const embeddings = await this.embeddingProvider.embedBatch(texts)

    const map = new Map<string, number[]>()
    for (let i = 0; i < this.graph.nodes.length; i++) {
      map.set(this.graph.nodes[i].id, embeddings[i])
    }

    this.precomputedEmbeddings = map
    return map
  }

  /**
   * Convert entity to searchable text.
   * Weighted: name (3x), description (2x), metadata (1x).
   */
  private entityToText(entity: Entity): string {
    const parts: string[] = [
      entity.name,
      entity.name, // Double weight
      entity.name, // Triple weight
    ]

    if (entity.description) {
      parts.push(entity.description)
      parts.push(entity.description)
    }

    if (entity.type) parts.push(entity.type)
    if (entity.locale) parts.push(entity.locale)
    if (entity.metadata) {
      parts.push(
        ...Object.values(entity.metadata)
          .filter(v => typeof v === 'string')
          .map(v => v as string)
      )
    }

    return parts.join(' ')
  }

  /**
   * Main search entry point — hybrid semantic + keyword + graph expansion.
   *
   * Pipeline:
   *  1. Embed query → cosine similarity against all entities
   *  2. Keyword pre-filter (cheap, catches exact matches)
   *  3. Merge and deduplicate
   *  4. (Optional) 1-hop graph expansion for top results
   *  5. Sort by score, apply filters, return topK
   */
  async search(query: string, options?: SearchOptions): Promise<QueryResult> {
    const start = performance.now()
    const {
      topK = 10,
      minScore = 0.3,
      typeFilter,
      localeFilter,
      expand = true,
      expandDepth = 1,
    } = options ?? {}

    // Phase 1: Embed query
    const queryVec = await this.embeddingProvider.embed(query)

    // Phase 2: Semantic search (cosine similarity)
    const embeddings = await this.precomputeEmbeddings()
    const semanticResults: Array<{ entity: Entity; score: number }> = []

    for (const node of this.graph.nodes) {
      const vec = embeddings.get(node.id)
      if (!vec) continue
      const score = cosineSimilarity(queryVec, vec)
      if (score >= minScore) {
        semanticResults.push({ entity: node, score })
      }
    }

    // Phase 3: Keyword pre-filter (exact/substring match on name & description)
    const queryLower = query.toLowerCase()
    const keywordResults: Array<{ entity: Entity; score: number }> = []

    for (const node of this.graph.nodes) {
      const nameMatch = node.name.toLowerCase().includes(queryLower)
      const descMatch = node.description?.toLowerCase().includes(queryLower)
      const typeMatch = node.type.toLowerCase().includes(queryLower)

      if (nameMatch || descMatch || typeMatch) {
        // Boost: exact name match = 0.95, partial = 0.7, description = 0.5
        const score = nameMatch
          ? node.name.toLowerCase() === queryLower
            ? 0.95
            : 0.7
          : descMatch
            ? 0.5
            : 0.3
        keywordResults.push({ entity: node, score })
      }
    }

    // Phase 4: Merge semantic + keyword results (deduplicate, take max score)
    const merged = new Map<string, SearchResult>()

    for (const r of semanticResults) {
      merged.set(r.entity.id, {
        entity: r.entity,
        score: r.score,
        source: 'semantic',
      })
    }

    for (const r of keywordResults) {
      const existing = merged.get(r.entity.id)
      if (!existing || r.score > existing.score) {
        merged.set(r.entity.id, {
          entity: r.entity,
          score: r.score,
          source: existing?.source ?? 'keyword',
        })
      }
    }

    // Phase 5: Apply type/locale filters
    let candidates = Array.from(merged.values())
    if (typeFilter && typeFilter.length > 0) {
      candidates = candidates.filter(r => typeFilter.includes(r.entity.type))
    }
    if (localeFilter && localeFilter.length > 0) {
      candidates = candidates.filter(r => {
        if (!r.entity.locale) return false
        return localeFilter.includes(r.entity.locale)
      })
    }

    // Phase 6: Sort by score descending
    candidates.sort((a, b) => b.score - a.score)

    // Phase 7: Graph expansion for top results
    if (expand && expandDepth > 0) {
      for (const result of candidates.slice(0, Math.min(topK * 2, candidates.length))) {
        const expansion = this.expand(result.entity.id, { depth: expandDepth })
        if (expansion.neighbors.length > 0) {
          result.neighbors = expansion.neighbors.map(n => n.entity)
        }
      }
    }

    // Phase 8: Apply topK
    const results = candidates.slice(0, topK)

    // Stats
    const semanticHits = results.filter(r => r.source === 'semantic').length
    const graphHits = results.filter(r => r.source === 'graph_expansion').length
    const keywordHits = results.filter(r => r.source === 'keyword').length

    return {
      results,
      total: candidates.length,
      elapsed: Math.round((performance.now() - start) * 100) / 100,
      meta: { semanticHits, graphHits, keywordHits },
    }
  }

  /**
   * Graph expansion — traverse edges from an entity to find neighbors.
   *
   * Supports configurable depth, edge kind filtering, and cycle detection.
   */
  expand(entityId: string, options?: ExpandOptions): ExpandResult {
    const { depth = 1, edgeKinds, includeEdges = false } = options ?? {}

    const entity = this.graph.nodes[this.graph.indexes.byId[entityId]]
    if (!entity) {
      return { entity: null as unknown as Entity, neighbors: [] }
    }

    const visited = new Set<string>([entityId])
    const neighbors: ExpandResult['neighbors'] = []
    const queue: Array<{ id: string; currentDepth: number }> = [{ id: entityId, currentDepth: 0 }]

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!
      if (currentDepth >= depth) continue

      // Find all edges where this entity is source or target
      const outgoingEdges = this.graph.edges.filter(e => e.source === id)
      const incomingEdges = this.graph.edges.filter(e => e.target === id)

      const relevantEdges = [...outgoingEdges, ...incomingEdges].filter(e => {
        if (!edgeKinds || edgeKinds.length === 0) return true
        return edgeKinds.includes(e.kind)
      })

      for (const edge of relevantEdges) {
        const neighborId = edge.source === id ? edge.target : edge.source
        if (visited.has(neighborId)) continue
        visited.add(neighborId)

        const neighborEntity = this.graph.nodes[this.graph.indexes.byId[neighborId]]
        if (!neighborEntity) continue

        neighbors.push({
          entity: neighborEntity,
          edge: includeEdges ? edge : ({} as Edge),
          depth: currentDepth + 1,
        })

        if (currentDepth + 1 < depth) {
          queue.push({ id: neighborId, currentDepth: currentDepth + 1 })
        }
      }
    }

    return { entity, neighbors }
  }

  /**
   * Get entity by ID.
   */
  getEntity(id: string): Entity | undefined {
    const idx = this.graph.indexes.byId[id]
    if (idx === undefined) return undefined
    return this.graph.nodes[idx]
  }

  /**
   * Get all entities of a specific type.
   */
  getEntitiesByType(type: EntityType): Entity[] {
    const ids = this.graph.indexes.byType[type] ?? []
    return ids.map(id => this.graph.nodes[this.graph.indexes.byId[id]]).filter(Boolean)
  }

  /**
   * Get all entities in a specific locale.
   */
  getEntitiesByLocale(locale: string): Entity[] {
    const ids = this.graph.indexes.byLocale[locale] ?? []
    return ids.map(id => this.graph.nodes[this.graph.indexes.byId[id]]).filter(Boolean)
  }

  /**
   * Get statistics about the graph.
   */
  getStats(): Record<string, unknown> {
    return {
      totalNodes: this.graph.nodes.length,
      totalEdges: this.graph.edges.length,
      byType: Object.fromEntries(
        Object.entries(this.graph.indexes.byType).map(([type, ids]) => [type, ids.length])
      ) as Record<string, number>,
      byLocale: Object.fromEntries(
        Object.entries(this.graph.indexes.byLocale).map(([locale, ids]) => [locale, ids.length])
      ) as Record<string, number>,
    }
  }
}

/**
 * Load an EntityGraph from a JSON file path.
 */
export function loadEntityGraph(path: string): EntityGraph {
  if (!existsSync(path)) {
    throw new Error(`Entity graph not found at: ${path}`)
  }
  const raw = readFileSync(path, 'utf-8')
  return JSON.parse(raw) as EntityGraph
}

/**
 * Create a query engine from a JSON file path.
 * Convenience function for scripts and demos.
 */
export function createEngineFromFile(path: string, provider?: EmbeddingProvider): QueryEngine {
  const graph = loadEntityGraph(path)
  return new QueryEngine(graph, provider)
}
