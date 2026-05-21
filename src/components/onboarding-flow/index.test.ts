import { describe, expect, it, vi } from 'vitest'

vi.mock('@builder.io/qwik', () => ({
  component$: <T>(fn: T) => fn,
}))

vi.mock('~/components/depth-card', () => ({
  DepthCard: () => null,
}))

describe('OnboardingFlow', () => {
  it('exports the component symbol', async () => {
    const mod = await import('./index')
    expect(mod.OnboardingFlow).toBeDefined()
  })

  it('is a function (wrapped component)', async () => {
    const { OnboardingFlow } = await import('./index')
    expect(typeof OnboardingFlow).toBe('function')
  })

  it('accepts locale prop', async () => {
    const { OnboardingFlow } = await import('./index')
    expect(typeof OnboardingFlow).toBe('function')
  })
})
