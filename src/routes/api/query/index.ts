/**
 * src/routes/api/query/index.ts — P0.3: Query Engine API endpoint
 *
 * Exposes the entity graph query engine at /api/query?q=<query>&k=<top_k>
 * for runtime use by the frontend (search suggestions, related content).
 *
 * Route: GET /api/query?q=<search_query>&k=<max_results>&locale=<locale>
 *
 * Returns: JSON with results ranked by semantic similarity.
 * Falls back to keyword search when embeddings are unavailable.
 *
 * Edge-compatible: no node:fs imports, async fetch for NIM API.
 */

import type { RequestHandler } from '@builder.io/qwik-city'

// Lazy-load entity graph to avoid blocking worker startup
let entityGraph: EntityGraph | null = null

interface EntityNode {
  id: string
  type: string
  name: string
  locale: string
  description?: string
  score?: number
  metadata?: Record<string, unknown>
}

interface EntityEdge {
  source: string
  target: string
  type: string
}

interface EntityGraph {
  version: string
  generatedAt: string
  nodes: EntityNode[]
  edges: EntityEdge[]
  indexes?: Record<string, Record<string, number>>
}

interface EmbeddingIndex {
  version: string
  generatedAt: string
  model: string
  dimensions: number
  embeddings: Record<string, number[]>
}

// Simple cosine similarity (no dependencies)
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom === 0 ? 0 : dot / denom
}

// Deterministic hash-based embedding (zero deps, matches build-time)
function hashEmbed(text: string, dims: number): number[] {
  const vec = new Array(dims).fill(0)
  const words = text.toLowerCase().split(/\W+/).filter(Boolean)
  for (const word of words) {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i)
      hash |= 0
    }
    const idx = Math.abs(hash) % dims
    vec[idx] += 1
  }
  const max = Math.max(...vec, 1)
  for (let i = 0; i < dims; i++) {
    vec[i] /= max
  }
  return vec
}

async function loadGraph(req: Request): Promise<EntityGraph | null> {
  if (entityGraph) return entityGraph

  try {
    // Cloudflare Pages Workers: fetch static assets via env.ASSETS
    const assets = (req as any).env?.ASSETS
    if (assets) {
      const resp = await assets.fetch(new URL('/entity-graph.json', req.url))
      if (resp.ok) {
        entityGraph = await resp.json()
        return entityGraph
      }
    }
    // Fallback: relative fetch
    const resp = await fetch(new URL('/entity-graph.json', req.url).toString())
    if (!resp.ok) return null
    entityGraph = await resp.json()
    return entityGraph
  } catch {
    return null
  }
}

async function loadEmbeddings(req: Request): Promise<EmbeddingIndex | null> {
  try {
    const assets = (req as any).env?.ASSETS
    if (assets) {
      const resp = await assets.fetch(new URL('/entity-embeddings.json', req.url))
      if (resp.ok) return await resp.json()
    }
    const resp = await fetch(new URL('/entity-embeddings.json', req.url).toString())
    if (!resp.ok) return null
    return await resp.json()
  } catch {
    return null
  }
}

interface SearchResult {
  id: string
  name: string
  type: string
  locale: string
  description?: string
  score: number
}

export const onGet: RequestHandler = async ({ query, json, status, request }) => {
  const q = query.get('q')?.trim()
  const k = Math.min(Number.parseInt(query.get('k') ?? '10', 10) || 10, 50)
  const locale = query.get('locale') ?? ''

  if (!q) {
    json(400, { error: 'Missing query parameter ?q=' })
    return
  }

  const graph = await loadGraph(request)
  if (!graph || !graph.nodes?.length) {
    json(503, { error: 'Entity graph not loaded' })
    return
  }

  const embeddings = await loadEmbeddings(request)
  const queryVec = hashEmbed(q, embeddings?.dimensions ?? 1024)

  // Score each node by cosine similarity
  const results: SearchResult[] = []

  for (const node of graph.nodes) {
    // Filter by locale if specified
    if (locale && node.locale !== locale) continue

    let score = 0

    // Semantic score
    if (embeddings?.embeddings?.[node.id]) {
      score = cosineSimilarity(queryVec, embeddings.embeddings[node.id])
    } else {
      // Fallback: keyword matching
      const nameLower = (node.name ?? '').toLowerCase()
      const descLower = (node.description ?? '').toLowerCase()
      const queryLower = q.toLowerCase()
      const queryWords = queryLower.split(/\W+/).filter(Boolean)

      for (const word of queryWords) {
        if (nameLower.includes(word)) score += 0.3
        if (descLower.includes(word)) score += 0.1
      }
      // Exact name match boost
      if (nameLower.includes(queryLower)) score += 0.5
      // Normalize
      score = Math.min(score / queryWords.length, 1)
    }

    if (score > 0.1) {
      results.push({
        id: node.id,
        name: node.name,
        type: node.type,
        locale: node.locale,
        description: node.description ?? '',
        score: Math.round(score * 1000) / 1000,
      })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  json(200, {
    query: q,
    total: results.length,
    top: results.slice(0, k),
    engine: embeddings?.embeddings ? 'semantic' : 'keyword',
  })
}
