/**
 * Edge Middleware — Thin Orchestrator (Contract v1)
 *
 * Responsibilities:
 * 1. Locale negotiation → redirect or forward with x-negotiated-lang header
 * 2. Locale validation → 404 for invalid locales
 * 3. Security headers → applied via security-policy.v1.ts
 *
 * Does NOT duplicate: locale codes, security header values, Accept-Language parsing.
 * All sourced from src/edge/contract.v1.ts and src/edge/security-policy.v1.ts.
 *
 * Contract version: v1 (2026-05-20)
 */

import type { PagesFunction } from '@cloudflare/workers-types'
import {
  DEFAULT_LOCALE,
  EDGE_HEADERS,
  LANGUAGE_COOKIE_NAME,
  LOCALE_CODES,
  localeRedirect,
} from '../src/edge/contract.v1'
import { parseAcceptLanguage } from '../src/edge/parse-accept-language'
import { applySecurityHeaders } from '../src/edge/security-policy.v1'
import { countryToLang } from '../src/i18n/geo-map'
import { validateLocalePath } from '../src/i18n/locale-validation'

const LOCALE_SET = new Set(LOCALE_CODES)

type Env = Record<string, never>

function parseCookie(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) return null
  for (const cookie of cookieHeader.split(';')) {
    const [name, value] = cookie.trim().split('=')
    if (name === key) return value
  }
  return null
}

function negotiateLocale(
  cookieLang: string | null,
  acceptLanguage: string | null,
  countryCode: string | null
): string {
  if (cookieLang && LOCALE_SET.has(cookieLang)) return cookieLang
  if (countryCode) return countryToLang(countryCode)
  const headerLang = parseAcceptLanguage(acceptLanguage)
  if (headerLang) return headerLang
  return DEFAULT_LOCALE
}

function isMissingLocale(pathname: string): boolean {
  if (pathname === '/' || pathname === '') return true
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return true
  return !LOCALE_SET.has(segments[0] as string)
}

export const onRequest: PagesFunction<Env> = async context => {
  const { request } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  // ── Root / no-locale → redirect to negotiated locale ──
  if (isMissingLocale(pathname)) {
    const cookieLang = parseCookie(request.headers.get('Cookie'), LANGUAGE_COOKIE_NAME)
    const acceptLanguage = request.headers.get('Accept-Language')
    const countryCode = request.headers.get('CF-IPCountry')
    const locale = negotiateLocale(cookieLang, acceptLanguage, countryCode)

    return localeRedirect(pathname, locale as typeof DEFAULT_LOCALE, url.search)
  }

  // ── Validate locale from first path segment ──
  const { locale, isValid, originalSegment } = validateLocalePath(pathname)

  if (!isValid && originalSegment) {
    return new Response('Not Found - Invalid locale', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        [EDGE_HEADERS.negotiatedLang]: 'none',
        [EDGE_HEADERS.localeValid]: 'false',
      },
    })
  }

  // ── Forward to Qwik City with edge context headers ──
  const modifiedRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      [EDGE_HEADERS.negotiatedLang]: locale ?? 'none',
      [EDGE_HEADERS.localeValid]: 'true',
    },
  })

  const response = await context.next(modifiedRequest)

  // ── Apply security headers (single source: security-policy.v1.ts) ──
  applySecurityHeaders(response)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}

export default onRequest
