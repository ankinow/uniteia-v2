/**
 * Auth Middleware Test Suite
 * SOTA 2026: Tests for CF Access JWT verification with dev bypass
 */

import { beforeEach, describe, expect, mock, test } from 'bun:test'

// =============================================================================
// Mock Setup
// =============================================================================

const mockEvent = {
  context: {
    cloudflare: {
      env: {
        CF_ACCESS_TEAM_NAME: 'test-team',
        CF_ACCESS_AUD: 'test-audience-id',
        ADMIN_EMAILS: 'admin@test.com,boss@test.com',
        ENVIRONMENT: 'production',
      },
    },
  },
  node: {
    req: {
      headers: {
        'cf-connecting-ip': '1.2.3.4',
        'cf-access-jwt-assertion': '',
        authorization: '',
      } as Record<string, string>,
    },
  },
}

mock.module('vinxi/http', () => ({
  getEvent: () => mockEvent,
}))

// Mock jose
const mockJwtVerify = mock(() =>
  Promise.resolve({
    payload: {
      sub: 'user-123',
      email: 'admin@test.com',
      groups: ['admin'],
    },
  }),
)

mock.module('jose', () => ({
  jwtVerify: mockJwtVerify,
  createRemoteJWKSet: mock(() => ({})),
}))

const { getAuthContext, requireAuth, requireAdmin } = await import('../auth-middleware')

// =============================================================================
// TESTS
// =============================================================================

describe('Auth Middleware', () => {
  beforeEach(() => {
    // Reset to production defaults
    mockEvent.context.cloudflare.env.ENVIRONMENT = 'production'
    mockEvent.context.cloudflare.env.CF_ACCESS_TEAM_NAME = 'test-team'
    mockEvent.context.cloudflare.env.CF_ACCESS_AUD = 'test-audience-id'
    mockEvent.context.cloudflare.env.ADMIN_EMAILS = 'admin@test.com'
    mockEvent.node.req.headers = {
      'cf-connecting-ip': '1.2.3.4',
      'cf-access-jwt-assertion': '',
      authorization: '',
    }

    mockJwtVerify.mockImplementation(() =>
      Promise.resolve({
        payload: {
          sub: 'user-123',
          email: 'admin@test.com',
          groups: ['admin'],
        },
      }),
    )
  })

  // ---------------------------------------------------------------------------
  // Development Mode
  // ---------------------------------------------------------------------------

  describe('development mode', () => {
    test('bypasses auth in development environment', async () => {
      mockEvent.context.cloudflare.env.ENVIRONMENT = 'development'

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(true)
      expect(auth.isAdmin).toBe(true)
      expect(auth.isLocal).toBe(true)
      expect(auth.user?.email).toBe('dev@localhost')
    })

    test('bypasses auth when no cf-connecting-ip (local)', async () => {
      ;(mockEvent.node.req.headers as Record<string, string | undefined>)['cf-connecting-ip'] =
        undefined

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(true)
      expect(auth.isLocal).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Production Mode - No Token
  // ---------------------------------------------------------------------------

  describe('production mode - no token', () => {
    test('returns unauthenticated when no JWT token', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(false)
      expect(auth.isAdmin).toBe(false)
      expect(auth.isLocal).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // Production Mode - Missing Config
  // ---------------------------------------------------------------------------

  describe('production mode - missing config', () => {
    test('rejects when CF_ACCESS_TEAM_NAME not set', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'some-jwt-token'
      mockEvent.context.cloudflare.env.CF_ACCESS_TEAM_NAME = ''

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(false)
    })

    test('rejects when CF_ACCESS_AUD not set', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'some-jwt-token'
      mockEvent.context.cloudflare.env.CF_ACCESS_AUD = ''

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // Production Mode - Valid JWT
  // ---------------------------------------------------------------------------

  describe('production mode - valid JWT', () => {
    test('authenticates with valid CF Access JWT', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(true)
      expect(auth.user?.email).toBe('admin@test.com')
      expect(auth.user?.sub).toBe('user-123')
    })

    test('recognizes admin by email', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'
      mockEvent.context.cloudflare.env.ADMIN_EMAILS = 'admin@test.com'

      const auth = await getAuthContext()
      expect(auth.isAdmin).toBe(true)
    })

    test('non-admin user is not admin', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'
      mockEvent.context.cloudflare.env.ADMIN_EMAILS = 'other@test.com'

      mockJwtVerify.mockImplementation(() =>
        Promise.resolve({
          payload: {
            sub: 'user-456',
            email: 'regular@test.com',
            groups: [],
          },
        }),
      )

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(true)
      expect(auth.isAdmin).toBe(false)
    })

    test('all users are admin when ADMIN_EMAILS not configured', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'
      mockEvent.context.cloudflare.env.ADMIN_EMAILS = ''

      const auth = await getAuthContext()
      expect(auth.isAdmin).toBe(true) // empty admin emails = all authenticated are admin
    })

    test('uses Bearer token from Authorization header as fallback', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = 'Bearer fallback-jwt-token'

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Production Mode - Invalid JWT
  // ---------------------------------------------------------------------------

  describe('production mode - invalid JWT', () => {
    test('returns unauthenticated on JWT verification failure', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'invalid-jwt'
      mockJwtVerify.mockImplementation(() => {
        throw new Error('JWT verification failed')
      })

      const auth = await getAuthContext()
      expect(auth.isAuthenticated).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // requireAuth / requireAdmin
  // ---------------------------------------------------------------------------

  describe('requireAuth', () => {
    test('returns auth context when authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'
      mockJwtVerify.mockImplementation(() =>
        Promise.resolve({
          payload: { sub: 'user-123', email: 'admin@test.com', groups: [] },
        }),
      )

      const auth = await requireAuth()
      expect(auth.isAuthenticated).toBe(true)
    })

    test('throws when not authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(requireAuth()).rejects.toThrow('Authentication required')
    })
  })

  describe('requireAdmin', () => {
    test('returns auth context when admin', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'

      const auth = await requireAdmin()
      expect(auth.isAdmin).toBe(true)
    })

    test('throws when not admin', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt-token'
      mockEvent.context.cloudflare.env.ADMIN_EMAILS = 'boss@test.com'

      mockJwtVerify.mockImplementation(() =>
        Promise.resolve({
          payload: { sub: 'user-456', email: 'regular@test.com', groups: [] },
        }),
      )

      await expect(requireAdmin()).rejects.toThrow('Admin access required')
    })
  })
})
