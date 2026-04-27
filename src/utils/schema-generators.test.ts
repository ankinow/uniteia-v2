import { describe, expect, it } from 'vitest'
import { generateArticleSchema, generateWebSiteSchema } from '../utils/schema-generators'

describe('JSON-LD Schema Generators', () => {
  describe('generateArticleSchema', () => {
    it('generates valid Article schema', () => {
      const schema = generateArticleSchema({
        headline: 'Test Article',
        description: 'A test description',
        author: 'Test Author',
        datePublished: '2026-04-27',
        url: 'test-article',
        niche: 'singularity',
        lang: 'en',
      })

      expect(schema['@type']).toBe('Article')
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema.headline).toBe('Test Article')
      expect(schema.description).toBe('A test description')
      expect(schema.author).toEqual({ '@type': 'Person', name: 'Test Author' })
      expect(schema.inLanguage).toBe('en')
    })

    it('uses datePublished for dateModified when not provided', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        datePublished: '2026-04-27',
        url: 'test',
        niche: 'apex',
        lang: 'pt',
      })

      expect(schema.dateModified).toBe('2026-04-27')
      expect(schema.datePublished).toBe('2026-04-27')
    })

    it('uses custom dateModified when provided', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        datePublished: '2026-01-15',
        dateModified: '2026-04-27',
        url: 'test',
        niche: 'hardware',
        lang: 'es',
      })

      expect(schema.datePublished).toBe('2026-01-15')
      expect(schema.dateModified).toBe('2026-04-27')
    })

    it('generates correct URL for niche', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        datePublished: '2026-04-27',
        url: 'my-article',
        niche: 'dev',
        lang: 'ja',
      })

      expect(schema.url).toBe('https://dev.uniteia.com/ja/my-article')
    })

    it('includes publisher Organization', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        datePublished: '2026-04-27',
        url: 'test',
        niche: 'privacy',
        lang: 'zh',
      })

      expect(schema.publisher).toEqual({
        '@type': 'Organization',
        name: 'UniTeia',
        url: 'https://uniteia.com',
      })
    })

    it('handles missing optional fields', () => {
      const schema = generateArticleSchema({
        headline: 'Minimal Article',
        datePublished: '2026-04-27',
        url: 'minimal',
        niche: 'singularity',
        lang: 'en',
      })

      expect(schema.author).toBeUndefined()
      expect(schema.description).toBeUndefined()
      expect(schema['@type']).toBe('Article')
    })
  })

  describe('generateWebSiteSchema', () => {
    it('generates valid WebSite schema', () => {
      const schema = generateWebSiteSchema({
        name: 'UniTeia',
        url: 'https://uniteia.com',
        description: 'Canonical tech content',
        lang: 'en',
      })

      expect(schema['@type']).toBe('WebSite')
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema.name).toBe('UniTeia')
      expect(schema.url).toBe('https://uniteia.com')
      expect(schema.inLanguage).toBe('en')
    })

    it('handles missing description', () => {
      const schema = generateWebSiteSchema({
        name: 'UniTeia',
        url: 'https://uniteia.com',
        lang: 'pt',
      })

      expect(schema.description).toBeUndefined()
      expect(schema.inLanguage).toBe('pt')
    })

    it('includes publisher for all languages', () => {
      const langs = ['en', 'pt', 'es', 'ja', 'zh'] as const

      for (const lang of langs) {
        const schema = generateWebSiteSchema({
          name: 'UniTeia',
          url: 'https://uniteia.com',
          lang,
        })

        expect(schema.publisher).toBeDefined()
        expect(schema.publisher?.name).toBe('UniTeia')
      }
    })
  })

  describe('schema type compatibility', () => {
    it('Article schema has required @context and @type', () => {
      const article = generateArticleSchema({
        headline: 'Test',
        datePublished: '2026-04-27',
        url: 'test',
        niche: 'singularity',
        lang: 'en',
      })

      expect(article['@context']).toBe('https://schema.org')
      expect(article['@type']).toBe('Article')
    })

    it('WebSite schema has required @context and @type', () => {
      const website = generateWebSiteSchema({
        name: 'UniTeia',
        url: 'https://uniteia.com',
        lang: 'en',
      })

      expect(website['@context']).toBe('https://schema.org')
      expect(website['@type']).toBe('WebSite')
    })
  })
})
