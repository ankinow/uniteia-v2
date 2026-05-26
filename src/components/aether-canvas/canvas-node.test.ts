import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import type { CanvasNodeDef } from '~/types/content'
import { CanvasNode, type CanvasNodeProps } from './canvas-node'

const MOCK_NODE: CanvasNodeDef = {
  id: 'test-node',
  section: 'intro',
  x: 100,
  y: 200,
  width: 300,
  height: 200,
  type: 'card',
}

describe('CanvasNode', () => {
  it('exports the component symbol', () => {
    expect(CanvasNode).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof CanvasNode).toBe('function')
  })

  it('accepts minimal node props', () => {
    const props: CanvasNodeProps = { node: MOCK_NODE, tone: 'obsidian' }
    expect(props.node.id).toBe('test-node')
    expect(props.tone).toBe('obsidian')
  })

  it('accepts optional index prop', () => {
    const props: CanvasNodeProps = { node: MOCK_NODE, tone: 'parchment', index: 3 }
    expect(props.index).toBe(3)
  })

  it('accepts optional class prop', () => {
    const props: CanvasNodeProps = { node: MOCK_NODE, tone: 'warm-gray', class: 'extra-class' }
    expect(props.class).toBe('extra-class')
  })
})
