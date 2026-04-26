import { afterEach, describe, expect, it, vi } from 'vitest'
import { LANGUAGE_COOKIE_NAME } from '~/i18n/types'
import { onLanguageNegotiation } from './middleware'

type NegotiationInput = {
  host?: string | null
  lang?: string | null
  cookieLang?: string | null
  acceptLanguage?: string | null
  cfIpCountry?: string | null
}

type NegotiationResult = {
  headers: Headers
  cookieWrites: Array<{ name: string; value: string; options?: Record<string, unknown> }>
}

function runNegotiation({
  host = 'uniteia.com',
  lang = null,
  cookieLang = null,
  acceptLanguage = null,
  cfIpCountry = null,
}: NegotiationInput = {}): NegotiationResult {
  const requestHeaders = new Headers()
  if (host !== null) {
    requestHeaders.set('host', host)
  }
  if (acceptLanguage !== null) {
    requestHeaders.set('accept-language', acceptLanguage)
  }
  if (cfIpCountry !== null) {
    requestHeaders.set('cf-ipcountry', cfIpCountry)
  }

  const responseHeaders = new Headers()
  const cookieStore = new Map<string, string>()
  if (cookieLang !== null) {
    cookieStore.set(LANGUAGE_COOKIE_NAME, cookieLang)
  }

  const cookieWrites: NegotiationResult['cookieWrites'] = []

  const url = new URL(`https://${host ?? 'uniteia.com'}/${lang === null ? '' : `${lang}/`}`)

  const request = { headers: requestHeaders } as Request

  onLanguageNegotiation({
    request,
    cookie: {
      get: (name: string) => {
        const value = cookieStore.get(name)
        return value ? { value } : undefined
      },
      set: (name: string, value: string, options?: Record<string, unknown>) => {
        cookieWrites.push({ name, value, ...(options ? { options } : {}) })
      },
    },
    url,
    headers: responseHeaders,
  } as never)

  return { headers: responseHeaders, cookieWrites }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('onLanguageNegotiation', () => {
  it('sets negotiated headers directly on the response headers at the url boundary', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const { headers } = runNegotiation({
      host: 'singularity.uniteia.com:443',
      lang: 'pt',
      cookieLang: 'en',
      acceptLanguage: 'ja-JP,pt-BR;q=0.8',
      cfIpCountry: 'CN',
    })
    expect(headers.get('x-negotiated-lang')).toBe('pt')
    expect(headers.get('x-negotiated-niche')).toBe('singularity')
    expect(logSpy).toHaveBeenCalled()
  })

  it('falls through from an unsupported cookie to accept-language before the country fallback', () => {
    const { headers } = runNegotiation({
      host: 'uniteia.com',
      cookieLang: 'fr',
      acceptLanguage: 'es-ES, en;q=0.9',
      cfIpCountry: 'JP',
    })
    expect(headers.get('x-negotiated-lang')).toBe('es')
    expect(headers.get('x-negotiated-niche')).toBe('apex')
  })

  it('falls through from malformed accept-language to cf-ipcountry', () => {
    const { headers } = runNegotiation({
      host: 'dev.uniteia.local:3000',
      acceptLanguage: 'malformed;q=bogus,xx',
      cfIpCountry: 'BR',
    })
    expect(headers.get('x-negotiated-lang')).toBe('pt')
    expect(headers.get('x-negotiated-niche')).toBe('dev')
  })

  it('uses the default language when every source is invalid or missing', () => {
    const { headers } = runNegotiation({
      host: null,
      lang: 'fr',
      cookieLang: 'fr',
      acceptLanguage: 'zz-ZZ,qq;q=0.1',
      cfIpCountry: null,
    })
    expect(headers.get('x-negotiated-lang')).toBe('en')
    expect(headers.get('x-negotiated-niche')).toBe('apex')
  })

  it('never writes a cookie — cookie writes belong to the server$ action only', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const { cookieWrites } = runNegotiation({
      host: 'uniteia.com',
      lang: 'pt',
      cookieLang: 'en',
      acceptLanguage: 'es',
      cfIpCountry: 'BR',
    })
    expect(cookieWrites).toHaveLength(0)
  })
})
