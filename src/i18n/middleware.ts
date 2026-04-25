import type { RequestHandler } from '@builder.io/qwik-city'
import { parseHost } from '../utils/host-parser'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './types'

/**
 * Country to language mapping for CF-IPCountry fallback
 * Maps country codes to preferred languages
 */
const COUNTRY_TO_LANG: Record<string, SupportedLanguage> = {
  // Portuguese
  BR: 'pt',
  PT: 'pt',
  AO: 'pt',
  MZ: 'pt',
  // Spanish
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',
  PR: 'es',
  // Japanese
  JP: 'ja',
  // Chinese
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  SG: 'zh',
  MO: 'zh',
}

/**
 * Parse Accept-Language header and extract preferred language
 * Returns the first matching supported language or null
 */
function parseAcceptLanguage(header: string | null): SupportedLanguage | null {
  if (!header) return null

  // Parse Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7
  const languages = header
    .split(',')
    .map(langEntry => {
      const parts = langEntry.trim().split(';')
      const code = parts[0] ?? ''
      const qValue = parts[1] ?? 'q=1'
      const quality = Number.parseFloat(qValue.split('=')[1] ?? '1')
      return { code: code.trim().toLowerCase(), quality }
    })
    .sort((a, b) => b.quality - a.quality)

  // Try to match supported languages
  for (const { code } of languages) {
    // Exact match: 'en', 'pt', 'es', 'ja', 'zh'
    if (code === 'en' || code === 'pt' || code === 'es' || code === 'ja' || code === 'zh') {
      return code as SupportedLanguage
    }

    // Locale match: 'en-US', 'pt-BR', 'es-ES', 'ja-JP', 'zh-CN'
    const baseLang = code.split('-')[0]
    if (
      baseLang === 'en' ||
      baseLang === 'pt' ||
      baseLang === 'es' ||
      baseLang === 'ja' ||
      baseLang === 'zh'
    ) {
      return baseLang as SupportedLanguage
    }
  }

  return null
}

/**
 * Validate if a string is a supported language code
 */
function isValidLanguage(lang: string | null | undefined): lang is SupportedLanguage {
  return !!lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)
}

/**
 * Language and Niche negotiation middleware
 * Language Priority: URL param > Cookie > Accept-Language > CF-IPCountry > Default (EN)
 * Niche: Extracted from Host header
 *
 * Logs the negotiation result for debugging
 */
export const onLanguageNegotiation: RequestHandler = ({ request, cookie, url, headers }) => {
  // --- Niche Detection ---
  const host = request.headers.get('host')
  const { niche } = parseHost(host)

  // --- Language Negotiation ---
  let negotiatedLang: SupportedLanguage = DEFAULT_LANGUAGE
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
  // 3. Check Accept-Language header
  else {
    const headerLang = parseAcceptLanguage(acceptLanguage)
    if (headerLang) {
      negotiatedLang = headerLang
      negotiationSource = 'accept-language'
    }
    // 4. Check CF-IPCountry header (Cloudflare)
    else if (countryCode) {
      const countryLang = COUNTRY_TO_LANG[countryCode]
      if (countryLang) {
        negotiatedLang = countryLang
        negotiationSource = 'cf-ipcountry'
      }
    }
  }

  // Mandatory Log
  if (import.meta.env.DEV) {
    console.log(`[Middleware] Niche: ${niche}, Language: ${negotiatedLang}`)
    console.log(`[i18n] Language negotiation source: ${negotiationSource}`)
  }

  // Store in headers for downstream use
  headers.set('x-negotiated-lang', negotiatedLang)
  headers.set('x-negotiated-niche', niche)
}

/**
 * Get the negotiated language from response headers
 * Used by route loaders to determine language
 */
export function getNegotiatedLanguage(response: Response): SupportedLanguage {
  const lang = response.headers.get('x-negotiated-lang')
  return lang && isValidLanguage(lang) ? (lang as SupportedLanguage) : DEFAULT_LANGUAGE
}

/**
 * Get the negotiated niche from response headers
 */
export function getNegotiatedNiche(response: Response): string {
  return response.headers.get('x-negotiated-niche') ?? 'apex'
}
