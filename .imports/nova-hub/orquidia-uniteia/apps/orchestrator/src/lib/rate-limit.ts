/**
 * Rate Limiting Utility
 * SOTA 2026: Content generation rate limiting (50 pages/day)
 *
 * Features:
 * - Daily limit: 50 content pages per user
 * - D1-based tracking for distributed environments
 * - Audit logging for all rate limit events
 */

import { getEvent } from 'vinxi/http'
import { getAuthContext } from './auth-middleware'

interface BindingEnv {
  DB?: D1Database
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  limit: number
}

const DAILY_LIMIT = 50 // pages per day

function getBindings(): BindingEnv {
  const event = getEvent()
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env ?? {}
}

function getDB(): D1Database | null {
  return getBindings().DB ?? null
}

function getTodayRange(): { start: number; end: number } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  return {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000),
  }
}

/**
 * Check and update rate limit for content generation
 * Returns { allowed, remaining, resetAt, limit }
 */
export async function checkRateLimit(): Promise<RateLimitResult> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) {
    // Allow in development without DB
    console.warn('[RATE_LIMIT] DB not available, skipping limit check')
    return { allowed: true, remaining: DAILY_LIMIT, resetAt: 0, limit: DAILY_LIMIT }
  }

  const userId = auth.user?.sub || auth.user?.email || 'anonymous'
  const { start, end } = getTodayRange()

  // Get current count
  const result = await db
    .prepare(
      `SELECT COUNT(*) as count FROM content_pages
       WHERE created_by = ? AND created_at >= ? AND created_at <= ?`,
    )
    .bind(userId, start, end)
    .first<{ count: number }>()

  const currentCount = result?.count || 0
  const remaining = Math.max(0, DAILY_LIMIT - currentCount)

  if (currentCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: end,
      limit: DAILY_LIMIT,
    }
  }

  return {
    allowed: true,
    remaining: remaining - 1,
    resetAt: end,
    limit: DAILY_LIMIT,
  }
}

/**
 * Log rate limit event for audit
 */
export async function logRateLimitEvent(
  userId: string,
  action: 'check' | 'block' | 'increment',
  details: { pagesGenerated?: number; limit?: number },
): Promise<void> {
  const db = getDB()
  if (!db) return

  const now = Math.floor(Date.now() / 1000)

  await db
    .prepare(
      `INSERT INTO audit_logs (id, event_type, user_id, details, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(crypto.randomUUID(), `rate_limit_${action}`, userId, JSON.stringify(details), now)
    .run()
}

/**
 * Get current rate limit status for a user
 */
export async function getRateLimitStatus(): Promise<{
  currentUsage: number
  dailyLimit: number
  remaining: number
  resetTime: string
}> {
  const db = getDB()
  const auth = await getAuthContext()

  if (!db) {
    return {
      currentUsage: 0,
      dailyLimit: DAILY_LIMIT,
      remaining: DAILY_LIMIT,
      resetTime: new Date(Date.now() + 86400000).toISOString(),
    }
  }

  const userId = auth.user?.sub || auth.user?.email || 'anonymous'
  const { start, end } = getTodayRange()

  const result = await db
    .prepare(
      `SELECT COUNT(*) as count FROM content_pages
       WHERE created_by = ? AND created_at >= ? AND created_at <= ?`,
    )
    .bind(userId, start, end)
    .first<{ count: number }>()

  const currentUsage = result?.count || 0

  return {
    currentUsage,
    dailyLimit: DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - currentUsage),
    resetTime: new Date(end * 1000).toISOString(),
  }
}
