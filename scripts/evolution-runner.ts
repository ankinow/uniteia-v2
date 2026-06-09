/**
 * evolution-runner.ts — CEM 100x Evolutionary Loop Engine
 *
 * Core mutation→generate→measure→decide loop.
 * Runs N iterations of content pipeline evolution with CEM scoring.
 *
 * Usage: bun run scripts/evolution-runner.ts [--iterations N] [--dry-run]
 */

import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import type { CEMSnapshot } from './cem-formula'
import { CEM_ITERATIONS, CEM_TARGET, computeCEM } from './cem-formula'
import type { Manifest } from './manifest-schema'
import { renderDashboard } from './metrics-dashboard'
import { recordSnapshot } from './metrics-tracker'
import { randomMutation } from './mutation-strategies'

export interface EvolutionOptions {
  iterations: number
  targetCEM: number
  dryRun?: boolean
}
export interface EvolutionResult {
  iterations: number
  accepted: number
  rejected: number
  finalCEM: number
  history: CEMSnapshot[]
}

const MANIFEST_PATH = path.resolve(process.cwd(), 'content-manifest.yaml')
const MAX_CONSECUTIVE_REJECTIONS = 3

function sh(cmd: string): { stdout: string; ok: boolean } {
  try {
    const out = execSync(cmd, { encoding: 'utf-8', timeout: 120_000, cwd: process.cwd() })
    return { stdout: out.trim(), ok: true }
  } catch {
    return { stdout: '', ok: false }
  }
}

function readManifest(): Manifest {
  return yaml.load(fs.readFileSync(MANIFEST_PATH, 'utf-8')) as Manifest
}

function writeManifest(m: Manifest): void {
  fs.writeFileSync(MANIFEST_PATH, yaml.dump(m, { lineWidth: -1, noRefs: true }))
}

function backupManifest(i: number): string {
  const bak = `${MANIFEST_PATH}.bak.${i}`
  fs.copyFileSync(MANIFEST_PATH, bak)
  return bak
}

function restoreManifest(bak: string): void {
  if (fs.existsSync(bak)) fs.copyFileSync(bak, MANIFEST_PATH)
}

function countLocChanged(): number {
  const m = sh('git diff --stat 2>/dev/null').stdout.match(/(\d+)\s+insertion/)
  return m ? Number.parseInt(m[1], 10) : 0
}

function makeSnapshot(
  iteration: number,
  mutations: string[],
  phasesFailed: number,
  rollback: boolean
): CEMSnapshot {
  return {
    iteration,
    timestamp: new Date().toISOString(),
    deployGatesPassed: 0,
    deployGatesTotal: 8,
    testPassCount: 0,
    testTotalCount: 0,
    collageCount: 0,
    contentGraphNodes: 0,
    hreflangCount: 8,
    locChanged: countLocChanged(),
    depsCalled: 1,
    phasesFailed,
    cem: 0,
    mutationsApplied: mutations,
    rollback,
  }
}

