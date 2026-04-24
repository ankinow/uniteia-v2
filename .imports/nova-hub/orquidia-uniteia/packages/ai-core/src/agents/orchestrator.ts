/**
 * @orquestra/ai-core - Orchestrator Agent
 * SOTA 2026: Central AI orchestration with multi-provider support
 *
 * Features:
 * - Multi-provider support (Gemini, Workers AI, OpenRouter)
 * - Automatic fallback chain
 * - Global context injection (ALWAYS)
 * - Conversation history management
 * - Streaming responses
 *
 * NOTE: Mock mode DISABLED by default. Provider must be available.
 */

import type { AIProvider, Agent, ChatMessage as SharedChatMessage } from '@orquestra/shared'
import { GLOBAL_CONTEXT, buildGlobalSystemPrompt } from '../context'
import {
  type AIProviderType,
  GeminiProvider,
  OpenRouterProvider,
  type ProviderConfig,
  type UnifiedChatMessage,
  type UnifiedChatResponse,
  type WorkersAIProvider,
  createProvider,
  getAvailableProviders,
} from '../providers'

// =============================================================================
// TYPES
// =============================================================================

export interface OrchestratorConfig {
  // API Keys
  geminiApiKey?: string
  workersAIAccountId?: string
  workersAIToken?: string
  openrouterApiKey?: string

  // Preferences
  preferredProvider?: AIProviderType
  temperature?: number
  maxTokens?: number
  maxHistoryLength?: number
}

export interface OrchestratorResponse {
  content: string
  model: string
  provider: AIProviderType
  tokensUsed: number
  latencyMs: number
  contextIncluded: boolean
}

export interface TaskResult {
  success: boolean
  output: string
  metadata?: Record<string, unknown>
}

// =============================================================================
// ORCHESTRATOR AGENT
// =============================================================================

export class OrchestratorAgent {
  private provider: GeminiProvider | WorkersAIProvider | OpenRouterProvider | null = null
  private activeProviderType: AIProviderType | null = null
  private conversationHistory: UnifiedChatMessage[] = []
  private maxHistoryLength: number
  private isInitialized = false
  private config: OrchestratorConfig

  constructor(config: OrchestratorConfig = {}) {
    this.config = config
    this.maxHistoryLength = config.maxHistoryLength ?? 20
  }

  /**
   * Initialize the agent with the best available provider
   * Priority: Gemini (free tier) > Workers AI (free tier) > OpenRouter (free tier)
   *
   * @throws Error if no provider is available
   */
  initialize(overrides?: Partial<OrchestratorConfig>): void {
    const config = { ...this.config, ...overrides }

    // Try providers in order of preference
    const providerOrder: AIProviderType[] = config.preferredProvider
      ? [config.preferredProvider, 'gemini', 'openrouter']
      : ['gemini', 'openrouter']

    // Remove duplicates
    const uniqueProviders = [...new Set(providerOrder)]

    for (const providerType of uniqueProviders) {
      try {
        const providerConfig: ProviderConfig = {
          geminiApiKey: config.geminiApiKey,
          openrouterApiKey: config.openrouterApiKey,
          temperature: config.temperature ?? 0.7,
          maxTokens: config.maxTokens ?? 4096,
        }

        // Check if we have the key for this provider
        if (providerType === 'gemini' && !config.geminiApiKey) continue
        if (providerType === 'openrouter' && !config.openrouterApiKey) continue

        this.provider = createProvider(providerType, providerConfig)
        this.activeProviderType = providerType
        this.isInitialized = true

        console.log(`[ORCHESTRATOR] Initialized with ${providerType}`)
        return
      } catch (error) {
        console.warn(`[ORCHESTRATOR] Failed to initialize ${providerType}:`, error)
      }
    }

    // NO MOCK MODE - throw error instead
    throw new Error(
      '[ORCHESTRATOR] No AI provider available. ' +
        'Please configure one of: GEMINI_API_KEY, OPENROUTER_API_KEY',
    )
  }

