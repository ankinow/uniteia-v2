import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages'
import qwikCityPlan from '@qwik-city-plan'
import { manifest } from '@qwik-client-manifest'

// @ts-ignore
import render from './entry.ssr'

const qwikCityHandler = createQwikCity({ render, qwikCityPlan, manifest })

export const onRequest = async (request: any, env: any, ctx: any) => {
  const url = new URL(request.url)

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

export const fetch = onRequest
