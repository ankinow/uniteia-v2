import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, onTestFailed } from 'vitest'
import type { GraphEdge, GraphEdgeKind } from './content-graph/contracts/edge'
import type { ContentLocale, ContentNode } from './content-graph/contracts/node'

// ── Linkgraph analysis function imports ─────────────────────────────────

import {
  buildEdgeDistribution,
  computeDegreeCentrality,
  computeNicheConnectivity,
  computeReciprocity,
} from '../scripts/generate-linkgraph-report'

// ── SEO verification function imports ───────────────────────────────────

import {
  buildPriorityHistogram,
  checkCanonicalCoherence,
  checkHreflangReciprocity,
  checkNoindexAlignment,
  checkSitemapCoherence,
} from '../scripts/generate-seo-verification'

// ── Fixture helpers ─────────────────────────────────────────────────────

function makeEdge(kind: GraphEdgeKind, from: string, to: string): GraphEdge {
  return { kind, from, to }
}

function makeNode(overrides: Partial<ContentNode> & { id: string }): ContentNode {
  return {
    locale: 'en' as ContentLocale,
    canonicalLocale: 'en' as ContentLocale,
    slug: overrides.id,
    canonicalSlug: overrides.id,
    title: overrides.id,
    summary: '',
    niche: ['default'],
    tags: [],
    entities: [],
    qualityScore: 0.5,
    trustScore: 0.5,
    visibility: 'published',
    lifecycle: 'verified',
    verdict: 'safe',
    routes: { canonical: `/en/${overrides.id}/`, aliases: [] },
    alternates: {},
    related: [],
    seo: { noindex: false, priority: 50 },
    timestamps: { createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    metrics: { edgeRank: 0, semanticDensity: 0, freshnessScore: 0, graphScore: 0 },
    ...overrides,
  }
}

// ── buildEdgeDistribution ───────────────────────────────────────────────

describe('buildEdgeDistribution', () => {
  it('returns empty array for empty edge list', () => {
    expect(buildEdgeDistribution([])).toEqual([])
  })

  it('counts edges per kind sorted descending', () => {
    const edges: GraphEdge[] = [
      makeEdge('translated-as', 'a', 'b'),
      makeEdge('translated-as', 'b', 'c'),
      makeEdge('belongs-to-niche', 'c', 'd'),
      makeEdge('related-to', 'd', 'e'),
    ]
    const result = buildEdgeDistribution(edges)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ kind: 'translated-as', count: 2 })
    expect(result[1]).toEqual({ kind: 'belongs-to-niche', count: 1 })
    expect(result[2]).toEqual({ kind: 'related-to', count: 1 })
  })

  it('handles many edge kinds correctly', () => {
    const kinds: GraphEdgeKind[] = ['alias-route', 'canonical-route', 'tagged-with']
    const edges = kinds.flatMap(k => [makeEdge(k, 'a', 'b'), makeEdge(k, 'b', 'c')])
    const result = buildEdgeDistribution(edges)
    expect(result).toHaveLength(3)
    for (const entry of result) {
      expect(entry.count).toBe(2)
    }
  })
})

// ── computeReciprocity ──────────────────────────────────────────────────

