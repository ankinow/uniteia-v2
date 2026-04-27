import { describe, expect, it } from 'vitest'
import { buildAlternateLinksHTML, generateHreflangLinks, getAvailableLanguages } from './hreflang'

describe('hreflang', () => {
  describe('generateHreflangLinks', () => {
    it('generates links for all available languages', () => {
      const links = generateHreflangLinks('singularity', 'test-article', ['en', 'pt', 'es'])

      expect(links).toHaveLength(4) // 3 languages + x-default
      expect(links[0]).toEqual({
        hreflang: 'en',
        href: 'https://singularity.uniteia.com/en/test-article',
      })
      expect(links[1]).toEqual({
        hreflang: 'pt',
        href: 'https://singularity.uniteia.com/pt/test-article',
      })
      expect(links[2]).toEqual({
        hreflang: 'es',
        href: 'https://singularity.uniteia.com/es/test-article',
      })
    })

    it('includes x-default pointing to English', () => {
      const links = generateHreflangLinks('apex', 'my-post', ['en', 'ja'])

      const xDefault = links.find(l => l.hreflang === 'x-default')
      expect(xDefault).toBeDefined()
      expect(xDefault?.href).toBe('https://apex.uniteia.com/en/my-post')
    })

    it('x-default falls back to first available when no English', () => {
      const links = generateHreflangLinks('apex', 'my-post', [
        'pt',
        'es',
        'ja',
      ] as SupportedLanguage[])

      const xDefault = links.find(l => l.hreflang === 'x-default')
      expect(xDefault?.href).toBe('https://apex.uniteia.com/pt/my-post')
    })

    it('handles single language', () => {
      const links = generateHreflangLinks('singularity', 'only-en', ['en'])

      expect(links).toHaveLength(2) // en + x-default
      expect(links[0]?.hreflang).toBe('en')
      expect(links[1]?.hreflang).toBe('x-default')
    })

    it('generates correct URLs for all 5 languages', () => {
      const allLangs = ['en', 'pt', 'es', 'ja', 'zh'] as const
      const links = generateHreflangLinks('hardware', 'article', allLangs)

      expect(links.filter(l => l.hreflang !== 'x-default')).toHaveLength(5)
      expect(links.some(l => l.href === 'https://hardware.uniteia.com/ja/article')).toBe(true)
      expect(links.some(l => l.href === 'https://hardware.uniteia.com/zh/article')).toBe(true)
    })
  })

  describe('buildAlternateLinksHTML', () => {
    it('generates HTML link tags', () => {
      const html = buildAlternateLinksHTML('singularity', 'test-article', 'en', ['en', 'pt'])

      expect(html).toContain('<link rel="alternate" hreflang="en"')
      expect(html).toContain('<link rel="alternate" hreflang="pt"')
      expect(html).toContain('<link rel="alternate" hreflang="x-default"')
    })

    it('includes correct URLs in HTML', () => {
      const html = buildAlternateLinksHTML('apex', 'my-post', 'en', ['en', 'es'])

      expect(html).toContain('https://apex.uniteia.com/en/my-post')
      expect(html).toContain('https://apex.uniteia.com/es/my-post')
    })
  })

  describe('getAvailableLanguages', () => {
    it('returns all supported languages by default', async () => {
      const langs = await getAvailableLanguages('singularity', 'any-slug')

      expect(langs).toContain('en')
      expect(langs).toContain('pt')
      expect(langs).toContain('es')
      expect(langs).toContain('ja')
      expect(langs).toContain('zh')
    })
  })
})
