/**
 * Dog CEO API Adapter Tests
 *
 * Quality gates for demo fixture integration:
 * - schema:valid
 * - timeout:handled
 * - fallback:works
 * - cache:bounded
 * - image:validated (URL format)
 * - alt:exists
 * - draft:enforced
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DOG_CEO_REGISTRY,
  DogCeoRandomImageSchema,
  clearDogCeoCache,
  createDogCeoArtifact,
  fetchDogCeoRandomImage,
  fetchDogCeoSafe,
  generateDogAltText,
  getDogCeoFallback,
} from './dog-ceo'

// ─── Test fixtures ─────────────────────────────────────────────────────────

const VALID_RESPONSE = {
  message: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg',
  status: 'success' as const,
}

const INVALID_RESPONSES = [
  { message: 'not-a-url', status: 'success' }, // invalid URL
  { message: 'https://example.com/dog.jpg', status: 'error' }, // wrong status
  { message: 'https://example.com/dog.jpg' }, // missing status
  { status: 'success' }, // missing message
  {}, // empty object
  null, // null
  'string', // wrong type
]

// ─── Schema validation tests ───────────────────────────────────────────────

describe('DogCeoRandomImageSchema', () => {
  it('validates correct response shape', () => {
    const result = DogCeoRandomImageSchema.safeParse(VALID_RESPONSE)
    expect(result.success).toBe(true)
  })

  it('requires message to be a valid URL', () => {
    const invalid = { message: 'not-a-url', status: 'success' }
    const result = DogCeoRandomImageSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('requires status to be literally "success"', () => {
    const invalid = { message: 'https://example.com/dog.jpg', status: 'error' }
    const result = DogCeoRandomImageSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it.each(INVALID_RESPONSES)('rejects invalid response: %j', invalid => {
    const result = DogCeoRandomImageSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

// ─── Fallback tests ────────────────────────────────────────────────────────

describe('getDogCeoFallback', () => {
  it('returns valid fixture data', () => {
    const fallback = getDogCeoFallback()
    const result = DogCeoRandomImageSchema.safeParse(fallback)
    expect(result.success).toBe(true)
  })

  it('returns a new object each time (no mutation)', () => {
    const a = getDogCeoFallback()
    const b = getDogCeoFallback()
    expect(a).toEqual(b)
    expect(a).not.toBe(b)
  })
})

// ─── Fetch function tests ──────────────────────────────────────────────────

describe('fetchDogCeoRandomImage', () => {
  it('fetches and validates response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_RESPONSE),
    })

    const result = await fetchDogCeoRandomImage(mockFetch as unknown as typeof fetch)
    expect(result).toEqual(VALID_RESPONSE)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://dog.ceo/api/breeds/image/random',
      expect.objectContaining({
        headers: { accept: 'application/json' },
      })
    )
  })

  it('throws on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(fetchDogCeoRandomImage(mockFetch as unknown as typeof fetch)).rejects.toThrow(
      'Dog CEO API failed: 500'
    )
  })

  it('throws on invalid response shape', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ invalid: true }),
    })

    await expect(fetchDogCeoRandomImage(mockFetch as unknown as typeof fetch)).rejects.toThrow()
  })
})

// ─── Safe wrapper tests ────────────────────────────────────────────────────

describe('fetchDogCeoSafe', () => {
  beforeEach(() => {
    clearDogCeoCache()
  })

  it('returns data with fromCache and fromFallback flags', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_RESPONSE),
    })

    const result = await fetchDogCeoSafe(mockFetch as unknown as typeof fetch)
    expect(result.fromCache).toBe(false)
    expect(result.fromFallback).toBe(false)
    expect(result.data).toEqual(VALID_RESPONSE)
  })

  it('returns fallback on fetch error', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await fetchDogCeoSafe(mockFetch as unknown as typeof fetch)
    expect(result.fromFallback).toBe(true)
    expect(result.error).toBe('Network error')
    expect(DogCeoRandomImageSchema.safeParse(result.data).success).toBe(true)
  })

  it('returns fallback on timeout', async () => {
    const slowFetch = vi.fn().mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('AbortError')), 100)
        })
    )

    const result = await fetchDogCeoSafe(slowFetch as unknown as typeof fetch)
    expect(result.fromFallback).toBe(true)
  })

  it('caches successful responses', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_RESPONSE),
    })

    // First call fetches
    await fetchDogCeoSafe(mockFetch as unknown as typeof fetch)
    expect(mockFetch).toHaveBeenCalledTimes(1)

    // Second call uses cache
    const cached = await fetchDogCeoSafe(mockFetch as unknown as typeof fetch)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(cached.fromCache).toBe(true)
  })

  it('forceRefresh bypasses cache', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_RESPONSE),
    })

    await fetchDogCeoSafe(mockFetch as unknown as typeof fetch)
    await fetchDogCeoSafe(mockFetch as unknown as typeof fetch, true)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

// ─── Alt text generation tests ─────────────────────────────────────────────

describe('generateDogAltText', () => {
  it('extracts breed from Dog CEO URL', () => {
    const url = 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg'
    expect(generateDogAltText(url)).toBe('A Retriever Golden dog')
  })

  it('handles hyphenated sub-breeds', () => {
    const url = 'https://images.dog.ceo/breeds/bulldog-french/n02108915_1234.jpg'
    expect(generateDogAltText(url)).toBe('A Bulldog French dog')
  })

  it('returns generic alt for invalid URLs', () => {
    expect(generateDogAltText('not-a-url')).toBe('A random dog from Dog CEO API')
  })

  it('returns generic alt for non-Dog-CEO URLs', () => {
    expect(generateDogAltText('https://example.com/dog.jpg')).toBe('A random dog from Dog CEO API')
  })
})

// ─── Static artifact tests ─────────────────────────────────────────────────

describe('createDogCeoArtifact', () => {
  it('creates valid artifact envelope', () => {
    const artifact = createDogCeoArtifact(VALID_RESPONSE)

    expect(artifact.$meta.draft_only).toBe(true)
    expect(artifact.$meta.trust_level).toBe('low_demo')
    expect(artifact.$meta.search_index).toBe(false)
    expect(artifact.$meta.artifact_type).toBe('demo_api_snapshot')
    expect(artifact.data).toEqual(VALID_RESPONSE)
    expect(artifact.alt_text).toBeTruthy()
  })

  it('includes valid ISO timestamp', () => {
    const artifact = createDogCeoArtifact(VALID_RESPONSE)
    const date = new Date(artifact.$meta.captured_at)
    expect(date.toISOString()).toBe(artifact.$meta.captured_at)
  })
})

// ─── Registry metadata tests ───────────────────────────────────────────────

describe('DOG_CEO_REGISTRY', () => {
  it('enforces draft-only policy', () => {
    expect(DOG_CEO_REGISTRY.policy.publish).toBe('draft_only')
    expect(DOG_CEO_REGISTRY.policy.production_index).toBe(false)
    expect(DOG_CEO_REGISTRY.policy.canonical_content).toBe(false)
    expect(DOG_CEO_REGISTRY.policy.search_index).toBe(false)
  })

  it('sets trust level to low_demo', () => {
    expect(DOG_CEO_REGISTRY.trust_level).toBe('low_demo')
  })

  it('defines bounded cache TTL', () => {
    expect(DOG_CEO_REGISTRY.cache.ttl_seconds).toBeLessThanOrEqual(86400)
  })
})

// ─── Image URL validation tests ────────────────────────────────────────────

describe('image URL validation', () => {
  it('fallback URL is reachable format', () => {
    const fallback = getDogCeoFallback()
    const url = new URL(fallback.message)
    expect(url.protocol).toBe('https:')
    expect(url.hostname).toBe('images.dog.ceo')
  })
})
