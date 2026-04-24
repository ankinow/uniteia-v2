/**
 * Hyperbrowser API Client - SOTA 2026
 * Economic, surgical configuration. No Python. No heavy deps.
 * Cloud-based browser automation for scraping.
 */

const HYPERBROWSER_API_KEY = process.env.HYPERBROWSER_API_KEY || ''
const HYPERBROWSER_BASE_URL = 'https://app.hyperbrowser.com/api'

export interface ScrapeOptions {
  url: string
  waitFor?: number // ms to wait after load
  extractData?: {
    title?: boolean
    price?: boolean
    description?: boolean
    image?: boolean
    specs?: boolean
  }
}

export interface ScrapeResult {
  success: boolean
  url: string
  title?: string
  price?: number
  currency?: string
  description?: string
  image?: string
  specs?: Record<string, string>
  error?: string
  metadata: {
    scrapedAt: string
    durationMs: number
    source: 'hyperbrowser'
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function getNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

/**
 * Economic memory check before API call
 */
function checkMemory(): boolean {
  const freemem = require('node:os').freemem()
  const totalmem = require('node:os').totalmem()
  const freeMB = freemem / 1024 / 1024
  const freePercent = (freemem / totalmem) * 100

  // Gate: Need at least 300MB free (5% of 6GB)
  if (freeMB < 300 || freePercent < 5) {
    console.error(
      `[MEMORY GATE] Insufficient: ${freeMB.toFixed(0)}MB free (${freePercent.toFixed(1)}%)`,
    )
    return false
  }
  return true
}

/**
 * Scrape product page via Hyperbrowser API
 * RSIP_LOOP₄: Self-monitoring with memory gates
 */
export async function scrapeProduct(options: ScrapeOptions): Promise<ScrapeResult> {
  const startTime = Date.now()

  // RSIP: Review - Memory check
  if (!checkMemory()) {
    return {
      success: false,
      url: options.url,
      error: 'MEMORY_GATE: System memory insufficient. Aborting scrape.',
      metadata: {
        scrapedAt: new Date().toISOString(),
        durationMs: 0,
        source: 'hyperbrowser',
      },
    }
  }

  if (!HYPERBROWSER_API_KEY) {
    return {
      success: false,
      url: options.url,
      error: 'HYPERBROWSER_API_KEY not configured',
      metadata: {
        scrapedAt: new Date().toISOString(),
        durationMs: 0,
        source: 'hyperbrowser',
      },
    }
  }

  try {
    // Hyperbrowser scrape endpoint
    const response = await fetch(`${HYPERBROWSER_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HYPERBROWSER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: options.url,
        wait_for: options.waitFor || 2000,
        extract: {
          title: options.extractData?.title ?? true,
          price: options.extractData?.price ?? true,
          description: options.extractData?.description ?? true,
          image: options.extractData?.image ?? true,
          specs: options.extractData?.specs ?? true,
        },
        // Economic: Use lightweight browser config
        browser_config: {
          headless: true,
          viewport: { width: 1280, height: 720 },
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        // Surgical: Only wait for essential elements
        wait_for_selector: 'h1, .price, [data-price]',
        timeout: 30000, // 30s max
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hyperbrowser API error: ${response.status} - ${errorText}`)
    }

    const data = asRecord((await response.json()) as unknown)
    const durationMs = Date.now() - startTime

    // RSIP: Learn - Log performance
    console.log(`[HYPERBROWSER] Scraped ${options.url} in ${durationMs}ms`)

    return {
      success: true,
      url: options.url,
      title: getString(data.title),
      price: getNumber(data.price),
      currency: getString(data.currency),
      description: getString(data.description),
      image: getString(data.image),
      specs: asRecord(data.specs) as Record<string, string>,
      metadata: {
        scrapedAt: new Date().toISOString(),
        durationMs,
        source: 'hyperbrowser',
      },
    }
  } catch (error) {
    const durationMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // RSIP: Adapt - Log failure for retry strategy
    console.error(`[HYPERBROWSER] Failed: ${errorMessage}`)

    return {
      success: false,
      url: options.url,
      error: errorMessage,
      metadata: {
        scrapedAt: new Date().toISOString(),
        durationMs,
        source: 'hyperbrowser',
      },
    }
  }
}

/**
 * Batch scrape with concurrency control
 * MA-ToT: Parallel execution with resource limits
 */
export async function scrapeBatch(
  urls: string[],
  options: Omit<ScrapeOptions, 'url'>,
  maxConcurrency = 2, // Economic: Limit concurrent browser sessions
): Promise<ScrapeResult[]> {
  const results: ScrapeResult[] = []

  // Process in chunks to control memory
  for (let i = 0; i < urls.length; i += maxConcurrency) {
    const chunk = urls.slice(i, i + maxConcurrency)

    // MA-ToT: Parallel thoughts (limited)
    const chunkPromises = chunk.map((url) => scrapeProduct({ ...options, url }))

    const chunkResults = await Promise.all(chunkPromises)
    results.push(...chunkResults)

    // RSIP: Adapt - Pause between chunks for GC
    if (i + maxConcurrency < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (global.gc) global.gc() // Force GC if available
    }
  }

  return results
}

/**
 * Health check for Hyperbrowser API
 */
export async function checkHyperbrowserHealth(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now()
  try {
    const response = await fetch(`${HYPERBROWSER_BASE_URL}/health`, {
      headers: { Authorization: `Bearer ${HYPERBROWSER_API_KEY}` },
    })
    return { ok: response.ok, latencyMs: Date.now() - start }
  } catch {
    return { ok: false, latencyMs: Date.now() - start }
  }
}
