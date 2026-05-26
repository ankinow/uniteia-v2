import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from './parser'

describe('parseFrontmatter', () => {
  it('parses standard frontmatter with trailing body', () => {
    const raw = '---\ntitle: Hello\n---\n\n## Body content\nMore text.'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ title: 'Hello' })
    expect(result.body).toBe('\n## Body content\nMore text.')
  })

  it('parses frontmatter with CRLF line endings', () => {
    const raw = '---\r\ntitle: Hello\r\n---\r\n\r\n## Body'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ title: 'Hello' })
    expect(result.body).toBe('\r\n## Body')
  })

  it('parses frontmatter at EOF without trailing newline after closing ---', () => {
    const raw = '---\ntitle: Hello\n---'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ title: 'Hello' })
    expect(result.body).toBe('')
  })

  it('returns empty frontmatter and full body when no frontmatter present', () => {
    const raw = '## Just a markdown file\n\nWith some content.'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.body).toBe('## Just a markdown file\n\nWith some content.')
  })

  it('handles empty input', () => {
    const result = parseFrontmatter('')
    expect(result.frontmatter).toEqual({})
    expect(result.body).toBe('')
  })

  it('handles complex YAML with nested objects', () => {
    const raw = '---\ntitle: Test\nsubjects:\n  - cloud\n  - ai\nquality_score: 85\n---\n\nBody here.'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({
      title: 'Test',
      subjects: ['cloud', 'ai'],
      quality_score: 85,
    })
    expect(result.body).toBe('\nBody here.')
  })

  it('handles --- in body without confusing frontmatter parser', () => {
    const raw = '---\ntitle: Dashes\n---\n\n## Section 1\n\n---\n\nMore content.'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ title: 'Dashes' })
    // The greedy matching preserves the body ---
    expect(result.body).toContain('---')
  })

  it('handles frontmatter with only opening --- (no closing)', () => {
    const raw = '---\ntitle: Incomplete\nBody content'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({})
    expect(result.body).toBe('---\ntitle: Incomplete\nBody content')
  })

  it('handles numeric and boolean YAML values', () => {
    const raw = '---\nquality_score: 85\nnoindex: true\nversion: 1\n---\n\nBody'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({
      quality_score: 85,
      noindex: true,
      version: 1,
    })
  })

  it('handles UTF-8 / i18n frontmatter values', () => {
    const raw = '---\ntitle: "クラウドスタック入門"\nlang: ja\n---\n\nクラウドコンピューティングの基礎を学びます。'
    const result = parseFrontmatter(raw)
    expect(result.frontmatter).toEqual({ title: 'クラウドスタック入門', lang: 'ja' })
    expect(result.body).toContain('クラウドコンピューティング')
  })

  it('body length is ≥ 100 for real content (schema gate check)', () => {
    // Simulate a real article import
    const frontmatter = [
      '---',
      'slug: test-article',
      'lang: en',
      'title: "Test Article"',
      'subjects:',
      '  - test',
      '  - quality',
      'referral_links:',
      '  - url: https://example.com',
      '    title: Example',
      '---',
      '',
    ].join('\n')
    const body = '# Test Article\n\nThis is a comprehensive guide to testing the content pipeline.\n\n## Section 1\n\nDetailed analysis and exploration of edge cases in frontmatter parsing.\n\n## Section 2\n\nMore content with sufficient length to pass the 100-character schema gate.\n\n## Conclusion\n\nThe pipeline handles all edge cases correctly.'
    const raw = frontmatter + body
    const result = parseFrontmatter(raw)
    expect(result.frontmatter.title).toBe('Test Article')
    expect(result.body.length).toBeGreaterThanOrEqual(100)
    expect(result.body).toBe(body)
  })
})
