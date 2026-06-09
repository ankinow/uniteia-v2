// metrics-tracker.ts — Persistent CEM tracker. Zero npm deps, Node stdlib only. Never throws.

import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { CEMSnapshot } from './cem-formula'
import { cemOnTrack, computeCEM } from './cem-formula'

const METRICS_FILE = path.resolve(process.cwd(), 'artifacts', 'pipeline-metrics.json')

function readDB(): { history: CEMSnapshot[] } {
  try {
    const raw = fs.readFileSync(METRICS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { history: [] }
  }
}

function writeDB(db: { history: CEMSnapshot[] }): void {
  try {
    fs.mkdirSync(path.dirname(METRICS_FILE), { recursive: true })
    fs.writeFileSync(METRICS_FILE, JSON.stringify(db, null, 2))
  } catch {
    /* silent */
  }
}

// ── Public API ──

export function loadHistory(): CEMSnapshot[] {
  return readDB().history
}

export function recordSnapshot(snap: Omit<CEMSnapshot, 'cem'>): CEMSnapshot {
  const full: CEMSnapshot = { ...snap, cem: computeCEM(snap) }
  const db = readDB()
  db.history.push(full)
  writeDB(db)
  return full
}

export function latestCEM(): number {
  const h = loadHistory()
  return h.length > 0 ? h[h.length - 1].cem : 0
}

export function deltaFromPrevious(): number {
  const h = loadHistory()
  if (h.length < 2) return 0
  return h[h.length - 1].cem - h[h.length - 2].cem
}

export function isOnTrack(snap: CEMSnapshot): boolean {
  return cemOnTrack(snap)
}

export function summary(): string {
  const h = loadHistory()
  const recent = h.slice(-10)
  if (recent.length === 0) return 'No snapshots recorded yet.\n'
  let out = 'Iter │ CEM     │ Δ       │ Track │ Timestamp\n'
  out += '─────┼─────────┼─────────┼───────┼──────────────────\n'
  for (let i = 0; i < recent.length; i++) {
    const s = recent[i]
    const prev = i > 0 ? recent[i - 1].cem : Number.NaN
    const d = isNaN(prev) ? '  ---' : (s.cem >= prev ? '+' : '') + (s.cem - prev).toFixed(4)
    out += `${String(s.iteration).padStart(4)} │ ${s.cem.toFixed(4)} │ ${d} │ ${cemOnTrack(s) ? 'YES' : 'NO '}   │ ${s.timestamp.slice(0, 16)}\n`
  }
  return out
}

// ── Data collection (best-effort, never throws) ──

function sh(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 30_000, cwd: process.cwd() }).trim()
  } catch {
    return ''
  }
}

function parseTestCounts(): { testPassCount: number; testTotalCount: number } {
  const out = sh('bun test 2>&1') || sh('bun run test:unit -- --reporter=verbose 2>&1')
  const m = out.match(/Tests\s+(\d+)\s+passed\s*\((\d+)\)/)
  if (m) return { testPassCount: +m[1], testTotalCount: +m[2] }
  const b = out.match(/(\d+)\s+tests?\s+passed/)
  if (b) return { testPassCount: +b[1], testTotalCount: +b[1] }
  return { testPassCount: 0, testTotalCount: 0 }
}

function countCollageJSONs(): number {
  return Number(sh('find content -name "*.json" -path "*/collage/*" 2>/dev/null | wc -l')) || 0
}

function locChanged(): number {
  const out = sh('git diff --stat 2>/dev/null')
  if (!out) return 0
  const last = out.split('\n').pop() || ''
  const m = last.match(/(\d+)\s+insertion/)
  return m ? +m[1] : 0
}

function countDepsCalled(): number {
  const log = sh('cat artifacts/pipeline-run.log 2>/dev/null')
  if (!log) return 0
  const m = log.match(/^(CALL |invoking |→ |curl )/gm)
  return m ? m.length : 0
}

function collectSnapshotData(): Omit<CEMSnapshot, 'cem'> {
  const history = loadHistory()
  const iteration = history.length > 0 ? history[history.length - 1].iteration + 1 : 1
  const tests = parseTestCounts()
  return {
    iteration,
    timestamp: new Date().toISOString(),
    deployGatesPassed: 0,
    deployGatesTotal: 8,
    testPassCount: tests.testPassCount,
    testTotalCount: tests.testTotalCount,
    collageCount: countCollageJSONs(),
    contentGraphNodes: 0,
    hreflangCount: 8,
    locChanged: locChanged(),
    depsCalled: countDepsCalled(),
    phasesFailed: 0,
    mutationsApplied: [],
    rollback: false,
  }
}

// ── Main ──

const isMain =
  process.argv[1]?.endsWith('metrics-tracker.ts') || process.argv[1]?.endsWith('metrics-tracker')
if (isMain) {
  const snap = recordSnapshot(collectSnapshotData())
  console.log(
    `[metrics-tracker] Recorded iteration ${snap.iteration} — CEM = ${snap.cem.toFixed(4)}`
  )
  console.log(summary())
}
