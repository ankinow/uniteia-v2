#!/usr/bin/env node
/**
 * Bundle Analyzer — Qwik SSG Dist Audit
 * PLANO-080-R8: Chunk sizes, tree-shaking hints, budget enforcement
 *
 * Usage:
 *   node scripts/bundle-analyzer.js
 *   node scripts/bundle-analyzer.js --budget=500
 */
const fs = require('fs')
const path = require('path')

const DIST = path.join(__dirname, '..', 'dist')
const BUDGET_KB = parseInt(process.argv.find(a => a.startsWith('--budget='))?.split('=')[1] || '500', 10)

function walk(dir) {
  const entries = []
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) entries.push(...walk(p))
    else if (f.name.endsWith('.js') || f.name.endsWith('.css')) entries.push(p)
  }
  return entries
}

const files = fs.existsSync(DIST) ? walk(DIST) : []
let total = 0
let flagged = 0

console.log(`╔═══════════════════════════════════════════════════════════╗`)
console.log(`║  BUNDLE ANALYSIS — Qwik SSG Dist                         ║`)
console.log(`║  Budget: ${BUDGET_KB}KB per chunk                              ║`)
console.log(`╚═══════════════════════════════════════════════════════════╝`)

for (const f of files.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)) {
  const size = fs.statSync(f).size
  const sizeKb = (size / 1024).toFixed(1)
  total += size
  const rel = path.relative(DIST, f)
  const over = size / 1024 > BUDGET_KB
  if (over) flagged++
  const icon = over ? '⚠️' : '✅'
  console.log(`${icon} ${rel.padEnd(50)} ${sizeKb.padStart(8)}KB`)
}

console.log(`
Total JS+CSS: ${(total / 1024).toFixed(1)}KB`)
console.log(`Chunks over ${BUDGET_KB}KB: ${flagged}`)
if (flagged > 0) {
  console.log(`\n⚠️  Consider dynamic import() or manualChunks for flagged entries.`)
  process.exit(1)
}
console.log('\n✅ All chunks within budget.')
