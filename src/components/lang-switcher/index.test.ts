import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  $: <T>(fn: T) => fn,
  createContextId: () => 'i18n',
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

vi.mock('~/routing/routes', () => ({
  routes: { localized: (path: string) => path },
  signalsIndex: (code: string) => `/${code}/signals`,
}))

vi.mock('~/i18n/set-lang-cookie', () => ({
  updateLangCookie: () => Promise.resolve(),
}))

vi.mock('~/i18n/context', () => ({
  getLanguageName: (code: string) => code,
  useI18n: () => ({
    lang: { value: 'en' },
    t: {
      langSwitcher: { label: 'Language', current: 'Current', available: 'Available' },
    },
  }),
}))

import { SUPPORTED_LANGUAGES } from '~/i18n/types'

describe('LangSwitcherSegmented', () => {
  it('exports the component symbol', async () => {
    const mod = await import('./index')
    expect(mod.LangSwitcherSegmented).toBeDefined()
  })

  it('is a function (mocked component$)', async () => {
    const { LangSwitcherSegmented } = await import('./index')
    expect(typeof LangSwitcherSegmented).toBe('function')
  })

  it('exports LangSwitcher (existing) alongside Segmented', async () => {
    const mod = await import('./index')
    expect(mod.LangSwitcher).toBeDefined()
    expect(mod.LangSwitcherSegmented).toBeDefined()
  })

  it('uses SUPPORTED_LANGUAGES with 8 entries', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(8)
  })

  it('each language has 2-letter code', () => {
    for (const l of SUPPORTED_LANGUAGES) {
      expect(l.code).toMatch(/^[a-z]{2}$/)
    }
  })

  it('includes both ja and zh (non-Latin scripts)', () => {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code)
    expect(codes).toContain('ja')
    expect(codes).toContain('zh')
  })
})
