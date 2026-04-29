import type { PagesFunction } from '@cloudflare/workers-types'
import { validateLocalePath } from '../src/i18n/locale-validation'
import { buildNicheLocaleRedirectPath } from '../src/utils/niche-locale-redirect'

// Extend the Environment type for Cloudflare Pages
type Env = Record<string, never> // Cloudflare Pages environment - no custom bindings needed

function isMissingLocaleNichePath(pathname: string): boolean {
  return pathname === '/n' || pathname === '/n/' || pathname.startsWith('/n/')
}

export const onRequest: PagesFunction<Env> = async context => {
  const { request } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  // Explicitly handle trailing slash for /n/ and /n/tail to avoid multi-hop
  // Cloudflare Pages normally 301s /n/ to /n. We intercept here to do it in 1 hop.
  if (isMissingLocaleNichePath(pathname)) {
    const location = buildNicheLocaleRedirectPath(
      pathname,
      url.search,
      request.headers.get('Accept-Language')
    )

    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
        Vary: 'Accept-Language',
      },
    })
  }

  // Validate the locale from the first path segment
  const { locale, isValid, originalSegment } = validateLocalePath(pathname)

  // Return 404 for invalid locales immediately at the edge
  if (!isValid && originalSegment) {
    return new Response('Not Found - Invalid locale', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'x-negotiated-lang': 'none',
        'x-locale-valid': 'false',
      },
    })
  }

  // Pass through to Qwik City handling for valid requests
  // Clone the request with additional headers
  const modifiedRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      'x-negotiated-lang': locale || 'none',
      'x-locale-valid': 'true',
    },
  })

  // Let the request continue to Qwik City
  // Note: Cloudflare Pages will handle this via the adapter
  const response = await context.next(modifiedRequest)

  // Add security headers to the final response
  const headers = new Headers(response.headers)
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  )
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  )

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default onRequest
