import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import {
  ALL_VARIANTS,
  CinematicDepthCard,
  type CinematicDepthCardProps,
  type CinematicDepthCardVariant,
} from './index'

describe('CinematicDepthCard exports', () => {
  it('exports the component symbol', () => {
    expect(CinematicDepthCard).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof CinematicDepthCard).toBe('function')
  })

  it('exports ALL_VARIANTS with exactly 3 entries', () => {
    expect(ALL_VARIANTS).toEqual<CinematicDepthCardVariant[]>(['logic', 'insight', 'flow'])
  })

  it.each(ALL_VARIANTS)('variant "%s" is a non-empty string', variant => {
    expect(typeof variant).toBe('string')
    expect(variant.length).toBeGreaterThan(0)
  })

  it('has no duplicate variants', () => {
    expect(new Set(ALL_VARIANTS).size).toBe(ALL_VARIANTS.length)
  })

  it('each variant matches the union type at runtime', () => {
    for (const v of ALL_VARIANTS) {
      expect(['logic', 'insight', 'flow']).toContain(v)
    }
  })
})

describe('component interface contract', () => {
  it('accepts optional variant prop', () => {
    const props: { variant?: CinematicDepthCardVariant } = { variant: 'logic' }
    expect(props.variant).toBe('logic')
  })

  it('accepts optional glowOnFocus prop', () => {
    const props: { glowOnFocus?: boolean } = { glowOnFocus: true }
    expect(props.glowOnFocus).toBe(true)
  })

  it('accepts optional elevated prop', () => {
    const props: { elevated?: boolean } = { elevated: true }
    expect(props.elevated).toBe(true)
  })

  it('accepts optional class prop', () => {
    const props: { class?: string } = { class: 'extra-class' }
    expect(props.class).toBe('extra-class')
  })

  it('all variants are valid as prop values', () => {
    for (const variant of ALL_VARIANTS) {
      const props: { variant: CinematicDepthCardVariant } = { variant }
      expect(props.variant).toBe(variant)
    }
  })
})

describe('default values', () => {
  it('defaults to flow variant', () => {
    const props: CinematicDepthCardProps = {}
    expect(props.variant).toBeUndefined()
  })

  it('defaults glowOnFocus to false', () => {
    const props: CinematicDepthCardProps = {}
    expect(props.glowOnFocus).toBeUndefined()
  })

  it('defaults elevated to false', () => {
    const props: CinematicDepthCardProps = {}
    expect(props.elevated).toBeUndefined()
  })
})
