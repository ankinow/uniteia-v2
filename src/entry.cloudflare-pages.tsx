import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages'
import qwikCityPlan from '@qwik-city-plan'
import { manifest } from '@qwik-client-manifest'

// @ts-ignore
import render from './entry.ssr'

const qwikCityHandler = createQwikCity({ render, qwikCityPlan, manifest })

// ── CORS ──────────────────────────────────────────────────────────────────────

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// ── Security headers (injected for custom domains where _headers doesn't apply) ─

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.github.com https://hacker-news.firebaseio.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    // Only set if not already present (respect _headers file when it works)
    if (!headers.has(key)) {
      headers.set(key, value)
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// ── Main handler ──────────────────────────────────────────────────────────────

// biome-ignore lint/suspicious/noExplicitAny: Cloudflare Pages handler signature
export const onRequest = async (request: any, env: any, ctx: any) => {
  const url = new URL(request.url)

  // Handle CORS preflight for API routes (before sitemap / security checks)
  if (url.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    return addSecurityHeaders(corsPreflightResponse())
  }

  // Sitemap per locale: serve the correct sitemap-{locale}.xml based on Host header
  // Uses env.ASSETS to fetch static files directly (bypasses Qwik City routing)
  if (url.pathname === '/sitemap.xml' || url.pathname.startsWith('/sitemap-')) {
    const sitemapResponse = await serveSitemap(url, request, env)
    return addSecurityHeaders(sitemapResponse)
  }

  // 1. Check for null byte
  if (url.pathname.includes('\0') || url.pathname.includes('%00')) {
    return addSecurityHeaders(new Response('Bad Request', { status: 400 }))
  }

  // 2. Check for invalid percent encoding
  try {
    decodeURIComponent(url.pathname)
  } catch {
    return addSecurityHeaders(new Response('Bad Request', { status: 400 }))
  }

  // 3. Check for directory traversal (encoded or decoded)
  const decodedPath = decodeURIComponent(url.pathname)
  if (
    decodedPath.includes('..') ||
    url.pathname.includes('%2e%2e') ||
    url.pathname.includes('%2E%2E')
  ) {
    return addSecurityHeaders(new Response('Forbidden', { status: 403 }))
  }

  // 4. Prevent overly long paths from causing worker crashes
  if (url.pathname.length > 300) {
    return addSecurityHeaders(new Response('Not Found', { status: 404 }))
  }

  try {
    let response = await qwikCityHandler(request, env, ctx)
    // Add CORS headers to all /api/* responses
    if (url.pathname.startsWith('/api/')) {
      response = addCorsHeaders(response)
    }
    // Inject security headers for custom domains where Cloudflare _headers doesn't apply
    response = addSecurityHeaders(response)
    return response
  } catch (err) {
    console.error('Error in Qwik City handler:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

/**
 * Serve the correct sitemap for the requesting domain.
 * e.g., pt.uniteia.com/sitemap.xml → serve sitemap-pt.xml
 * Falls back to sitemap.xml if locale-specific file not found.
 */
async function serveSitemap(url: URL, request: any, env: any): Promise<Response> {
  // Determine target sitemap file
  let sitemapFile = 'sitemap.xml'

  // If requesting sitemap.xml, try locale-specific version
  if (url.pathname === '/sitemap.xml') {
    const host = request.headers.get('host') || ''
    const localeMatch = host.match(/^([a-z]{2})\./)
    if (localeMatch) {
      const localeFile = `sitemap-${localeMatch[1]}.xml`
      // Try locale-specific first, fall back to default
      sitemapFile = localeFile
    }
  } else {
    // Direct request for sitemap-{locale}.xml
    sitemapFile = url.pathname.slice(1) // remove leading /
  }

  try {
    // Fetch from static assets (Cloudflare Pages built-in)
    const assetUrl = new URL(`/${sitemapFile}`, url.origin)
    const response = await env.ASSETS.fetch(assetUrl, request)
    if (response.status === 200) {
      const headers = new Headers(response.headers)
      headers.set('content-type', 'application/xml; charset=utf-8')
      headers.set('cache-control', 'public, max-age=0, must-revalidate, s-maxage=3600')
      return new Response(response.body, { status: 200, headers })
    }
  } catch {
    // Fall through to default
  }

  // Fallback: serve default sitemap.xml
  try {
    const fallbackUrl = new URL('/sitemap.xml', url.origin)
    const response = await env.ASSETS.fetch(fallbackUrl, request)
    if (response.status === 200) {
      const headers = new Headers(response.headers)
      headers.set('content-type', 'application/xml; charset=utf-8')
      headers.set('cache-control', 'public, max-age=0, must-revalidate, s-maxage=3600')
      return new Response(response.body, { status: 200, headers })
    }
  } catch {
    // ignore
  }

  return new Response('Sitemap not found', { status: 404 })
}

export const fetch = onRequest
