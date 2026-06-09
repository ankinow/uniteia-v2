// metrics-dashboard.ts — ASCII CEM dashboard with sparklines and trends
// <100 LOC, pure TypeScript, Node stdlib only.

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { CEMSnapshot } from './cem-formula'
import { CEM_TARGET, cemOnTrack } from './cem-formula'

const BLOCKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
const W = 66

function hdr(s: string): string {
  return `║  ${s.slice(0, W - 2).padEnd(W - 2)}║`
}

function spark(history: CEMSnapshot[]): string {
  const vals = history.slice(-20).map(s => s.cem)
  if (vals.length === 0) return ''
  const max = Math.max(...vals) || 1
  const min = Math.min(...vals)
  const r = max - min || 1
  return vals.map(v => BLOCKS[Math.min(7, Math.floor(((v - min) / r) * 7))]).join('')
}

export function renderTrend(history: CEMSnapshot[]): string {
  const sp = spark(history)
  const last10 = history.slice(-10)
  if (last10.length < 2) return `${sp}  insufficient data`
  const allPos = last10.slice(1).every((s, i) => s.cem >= last10[i].cem)
  const label = allPos ? '↑ monotonic' : '↓ non-monotonic'
  return `${sp}  CEM ${label} (last ${last10.length}: ${allPos ? 'all positive' : 'some negative'} Δ)`
}

export function renderIterationDetail(snap: CEMSnapshot): string {
  const time = snap.timestamp.slice(11, 19)
  const mut = snap.mutationsApplied[0] || '—'
  return `#${String(snap.iteration).padStart(2)}  CEM=${snap.cem.toFixed(3)}  onTrack=${cemOnTrack(snap)}  ${time}  ${mut}`
}

export function renderDashboard(history: CEMSnapshot[]): string {
  const lines: string[] = [
    `╔${'═'.repeat(W)}╗`,
    hdr(`CEM 100x DASHBOARD                           Target: ≥${CEM_TARGET}`),
    `╠${'═'.repeat(W)}╣`,
    hdr('Iter   CEM      Δ       OnTrack   Time        Mutations'),
    hdr('────   ──────   ─────   ───────   ────────    ──────────'),
  ]

  const show = history.slice(-12)
  for (let i = 0; i < show.length; i++) {
    const s = show[i]
    const fullIdx = history.length - show.length + i
    const prev = fullIdx > 0 ? history[fullIdx - 1] : null
    const delta = prev ? s.cem - prev.cem : 0
    const dStr = prev ? `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}` : '  ---'
    const ok = cemOnTrack(s) ? '✅' : '❌'
    const time = s.timestamp.slice(11, 19)
    const mut = s.mutationsApplied[0] || '—'
    lines.push(
      hdr(
        `#${String(s.iteration).padEnd(6)}${s.cem.toFixed(3).padEnd(9)}${dStr.padEnd(7)}${ok.padEnd(9)}${time.padEnd(11)}${mut}`
      )
    )
  }

  lines.push(`╠${'═'.repeat(W)}╣`)
  lines.push(hdr(`TREND: ${renderTrend(history)}`))

  if (history.length > 0) {
    const peak = history.reduce((best, s) => (s.cem > best.cem ? s : best), history[0])
    lines.push(hdr(`PEAK:  ${peak.cem.toFixed(3)} at iteration #${peak.iteration}`))
    const latest = history[history.length - 1]
    const gap = Math.max(0, CEM_TARGET - latest.cem)
    lines.push(hdr(`TARGET GAP: ${gap.toFixed(3)} remaining`))
  }

  lines.push(`╚${'═'.repeat(W)}╝`)
  return lines.join('\n')
}

// Run directly: bun run scripts/metrics-dashboard.ts
const isMain =
  process.argv[1]?.endsWith('metrics-dashboard.ts') ||
  process.argv[1]?.endsWith('metrics-dashboard')
if (isMain) {
  const p = path.resolve(process.cwd(), 'artifacts', 'pipeline-metrics.json')
  try {
    const db = JSON.parse(fs.readFileSync(p, 'utf-8'))
    console.log(renderDashboard((db.history || []) as CEMSnapshot[]))
  } catch {
    console.log(renderDashboard([]))
  }
}
