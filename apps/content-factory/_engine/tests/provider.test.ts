import { describe, expect, it } from 'vitest'
import { providerToLLMFn, resolveProvider } from '../providers/index'

describe('provider — stub', () => {
  it('resolves stub provider', () => {
    const p = resolveProvider({ provider: 'stub' })
    expect(p.name).toBe('stub')
  })

  it('stub generates deterministic golden output', async () => {
    const p = resolveProvider({ provider: 'stub' })
    const r = await p.generate({ messages: [{ role: 'user', content: 'test' }] })
    expect(r.provider).toBe('stub')
    expect(r.model).toBe('stub-golden')
    expect(r.text).toContain('spec: uniteia-invite-link-core/1')
    expect(r.text).toContain('llm-agents-primer')
  })

  it('providerToLLMFn adapts stub to legacy LLMFn', async () => {
    const p = resolveProvider({ provider: 'stub' })
    const llmFn = providerToLLMFn(p)
    const text = await llmFn('test prompt', { temperature: 0.2 })
    expect(text).toContain('spec: uniteia-invite-link-core/1')
  })

  it('stub returns identical output on repeated calls', async () => {
    const p = resolveProvider({ provider: 'stub' })
    const r1 = await p.generate({ messages: [{ role: 'user', content: 'a' }] })
    const r2 = await p.generate({ messages: [{ role: 'user', content: 'b' }] })
    expect(r1.text).toBe(r2.text)
  })
})

describe('provider — nvidia config', () => {
  it('throws when NVIDIA_API_KEY is not set', () => {
    const orig = process.env.NVIDIA_API_KEY
    delete process.env.NVIDIA_API_KEY
    try {
      expect(() => resolveProvider({ provider: 'nvidia' })).toThrow('NVIDIA_API_KEY')
    } finally {
      if (orig) process.env.NVIDIA_API_KEY = orig
    }
  })

  it('throws for unknown provider name', () => {
    expect(() => resolveProvider({ provider: 'unknown' as any })).toThrow('Unknown provider')
  })
})

describe('provider — doctor output safety', () => {
  it('does not expose key value in provider config', () => {
    // Verify the provider interface never stores raw key in a serializable field
    const p = resolveProvider({ provider: 'stub' })
    const serialized = JSON.stringify(p)
    expect(serialized).not.toContain('nvapi-')
    expect(serialized).not.toContain('NVIDIA_API_KEY')
  })
})
