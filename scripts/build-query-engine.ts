#!/usr/bin/env bun
/**
 * build-query-engine.ts — P0.2 Build-time query engine artifacts
 *
 * Pre-computes embeddings for all entities and writes them alongside
 * the entity graph for zero-runtime-cost semantic search.
 *
 * Usage:
 *   bun run scripts/build-query-engine.ts
 *   bun run scripts/build-query-engine.ts --out-dir dist
 *
 * Output (in --out-dir):
 *   entity-graph.json        ← from P0.1 (input)
 *   entity-embeddings.json   ← pre-computed embeddings (new)
 *   entity-embeddings.meta.json  ← metadata (new)
 *
 * Pipeline position: runs after generate:entity-graph
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  LocalEmbeddingProvider,
  NvidiaNimEmbeddingProvider,
  QueryEngine,
  loadEntityGraph,
} from '../src/graph/query-engine'

function getArg(key: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${key}`)
  if (idx !== -1 && process.argv.length > idx + 1) return process.argv[idx + 1]
  return fallback
}

async function main(): Promise<void> {
  const outDir = resolve(getArg('out-dir', 'dist'))
  const graphPath = resolve(outDir, 'entity-graph.json')
  const embPath = resolve(outDir, 'entity-embeddings.json')
  const metaPath = resolve(outDir, 'entity-embeddings.meta.json')

  console.log('╔═══════════════════════════════════════════╗')
  console.log('║ P0.2 Query Engine — Build-time Embeddings ║')
  console.log('╚═══════════════════════════════════════════╝')

  // Phase 1: Load entity graph
  if (!existsSync(graphPath)) {
    console.error(`❌ Entity graph not found at: ${graphPath}`)
    console.error('   Run `bun run generate:entity-graph` first.')
    process.exit(1)
  }

  const graph = loadEntityGraph(graphPath)
  console.log(` Loaded: ${graphPath}`)
  console.log(` Nodes: ${graph.nodes.length}`)
  console.log(` Edges: ${graph.edges.length}`)

  // Phase 2: Choose embedding provider
  const hasNvidiaKey = !!process.env.NVIDIA_API_KEY
  const provider = hasNvidiaKey ? new NvidiaNimEmbeddingProvider() : new LocalEmbeddingProvider()

  console.log(` Provider: ${provider.name} (${provider.dimensions}d)`)

  // Phase 3: Pre-compute embeddings
  const start = performance.now()
  const engine = new QueryEngine(graph, provider)
  const embeddings = await engine.precomputeEmbeddings()

  // Phase 4: Serialize
  const embData: Record<string, number[]> = {}
  for (const [id, vec] of embeddings) {
    embData[id] = vec
  }

  // Ensure output directory
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  // Write embeddings
  writeFileSync(embPath, JSON.stringify(embData))
  const embSize = (Buffer.byteLength(JSON.stringify(embData)) / 1024).toFixed(1)

  // Write metadata
  const meta = {
    version: 'entity-embeddings.v1',
    generatedAt: new Date().toISOString(),
    provider: provider.name,
    dimensions: provider.dimensions,
    totalEntities: Object.keys(embData).length,
    elapsedMs: Math.round((performance.now() - start) * 100) / 100,
    sourceGraph: 'entity-graph.json',
    sourceGraphVersion: graph.version,
    sourceGraphGeneratedAt: graph.generatedAt,
  }
  writeFileSync(metaPath, JSON.stringify(meta, null, 2))

  const elapsed = ((performance.now() - start) / 1000).toFixed(2)

  // Phase 5: Quick sanity — query a known entity
  const enArticle = graph.nodes.find(
    n => n.id === 'en-magica-overview' || n.id === 'en-magica-quickstart'
  )
  if (enArticle) {
    const emb = embeddings.get(enArticle.id)
    if (emb) {
      console.log(
        ` Sample embedding: ${enArticle.id} → [${emb.slice(0, 3).map(v => v.toFixed(4))}...] (${emb.length}d)`
      )
    }
  }

  console.log()
  console.log('📊 Embedding Statistics')
  console.log('─────────────────────────────────────────────')
  console.log(` Entities: ${Object.keys(embData).length}`)
  console.log(` Dimensions: ${provider.dimensions}`)
  console.log(` Output: ${embPath} (${embSize} KB)`)
  console.log(` Meta: ${metaPath}`)
  console.log(` Time: ${elapsed}s`)
  console.log()
  console.log('✅ Embeddings ready. Import with:')
  console.log('   const { loadEntityGraph, QueryEngine } = require("./src/graph/query-engine")')
  console.log('   const graph = loadEntityGraph("dist/entity-graph.json")')
  console.log('   const engine = new QueryEngine(graph)')
  console.log('   const results = await engine.search("your query")')
}

main().catch(err => {
  console.error('❌ Fatal:', err)
  process.exit(1)
})
