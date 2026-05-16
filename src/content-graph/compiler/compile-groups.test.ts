import { describe, expect, it } from 'vitest'
import type { ContentLocale, ContentNode } from '../contracts/node'
import { compileGroups } from './compile-groups'

function makeNode(overrides: Partial<ContentNode> & { id: string }): ContentNode {
  return {
    id: overrides.id,
    locale: (overrides.locale ?? 'en') as ContentLocale,
    canonicalLocale: overrides.canonicalLocale ?? ('en' as ContentLocale),
    slug: overrides.slug ?? 'test',
    canonicalSlug: overrides.canonicalSlug ?? 'test',
    title: overrides.title ?? 'Test',
    summary: '',
    niche: overrides.niche ?? ['apex'],
    tags: [],
    entities: [],
    qualityScore: overrides.qualityScore ?? 95,
    trustScore: overrides.trustScore ?? 95,
    visibility: overrides.visibility ?? 'published',
    lifecycle: overrides.lifecycle ?? 'published',
    verdict: overrides.verdict ?? 'safe',
    routes: { canonical: '', aliases: [] },
    alternates: {},
    related: [],
    seo: { noindex: false, priority: 95 },
    timestamps: { createdAt: '', updatedAt: '' },
    metrics: overrides.metrics ?? {
      edgeRank: 0,
      semanticDensity: 50,
      freshnessScore: 50,
      graphScore: 50,
    },
  }
}

describe('compileGroups', () => {
  it('groups nodes by canonicalSlug', () => {
    const nodes = new Map<string, ContentNode>()
    nodes.set(
      'en-test',
      makeNode({ id: 'en-test', locale: 'en', canonicalSlug: 'test', slug: 'test' })
    )
    nodes.set(
      'pt-test',
      makeNode({ id: 'pt-test', locale: 'pt', canonicalSlug: 'test', slug: 'test' })
    )
    nodes.set(
      'en-other',
      makeNode({ id: 'en-other', locale: 'en', canonicalSlug: 'other', slug: 'other' })
    )

    const result = compileGroups(nodes)
    expect(result.groups).toHaveLength(2)
    const testGroup = result.groups.find(g => g.canonicalSlug === 'test')
    expect(testGroup).toBeDefined()
    expect(testGroup?.nodes).toHaveLength(2)
  })

  it('marks group fullySymmetric when all 8 locales present with quality >= 95', () => {
    const nodes = new Map<string, ContentNode>()
    const locales: ContentLocale[] = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']
    for (const loc of locales) {
      const id = `${loc}-full`
      nodes.set(id, makeNode({ id, locale: loc, canonicalSlug: 'full' }))
    }

    const result = compileGroups(nodes)
    const group = result.groups.find(g => g.canonicalSlug === 'full')
    expect(group?.isFullySymmetric).toBe(true)
    expect(group?.completionScore).toBe(1)
    expect(group?.missingLocales).toHaveLength(0)
    expect(group?.publishedLocales).toHaveLength(8)
  })

  it('marks group incomplete when locales are missing', () => {
    const nodes = new Map<string, ContentNode>()
    nodes.set('en-partial', makeNode({ id: 'en-partial', locale: 'en', canonicalSlug: 'partial' }))
    nodes.set('pt-partial', makeNode({ id: 'pt-partial', locale: 'pt', canonicalSlug: 'partial' }))

    const result = compileGroups(nodes)
    const group = result.groups.find(g => g.canonicalSlug === 'partial')
    expect(group?.isFullySymmetric).toBe(false)
    expect(group?.missingLocales.length).toBeGreaterThan(0)
    expect(group?.completionScore).toBe(0.25)
  })

  it('handles empty nodes map', () => {
    const result = compileGroups(new Map())
    expect(result.groups).toHaveLength(0)
    expect(result.fullySymmetric).toHaveLength(0)
    expect(result.publicGroups).toHaveLength(0)
  })

  it('correctly computes byCompletion categories', () => {
    const nodes = new Map<string, ContentNode>()

    // Full group (8 locales)
    for (const loc of ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as ContentLocale[]) {
      nodes.set(
        `${loc}-full1`,
        makeNode({ id: `${loc}-full1`, locale: loc, canonicalSlug: 'full1' })
      )
    }

    // Partial group (4 locales = 50%)
    for (const loc of ['en', 'pt', 'es', 'fr'] as ContentLocale[]) {
      nodes.set(`${loc}-half`, makeNode({ id: `${loc}-half`, locale: loc, canonicalSlug: 'half' }))
    }

    // Incomplete group (1 locale = 12.5%)
    nodes.set('en-mini', makeNode({ id: 'en-mini', locale: 'en', canonicalSlug: 'mini' }))

    const result = compileGroups(nodes)
    expect(result.byCompletion.complete).toHaveLength(1)
    expect(result.byCompletion.incomplete).toHaveLength(1)
    expect(result.byCompletion.partial).toHaveLength(1)
  })

  it('only includes published high-quality nodes in publishedLocales', () => {
    const nodes = new Map<string, ContentNode>()
    nodes.set(
      'en-good',
      makeNode({
        id: 'en-good',
        locale: 'en',
        canonicalSlug: 'mixed',
        qualityScore: 95,
        visibility: 'published',
      })
    )
    nodes.set(
      'pt-bad',
      makeNode({
        id: 'pt-bad',
        locale: 'pt',
        canonicalSlug: 'mixed',
        qualityScore: 30,
        visibility: 'draft',
      })
    )

    const result = compileGroups(nodes)
    const group = result.groups.find(g => g.canonicalSlug === 'mixed')
    expect(group?.publishedLocales).toEqual(['en'])
    expect(group?.missingLocales.length).toBeGreaterThan(0)
  })
})
