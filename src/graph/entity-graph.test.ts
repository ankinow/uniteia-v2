/**
 * entity-graph.test.ts
 *
 * Tests for entity extraction + graph builder (P0.1).
 * Coverage target: ≥80%
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { extractEntities, extractFromMarkdown, parseFrontmatter } from './entity-extractor'
import { buildEntityGraph } from './entity-graph'
import { validateEntityGraph } from './types'

// ── Fixtures ──

const SAMPLE_MARKDOWN = `---
slug: magica-overview
lang: en
title: "Magica: The AI Command Center"
verdict: trusted
quality_score: 95
subjects:
  - magica
  - ai-platform
  - multi-model
referral_links:
  - url: https://magica.com
    title: Magica Official Site
  - url: https://try.magica.com
    title: Magica Free Trial
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
---

# Article body here
`

const SAMPLE_MINIMAL = `---
slug: test-article
lang: en
title: "Test Article"
---
Body
`

const SAMPLE_NO_FRONTMATTER = `# Just a heading

No frontmatter here.`

const SAMPLE_MULTI_LOCALE_PT = `---
slug: magica-overview
lang: pt
title: "Magica: O Centro de Comando de IA"
verdict: trusted
quality_score: 90
subjects:
  - magica
  - ai-platform
referral_links:
  - url: https://magica.com
    title: Magica Site
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
---
`

const SAMPLE_WITH_DOCS_LINK = `---
slug: mcp-server
lang: en
title: "Building MCP Servers"
subjects:
  - mcp
  - development
referral_links:
  - url: https://docs.magica.com
    title: Magica Documentation
  - url: https://modelcontextprotocol.io
    title: MCP Specification
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
---
`

// ── Helpers ──

function createTempContent(locale: string, slug: string, content: string): string {
  const dir = `/tmp/entity-graph-test/${locale}`
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const path = join(dir, `${slug}.md`)
  writeFileSync(path, content, 'utf-8')
  return path
}

function cleanupTemp(): void {
  try {
    rmSync('/tmp/entity-graph-test', { recursive: true, force: true })
  } catch {}
}

// ── Tests: parseFrontmatter ──

describe('parseFrontmatter', () => {
  it('parses full frontmatter correctly', () => {
    const result = parseFrontmatter(SAMPLE_MARKDOWN)
    expect(result).not.toBeNull()
    expect(result?.slug).toBe('magica-overview')
    expect(result?.lang).toBe('en')
    expect(result?.title).toBe('Magica: The AI Command Center')
    expect(result?.verdict).toBe('trusted')
    expect(result?.quality_score).toBe(95)
    expect(result?.subjects).toEqual(['magica', 'ai-platform', 'multi-model'])
    expect(result?.referral_links).toHaveLength(2)
    expect(result?.referral_links?.[0].url).toBe('https://magica.com')
    expect(result?.referral_links?.[0].title).toBe('Magica Official Site')
    expect(result?.metadata?.created_at).toBe('2026-05-25T10:00:00.000Z')
  })

  it('parses minimal frontmatter', () => {
    const result = parseFrontmatter(SAMPLE_MINIMAL)
    expect(result).not.toBeNull()
    expect(result?.slug).toBe('test-article')
    expect(result?.title).toBe('Test Article')
    expect(result?.subjects).toBeUndefined()
    expect(result?.referral_links).toBeUndefined()
  })

  it('returns null for missing frontmatter', () => {
    expect(parseFrontmatter(SAMPLE_NO_FRONTMATTER)).toBeNull()
  })

  it('returns null for empty content', () => {
    expect(parseFrontmatter('')).toBeNull()
  })

  it('returns null for missing essential fields', () => {
    const result = parseFrontmatter(`---
lang: en
title: No Slug
---
`)
    expect(result).toBeNull()
  })
})

// ── Tests: extractEntities ──

describe('extractEntities', () => {
  it('extracts article entity with correct fields', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { entities, edges } = extractEntities('/content/apex/en/magica-overview.md', fm)

    const article = entities.find(e => e.type === 'article')
    expect(article).toBeDefined()
    expect(article?.id).toBe('en-magica-overview')
    expect(article?.name).toBe('Magica: The AI Command Center')
    expect(article?.locale).toBe('en')
    expect(article?.score).toBe(95)
  })

  it('extracts category entities from subjects', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { entities, edges } = extractEntities('/test.md', fm)

    const categories = entities.filter(e => e.type === 'category')
    expect(categories).toHaveLength(3)

    const magicaCat = entities.find(e => e.id === 'category-magica')
    expect(magicaCat).toBeDefined()
    expect(magicaCat?.name).toBe('Magica')
  })

  it('creates belongs_to edges for each subject', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { edges } = extractEntities('/test.md', fm)

    const belongsTo = edges.filter(e => e.kind === 'belongs_to')
    expect(belongsTo).toHaveLength(3)
    expect(belongsTo[0].source).toBe('en-magica-overview')
  })

  it('extracts product entities from referral links', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { entities, edges } = extractEntities('/test.md', fm)

    const products = entities.filter(e => e.type === 'product')
    expect(products).toHaveLength(2)

    const magicaSite = entities.find(e => e.id === 'product-magica-official-site')
    expect(magicaSite).toBeDefined()
    expect(magicaSite?.url).toBe('https://magica.com')
  })

  it('creates mentions edges for brands', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { edges } = extractEntities('/test.md', fm)

    const mentions = edges.filter(e => e.kind === 'mentions')
    expect(mentions.length).toBeGreaterThanOrEqual(1)
  })

  it('creates has_affiliate edges for product links', () => {
    const fm = parseFrontmatter(SAMPLE_MARKDOWN)!
    const { edges } = extractEntities('/test.md', fm)

    const affiliate = edges.filter(e => e.kind === 'has_affiliate')
    expect(affiliate.length).toBeGreaterThanOrEqual(2)
  })

  it('does not create product entities for doc/spec links', () => {
    const fm = parseFrontmatter(SAMPLE_WITH_DOCS_LINK)!
    const { entities } = extractEntities('/test.md', fm)

    const _products = entities.filter(e => e.type === 'product')
    // Documentation and Specification links should NOT become product entities
    const docProduct = entities.find(e => e.name.includes('Documentation'))
    const specProduct = entities.find(e => e.name.includes('Specification'))
    expect(docProduct).toBeUndefined()
    expect(specProduct).toBeUndefined()
  })

  it('returns empty result for missing frontmatter', () => {
    const result = extractFromMarkdown('/test.md', SAMPLE_NO_FRONTMATTER)
    expect(result.entities).toHaveLength(0)
    expect(result.edges).toHaveLength(0)
  })

  it('handles minimal frontmatter gracefully', () => {
    const fm = parseFrontmatter(SAMPLE_MINIMAL)!
    const { entities, edges } = extractEntities('/test.md', fm)

    const article = entities.find(e => e.type === 'article')
    expect(article).toBeDefined()
    // No subjects = no category entities
    expect(entities.filter(e => e.type === 'category')).toHaveLength(0)
    // No referral_links = no product/brand edges
    expect(edges.filter(e => e.kind === 'mentions')).toHaveLength(0)
  })
})

// ── Tests: validateEntityGraph ──

describe('validateEntityGraph', () => {
  it('accepts a valid entity graph', () => {
    const graph = {
      version: 'entity-graph.v1',
      generatedAt: '2026-05-29T00:00:00.000Z',
      nodes: [
        {
          id: 'en-test',
          type: 'article',
          name: 'Test',
          score: 95,
          updatedAt: '2026-05-29T00:00:00.000Z',
        },
        {
          id: 'category-test',
          type: 'category',
          name: 'Test Category',
          score: 100,
          updatedAt: '2026-05-29T00:00:00.000Z',
        },
      ],
      edges: [{ source: 'en-test', target: 'category-test', kind: 'belongs_to' }],
      indexes: { byId: {}, byType: {}, byLocale: {} },
    }
    expect(validateEntityGraph(graph)).toHaveLength(0)
  })

  it('rejects missing version', () => {
    const graph = { nodes: [], edges: [], indexes: {} }
    const errors = validateEntityGraph(graph)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain('version')
  })

  it('rejects missing nodes', () => {
    const errors = validateEntityGraph({ version: 'entity-graph.v1' })
    expect(errors.some(e => e.includes('nodes'))).toBe(true)
  })

  it('rejects invalid entity type', () => {
    const graph = {
      version: 'entity-graph.v1',
      generatedAt: '2026-05-29T00:00:00.000Z',
      nodes: [
        { id: 'x', type: 'invalid', name: 'X', score: 50, updatedAt: '2026-05-29T00:00:00.000Z' },
      ],
      edges: [],
      indexes: {},
    }
    const errors = validateEntityGraph(graph)
    expect(errors.some(e => e.includes('invalid type'))).toBe(true)
  })

  it('rejects edge with missing source', () => {
    const graph = {
      version: 'entity-graph.v1',
      generatedAt: '2026-05-29T00:00:00.000Z',
      nodes: [
        {
          id: 'en-test',
          type: 'article',
          name: 'Test',
          score: 95,
          updatedAt: '2026-05-29T00:00:00.000Z',
        },
      ],
      edges: [{ target: 'en-test', kind: 'mentions' }],
      indexes: {},
    }
    const errors = validateEntityGraph(graph)
    expect(errors.some(e => e.includes('source'))).toBe(true)
  })

  it('rejects edge referencing non-existent node', () => {
    const graph = {
      version: 'entity-graph.v1',
      generatedAt: '2026-05-29T00:00:00.000Z',
      nodes: [
        {
          id: 'en-test',
          type: 'article',
          name: 'Test',
          score: 95,
          updatedAt: '2026-05-29T00:00:00.000Z',
        },
      ],
      edges: [{ source: 'en-test', target: 'ghost-node', kind: 'mentions' }],
      indexes: {},
    }
    const errors = validateEntityGraph(graph)
    expect(errors.some(e => e.includes('ghost-node'))).toBe(true)
  })

  it('rejects invalid score range', () => {
    const graph = {
      version: 'entity-graph.v1',
      generatedAt: '2026-05-29T00:00:00.000Z',
      nodes: [
        { id: 'x', type: 'article', name: 'X', score: 150, updatedAt: '2026-05-29T00:00:00.000Z' },
      ],
      edges: [],
      indexes: {},
    }
    const errors = validateEntityGraph(graph)
    expect(errors.some(e => e.includes('score'))).toBe(true)
  })
})

// ── Tests: buildEntityGraph ──

describe('buildEntityGraph', () => {
  beforeEach(() => cleanupTemp())
  afterEach(() => cleanupTemp())

  it('builds graph from temp content files', () => {
    createTempContent('en', 'article-1', SAMPLE_MARKDOWN)
    createTempContent('pt', 'article-1', SAMPLE_MULTI_LOCALE_PT)

    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test' })

    expect(result.stats.totalArticles).toBe(2)
    expect(result.stats.totalEntities).toBeGreaterThanOrEqual(4)
    expect(result.stats.totalEdges).toBeGreaterThan(0)
    expect(result.stats.errors).toHaveLength(0)
  })

  it('creates translation edges between same-slug articles', () => {
    createTempContent('en', 'overview', SAMPLE_MARKDOWN)
    createTempContent('pt', 'overview', SAMPLE_MULTI_LOCALE_PT)

    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test' })
    const transEdges = result.graph.edges.filter(e => e.kind === 'translated_as')
    expect(transEdges).toHaveLength(1)
    expect(transEdges[0].source).toBe('en-magica-overview')
    expect(transEdges[0].target).toBe('pt-magica-overview')
  })

  it('generates valid entity graph (schema-valid)', () => {
    createTempContent('en', 'a1', SAMPLE_MARKDOWN)
    createTempContent('en', 'minimal', SAMPLE_MINIMAL)

    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test' })
    const schemaErrors = validateEntityGraph(result.graph)
    expect(schemaErrors).toHaveLength(0)
  })

  it('builds indexes correctly', () => {
    createTempContent('en', 'a1', SAMPLE_MARKDOWN)
    createTempContent('pt', 'a1', SAMPLE_MULTI_LOCALE_PT)

    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test' })

    expect(Object.keys(result.graph.indexes.byId).length).toBe(result.stats.totalEntities)
    expect(result.graph.indexes.byType.article?.length).toBe(2)
    expect(result.graph.indexes.byLocale.en?.length).toBeGreaterThanOrEqual(1)
    expect(result.graph.indexes.byLocale.pt?.length).toBeGreaterThanOrEqual(1)
  })

  it('handles empty content directory', () => {
    cleanupTemp()
    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test' })
    expect(result.stats.totalArticles).toBe(0)
    expect(result.stats.totalEntities).toBe(0)
    expect(result.graph.nodes).toHaveLength(0)
  })

  it('handles locale-specific builds', () => {
    createTempContent('en', 'a1', SAMPLE_MARKDOWN)
    createTempContent('pt', 'a1', SAMPLE_MULTI_LOCALE_PT)

    const result = buildEntityGraph({ contentDir: '/tmp/entity-graph-test', locales: ['en'] })
    expect(result.stats.totalArticles).toBe(1)
    expect(result.stats.byType.article).toBe(1)
  })
})