describe('computeReciprocity', () => {
  it('returns empty array for empty edge list', () => {
    expect(computeReciprocity([])).toEqual([])
  })

  it('reports 100% reciprocity for symmetric edges', () => {
    const edges: GraphEdge[] = [
      makeEdge('translated-as', 'a', 'b'),
      makeEdge('translated-as', 'b', 'a'),
      makeEdge('translated-as', 'c', 'd'),
      makeEdge('translated-as', 'd', 'c'),
    ]
    const result = computeReciprocity(edges)
    const translated = result.find(r => r.kind === 'translated-as')
    expect(translated).toBeDefined()
    expect(translated?.total).toBe(4)
    expect(translated?.reciprocalCount).toBe(4)
    expect(translated?.reciprocalPct).toBe(100)
  })

  it('reports 0% reciprocity for one-way edges', () => {
    const edges: GraphEdge[] = [
      makeEdge('translated-as', 'a', 'b'),
      makeEdge('translated-as', 'c', 'd'),
    ]
    const result = computeReciprocity(edges)
    const translated = result.find(r => r.kind === 'translated-as')
    expect(translated).toBeDefined()
    expect(translated?.total).toBe(2)
    expect(translated?.reciprocalCount).toBe(0)
    expect(translated?.reciprocalPct).toBe(0)
  })

  it('flags belongs-to-niche and related-to as expected asymmetric', () => {
    const edges: GraphEdge[] = [
      makeEdge('belongs-to-niche', 'a', 'niche-x'),
      makeEdge('related-to', 'b', 'c'),
    ]
    const result = computeReciprocity(edges)
    const niche = result.find(r => r.kind === 'belongs-to-niche')
    const related = result.find(r => r.kind === 'related-to')
    expect(niche?.expectedAsymmetric).toBe(true)
    expect(related?.expectedAsymmetric).toBe(true)
  })

  it('does not flag translated-as as expected asymmetric', () => {
    const edges: GraphEdge[] = [makeEdge('translated-as', 'a', 'b')]
    const result = computeReciprocity(edges)
    expect(result[0]?.expectedAsymmetric).toBe(false)
  })
})

// ── computeDegreeCentrality ─────────────────────────────────────────────

describe('computeDegreeCentrality', () => {
  const nodes: ContentNode[] = [makeNode({ id: 'a' }), makeNode({ id: 'b' }), makeNode({ id: 'c' })]

  it('returns empty array when there are no edges', () => {
    expect(computeDegreeCentrality([], nodes)).toEqual([])
  })

  it('computes correct inbound and outbound counts', () => {
    const edges: GraphEdge[] = [
      makeEdge('translated-as', 'a', 'b'),
      makeEdge('translated-as', 'b', 'c'),
      makeEdge('translated-as', 'a', 'c'),
    ]
    const result = computeDegreeCentrality(edges, nodes)
    const a = result.find(r => r.nodeId === 'a')
    const b = result.find(r => r.nodeId === 'b')
    const c = result.find(r => r.nodeId === 'c')

    expect(a).toBeDefined()
    expect(a?.outbound).toBe(2)
    expect(a?.inbound).toBe(0)
    expect(a?.total).toBe(2)

    expect(b?.outbound).toBe(1)
    expect(b?.inbound).toBe(1)
    expect(b?.total).toBe(2)

    expect(c?.outbound).toBe(0)
    expect(c?.inbound).toBe(2)
    expect(c?.total).toBe(2)
  })

  it('returns entries sorted by total degree descending', () => {
    const edges: GraphEdge[] = [
      makeEdge('translated-as', 'a', 'b'),
      makeEdge('translated-as', 'a', 'c'),
      makeEdge('translated-as', 'b', 'c'),
      makeEdge('translated-as', 'b', 'a'),
    ]
    const result = computeDegreeCentrality(edges, nodes)
    for (let i = 1; i < result.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: known safe, within loop bounds
      expect(result[i]!.total).toBeLessThanOrEqual(result[i - 1]!.total)
    }
  })
})

// ── computeNicheConnectivity ────────────────────────────────────────────

describe('computeNicheConnectivity', () => {
  it('returns empty array for no nodes', () => {
    expect(computeNicheConnectivity([], [])).toEqual([])
  })

  it('counts internal edges within a niche', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', niche: ['tech'] }),
      makeNode({ id: 'b', niche: ['tech'] }),
      makeNode({ id: 'c', niche: ['tech'] }),
    ]
    const edges: GraphEdge[] = [makeEdge('related-to', 'a', 'b'), makeEdge('related-to', 'b', 'c')]
    const result = computeNicheConnectivity(edges, nodes)
    const tech = result.find(r => r.niche === 'tech')
    expect(tech).toBeDefined()
    expect(tech?.nodeCount).toBe(3)
    expect(tech?.internalEdgeCount).toBe(2)
  })

  it('tracks cross-niche connections', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', niche: ['tech'] }),
      makeNode({ id: 'b', niche: ['design'] }),
    ]
    const edges: GraphEdge[] = [makeEdge('related-to', 'a', 'b')]
    const result = computeNicheConnectivity(edges, nodes)
    const tech = result.find(r => r.niche === 'tech')
    const design = result.find(r => r.niche === 'design')

    expect(tech?.connectedNiches).toContain('design')
    expect(design?.connectedNiches).toContain('tech')
  })

  it('handles nodes belonging to multiple niches', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', niche: ['tech', 'design'] }),
      makeNode({ id: 'b', niche: ['tech'] }),
    ]
    const edges: GraphEdge[] = [makeEdge('related-to', 'a', 'b')]
    const result = computeNicheConnectivity(edges, nodes)
    const tech = result.find(r => r.niche === 'tech')
    const design = result.find(r => r.niche === 'design')

    expect(tech).toBeDefined()
    expect(tech?.nodeCount).toBe(2) // a and b
    expect(tech?.internalEdgeCount).toBe(1) // shared niche 'tech'

    expect(design).toBeDefined()
    expect(design?.nodeCount).toBe(1) // only a
  })
})

