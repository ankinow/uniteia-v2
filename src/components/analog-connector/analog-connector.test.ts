import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import {
  ALL_VARIANTS,
  AnalogConnector,
  type AnalogConnectorProps,
  type ConnectorCoord,
  type ConnectorEdge,
  type ConnectorVariant,
  buildBezier,
} from './index'

describe('AnalogConnector exports', () => {
  it('exports the component symbol', () => {
    expect(AnalogConnector).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof AnalogConnector).toBe('function')
  })

  it('exports ALL_VARIANTS with exactly 4 entries', () => {
    expect(ALL_VARIANTS).toEqual<ConnectorVariant[]>(['solid', 'dashed', 'dotted', 'glow'])
  })

  it('has no duplicate variants', () => {
    expect(new Set(ALL_VARIANTS).size).toBe(ALL_VARIANTS.length)
  })

  it.each(ALL_VARIANTS)('variant "%s" is a non-empty string', variant => {
    expect(typeof variant).toBe('string')
    expect(variant.length).toBeGreaterThan(0)
  })
})

describe('buildBezier pure function', () => {
  it('returns a valid SVG path string', () => {
    const coords: ConnectorCoord = { sx: 0, sy: 0, tx: 100, ty: 0 }
    const d = buildBezier(coords)
    expect(d).toBeTypeOf('string')
    expect(d).toMatch(/^M /)
    expect(d).toContain(' C ')
  })

  it('handles horizontal rightward curve (sx < tx)', () => {
    const coords: ConnectorCoord = { sx: 0, sy: 50, tx: 200, ty: 50 }
    const d = buildBezier(coords)
    expect(d).toBe('M 0,50 C 80,50, 120,50, 200,50')
  })

  it('handles vertical displacement between source and target', () => {
    const coords: ConnectorCoord = { sx: 0, sy: 0, tx: 200, ty: 100 }
    const d = buildBezier(coords)
    expect(d).toBe('M 0,0 C 80,0, 120,100, 200,100')
  })

  it('handles reverse direction (sx > tx)', () => {
    const coords: ConnectorCoord = { sx: 200, sy: 50, tx: 0, ty: 50 }
    const d = buildBezier(coords)
    expect(d).toBe('M 200,50 C 120,50, 80,50, 0,50')
  })

  it('produces correct cubic bezier format', () => {
    const d = buildBezier({ sx: 10, sy: 20, tx: 100, ty: 80 })
    const parts = d.split(' C ')
    expect(parts).toHaveLength(2)
    const move = parts[0]
    const curve = parts[1]
    expect(move).toMatch(/^M /)
    expect(curve).toMatch(/^[\d., -]+$/)
    if (!curve) throw new Error('Expected curve segment')
    const pts = curve.split(', ')
    expect(pts).toHaveLength(3)
  })
})

describe('ConnectorEdge interface contract', () => {
  it('requires sourceId and targetId', () => {
    const edge: ConnectorEdge = { sourceId: 'a', targetId: 'b' }
    expect(edge.sourceId).toBe('a')
    expect(edge.targetId).toBe('b')
  })

  it('accepts optional relation', () => {
    const edge: ConnectorEdge = { sourceId: 'a', targetId: 'b', relation: 'supports' }
    expect(edge.relation).toBe('supports')
  })

  it('accepts optional variant', () => {
    const edge: ConnectorEdge & { variant?: ConnectorVariant } = {
      sourceId: 'a',
      targetId: 'b',
      variant: 'dashed',
    }
    expect(edge.variant).toBe('dashed')
  })

  it('all variants are valid as prop values', () => {
    for (const variant of ALL_VARIANTS) {
      const edge: ConnectorEdge & { variant: ConnectorVariant } = {
        sourceId: 'a',
        targetId: 'b',
        variant,
      }
      expect(edge.variant).toBe(variant)
    }
  })
})

describe('AnalogConnectorProps interface', () => {
  it('accepts coordOverrides prop', () => {
    const coords: ConnectorCoord[] = [{ sx: 0, sy: 0, tx: 100, ty: 50 }]
    const props: AnalogConnectorProps = {
      edges: [{ sourceId: 'a', targetId: 'b' }],
      coordOverrides: coords,
    }
    expect(props.coordOverrides).toEqual(coords)
  })

  it('accepts optional animated prop', () => {
    const props: AnalogConnectorProps = { edges: [], animated: true }
    expect(props.animated).toBe(true)
  })

  it('accepts optional containerRef prop', () => {
    const props: AnalogConnectorProps = { edges: [], containerRef: '#canvas' }
    expect(props.containerRef).toBe('#canvas')
  })

  it('accepts optional variant prop', () => {
    const props: AnalogConnectorProps = { edges: [], variant: 'glow' }
    expect(props.variant).toBe('glow')
  })
})
