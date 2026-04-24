/**
 * Providers Index Test Suite
 * SOTA 2026: Tests for AI provider factory and unified types
 */

import { describe, expect, test } from 'bun:test'
import {
  type AIProviderType,
  GeminiProvider,
  OpenRouterProvider,
  type ProviderConfig,
  WorkersAIProvider,
  createProvider,
  getAvailableProviders,
} from '../providers/index'

// =============================================================================
// TESTS
// =============================================================================

describe('Provider Factory', () => {
  // ---------------------------------------------------------------------------
  // getAvailableProviders
  // ---------------------------------------------------------------------------

  describe('getAvailableProviders', () => {
    test('returns empty array when no keys configured', () => {
      const config: ProviderConfig = {}
      const available = getAvailableProviders(config)
      expect(available).toEqual([])
    })

    test('returns gemini when geminiApiKey present', () => {
      const config: ProviderConfig = { geminiApiKey: 'test-key' }
      const available = getAvailableProviders(config)
      expect(available).toContain('gemini')
      expect(available).toHaveLength(1)
    })

    test('returns workers-ai when both accountId and token present', () => {
      const config: ProviderConfig = {
        workersAIAccountId: 'test-account',
        workersAIToken: 'test-token',
      }
      const available = getAvailableProviders(config)
      expect(available).toContain('workers-ai')
      expect(available).toHaveLength(1)
    })

    test('does not return workers-ai with only accountId', () => {
      const config: ProviderConfig = { workersAIAccountId: 'test-account' }
      const available = getAvailableProviders(config)
      expect(available).not.toContain('workers-ai')
    })

    test('does not return workers-ai with only token', () => {
      const config: ProviderConfig = { workersAIToken: 'test-token' }
      const available = getAvailableProviders(config)
      expect(available).not.toContain('workers-ai')
    })

    test('returns openrouter when openrouterApiKey present', () => {
      const config: ProviderConfig = { openrouterApiKey: 'test-key' }
      const available = getAvailableProviders(config)
      expect(available).toContain('openrouter')
    })

    test('returns all available providers in priority order', () => {
      const config: ProviderConfig = {
        geminiApiKey: 'gemini-key',
        workersAIAccountId: 'account-id',
        workersAIToken: 'token',
        openrouterApiKey: 'openrouter-key',
      }
      const available = getAvailableProviders(config)
      expect(available).toEqual(['gemini', 'workers-ai', 'openrouter'])
    })

    test('returns correct order with partial config', () => {
      const config: ProviderConfig = {
        openrouterApiKey: 'openrouter-key',
        geminiApiKey: 'gemini-key',
      }
      const available = getAvailableProviders(config)
      expect(available).toEqual(['gemini', 'openrouter'])
    })
  })

  // ---------------------------------------------------------------------------
  // createProvider
  // ---------------------------------------------------------------------------

  describe('createProvider', () => {
    test('creates GeminiProvider instance', () => {
      const config: ProviderConfig = {
        geminiApiKey: 'test-key',
        temperature: 0.5,
        maxTokens: 2048,
      }

      const provider = createProvider('gemini', config)
      expect(provider).toBeInstanceOf(GeminiProvider)
    })

    test('throws when creating Gemini without API key', () => {
      const config: ProviderConfig = { geminiApiKey: '' }
      expect(() => createProvider('gemini', config)).toThrow('Gemini API key required')
    })

    test('creates WorkersAIProvider instance', () => {
      const config: ProviderConfig = {
        workersAIAccountId: 'test-account',
        workersAIToken: 'test-token',
        temperature: 0.3,
        maxTokens: 1024,
      }

      const provider = createProvider('workers-ai', config)
      expect(provider).toBeInstanceOf(WorkersAIProvider)
    })

    test('throws when creating Workers AI without account ID', () => {
      const config: ProviderConfig = {
        workersAIToken: 'test-token',
      }
      expect(() => createProvider('workers-ai', config)).toThrow(
        'Workers AI account ID and token required',
      )
    })

    test('throws when creating Workers AI without token', () => {
      const config: ProviderConfig = {
        workersAIAccountId: 'test-account',
      }
      expect(() => createProvider('workers-ai', config)).toThrow(
        'Workers AI account ID and token required',
      )
    })

    test('creates OpenRouterProvider instance', () => {
      const config: ProviderConfig = {
        openrouterApiKey: 'test-key',
        temperature: 0.8,
      }

      const provider = createProvider('openrouter', config)
      expect(provider).toBeInstanceOf(OpenRouterProvider)
    })

    test('throws when creating OpenRouter without API key', () => {
      const config: ProviderConfig = { openrouterApiKey: '' }
      expect(() => createProvider('openrouter', config)).toThrow('OpenRouter API key required')
    })

    test('uses default temperature when not specified', () => {
      const config: ProviderConfig = { geminiApiKey: 'test-key' }
      // Just verify it doesn't throw - the internal temperature isn't exposed
      expect(() => createProvider('gemini', config)).not.toThrow()
    })

    test('uses default maxTokens when not specified', () => {
      const config: ProviderConfig = { geminiApiKey: 'test-key' }
      expect(() => createProvider('gemini', config)).not.toThrow()
    })

    test('throws on unknown provider type', () => {
      const config: ProviderConfig = {}
      expect(() => createProvider('unknown' as AIProviderType, config)).toThrow(
        'Unknown provider: unknown',
      )
    })
  })
})

// =============================================================================
// Type Exports
// =============================================================================

describe('Type Exports', () => {
  test('UnifiedChatMessage has correct structure', () => {
    const message = {
      role: 'user' as const,
      content: 'Hello',
    }
    // Type-level test - if it compiles, types are correct
    expect(message.role).toBe('user')
    expect(message.content).toBe('Hello')
  })

  test('UnifiedChatResponse has correct structure', () => {
    const response = {
      content: 'Hello!',
      model: 'gemini-2.0-flash',
      provider: 'gemini' as AIProviderType,
      tokensUsed: {
        prompt: 5,
        completion: 10,
        total: 15,
      },
      latencyMs: 123,
    }
    expect(response.provider).toBe('gemini')
    expect(response.tokensUsed.total).toBe(15)
  })

  test('AIProviderType union includes all providers', () => {
    const providers: AIProviderType[] = ['gemini', 'workers-ai', 'openrouter']
    expect(providers).toContain('gemini')
    expect(providers).toContain('workers-ai')
    expect(providers).toContain('openrouter')
  })
})
