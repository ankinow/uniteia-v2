import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
  Slot: () => null,
}))

import { BentoCell, BentoGrid } from './index'

describe('BentoGrid exports', () => {
  it('exports the BentoGrid symbol', () => {
    expect(BentoGrid).toBeDefined()
    expect(typeof BentoGrid).toBe('function')
  })

  it('exports the BentoCell symbol', () => {
    expect(BentoCell).toBeDefined()
    expect(typeof BentoCell).toBe('function')
  })
})
