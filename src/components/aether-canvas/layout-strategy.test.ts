import { describe, expect, it } from 'vitest'
import type { CanvasNodeDef, CanvasSceneGraph } from '~/types/content'
import {
  LAYOUT_STRATEGIES,
  constellationLayout,
  neuralBranchLayout,
  resolveLayout,
} from './layout-strategy'

function node(id: string, overrides?: Partial<CanvasNodeDef>): CanvasNodeDef {
  return { id, section: 'a', type: 'card', ...overrides }
}

describe('LAYOUT_STRATEGIES registry', () => {
  it('exports all 6 strategies', () => {
    expect(Object.keys(LAYOUT_STRATEGIES)).toHaveLength(6)
  })

  it('each strategy is a function', () => {
    for (const [name, fn] of Object.entries(LAYOUT_STRATEGIES)) {
      expect(typeof fn, `${name} is a function`).toBe('function')
    }
  })
})

describe('constellationLayout', () => {
  it('returns same number of nodes', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [node('n1'), node('n2')],
    }
    const result = constellationLayout({ scene, containerWidth: 1024 })
    expect(result.nodes).toHaveLength(2)
  })

  it('preserves explicit coordinates', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [node('n1', { x: 500, y: 300, width: 100, height: 100 })],
    }
    const result = constellationLayout({ scene, containerWidth: 1024 })
    expect(result.nodes[0]?.x).toBe(500)
    expect(result.nodes[0]?.y).toBe(300)
  })
})

describe('neuralBranchLayout', () => {
  it('centers first node', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [node('n1'), node('n2')],
    }
    const result = neuralBranchLayout({ scene, containerWidth: 800 })
    expect(result.nodes[0]?.x).toBe(260)
  })
})

describe('resolveLayout', () => {
  it('returns scene unchanged when all nodes have coordinates', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [node('n1', { x: 100, y: 100, width: 200, height: 150 })],
    }
    const result = resolveLayout(scene, 1024)
    expect(result.nodes[0]?.x).toBe(100)
  })

  it('auto-generates connectors when none exist', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [node('n1'), node('n2')],
    }
    const result = resolveLayout(scene, 1024)
    expect(result.connectors).toBeDefined()
    expect(result.connectors?.length).toBe(1)
    expect(result.connectors?.[0]?.from).toBe('n1')
    expect(result.connectors?.[0]?.to).toBe('n2')
  })

  it('preserves explicit connectors', () => {
    const scene: CanvasSceneGraph = {
      version: 1,
      tone: 'obsidian',
      nodes: [
        node('n1', { x: 50, y: 50, width: 200, height: 150 }),
        node('n2', { x: 400, y: 100, width: 200, height: 150 }),
      ],
      connectors: [{ id: 'c1', from: 'n1', to: 'n2', type: 'glow' }],
    }
    const result = resolveLayout(scene, 1024)
    expect(result.connectors?.[0]?.type).toBe('glow')
  })

  it('falls back to constellation for unknown style', () => {
    const scene = {
      version: 1,
      tone: 'obsidian',
      style: 'invalid-style',
      nodes: [
        node('n1', { x: 0, y: 0, width: 200, height: 150 }),
        node('n2', { x: 0, y: 0, width: 200, height: 150 }),
      ],
    } as unknown as CanvasSceneGraph
    const result = resolveLayout(scene, 1024)
    expect(result.nodes).toHaveLength(2)
  })
})
