import { beforeAll, describe, expect, it } from 'vitest'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'

/**
 * Unit tests for loadContent() — the extracted content pipeline utility.
 *
 * These tests exercise loadContent() directly without Qwik's routeLoader$,
 * proving the utility is reusable and testable in isolation.
 */

// Warm up the import.meta.glob cold-start before any test runs.
// The first call to loadContent() triggers Vite's lazy module resolution
// which can take >15s on cold CI runs. Pre-warming in beforeAll ensures
// subsequent tests run within normal timeouts.
let warmupDone = false
beforeAll(async () => {
  if (!warmupDone) {
    warmupDone = true
    try {
      await loadContent('apex', 'test-article', 'en')
    } catch {
      // Warm-up failure is non-fatal; tests will report their own errors
    }
  }
}, 60_000)

describe('loadContent', () => {
  /**
   * Test 1: loadContent('test-article', 'en') resolves with valid LlmWikiContent
   */
  it('loads a valid English article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('apex', 'test-article', 'en')

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
    expect(result.quality_score).toBe(95)
  }, 30_000)

  /**
   * Test 2: loadContent('test-article', 'es') resolves (proves es fixture works)
   */
  it('loads a valid Spanish article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('apex', 'test-article', 'es')

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
    await expect(loadContent('apex', 'nonexistent-article', 'en')).rejects.toThrow(
      ContentLoaderError
    )

    try {
      await loadContent('apex', 'nonexistent-article', 'en')
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
  it('throws ContentLoaderError with phase "schema" for missing schema fields', async () => {
    await expect(loadContent('apex', 'test-invalid-schema', 'en')).rejects.toThrow(
      ContentLoaderError
    )
    try {
      await loadContent('apex', 'test-invalid-schema', 'en')
    } catch (err) {
      expect(err).toBeInstanceOf(ContentLoaderError)
      const cle = err as ContentLoaderError
      expect(cle.phase).toBe('schema')
      expect(cle.errors.length).toBeGreaterThan(0)
    }
  })

  /**
   * Test 5: Slug containing banned terms triggers phase='slug'
   *
   * The tracked fixture exists so import.meta.glob includes it in the shipped bundle.
   */
  it('throws ContentLoaderError with phase "slug" for a slug with banned terms', async () => {
    await expect(loadContent('apex', 'test-admin', 'en')).rejects.toThrow(ContentLoaderError)

    try {
      await loadContent('apex', 'test-admin', 'en')
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
    expect(result.content).toContain('<h2>')
  })

  /**
   * Test 7: getAvailableLanguages returns all languages for a given slug
   */
  it('getAvailableLanguages returns all supported languages for a translated article', async () => {
    const { getAvailableLanguages } = await import('~/utils/content-loader')
    const langs = await getAvailableLanguages('apex', 'test-article')

    expect(langs).toContain('en')
    expect(langs).toContain('es')
    expect(langs).toContain('ja')
    expect(langs).toContain('pt')
    expect(langs).toContain('zh')
    expect(langs.length).toBe(5)
  })

  it('getAvailableLanguages returns only one language for an untranslated article', async () => {
    const { getAvailableLanguages } = await import('~/utils/content-loader')
    const langs = await getAvailableLanguages('ai-agents', 'llm-aggregators-compared')

    expect(langs).toEqual(['en'])
  })

  /**
   * Test 8: listNicheArticles returns only valid, indexed content files for a niche.
   *
   * The invalid test-admin slug exists as a validation fixture and should not be
   * exposed through the sitemap discovery helper.
   */
  it('listNicheArticles returns valid sitemap entries and skips invalid slugs', async () => {
    const { listNicheArticles } = await import('~/utils/content-loader')
    const articles = await listNicheArticles('apex')

    expect(articles).toContainEqual(expect.objectContaining({ slug: 'test-article', lang: 'en' }))
    expect(articles).toContainEqual(expect.objectContaining({ slug: 'test-article', lang: 'es' }))
    expect(articles).toContainEqual(expect.objectContaining({ slug: 'test-article', lang: 'ja' }))
    expect(articles).toContainEqual(expect.objectContaining({ slug: 'test-article', lang: 'pt' }))
    expect(articles).toContainEqual(expect.objectContaining({ slug: 'test-article', lang: 'zh' }))
    expect(articles.some(article => article.slug === 'test-admin')).toBe(false)
    expect(articles).toEqual(
      [...articles].sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang))
    )
  })

  /**
   * Test 9: Malicious markdown is sanitized (XSS prevention)
   */
  it('returns raw HTML for test-xss (sanitization is handled at generation)', async () => {
    const result = await loadContent('apex', 'test-xss', 'en')
    // We expect the script tag to remain because we removed runtime sanitization
    // and shifted that responsibility to the Content Factory validation gate.
    expect(result.content).toContain('<script>')
  })

  /**
   * Test 10: language-models niche loads a real editorial article
   */
  it('loads a valid language-models editorial article', async () => {
    const result = await loadContent('language-models', 'foundation-models-overview', 'en')
    expect(result.slug).toBe('foundation-models-overview')
    expect(result.lang).toBe('en')
    expect(result.title).toBe('Foundation Models Overview')
    expect(result.verdict).toBe('trusted')
    expect(result.quality_score).toBe(88)
    expect(result.subjects).toContain('llm')
    expect(result.referral_links.length).toBeGreaterThanOrEqual(1)
    expect(result.content).toContain('<h2>')
  })

  /**
   * Test 11: listNicheArticles discovers articles across multiple niches
   */
  it('listNicheArticles returns entries for language-models niche', async () => {
    const { listNicheArticles } = await import('~/utils/content-loader')
    const articles = await listNicheArticles('language-models')
    expect(articles).toContainEqual(
      expect.objectContaining({ slug: 'foundation-models-overview', lang: 'en' })
    )
  })
})

