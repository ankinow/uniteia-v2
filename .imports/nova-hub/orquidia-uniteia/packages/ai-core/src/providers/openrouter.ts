/**
 * @orquestra/ai-core - OpenRouter Provider
 * SOTA 2026: OpenRouter API integration with FREE models
 *
 * Features:
 * - Multiple free model options
 * - OpenAI-compatible API
 * - Automatic context injection
 * - Streaming support
 */

import { buildGlobalSystemPrompt, validateContext } from '../context'

// =============================================================================
// TYPES
// =============================================================================

export interface OpenRouterConfig {
  apiKey: string
  model?: OpenRouterModel
  temperature?: number
  maxTokens?: number
  siteUrl?: string
  siteName?: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResponse {
  content: string
  model: string
  tokensUsed: {
    prompt: number
    completion: number
    total: number
  }
  finishReason: string
  latencyMs: number
}

export interface StreamChunk {
  content: string
  done: boolean
}

// =============================================================================
// CONSTANTS - FREE MODELS ONLY
// =============================================================================

/**
 * OpenRouter FREE models (no cost)
 * Updated: Jan 2026
 */
export const OPENROUTER_FREE_MODELS = {
  // Kimi K2 - Best free model (same as Groq but free via OpenRouter)
  KIMI_K2: 'moonshotai/kimi-k2:free',

  // DeepSeek R1 - Best reasoning model
  DEEPSEEK_R1: 'deepseek/deepseek-r1-0528:free',

  // Qwen3 Coder - Great for code
  QWEN3_CODER: 'qwen/qwen3-coder:free',

  // Qwen3 Next 80B - Large general model
  QWEN3_NEXT_80B: 'qwen/qwen3-next-80b-a3b-instruct:free',

  // GLM 4.5 Air - Fast Chinese model
  GLM_4_5_AIR: 'z-ai/glm-4.5-air:free',

  // Gemma 3n - Google's efficient model
  GEMMA_3N: 'google/gemma-3n-e2b-it:free',

  // Nvidia Nemotron - Fast inference
  NEMOTRON_NANO: 'nvidia/nemotron-nano-9b-v2:free',

  // Mistral Devstral - Dev-focused
  MISTRAL_DEVSTRAL: 'mistralai/devstral-2512:free',
} as const

export type OpenRouterModel = (typeof OPENROUTER_FREE_MODELS)[keyof typeof OPENROUTER_FREE_MODELS]

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1'

// =============================================================================
// PROVIDER CLASS
// =============================================================================

export class OpenRouterProvider {
  private apiKey: string
  private model: OpenRouterModel
  private temperature: number
  private maxTokens: number
  private siteUrl: string
  private siteName: string

  constructor(config: OpenRouterConfig) {
    if (!config.apiKey) {
      throw new Error('[OPENROUTER_PROVIDER] API key is required')
    }

    this.apiKey = config.apiKey
    this.model = config.model || OPENROUTER_FREE_MODELS.DEEPSEEK_R1
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens ?? 4096
    this.siteUrl = config.siteUrl || 'https://uniteia.com'
    this.siteName = config.siteName || 'UniTeiaAI'
  }

  /**
   * Send a chat completion request with automatic context injection
   */
  async chat(
    messages: ChatMessage[],
    options?: {
      additionalContext?: string
      model?: OpenRouterModel
      temperature?: number
      maxTokens?: number
    },
  ): Promise<OpenRouterResponse> {
    const start = performance.now()

    // Build system prompt with global context
    const globalSystemPrompt = buildGlobalSystemPrompt(options?.additionalContext)
    validateContext(globalSystemPrompt)

    // Prepare messages with context injection
    const preparedMessages: ChatMessage[] = [
      { role: 'system', content: globalSystemPrompt },
      ...messages,
    ]

    const model = options?.model || this.model

    try {
      const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteName,
        },
        body: JSON.stringify({
          model,
          messages: preparedMessages,
          temperature: options?.temperature ?? this.temperature,
          max_tokens: options?.maxTokens ?? this.maxTokens,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter API error ${response.status}: ${errorText}`)
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string }; finish_reason?: string }>
        model?: string
        usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
      }
      const latencyMs = performance.now() - start

      return {
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || model,
        tokensUsed: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        finishReason: data.choices?.[0]?.finish_reason || 'unknown',
        latencyMs,
      }
    } catch (error) {
      // Try fallback to different free model
      if (model === OPENROUTER_FREE_MODELS.DEEPSEEK_R1) {
        console.warn('[OPENROUTER_PROVIDER] DeepSeek R1 failed, trying Qwen3 Next 80B')
        return this.chat(messages, { ...options, model: OPENROUTER_FREE_MODELS.QWEN3_NEXT_80B })
      }
      throw error
    }
  }

  /**
   * Stream a chat completion response
   */
  async *stream(
    messages: ChatMessage[],
    options?: {
      additionalContext?: string
      model?: OpenRouterModel
    },
  ): AsyncGenerator<StreamChunk> {
    const globalSystemPrompt = buildGlobalSystemPrompt(options?.additionalContext)
    validateContext(globalSystemPrompt)

    const preparedMessages: ChatMessage[] = [
      { role: 'system', content: globalSystemPrompt },
      ...messages,
    ]

    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': this.siteUrl,
        'X-Title': this.siteName,
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        messages: preparedMessages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`OpenRouter stream error: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        yield { content: '', done: true }
        break
      }

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

      for (const line of lines) {
        if (line.includes('[DONE]')) {
          yield { content: '', done: true }
          return
        }

        try {
          const json = JSON.parse(line.slice(6))
          const text = json.choices?.[0]?.delta?.content || ''
          if (text) {
            yield { content: text, done: false }
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  /**
   * Get current model info
   */
  getModelInfo(): { model: OpenRouterModel; temperature: number; maxTokens: number } {
    return {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    }
  }

  /**
   * List available free models
   */
  static getFreeModels(): string[] {
    return Object.values(OPENROUTER_FREE_MODELS)
  }
}
