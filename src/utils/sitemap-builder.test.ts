import { describe, expect, it } from 'vitest'
import { buildRobotsTxt, formatSitemapDate } from './sitemap-builder'

describe('formatSitemapDate', () => {
  it('normalizes valid ISO timestamps and rejects invalid dates', () => {
    expect(formatSitemapDate('2026-04-28T12:34:56Z')).toBe('2026-04-28')
    expect(formatSitemapDate('not-a-date')).toBeUndefined()
  })
})

describe('buildRobotsTxt', () => {
  it('points robots.txt at the sitemap index with disallow rules', () => {
    const robots = buildRobotsTxt('https://uniteia.com')
    expect(robots).toContain('Sitemap: https://uniteia.com/sitemap-index.xml')
    expect(robots).toContain('Disallow: /api/')
    expect(robots).toContain('Disallow: /build/')
  })
})
