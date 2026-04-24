/**
 * @orquestra/ai-core - Content Generator Test Suite
 * SOTA 2026: Tests for AI content generation with mocked provider
 */

import { beforeEach, describe, expect, mock, test } from 'bun:test'
import { type ContentGenerationOptions, ContentGenerator } from '../generators/content-generator'

// =============================================================================
// MOCK: GeminiProvider — we mock fetch since GeminiProvider calls the Gemini API
// =============================================================================

const mockValidResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify({
              title: 'Best Smartphone 2026',
              content: 'This smartphone has amazing features...',
              seoKeywords: ['smartphone', '2026', 'best'],
              metaDescription: 'Find the best smartphone of 2026 with our review.',
            }),
          },
        ],
      },
      finishReason: 'STOP',
    },
  ],
  usageMetadata: {
    promptTokenCount: 100,
    candidatesTokenCount: 200,
    totalTokenCount: 300,
  },
}

const mockMarkdownWrappedResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: `\`\`\`json\n${JSON.stringify({
              title: 'Wrapped Title',
              content: 'Wrapped content',
              seoKeywords: ['wrapped'],
              metaDescription: 'Wrapped meta',
            })}\n\`\`\``,
          },
        ],
      },
      finishReason: 'STOP',
    },
  ],
  usageMetadata: {
    promptTokenCount: 50,
    candidatesTokenCount: 100,
    totalTokenCount: 150,
  },
}

// =============================================================================
// TESTS
// =============================================================================

describe('ContentGenerator', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    // Reset fetch mock before each test
    globalThis.fetch = originalFetch
  })

  test('constructor creates instance with API key', () => {
    const gen = new ContentGenerator('test-api-key')
    expect(gen).toBeDefined()
  })

  test('generate returns structured content', async () => {
    // Mock fetch for the Gemini API call
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify(mockValidResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    ) as typeof fetch

    const gen = new ContentGenerator('test-api-key')
    const result = await gen.generate({
      apiKey: 'test-api-key',
      productName: 'Test Smartphone',
      category: 'Electronics',
      features: ['5G', 'OLED Display', '128GB'],
      contentType: 'review',
      tone: 'professional',
    })

    expect(result.title).toBe('Best Smartphone 2026')
    expect(result.content).toContain('amazing features')
    expect(result.seoKeywords).toContain('smartphone')
    expect(result.metaDescription).toBeTruthy()
    expect(result.model).toBe('gemini-2.0-flash')
  })

  test('generate handles markdown-wrapped JSON response', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify(mockMarkdownWrappedResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    ) as typeof fetch

    const gen = new ContentGenerator('test-api-key')
    const result = await gen.generate({
      apiKey: 'test-api-key',
      productName: 'Test Product',
      category: 'General',
      features: ['Feature A'],
      contentType: 'description',
    })

    expect(result.title).toBe('Wrapped Title')
    expect(result.content).toBe('Wrapped content')
  })

  test('generate falls back when JSON parsing fails', async () => {
    const nonJsonResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'This is plain text, not JSON' }],
          },
          finishReason: 'STOP',
        },
      ],
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, totalTokenCount: 30 },
    }

    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify(nonJsonResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    ) as typeof fetch

    const gen = new ContentGenerator('test-api-key')
    const result = await gen.generate({
      apiKey: 'test-api-key',
      productName: 'Fallback Product',
      category: 'General',
      features: ['Feature'],
      contentType: 'review',
    })

    // Fallback: uses productName as title, raw content as content
    expect(result.title).toBe('Fallback Product')
    expect(result.content).toBe('This is plain text, not JSON')
    expect(result.seoKeywords).toEqual([])
    expect(result.metaDescription).toBe('')
  })

  test('buildPrompt includes correct options', async () => {
    let capturedBody = ''

    globalThis.fetch = mock((url: string | URL | Request, init?: RequestInit) => {
      capturedBody = (init?.body as string) || ''
      return Promise.resolve(
        new Response(JSON.stringify(mockValidResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    }) as typeof fetch

    const gen = new ContentGenerator('test-api-key')
    await gen.generate({
      apiKey: 'test-api-key',
      productName: 'Pixel 9',
      category: 'Smartphones',
      features: ['Tensor G4', 'AI Camera'],
      contentType: 'comparison',
      tone: 'enthusiastic',
      targetAudience: 'Tech enthusiasts',
    })

    const parsed = JSON.parse(capturedBody)
    // The prompt should be in the last user message content
    const userMessages = parsed.contents.filter((c: { role: string }) => c.role === 'user')
    const lastUserMsg = userMessages[userMessages.length - 1]
    const promptText = lastUserMsg.parts[0].text

    expect(promptText).toContain('Pixel 9')
    expect(promptText).toContain('Smartphones')
    expect(promptText).toContain('Tensor G4')
    expect(promptText).toContain('comparison')
    expect(promptText).toContain('enthusiastic')
    expect(promptText).toContain('Tech enthusiasts')
  })

  // Cleanup
  test('cleanup: restore original fetch', () => {
    globalThis.fetch = originalFetch
  })
})