export async function runEvolution(opts: EvolutionOptions): Promise<EvolutionResult> {
  const { iterations, targetCEM, dryRun } = opts
  let accepted = 0,
    rejected = 0,
    consecutiveRejections = 0
  const history: CEMSnapshot[] = []

  console.log('═'.repeat(64))
  console.log(`CEM 100x Evolution — Mutation→Generate→Measure→Decide`)
  console.log(
    `Iterations: ${iterations}  Target: ${targetCEM.toFixed(2)}  Dry-run: ${dryRun ? 'YES' : 'NO'}`
  )
  console.log('═'.repeat(64))

  for (let i = 1; i <= iterations; i++) {
    console.log(`\n── Iteration ${i}/${iterations} ──`)

    // 1. SNAPSHOT
    const bak = backupManifest(i)

    // 2. MUTATE
    const mutation = randomMutation()
    console.log(`  [MUTATE]  ${mutation.name}: ${mutation.description}`)

    let manifest: Manifest, mutated: Manifest
    try {
      manifest = readManifest()
      mutated = mutation.apply(manifest)
    } catch (err: unknown) {
      console.log(`  [MUTATE]  ❌ ${err instanceof Error ? err.message : String(err)}`)
      history.push(makeSnapshot(i, [mutation.name], 1, true))
      rejected++
      consecutiveRejections++
      continue
    }

    // Safety: never modify slugs or delete articles
    if (mutated.articles.length !== manifest.articles.length) {
      console.log('  [MUTATE]  ⚠️  Safety: article count changed — rejected')
      history.push(makeSnapshot(i, [mutation.name], 1, true))
      rejected++
      consecutiveRejections++
      continue
    }

    if (!dryRun) writeManifest(mutated)

    // 3. GENERATE
    console.log('  [GENERATE] Running content generation...')
    const genResult = sh('bun run scripts/generate-from-manifest.ts 2>&1')
    console.log(`  [GENERATE] ${genResult.ok ? '✅ Complete' : '❌ Build failed!'}`)

    // 4. MEASURE
    const snap = makeSnapshot(i, [mutation.name], genResult.ok ? 0 : 1, false)
    snap.locChanged = countLocChanged()
    const cem = computeCEM(snap)
    snap.cem = cem
    console.log(`  [MEASURE]  CEM = ${cem.toFixed(4)}`)

    // 5. DECIDE
    const prevCEM = history.length > 0 ? history[history.length - 1].cem : 0
    if (!genResult.ok) {
      console.log('  [DECIDE]   ⟲ ROLLBACK — build failed')
      if (!dryRun) restoreManifest(bak)
      snap.rollback = true
      rejected++
      consecutiveRejections++
    } else if (cem >= prevCEM) {
      console.log(`  [DECIDE]   ↑ ACCEPT — ${prevCEM.toFixed(4)} → ${cem.toFixed(4)}`)
      accepted++
      consecutiveRejections = 0
      try {
        fs.unlinkSync(bak)
      } catch {
        /* ok */
      }
    } else {
      console.log(`  [DECIDE]   ↓ REJECT — ${prevCEM.toFixed(4)} → ${cem.toFixed(4)}`)
      if (!dryRun) restoreManifest(bak)
      snap.rollback = true
      rejected++
      consecutiveRejections++
    }

    // 6. RECORD & REPORT
    history.push(snap)
    recordSnapshot(snap)
    console.log(renderDashboard(history))

    if (consecutiveRejections >= MAX_CONSECUTIVE_REJECTIONS) {
      console.log(`\n⚠️  ${MAX_CONSECUTIVE_REJECTIONS} consecutive rejections — pausing.`)
      break
    }
    if (cem >= targetCEM) {
      console.log(`\n🎯 Target CEM ${targetCEM.toFixed(2)} reached at iteration ${i}!`)
      break
    }
  }

  const finalCEM = history.length > 0 ? history[history.length - 1].cem : 0
  return { iterations: history.length, accepted, rejected, finalCEM, history }
}

// ── CLI ──

function parseArgs(): EvolutionOptions {
  const a = process.argv.slice(2)
  const o: EvolutionOptions = { iterations: CEM_ITERATIONS, targetCEM: CEM_TARGET, dryRun: false }
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--iterations' && a[i + 1]) {
      o.iterations = Number.parseInt(a[i + 1], 10) || CEM_ITERATIONS
      i++
    } else if (a[i] === '--target-cem' && a[i + 1]) {
      o.targetCEM = Number.parseFloat(a[i + 1]) || CEM_TARGET
      i++
    } else if (a[i] === '--dry-run') o.dryRun = true
  }
  return o
}

const isMain =
  process.argv[1]?.endsWith('evolution-runner.ts') || process.argv[1]?.endsWith('evolution-runner')
if (isMain) {
  runEvolution(parseArgs())
    .then(r => {
      console.log(
        `\n✅ Complete: ${r.accepted} accepted, ${r.rejected} rejected — Final CEM: ${r.finalCEM.toFixed(4)}`
      )
      process.exit(0)
    })
    .catch(err => {
      console.error('Fatal:', err)
      process.exit(1)
    })
}
