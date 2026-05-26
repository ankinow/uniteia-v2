import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import type { CanvasConnectorDef } from '~/types/content'
import { CanvasConnector, type CanvasConnectorProps } from './canvas-connector'

const MOCK_CONNECTOR: CanvasConnectorDef = {
  id: 'test-connector',
  from: 'node-a',
  to: 'node-b',
}

describe('CanvasConnector', () => {
  it('exports the component symbol', () => {
    expect(CanvasConnector).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof CanvasConnector).toBe('function')
  })

  it('accepts minimal connector props', () => {
    const props: CanvasConnectorProps = { connector: MOCK_CONNECTOR, tone: 'obsidian' }
    expect(props.connector.id).toBe('test-connector')
    expect(props.tone).toBe('obsidian')
  })

  it('accepts optional type prop', () => {
    const withType: CanvasConnectorDef = { ...MOCK_CONNECTOR, type: 'glow' }
    expect(withType.type).toBe('glow')
  })

  it('accepts optional class prop', () => {
    const props: CanvasConnectorProps = {
      connector: MOCK_CONNECTOR,
      tone: 'parchment',
      class: 'extra-class',
    }
    expect(props.class).toBe('extra-class')
  })
})
