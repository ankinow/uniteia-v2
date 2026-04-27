import { describe, expect, it } from 'vitest'
import { CJK_LANGUAGES, getFontFamilyForLanguage, shouldLoadCJKFont } from './font-conditions'

describe('font-conditions', () => {
  describe('shouldLoadCJKFont', () => {
    it('returns true for Japanese (ja)', () => {
      expect(shouldLoadCJKFont('ja')).toBe(true)
    })

    it('returns true for Chinese (zh)', () => {
      expect(shouldLoadCJKFont('zh')).toBe(true)
    })

    it('returns false for English (en)', () => {
      expect(shouldLoadCJKFont('en')).toBe(false)
    })

    it('returns false for Portuguese (pt)', () => {
      expect(shouldLoadCJKFont('pt')).toBe(false)
    })

    it('returns false for Spanish (es)', () => {
      expect(shouldLoadCJKFont('es')).toBe(false)
    })

    it('returns false for null input', () => {
      expect(shouldLoadCJKFont(null)).toBe(false)
    })

    it('returns false for undefined input', () => {
      expect(shouldLoadCJKFont(undefined)).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(shouldLoadCJKFont('')).toBe(false)
    })

    it('returns false for invalid language codes', () => {
      expect(shouldLoadCJKFont('fr')).toBe(false)
      expect(shouldLoadCJKFont('de')).toBe(false)
      expect(shouldLoadCJKFont('invalid')).toBe(false)
    })

    it('returns false for uppercase language codes', () => {
      expect(shouldLoadCJKFont('JA')).toBe(false)
      expect(shouldLoadCJKFont('ZH')).toBe(false)
    })
  })

  describe('CJK_LANGUAGES constant', () => {
    it('contains exactly ja and zh', () => {
      expect(CJK_LANGUAGES).toHaveLength(2)
      expect(CJK_LANGUAGES).toContain('ja')
      expect(CJK_LANGUAGES).toContain('zh')
    })
  })

  describe('getFontFamilyForLanguage', () => {
    it('returns Noto Sans JP for Japanese', () => {
      expect(getFontFamilyForLanguage('ja')).toBe('Noto Sans JP')
    })

    it('returns Noto Sans SC for Chinese', () => {
      expect(getFontFamilyForLanguage('zh')).toBe('Noto Sans SC')
    })

    it('returns null for English', () => {
      expect(getFontFamilyForLanguage('en')).toBeNull()
    })

    it('returns null for Portuguese', () => {
      expect(getFontFamilyForLanguage('pt')).toBeNull()
    })

    it('returns null for Spanish', () => {
      expect(getFontFamilyForLanguage('es')).toBeNull()
    })

    it('returns null for null input', () => {
      expect(getFontFamilyForLanguage(null)).toBeNull()
    })

    it('returns null for undefined input', () => {
      expect(getFontFamilyForLanguage(undefined)).toBeNull()
    })

    it('returns null for unknown language codes', () => {
      expect(getFontFamilyForLanguage('fr')).toBeNull()
      expect(getFontFamilyForLanguage('de')).toBeNull()
    })
  })
})
