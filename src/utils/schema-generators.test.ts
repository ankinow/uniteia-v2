import { describe, expect, it } from 'vitest'
import { generateArticleSchema, generateWebSiteSchema } from '../utils/schema-generators'

describe('JSON-LD Schema Generators', () => {
  describe('generateArticleSchema', () => {
    it('generates valid Article schema', () => {
      const schema = generateArticleSchema({
        headline: 'Test Article',
        description: 'A test description',
        author: 'Test Author',
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

    it('generates correct URL for niche', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        url: 'my-article',
        niche: 'dev',
        lang: 'ja',
      })

      expect(schema.url).toBe('https://dev.uniteia.com/ja/my-article')
    })

    it('uses root domain for apex niche', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
        url: 'my-article',
        niche: 'apex',
        lang: 'pt',
      })

      expect(schema.url).toBe('https://uniteia.com/pt/my-article')
    })

    it('includes publisher Organization', () => {
      const schema = generateArticleSchema({
        headline: 'Test',
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
