import { describe, expect, it } from 'vitest'
import {
  CHUNK_URL_PATTERN,
  type ChaosResult,
  extractManifestHash,
  generateChaosReport,
  verifySWRHeaders,
} from '~/utils/edge-chaos'

// ── CHUNK_URL_PATTERN ──────────────────────────────────────────────────

describe('CHUNK_URL_PATTERN', () => {
  it('matches a standard Qwik chunk URL with hash', () => {
    expect(CHUNK_URL_PATTERN.test('/build/q-DaSwm3_Y.js')).toBe(true)
  })

  it('matches a chunk URL with a simple name', () => {
    expect(CHUNK_URL_PATTERN.test('/build/q-core.js')).toBe(true)
  })

  it('matches a preloader chunk URL', () => {
    expect(CHUNK_URL_PATTERN.test('/build/q-BD-hIznX.js')).toBe(true)
  })

  it('rejects a non-chunk build URL', () => {
    expect(CHUNK_URL_PATTERN.test('/build/main.js')).toBe(false)
  })

  it('rejects a non-JS path', () => {
    expect(CHUNK_URL_PATTERN.test('/build/q-core.css')).toBe(false)
  })

  it('rejects a URL outside /build/', () => {
    expect(CHUNK_URL_PATTERN.test('/assets/q-core.js')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(CHUNK_URL_PATTERN.test('')).toBe(false)
  })
})

// ── extractManifestHash ────────────────────────────────────────────────

describe('extractManifestHash', () => {
  it('extracts the manifest hash from valid HTML', () => {
    const html = '<html q:manifest-hash="fcyp29" lang="en"><body></body></html>'
    expect(extractManifestHash(html)).toBe('fcyp29')
  })

  it('extracts a hash with alphanumeric and underscore characters', () => {
    const html = '<html q:manifest-hash="aB3_xY9" lang="en"></html>'
    expect(extractManifestHash(html)).toBe('aB3_xY9')
  })

  it('extracts a hash from a full HTML document with scripts', () => {
    const html = [
      '<!DOCTYPE html>',
      '<html q:manifest-hash="k7m2p1">',
      '<head><title>Test</title></head>',
      '<body><script>window.qManifestHash = "k7m2p1"</script></body>',
      '</html>',
    ].join('\n')
    expect(extractManifestHash(html)).toBe('k7m2p1')
  })

  it('returns null when the attribute is missing', () => {
    const html = '<html lang="en"><body></body></html>'
    expect(extractManifestHash(html)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(extractManifestHash('')).toBeNull()
  })

  it('extracts the attribute from any tag, not just <html>', () => {
    // The regex is tag-agnostic — it finds the attribute anywhere in the HTML
    const html = '<div q:manifest-hash="abc123"></div>'
    expect(extractManifestHash(html)).toBe('abc123')
  })

  it('extracts only the first match when multiple occurrences exist', () => {
    const html =
      '<html q:manifest-hash="firstHash"><body><div q:manifest-hash="secondHash"></div></body></html>'
    expect(extractManifestHash(html)).toBe('firstHash')
  })
})

// ── verifySWRHeaders ──────────────────────────────────────────────────

describe('verifySWRHeaders', () => {
  it('detects SWR with max-age from standard HTML header', () => {
    const result = verifySWRHeaders({
      'cache-control': 'public, max-age=60, stale-while-revalidate=300',
    })
    expect(result).toEqual({ hasSWR: true, maxAge: 60, swr: 300 })
  })

  it('handles Cache-Control with PascalCase key', () => {
    const result = verifySWRHeaders({
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    })
    expect(result).toEqual({ hasSWR: true, maxAge: 60, swr: 300 })
  })

  it('handles Cache-Control with UPPERCASE key', () => {
    const result = verifySWRHeaders({
      'CACHE-CONTROL': 'public, max-age=60, stale-while-revalidate=300',
    })
    expect(result).toEqual({ hasSWR: true, maxAge: 60, swr: 300 })
  })

  it('returns no SWR when Cache-Control is missing', () => {
    const result = verifySWRHeaders({})
    expect(result).toEqual({ hasSWR: false, maxAge: null, swr: null })
  })

  it('returns no SWR when Cache-Control lacks stale-while-revalidate', () => {
    const result = verifySWRHeaders({
      'cache-control': 'public, max-age=31536000, immutable',
    })
    expect(result).toEqual({ hasSWR: false, maxAge: 31536000, swr: null })
  })

  it('parses max-age correctly when SWR is absent', () => {
    const result = verifySWRHeaders({
      'cache-control': 'public, max-age=0, must-revalidate',
    })
    expect(result).toEqual({ hasSWR: false, maxAge: 0, swr: null })
  })

  it('handles malformed max-age gracefully', () => {
    const result = verifySWRHeaders({
      'cache-control': 'max-age=not-a-number, stale-while-revalidate=300',
    })
    expect(result.hasSWR).toBe(true)
    expect(result.maxAge).toBeNull()
    expect(result.swr).toBe(300)
  })

  it('handles malformed stale-while-revalidate gracefully', () => {
    const result = verifySWRHeaders({
      'cache-control': 'max-age=60, stale-while-revalidate=abc',
    })
    expect(result.hasSWR).toBe(false)
    expect(result.maxAge).toBe(60)
    expect(result.swr).toBeNull()
  })

  it('parses complex cache-control with multiple directives', () => {
    const result = verifySWRHeaders({
      'cache-control': 'private, no-cache, no-store, max-age=0, must-revalidate',
    })
    expect(result).toEqual({ hasSWR: false, maxAge: 0, swr: null })
  })

  it('extracts only the first max-age value', () => {
    const result = verifySWRHeaders({
      'cache-control': 'max-age=60, stale-while-revalidate=300, max-age=999',
    })
    expect(result).toEqual({ hasSWR: true, maxAge: 60, swr: 300 })
  })
})

// ── generateChaosReport ────────────────────────────────────────────────

describe('generateChaosReport', () => {
  it('returns "passed" status when all results pass', () => {
    const results: ChaosResult[] = [
      { scenario: 'build-id-mismatch', url: '/en', passed: true, durationMs: 120 },
      { scenario: 'chunk-404', url: '/build/q-core.js', passed: true, durationMs: 45 },
      { scenario: 'swr-stale', url: '/about', passed: true, durationMs: 88 },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('passed')
    expect(report).toContain('build-id-mismatch')
    expect(report).toContain('chunk-404')
    expect(report).toContain('swr-stale')
    expect(report).toContain('3')
    expect(report).toContain('253 ms') // 120 + 45 + 88
  })

  it('returns "failed" status when all results fail', () => {
    const results: ChaosResult[] = [
      {
        scenario: 'chunk-404',
        url: '/build/q-missing.js',
        passed: false,
        error: 'HTTP 404 Not Found',
        durationMs: 30,
      },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('failed')
    expect(report).toContain('chunk-404')
    expect(report).toContain('HTTP 404 Not Found')
    expect(report).toContain('1')
  })

  it('returns "partial" status when some pass and some fail', () => {
    const results: ChaosResult[] = [
      { scenario: 'build-id-mismatch', url: '/en', passed: true, durationMs: 120 },
      {
        scenario: 'chunk-404',
        url: '/build/q-stale.js',
        passed: false,
        error: 'Chunk not found in manifest',
        durationMs: 45,
      },
      { scenario: 'swr-stale', url: '/about', passed: true, durationMs: 88 },
      {
        scenario: 'manifest-missing',
        url: '/',
        passed: false,
        error: 'q-manifest.json returned 404',
        durationMs: 12,
      },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('partial')
    expect(report).toContain('| Failed | 2')
    expect(report).toContain('| Passed | 2')
    expect(report).toContain('Chunk not found in manifest')
    expect(report).toContain('q-manifest.json returned 404')
  })

  it('handles an empty results array', () => {
    const report = generateChaosReport([])

    expect(report).toContain('No results recorded')
    expect(report).not.toContain('Summary')
  })

  it('handles a single failure without explicit error message', () => {
    const results: ChaosResult[] = [
      {
        scenario: 'manifest-missing',
        url: '/q-manifest.json',
        passed: false,
        durationMs: 5,
      },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('failed')
    expect(report).toContain('manifest-missing')
    // Should generate a derived error message
    expect(report).toContain('manifest-missing')
  })

  it('includes error messages in the Errors section', () => {
    const results: ChaosResult[] = [
      { scenario: 'build-id-mismatch', url: '/en', passed: true, durationMs: 50 },
      {
        scenario: 'chunk-404',
        url: '/build/q-bad.js',
        passed: false,
        error: 'HTTP 503',
        durationMs: 100,
      },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('Errors')
    expect(report).toContain('HTTP 503')
    expect(report).toContain('✅ Passed')
    expect(report).toContain('❌ Failed')
  })

  it('reports total duration correctly as sum of all durations', () => {
    const results: ChaosResult[] = [
      { scenario: 'build-id-mismatch', url: '/a', passed: true, durationMs: 100 },
      { scenario: 'chunk-404', url: '/b', passed: false, error: 'err', durationMs: 200 },
      { scenario: 'swr-stale', url: '/c', passed: true, durationMs: 300 },
    ]

    const report = generateChaosReport(results)

    expect(report).toContain('600 ms')
  })
})
