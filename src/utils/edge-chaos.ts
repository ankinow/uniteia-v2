/**
 * Edge Chaos — shared types and pure helper functions for chaos testing
 *
 * Provides the building blocks used by the Playwright chaos test (T05) and
 * the CLI chaos script (T06): scenario types, manifest-hash extraction from
 * HTML, SWR cache-control header verification, structured markdown report
 * generation, and a chunk URL pattern.
 *
 * @module edge-chaos
 */

// ── Types ───────────────────────────────────────────────────────────────

/** The chaos scenarios that can be injected during stress testing. */
export type ChaosScenario = 'build-id-mismatch' | 'chunk-404' | 'swr-stale' | 'manifest-missing'

/** The outcome of a single chaos-test navigation or assertion. */
export interface ChaosResult {
  /** Which scenario was being exercised. */
  scenario: ChaosScenario
  /** The URL that was navigated to (or the resource URL for chunk tests). */
  url: string
  /** Whether the scenario completed without unexpected failure. */
  passed: boolean
  /** Optional error message when passed is false. */
  error?: string
  /** Wall-clock duration of the step in milliseconds. */
  durationMs: number
}

/** Aggregate report summarising a set of chaos test results. */
export interface ChaosReport {
  /** Overall status derived from the result set. */
  status: 'passed' | 'failed' | 'partial'
  /** Error messages collected from every failed result. */
  errors: string[]
  /** Total wall-clock duration across all results in milliseconds. */
  duration: number
}

// ── Constants ───────────────────────────────────────────────────────────

/**
 * Regular expression that matches Qwik build chunk URLs served from /build/.
 *
 * Chunks follow the naming convention `q-<hash>.js` or `q-<symbol>.js`,
 * e.g. `/build/q-DaSwm3_Y.js` or `/build/q-core.js`.
 */
export const CHUNK_URL_PATTERN = /^\/build\/q-[\w-]+\.js$/

// ── Pure helpers ────────────────────────────────────────────────────────

/**
 * Extract the `q:manifest-hash` attribute value from an HTML string.
 *
 * The service worker (src/routes/service-worker.ts) embeds this attribute
 * on the `<html>` element during SSR so the SW can detect BUILD_ID changes.
 *
 * @param html — Raw HTML response body.
 * @returns The manifest hash value, or `null` when the attribute is absent.
 *
 * @example
 * extractManifestHash('<html q:manifest-hash="fcyp29">…</html>')
 * // => "fcyp29"
 *
 * extractManifestHash('<html>…</html>')
 * // => null
 */
export function extractManifestHash(html: string): string | null {
  const match = html.match(/q:manifest-hash="([^"]+)"/)
  return match ? (match[1] as string) : null
}

/**
 * Inspect a set of response headers for SWR (stale-while-revalidate)
 * cache-control directives.
 *
 * Used by chaos tests to verify that HTML responses carry the expected
 * `Cache-Control: public, max-age=60, stale-while-revalidate=300` header
 * configured in `public/_headers`.
 *
 * @param headers — Response headers keyed by lower-case name.
 * @returns Parsed SWR metadata.
 *
 * @example
 * verifySWRHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' })
 * // => { hasSWR: true, maxAge: 60, swr: 300 }
 *
 * verifySWRHeaders({})
 * // => { hasSWR: false, maxAge: null, swr: null }
 */
export function verifySWRHeaders(headers: Record<string, string>): {
  hasSWR: boolean
  maxAge: number | null
  swr: number | null
} {
  const cacheControl =
    headers['cache-control'] ?? headers['Cache-Control'] ?? headers['CACHE-CONTROL']

  if (!cacheControl) {
    return { hasSWR: false, maxAge: null, swr: null }
  }

  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/)
  const swrMatch = cacheControl.match(/stale-while-revalidate=(\d+)/)

  return {
    hasSWR: swrMatch !== null,
    maxAge: maxAgeMatch ? Number.parseInt(maxAgeMatch[1] as string, 10) : null,
    swr: swrMatch ? Number.parseInt(swrMatch[1] as string, 10) : null,
  }
}

/**
 * Generate a structured markdown report from an array of chaos test results.
 *
 * The report includes a summary table at the top followed by per-scenario
 * detail lines grouped by pass/fail status.
 *
 * @param results — Ordered array of individual chaos test results.
 * @returns A formatted markdown string.
 *
 * @example
 * generateChaosReport([
 *   { scenario: 'build-id-mismatch', url: '/en', passed: true, durationMs: 120 },
 *   { scenario: 'chunk-404', url: '/build/q-missing.js', passed: false,
 *     error: 'HTTP 404', durationMs: 45 },
 * ])
 */
export function generateChaosReport(results: ChaosResult[]): string {
  if (results.length === 0) {
    return ['# Chaos Stress Test Report', '', '**No results recorded.**'].join('\n')
  }

  const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0)
  const passed = results.filter(r => r.passed)
  const failed = results.filter(r => !r.passed)
  const errors = failed.map(r => r.error ?? `Scenario "${r.scenario}" failed at ${r.url}`)

  let status: ChaosReport['status']
  if (failed.length === 0) {
    status = 'passed'
  } else if (passed.length === 0) {
    status = 'failed'
  } else {
    status = 'partial'
  }

  const lines: string[] = ['# Chaos Stress Test Report', '']

  // ── Summary table ──
  lines.push('## Summary', '')
  lines.push('| Metric | Value |')
  lines.push('|--------|-------|')
  lines.push(`| Status | ${status} |`)
  lines.push(`| Total scenarios | ${results.length} |`)
  lines.push(`| Passed | ${passed.length} |`)
  lines.push(`| Failed | ${failed.length} |`)
  lines.push(`| Total duration | ${totalDuration} ms |`)
  if (errors.length > 0) {
    lines.push(`| Errors | ${errors.length} |`)
  }
  lines.push('')

  // ── Passed scenarios ──
  if (passed.length > 0) {
    lines.push('## ✅ Passed', '')
    for (const result of passed) {
      lines.push(`- **${result.scenario}** — \`${result.url}\` — ${result.durationMs} ms`)
    }
    lines.push('')
  }

  // ── Failed scenarios ──
  if (failed.length > 0) {
    lines.push('## ❌ Failed', '')
    for (const result of failed) {
      lines.push(`- **${result.scenario}** — \`${result.url}\` — ${result.durationMs} ms`)
      if (result.error) {
        lines.push(`  - Error: ${result.error}`)
      }
    }
    lines.push('')
  }

  // ── Error list ──
  if (errors.length > 0) {
    lines.push('## Errors', '')
    for (let i = 0; i < errors.length; i++) {
      lines.push(`${i + 1}. ${errors[i] as string}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
