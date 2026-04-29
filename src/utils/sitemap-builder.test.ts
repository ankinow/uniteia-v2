import { describe, expect, it, vi } from 'vitest'

vi.mock('~/utils/content-loader', () => ({
  listNicheArticles: vi.fn(),
}))

vi.mock('~/utils/host-parser', () => ({
  parseHost: vi.fn(() => ({ niche: 'apex' })),
}))

vi.mock('~/utils/hreflang', () => ({
  generateHreflangLinks: vi.fn(() => [
    {
      hreflang: 'en',
      href: 'https://uniteia.com/en/test-article',
    },
    {
      hreflang: 'x-default',
      href: 'https://uniteia.com/en/test-article',
    },
  ]),
}))

import { listNicheArticles } from '~/utils/content-loader'
import { buildRobotsTxt, buildSitemapXml, formatSitemapDate } from './sitemap-builder'

const mockedListNicheArticles = listNicheArticles as unknown as {
  mockResolvedValue: (value: unknown) => void
}

describe('formatSitemapDate', () => {
  it('normalizes valid ISO timestamps and rejects invalid dates', () => {
    expect(formatSitemapDate('2026-04-28T12:34:56Z')).toBe('2026-04-28')
    expect(formatSitemapDate('not-a-date')).toBeUndefined()
  })
})

describe('buildSitemapXml', () => {
  it('omits lastmod when article timestamps are invalid', async () => {
    mockedListNicheArticles.mockResolvedValue([
      {
        slug: 'test-article',
        lang: 'en',
        updatedAt: 'not-a-date',
        title: 'Test Article',
        summary: undefined,
      },
    ])

    const xml = await buildSitemapXml('https://uniteia.com', 'uniteia.com')

    expect(xml).toContain('<loc>https://uniteia.com/en/test-article</loc>')
    expect(xml).not.toContain('<lastmod>undefined</lastmod>')
    expect(xml).not.toContain('<lastmod>')
  })
})

describe('buildRobotsTxt', () => {
  it('points robots.txt at the sitemap', () => {
    expect(buildRobotsTxt('https://uniteia.com')).toContain(
      'Sitemap: https://uniteia.com/sitemap.xml'
    )
  })
})
