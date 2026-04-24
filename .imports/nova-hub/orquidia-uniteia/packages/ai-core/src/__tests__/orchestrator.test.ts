/**
 * @orquestra/ai-core - Orchestrator Agent Test Suite
 * SOTA 2026: Tests for multi-provider orchestration agent
 */

import { afterAll, beforeEach, describe, expect, mock, test } from 'bun:test'
import { OrchestratorAgent, type OrchestratorConfig } from '../agents/orchestrator'
import { GLOBAL_CONTEXT } from '../context'

// =============================================================================
// MOCK: Gemini API via fetch mock
// =============================================================================

const createGeminiResponse = (content: string) => ({
  candidates: [
    {
      content: { parts: [{ text: content }] },
      finishReason: 'STOP',
    },
  ],
  usageMetadata: {
    promptTokenCount: 50,
    candidatesTokenCount: 100,
    totalTokenCount: 150,
  },
})

const originalFetch = globalThis.fetch

function mockGeminiFetch(content = 'Resposta do AI') {
  globalThis.fetch = mock(() =>
    Promise.resolve(
      new Response(JSON.stringify(createGeminiResponse(content)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  ) as typeof fetch
}

// =============================================================================
// TESTS
// =============================================================================

describe('OrchestratorAgent', () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
  })

  // ---------------------------------------------------------------------------
  // Constructor & Initialization
  // ---------------------------------------------------------------------------

  describe('constructor', () => {
    test('creates instance with default config', () => {
      const agent = new OrchestratorAgent()
      expect(agent).toBeDefined()
      expect(agent.isReady()).toBe(false)
    })

    test('creates instance with custom config', () => {
      const agent = new OrchestratorAgent({
        geminiApiKey: 'test-key',
        maxHistoryLength: 10,
      })
      expect(agent).toBeDefined()
    })
  })

  describe('initialize', () => {
    test('initializes with Gemini API key', () => {
      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()
      expect(agent.isReady()).toBe(true)
      expect(agent.getProviderInfo().provider).toBe('gemini')
    })

    test('throws when no API keys configured', () => {
      const agent = new OrchestratorAgent()
      expect(() => agent.initialize()).toThrow('No AI provider available')
    })

    test('respects preferred provider', () => {
      const agent = new OrchestratorAgent({
        geminiApiKey: 'gemini-key',
        openrouterApiKey: 'openrouter-key',
        preferredProvider: 'openrouter',
      })
      agent.initialize()
      expect(agent.getProviderInfo().provider).toBe('openrouter')
    })

    test('falls through to next provider if preferred is not available', () => {
      const agent = new OrchestratorAgent({
        geminiApiKey: 'gemini-key',
        preferredProvider: 'openrouter', // no openrouter key
      })
      agent.initialize()
      expect(agent.getProviderInfo().provider).toBe('gemini')
    })

    test('accepts overrides in initialize', () => {
      const agent = new OrchestratorAgent()
      agent.initialize({ geminiApiKey: 'override-key' })
      expect(agent.isReady()).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // process
  // ---------------------------------------------------------------------------

  describe('process', () => {
    test('throws when not initialized', async () => {
      const agent = new OrchestratorAgent()
      await expect(agent.process('test')).rejects.toThrow('not initialized')
    })

    test('returns response from Gemini provider', async () => {
      mockGeminiFetch('Análise completa do produto')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      const response = await agent.process('Analise este produto')

      expect(response.content).toBe('Análise completa do produto')
      expect(response.provider).toBe('gemini')
      expect(response.contextIncluded).toBe(true)
      expect(response.tokensUsed).toBeGreaterThan(0)
    })

    test('adds messages to history', async () => {
      mockGeminiFetch('Response')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      await agent.process('Hello')
      const history = agent.getHistory()

      expect(history.length).toBe(2) // user + assistant
      expect(history[0].role).toBe('user')
      expect(history[0].content).toBe('Hello')
      expect(history[1].role).toBe('assistant')
      expect(history[1].content).toBe('Response')
    })

    test('skipHistory prevents history addition', async () => {
      mockGeminiFetch('Response')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      await agent.process('Hello', { skipHistory: true })
      const history = agent.getHistory()

      expect(history.length).toBe(0)
    })

    test('handles API error gracefully (returns error content)', async () => {
      globalThis.fetch = mock(() =>
        Promise.resolve(new Response('Server Error', { status: 500 })),
      ) as typeof fetch

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      const response = await agent.process('test')
      // Should return error response (not throw) since there's no fallback available
      expect(response.content).toContain('Erro')
      expect(response.contextIncluded).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // History Management
  // ---------------------------------------------------------------------------

  describe('history management', () => {
    test('getHistory returns a copy', async () => {
      mockGeminiFetch('Response')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      await agent.process('Hello')
      const history = agent.getHistory()
      history.push({ role: 'user', content: 'injected' })

      expect(agent.getHistory().length).toBe(2) // original unchanged
    })

    test('clearHistory removes all messages', async () => {
      mockGeminiFetch('Response')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      await agent.process('Hello')
      expect(agent.getHistory().length).toBe(2)

      agent.clearHistory()
      expect(agent.getHistory().length).toBe(0)
    })

    test('history is truncated at maxHistoryLength', async () => {
      mockGeminiFetch('Response')

      const agent = new OrchestratorAgent({
        geminiApiKey: 'test-key',
        maxHistoryLength: 4,
      })
      agent.initialize()

      // Send 3 messages = 6 entries (user+assistant), but max is 4
      await agent.process('msg1')
      await agent.process('msg2')
      await agent.process('msg3')

      const history = agent.getHistory()
      expect(history.length).toBe(4) // truncated to last 4
    })
  })

  // ---------------------------------------------------------------------------
  // executeTask
  // ---------------------------------------------------------------------------

  describe('executeTask', () => {
    test('executes analyze task', async () => {
      mockGeminiFetch('Analysis result')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      const result = await agent.executeTask('analyze', 'Analyze this product')

      expect(result.success).toBe(true)
      expect(result.output).toBe('Analysis result')
      expect(result.metadata?.provider).toBe('gemini')
    })

    test('executes generate task', async () => {
      mockGeminiFetch('Generated content')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      const result = await agent.executeTask('generate', 'Generate SEO content')
      expect(result.success).toBe(true)
      expect(result.output).toBe('Generated content')
    })

    test('returns failure on error', async () => {
      const agent = new OrchestratorAgent() // not initialized
      const result = await agent.executeTask('analyze', 'test')
      expect(result.success).toBe(false)
      expect(result.output).toContain('not initialized')
    })

    test('does not add task messages to history', async () => {
      mockGeminiFetch('Task result')

      const agent = new OrchestratorAgent({ geminiApiKey: 'test-key' })
      agent.initialize()

      await agent.executeTask('summarize', 'Summarize this')
      expect(agent.getHistory().length).toBe(0)
    })
  })

  // ---------------------------------------------------------------------------
  // Context Info
  // ---------------------------------------------------------------------------

  describe('getContextInfo', () => {
    test('returns GLOBAL_CONTEXT', () => {
      const agent = new OrchestratorAgent()
      const ctx = agent.getContextInfo()
      expect(ctx).toEqual(GLOBAL_CONTEXT)
      expect(ctx.platform).toBe('UniTeiaAI Orchestrator')
    })
  })

  describe('getProviderInfo', () => {
    test('shows not ready when uninitialized', () => {
      const agent = new OrchestratorAgent()
      const info = agent.getProviderInfo()
      expect(info.isReady).toBe(false)
      expect(info.provider).toBeNull()
    })

    test('shows provider when initialized', () => {
      const agent = new OrchestratorAgent({ geminiApiKey: 'key' })
      agent.initialize()
      const info = agent.getProviderInfo()
      expect(info.isReady).toBe(true)
      expect(info.provider).toBe('gemini')
    })
  })
})
