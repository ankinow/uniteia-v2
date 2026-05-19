#!/usr/bin/env bun
/**
 * Edge Chaos Test — CLI entry point
 *
 * Runs the Playwright chaos test suite headlessly and writes a structured
 * markdown report to artifacts/edge-chaos/chaos-report.md.
 *
 * Usage:
 *   bun run scripts/edge-chaos-test.ts
 *
 * Prerequisites:
 *   - `bun run build` has been run (dist/ exists with service-worker.js)
 *   - The preview server (wrangler pages dev) is running on port 8788
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PROJECT_ROOT = join(import.meta.dirname, '..')

const CHAOS_SPEC = 'tests/e2e/s02-edge-chaos.spec.ts'
const REPORT_DIR = join(PROJECT_ROOT, 'artifacts', 'edge-chaos')
const REPORT_PATH = join(REPORT_DIR, 'chaos-report.md')
const PREVIEW_PORT = Number.parseInt(process.env.PREVIEW_PORT ?? '8788', 10)
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`

// ── Helpers ─────────────────────────────────────────────────────────────

function checkPrerequisites(): void {
  const distDir = join(PROJECT_ROOT, 'dist')
  if (!existsSync(distDir)) {
    console.error('FATAL: dist/ not found. Run `bun run build` first.')
    process.exit(1)
  }

  const swPath = join(distDir, 'service-worker.js')
  if (!existsSync(swPath)) {
    console.error('FATAL: dist/service-worker.js not found. Run `bun run build` first.')
    process.exit(1)
  }
}

function ensureServerRunning(): void {
  try {
    const response = execSync(
      `curl -s -o /dev/null -w "%{http_code}" ${PREVIEW_URL}/service-worker.js`,
      {
        timeout: 5_000,
        encoding: 'utf-8',
      }
    )
    const code = response.trim()
    if (code !== '200' && code !== '308') {
      console.error(`FATAL: Preview server at ${PREVIEW_URL} returned HTTP ${code}.`)
      console.error('Start it with: DOMAIN=http://localhost:8788 bun run preview:cf')
      process.exit(1)
    }
  } catch {
    console.error(`FATAL: Could not reach preview server at ${PREVIEW_URL}.`)
    console.error('Start it with: DOMAIN=http://localhost:8788 bun run preview:cf')
    process.exit(1)
  }
}

function runPlaywrightTests(): { passed: boolean; stdout: string } {
  console.log(`Running Playwright chaos tests against ${PREVIEW_URL}...`)

  try {
    const stdout = execSync(
      `PLAYWRIGHT_BASE_URL=${PREVIEW_URL} npx playwright test ${CHAOS_SPEC} --max-failures=2`,
      {
        cwd: PROJECT_ROOT,
        timeout: 300_000,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    )
    return { passed: true, stdout }
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; status?: number }
    const output = error.stdout ?? error.stderr ?? String(err)
    return { passed: false, stdout: output }
  }
}

function parseResults(
  stdout: string,
  passed: boolean
): {
  total: number
  passed: number
  failed: number
  durationMs: number
  failedReason?: string
} {
  let total = 0
  let passedCount = 0
  let failed = 0
  let durationMs = 0
  let failedReason: string | undefined

  const passMatch = stdout.match(/(\d+)\s+passed/)
  if (passMatch) passedCount = Number.parseInt(passMatch[1] as string, 10)

  const failMatch = stdout.match(/(\d+)\s+failed/)
  if (failMatch) failed = Number.parseInt(failMatch[1] as string, 10)

  total = passedCount + failed

  const durationMatch = stdout.match(/\(([\d.]+)\s*s\)/)
  if (durationMatch) {
    durationMs = Math.round(Number.parseFloat(durationMatch[1] as string) * 1000)
  }

  if (total === 0 && !passed) {
    total = 8
    failed = 8
    failedReason =
      'Playwright execution failed (timeout or crash) — no summary output generated. ' +
      'Likely causes: missing public pages after visibility gate, or execSync timeout too low.'

    const lines = stdout.split('\n')
    const errorHint = lines.find(
      l => l.includes('Error') || l.includes('timeout') || l.match(/^\s*\d+\)\s/)
    )
    if (errorHint) {
      failedReason += ` Hint: ${errorHint.trim()}`
    }
  }

  return { total, passed: passedCount, failed, durationMs, failedReason }
}

function generateReport(results: {
  passed: boolean
  stdout: string
  total: number
  passedCount: number
  failedCount: number
  durationMs: number
  failedReason?: string
}) {
  const { passed, total, passedCount, failedCount, durationMs, stdout, failedReason } = results

  const status = passed ? 'passed' : failedCount === total ? 'failed' : 'partial'
  const errors: string[] = []

  if (!passed) {
    const errorLines = stdout.split('\n').filter(l => l.includes('Error:'))
    for (const line of errorLines.slice(0, 20)) {
      errors.push(line.trim())
    }
  }

  const lines: string[] = [
    '# Chaos Stress Test Report',
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Status | ${status} |`,
    `| Total scenarios | ${total} |`,
    `| Passed | ${passedCount} |`,
    `| Failed | ${failedCount} |`,
    `| Total duration | ${durationMs} ms |`,
    errors.length > 0 ? `| Errors | ${errors.length} |` : '',
    '',
  ]

  if (passed) {
    lines.push('## ✅ All Tests Passed', '')
    lines.push('All 8 chaos scenarios completed successfully.')
    lines.push('')
  } else {
    lines.push('## ❌ Failures', '')
    if (failedReason) {
      lines.push(`**Root cause:** ${failedReason}`, '')
    }
    for (const err of errors) {
      lines.push(`- ${err}`)
    }
    lines.push('')
  }

  lines.push('## Details', '')
  lines.push('```')
  lines.push(stdout.slice(0, 2000))
  if (stdout.length > 2000) {
    lines.push('...(output truncated)')
  }
  lines.push('```', '')

  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────────────────────

function main(): void {
  console.log('=== Edge Chaos Test ===')
  console.log('')

  checkPrerequisites()
  ensureServerRunning()

  const { passed, stdout } = runPlaywrightTests()
  const {
    total,
    passed: passedCount,
    failed: failedCount,
    durationMs,
    failedReason,
  } = parseResults(stdout, passed)

  // Write report
  mkdirSync(REPORT_DIR, { recursive: true })
  const report = generateReport({
    passed,
    stdout,
    total,
    passedCount,
    failedCount,
    durationMs,
    failedReason,
  })
  writeFileSync(REPORT_PATH, report, 'utf-8')
  console.log(`Report written to ${REPORT_PATH}`)

  if (passed) {
    console.log(`\n✅ All ${total} chaos scenarios passed (${durationMs} ms).`)
    process.exit(0)
  } else {
    console.log(`\n❌ ${failedCount}/${total} chaos scenarios failed (${durationMs} ms).`)
    process.exit(1)
  }
}

main()
