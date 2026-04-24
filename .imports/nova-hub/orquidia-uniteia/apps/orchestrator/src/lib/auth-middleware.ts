/**
 * Authentication Middleware - SOTA 2026
 * Cloudflare Access JWT verification with ADMIN_TOKEN fallback
 *
 * Production: Validates CF Access JWT via JWKS endpoint
 * Fallback: ADMIN_TOKEN secret for simple API key auth
 * Development: Auth bypassed with warning banner
 */

import { createRemoteJWKSet, jwtVerify } from 'jose'
import { getEvent } from 'vinxi/http'

export interface AuthUser {
  sub: string
  email: string
  groups?: string[]
}

export interface AuthContext {
  isAuthenticated: boolean
  isAdmin: boolean
  user?: AuthUser
  isLocal: boolean
}

interface BindingEnv {
  CF_ACCESS_TEAM_NAME?: string
  CF_ACCESS_AUD?: string
  ADMIN_EMAILS?: string
  ADMIN_TOKEN?: string
  ENVIRONMENT?: string
}

function getBindings(): BindingEnv {
  const event = getEvent()
  return (event.context as { cloudflare?: { env?: BindingEnv } }).cloudflare?.env ?? {}
}

/**
 * Parse comma-separated admin emails from env
 */
function getAdminEmails(env: BindingEnv): Set<string> {
  const raw = env.ADMIN_EMAILS || ''
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )
}

/**
 * Verify Cloudflare Access JWT token
 * Uses CF's JWKS endpoint for key rotation support
 */
async function verifyCFAccessJWT(
  token: string,
  teamName: string,
  aud: string,
): Promise<{ email: string; sub: string; groups?: string[] } | null> {
  try {
    const jwksUrl = new URL(`https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`)
    const JWKS = createRemoteJWKSet(jwksUrl)

    const { payload } = await jwtVerify(token, JWKS, {
      audience: aud,
      issuer: `https://${teamName}.cloudflareaccess.com`,
    })

    return {
      email: (payload.email as string) || '',
      sub: payload.sub || '',
      groups: (payload.groups as string[]) || [],
    }
  } catch (error) {
    console.error('[AUTH] JWT verification failed:', error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Verify ADMIN_TOKEN simple API key
 */
function verifyAdminToken(token: string, adminToken?: string): boolean {
  if (!adminToken || !token) return false
  return token === adminToken
}

export async function getAuthContext(): Promise<AuthContext> {
  const event = getEvent()
  const env = getBindings()
  const headers = event.node?.req?.headers || {}
  const jwtToken = String(headers['cf-access-jwt-assertion'] || '')
  const authHeader = String(headers.authorization || '')
  const adminTokenHeader = authHeader.replace('Bearer ', '')

  // Detect local development
  const isLocal = env.ENVIRONMENT === 'development' || !headers['cf-connecting-ip']

  if (isLocal) {
    console.log('[AUTH-LOCAL] Development mode - bypassing auth')
    return {
      isAuthenticated: true,
      isAdmin: true,
      user: {
        sub: 'local-dev',
        email: 'dev@localhost',
        groups: ['admin'],
      },
      isLocal: true,
    }
  }

  // Check for ADMIN_TOKEN first (simple API key fallback)
  const adminToken = env.ADMIN_TOKEN
  if (adminToken && verifyAdminToken(adminTokenHeader, adminToken)) {
    console.log('[AUTH] ADMIN_TOKEN validated - admin access granted')
    return {
      isAuthenticated: true,
      isAdmin: true,
      user: {
        sub: 'admin-token',
        email: 'admin@local',
        groups: ['admin'],
      },
      isLocal: false,
    }
  }

  // Production: Require CF Access JWT
  const token = jwtToken || adminTokenHeader

  if (!token) {
    console.log('[AUTH] No JWT token - unauthenticated request')
    return { isAuthenticated: false, isAdmin: false, isLocal: false }
  }

  // Verify JWT with CF Access JWKS
  const teamName = env.CF_ACCESS_TEAM_NAME
  const aud = env.CF_ACCESS_AUD

  if (!teamName || !aud) {
    // If CF Access not configured but ADMIN_TOKEN exists, reject
    if (adminToken) {
      console.log('[AUTH] No valid token - unauthenticated')
      return { isAuthenticated: false, isAdmin: false, isLocal: false }
    }
    console.warn('[AUTH] CF_ACCESS_TEAM_NAME or CF_ACCESS_AUD not configured - rejecting')
    return { isAuthenticated: false, isAdmin: false, isLocal: false }
  }

  const verified = await verifyCFAccessJWT(token, teamName, aud)

  if (!verified) {
    console.log('[AUTH] JWT verification failed - unauthenticated')
    return { isAuthenticated: false, isAdmin: false, isLocal: false }
  }

  // Check admin status
  const adminEmails = getAdminEmails(env)
  const isAdmin =
    adminEmails.size === 0 || // If no admin emails configured, all authenticated users are admin
    adminEmails.has(verified.email.toLowerCase()) ||
    (verified.groups || []).includes('admin')

  return {
    isAuthenticated: true,
    isAdmin,
    user: {
      sub: verified.sub,
      email: verified.email,
      groups: verified.groups,
    },
    isLocal: false,
  }
}

export async function requireAuth(): Promise<AuthContext> {
  const auth = await getAuthContext()
  if (!auth.isAuthenticated) {
    throw new Error('Authentication required')
  }
  return auth
}

export async function requireAdmin(): Promise<AuthContext> {
  const auth = await requireAuth()
  if (!auth.isAdmin) {
    throw new Error('Admin access required')
  }
  return auth
}
