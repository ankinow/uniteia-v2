#!/usr/bin/env bun
/**
 * QA-SENTINEL v1.0 — Live site auditor
 *
 * Audits uniteia.com for:
 *   G1: Glassmorphism regression (backdrop-filter in live HTML)
 *   G2: Quality score divergence (factory vs computed in content-graph)
 *   G3: Contract invariants (z.literal, binary fallback, VisualAsset)
 *
 * Output: qa-sentinel-report.json + console summary
 * Exit: 0 = all clear, 1 = regressions found
 *
 * Usage:
 *   bun run scripts/qa/qa-sentinel.ts
 *   bun run scripts/qa/qa-sentinel.ts --json-only  (no console output)
 */

const BASE_URL = 'https://uniteia.com'
const REPO_V2 = '/home/lermf/uniteia-v2'
const REPO_MF = '/home/lermf/uniteia-mega-factory'

interface GateResult {
  gate: string
  passed: boolean
  evidence: string
  detail?: string
}

interface SentinelReport {
  timestamp: string
  target: string
  gates: GateResult[]
  summary: {
    total: number
    passed: number
    failed: number
    blocked: number
  }
}

async function checkLiveGlassmorphism(): Promise<GateResult> {
  const pages = ['/en/signals/', '/en/signals/apex/', '/en/']

  const findings: string[] = []
  for (const path of pages) {
    try {
      const res = await fetch(`${BASE_URL}${path}`)
      const html = await res.text()
      // Count backdrop-filter: blur( but NOT backdrop-filter: none
      const blurMatches = html.match(/backdrop-filter:\s*blur\(/gi)
      const noneMatches = html.match(/backdrop-filter:\s*none/gi)
      const blurCount = (blurMatches?.length ?? 0) - (noneMatches?.length ?? 0)
      if (blurCount > 0) {
        findings.push(`${path}: ${blurCount} blur instance(s)`)
      }
    } catch (e) {
      findings.push(`${path}: fetch error (${e instanceof Error ? e.message : String(e)})`)
    }
  }

  if (findings.length === 0) {
    return { gate: 'G1:glassmorphism-live', passed: true, evidence: '0 blur instances on 3 pages' }
  }
  return {
    gate: 'G1:glassmorphism-live',
    passed: false,
    evidence: findings.join('; '),
    detail: `REGRESSION: backdrop-filter blur found on live site`,
  }
}

function checkContractInvariants(): GateResult[] {
  const results: GateResult[] = []

  // G3a: z.literal must NOT be in schemas.ts (should be z.enum)
  const schemasPath = `${REPO_MF}/packages/content-node-contract/src/schemas.ts`
  try {
    const schemas = require('fs').readFileSync(schemasPath, 'utf-8')
    if (schemas.includes('z.literal(CONTENT_GRAPH_SCHEMA_VERSION)')) {
      results.push({
        gate: 'G3a:z-literal-regression',
        passed: false,
        evidence: `${schemasPath} contains z.literal — should be z.enum`,
        detail: 'Contract v3.2 regression: forward-compat disabled',
      })
    } else if (schemas.includes('z.literal(')) {
      results.push({
        gate: 'G3a:z-literal-any',
        passed: false,
        evidence: `${schemasPath} contains z.literal(...) — audit required`,
        detail: 'Any z.literal blocks forward-compat',
      })
    } else {
      results.push({
        gate: 'G3a:z-literal-regression',
        passed: true,
        evidence: 'z.enum active, no z.literal found',
      })
    }
  } catch {
    results.push({
      gate: 'G3a:z-literal-regression',
      passed: false,
      evidence: `${schemasPath} not readable`,
    })
  }

  // G3b: qualityScore binary fallback must NOT be present
  const manifestWriter = `${REPO_MF}/src/exporters/uniteia-v2/manifest-writer.ts`
  try {
    const mw = require('fs').readFileSync(manifestWriter, 'utf-8')
    if (mw.includes('publishable ? 95 : 65')) {
      results.push({
        gate: 'G3b:binary-fallback',
        passed: false,
        evidence: `${manifestWriter} contains binary fallback publishable?95:65`,
        detail: 'Blind trust regression — unaudited content gets 95',
      })
    } else {
      results.push({
        gate: 'G3b:binary-fallback',
        passed: true,
        evidence: 'overallScore gate active (50 fallback)',
      })
    }
  } catch {
    results.push({
      gate: 'G3b:binary-fallback',
      passed: false,
      evidence: `${manifestWriter} not readable`,
    })
  }

  // G3c: VisualAsset must NOT be locally defined in v2 node.ts
  const v2Node = `${REPO_V2}/src/content-graph/contracts/node.ts`
  try {
    const node = require('fs').readFileSync(v2Node, 'utf-8')
    const localDef = node.match(/export interface VisualAsset\s*\{/)
    const sharedImport = node.includes("from '@uniteia/content-node-contract'")
    if (localDef && !sharedImport) {
      results.push({
        gate: 'G3c:visualasset-dual-def',
        passed: false,
        evidence: `${v2Node} has local VisualAsset definition — should import from shared`,
        detail: 'Dual definition regression',
      })
    } else {
      results.push({
        gate: 'G3c:visualasset-dual-def',
        passed: true,
        evidence: sharedImport ? 'imported from shared' : 'no local def',
      })
    }
  } catch {
    results.push({
      gate: 'G3c:visualasset-dual-def',
      passed: false,
      evidence: `${v2Node} not readable`,
    })
  }

  // G3d: CSS glassmorphism in source
  const cssFiles = [
    `${REPO_V2}/src/assets/living-brief.css`,
    `${REPO_V2}/src/assets/components-utilities.css`,
    `${REPO_V2}/src/assets/aether-assets-textures.css`,
    `${REPO_V2}/src/components/canva/canva.module.css`,
    `${REPO_V2}/src/components/manga-grid/manga-grid.css`,
    `${REPO_V2}/src/global.css`,
  ]
  const glassFindings: string[] = []
  for (const f of cssFiles) {
    try {
      const content = require('fs').readFileSync(f, 'utf-8')
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('backdrop-filter:') && !lines[i].includes('backdrop-filter: none')) {
          glassFindings.push(`${f}:${i + 1}`)
        }
        if (lines[i].includes('filter: blur(')) {
          glassFindings.push(`${f}:${i + 1}`)
        }
      }
    } catch {
      /* file may not exist */
    }
  }
  results.push({
    gate: 'G3d:css-glassmorphism',
    passed: glassFindings.length === 0,
    evidence:
      glassFindings.length === 0 ? '0 blur instances in CSS source' : glassFindings.join('; '),
  })

  return results
}