  /**
   * Process a user message and return AI response
   * ALWAYS includes global context
   *
   * @throws Error if agent not initialized
   */
  async process(
    input: string,
    options?: {
      additionalContext?: string
      skipHistory?: boolean
    },
  ): Promise<OrchestratorResponse> {
    // Add user message to history
    if (!options?.skipHistory) {
      this.addToHistory({ role: 'user', content: input })
    }

    // Check initialization - NO MOCK MODE
    if (!this.isInitialized || !this.provider) {
      throw new Error(
        '[ORCHESTRATOR] Agent not initialized. ' +
          'Call initialize() with a valid API key before processing.',
      )
    }

    try {
      // Convert history for provider
      const messages = this.conversationHistory.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      let response: UnifiedChatResponse

      // Call appropriate provider
      if (this.provider instanceof GeminiProvider) {
        const result = await this.provider.chat(messages, {
          additionalContext: options?.additionalContext,
        })
        response = {
          ...result,
          provider: 'gemini',
        }
      } else if (this.provider instanceof OpenRouterProvider) {
        const result = await this.provider.chat(
          this.conversationHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { additionalContext: options?.additionalContext },
        )
        response = {
          ...result,
          provider: 'openrouter',
        }
      } else {
        throw new Error('Unknown provider type')
      }

      // Add response to history
      if (!options?.skipHistory) {
        this.addToHistory({ role: 'assistant', content: response.content })
      }

      return {
        content: response.content,
        model: response.model,
        provider: response.provider,
        tokensUsed: response.tokensUsed.total,
        latencyMs: response.latencyMs,
        contextIncluded: true,
      }
    } catch (error) {
      // Try fallback provider
      const fallbackResult = await this.tryFallback(input, options)
      if (fallbackResult) return fallbackResult

      // Return error response
      return {
        content: `Erro ao processar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        model: 'error',
        provider: this.activeProviderType || 'gemini',
        tokensUsed: 0,
        latencyMs: 0,
        contextIncluded: false,
      }
    }
  }

  /**
   * Try fallback providers when primary fails
   */
  private async tryFallback(
    input: string,
    options?: { additionalContext?: string; skipHistory?: boolean },
  ): Promise<OrchestratorResponse | null> {
    const fallbackOrder: AIProviderType[] = ['gemini', 'openrouter'].filter(
      (p) => p !== this.activeProviderType,
    ) as AIProviderType[]

    for (const providerType of fallbackOrder) {
      try {
        const providerConfig: ProviderConfig = {
          geminiApiKey: this.config.geminiApiKey,
          openrouterApiKey: this.config.openrouterApiKey,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
        }

        if (providerType === 'gemini' && !this.config.geminiApiKey) continue
        if (providerType === 'openrouter' && !this.config.openrouterApiKey) continue

        console.warn(`[ORCHESTRATOR] Trying fallback provider: ${providerType}`)

        const fallbackProvider = createProvider(providerType, providerConfig)
        this.provider = fallbackProvider
        this.activeProviderType = providerType

        // Retry with new provider
        return this.process(input, { ...options, skipHistory: true })
      } catch {}
    }

    return null
  }

  /**
   * Stream a response for real-time UI updates
   */
  async *stream(
    input: string,
    options?: { additionalContext?: string },
  ): AsyncGenerator<{ content: string; done: boolean }> {
    if (!this.isInitialized || !this.provider) {
      throw new Error('[ORCHESTRATOR] Agent not initialized')
    }

    this.addToHistory({ role: 'user', content: input })

    let fullContent = ''
    const messages = this.conversationHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    try {
      if (this.provider instanceof GeminiProvider) {
        for await (const chunk of this.provider.stream(messages, options)) {
          fullContent += chunk.content
          yield chunk
        }
      } else if (this.provider instanceof OpenRouterProvider) {
        for await (const chunk of this.provider.stream(
          this.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
          options,
        )) {
          fullContent += chunk.content
          yield chunk
        }
      }
    } catch (error) {
      yield { content: `Erro: ${error instanceof Error ? error.message : 'Unknown'}`, done: true }
    }

    this.addToHistory({ role: 'assistant', content: fullContent })
  }

  /**
   * Execute a specific task with dedicated context
   */
  async executeTask(
    taskType: 'analyze' | 'generate' | 'summarize' | 'translate',
    input: string,
    metadata?: Record<string, unknown>,
  ): Promise<TaskResult> {
    const taskContextMap: Record<string, string> = {
      analyze: 'Task: Analyze the following content for insights, patterns, and recommendations.',
      generate: 'Task: Generate high-quality, SEO-optimized content based on the following input.',
      summarize: 'Task: Provide a concise summary of the following content.',
      translate: 'Task: Translate the following content while maintaining context and meaning.',
    }

    const taskContext = taskContextMap[taskType] || ''
    const fullContext = metadata
      ? `${taskContext}\n\nMetadata: ${JSON.stringify(metadata, null, 2)}`
      : taskContext

    try {
      const response = await this.process(input, {
        additionalContext: fullContext,
        skipHistory: true,
      })

      return {
        success: true,
        output: response.content,
        metadata: {
          model: response.model,
          provider: response.provider,
          tokensUsed: response.tokensUsed,
          latencyMs: response.latencyMs,
        },
      }
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): UnifiedChatMessage[] {
    return [...this.conversationHistory]
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = []
  }

  /**
   * Get current context info
   */
  getContextInfo(): typeof GLOBAL_CONTEXT {
    return GLOBAL_CONTEXT
  }

  /**
   * Get current provider info
   */
  getProviderInfo(): { provider: AIProviderType | null; isReady: boolean } {
    return {
      provider: this.activeProviderType,
      isReady: this.isInitialized,
    }
  }

  /**
   * Check if agent is initialized with real provider
   */
  isReady(): boolean {
    return this.isInitialized
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private addToHistory(message: UnifiedChatMessage): void {
    this.conversationHistory.push(message)

    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength)
    }
  }
}
