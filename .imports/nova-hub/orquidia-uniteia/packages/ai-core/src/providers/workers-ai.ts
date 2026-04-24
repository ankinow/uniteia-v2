/**
 * @orquestra/ai-core - Workers AI Provider
 * SOTA 2026: Cloudflare Workers AI integration with @cf/meta/llama-3-8b-instruct
 *
 * Features:
 * - Free tier available (10K requests/day on free plan)
 * - @cf/meta/llama-3-8b-instruct (primary free model)
 * - @cf/meta/llama-3-3-70b-instruct (fallback, higher quality)
 * - Automatic fallback from Gemini API failures
 * - Edge-optimized for Cloudflare Workers
 */

// Note: getAIBinding() is not used in this package to avoid vinxi dependency
// In the orchestrator app, pass the AI binding directly if needed

// =============================================================================
// TYPES
// =============================================================================

export interface WorkersAIConfig {
  accountId: string
  apiToken: string
  model?: WorkersAIModel
  temperature?: number
  maxTokens?: number
}

export interface WorkersAIChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface WorkersAIResponse {
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
// CONSTANTS
// =============================================================================

export const WORKERS_AI_MODELS = {
  // Primary: Llama 3 8B - Fast, free tier
  LLAMA_3_8B: '@cf/meta/llama-3-8b-instruct',

  // Fallback: Llama 3 70B - Higher quality
  LLAMA_3_70B: '@cf/meta/llama-3-3-70b-instruct',

  // Thinking: For reasoning tasks
  LLAMA_3_8B_THINKING: '@cf/meta/llama-3-8b-instruct-thinking',
} as const

export type WorkersAIModel = (typeof WORKERS_AI_MODELS)[keyof typeof WORKERS_AI_MODELS]

// =============================================================================
// PROVIDER CLASS
// =============================================================================

export class WorkersAIProvider {
  private accountId: string
  private apiToken: string
  private model: WorkersAIModel
  private temperature: number
  private maxTokens: number

  constructor(config: WorkersAIConfig) {
    if (!config.accountId) {
      throw new Error('[WORKERS_AI] Account ID is required')
    }
    if (!config.apiToken) {
      throw new Error('[WORKERS_AI] API Token is required')
    }

    this.accountId = config.accountId
    this.apiToken = config.apiToken
    this.model = config.model || WORKERS_AI_MODELS.LLAMA_3_8B
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens ?? 4096
  }

  /**
   * Send a chat completion request using REST API
   * Note: For Cloudflare Workers with AI binding, use the orchestrator app's implementation
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      additionalContext?: string
      model?: WorkersAIModel
      temperature?: number
      maxTokens?: number
    },
  ): Promise<WorkersAIResponse> {
    const start = performance.now()

    // Use REST API
    const model = options?.model || this.model
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`

    // Convert messages to Llama format
    const llamaMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: llamaMessages,
          temperature: options?.temperature ?? this.temperature,
          max_tokens: options?.maxTokens ?? this.maxTokens,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Workers AI API error ${response.status}: ${errorText}`)
      }

      const data = (await response.json()) as {
        result?: {
          response?: string
          usage?: {
            prompt_tokens?: number
            completion_tokens?: number
            total_tokens?: number
          }
        }
      }
      const latencyMs = performance.now() - start

      const result = data.result || {}

      return {
        content: result.response || '',
        model,
        tokensUsed: {
          prompt: result.usage?.prompt_tokens || 0,
          completion: result.usage?.completion_tokens || 0,
          total: result.usage?.total_tokens || 0,
        },
        finishReason: 'stop',
        latencyMs,
      }
    } catch (error) {
      // Try fallback model
      if (model === WORKERS_AI_MODELS.LLAMA_3_8B) {
        console.warn('[WORKERS_AI] Llama 3 8B failed, trying Llama 3 70B')
        return this.chat(messages, { ...options, model: WORKERS_AI_MODELS.LLAMA_3_70B })
      }
      throw error
    }
  }

  /**
   * Chat using Cloudflare AI binding (free within Workers)
   */
  private async chatWithBinding(
    aiBinding: {
      run: (model: string, input: Record<string, unknown>) => Promise<{ response?: string }>
    },
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      additionalContext?: string
      model?: WorkersAIModel
      temperature?: number
      maxTokens?: number
    },
  ): Promise<WorkersAIResponse> {
    const start = performance.now()
    const model = options?.model || this.model

    // Convert messages to the format expected by the AI binding
    const conversation = messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    const result = await aiBinding.run(model, {
      messages: conversation,
      temperature: options?.temperature ?? this.temperature,
      max_tokens: options?.maxTokens ?? this.maxTokens,
    })

    const latencyMs = performance.now() - start

    return {
      content: result.response || '',
      model,
      tokensUsed: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
      finishReason: 'stop',
      latencyMs,
    }
  }

  /**
   * Stream a chat completion response
   */
  async *stream(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      additionalContext?: string
      model?: WorkersAIModel
    },
  ): AsyncGenerator<StreamChunk> {
    const model = options?.model || this.model
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`

    const llamaMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: llamaMessages,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`Workers AI stream error: ${response.status}`)
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
        try {
          const json = JSON.parse(line.slice(6))
          const text = json.result?.response || ''
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
  getModelInfo(): { model: WorkersAIModel; temperature: number; maxTokens: number } {
    return {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    }
  }
}
