import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { evaluateSlugCheck, formatSlugCheckReport } from '~/utils/slug-check'

async function createSlugFixture(files: Record<string, string>) {
  const rootDir = await mkdtemp(join(tmpdir(), 'uniteia-slug-check-'))

  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      const absolutePath = join(rootDir, relativePath)
      await mkdir(dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, content, 'utf-8')
    })
  )

  return {
    rootDir,
    cleanup: () => rm(rootDir, { recursive: true, force: true }),
  }
}

describe('evaluateSlugCheck', () => {
  it('passes when markdown filenames and frontmatter slugs are valid and aligned', async () => {
    const fixture = await createSlugFixture({
      'llm-wiki/en/test-article.md':
        '---\nslug: test-article\nlang: en\ntitle: Valid Fixture\n---\n\nBody',
    })

    try {
      const report = await evaluateSlugCheck({ rootDir: join(fixture.rootDir, 'llm-wiki') })

      expect(report.ok).toBe(true)
      expect(report.checkedFiles).toBe(1)
      expect(report.issues).toHaveLength(0)
    } finally {
      await fixture.cleanup()
    }
  })

  it('fails when a markdown file uses an invalid slug or mismatched frontmatter slug', async () => {
    const fixture = await createSlugFixture({
      'llm-wiki/en/top-article.md':
        '---\nslug: other-article\nlang: en\ntitle: Invalid Fixture\n---\n\nBody',
    })

    try {
      const report = await evaluateSlugCheck({ rootDir: join(fixture.rootDir, 'llm-wiki') })

      expect(report.ok).toBe(false)
      expect(report.checkedFiles).toBe(1)
      expect(report.issues.some(issue => issue.kind === 'invalid-slug')).toBe(true)
      expect(report.issues.some(issue => issue.kind === 'frontmatter-mismatch')).toBe(true)
      const output = formatSlugCheckReport(report)
      expect(output).toContain('top-article.md')
      expect(output).toContain('other-article')
    } finally {
      await fixture.cleanup()
    }
  })
})
