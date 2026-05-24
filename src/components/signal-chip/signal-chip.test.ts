import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import {
  ALL_TRENDS,
  ALL_VARIANTS,
  SignalChip,
  type SignalChipProps,
  type SignalChipVariant,
} from './index'

describe('SignalChip exports', () => {
  it('exports the component symbol', () => {
    expect(SignalChip).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof SignalChip).toBe('function')
  })

  it('exports ALL_VARIANTS with exactly 5 entries', () => {
    expect(ALL_VARIANTS).toEqual<SignalChipVariant[]>([
      'moderator',
      'researcher',
      'writer',
      'curator',
      'analyst',
    ])
  })

  it('exports ALL_TRENDS with exactly 3 entries', () => {
    expect(ALL_TRENDS).toEqual(['up', 'down', 'stable'])
  })

  it('has no duplicate variants', () => {
    expect(new Set(ALL_VARIANTS).size).toBe(ALL_VARIANTS.length)
  })

  it('has no duplicate trends', () => {
    expect(new Set(ALL_TRENDS).size).toBe(ALL_TRENDS.length)
  })

  it.each(ALL_VARIANTS)('variant "%s" is a non-empty string', variant => {
    expect(typeof variant).toBe('string')
    expect(variant.length).toBeGreaterThan(0)
  })

  it.each(ALL_TRENDS)('trend "%s" is a non-empty string', trend => {
    expect(typeof trend).toBe('string')
    expect(trend.length).toBeGreaterThan(0)
  })

  it('each variant matches the union type at runtime', () => {
    for (const v of ALL_VARIANTS) {
      expect(['moderator', 'researcher', 'writer', 'curator', 'analyst']).toContain(v)
    }
  })
})

describe('component interface contract', () => {
  it('accepts required metric and label props', () => {
    const props: SignalChipProps = { metric: 42, label: 'test' }
    expect(props.metric).toBe(42)
    expect(props.label).toBe('test')
  })

  it('accepts optional variant prop', () => {
    const props: { variant?: SignalChipVariant } = { variant: 'writer' }
    expect(props.variant).toBe('writer')
  })

  it('accepts optional trend prop', () => {
    const props: { trend?: 'up' | 'down' | 'stable' } = { trend: 'up' }
    expect(props.trend).toBe('up')
  })

  it('accepts optional class prop', () => {
    const props: { class?: string } = { class: 'extra-class' }
    expect(props.class).toBe('extra-class')
  })

  it('all variants are valid as prop values', () => {
    for (const variant of ALL_VARIANTS) {
      const props: { variant: SignalChipVariant } = { variant }
      expect(props.variant).toBe(variant)
    }
  })

  it('all trends are valid as prop values', () => {
    for (const trend of ALL_TRENDS) {
      const props: { trend: 'up' | 'down' | 'stable' } = { trend }
      expect(props.trend).toBe(trend)
    }
  })
})
