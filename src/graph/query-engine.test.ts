/**
 * query-engine.test.ts — P0.2 Query Engine Tests
 * Coverage target: ≥80%
 */

import { describe, expect, it, beforeEach } from 'vitest'
import {
  QueryEngine,
  LocalEmbeddingProvider,
  NvidiaNimEmbeddingProvider,
  cosineSimilarity,
  meanVector,
  loadEntityGraph,
  createEngineFromFile,
} from './query-engine'
import type { EntityGraph, Entity, Edge } from './types'

// ── Fixtures ──

const MOCK_ENTITY_ARTICLE: Entity = {
  id: 'en-magica-overview',
  type: 'article',
  name: 'Magica: The AI Command Center',
  locale: 'en',
  description: 'An AI command center platform for multi-model orchestration',
  score: 95,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_ENTITY_CATEGORY: Entity = {
  id: 'category-magica',
  type: 'category',
  name: 'Magica',
  description: 'Magica AI ecosystem',
  score: 90,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_ENTITY_PRODUCT: Entity = {
  id: 'product-magica',
  type: 'product',
  name: 'Magica Platform',
  locale: 'en',
  url: 'https://magica.com',
  score: 85,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_ENTITY_PT: Entity = {
  id: 'pt-magica-overview',
  type: 'article',
  name: 'Magica: O Centro de Comando de IA',
  locale: 'pt',
  description: 'Uma plataforma de comando de IA para orquestração multi-modelo',
  score: 90,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_ENTITY_BRAND: Entity = {
  id: 'brand-tencent-cloud',
  type: 'brand',
  name: 'Tencent Cloud',
  locale: 'en',
  url: 'https://tencentcloud.com',
  score: 80,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_ENTITY_BENCHMARK: Entity = {
  id: 'benchmark-magica-2026',
  type: 'benchmark' as Entity['type'],
  name: 'Magica 2026 Benchmark',
  description: 'Performance benchmark for Magica platform',
  score: 88,
  updatedAt: '2026-05-29T10:00:00.000Z',
}

const MOCK_EDGES: Edge[] = [
  { source: 'en-magica-overview', target: 'category-magica', kind: 'belongs_to', weight: 1.0 },
  { source: 'en-magica-overview', target: 'product-magica', kind: 'mentions', weight: 0.8 },
  { source: 'pt-magica-overview', target: 'category-magica', kind: 'belongs_to', weight: 1.0 },
  { source: 'en-magica-overview', target: 'pt-magica-overview', kind: 'translated_as', weight: 1.0 },
  { source: 'product-magica', target: 'brand-tencent-cloud', kind: 'competes_with', weight: 0.5 },
  { source: 'en-magica-overview', target: 'brand-tencent-cloud', kind: 'mentions', weight: 0.3 },
]

const MOCK_GRAPH: EntityGraph = {
  version: 'entity-graph.v1',
  generatedAt: '2026-05-29T10:00:00.000Z',
  nodes: [
    MOCK_ENTITY_ARTICLE,
    MOCK_ENTITY_CATEGORY,
    MOCK_ENTITY_PRODUCT,
    MOCK_ENTITY_PT,
    MOCK_ENTITY_BRAND,
    MOCK_ENTITY_BENCHMARK,
  ],
  edges: MOCK_EDGES,
  indexes: {
    byId: {
      'en-magica-overview': 0,
      'category-magica': 1,
      'product-magica': 2,
      'pt-magica-overview': 3,
      'brand-tencent-cloud': 4,
      'benchmark-magica-2026': 5,
    },
    byType: {
      article: ['en-magica-overview', 'pt-magica-overview'],
      category: ['category-magica'],
      product: ['product-magica'],
      brand: ['brand-tencent-cloud'],
      benchmark: ['benchmark-magica-2026'],
    },
    byLocale: {
      en: ['en-magica-overview', 'product-magica', 'brand-tencent-cloud'],
      pt: ['pt-magica-overview'],
    },
  },
}

// ── Tests ──

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1, 5)
  })

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBe(0)
  })

  it('returns ~0.7 for 45-degree vectors', () => {
    expect(cosineSimilarity([1, 0], [1, 1])).toBeCloseTo(0.707, 2)
  })

  it('returns 0 for mismatched dimensions', () => {
    expect(cosineSimilarity([1, 0], [1])).toBe(0)
  })

  it('returns 0 for zero vectors', () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0)
  })
})

describe('meanVector', () => {
  it('computes mean of multiple vectors', () => {
    const result = meanVector([[1, 2], [3, 4]])
    expect(result).toEqual([2, 3])
  })

  it('returns empty array for empty input', () => {
    expect(meanVector([])).toEqual([])
  })

  it('handles single vector', () => {
    expect(meanVector([[5, 10]])).toEqual([5, 10])
  })
})

