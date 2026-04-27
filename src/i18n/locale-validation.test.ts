import { describe, expect, it } from 'vitest'
import {
  SUPPORTED_LOCALES,
  extractLocale,
  isValidLocale,
  validateLocalePath,
} from './locale-validation'

describe('locale-validation', () => {
  describe('SUPPORTED_LOCALES', () => {
    it('contains all five supported languages', () => {
      expect(SUPPORTED_LOCALES).toHaveLength(5)
      expect(SUPPORTED_LOCALES).toContain('en')
      expect(SUPPORTED_LOCALES).toContain('pt')
      expect(SUPPORTED_LOCALES).toContain('es')
      expect(SUPPORTED_LOCALES).toContain('ja')
      expect(SUPPORTED_LOCALES).toContain('zh')
    })
  })

  describe('extractLocale', () => {
    it('extracts locale from root path with locale', () => {
      expect(extractLocale('/en')).toBe('en')
      expect(extractLocale('/pt')).toBe('pt')
      expect(extractLocale('/ja')).toBe('ja')
    })

    it('extracts locale from nested paths', () => {
      expect(extractLocale('/en/test')).toBe('en')
      expect(extractLocale('/pt/blog/post')).toBe('pt')
      expect(extractLocale('/es/niche/article')).toBe('es')
    })

    it('returns null for root path', () => {
      expect(extractLocale('/')).toBeNull()
    })

    it('returns null for empty path', () => {
      expect(extractLocale('')).toBeNull()
    })

    it('handles paths without leading slash', () => {
      expect(extractLocale('en/test')).toBe('en')
      expect(extractLocale('pt')).toBe('pt')
    })
  })

  describe('isValidLocale', () => {
    it('returns true for valid locales', () => {
      expect(isValidLocale('en')).toBe(true)
      expect(isValidLocale('pt')).toBe(true)
      expect(isValidLocale('es')).toBe(true)
      expect(isValidLocale('ja')).toBe(true)
      expect(isValidLocale('zh')).toBe(true)
    })

    it('returns false for invalid locales', () => {
      expect(isValidLocale('de')).toBe(false)
      expect(isValidLocale('fr')).toBe(false)
      expect(isValidLocale('xx')).toBe(false)
      expect(isValidLocale('invalid')).toBe(false)
    })

    it('returns false for uppercase locales (case sensitive)', () => {
      expect(isValidLocale('EN')).toBe(false)
      expect(isValidLocale('PT')).toBe(false)
      expect(isValidLocale('JA')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidLocale('')).toBe(false)
    })

    it('returns false for locale with region code', () => {
      expect(isValidLocale('en-US')).toBe(false)
      expect(isValidLocale('pt-BR')).toBe(false)
      expect(isValidLocale('zh-CN')).toBe(false)
    })
  })

  describe('validateLocalePath', () => {
    it('returns valid=true with locale for valid locale paths', () => {
      const result = validateLocalePath('/en')
      expect(result.isValid).toBe(true)
      expect(result.locale).toBe('en')
      expect(result.originalSegment).toBe('en')
    })

    it('returns valid=true with locale for nested valid paths', () => {
      const result = validateLocalePath('/en/test/article')
      expect(result.isValid).toBe(true)
      expect(result.locale).toBe('en')
      expect(result.originalSegment).toBe('en')
    })

    it('returns valid=true with null locale for root path', () => {
      const result = validateLocalePath('/')
      expect(result.isValid).toBe(true)
      expect(result.locale).toBeNull()
      expect(result.originalSegment).toBeNull()
    })

    it('returns valid=false for invalid locale', () => {
      const result = validateLocalePath('/xx')
      expect(result.isValid).toBe(false)
      expect(result.locale).toBeNull()
      expect(result.originalSegment).toBe('xx')
    })

    it('returns valid=false for uppercase locale', () => {
      const result = validateLocalePath('/EN')
      expect(result.isValid).toBe(false)
      expect(result.locale).toBeNull()
      expect(result.originalSegment).toBe('EN')
    })

    it('returns valid=false for invalid locale in nested path', () => {
      const result = validateLocalePath('/de/article')
      expect(result.isValid).toBe(false)
      expect(result.locale).toBeNull()
      expect(result.originalSegment).toBe('de')
    })

    it('returns valid=false with original segment preserved', () => {
      const result = validateLocalePath('/invalid/test')
      expect(result.isValid).toBe(false)
      expect(result.originalSegment).toBe('invalid')
    })

    it('handles paths with multiple segments', () => {
      const result = validateLocalePath('/pt/niche/article-slug')
      expect(result.isValid).toBe(true)
      expect(result.locale).toBe('pt')
      expect(result.originalSegment).toBe('pt')
    })

    it('handles empty path', () => {
      const result = validateLocalePath('')
      expect(result.isValid).toBe(true)
      expect(result.locale).toBeNull()
      expect(result.originalSegment).toBeNull()
    })
  })
})
