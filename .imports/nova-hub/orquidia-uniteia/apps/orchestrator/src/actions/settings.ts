import { createServerFn } from '@tanstack/react-start'
import { getEvent } from 'vinxi/http'
import { z } from 'zod'

export type ServiceName = 'hyperbrowser' | 'gemini' | 'cloudflare'
export type ServiceStatus = 'unknown' | 'valid' | 'invalid'

export interface SettingsData {
  hyperbrowser: {
    configured: boolean
    lastTested: string | null
    status: ServiceStatus
  }
  gemini: {
    configured: boolean
    lastTested: string | null
    status: ServiceStatus
  }
  cloudflare: {
    configured: boolean
    d1Database: string | null
    lastTested: string | null
    status: ServiceStatus
  }
  system: {
    memoryLimit: number
    maxConcurrentOps: number
    autoPublish: boolean
    contentTone: 'professional' | 'casual' | 'technical' | 'persuasive'
  }
}

const SystemSettingsSchema = z.object({
  memoryLimit: z.number().int().min(200).max(2000),
  maxConcurrentOps: z.number().int().min(1).max(3),
  autoPublish: z.boolean(),
  contentTone: z.enum(['professional', 'casual', 'technical', 'persuasive']),
})

const TestServiceSchema = z.object({
  service: z.enum(['hyperbrowser', 'gemini', 'cloudflare']),
})

type SystemSettings = z.infer<typeof SystemSettingsSchema>

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  memoryLimit: 500,
  maxConcurrentOps: 2,
  autoPublish: false,
  contentTone: 'professional',
}

// NOTE: simple in-memory store (local-only). If you need persistence, move to D1/KV.
let systemSettings: SystemSettings = { ...DEFAULT_SYSTEM_SETTINGS }

const serviceState: Record<ServiceName, { status: ServiceStatus; lastTested: string | null }> = {
  hyperbrowser: { status: 'unknown', lastTested: null },
  gemini: { status: 'unknown', lastTested: null },
  cloudflare: { status: 'unknown', lastTested: null },
}

function getD1DatabaseBinding(): D1Database | null {
  const event = getEvent()
  const db = (event.context as { cloudflare?: { env?: { DB?: D1Database } } }).cloudflare?.env?.DB
  return db ?? null
}

function buildSettings(): SettingsData {
  const hyperbrowserConfigured = Boolean(process.env.HYPERBROWSER_API_KEY)
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY)
  const d1 = getD1DatabaseBinding()
  const cloudflareConfigured = Boolean(d1) || Boolean(process.env.CF_API_TOKEN)

  return {
    hyperbrowser: {
      configured: hyperbrowserConfigured,
      status: serviceState.hyperbrowser.status,
      lastTested: serviceState.hyperbrowser.lastTested,
    },
    gemini: {
      configured: geminiConfigured,
      status: serviceState.gemini.status,
      lastTested: serviceState.gemini.lastTested,
    },
    cloudflare: {
      configured: cloudflareConfigured,
      d1Database: d1 ? 'DB' : null,
      status: serviceState.cloudflare.status,
      lastTested: serviceState.cloudflare.lastTested,
    },
    system: systemSettings,
  }
}

export const getSettings = createServerFn({ method: 'GET' }).handler(async () => {
  return buildSettings()
})

export const saveSystemSettings = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => SystemSettingsSchema.parse(data))
  .handler(async ({ data }: { data: SystemSettings }) => {
    systemSettings = data
    return { success: true }
  })

async function testHyperbrowser(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const apiKey = process.env.HYPERBROWSER_API_KEY
  if (!apiKey) {
    return { ok: false, message: 'HYPERBROWSER_API_KEY not configured', latencyMs: 0 }
  }

  const start = Date.now()
  try {
    const response = await fetch('https://app.hyperbrowser.com/api/health', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const latencyMs = Date.now() - start
    if (response.ok) {
      return { ok: true, message: `OK (${response.status})`, latencyMs }
    }
    const bodyText = await response.text().catch(() => '')
    const detail = bodyText ? ` - ${bodyText.slice(0, 120)}` : ''
    return { ok: false, message: `HTTP ${response.status}${detail}`, latencyMs }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

async function testGemini(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { ok: false, message: 'GEMINI_API_KEY not configured', latencyMs: 0 }
  }

  const start = Date.now()
  try {
    // Lightweight validation: list models (no generation)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' },
    )

    const latencyMs = Date.now() - start
    if (response.ok) {
      return { ok: true, message: `OK (${response.status})`, latencyMs }
    }

    const errorJson = (await response.json().catch(() => null)) as {
      error?: { message?: string }
    } | null
    return {
      ok: false,
      message: errorJson?.error?.message
        ? `API error: ${errorJson.error.message}`
        : `HTTP ${response.status}`,
      latencyMs,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

async function testCloudflare(): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const start = Date.now()
  const d1 = getD1DatabaseBinding()

  if (d1) {
    try {
      await d1.prepare('SELECT 1 as ok').first()
      return { ok: true, message: 'D1 OK (binding DB)', latencyMs: Date.now() - start }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'D1 query failed',
        latencyMs: Date.now() - start,
      }
    }
  }

  const apiToken = process.env.CF_API_TOKEN
  const accountId = process.env.CF_ACCOUNT_ID
  if (!apiToken || !accountId) {
    return {
      ok: false,
      message: 'No D1 binding (DB) and missing CF_API_TOKEN/CF_ACCOUNT_ID',
      latencyMs: Date.now() - start,
    }
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
    const latencyMs = Date.now() - start
    const data = (await response.json().catch(() => null)) as {
      success?: boolean
      result?: unknown[]
      errors?: Array<{ message?: string }>
    } | null

    if (data?.success) {
      return { ok: true, message: `CF API OK (D1 count: ${data.result?.length ?? 0})`, latencyMs }
    }

    return {
      ok: false,
      message: data?.errors?.[0]?.message
        ? `CF API error: ${data.errors[0].message}`
        : `HTTP ${response.status}`,
      latencyMs,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Connection failed',
      latencyMs: Date.now() - start,
    }
  }
}

export const testService = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => TestServiceSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof TestServiceSchema> }) => {
    const { service } = data

    let result: { ok: boolean; message: string; latencyMs: number }
    if (service === 'hyperbrowser') {
      result = await testHyperbrowser()
    } else if (service === 'gemini') {
      result = await testGemini()
    } else {
      result = await testCloudflare()
    }

    serviceState[service] = {
      status: result.ok ? 'valid' : 'invalid',
      lastTested: new Date().toISOString(),
    }

    return { success: result.ok, message: result.message, latencyMs: result.latencyMs }
  })
