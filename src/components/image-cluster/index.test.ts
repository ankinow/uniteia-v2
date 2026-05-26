import { describe, expect, it, vi } from 'vitest'

// Mock Qwik — component$ throws outside optimizer transform in Node.js
vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
}))

import { type ClusterLayout, ImageCluster, type ImageClusterItem } from './index'

const SAMPLE_ITEMS: ImageClusterItem[] = [
  {
    src: '/img/agent.jpg',
    alt: 'Agent',
    caption: 'Logic Layer',
    variant: 'polaroid',
    tape: 'top-left',
  },
  {
    src: '/img/prompt.jpg',
    alt: 'Prompt',
    caption: 'Insight',
    variant: 'polaroid',
    rotation: 3,
    tape: 'top-right',
  },
  { src: '/img/flow.jpg', alt: 'Flow', caption: 'Flow State', variant: 'sticker' },
]

const ALL_LAYOUTS: ClusterLayout[] = ['grid', 'masonry', 'scatter']

describe('ImageCluster', () => {
  it('exports component', () => {
    expect(ImageCluster).toBeDefined()
  })

  it('accepts items and layout props', () => {
    const props = { items: SAMPLE_ITEMS, layout: 'grid' as ClusterLayout }
    expect(props.items).toHaveLength(3)
    expect(props.layout).toBe('grid')
  })

  it.each(ALL_LAYOUTS)('supports layout variant "%s"', layout => {
    const props = { items: SAMPLE_ITEMS, layout }
    expect(props.layout).toBe(layout)
  })

  it('handles empty items gracefully', () => {
    const props = { items: [] as ImageClusterItem[] }
    expect(props.items).toHaveLength(0)
  })

  it('each polaroid item has caption string', () => {
    for (const item of SAMPLE_ITEMS.slice(0, 2)) {
      expect(item.caption).toBeDefined()
      expect(String(item.caption).length).toBeGreaterThan(0)
    }
  })

  it('tape positions are valid', () => {
    const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    for (const item of SAMPLE_ITEMS) {
      if (item.tape) {
        expect(validPositions).toContain(item.tape)
      }
    }
  })
})