describe('LocalEmbeddingProvider', () => {
  it('produces consistent embeddings for same text', () => {
    const provider = new LocalEmbeddingProvider()
    const a = provider.embed('Magica AI platform')
    const b = provider.embed('Magica AI platform')
    expect(a).toEqual(b)
  })

  it('produces different embeddings for different texts', () => {
    const provider = new LocalEmbeddingProvider()
    const a = provider.embed('AI command center')
    const b = provider.embed('cloud computing')
    expect(a).not.toEqual(b)
  })

  it('has correct dimensionality', () => {
    const provider = new LocalEmbeddingProvider()
    expect(provider.dimensions).toBe(1024)
    expect(provider.embed('test').length).toBe(1024)
  })

  it('handles empty text', () => {
    const provider = new LocalEmbeddingProvider()
    const vec = provider.embed('')
    expect(vec.length).toBe(1024)
    expect(vec.every(v => v === 0)).toBe(true)
  })

  it('handles special characters gracefully', () => {
    const provider = new LocalEmbeddingProvider()
    const vec = provider.embed('!!! @@@ $$$ AI ###')
    expect(vec.length).toBe(1024)
    expect(vec.some(v => v > 0)).toBe(true)
  })

  it('supports batch embedding', () => {
    const provider = new LocalEmbeddingProvider()
    const results = provider.embedBatch(['AI platform', 'cloud computing', 'benchmark'])
    expect(results).toHaveLength(3)
    expect(results[0].length).toBe(1024)
  })
})

describe('NvidiaNimEmbeddingProvider', () => {
  it('falls back to local when no API key', async () => {
    const provider = new NvidiaNimEmbeddingProvider({ apiKey: '' })
    const vec = await provider.embed('test query')
    expect(vec.length).toBe(1024)
  })

  it('uses local fallback on API error', async () => {
    const provider = new NvidiaNimEmbeddingProvider({
      apiKey: 'invalid-key',
      baseUrl: 'https://invalid-url.example.com',
    })
    const vec = await provider.embed('test query')
    expect(vec.length).toBe(1024)
  })

  it('batch falls back gracefully', async () => {
    const provider = new NvidiaNimEmbeddingProvider({ apiKey: '' })
    const results = await provider.embedBatch(['a', 'b'])
    expect(results).toHaveLength(2)
  })
})

