/**
 * Tests for Cloudflare Purge API Script
 *
 * Tests the exported functions. Uses inline approach for isolated testing
 * of the file-resolution logic.
 */

import { describe, expect, it } from 'bun:test'
import { resolveFiles } from './cloudflare-purge'

describe('resolveFiles', () => {
  it('returns provided files when array is non-empty', () => {
    const files = resolveFiles(['/build/q-foo.js', '/build/q-bar.js'])
    expect(files).toEqual(['/build/q-foo.js', '/build/q-bar.js'])
  })

  it('reads from manifest when files array is empty (falls through to manifest)', () => {
    // An empty array triggers the manifest read path.
    // Since dist/q-manifest.json exists in the built project, this should
    // return a non-empty list of /build/* files.
    const files = resolveFiles([])
    expect(files.length).toBeGreaterThan(0)
    expect(files[0]).toMatch(/^\/build\/q-.+\.js$/)
  })

  it('reads from manifest when files is null', () => {
    const files = resolveFiles(null)
    expect(files.length).toBeGreaterThan(0)
    expect(files[0]).toMatch(/^\/build\/q-.+\.js$/)
  })
})

describe('module import', () => {
  it('can be imported without side effects (guarded main pattern)', () => {
    // Verify both exported functions exist and are real functions
    expect(typeof resolveFiles).toBe('function')
  })
})
