/**
 * Edge Context Contract v1
 *
 * Single source of truth for locale codes, edge context types, and version.
 * Consumed by: functions/[[route]].ts, i18n/*, utils/niche-locale-redirect.ts
 *
 * Contract version: v1 (2026-05-20)
 * Breaking changes increment minor version.
 */

// ── Locale Codes (Single Source) ──────────────────────────────────────

export const LOCALE_CODES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

export type SupportedLocale = (typeof LOCALE_CODES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LANGUAGE_COOKIE_NAME = 'uniteia_lang'

// ── Edge Context Headers ──────────────────────────────────────────────

/** Headers injected by the edge into the forwarded request. */
export const EDGE_HEADERS = {
  negotiatedLang: 'x-negotiated-lang',
  localeValid: 'x-locale-valid',
  negotiatedNiche: 'x-negotiated-niche',
} as const

// ── Edge Context Type ─────────────────────────────────────────────────

/**
 * The context the edge passes to Qwik City.
 * Qwik reads this from request headers — no duplicate negotiation logic.
 */
export interface EdgeContext {
  locale: SupportedLocale | null
  localeValid: boolean
  niche: string
}

/**
 * Parse EdgeContext from request headers.
 * The edge is the authoritative source — Qwik trusts these headers.
 */
export function parseEdgeContext(request: Request): EdgeContext {
  const localeStr = request.headers.get(EDGE_HEADERS.negotiatedLang)
  const validStr = request.headers.get(EDGE_HEADERS.localeValid)
  const nicheStr = request.headers.get(EDGE_HEADERS.negotiatedNiche)

  return {
    locale: (localeStr as SupportedLocale | null) ?? null,
    localeValid: validStr === 'true',
    niche: nicheStr ?? 'apex',
  }
}

// ── Redirect Helpers ──────────────────────────────────────────────────

export function localeRedirect(
  pathname: string,
  locale: SupportedLocale,
  search: string
): Response {
  const targetPath = pathname.startsWith('/n')
    ? pathname === '/n' || pathname === '/n/'
      ? `/${locale}/n`
      : `/${locale}${pathname}`
    : pathname === '/' || pathname === ''
      ? `/${locale}/`
      : `/${locale}${pathname}`

  return new Response(null, {
    status: 302,
    headers: {
      Location: targetPath + search,
      Vary: 'Accept-Language, Cookie',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${LANGUAGE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`,
    },
  })
}
