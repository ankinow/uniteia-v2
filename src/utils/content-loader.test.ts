import { beforeAll, describe, expect, it } from 'vitest'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'

let warmupDone = false
beforeAll(async () => {
  if (!warmupDone) {
    warmupDone = true
    try {
      await loadContent('apex', 'tencent-cloud-deal-stack-builders', 'en')
    } catch {}
  }
}, 60_000)

describe('loadContent', () => {
  it('loads a valid English article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('apex', 'tencent-cloud-deal-stack-builders', 'en')
    expect(result).toBeDefined()
    expect(result.slug).toBe('tencent-cloud-deal-stack-builders')
    expect(result.lang).toBe('en')
    expect(result.title).toBe('Tencent Cloud Deal Stack for Builders')
    expect(result.content).toBeTypeOf('string')
    expect(result.content).toContain('<p>')
    expect(result.content).toContain('<strong>')
    expect(result.subjects).toBeInstanceOf(Array)
    expect(result.subjects.length).toBeGreaterThanOrEqual(1)
    expect(result.referral_links).toBeInstanceOf(Array)
    expect(result.verdict).toBe('trusted')
    expect(result.quality_score).toBe(95)
  }, 30_000)

  it('loads a valid Portuguese article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('apex', 'tencent-cloud-deal-stack-builders', 'pt')
    expect(result).toBeDefined()
    expect(result.slug).toBe('tencent-cloud-deal-stack-builders')
    expect(result.lang).toBe('pt')
    expect(result.title).toBe('Tencent Cloud Deal Stack: Cloud Barata para Builders')
    expect(result.content.length).toBeGreaterThanOrEqual(100)
    expect(result.subjects).toContain('cloud')
  })

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

  it('handles niche-based glob keys correctly (apex)', async () => {
    const result = await loadContent('apex', 'tencent-cloud-deal-stack-builders', 'en')
    expect(result.slug).toBe('tencent-cloud-deal-stack-builders')
    expect(result.title).toBe('Tencent Cloud Deal Stack for Builders')
    expect(result.content).toContain('<h2>')
  })
})

describe('loadContent locale helpers', () => {
  it('getAvailableLanguages returns all locales for a fully translated article', async () => {
    const { getAvailableLanguages } = await import('~/utils/content-loader')
    const langs = await getAvailableLanguages('apex', 'tencent-cloud-deal-stack-builders')
    expect(langs).toContain('en')
    expect(langs).toContain('pt')
    expect(langs).toContain('es')
    expect(langs).toContain('fr')
    expect(langs).toContain('de')
    expect(langs).toContain('it')
    expect(langs).toContain('ja')
    expect(langs).toContain('zh')
    expect(langs.length).toBe(8)
  })

  it('getAvailableLanguages returns all 8 locales sorted', async () => {
    const { getAvailableLanguages } = await import('~/utils/content-loader')
    const langs = await getAvailableLanguages('apex', 'tencent-cloud-deal-stack-builders')
    expect(langs).toHaveLength(8)
    expect(langs.sort()).toEqual(['de', 'en', 'es', 'fr', 'it', 'ja', 'pt', 'zh'])
  })

  it('listNicheArticles returns valid sitemap entries for apex', async () => {
    const { listNicheArticles } = await import('~/utils/content-loader')
    const articles = await listNicheArticles('apex')
    expect(articles).toContainEqual(
      expect.objectContaining({ slug: 'tencent-cloud-deal-stack-builders', lang: 'en' })
    )
    expect(articles).toEqual(
      [...articles].sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang))
    )
  })
})

describe('deriveNavigation', () => {
  it('returns structured navigation with apex niche', async () => {
    const { deriveNavigation } = await import('~/utils/content-loader')
    const nav = await deriveNavigation()
    expect(nav).toBeDefined()
    expect(nav.niches).toBeDefined()
    expect(Object.keys(nav.niches)).toContain('apex')
  })

  it('extracts correct metadata from content files', async () => {
    const { deriveNavigation } = await import('~/utils/content-loader')
    const nav = await deriveNavigation()
    const apexArticles = nav.niches.apex?.articles ?? []
    const article = apexArticles.find(
      a => a.slug === 'tencent-cloud-deal-stack-builders' && a.lang === 'en'
    )
    expect(article).toBeDefined()
    expect(article?.title).toBe('Tencent Cloud Deal Stack for Builders')
    expect(article?.type).toBe('article')
    expect(article?.subjects).toContain('cloud')
  })

  it('marks _index.md files with type: index', async () => {
    const { deriveNavigation } = await import('~/utils/content-loader')
    const nav = await deriveNavigation()
    const apexArticles = nav.niches.apex?.articles ?? []
    const indexEntry = apexArticles.find(a => a.slug === '_index')
    expect(indexEntry).toBeDefined()
    expect(indexEntry?.type).toBe('index')
  })

  it('aggregates available languages for each niche', async () => {
    const { deriveNavigation } = await import('~/utils/content-loader')
    const nav = await deriveNavigation()
    const apexLangs = nav.niches.apex?.langs ?? []
    expect(apexLangs.length).toBeGreaterThanOrEqual(1)
    expect(apexLangs).toContain('en')
  })

  it('memoizes results on repeated calls', async () => {
    const { deriveNavigation, clearNavigationCache } = await import('~/utils/content-loader')
    clearNavigationCache()
    const first = await deriveNavigation()
    const second = await deriveNavigation()
    expect(second).toBe(first)
  })
})
