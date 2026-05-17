#!/usr/bin/env bun
/**
 * Observability Capture — CLI entry point
 *
 * Runs the S02 edge-chaos and S03 hydration-resilience Playwright test suites
 * with full trace capture, collects results and trace metadata, and writes
 * a structured report to artifacts/observability/observability-report.md.
 *
 * Usage:
 *   bun run scripts/observability-capture.ts
 *
 * Prerequisites:
 *   - Preview server running on port 8788 (or set PLAYWRIGHT_BASE_URL)
 *   - bun run build has been run
 */

import { type ExecSyncOptions, execSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const PROJECT_ROOT = join(import.meta.dirname, '..')
const ARTIFACTS_DIR = join(PROJECT_ROOT, 'artifacts', 'observability')
const TRACES_DIR = join(ARTIFACTS_DIR, 'traces')
const REPORT_PATH = join(ARTIFACTS_DIR, 'observability-report.md')
const PREVIEW_URL = `http://localhost:${8788}`

const TEST_SUITES = [
  { name: 'edge-chaos', spec: 'tests/e2e/s02-edge-chaos.spec.ts' },
  { name: 'hydration-resilience', spec: 'tests/e2e/s03-hydration-resilience.spec.ts' },
] as const

// ── Interface ──────────────────────────────────────────────────────────

interface TestSuiteResult {
  name: string
  passed: boolean
  total: number
  passedCount: number
  failedCount: number
  durationMs: number
  stdout: string
  traceDir: string | null
  traceFiles: string[]
}

// ── Helpers ─────────────────────────────────────────────────────────────

function ensureServerRunning(): void {
  try {
    const response = execSync(
      `curl -s -o /dev/null -w "%{http_code}" ${PREVIEW_URL}/service-worker.js`,
      { timeout: 5_000, encoding: 'utf-8' }
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

function runTestSuite(name: string, spec: string): TestSuiteResult {
  console.log(`\nRunning ${name} (${spec})...`)

  // Snapshot current traces before running, so we can collect only new ones
  const beforeTraces = collectAllTraceFiles()

  const env = {
    ...process.env,
    PLAYWRIGHT_BASE_URL: PREVIEW_URL,
  } as Record<string, string>

  const opts: ExecSyncOptions = {
    cwd: PROJECT_ROOT,
    timeout: 180_000,
    encoding: 'utf-8' as const,
    stdio: ['pipe', 'pipe', 'pipe'] as const,
    env,
  }

  try {
    const stdout = execSync(`npx playwright test ${spec} --trace on`, opts)
    return parseResult(name, stdout, true, beforeTraces)
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; status?: number }
    const output = error.stdout ?? error.stderr ?? String(err)
    return parseResult(name, output, false, beforeTraces)
  }
}

function collectAllTraceFiles(): Set<string> {
  const testResultsDir = join(PROJECT_ROOT, 'test-results')
  const files = new Set<string>()
  if (existsSync(testResultsDir)) {
    try {
      const traceList = execSync(`find "${testResultsDir}" -name "trace.zip" -type f 2>/dev/null`, {
        encoding: 'utf-8',
        timeout: 5_000,
      })
      for (const line of traceList.trim().split('\n')) {
        const path = line.trim()
        if (path.length > 0) files.add(path)
      }
    } catch {
      // ignore
    }
  }
  return files
}

function parseResult(
  name: string,
  stdout: string,
  passed: boolean,
  beforeTraces: Set<string>
): TestSuiteResult {
  let total = 0
  let passedCount = 0
  let failedCount = 0
  let durationMs = 0

  const passMatch = stdout.match(/(\d+)\s+passed/)
  if (passMatch) passedCount = Number.parseInt(passMatch[1] as string, 10)

  const failMatch = stdout.match(/(\d+)\s+failed/)
  if (failMatch) failedCount = Number.parseInt(failMatch[1] as string, 10)

  total = passedCount + failedCount

  // Try to find duration
  const lines = stdout.split('\n').filter(l => l.includes('passed'))
  for (const line of lines) {
    const durMatch = line.match(/\(([\d.]+)\s*s\)/)
    if (durMatch) {
      durationMs = Math.round(Number.parseFloat(durMatch[1] as string) * 1000)
      break
    }
  }

  // Collect new traces that appeared during this run and copy to artifacts
  const afterTraces = collectAllTraceFiles()
  const traceFiles: string[] = []
  for (const tf of afterTraces) {
    if (!beforeTraces.has(tf)) {
      // Copy trace to persistent artifacts location
      const traceName = `trace-${name}-${traceFiles.length + 1}.zip`
      const destPath = join(TRACES_DIR, traceName)
      try {
        execSync(`cp "${tf}" "${destPath}"`, { timeout: 5_000 })
        traceFiles.push(destPath)
      } catch {
        traceFiles.push(tf) // fallback to original path
      }
    }
  }

  return {
    name,
    passed: passed && failedCount === 0,
    total,
    passedCount,
    failedCount,
    durationMs,
    stdout,
    traceDir: traceFiles.length > 0 ? join(PROJECT_ROOT, 'test-results') : null,
    traceFiles,
  }
}

function generateReport(results: TestSuiteResult[]): string {
  const totalTests = results.reduce((s, r) => s + r.total, 0)
  const totalPassed = results.reduce((s, r) => s + r.passedCount, 0)
  const totalFailed = results.reduce((s, r) => s + r.failedCount, 0)
  const totalDuration = results.reduce((s, r) => s + r.durationMs, 0)
  const totalTraces = results.reduce((s, r) => s + r.traceFiles.length, 0)
  const allPassed = results.every(r => r.passed)

  const lines: string[] = [
    '# Observability Capture Report',
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Status | ${allPassed ? '✅ PASSED' : '❌ FAILED'} |`,
    `| Test suites | ${results.length} |`,
    `| Total tests | ${totalTests} |`,
    `| Passed | ${totalPassed} |`,
    `| Failed | ${totalFailed} |`,
    `| Total duration | ${totalDuration} ms |`,
    `| Traces captured | ${totalTraces} |`,
    '',
    '## Per-Suite Results',
    '',
    '| Suite | Status | Tests | Passed | Failed | Duration | Traces |',
    '|-------|--------|-------|--------|--------|----------|--------|',
  ]

  for (const r of results) {
    const status = r.passed ? '✅' : '❌'
    lines.push(
      `| ${r.name} | ${status} | ${r.total} | ${r.passedCount} | ${r.failedCount} | ${r.durationMs}ms | ${r.traceFiles.length} |`
    )
  }

  lines.push('', '## Trace Artifacts', '')

  if (totalTraces === 0) {
    lines.push('No traces captured — all tests passed on first attempt.')
    lines.push('')
  } else {
    for (const r of results) {
      if (r.traceFiles.length > 0) {
        lines.push(`### ${r.name}`)
        lines.push('')
        for (const tf of r.traceFiles) {
          const relPath = relative(PROJECT_ROOT, tf)
          const size = statSync(tf).size
          lines.push(`- \`${relPath}\` (${(size / 1024).toFixed(1)} KB)`)
        }
        lines.push('')
      }
    }
  }

  lines.push('## Raw Output', '')
  for (const r of results) {
    lines.push(`### ${r.name}`)
    lines.push('')
    lines.push('```')
    lines.push(r.stdout.slice(0, 1500))
    if (r.stdout.length > 1500) {
      lines.push('...(output truncated)')
    }
    lines.push('```')
    lines.push('')
  }

  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────────────────────

function main(): void {
  console.log('=== Observability Capture ===')
  console.log('')

  // Ensure directories exist
  mkdirSync(TRACES_DIR, { recursive: true })

  ensureServerRunning()

  const results: TestSuiteResult[] = []

  for (const suite of TEST_SUITES) {
    const result = runTestSuite(suite.name, suite.spec)
    results.push(result)

    if (result.passed) {
      console.log(
        `  ✅ ${result.name}: ${result.passedCount}/${result.total} passed (${result.durationMs}ms)`
      )
    } else {
      console.log(
        `  ❌ ${result.name}: ${result.failedCount}/${result.total} failed (${result.durationMs}ms)`
      )
    }
  }

  // Write report
  const report = generateReport(results)
  writeFileSync(REPORT_PATH, report, 'utf-8')
  console.log(`\nReport written to ${REPORT_PATH}`)

  const allPassed = results.every(r => r.passed)
  const totalTraces = results.reduce((s, r) => s + r.traceFiles.length, 0)
  console.log(`Traces captured: ${totalTraces}`)

  if (allPassed) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

main()
