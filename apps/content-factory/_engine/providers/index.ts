import { createNvidiaProvider } from './nvidia'
import { createStubProvider } from './stub'
import type { LLMProvider, LLMProviderName } from './types'

export type { LLMGenerateInput, LLMGenerateOutput, LLMProvider, LLMProviderName } from './types'

export interface ProviderConfig {
  provider: LLMProviderName
  model?: string
}

/**
 * Resolve a provider by name.
 * Reads env vars for NVIDIA config. Never prints secrets.
 */
export function resolveProvider(config: ProviderConfig): LLMProvider {
  switch (config.provider) {
    case 'stub':
      return createStubProvider()

    case 'nvidia':
      return createNvidiaProvider({
        apiKey: process.env.NVIDIA_API_KEY ?? '',
        baseUrl: process.env.NVIDIA_BASE_URL,
        model: config.model ?? process.env.NVIDIA_MODEL,
      })

    default:
      throw new Error(`Unknown provider: ${config.provider}. Available: stub, nvidia`)
  }
}

/**
 * Adapt an LLMProvider to the legacy LLMFn signature used by build.ts.
 */
export function providerToLLMFn(
  provider: LLMProvider
): (prompt: string, opts?: { temperature?: number }) => Promise<string> {
  return async (prompt: string, opts?: { temperature?: number }) => {
    const result = await provider.generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: opts?.temperature,
    })
    return result.text
  }
}
