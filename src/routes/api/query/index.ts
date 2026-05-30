import type { RequestHandler } from '@builder.io/qwik-city'

interface SearchResult {
  id: string
  name: string
  type: string
  locale: string
  description?: string
  score: number
}

// Simple cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom === 0 ? 0 : dot / denom
}

export const onGet: RequestHandler = async ({ query, json, request }) => {
  const q = query.get('q')?.trim() ?? ''
  const k = Math.min(Number.parseInt(query.get('k') ?? '10', 10) || 10, 50)
  const locale = query.get('locale') ?? ''

  if (!q) {
    json(400, { error: 'Missing query parameter ?q=' })
    return
  }

  // Load entity graph
  let graph: any = null
  try {
    const url = new URL('/entity-graph.json', request.url).toString()
    const resp = await fetch(url)
    if (resp.ok) graph = await resp.json()
  } catch { /* silent */ }

  if (!graph?.nodes?.length) {
    json(503, { error: 'Entity graph not loaded' })
    return
  }

  // Load embeddings
  let embeddings: Record<string, number[]> | null = null
  try {
    const url = new URL('/entity-embeddings.json', request.url).toString()
    const resp = await fetch(url)
    if (resp.ok) {
      const data = await resp.json()
      if (data && typeof data === 'object') {
        if (data.embeddings) embeddings = data.embeddings
        else {
          const first = Object.values(data)[0]
          if (first && Array.isArray(first)) embeddings = data as Record<string, number[]>
        }
      }
    }
  } catch { /* silent */ }

  // Get dimensions for hash embedding
  const firstVal = embeddings ? Object.values(embeddings)[0] : undefined
  const dims = firstVal && Array.isArray(firstVal) ? firstVal.length : 1024

  // Compute query embedding (deterministic hash, matches LocalEmbeddingProvider)
  const words = q.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1)
  const queryVec = new Array(dims).fill(0)
  for (const word of words) {
    let hash = 5381
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) + hash + word.charCodeAt(i)
      hash = hash & hash
    }
    const idx = Math.abs(hash) % dims
    queryVec[idx] = (queryVec[idx] ?? 0) + 1
  }
  const maxFreq = Math.max(...queryVec, 1)
  for (let i = 0; i < dims; i++) queryVec[i] = (queryVec[i] ?? 0) / maxFreq

  // Score nodes
  const results: SearchResult[] = []
  for (const node of graph.nodes) {
    if (locale && node.locale !== locale) continue
    let score = 0

    const nodeEmb = embeddings ? embeddings[node.id] : undefined
    if (nodeEmb) {
      score = cosineSimilarity(queryVec, nodeEmb)
    } else {
      const name = (node.name ?? '').toLowerCase()
      const desc = (node.description ?? '').toLowerCase()
      const ql = q.toLowerCase()
      const qw = ql.split(/\W+/).filter(Boolean)
      for (const w of qw) {
        if (name.includes(w)) score += 0.3
        if (desc.includes(w)) score += 0.1
      }
      if (name.includes(ql)) score += 0.5
      score = Math.min(score / Math.max(qw.length, 1), 1)
    }

    if (score > 0.1) {
      results.push({
        id: node.id,
        name: node.name ?? '',
        type: node.type ?? '',
        locale: node.locale ?? '',
        description: node.description ?? '',
        score: Math.round(score * 1000) / 1000,
      })
    }
  }

  results.sort((a, b) => b.score - a.score)

  json(200, {
    query: q,
    total: results.length,
    top: results.slice(0, k),
    engine: embeddings ? 'semantic' : 'keyword',
  })
}
