/**
 * @orquestra/ai-core - Gemini Provider
 * SOTA 2026: Google Gemini API integration
 *
 * Features:
 * - Gemini 2.0 Flash (primary - free tier)
 * - Gemini 1.5 Flash (fallback)
 * - Automatic context injection
 * - Streaming support
 */

import { buildGlobalSystemPrompt, validateContext } from '../context'

// =============================================================================
// TYPES
// =============================================================================

export interface GeminiConfig {
  apiKey: string
  model?: GeminiModel
  temperature?: number
  maxTokens?: number
}

export interface GeminiChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface GeminiResponse {
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

export const GEMINI_MODELS = {
  // Primary: Gemini 2.0 Flash - Fast, free tier
  FLASH_2_0: 'gemini-2.0-flash',

  // Fallback: Gemini 1.5 Flash - Stable
  FLASH_1_5: 'gemini-1.5-flash',

  // Thinking: Gemini 2.0 Flash Thinking - Reasoning
  FLASH_THINKING: 'gemini-2.0-flash-thinking-exp',

  // Pro: Gemini 1.5 Pro - Higher quality
  PRO_1_5: 'gemini-1.5-pro',
} as const

export type GeminiModel = (typeof GEMINI_MODELS)[keyof typeof GEMINI_MODELS]

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

// =============================================================================
// PROVIDER CLASS
// =============================================================================

export class GeminiProvider {
  private apiKey: string
  private model: GeminiModel
  private temperature: number
  private maxTokens: number

  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('[GEMINI_PROVIDER] API key is required')
    }

    this.apiKey = config.apiKey
    this.model = config.model || GEMINI_MODELS.FLASH_2_0
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens ?? 4096
  }

  /**
   * Send a chat completion request with automatic context injection
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      additionalContext?: string
      model?: GeminiModel
      temperature?: number
      maxTokens?: number
    },
  ): Promise<GeminiResponse> {
    const start = performance.now()

    // Build system prompt with global context
    const globalSystemPrompt = buildGlobalSystemPrompt(options?.additionalContext)
    validateContext(globalSystemPrompt)

    // Convert messages to Gemini format
    const geminiMessages: GeminiChatMessage[] = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Prepend system instruction as first user message
    const contents: GeminiChatMessage[] = [
      { role: 'user', parts: [{ text: `[SYSTEM CONTEXT]\n${globalSystemPrompt}\n[END CONTEXT]` }] },
      { role: 'model', parts: [{ text: 'Entendido. Vou seguir o contexto fornecido.' }] },
      ...geminiMessages,
    ]

    const model = options?.model || this.model
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${this.apiKey}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? this.temperature,
            maxOutputTokens: options?.maxTokens ?? this.maxTokens,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini API error ${response.status}: ${errorText}`)
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> }
          finishReason?: string
        }>
        usageMetadata?: {
          promptTokenCount?: number
          candidatesTokenCount?: number
          totalTokenCount?: number
        }
      }
      const latencyMs = performance.now() - start

      const candidate = data.candidates?.[0]
      const content = candidate?.content?.parts?.[0]?.text || ''
      const usageMetadata = data.usageMetadata || {}

      return {
        content,
        model,
        tokensUsed: {
          prompt: usageMetadata.promptTokenCount || 0,
          completion: usageMetadata.candidatesTokenCount || 0,
          total: usageMetadata.totalTokenCount || 0,
        },
        finishReason: candidate?.finishReason || 'unknown',
        latencyMs,
      }
    } catch (error) {
      // Try fallback model
      if (model === GEMINI_MODELS.FLASH_2_0) {
        console.warn('[GEMINI_PROVIDER] Flash 2.0 failed, trying Flash 1.5')
        return this.chat(messages, { ...options, model: GEMINI_MODELS.FLASH_1_5 })
      }
      throw error
    }
  }

  /**
   * Stream a chat completion response
   */
  async *stream(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      additionalContext?: string
      model?: GeminiModel
    },
  ): AsyncGenerator<StreamChunk> {
    const globalSystemPrompt = buildGlobalSystemPrompt(options?.additionalContext)
    validateContext(globalSystemPrompt)

    const geminiMessages: GeminiChatMessage[] = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const contents: GeminiChatMessage[] = [
      { role: 'user', parts: [{ text: `[SYSTEM CONTEXT]\n${globalSystemPrompt}\n[END CONTEXT]` }] },
      { role: 'model', parts: [{ text: 'Entendido.' }] },
      ...geminiMessages,
    ]

    const model = options?.model || this.model
    const url = `${GEMINI_API_BASE}/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
        },
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error(`Gemini stream error: ${response.status}`)
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
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
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
  getModelInfo(): { model: GeminiModel; temperature: number; maxTokens: number } {
    return {
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    }
  }
}