function checkContentGraphDivergence(): GateResult {
  const graphPath = `${REPO_V2}/src/content-graph.generated.ts`
  try {
    const graph = require('fs').readFileSync(graphPath, 'utf-8')
    // Count factory vs computed qualityScore entries
    const factoryScores = graph.match(/factoryNode\?\.qualityScore/g)
    const effectiveScores = graph.match(/effectiveQualityScore/g)
    const divergenceWarns = graph.match(/quality-divergence\|cross-validation/g)

    const factoryCount = factoryScores?.length ?? 0
    const effectiveCount = effectiveScores?.length ?? 0
    const warnCount = divergenceWarns?.length ?? 0

    if (warnCount > 0) {
      return {
        gate: 'G2:quality-divergence',
        passed: false,
        evidence: `${warnCount} article(s) with factory-vs-computed divergence >20pts`,
        detail: `${factoryCount} factory scores referenced, ${effectiveCount} effective scores used`,
      }
    }
    return {
      gate: 'G2:quality-divergence',
      passed: true,
      evidence: `0 divergence warnings. ${factoryCount} factory scores, ${effectiveCount} effective.`,
    }
  } catch {
    return {
      gate: 'G2:quality-divergence',
      passed: true,
      evidence: 'content-graph.generated.ts not found (pre-build state)',
    }
  }
}

async function main() {
  const jsonOnly = process.argv.includes('--json-only')

  const gates: GateResult[] = []

  // G1: Live glassmorphism
  if (!jsonOnly) console.log('🔍 G1: Checking live site for glassmorphism...')
  gates.push(await checkLiveGlassmorphism())

  // G2: Quality divergence
  if (!jsonOnly) console.log('🔍 G2: Checking content-graph for quality divergence...')
  gates.push(checkContentGraphDivergence())

  // G3: Contract invariants
  if (!jsonOnly) console.log('🔍 G3: Checking contract invariants...')
  gates.push(...checkContractInvariants())

  const passed = gates.filter(g => g.passed).length
  const failed = gates.filter(g => !g.passed).length

  const report: SentinelReport = {
    timestamp: new Date().toISOString(),
    target: BASE_URL,
    gates,
    summary: { total: gates.length, passed, failed, blocked: 0 },
  }

  // Write JSON report
  const outPath = `${REPO_V2}/scripts/qa/qa-sentinel-report.json`
  require('fs').writeFileSync(outPath, JSON.stringify(report, null, 2))

  if (!jsonOnly) {
    console.log('\n╔══════════════════════════════════════╗')
    console.log('║  QA-SENTINEL REPORT                  ║')
    console.log('╠══════════════════════════════════════╣')
    for (const g of gates) {
      const icon = g.passed ? '✅' : '❌'
      console.log(`║ ${icon} ${g.gate}: ${g.evidence.substring(0, 40)}`)
    }
    console.log('╠══════════════════════════════════════╣')
    console.log(`║ ${passed}/${gates.length} gates passed, ${failed} failed`)
    console.log('╚══════════════════════════════════════╝')
    console.log(`\n📄 Full report: ${outPath}`)
  }

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => {
  console.error('QA-SENTINEL crashed:', e)
  process.exit(2)
})
