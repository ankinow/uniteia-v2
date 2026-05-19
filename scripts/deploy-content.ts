#!/usr/bin/env bun

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function run(label: string, command: string): void {
  console.log(`\n▶ ${label}`)
  console.log(`  $ ${command}`)
  execSync(command, { stdio: 'inherit', cwd: import.meta.dirname + '/..' })
}

function visibilityGate(): void {
  console.log('\n▶ visibility-gate: checking no draft nodes leaked to public surfaces')

  const graphPath = resolve(import.meta.dirname, '..', 'src', 'content-graph', 'generated', 'content-graph.json')
  if (!existsSync(graphPath)) {
    console.log('  ⚠ content-graph.json not found — was generate:content run?')
    return
  }

  const graph = JSON.parse(readFileSync(graphPath, 'utf-8'))
  const nodes = graph.nodes || []
  const groups = graph.groups || {}

  const publicGroupIds: Set<string> = new Set(
    (groups.publicGroups || [])
      .filter((g: { nodeIds?: string[] }) => g.nodeIds?.length === 8)
      .flatMap((g: { nodeIds: string[] }) => g.nodeIds)
  )

  let leaked = 0
  for (const node of nodes) {
    const isPublic = node.visibility === 'published' && node.qualityScore >= 95
    const inPublicGroup = publicGroupIds.has(node.id)

    if (isPublic && !inPublicGroup) {
      console.log(`  ⚠ [visibility] public node NOT in any public group: ${node.id} (q=${node.qualityScore})`)
      leaked++
    }
    if (!isPublic && inPublicGroup) {
      console.log(`  ❌ [visibility] draft/low-quality node IN public group: ${node.id} (visibility=${node.visibility}, q=${node.qualityScore})`)
      leaked++
    }
  }

  if (leaked === 0) {
    const total = nodes.length
    const publicCount = nodes.filter((n: { visibility: string; qualityScore: number }) => n.visibility === 'published' && n.qualityScore >= 95).length
    console.log(`  ✅ Gate clean: ${publicCount}/${total} nodes public, 0 leaked`)
  } else {
    console.log(`  ❌ Gate failed: ${leaked} leaked nodes`)
    process.exit(1)
  }
}

function sitemapCoherence(): void {
  console.log('\n▶ sitemap-coherence: checking /signals/ paths (no /n/ legacy)')

  const sitemapPath = resolve(import.meta.dirname, '..', 'dist', 'sitemap.xml')
  if (!existsSync(sitemapPath)) {
    console.log('  ⚠ dist/sitemap.xml not found — was build run?')
    return
  }

  const sitemap = readFileSync(sitemapPath, 'utf-8')
  const nPaths = sitemap.match(/\/n\//g)
  const signalsPaths = sitemap.match(/\/signals\//g)

  if (nPaths) {
    console.log(`  ❌ Found ${nPaths.length} legacy /n/ paths in sitemap`)
    process.exit(1)
  }
  if (!signalsPaths || signalsPaths.length === 0) {
    console.log('  ⚠ No /signals/ paths found in sitemap')
  } else {
    console.log(`  ✅ Sitemap clean: ${signalsPaths.length} /signals/ paths, 0 /n/ paths`)
  }
}

function main(): void {
  console.log('='.repeat(60))
  console.log('DEPLOY:CONTENT — generate:content + build + visibility checks + deploy')
  console.log('='.repeat(60))

  run('generate:content (registry → graph → verify → search-index)', 'bun run generate:content')
  run('build (qwik build + postbuild)', 'bun run build')
  visibilityGate()
  sitemapCoherence()
  run('deploy to Cloudflare Pages', 'bunx wrangler pages deploy dist --project-name=uniteia-v2')

  console.log('\n✅ Deploy:CONTENT complete.')
}

main()
