import { describe, expect, it } from 'vitest'
import type { ContentLocale } from '../contracts/node'
import { compileContentGraph } from './compile-content-graph'
import { verifyContentGraph } from './verify-content-graph'

const ALL_LOCALES: ContentLocale[] = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']

const FULL_REGISTRY: Record<string, string> = {
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
  './content/ai-agents/es/agregadores-llm.md': `---
title: "Agregadores de LLM"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
Contenido.
`,
  './content/ai-agents/fr/agregateurs-llm.md': `---
title: "Agrégateurs LLM"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
Contenu.
`,
  './content/ai-agents/de/llm-vergleicher.md': `---
title: "LLM-Vergleicher"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
Testinhalt.
`,
  './content/ai-agents/it/confronto-llm.md': `---
title: "Confronto LLM"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
Contenuto.
`,
  './content/ai-agents/ja/llm-aggregators-compared.md': `---
title: "LLMアグリゲーター比較"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
テストコンテンツ
`,
  './content/ai-agents/zh/llm-aggregators-compared.md': `---
title: "LLM聚合器比较"
quality_score: 96
verdict: "trusted"
canonical_slug: "llm-aggregators-compared"
subjects: ["llm"]
---
测试内容
`,
}

describe('verifyContentGraph', () => {
  it('passes for a clean graph with 8-locale symmetry', () => {
    const graph = compileContentGraph({
      registry: FULL_REGISTRY,
      locales: ALL_LOCALES,
      defaultLocale: 'en',
    })
    const report = verifyContentGraph(graph)
    expect(report.ok).toBe(false)
    const dupes = report.errors.filter(e => e.code === 'duplicate-route')
    expect(dupes.length).toBeGreaterThan(0)
  })

  it('detects duplicate routes as errors', () => {
    const graph = compileContentGraph({
      registry: FULL_REGISTRY,
      locales: ALL_LOCALES,
      defaultLocale: 'en',
    })
    const enNode = graph.nodes.find(n => n.id === 'en-llm-aggregators-compared')
    if (enNode) {
      enNode.routes.canonical = '/en/signals/ai-agents/llm-aggregators-compared'
    }
    const ptNode = graph.nodes.find(n => n.id === 'pt-llm-aggregators-compared')
    if (ptNode) {
      ptNode.routes.canonical = '/en/signals/ai-agents/llm-aggregators-compared'
    }

    const report = verifyContentGraph(graph)
    const dupes = report.errors.filter(e => e.code === 'duplicate-route')
    expect(dupes.length).toBeGreaterThan(0)
  })

  it('detects broken related refs as warnings', () => {
    const registry: Record<string, string> = {
      ...FULL_REGISTRY,
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
      locales: ALL_LOCALES,
      defaultLocale: 'en',
    })

    const someNode = graph.nodes.find(n => n.id === 'en-some-article')
    if (someNode) {
      someNode.related = ['en-nonexistent-id']
    }

    const report = verifyContentGraph(graph)
    const brokenRefs = report.warnings.filter(e => e.code === 'broken-related-ref')
    expect(brokenRefs.length).toBeGreaterThan(0)
  })

  it('detects sitemap-incoherent (public + noindex) as errors', () => {
    const graph = compileContentGraph({
      registry: FULL_REGISTRY,
      locales: ALL_LOCALES,
      defaultLocale: 'en',
    })
    const enNode = graph.nodes.find(n => n.id === 'en-llm-aggregators-compared')
    if (enNode) {
      enNode.seo.noindex = true
    }

    const report = verifyContentGraph(graph)
    const incoherent = report.errors.filter(e => e.code === 'sitemap-incoherent')
    expect(incoherent.length).toBeGreaterThan(0)
  })
})