// ── checkHreflangReciprocity ────────────────────────────────────────────

describe('checkHreflangReciprocity', () => {
  const routeIndex: Record<string, string> = {
    '/en/hello/': 'hello-en',
    '/pt/hello/': 'hello-pt',
    '/en/world/': 'world-en',
    '/pt/world/': 'world-pt',
    '/en/alone/': 'alone-en',
  }

  it('returns no issues when there are no alternates', () => {
    const nodes: ContentNode[] = [makeNode({ id: 'hello-en', alternates: {} })]
    expect(checkHreflangReciprocity(nodes, routeIndex)).toEqual([])
  })

  it('returns no issues when reciprocity is perfect', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', locale: 'en' as ContentLocale, alternates: { pt: '/pt/hello/' } }),
      makeNode({ id: 'hello-pt', locale: 'pt' as ContentLocale, alternates: { en: '/en/hello/' } }),
    ]
    expect(checkHreflangReciprocity(nodes, routeIndex)).toEqual([])
  })

  it('flags missing reciprocal alternate', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', alternates: { pt: '/pt/hello/' } }),
      makeNode({ id: 'hello-pt', alternates: {} }), // missing reciprocal
    ]
    const issues = checkHreflangReciprocity(nodes, routeIndex)
    const helloPt = issues.find(i => i.nodeId === 'hello-pt')
    expect(helloPt).toBeUndefined() // hello-pt has no alternates, so no issue
    // hello-en should have an issue about hello-pt missing reciprocal
    // Actually let me think about this again...
    // hello-en points to /pt/hello/ -> resolves to hello-pt
    // Then we check hello-pt alternates[en] -> doesn't exist -> reciprocalMissing: true
    // So the issue is about hello-en's target (hello-pt) missing a reciprocal
    // Wait, looking at the code:
    // const targetNodeId = routeToNodeId[targetUrl] => hello-pt
    // const reciprocalUrl = targetNode.alternates[node.locale] => alternates['en'] => undefined
    // So issues.push with nodeId = node.id = hello-en and targetNodeId = hello-pt, reciprocalMissing = true
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('hello-en')
    expect(issues[0]?.reciprocalMissing).toBe(true)
    expect(issues[0]?.targetNodeId).toBe('hello-pt')
  })

  it('flags reciprocal pointing to wrong node', () => {
    // hello-en points to /pt/hello/ (hello-pt), but hello-pt points back to /en/world/ (world-en)
    // world-en has its own reciprocal to hello-pt so that only the misdirection is flagged
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', locale: 'en' as ContentLocale, alternates: { pt: '/pt/hello/' } }),
      makeNode({ id: 'hello-pt', locale: 'pt' as ContentLocale, alternates: { en: '/en/world/' } }),
      makeNode({ id: 'world-en', locale: 'en' as ContentLocale, alternates: { pt: '/pt/hello/' } }),
    ]
    const issues = checkHreflangReciprocity(nodes, routeIndex)
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('hello-en')
    expect(issues[0]?.reciprocalMissing).toBe(false)
    expect(issues[0]?.reciprocalPointsWrong).toBe(true)
  })
})

// ── checkSitemapCoherence ───────────────────────────────────────────────

