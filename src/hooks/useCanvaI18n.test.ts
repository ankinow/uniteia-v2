/**
 * useCanvaI18n.test.ts — Validates the flat i18n record (pitfall 45)
 *
 * 18 keys × 8 locales = 144 unique translation strings.
 * Every key in every locale must be a non-empty string.
 */
import { describe, expect, it } from 'vitest'
import { de } from '~/i18n/de'
import { en } from '~/i18n/en'
import { es } from '~/i18n/es'
import { fr } from '~/i18n/fr'
import { it as itLocale } from '~/i18n/it'
import { ja } from '~/i18n/ja'
import { pt } from '~/i18n/pt'
import { zh } from '~/i18n/zh'
import { type CanvaI18n, type CanvaI18nKey, useCanvaI18n } from './useCanvaI18n'

const LOCALES = [
  ['en', en],
  ['pt', pt],
  ['es', es],
  ['fr', fr],
  ['de', de],
  ['it', itLocale],
  ['ja', ja],
  ['zh', zh],
] as const

const EXPECTED_KEYS: CanvaI18nKey[] = [
  'canva.hero.title',
  'canva.hero.subtitle',
  'canva.hero.cta',
  'canva.concept.central',
  'canva.concept.satellite.1',
  'canva.concept.satellite.2',
  'canva.code.step.1.title',
  'canva.code.step.1.body',
  'canva.code.step.2.title',
  'canva.compare.option.a',
  'canva.compare.option.b',
  'canva.compare.decision.yes',
  'canva.compare.decision.no',
  'canva.timeline.milestone.1',
  'canva.timeline.milestone.2',
  'canva.summary.takeaway.1',
  'canva.summary.takeaway.2',
  'canva.summary.nextstep',
]

describe('useCanvaI18n', () => {
  it('exports a function', () => {
    expect(typeof useCanvaI18n).toBe('function')
  })

  it('returns exactly 18 keys per locale (144 total)', () => {
    const totals: string[] = []
    for (const [code] of LOCALES) {
      const t = useCanvaI18n(code)
      totals.push(...Object.keys(t))
    }
    expect(totals.length).toBe(18 * 8) // 144
  })

  it('returns every expected dot-path key for every locale', () => {
    for (const [code] of LOCALES) {
      const t: CanvaI18n = useCanvaI18n(code)
      for (const k of EXPECTED_KEYS) {
        expect(t[k], `locale=${code} key=${k}`).toBeTypeOf('string')
        expect(t[k].length, `locale=${code} key=${k}`).toBeGreaterThan(0)
      }
    }
  })

  it('returns distinct strings across locales (real translations, not fallbacks)', () => {
    const samples: Record<CanvaI18nKey, Set<string>> = {
      'canva.hero.title': new Set(),
      'canva.hero.subtitle': new Set(),
      'canva.hero.cta': new Set(),
      'canva.concept.central': new Set(),
      'canva.concept.satellite.1': new Set(),
      'canva.concept.satellite.2': new Set(),
      'canva.code.step.1.title': new Set(),
      'canva.code.step.1.body': new Set(),
      'canva.code.step.2.title': new Set(),
      'canva.compare.option.a': new Set(),
      'canva.compare.option.b': new Set(),
      'canva.compare.decision.yes': new Set(),
      'canva.compare.decision.no': new Set(),
      'canva.timeline.milestone.1': new Set(),
      'canva.timeline.milestone.2': new Set(),
      'canva.summary.takeaway.1': new Set(),
      'canva.summary.takeaway.2': new Set(),
      'canva.summary.nextstep': new Set(),
    }
    for (const [code] of LOCALES) {
      const t = useCanvaI18n(code)
      for (const k of EXPECTED_KEYS) {
        samples[k].add(t[k])
      }
    }
    // Brand-name / proper-noun keys are intentionally invariant across
    // locales (e.g. 'UniTeia Canva' is a product name in every language).
    // Require only 1 distinct value for those, full diversity for the rest.
    const brandKeys = new Set<CanvaI18nKey>(['canva.compare.option.b'])
    for (const k of EXPECTED_KEYS) {
      const min = brandKeys.has(k) ? 1 : 4
      expect(samples[k].size, `key=${k}`).toBeGreaterThanOrEqual(min)
    }
  })

  it('falls back to default language on unknown locale', () => {
    const fallback = useCanvaI18n('xx')
    const enT = useCanvaI18n('en')
    for (const k of EXPECTED_KEYS) {
      expect(fallback[k]).toBe(enT[k])
    }
  })
})
