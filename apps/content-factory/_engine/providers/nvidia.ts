import type { LLMGenerateInput, LLMGenerateOutput, LLMProvider } from './types'

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1'

export interface NvidiaProviderConfig {
  apiKey: string
  baseUrl?: string
  model?: string
}

/**
 * NVIDIA NIM provider using OpenAI-compatible chat/completions API.
 * API key must come from environment — never hardcoded.
 */
export function createNvidiaProvider(config: NvidiaProviderConfig): LLMProvider {
  const baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  const defaultModel = config.model ?? ''

  if (!config.apiKey) {
    throw new Error(
      'NVIDIA_API_KEY is not set. Create apps/content-factory/.env with NVIDIA_API_KEY=your_key'
    )
  }

  return {
    name: 'nvidia',
    async generate(input: LLMGenerateInput): Promise<LLMGenerateOutput> {
      const model = input.model ?? defaultModel
      if (!model) {
        throw new Error(
          'No model specified. Use --model <id> or set NVIDIA_MODEL in .env. ' +
            'Check https://docs.api.nvidia.com/nim/reference/llm-apis for available models.'
        )
      }

      const body = {
        model,
        messages: input.messages,
        temperature: input.temperature ?? 0.2,
        max_tokens: input.maxTokens ?? 4096,
      }

      const url = `${baseUrl}/chat/completions`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '<unreadable>')
        // Redact: never print auth header or key
        const safeExcerpt = errorBody.slice(0, 500)
        throw new Error(
          `NVIDIA NIM API error: HTTP ${res.status} ${res.statusText}\n` +
            `Model: ${model}\n` +
            `Response excerpt: ${safeExcerpt}`
        )
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>
        model?: string
        usage?: {
          prompt_tokens?: number
          completion_tokens?: number
          total_tokens?: number
        }
      }

      const text = json.choices?.[0]?.message?.content
      if (!text) {
        throw new Error(
          `NVIDIA NIM API returned no content. Model: ${model}. ` +
            `Response keys: ${Object.keys(json).join(', ')}`
        )
      }

      return {
        text,
        model: json.model ?? model,
        provider: 'nvidia',
        ...(json.usage
          ? {
              usage: {
                ...(json.usage.prompt_tokens !== undefined ? { promptTokens: json.usage.prompt_tokens } : {}),
                ...(json.usage.completion_tokens !== undefined ? { completionTokens: json.usage.completion_tokens } : {}),
                ...(json.usage.total_tokens !== undefined ? { totalTokens: json.usage.total_tokens } : {}),
              },
            }
          : {}),
      }
    },
  }
}
