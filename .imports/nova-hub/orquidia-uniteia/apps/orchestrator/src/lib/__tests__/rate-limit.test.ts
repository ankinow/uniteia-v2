/**
 * Rate Limiting Test Suite
 * SOTA 2026: Tests for D1-based content generation rate limiting (50 pages/day)
 */

import { beforeEach, describe, expect, mock, test } from 'bun:test'

// =============================================================================
// Mock Setup
// =============================================================================

const mockDbFirst = mock(() => Promise.resolve({ count: 0 }))
const mockDbRun = mock(() => Promise.resolve({ success: true }))

const mockDb = {
  prepare: mock(() => ({
    bind: mock((..._args: unknown[]) => ({
      first: mockDbFirst,
      run: mockDbRun,
    })),
  })),
}

const mockEvent = {
  context: {
    cloudflare: {
      env: {
        DB: mockDb as unknown as D1Database,
        ENVIRONMENT: 'production',
        CF_ACCESS_TEAM_NAME: 'test-team',
        CF_ACCESS_AUD: 'test-aud',
        ADMIN_EMAILS: 'admin@test.com',
      },
    },
  },
  node: {
    req: {
      headers: {
        'cf-connecting-ip': '1.2.3.4',
        'cf-access-jwt-assertion': 'valid-jwt',
      } as Record<string, string>,
    },
  },
}

mock.module('vinxi/http', () => ({
  getEvent: () => mockEvent,
}))

// Mock jose for auth-middleware dependency
mock.module('jose', () => ({
  jwtVerify: mock(() =>
    Promise.resolve({
      payload: {
        sub: 'user-123',
        email: 'admin@test.com',
        groups: ['admin'],
      },
    }),
  ),
  createRemoteJWKSet: mock(() => ({})),
}))

const { checkRateLimit, logRateLimitEvent, getRateLimitStatus } = await import('../rate-limit')

// =============================================================================
// TESTS
// =============================================================================

describe('Rate Limiting', () => {
  beforeEach(() => {
    mockDbFirst.mockReset()
    mockDbFirst.mockImplementation(() => Promise.resolve({ count: 0 }))
    mockDbRun.mockReset()
    mockDbRun.mockImplementation(() => Promise.resolve({ success: true }))
    mockDb.prepare.mockClear()

    // Reset env to have DB
    mockEvent.context.cloudflare.env.DB = mockDb as unknown as D1Database
    mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt'
  })

  // ---------------------------------------------------------------------------
  // checkRateLimit
  // ---------------------------------------------------------------------------

  describe('checkRateLimit', () => {
    test('allows when no DB is available (dev mode)', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      const result = await checkRateLimit()
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(50)
      expect(result.limit).toBe(50)
    })

    test('allows when under daily limit', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 10 }))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(39) // 50 - 10 - 1 (current request)
      expect(result.limit).toBe(50)
      expect(result.resetAt).toBeGreaterThan(0)
    })

    test('allows when count is zero', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 0 }))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(49) // 50 - 0 - 1
    })

    test('blocks when at daily limit', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 50 }))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.limit).toBe(50)
    })

    test('blocks when over daily limit', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 100 }))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    test('allows at count 49 (one remaining)', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 49 }))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(0) // 50 - 49 - 1 = 0
    })

    test('handles null count result', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve(null))

      const result = await checkRateLimit()
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(49) // treats null as 0
    })
  })

  // ---------------------------------------------------------------------------
  // logRateLimitEvent
  // ---------------------------------------------------------------------------

  describe('logRateLimitEvent', () => {
    test('logs event to audit_logs table', async () => {
      await logRateLimitEvent('user-123', 'check', { pagesGenerated: 5, limit: 50 })

      expect(mockDb.prepare).toHaveBeenCalled()
    })

    test('silently skips when no DB', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      // Should not throw
      await logRateLimitEvent('user-123', 'block', { pagesGenerated: 50, limit: 50 })
    })

    test('logs increment action', async () => {
      await logRateLimitEvent('user-456', 'increment', { pagesGenerated: 10 })
      expect(mockDb.prepare).toHaveBeenCalled()
    })
  })

  // ---------------------------------------------------------------------------
  // getRateLimitStatus
  // ---------------------------------------------------------------------------

  describe('getRateLimitStatus', () => {
    test('returns full capacity when no DB', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      const status = await getRateLimitStatus()
      expect(status.currentUsage).toBe(0)
      expect(status.dailyLimit).toBe(50)
      expect(status.remaining).toBe(50)
      expect(status.resetTime).toBeTruthy()
    })

    test('returns correct usage stats with DB', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 15 }))

      const status = await getRateLimitStatus()
      expect(status.currentUsage).toBe(15)
      expect(status.dailyLimit).toBe(50)
      expect(status.remaining).toBe(35)
      expect(status.resetTime).toBeTruthy()
      // resetTime should be a valid ISO string
      expect(new Date(status.resetTime).toISOString()).toBe(status.resetTime)
    })

    test('returns zero remaining at limit', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 50 }))

      const status = await getRateLimitStatus()
      expect(status.currentUsage).toBe(50)
      expect(status.remaining).toBe(0)
    })

    test('remaining never goes negative', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve({ count: 75 }))

      const status = await getRateLimitStatus()
      expect(status.remaining).toBe(0) // Math.max(0, ...) ensures this
    })

    test('handles null count result', async () => {
      mockDbFirst.mockImplementation(() => Promise.resolve(null))

      const status = await getRateLimitStatus()
      expect(status.currentUsage).toBe(0)
      expect(status.remaining).toBe(50)
    })
  })
})
