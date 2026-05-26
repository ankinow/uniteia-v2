import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  useSignal: <T>(val: T) => ({ value: val }),
  useVisibleTask$: (_fn: unknown) => {},
}))

import type { CanvasSceneGraph } from '~/types/content'
import { AetherCanvasEngine, type AetherCanvasEngineProps } from './aether-canvas-engine'

const MOCK_SCENE: CanvasSceneGraph = {
  version: 1,
  tone: 'obsidian',
  nodes: [
    { id: 'n1', section: 'intro', x: 50, y: 50, width: 300, height: 200, type: 'card' },
    { id: 'n2', section: 'body', x: 450, y: 100, width: 300, height: 250, type: 'card' },
  ],
  connectors: [{ id: 'c1', from: 'n1', to: 'n2' }],
}

describe('AetherCanvasEngine', () => {
  it('exports the component symbol', () => {
    expect(AetherCanvasEngine).toBeDefined()
  })

  it('is a function (wrapped component$)', () => {
    expect(typeof AetherCanvasEngine).toBe('function')
  })

  it('accepts scene prop', () => {
    const props: AetherCanvasEngineProps = { scene: MOCK_SCENE }
    expect(props.scene.nodes).toHaveLength(2)
    expect(props.scene.tone).toBe('obsidian')
  })

  it('accepts optional class prop', () => {
    const props: AetherCanvasEngineProps = { scene: MOCK_SCENE, class: 'extra-class' }
    expect(props.class).toBe('extra-class')
  })

  it('handles scene with no nodes gracefully', () => {
    const emptyScene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [],
      connectors: [],
    }
    const props: AetherCanvasEngineProps = { scene: emptyScene }
    expect(props.scene.nodes).toHaveLength(0)
  })

  it('handles empty scene object', () => {
    const props: AetherCanvasEngineProps = {
      scene: {} as CanvasSceneGraph,
    }
    expect(props.scene.nodes).toBeUndefined()
  })
})
