import type { PagesFunction } from '@cloudflare/workers-types'
import { validateLocalePath } from '../src/i18n/locale-validation'
import { buildNicheLocaleRedirectPath } from '../src/utils/niche-locale-redirect'

function parseCookie(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === key) {
      return value
    }
  }
  return null
}

const SUPPORTED_LOCALE_CODES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']
const DEFAULT_LOCALE = 'en'

function negotiateLocale(cookieLang: string | null, acceptLanguage: string | null): string {
  // 1. Cookie (primary experience)
  if (cookieLang && SUPPORTED_LOCALE_CODES.includes(cookieLang)) {
    return cookieLang
  }
  // 2. Accept-Language header
  if (acceptLanguage) {
    for (const code of SUPPORTED_LOCALE_CODES) {
      if (acceptLanguage.toLowerCase().includes(code)) {
        return code
      }
    }
  }
  // 3. Default
  return DEFAULT_LOCALE
}

// Extend the Environment type for Cloudflare Pages
type Env = Record<string, never> // Cloudflare Pages environment - no custom bindings needed

function isMissingLocaleNichePath(pathname: string): boolean {
  return pathname === '/n' || pathname === '/n/' || pathname.startsWith('/n/')
}

/**
 * Check if a path has no locale prefix (root path or non-locale path).
 * Paths like /, /about, /n, /n/ai-agents — anything not starting with /xx/
 */
function isMissingLocale(pathname: string): boolean {
  if (pathname === '/' || pathname === '') return true
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return true
  const first = segments[0] as string
  return !SUPPORTED_LOCALE_CODES.includes(first)
}

export const onRequest: PagesFunction<Env> = async context => {
  const { request } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  // Root / no-locale paths — redirect to negotiated locale.
  // Cookie > Accept-Language > en (default).
  if (isMissingLocale(pathname)) {
    const cookieLang = parseCookie(request.headers.get('Cookie'), 'uniteia_lang')
    const acceptLanguage = request.headers.get('Accept-Language')
    const locale = negotiateLocale(cookieLang, acceptLanguage)

    // Build target path: /{locale}/{rest}
    let targetPath: string
    if (pathname === '/' || pathname === '') {
      targetPath = `/${locale}/`
    } else if (pathname.startsWith('/n')) {
      // Niche paths: /n → /{locale}/n, /n/ai-agents → /{locale}/n/ai-agents
      const nicheRest = pathname === '/n' || pathname === '/n/' ? '/n' : pathname
      targetPath = `/${locale}${nicheRest}`
    } else {
      targetPath = `/${locale}${pathname}`
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: targetPath + url.search,
        Vary: 'Accept-Language, Cookie',
        'Set-Cookie': `uniteia_lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`,
      },
    })
  }

  // Niche paths without locale — handled but now should be unreachable
  // (the isMissingLocale check above catches these earlier)
  if (isMissingLocaleNichePath(pathname)) {
    const cookieLang = parseCookie(request.headers.get('Cookie'), 'uniteia_lang')
    const location = buildNicheLocaleRedirectPath(
      pathname,
      url.search,
      request.headers.get('Accept-Language'),
      request.headers.get('CF-IPCountry'),
      cookieLang
    )

    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
        Vary: 'Accept-Language, CF-IPCountry, Cookie',
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
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; worker-src 'self'"
  )

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default onRequest
