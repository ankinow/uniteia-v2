/**
 * Dog CEO API Demo Adapter
 *
 * Demo-only fixture for testing UniTeia-v2 ingestion pipeline.
 * NOT for production content. Draft-only, low-trust external API.
 *
 * @see https://dog.ceo/dog-api/
 * @license MIT (Dog CEO API is free and open)
 */

import { z } from 'zod/v4'

// ─── Schema ────────────────────────────────────────────────────────────────

export const DogCeoRandomImageSchema = z.object({
  message: z.url(),
  status: z.literal('success'),
})

export type DogCeoRandomImage = z.infer<typeof DogCeoRandomImageSchema>

// ─── Constants ─────────────────────────────────────────────────────────────

const API_URL = 'https://dog.ceo/api/breeds/image/random'
const DEFAULT_TIMEOUT_MS = 5000
const CACHE_TTL_MS = 86400 * 1000 // 24 hours

// ─── Registry metadata ─────────────────────────────────────────────────────

export const DOG_CEO_REGISTRY = {
  id: 'dog-ceo-api',
  name: 'Dog CEO API',
  kind: 'demo_api',
  url: 'https://dog.ceo/api',
  trust_level: 'low_demo',
  purpose: [
    'test_external_api_ingestion',
    'test_image_pipeline',
    'test_schema_validation',
    'test_static_artifact_generation',
    'test_visual_publication_blocks',
    'test_mdx_draft_rendering',
    'test_cache_and_fallbacks',
  ],
  policy: {
    publish: 'draft_only',
    production_index: false,
    canonical_content: false,
    search_index: false,
  },
  cache: {
    ttl_seconds: 86400,
  },
  output: {
    artifact_type: 'demo_api_snapshot',
  },
} as const

// ─── Fallback fixture ──────────────────────────────────────────────────────

const FALLBACK_FIXTURE: DogCeoRandomImage = {
  message: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg',
  status: 'success',
}

// ─── In-memory cache ───────────────────────────────────────────────────────

interface CacheEntry {
  data: DogCeoRandomImage
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  if (!cache) return false
  return Date.now() - cache.timestamp < CACHE_TTL_MS
}

// ─── Core fetch function ───────────────────────────────────────────────────

/**
 * Fetch a random dog image from Dog CEO API.
 * Uses Zod validation and configurable timeout.
 *
 * @param fetcher - fetch implementation for DI (testing)
 * @param signal - optional AbortSignal
 * @param timeoutMs - timeout in milliseconds (default 5000)
 * @throws Error if API fails or response is invalid
 */
export async function fetchDogCeoRandomImage(
  fetcher: typeof fetch = fetch,
  signal?: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<DogCeoRandomImage> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetcher(API_URL, {
      signal: signal ?? controller.signal,
      headers: {
        accept: 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Dog CEO API failed: ${res.status}`)
    }

    const json = await res.json()
    return DogCeoRandomImageSchema.parse(json)
  } finally {
    clearTimeout(timeout)
  }
}

// ─── Fallback getter ───────────────────────────────────────────────────────

/**
 * Get the local fallback fixture.
 * Always returns valid data for offline/timeout scenarios.
 */
export function getDogCeoFallback(): DogCeoRandomImage {
  return { ...FALLBACK_FIXTURE }
}

// ─── Safe wrapper with cache and fallback ──────────────────────────────────

export interface DogCeoResult {
  data: DogCeoRandomImage
  fromCache: boolean
  fromFallback: boolean
  error?: string
}

/**
 * Safe wrapper that handles timeouts and errors gracefully.
 * Returns cached data if valid, otherwise fetches from API.
 * Falls back to local fixture on any error.
 *
 * @param fetcher - fetch implementation for DI
 * @param forceRefresh - bypass cache and fetch fresh data
 */
export async function fetchDogCeoSafe(
  fetcher: typeof fetch = fetch,
  forceRefresh: boolean = false
): Promise<DogCeoResult> {
  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && isCacheValid() && cache) {
    return {
      data: cache.data,
      fromCache: true,
      fromFallback: false,
    }
  }

  try {
    const data = await fetchDogCeoRandomImage(fetcher)

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    }

    return {
      data,
      fromCache: false,
      fromFallback: false,
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'

    return {
      data: getDogCeoFallback(),
      fromCache: false,
      fromFallback: true,
      error,
    }
  }
}

// ─── Clear cache (for testing) ─────────────────────────────────────────────

export function clearDogCeoCache(): void {
  cache = null
}

// ─── Alt text generator ────────────────────────────────────────────────────

/**
 * Generate meaningful alt text for a dog image URL.
 * Extracts breed from the URL path when possible.
 */
export function generateDogAltText(imageUrl: string): string {
  try {
    const url = new URL(imageUrl)
    // Dog CEO URLs: /breeds/{breed-subbreed}/{filename}
    const parts = url.pathname.split('/')
    const breedIndex = parts.indexOf('breeds')

    if (breedIndex !== -1 && breedIndex + 1 < parts.length) {
      const breed = parts[breedIndex + 1]!
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      return `A ${breed} dog`
    }
  } catch {
    // Invalid URL, use generic alt
  }

  return 'A random dog from Dog CEO API'
}

// ─── Static artifact envelope ──────────────────────────────────────────────

export interface DogCeoArtifact {
  $meta: {
    source: string
    captured_at: string
    purpose: string
    draft_only: true
    trust_level: 'low_demo'
    search_index: false
    artifact_type: 'demo_api_snapshot'
  }
  data: DogCeoRandomImage
  alt_text: string
}

/**
 * Create a static artifact envelope from a Dog CEO response.
 * Includes all metadata required for draft-only processing.
 */
export function createDogCeoArtifact(data: DogCeoRandomImage): DogCeoArtifact {
  return {
    $meta: {
      source: DOG_CEO_REGISTRY.url,
      captured_at: new Date().toISOString(),
      purpose: 'demo_api_fixture_for_pipeline_testing',
      draft_only: true,
      trust_level: 'low_demo',
      search_index: false,
      artifact_type: 'demo_api_snapshot',
    },
    data,
    alt_text: generateDogAltText(data.message),
  }
}