describe('checkSitemapCoherence', () => {
  it('returns no issues when all sitemap entries are published and all public nodes are listed', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', visibility: 'published' }),
      makeNode({ id: 'b', visibility: 'published' }),
    ]
    const issues = checkSitemapCoherence(nodes, ['a', 'b'], ['a', 'b'])
    expect(issues).toEqual([])
  })

  it('flags sitemap-listed nodes that are not published', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', visibility: 'draft' }),
      makeNode({ id: 'b', visibility: 'published' }),
    ]
    const issues = checkSitemapCoherence(nodes, ['a', 'b'], ['b'])
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('a')
    expect(issues[0]?.problem).toBe('sitemap-listed-not-published')
  })

  it('flags published nodes not in sitemapEligible', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', visibility: 'published' }),
      makeNode({ id: 'b', visibility: 'published' }),
      makeNode({ id: 'c', visibility: 'draft' }),
    ]
    const issues = checkSitemapCoherence(nodes, ['a'], ['a', 'b'])
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('b')
    expect(issues[0]?.problem).toBe('published-not-sitemap-listed')
  })
})

// ── checkNoindexAlignment ───────────────────────────────────────────────

describe('checkNoindexAlignment', () => {
  it('returns no issues when published nodes do not have noindex', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', visibility: 'published', seo: { noindex: false, priority: 50 } }),
    ]
    expect(checkNoindexAlignment(nodes)).toEqual([])
  })

  it('flags published nodes with noindex (non-generated lifecycle)', () => {
    const nodes: ContentNode[] = [
      makeNode({
        id: 'a',
        visibility: 'published',
        lifecycle: 'verified',
        seo: { noindex: true, priority: 50 },
      }),
    ]
    const issues = checkNoindexAlignment(nodes)
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('a')
    expect(issues[0]?.problem).toBe('published-with-noindex')
  })

  it('does not flag published nodes with noindex when lifecycle is generated or deprecated', () => {
    const nodes: ContentNode[] = [
      makeNode({
        id: 'a',
        visibility: 'published',
        lifecycle: 'generated',
        seo: { noindex: true, priority: 50 },
      }),
      makeNode({
        id: 'b',
        visibility: 'published',
        lifecycle: 'deprecated',
        seo: { noindex: true, priority: 50 },
      }),
    ]
    expect(checkNoindexAlignment(nodes)).toEqual([])
  })

  it('does not flag unpublished nodes with noindex', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'a', visibility: 'draft', seo: { noindex: true, priority: 50 } }),
    ]
    expect(checkNoindexAlignment(nodes)).toEqual([])
  })
})

// ── checkCanonicalCoherence ─────────────────────────────────────────────

describe('checkCanonicalCoherence', () => {
  const routeIndex: Record<string, string> = {
    '/en/hello/': 'hello-en',
    '/en/world/': 'world-en',
  }

  it('returns no issues when all canonicals resolve to self', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', routes: { canonical: '/en/hello/', aliases: [] } }),
      makeNode({ id: 'world-en', routes: { canonical: '/en/world/', aliases: [] } }),
    ]
    expect(checkCanonicalCoherence(nodes, routeIndex)).toEqual([])
  })

  it('flags canonical URLs that do not resolve', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', routes: { canonical: '/en/nonexistent/', aliases: [] } }),
    ]
    const issues = checkCanonicalCoherence(nodes, routeIndex)
    expect(issues).toHaveLength(1)
    expect(issues[0]?.problem).toBe('does-not-resolve')
    expect(issues[0]?.canonicalUrl).toBe('/en/nonexistent/')
  })

  it('flags canonical URLs that resolve to a different node', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'hello-en', routes: { canonical: '/en/world/', aliases: [] } }),
      makeNode({ id: 'world-en', routes: { canonical: '/en/world/', aliases: [] } }),
    ]
    const issues = checkCanonicalCoherence(nodes, routeIndex)
    // hello-en's canonical /en/world/ resolves to world-en, not hello-en
    expect(issues).toHaveLength(1)
    expect(issues[0]?.nodeId).toBe('hello-en')
    expect(issues[0]?.problem).toBe('resolves-to-different-node')
    expect(issues[0]?.resolvedNodeId).toBe('world-en')
  })
})

