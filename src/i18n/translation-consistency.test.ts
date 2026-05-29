import { describe, expect, test } from 'vitest'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { it as itLocale } from './it'
import { ja } from './ja'
import { pt } from './pt'
import type { TranslationStrings } from './types'
import { zh } from './zh'

type KeyPath = string

/**
 * Recursively extract all dot-notation key paths from a nested object.
 * Example: { nav: { home: 'X' } } → ['nav.home']
 */
function extractKeys(obj: unknown, prefix = ''): KeyPath[] {
  if (obj === null || obj === undefined || typeof obj !== 'object') return []
  const keys: KeyPath[] = []
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fullPath = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, fullPath))
    } else {
      keys.push(fullPath)
    }
  }
  return keys
}

const LOCALES = ['pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

// Map locale codes to their translation objects
function getTranslationForLocale(locale: string): TranslationStrings | undefined {
  const map: Record<string, TranslationStrings> = {
    pt,
    es,
    fr,
    de,
    it: itLocale,
    ja,
    zh,
  }
  return map[locale]
}

describe('Translation key consistency', () => {
  const enKeys = new Set(extractKeys(en))

  test('en should have the canonical key set', () => {
    expect(enKeys.size).toBeGreaterThan(0)
    // Sanity check: known top-level sections must exist
    const sections = [
      'nav',
      'sidebar',
      'footer',
      'langSwitcher',
      'errorPages',
      'fallbackBanner',
      'article',
      'niche',
      'editorial',
      'dopamineCard',
      'signal',
      'search',
      'seo',
      'homepage',
      'onboarding',
      'legal',
    ]
    for (const section of sections) {
      expect(en).toHaveProperty(section)
    }
  })

  for (const locale of LOCALES) {
    const translation = getTranslationForLocale(locale)
    if (!translation) {
      throw new Error(`Translation not found for locale: ${locale}`)
    }

    describe(`${locale} locale`, () => {
      test('has all keys present in en', () => {
        const missingKeys: KeyPath[] = []
        for (const key of enKeys) {
          if (!hasKey(translation, key)) {
            missingKeys.push(key)
          }
        }
        expect(missingKeys).toEqual([])
      })

      test('has no extra keys not present in en', () => {
        const localeKeys = new Set(extractKeys(translation))
        const extraKeys: KeyPath[] = []
        for (const key of localeKeys) {
          if (!enKeys.has(key)) {
            extraKeys.push(key)
          }
        }
        expect(extraKeys).toEqual([])
      })

      test('has the same number of keys as en', () => {
        const localeKeys = extractKeys(translation)
        expect(localeKeys.length).toBe(enKeys.size)
      })
    })
  }
})

describe('StoryboardGrid i18n key integrity', () => {
  const ARTICLE_MAGICA_KEYS = [
    'article.magica.insight.title',
    'article.magica.insight.body',
    'article.magica.evidence.title',
    'article.magica.architecture.title',
    'article.magica.architecture.point1',
    'article.magica.architecture.point2',
    'article.magica.architecture.point3',
    'article.magica.cta.title',
    'article.magica.cta.body',
    'article.magica.cta.button',
  ]

  for (const locale of ['en', ...LOCALES] as const) {
    const translation = locale === 'en' ? en : getTranslationForLocale(locale)
    if (!translation) throw new Error(`Translation not found: ${locale}`)

    describe(`${locale}: article.magica`, () => {
      for (const key of ARTICLE_MAGICA_KEYS) {
        test(`${key} exists and is non-empty`, () => {
          expect(hasKey(translation, key)).toBe(true)
          const value = getNestedValue(translation, key)
          expect(value).toBeTruthy()
          expect(typeof value).toBe('string')
          expect((value as string).length).toBeGreaterThan(0)
          // Ensure no hardcoded English fallback leaked in non-EN locales
          if (locale !== 'en') {
            expect(value as string).not.toMatch(/^Magica: The/)
          }
        })
      }
    })
  }
})

/**
 * Check if a nested key path exists in an object.
 * Supports dot-notation paths like 'nav.home' or 'errorPages.404.title'.
 */
function hasKey(obj: unknown, path: string): boolean {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false
    }
    if (!(part in (current as Record<string, unknown>))) {
      return false
    }
    current = (current as Record<string, unknown>)[part]
  }
  return true
}

/**
 * Get a nested value from an object using dot notation.
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    if (!(part in (current as Record<string, unknown>))) {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }
  return current
}
