#!/usr/bin/env bun
/**
 * build-entity-graph.ts
 *
 * P0.1: Build-time entity graph generation.
 * Reads content/apex/{locale}/*.md → extracts entities → writes entity-graph.json
 *
 * Usage:
 *   bun run scripts/graph/build-entity-graph.ts
 *   bun run scripts/graph/build-entity-graph.ts --content-dir content/apex --out-dir dist
 *
 * Output:
 *   dist/entity-graph.json — typed entity graph (EntityGraph v1)
 *   dist/entity-graph.stats.json — build statistics
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { buildEntityGraph } from '../../src/graph/entity-graph'
import type { BuildInput } from '../../src/graph/entity-graph'

function getArg(key: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${key}`)
  if (idx !== -1 && process.argv.length > idx + 1) return process.argv[idx + 1]
  return fallback
}

async function main(): Promise<void> {
  const contentDir = resolve(getArg('content-dir', 'content/apex'))
  const outDir = resolve(getArg('out-dir', 'dist'))

  console.log('╔═══════════════════════════════════════════╗')
  console.log('║  Entity Graph Builder — P0.1             ║')
  console.log('╚═══════════════════════════════════════════╝')
  console.log(`  Content: ${contentDir}`)
  console.log(`  Output:  ${outDir}`)
  console.log()

  // Validate content directory
  if (!existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`)
    process.exit(1)
  }

  // Ensure output directory
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  // Build entity graph
  const input: BuildInput = { contentDir }
  const start = performance.now()
  const result = buildEntityGraph(input)
  const elapsed = ((performance.now() - start) / 1000).toFixed(2)

  // Write entity-graph.json
  const graphPath = join(outDir, 'entity-graph.json')
  writeFileSync(graphPath, JSON.stringify(result.graph, null, 2))
  const graphSize = (Buffer.byteLength(JSON.stringify(result.graph)) / 1024).toFixed(1)

  // Write stats
  const statsPath = join(outDir, 'entity-graph.stats.json')
  writeFileSync(statsPath, JSON.stringify(result.stats, null, 2))

  // Report
  console.log('📊 Entity Graph Statistics')
  console.log('─────────────────────────────────────────────')
  console.log(`  Articles:     ${result.stats.totalArticles}`)
  console.log(`  Entities:     ${result.stats.totalEntities}`)
  console.log(`  Edges:        ${result.stats.totalEdges}`)
  console.log()
  console.log('  By type:')
  for (const [type, count] of Object.entries(result.stats.byType)) {
    console.log(`    ${type.padEnd(12)} ${count}`)
  }
  console.log()
  console.log(`  Output:       ${graphPath} (${graphSize} KB)`)
  console.log(`  Time:         ${elapsed}s`)

  if (result.stats.errors.length > 0) {
    console.log()
    console.log(`⚠️  Warnings/Errors: ${result.stats.errors.length}`)
    for (const err of result.stats.errors.slice(0, 5)) {
      console.log(`  ! ${err}`)
    }
  }

  console.log()
  if (result.stats.totalArticles === 0) {
    console.error('❌ No articles found — check content directory')
    process.exit(1)
  }

  console.log('✅ Entity graph built successfully')
}

main().catch(err => {
  console.error('❌ Build failed:', err)
  process.exit(1)
})
