import { describe, expect, it } from 'vitest'
import type { ContentLocale } from '../contracts/node'
import { isPublicNode } from '../policies/visibility-policy'
import { compileContentGraph } from './compile-content-graph'

const TEST_REGISTRY: Record<string, string> = {
  './content/ai-agents/en/llm-aggregators-compared.md': `---
title: "LLM Aggregators Compared"
quality_score: 96
verdict: "trusted"
subjects: ["llm", "aggregators", "ai-agents"]
---
# LLM Aggregators Compared

Test content about comparing LLM aggregators.
`,
  './content/ai-agents/pt/agregadores-llm.md': `---
title: "Agregadores de LLM"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm", "agregadores"]
---
# Agregadores de LLM

Conteúdo de teste.
`,
  './content/language-models/en/foundation-models.md': `---
title: "Foundation Models"
quality_score: 50
verdict: "caution"
subjects: ["llm", "models"]
---
# Foundation Models

Draft content.
`,
  './content/ai-agents/en/_index.md': `---
title: "AI Agents Index"
---
# AI Agents

Hub index.
`,
}

const TEST_LOCALES: ContentLocale[] = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']

describe('compileContentGraph', () => {
  it('excludes _index files from the graph', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    expect(graph.nodes.length).toBe(3)
    expect(graph.nodes.find(n => n.id === 'en-_index')).toBeUndefined()
    expect(graph.nodes.find(n => n.id === 'pt-_index')).toBeUndefined()
  })

  it('marks low-quality content as draft with noindex', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const draftNode = graph.nodes.find(n => n.id === 'en-foundation-models')
    expect(draftNode).toBeDefined()
    expect(draftNode?.visibility).toBe('draft')
    expect(draftNode?.seo.noindex).toBe(true)
    expect(draftNode?.verdict).toBe('caution')
  })

  it('marks high-quality trusted content as published', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const node = graph.nodes.find(n => n.id === 'en-llm-aggregators-compared')
    expect(node).toBeDefined()
    expect(node?.visibility).toBe('published')
    expect(node?.qualityScore).toBe(96)
    expect(node?.verdict).toBe('safe')
    expect(node?.seo.noindex).toBe(false)
  })

  it('identifies only high-quality published nodes as public', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const publicNodes = graph.nodes.filter(isPublicNode)
    expect(publicNodes.length).toBe(2)
    for (const node of publicNodes) {
      expect(node.qualityScore).toBeGreaterThanOrEqual(95)
      expect(node.visibility).toBe('published')
    }
  })

  it('populates canonical routes', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const node = graph.nodes.find(n => n.id === 'en-llm-aggregators-compared')
    expect(node).toBeDefined()
    expect(node?.routes.canonical).toBe('/en/signals/ai-agents/llm-aggregators-compared')
  })

  it('populates locale alternates for translated content', () => {
    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const enNode = graph.nodes.find(n => n.id === 'en-llm-aggregators-compared')
    expect(enNode).toBeDefined()
    expect(enNode?.alternates.pt).toBe('/pt/signals/ai-agents/llm-aggregators-compared')
    const ptNode = graph.nodes.find(n => n.id === 'pt-llm-aggregators-compared')
    expect(ptNode).toBeDefined()
    expect(ptNode?.slug).toBe('agregadores-llm')
    expect(ptNode?.canonicalSlug).toBe('llm-aggregators-compared')
  })

  it('picks up factory-provided fields after BCP47→v2 locale normalization', () => {
    const factoryNodes: Record<string, unknown> = {
      'pt-llm-aggregators-compared': {
        id: 'pt-llm-aggregators-compared',
        locale: 'pt',
        canonicalLocale: 'pt',
        slug: 'agregadores-llm',
        canonicalSlug: 'llm-aggregators-compared',
        title: 'Agregadores de LLM (factory)',
        summary: 'Factory-provided summary.',
        niche: [],
        tags: [],
        entities: [],
        qualityScore: 85,
        trustScore: 90,
        visibility: 'published',
        lifecycle: 'verified',
        verdict: 'safe',
        routes: { canonical: '', aliases: [] },
        alternates: {},
        related: [],
        seo: { noindex: false, priority: 85 },
        timestamps: {
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-06-01T00:00:00.000Z',
        },
        metrics: { edgeRank: 0, semanticDensity: 0, freshnessScore: 0, graphScore: 0 },
      },
    }

    const graph = compileContentGraph({
      registry: TEST_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
      factoryNodes,
    })

    const ptNode = graph.nodes.find(n => n.id === 'pt-llm-aggregators-compared')
    expect(ptNode).toBeDefined()

    // Factory-provided values should override derived defaults
    expect(ptNode?.qualityScore).toBe(85)
    expect(ptNode?.trustScore).toBe(90)
    expect(ptNode?.visibility).toBe('published')
    expect(ptNode?.lifecycle).toBe('verified')
    expect(ptNode?.seo.noindex).toBe(false)

    // Factory timestamps preserved
    expect(ptNode?.timestamps.createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(ptNode?.timestamps.updatedAt).toBe('2026-06-01T00:00:00.000Z')

    // Routes still populated by compiler (not overridden by factory)
    expect(ptNode?.routes.canonical).toBe('/pt/signals/ai-agents/llm-aggregators-compared')

    // Without normalization, a pt-BR keyed node would be silently missed
    expect(graph.nodes.find(n => n.id === 'pt-BR-llm-aggregators-compared')).toBeUndefined()
  })
})
