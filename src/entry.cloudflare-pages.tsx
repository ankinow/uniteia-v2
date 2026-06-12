import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages'
import qwikCityPlan from '@qwik-city-plan'
import { manifest } from '@qwik-client-manifest'

// @ts-ignore
import render from './entry.ssr'

const qwikCityHandler = createQwikCity({ render, qwikCityPlan, manifest })

// biome-ignore lint/suspicious/noExplicitAny: Cloudflare Pages handler signature
export const onRequest = async (request: any, env: any, ctx: any) => {
  const url = new URL(request.url)

  // Sitemap per locale: serve the correct sitemap-{locale}.xml based on Host header
  // Uses env.ASSETS to fetch static files directly (bypasses Qwik City routing)
  if (url.pathname === '/sitemap.xml' || url.pathname.startsWith('/sitemap-')) {
    return serveSitemap(url, request, env)
  }

  // 1. Check for null byte
  if (url.pathname.includes('\0') || url.pathname.includes('%00')) {
    return new Response('Bad Request', { status: 400 })
  }

  // 2. Check for invalid percent encoding
  try {
    decodeURIComponent(url.pathname)
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  // 3. Check for directory traversal (encoded or decoded)
  const decodedPath = decodeURIComponent(url.pathname)
  if (
    decodedPath.includes('..') ||
    url.pathname.includes('%2e%2e') ||
    url.pathname.includes('%2E%2E')
  ) {
    return new Response('Forbidden', { status: 403 })
  }

  // 4. Prevent overly long paths from causing worker crashes
  if (url.pathname.length > 300) {
    return new Response('Not Found', { status: 404 })
  }

  try {
    return await qwikCityHandler(request, env, ctx)
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
