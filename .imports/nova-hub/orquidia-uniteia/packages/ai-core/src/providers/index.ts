/**
 * @orquestra/ai-core - Providers Index
 * SOTA 2026: Multi-provider support with fallback chain
 *
 * Providers: Gemini (primary, free) > Workers AI (free) > OpenRouter (fallback, free)
 */

// Import providers for factory use
import {
  GEMINI_MODELS as GEMINI_MODELS_CONST,
  GeminiProvider as GeminiProviderClass,
} from './gemini'
import {
  OPENROUTER_FREE_MODELS as OPENROUTER_FREE_MODELS_CONST,
  OpenRouterProvider as OpenRouterProviderClass,
} from './openrouter'
import {
  WORKERS_AI_MODELS as WORKERS_AI_MODELS_CONST,
  WorkersAIProvider as WorkersAIProviderClass,
} from './workers-ai'

// Re-export providers
export { GeminiProviderClass as GeminiProvider, GEMINI_MODELS_CONST as GEMINI_MODELS }
export { WorkersAIProviderClass as WorkersAIProvider, WORKERS_AI_MODELS_CONST as WORKERS_AI_MODELS }
export {
  OpenRouterProviderClass as OpenRouterProvider,
  OPENROUTER_FREE_MODELS_CONST as OPENROUTER_FREE_MODELS,
}

// Re-export types
export type { GeminiConfig, GeminiModel, GeminiResponse, GeminiChatMessage } from './gemini'
export type { WorkersAIConfig, WorkersAIModel, WorkersAIResponse } from './workers-ai'
export type {
  OpenRouterConfig,
  OpenRouterModel,
  OpenRouterResponse,
  ChatMessage,
} from './openrouter'

// Shared type - only export once
export type { StreamChunk } from './workers-ai'

// =============================================================================
// UNIFIED PROVIDER TYPES
// =============================================================================

export type AIProviderType = 'gemini' | 'workers-ai' | 'openrouter'

export interface UnifiedChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface UnifiedChatResponse {
  content: string
  model: string
  provider: AIProviderType
  tokensUsed: {
    prompt: number
    completion: number
    total: number
  }
  latencyMs: number
}

// =============================================================================
// PROVIDER FACTORY
// =============================================================================

export interface ProviderConfig {
  geminiApiKey?: string
  workersAIAccountId?: string
  workersAIToken?: string
  openrouterApiKey?: string
  preferredProvider?: AIProviderType
  temperature?: number
  maxTokens?: number
}

/**
 * Get the best available provider based on configured keys
 * Priority: Gemini (free tier) > Workers AI (free tier) > OpenRouter (free tier)
 */
export function getAvailableProviders(config: ProviderConfig): AIProviderType[] {
  const available: AIProviderType[] = []

  if (config.geminiApiKey) available.push('gemini')
  if (config.workersAIAccountId && config.workersAIToken) available.push('workers-ai')
  if (config.openrouterApiKey) available.push('openrouter')

  return available
}

/**
 * Create a provider instance
 */
export function createProvider(
  type: AIProviderType,
  config: ProviderConfig,
): GeminiProviderClass | WorkersAIProviderClass | OpenRouterProviderClass {
  const temperature = config.temperature ?? 0.7
  const maxTokens = config.maxTokens ?? 4096

  switch (type) {
    case 'gemini':
      if (!config.geminiApiKey) throw new Error('Gemini API key required')
      return new GeminiProviderClass({
        apiKey: config.geminiApiKey,
        temperature,
        maxTokens,
      })

    case 'workers-ai':
      if (!config.workersAIAccountId || !config.workersAIToken) {
        throw new Error('Workers AI account ID and token required')
      }
      return new WorkersAIProviderClass({
        accountId: config.workersAIAccountId,
        apiToken: config.workersAIToken,
        temperature,
        maxTokens,
      })

    case 'openrouter':
      if (!config.openrouterApiKey) throw new Error('OpenRouter API key required')
      return new OpenRouterProviderClass({
        apiKey: config.openrouterApiKey,
        temperature,
        maxTokens,
      })

    default:
      throw new Error(`Unknown provider: ${type}`)
  }
}
