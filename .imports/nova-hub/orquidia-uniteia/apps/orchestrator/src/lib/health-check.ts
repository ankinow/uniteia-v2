/**
 * Health Check System for Orquidia Ops Center
 * SOTA 2026: Comprehensive binding validation
 *
 * Validates: D1, KV, AI providers, external services
 */

import { getEvent } from 'vinxi/http'

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    d1: ServiceCheck
    kv: ServiceCheck
    hyperbrowser: ServiceCheck
    gemini: ServiceCheck
    cloudflare: ServiceCheck
  }
  latency: {
    total: number
    d1?: number
    kv?: number
  }
}

export interface ServiceCheck {
  status: 'ok' | 'error' | 'unknown'
  message: string
  latencyMs: number
  lastChecked?: string
}

interface BindingEnv {
  DB?: D1Database
  KV_STATIC_HTML?: KVNamespace
  HYPERBROWSER_API_KEY?: string
  GEMINI_API_KEY?: string
  CF_API_TOKEN?: string
  CF_ACCOUNT_ID?: string
}

/**
 * Get Cloudflare bindings from request context
 */
function getBindings(): BindingEnv {
  const event = getEvent()
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env ?? {}
}

/**
 * Check D1 database connectivity
 */
async function checkD1(): Promise<ServiceCheck> {
  const start = Date.now()
  const { DB } = getBindings()

  if (!DB) {
    return {
      status: 'error',
      message: 'D1 binding (DB) not available',
      latencyMs: Date.now() - start,
    }
  }

  try {
    const result = await DB.prepare('SELECT 1 as ok, unixepoch() as timestamp').first<{
      ok: number
      timestamp: number
    }>()

    if (result?.ok === 1) {
      return {
        status: 'ok',
        message: `D1 connected (timestamp: ${result.timestamp})`,
        latencyMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
    }

    return {
      status: 'error',
      message: 'D1 query returned unexpected result',
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'D1 query failed',
      latencyMs: Date.now() - start,
    }
  }
}

/**
 * Check KV namespace connectivity
 */
async function checkKV(): Promise<ServiceCheck> {
  const start = Date.now()
  const { KV_STATIC_HTML } = getBindings()

  if (!KV_STATIC_HTML) {
    return {
      status: 'error',
      message: 'KV binding (KV_STATIC_HTML) not available',
      latencyMs: Date.now() - start,
    }
  }

  try {
    const testKey = `health-check-${Date.now()}`
    const testValue = { timestamp: Date.now(), check: 'kv-health' }

    await KV_STATIC_HTML.put(testKey, JSON.stringify(testValue), { expirationTtl: 60 })
    const retrieved = await KV_STATIC_HTML.get(testKey)

    if (retrieved) {
      return {
        status: 'ok',
        message: 'KV read/write OK',
        latencyMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
    }

    return {
      status: 'error',
      message: 'KV write succeeded but read failed',
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'KV operation failed',
      latencyMs: Date.now() - start,
    }
  }
}

/**
 * Check Hyperbrowser API connectivity
 */
async function checkHyperbrowser(): Promise<ServiceCheck> {
  const start = Date.now()
  const { HYPERBROWSER_API_KEY } = getBindings()

  if (!HYPERBROWSER_API_KEY) {
    return {
      status: 'unknown',
      message: 'HYPERBROWSER_API_KEY not configured',
      latencyMs: 0,
    }
  }

  try {
    const response = await fetch('https://app.hyperbrowser.com/api/health', {
      headers: { Authorization: `Bearer ${HYPERBROWSER_API_KEY}` },
    })

    if (response.ok) {
      return {
        status: 'ok',
        message: `Hyperbrowser API OK (${response.status})`,
        latencyMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
    }

    return {
      status: 'error',
      message: `Hyperbrowser API returned ${response.status}`,
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Hyperbrowser connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

/**
 * Check Gemini API connectivity
 */
async function checkGemini(): Promise<ServiceCheck> {
  const start = Date.now()
  const { GEMINI_API_KEY } = getBindings()

  if (!GEMINI_API_KEY) {
    return {
      status: 'unknown',
      message: 'GEMINI_API_KEY not configured',
      latencyMs: 0,
    }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      { method: 'GET' },
    )

    if (response.ok) {
      return {
        status: 'ok',
        message: 'Gemini API OK',
        latencyMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
    }

    const errorData = (await response.json().catch(() => null)) as {
      error?: { message?: string }
    } | null

    return {
      status: 'error',
      message: errorData?.error?.message || `Gemini API returned ${response.status}`,
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Gemini connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

/**
 * Check Cloudflare API connectivity
 */
async function checkCloudflare(): Promise<ServiceCheck> {
  const start = Date.now()
  const { CF_API_TOKEN, CF_ACCOUNT_ID } = getBindings()

  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
    return {
      status: 'unknown',
      message: 'CF_API_TOKEN or CF_ACCOUNT_ID not configured',
      latencyMs: 0,
    }
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database`,
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const data = (await response.json().catch(() => null)) as {
      success?: boolean
      result?: unknown[]
      errors?: Array<{ message?: string }>
    } | null

    if (data?.success) {
      return {
        status: 'ok',
        message: `Cloudflare API OK (D1 databases: ${data.result?.length ?? 0})`,
        latencyMs: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
    }

    return {
      status: 'error',
      message: data?.errors?.[0]?.message || `Cloudflare API returned ${response.status}`,
      latencyMs: Date.now() - start,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Cloudflare API connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

/**
 * Run comprehensive health check
 */
export async function runHealthCheck(): Promise<HealthStatus> {
  const start = Date.now()

  const [d1, kv, hyperbrowser, gemini, cloudflare] = await Promise.all([
    checkD1(),
    checkKV(),
    checkHyperbrowser(),
    checkGemini(),
    checkCloudflare(),
  ])

  // Determine overall status
  const criticalChecks = [d1, kv]
  const failedCritical = criticalChecks.filter((c) => c.status === 'error').length
  const failedOptional = [hyperbrowser, gemini, cloudflare].filter(
    (c) => c.status === 'error',
  ).length

  let status: HealthStatus['status'] = 'healthy'
  if (failedCritical > 0) {
    status = 'unhealthy'
  } else if (failedOptional > 0) {
    status = 'degraded'
  }

  return {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.VERSION || '0.2.0',
    checks: {
      d1,
      kv,
      hyperbrowser,
      gemini,
      cloudflare,
    },
    latency: {
      total: Date.now() - start,
      d1: d1.latencyMs,
      kv: kv.latencyMs,
    },
  }
}

/**
 * Quick health check for load balancers
 * Returns 200 if D1 is accessible, 503 otherwise
 */
export async function quickHealthCheck(): Promise<{ ok: boolean; message: string }> {
  const { DB } = getBindings()

  if (!DB) {
    return { ok: false, message: 'D1 binding not available' }
  }

  try {
    await DB.prepare('SELECT 1').first()
    return { ok: true, message: 'OK' }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'D1 check failed',
    }
  }
}
