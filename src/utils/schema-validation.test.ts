import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'
import { validateContent, validateMarkdownFrontmatter } from './schema-validation'

// ── Helpers ──────────────────────────────────────────────────────────────

/** Minimal valid content object that passes the llm-wiki-v1 schema */
function validContent(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    slug: 'solar-system',
    lang: 'en',
    title: 'Solar System',
    content: 'A'.repeat(150), // minLength 100
    subjects: ['astronomy'],
    referral_links: [{ url: 'https://example.com', title: 'Example' }],
    ...overrides,
  }
}

/** Build valid markdown with frontmatter using gray-matter.stringify for correct YAML */
function validMarkdown(overrides: Record<string, unknown> = {}): string {
  const frontmatter: Record<string, unknown> = {
    slug: 'solar-system',
    lang: 'en',
    title: 'Solar System',
    subjects: ['astronomy'],
    referral_links: [{ url: 'https://example.com', title: 'Example' }],
    verdict: 'trusted',
    quality_score: 85,
    ...overrides,
  }
  const body = 'A'.repeat(150)
  return matter.stringify(body, frontmatter)
}

// ── validateContent ──────────────────────────────────────────────────────

describe('validateContent', () => {
  it('accepts valid content', () => {
    const result = validateContent(validContent())
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  // ── Missing required fields ──────────────────────────────────────────

  it('rejects content missing title', () => {
    const { title, ...withoutTitle } = validContent() as Record<string, unknown> & {
      title: unknown
    }
    const result = validateContent(withoutTitle)
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(e => e.field === 'title' && e.message.includes('Missing required'))
    ).toBe(true)
  })

  it('rejects content missing subjects', () => {
    const { subjects, ...withoutSubjects } = validContent() as Record<string, unknown> & {
      subjects: unknown
    }
    const result = validateContent(withoutSubjects)
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(e => e.field === 'subjects' && e.message.includes('Missing required'))
    ).toBe(true)
  })

  it('rejects content missing referral_links', () => {
    const { referral_links, ...withoutReferralLinks } = validContent() as Record<
      string,
      unknown
    > & { referral_links: unknown }
    const result = validateContent(withoutReferralLinks)
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(
        e => e.field === 'referral_links' && e.message.includes('Missing required')
      )
    ).toBe(true)
  })

  it('rejects content missing slug', () => {
    const { slug, ...withoutSlug } = validContent() as Record<string, unknown> & { slug: unknown }
    const result = validateContent(withoutSlug)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('rejects content missing lang', () => {
    const { lang, ...withoutLang } = validContent() as Record<string, unknown> & { lang: unknown }
    const result = validateContent(withoutLang)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'lang')).toBe(true)
  })

  it('rejects content missing content', () => {
    const { content, ...withoutContent } = validContent() as Record<string, unknown> & {
      content: unknown
    }
    const result = validateContent(withoutContent)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'content')).toBe(true)
  })

  // ── Additional properties ────────────────────────────────────────────

  it('rejects content with additional properties', () => {
    const result = validateContent(validContent({ unexpected_field: 'oops' }))
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(
        e => e.message.includes('Unexpected property') && e.message.includes('unexpected_field')
      )
    ).toBe(true)
  })

  // ── Invalid slug patterns ────────────────────────────────────────────

  it('rejects slug with numeric segment', () => {
    const result = validateContent(validContent({ slug: 'solar-system-1' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('rejects slug with uppercase letters', () => {
    const result = validateContent(validContent({ slug: 'Solar-System' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('rejects slug with too many segments (7)', () => {
    const result = validateContent(validContent({ slug: 'a-b-c-d-e-f-g' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('rejects slug with numbers', () => {
    const result = validateContent(validContent({ slug: 'solar-system-2' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('rejects slug containing a banned term', () => {
    const result = validateContent(validContent({ slug: 'admin-panel' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug' && e.message.includes('banned'))).toBe(true)
  })

  // ── Invalid lang enum ────────────────────────────────────────────────

  it('rejects invalid lang value', () => {
    const result = validateContent(validContent({ lang: 'xx' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'lang')).toBe(true)
  })

  it('rejects lang with uppercase', () => {
    const result = validateContent(validContent({ lang: 'EN' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'lang')).toBe(true)
  })

  // ── Content too short ────────────────────────────────────────────────

  it('rejects content shorter than 100 characters', () => {
    const result = validateContent(validContent({ content: 'Too short' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'content')).toBe(true)
  })

  // ── skipSlugValidation option ────────────────────────────────────────

  it('skips slug validation when skipSlugValidation is true', () => {
    const _result = validateContent(
      validContent({ slug: 'bad-slug-with-banned-admin' }),
      'test.md',
      { skipSlugValidation: true }
    )
    // Schema AJV still checks the pattern, but the extra validateSlug() call is skipped
    // With a banned-term slug that passes AJV pattern, this proves the option works
    const resultWithSkip = validateContent(validContent({ slug: 'admin-panel' }), 'test.md', {
      skipSlugValidation: true,
    })
    // Without skip, admin-panel fails; with skip, only AJV schema runs
    // admin-panel matches pattern ^[a-z]+(-[a-z]+){1,5}$ so AJV passes it
    // The banned-term check is in validateSlug which is skipped
    expect(resultWithSkip.valid).toBe(true)
  })

  it('does not skip slug validation by default', () => {
    const result = validateContent(validContent({ slug: 'admin-panel' }))
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug' && e.message.includes('banned'))).toBe(true)
  })

  // ── filePath propagation ─────────────────────────────────────────────

  it('propagates filePath to error issues', () => {
    const result = validateContent(validContent({ slug: 'bad-1' }), 'custom/path.md')
    expect(result.valid).toBe(false)
    expect(result.errors.every(e => e.filePath === 'custom/path.md')).toBe(true)
  })

  // ── Multiple errors at once ──────────────────────────────────────────

  it('reports multiple errors simultaneously', () => {
    const result = validateContent({ lang: 'invalid' })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })
})

// ── validateMarkdownFrontmatter ──────────────────────────────────────────

describe('validateMarkdownFrontmatter', () => {
  it('accepts valid markdown with frontmatter', () => {
    const md = validMarkdown()
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects markdown with malformed YAML', () => {
    const md = '---\ninvalid: [yaml: syntax\n---\nSome content that is long enough.'
    const result = validateMarkdownFrontmatter(md, 'broken.md')
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(e => e.field === 'frontmatter' && e.message.includes('Failed to parse'))
    ).toBe(true)
  })

  it('rejects markdown with JS eval in frontmatter', () => {
    const md = `---\ntitle: test\njs: !<tag:yaml.org,2002:js/function> "process.exit(1)"\n---\n${'A'.repeat(150)}`
    const result = validateMarkdownFrontmatter(md, 'evil.md')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'frontmatter')).toBe(true)
  })

  it('rejects when frontmatter slug does not match filename', () => {
    const md = validMarkdown({ slug: 'different-slug' })
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(e => e.field === 'slug' && e.message.includes('does not match file slug'))
    ).toBe(true)
  })

  it('rejects when filename is not a valid slug', () => {
    const md = validMarkdown({ slug: 'BAD-SLUG' })
    const result = validateMarkdownFrontmatter(md, 'BAD-SLUG.md')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'fileSlug')).toBe(true)
  })

  it('rejects when frontmatter slug is missing', () => {
    const md = `---\nlang: en\ntitle: Test\nsubjects:\n  - test\nreferral_links:\n  - url: "https://example.com"\n    title: "Example"\n---\n${'A'.repeat(150)}`
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(false)
    expect(
      result.errors.some(e => e.field === 'slug' && e.message.includes('Missing frontmatter slug'))
    ).toBe(true)
  })

  it('rejects when frontmatter slug is empty string', () => {
    const md = validMarkdown({ slug: '' })
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field === 'slug')).toBe(true)
  })

  it('reports schema errors from frontmatter data', () => {
    const md = validMarkdown({ title: '' }) // title minLength 1
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.field.includes('title'))).toBe(true)
  })

  it('propagates filePath to all error issues', () => {
    const md = validMarkdown({ slug: 'different-slug' })
    const result = validateMarkdownFrontmatter(md, 'solar-system.md')
    expect(result.valid).toBe(false)
    expect(result.errors.every(e => e.filePath === 'solar-system.md')).toBe(true)
  })
})
