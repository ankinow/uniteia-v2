import { describe, expect, it } from 'vitest'
import type { ContentLocale } from '../contracts/node'
import { compileContentGraph } from './compile-content-graph'
import { verifyContentGraph } from './verify-content-graph'

const CLEAN_REGISTRY: Record<string, string> = {
  './content/ai-agents/en/llm-aggregators-compared.md': `---
title: "LLM Aggregators Compared"
quality_score: 96
verdict: "trusted"
subjects: ["llm", "aggregators"]
---
Content.
`,
  './content/ai-agents/pt/agregadores-llm.md': `---
title: "Agregadores de LLM"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm", "agregadores"]
---
Conteúdo.
`,
}

const TEST_LOCALES: ContentLocale[] = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']

describe('verifyContentGraph', () => {
  it('passes for a clean graph', () => {
    const graph = compileContentGraph({
      registry: CLEAN_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const report = verifyContentGraph(graph)
    expect(report.ok).toBe(true)
    expect(report.errors).toHaveLength(0)
  })

  it('detects duplicate routes as errors', () => {
    const graph = compileContentGraph({
      registry: CLEAN_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const enNode = graph.nodes.get('en-llm-aggregators-compared')
    if (enNode) {
      enNode.routes.canonical = '/en/signals/ai-agents/llm-aggregators-compared'
    }
    const ptNode = graph.nodes.get('pt-llm-aggregators-compared')
    if (ptNode) {
      ptNode.routes.canonical = '/en/signals/ai-agents/llm-aggregators-compared'
    }

    const report = verifyContentGraph(graph)
    const dupes = report.errors.filter(e => e.code === 'duplicate-route')
    expect(dupes.length).toBeGreaterThan(0)
  })

  it('detects broken related refs as warnings', () => {
    const registry: Record<string, string> = {
      ...CLEAN_REGISTRY,
      './content/ai-agents/en/some-article.md': `---
title: "Some Article"
quality_score: 80
verdict: "caution"
subjects: ["ai"]
---
Content.
`,
    }
    const graph = compileContentGraph({
      registry,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })

    const someNode = graph.nodes.get('en-some-article')
    if (someNode) {
      someNode.related = ['en-nonexistent-id']
    }

    const report = verifyContentGraph(graph)
    const brokenRefs = report.warnings.filter(e => e.code === 'broken-related-ref')
    expect(brokenRefs.length).toBeGreaterThan(0)
  })

  it('detects sitemap-incoherent (public + noindex) as errors', () => {
    const graph = compileContentGraph({
      registry: CLEAN_REGISTRY,
      locales: TEST_LOCALES,
      defaultLocale: 'en',
    })
    const enNode = graph.nodes.get('en-llm-aggregators-compared')
    if (enNode) {
      enNode.seo.noindex = true
    }

    const report = verifyContentGraph(graph)
    const incoherent = report.errors.filter(e => e.code === 'sitemap-incoherent')
    expect(incoherent.length).toBeGreaterThan(0)
  })
})