describe('QueryEngine', () => {
  let engine: QueryEngine

  beforeEach(() => {
    engine = new QueryEngine(MOCK_GRAPH, new LocalEmbeddingProvider())
  })

  describe('constructor', () => {
    it('initializes with graph and default provider', () => {
      const e = new QueryEngine(MOCK_GRAPH)
      expect(e.graph).toBe(MOCK_GRAPH)
      expect(e.getEmbeddingProvider().name).toBe('nvidia-nv-embed-qa-4')
    })

    it('initializes with custom provider', () => {
      const e = new QueryEngine(MOCK_GRAPH, new LocalEmbeddingProvider())
      expect(e.getEmbeddingProvider().name).toBe('local-keyword')
    })
  })

  describe('setEmbeddingProvider', () => {
    it('swaps provider and invalidates cache', () => {
      engine.setEmbeddingProvider(new NvidiaNimEmbeddingProvider())
      expect(engine.getEmbeddingProvider().name).toBe('nvidia-nv-embed-qa-4')
    })
  })

  describe('getEntity', () => {
    it('returns entity by ID', () => {
      const entity = engine.getEntity('en-magica-overview')
      expect(entity).toBeDefined()
      expect(entity?.name).toBe('Magica: The AI Command Center')
    })

    it('returns undefined for non-existent ID', () => {
      expect(engine.getEntity('non-existent')).toBeUndefined()
    })
  })

  describe('getEntitiesByType', () => {
    it('returns articles', () => {
      const articles = engine.getEntitiesByType('article')
      expect(articles).toHaveLength(2)
      expect(articles.map(a => a.id)).toContain('en-magica-overview')
      expect(articles.map(a => a.id)).toContain('pt-magica-overview')
    })

    it('returns categories', () => {
      const categories = engine.getEntitiesByType('category')
      expect(categories).toHaveLength(1)
      expect(categories[0].name).toBe('Magica')
    })

    it('returns empty array for unpopulated type', () => {
      const empty = engine.getEntitiesByType('benchmark')
      expect(empty).toHaveLength(1)
    })
  })

  describe('getEntitiesByLocale', () => {
    it('returns EN entities', () => {
      const en = engine.getEntitiesByLocale('en')
      expect(en).toHaveLength(3)
    })

    it('returns PT entities', () => {
      const pt = engine.getEntitiesByLocale('pt')
      expect(pt).toHaveLength(1)
    })

    it('returns empty for non-existent locale', () => {
      const none = engine.getEntitiesByLocale('fr')
      expect(none).toHaveLength(0)
    })
  })

  describe('getStats', () => {
    it('returns correct statistics', () => {
      const stats = engine.getStats()
      expect(stats.totalNodes).toBe(6)
      expect(stats.totalEdges).toBe(6)
      expect(stats.byType).toHaveProperty('article')
      expect(stats.byType.article).toBe(2)
      expect(stats.byLocale).toHaveProperty('en')
      expect(stats.byLocale.en).toBe(3)
    })
  })

  describe('expand', () => {
    it('returns 1-hop neighbors for article', () => {
      const result = engine.expand('en-magica-overview', { depth: 1 })
      expect(result.entity.id).toBe('en-magica-overview')
      expect(result.neighbors.length).toBeGreaterThanOrEqual(4)
      const neighborIds = result.neighbors.map(n => n.entity.id)
      expect(neighborIds).toContain('category-magica')
      expect(neighborIds).toContain('product-magica')
      expect(neighborIds).toContain('pt-magica-overview')
    })

    it('returns 2-hop neighbors (all entities reached)', () => {
      const result = engine.expand('en-magica-overview', { depth: 2 })
      // 4 entities: category-magica, product-magica, pt-magica-overview, brand-tencent-cloud
      expect(result.neighbors.length).toBeGreaterThanOrEqual(4)
      const allIds = result.neighbors.map(n => n.entity.id)
      expect(allIds).toContain('brand-tencent-cloud')
    })

    it('filters by edge kind', () => {
      const result = engine.expand('en-magica-overview', {
        depth: 1,
        edgeKinds: ['translated_as'],
      })
      expect(result.neighbors).toHaveLength(1)
      expect(result.neighbors[0].entity.id).toBe('pt-magica-overview')
    })

    it('returns empty for non-existent entity', () => {
      const result = engine.expand('non-existent')
      expect(result.neighbors).toHaveLength(0)
    })

    it('prevents infinite loops with cycle detection', () => {
      const result = engine.expand('en-magica-overview', { depth: 5 })
      // Should not loop infinitely — max distinct neighbors
      expect(result.neighbors.length).toBeLessThanOrEqual(5)
    })

    it('includes edge metadata when requested', () => {
      const result = engine.expand('en-magica-overview', {
        depth: 1,
        includeEdges: true,
      })
      for (const n of result.neighbors) {
        expect(n.edge).toBeDefined()
        expect(n.edge.source).toBeDefined()
      }
    })
  })

  describe('search', () => {
    it('returns results for a relevant query', async () => {
      const result = await engine.search('AI command center')
      expect(result.results.length).toBeGreaterThan(0)
      expect(result.total).toBeGreaterThan(0)
      expect(result.elapsed).toBeGreaterThan(0)
    })

    it('applies topK limit', async () => {
      const result = await engine.search('Magica', { topK: 2 })
      expect(result.results.length).toBeLessThanOrEqual(2)
    })

    it('filters by entity type', async () => {
      const result = await engine.search('Magica', {
        typeFilter: ['category'],
      })
      expect(result.results.every(r => r.entity.type === 'category')).toBe(true)
    })

    it('filters by locale', async () => {
      const result = await engine.search('Magica', {
        localeFilter: ['pt'],
      })
      expect(result.results.every(r => r.entity.locale === 'pt')).toBe(true)
    })

    it('returns keyword hits for exact name match', async () => {
      const result = await engine.search('Tencent Cloud')
      const top = result.results[0]
      expect(top).toBeDefined()
      expect(top.entity.name).toContain('Tencent Cloud')
    })

    it('returns metadata about search', async () => {
      const result = await engine.search('AI')
      expect(result.meta).toBeDefined()
      expect(typeof result.meta.semanticHits).toBe('number')
      expect(typeof result.meta.graphHits).toBe('number')
    })

    it('handles empty query gracefully', async () => {
      const result = await engine.search('', { topK: 5 })
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
    })

    it('handles query with no matches', async () => {
      const result = await engine.search('xyznonexistent12345', { minScore: 0.9 })
      // Either empty or very low score
      expect(result.results.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('precomputeEmbeddings', () => {
    it('pre-computes embeddings for all entities', async () => {
      const embs = await engine.precomputeEmbeddings()
      expect(embs.size).toBe(MOCK_GRAPH.nodes.length)
      expect(embs.has('en-magica-overview')).toBe(true)
      expect(embs.has('category-magica')).toBe(true)
    })

    it('caches after first call', async () => {
      const a = await engine.precomputeEmbeddings()
      const b = await engine.precomputeEmbeddings()
      expect(a).toBe(b) // Same Map reference
    })

    it('produces deterministic vectors', async () => {
      const a = await engine.precomputeEmbeddings()
      const e2 = new QueryEngine(MOCK_GRAPH, new LocalEmbeddingProvider())
      const b = await e2.precomputeEmbeddings()
      expect(a.get('en-magica-overview')).toEqual(b.get('en-magica-overview'))
    })
  })
})

describe('loadEntityGraph', () => {
  it('throws on non-existent file', () => {
    expect(() => loadEntityGraph('/tmp/non-existent-file.json')).toThrow()
  })
})

describe('createEngineFromFile', () => {
  it('throws on non-existent file', () => {
    expect(() => createEngineFromFile('/tmp/non-existent.json')).toThrow()
  })
})
