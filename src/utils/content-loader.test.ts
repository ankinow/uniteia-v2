import { describe, expect, it } from 'vitest'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'

/**
 * Unit tests for loadContent() — the extracted content pipeline utility.
 *
 * These tests exercise loadContent() directly without Qwik's routeLoader$,
 * proving the utility is reusable and testable in isolation.
 */
describe('loadContent', () => {
  /**
   * Test 1: loadContent('test-article', 'en') resolves with valid LlmWikiContent
   */
  it('loads a valid English article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('test', 'test-article', 'en')

    expect(result).toBeDefined()
    expect(result.slug).toBe('test-article')
    expect(result.lang).toBe('en')
    expect(result.title).toBe('Test Article for Integration Verification')
    expect(result.content).toBeTypeOf('string')
    // HTML transformation check
    expect(result.content).toContain('<p>')
    expect(result.content).toContain('<strong>')
    expect(result.subjects).toBeInstanceOf(Array)
    expect(result.subjects.length).toBeGreaterThanOrEqual(1)
    expect(result.referral_links).toBeInstanceOf(Array)
    expect(result.verdict).toBe('trusted')
    expect(result.quality_score).toBe(92)
  })

  /**
   * Test 2: loadContent('test-article', 'es') resolves (proves es fixture works)
   */
  it('loads a valid Spanish article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('test', 'test-article', 'es')

    expect(result).toBeDefined()
    expect(result.slug).toBe('test-article')
    expect(result.lang).toBe('es')
    expect(result.title).toBe('Artículo de Prueba para Verificación de Integración')
    expect(result.content.length).toBeGreaterThanOrEqual(100)
    expect(result.subjects).toContain('pruebas')
  })

  /**
   * Test 3: loadContent('nonexistent-article', 'en') rejects with ContentLoaderError phase='read'
   */
  it('throws ContentLoaderError with phase "read" for a missing article', async () => {
    await expect(loadContent('test', 'nonexistent-article', 'en')).rejects.toThrow(ContentLoaderError)

    try {
      await loadContent('test', 'nonexistent-article', 'en')
    } catch (err) {
      expect(err).toBeInstanceOf(ContentLoaderError)
      const cle = err as ContentLoaderError
      expect(cle.phase).toBe('read')
      expect(cle.slug).toBe('nonexistent-article')
      expect(cle.lang).toBe('en')
      expect(cle.errors).toBeInstanceOf(Array)
      expect(cle.errors.length).toBeGreaterThanOrEqual(1)
    }
  })

  /**
   * Test 4: Parseable markdown with missing schema fields still loads in the worker bundle.
   *
   * Runtime AJV validation is intentionally disabled in the shipped worker, so the loader
   * preserves the content payload and leaves absent frontmatter fields undefined.
   */
  it('loads parseable markdown with missing schema fields as a worker limitation', async () => {
    const result = await loadContent('test', 'test-invalid-schema', 'en')

    expect(result.slug).toBe('test-invalid-schema')
    expect(result.lang).toBe('en')
    expect(result.title).toBe('Missing Schema Fields Fixture')
    expect(result.content).toContain('<p>')
    expect(result.subjects).toBeUndefined()
    expect(result.referral_links).toBeUndefined()
  })

  /**
   * Test 5: Slug containing banned terms triggers phase='slug'
   *
   * The tracked fixture exists so import.meta.glob includes it in the shipped bundle.
   */
  it('throws ContentLoaderError with phase "slug" for a slug with banned terms', async () => {
    await expect(loadContent('test', 'test-admin', 'en')).rejects.toThrow(ContentLoaderError)

    try {
      await loadContent('test', 'test-admin', 'en')
    } catch (err) {
      expect(err).toBeInstanceOf(ContentLoaderError)
      const cle = err as ContentLoaderError
      expect(cle.phase).toBe('slug')
      expect(cle.slug).toBe('test-admin')
      expect(cle.errors).toBeInstanceOf(Array)
      expect(cle.errors.length).toBeGreaterThanOrEqual(1)
      expect(cle.errors[0]).toContain('banned')
    }
  })

  /**
   * Test 6: Niche-based glob keys correctly resolve (ai-agents niche)
   */
  it('handles niche-based glob keys correctly (ai-agents)', async () => {
    const result = await loadContent('ai-agents', 'llm-aggregators-compared', 'en')
    expect(result.slug).toBe('llm-aggregators-compared')
    expect(result.title).toBe('LLM Aggregators Compared')
    expect(result.content).toContain('<h1>')
  })
})
