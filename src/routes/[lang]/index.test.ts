import { describe, expect, it } from 'vitest'
import { extractLocale, isValidLocale } from '~/i18n/locale-validation'

/**
 * Tests for the /{lang} → /{lang}/n redirect implemented in src/routes/[lang]/index.tsx
 *
 * The route uses isValidLocale() to validate the language parameter,
 * then throws redirect(302, `/${lang}/n`) to redirect to the niche index.
 *
 * These tests validate the locale-building blocks used by the route.
 * Full redirect behavior requires browser-level verification (Phase F).
 */
describe('language root redirect — P0 fix', () => {
  const SUPPORTED_LOCALE_CODES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']
  const INVALID_LOCALE_CODES = ['xx', 'invalid', 'EN', 'PT-BR', '', 'en-US']

  describe('isValidLocale — gate used by [lang]/index.tsx', () => {
    it('accepts all 8 supported language codes', () => {
      for (const code of SUPPORTED_LOCALE_CODES) {
        expect(isValidLocale(code), `${code} should be valid`).toBe(true)
      }
    })

    it('rejects invalid language codes (would return 404)', () => {
      for (const code of INVALID_LOCALE_CODES) {
        expect(isValidLocale(code), `${code} should be invalid`).toBe(false)
      }
    })
  })

  describe('extractLocale — first path segment extraction', () => {
    it('extracts locale from /{lang} (the redirect source path)', () => {
      for (const code of SUPPORTED_LOCALE_CODES) {
        expect(extractLocale(`/${code}`)).toBe(code)
      }
    })

    it('extracts locale from /{lang}/n (the redirect target path)', () => {
      for (const code of SUPPORTED_LOCALE_CODES) {
        expect(extractLocale(`/${code}/n`)).toBe(code)
      }
    })

    it('returns null for root path (no redirect needed)', () => {
      expect(extractLocale('/')).toBeNull()
    })
  })

  describe('redirect target paths', () => {
    it('each /{lang} resolves to a reachable /{lang}/n path', () => {
      for (const code of SUPPORTED_LOCALE_CODES) {
        const targetPath = `/${code}/n`
        expect(extractLocale(targetPath)).toBe(code)
        expect(isValidLocale(code)).toBe(true)
      }
    })
  })
})
