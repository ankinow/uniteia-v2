import { readFile, readdir } from 'node:fs/promises'
import { basename, join, relative } from 'node:path'
import matter from 'gray-matter'
import { validateSlug } from './url-validation'

export interface SlugCheckIssue {
  kind:
    | 'invalid-slug'
    | 'frontmatter-missing'
    | 'frontmatter-mismatch'
    | 'parse-failed'
    | 'no-markdown-files'
  filePath: string
  message: string
}

export interface SlugCheckReport {
  ok: boolean
  checkedFiles: number
  issues: SlugCheckIssue[]
}

export interface EvaluateSlugCheckOptions {
  rootDir?: string
  ignoreTestFixtures?: boolean
}

export async function evaluateSlugCheck(
  options: EvaluateSlugCheckOptions = {}
): Promise<SlugCheckReport> {
  const rootDir = options.rootDir ?? 'llm-wiki'
  const ignoreTestFixtures = options.ignoreTestFixtures ?? true
  const files = (await findMarkdownFiles(rootDir)).filter(filePath => {
    if (!ignoreTestFixtures) return true
    const fileSlug = basename(filePath, '.md')
    return fileSlug !== 'test-admin' && fileSlug !== 'test-invalid-schema'
  })

  if (files.length === 0) {
    return {
      ok: false,
      checkedFiles: 0,
      issues: [
        {
          kind: 'no-markdown-files',
          filePath: rootDir,
          message: `No markdown files found under ${rootDir}.`,
        },
      ],
    }
  }

  const issues: SlugCheckIssue[] = []

  for (const filePath of files) {
    const relativePath = relative(process.cwd(), filePath)
    const fileSlug = basename(filePath, '.md')

    if (ignoreTestFixtures && (fileSlug === 'test-admin' || fileSlug === 'test-invalid-schema')) {
      continue
    }

    const slugValidation = validateSlug(fileSlug)

    if (!slugValidation.valid) {
      issues.push({
        kind: 'invalid-slug',
        filePath: relativePath,
        message: slugValidation.error ?? `Invalid slug in ${relativePath}.`,
      })
    }

    try {
      const raw = await readFile(filePath, 'utf-8')
      const parsed = matter(raw)
      const frontmatterSlug = parsed.data.slug

      if (typeof frontmatterSlug !== 'string' || frontmatterSlug.length === 0) {
        issues.push({
          kind: 'frontmatter-missing',
          filePath: relativePath,
          message: `Missing frontmatter slug in ${relativePath}.`,
        })
        continue
      }

      if (frontmatterSlug !== fileSlug) {
        issues.push({
          kind: 'frontmatter-mismatch',
          filePath: relativePath,
          message: `Frontmatter slug "${frontmatterSlug}" does not match file slug "${fileSlug}".`,
        })
      }
    } catch (error) {
      issues.push({
        kind: 'parse-failed',
        filePath: relativePath,
        message: `Failed to parse frontmatter: ${error instanceof Error ? error.message : String(error)}`,
      })
    }
  }

  return {
    ok: issues.length === 0,
    checkedFiles: files.length,
    issues,
  }
}

export function formatSlugCheckReport(report: SlugCheckReport): string {
  if (report.ok) {
    return `✅ Slug check passed for ${report.checkedFiles} markdown file(s).`
  }

  return [
    `❌ Slug check failed for ${report.checkedFiles} markdown file(s).`,
    ...report.issues.map(issue => `- ${issue.filePath} [${issue.kind}] ${issue.message}`),
  ].join('\n')
}

async function findMarkdownFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = join(rootDir, entry.name)
      if (entry.isDirectory()) {
        return findMarkdownFiles(entryPath)
      }
      return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : []
    })
  )

  return files.flat().sort((left, right) => left.localeCompare(right))
}