// ── buildPriorityHistogram ──────────────────────────────────────────────

describe('buildPriorityHistogram', () => {
  it('returns empty buckets when there are no nodes', () => {
    const result = buildPriorityHistogram([])
    expect(result).toHaveLength(5)
    for (const b of result) {
      expect(b.count).toBe(0)
      expect(b.nodes).toEqual([])
    }
  })

  it('places priority 0 in the 0–20 bucket', () => {
    const nodes: ContentNode[] = [makeNode({ id: 'a', seo: { noindex: false, priority: 0 } })]
    const result = buildPriorityHistogram(nodes)
    expect(result[0]?.range).toBe('0–20')
    expect(result[0]?.count).toBe(1)
    expect(result[0]?.nodes).toEqual(['a'])
  })

  it('places priority 100 in the 81–100 bucket', () => {
    const nodes: ContentNode[] = [makeNode({ id: 'b', seo: { noindex: false, priority: 100 } })]
    const result = buildPriorityHistogram(nodes)
    expect(result[4]?.range).toBe('81–100')
    expect(result[4]?.count).toBe(1)
    expect(result[4]?.nodes).toEqual(['b'])
  })

  it('distributes nodes across all buckets correctly', () => {
    const nodes: ContentNode[] = [
      makeNode({ id: 'n0', seo: { noindex: false, priority: 5 } }),
      makeNode({ id: 'n1', seo: { noindex: false, priority: 25 } }),
      makeNode({ id: 'n2', seo: { noindex: false, priority: 45 } }),
      makeNode({ id: 'n3', seo: { noindex: false, priority: 65 } }),
      makeNode({ id: 'n4', seo: { noindex: false, priority: 85 } }),
    ]
    const result = buildPriorityHistogram(nodes)
    expect(result[0]?.count).toBe(1) // 0–20: n0
    expect(result[1]?.count).toBe(1) // 21–40: n1
    expect(result[2]?.count).toBe(1) // 41–60: n2
    expect(result[3]?.count).toBe(1) // 61–80: n3
    expect(result[4]?.count).toBe(1) // 81–100: n4
  })
})

// ── End-to-end: spawn scripts ───────────────────────────────────────────

describe('scripts end-to-end (requires content-graph.generated.ts)', () => {
  const artifactsDir = join(process.cwd(), 'artifacts')
  const linkgraphReport = join(artifactsDir, 'linkgraph/linkgraph-report.md')
  const seoReport = join(artifactsDir, 'seo/seo-verification-report.md')

  // Track whether the reports existed pre-existing for cleanup
  let _preExistingLinkgraph = false
  let _preExistingSeo = false

  it('generate:linkgraph-report exits 0 and writes a non-empty report', () => {
    if (existsSync(linkgraphReport)) _preExistingLinkgraph = true
    else {
      // Schedule cleanup only if we created the file
      onTestFailed(() => {}) // no-op; keep artifacts on failure for inspection
    }

    const stdout = execSync('bun run scripts/generate-linkgraph-report.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    })
    expect(stdout).toContain('[linkgraph] Done')
    expect(existsSync(linkgraphReport)).toBe(true)
    const content = readFileSync(linkgraphReport, 'utf-8')
    expect(content.length).toBeGreaterThan(0)
    expect(content).toContain('# Linkgraph Report')
    expect(content).toContain('## Edge Kind Distribution')
    expect(content).toContain('## Edge Reciprocity')
  })

  it('generate:seo-verification exits 0 and writes a non-empty report', () => {
    if (existsSync(seoReport)) _preExistingSeo = true
    else {
      onTestFailed(() => {})
    }

    const stdout = execSync('bun run scripts/generate-seo-verification.ts', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    })
    expect(stdout).toContain('[seo] Done')
    expect(existsSync(seoReport)).toBe(true)
    const content = readFileSync(seoReport, 'utf-8')
    expect(content.length).toBeGreaterThan(0)
    expect(content).toContain('# SEO Verification Report')
    expect(content).toContain('## Hreflang Reciprocity')
    expect(content).toContain('## Priority Distribution')
  })
})
