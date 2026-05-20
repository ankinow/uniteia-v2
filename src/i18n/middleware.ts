import type { RequestHandler } from '@builder.io/qwik-city'
import {
  DEFAULT_LOCALE,
  EDGE_HEADERS,
  LANGUAGE_COOKIE_NAME,
  LOCALE_CODES,
  type SupportedLocale,
} from '../edge/contract.v1'
import { parseAcceptLanguage } from '../edge/parse-accept-language'
import { parseHost } from '../utils/host-parser'
import { countryToLang } from './geo-map'

const LOCALE_SET = new Set<SupportedLocale>(LOCALE_CODES)

/**
 * Validate if a string is a supported language code
 */
function isValidLanguage(lang: string | null | undefined): lang is SupportedLocale {
  return lang != null && LOCALE_SET.has(lang as SupportedLocale)
}

/**
 * Language and Niche negotiation middleware.
 *
 * UniTeia language model:
 * - No fixed language. Content is structurally equivalent across all 8 locales.
 * - Primary experience: cookie-driven (uniteia_lang).
 * - URL path (/{lang}/...) = override for deep links and SEO.
 * - 8-locale symmetry = publication gate (isPublic()), not runtime selection.
 *
 * Priority chain:
 *   1. URL path segment (deep link / shared URL — strongest override)
 *   2. Cookie (uniteia_lang — user's primary experience)
 *   3. CF-IPCountry (Cloudflare geo header)
 *   4. Accept-Language (browser preference)
 *   5. Default: en
 *
 * Logs the negotiation result for debugging (DEV only).
 */
export const onLanguageNegotiation: RequestHandler = ({ request, cookie, url, headers }) => {
  // --- Niche Detection ---
  const host = request.headers.get('host')
  const { niche } = parseHost(host)

  // --- Language Negotiation ---
  let negotiatedLang: SupportedLocale = DEFAULT_LOCALE
  let negotiationSource = 'default'

  const pathSegments = url.pathname.split('/').filter(Boolean)
  const pathLang = pathSegments[0]
  const cookieLang = cookie.get(LANGUAGE_COOKIE_NAME)?.value
  const acceptLanguage = request.headers.get('accept-language')
  const countryCode = request.headers.get('cf-ipcountry')

  // 1. Check explicit URL path segment (highest priority)
  if (isValidLanguage(pathLang)) {
    negotiatedLang = pathLang
    negotiationSource = 'url'
  }
  // 2. Check cookie
  else if (isValidLanguage(cookieLang)) {
    negotiatedLang = cookieLang
    negotiationSource = 'cookie'
  }
  // 3. Check CF-IPCountry header (Cloudflare)
  else if (countryCode) {
    negotiatedLang = countryToLang(countryCode)
    negotiationSource = 'cf-ipcountry'
  }
  // 4. Check Accept-Language header
  else {
    const headerLang = parseAcceptLanguage(acceptLanguage)
    if (headerLang) {
      negotiatedLang = headerLang
      negotiationSource = 'accept-language'
    }
  }

  // Mandatory Log
  if (import.meta.env.DEV) {
    console.log(`[Middleware] Niche: ${niche}, Language: ${negotiatedLang}`)
    console.log(`[i18n] Language negotiation source: ${negotiationSource}`)
  }

  // Store in headers for downstream use
  headers.set(EDGE_HEADERS.negotiatedLang, negotiatedLang)
  headers.set(EDGE_HEADERS.negotiatedNiche, niche)
}

/**
 * Get the negotiated language from response headers
 * Used by route loaders to determine language
 */
export function getNegotiatedLanguage(response: Response): SupportedLocale {
  const lang = response.headers.get('x-negotiated-lang')
  return lang && isValidLanguage(lang) ? (lang as SupportedLocale) : DEFAULT_LOCALE
}

/**
 * Get the negotiated niche from response headers
 */
export function getNegotiatedNiche(response: Response): string {
  return response.headers.get('x-negotiated-niche') ?? 'apex'
}
