/**
 * Chat API Types & Handlers
 * @orquestra/orchestrator
 *
 * Integrates with @orquestra/ai-core OrchestratorAgent
 * Multi-provider support: Gemini (free) > OpenRouter (free)
 */

import { OrchestratorAgent } from '@orquestra/ai-core'

// =============================================================================
// TYPES
// =============================================================================

export interface ChatRequest {
  message: string
  agentId?: string
  sessionId?: string
  additionalContext?: string
}

export interface ChatResponse {
  response: string
  timestamp: number
  model: string
  provider?: string
  tokensUsed?: number
  latencyMs?: number
  contextIncluded: boolean
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error'
  timestamp: number
  version: string
  services: Record<string, string>
  aiReady: boolean
  activeProvider?: string
}

export interface StreamChunk {
  content: string
  done: boolean
}

export interface EnvBindings {
  GEMINI_API_KEY?: string
  OPENROUTER_API_KEY?: string
  DB?: D1Database
  KV_STATIC_HTML?: KVNamespace
}

// =============================================================================
// AGENT SINGLETON
// =============================================================================

// Session-based agent cache (in production, use KV or Durable Objects)
const agentSessions = new Map<string, OrchestratorAgent>()

/**
 * Get or create an agent for a session
 */
function getAgent(sessionId?: string, env?: EnvBindings): OrchestratorAgent {
  const key = sessionId || 'default'

  if (!agentSessions.has(key)) {
    const agent = new OrchestratorAgent({
      geminiApiKey: env?.GEMINI_API_KEY,
      openrouterApiKey: env?.OPENROUTER_API_KEY,
      temperature: 0.7,
      maxTokens: 4096,
      maxHistoryLength: 20,
    })
    agent.initialize()
    agentSessions.set(key, agent)
  }

  // biome-ignore lint/style/noNonNullAssertion: Map.has guarantees existence
  return agentSessions.get(key)!
}

// =============================================================================
// HANDLERS
// =============================================================================

/**
 * Handle chat message with AI response
 * Always includes UniTeiaAI global context
 */
export async function handleChat(request: ChatRequest, env?: EnvBindings): Promise<ChatResponse> {
  const agent = getAgent(request.sessionId, env)

  try {
    const result = await agent.process(request.message, {
      additionalContext: request.additionalContext,
    })

    return {
      response: result.content,
      timestamp: Date.now(),
      model: result.model,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs,
      contextIncluded: result.contextIncluded,
    }
  } catch (error) {
    console.error('[CHAT_API] Error processing message:', error)
    return {
      response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      timestamp: Date.now(),
      model: 'error',
      contextIncluded: false,
    }
  }
}

/**
 * Stream chat response for real-time UI
 */
export async function* handleChatStream(
  request: ChatRequest,
  env?: EnvBindings,
): AsyncGenerator<StreamChunk> {
  const agent = getAgent(request.sessionId, env)

  try {
    for await (const chunk of agent.stream(request.message, {
      additionalContext: request.additionalContext,
    })) {
      yield chunk
    }
  } catch (error) {
    console.error('[CHAT_API] Stream error:', error)
    yield { content: 'Erro na conexão de streaming.', done: true }
  }
}

/**
 * Execute specific AI task
 */
export async function handleTask(
  taskType: 'analyze' | 'generate' | 'summarize' | 'translate',
  input: string,
  metadata?: Record<string, unknown>,
  env?: EnvBindings,
): Promise<{
  success: boolean
  output: string
  metadata?: Record<string, unknown>
}> {
  const agent = getAgent(undefined, env)
  return agent.executeTask(taskType, input, metadata)
}

/**
 * Clear session history
 */
export function clearSession(sessionId?: string): void {
  const key = sessionId || 'default'
  const agent = agentSessions.get(key)
  if (agent) {
    agent.clearHistory()
  }
}

/**
 * Health check handler with AI status
 */
export async function handleHealth(env?: EnvBindings): Promise<HealthResponse> {
  const agent = getAgent(undefined, env)
  const providerInfo = agent.getProviderInfo()

  return {
    status: providerInfo.isReady ? 'ok' : 'degraded',
    timestamp: Date.now(),
    version: '0.1.0',
    services: {
      orchestrator: 'online',
      'ai-core': providerInfo.isReady ? `active (${providerInfo.provider})` : 'mock mode',
      database: env?.DB ? 'connected' : 'not configured',
    },
    aiReady: providerInfo.isReady,
    activeProvider: providerInfo.provider || undefined,
  }
}