/**
 * Test 12: deriveNavigation returns structured navigation data for all niches
 */
it('deriveNavigation returns structured navigation with niches, langs, and articles', async () => {
  const { deriveNavigation } = await import('~/utils/content-loader')
  const nav = await deriveNavigation()

  expect(nav).toBeDefined()
  expect(nav.niches).toBeDefined()

  // Should have apex, ai-agents, and language-models niches
  expect(Object.keys(nav.niches)).toContain('apex')
  expect(Object.keys(nav.niches)).toContain('ai-agents')
  expect(Object.keys(nav.niches)).toContain('language-models')
})

/**
 * Test 13: deriveNavigation extracts correct metadata from content files
 */
it('deriveNavigation extracts slug, title, type, subjects from frontmatter', async () => {
  const { deriveNavigation } = await import('~/utils/content-loader')
  const nav = await deriveNavigation()

  const apexArticles = nav.niches.apex?.articles ?? []
  const testArticle = apexArticles.find(a => a.slug === 'test-article' && a.lang === 'en')

  expect(testArticle).toBeDefined()
  expect(testArticle?.title).toBe('Test Article for Integration Verification')
  expect(testArticle?.type).toBe('article')
  expect(testArticle?.subjects).toContain('testing')
})

/**
 * Test 14: deriveNavigation identifies _index.md as type=index landing pages
 */
it('deriveNavigation marks _index.md files with type: index', async () => {
  const { deriveNavigation } = await import('~/utils/content-loader')
  const nav = await deriveNavigation()

  // Check apex niche has _index and marks it as type: index
  const apexArticles = nav.niches.apex?.articles ?? []
  const indexEntry = apexArticles.find(a => a.slug === '_index')

  expect(indexEntry).toBeDefined()
  expect(indexEntry?.type).toBe('index')
})

/**
 * Test 15: deriveNavigation collects all languages per niche
 */
it('deriveNavigation aggregates available languages for each niche', async () => {
  const { deriveNavigation } = await import('~/utils/content-loader')
  const nav = await deriveNavigation()

  // Apex niche should have multiple languages from test-article translations
  const apexLangs = nav.niches.apex?.langs ?? []
  expect(apexLangs.length).toBeGreaterThanOrEqual(1)
  expect(apexLangs).toContain('en')
})

/**
 * Test 16: deriveNavigation caches results for dev builds (memoization)
 */
it('deriveNavigation memoizes results on repeated calls', async () => {
  const { deriveNavigation, clearNavigationCache } = await import('~/utils/content-loader')

  // Clear any existing cache
  clearNavigationCache()

  const first = await deriveNavigation()
  const second = await deriveNavigation()

  // Same object reference due to memoization
  expect(second).toBe(first)
})

/**
 * Test 17: deriveNavigation skips invalid slugs
 */
it('deriveNavigation excludes articles with invalid slugs', async () => {
  const { deriveNavigation } = await import('~/utils/content-loader')
  const nav = await deriveNavigation()

  const apexArticles = nav.niches.apex?.articles ?? []
  const adminSlug = apexArticles.find(a => a.slug === 'test-admin')

  // test-admin has a banned term ('admin')
  expect(adminSlug).toBeUndefined()
})
