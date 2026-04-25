import fs from 'node:fs/promises'
import path from 'node:path'
import Handlebars from 'handlebars'
import yaml from 'yaml'

export type Lang = 'en' | 'pt' | 'es' | 'ja' | 'zh'

export interface ExportIn {
  slug: string
  lang: Lang
  workdir: string
  publishDir: string
  templatesDir: string
}

export interface ExportOk {
  status: 'ok'
  output_path: string
  word_count: number
}
export interface ExportFail {
  status: 'fail'
  failed_rules: string[]
}
export type ExportOut = ExportOk | ExportFail

export async function runExport(input: ExportIn): Promise<ExportOut> {
  const corePath = path.join(input.workdir, 'core.yaml')
  const blogPath = path.join(input.workdir, 'blog.md')
  let core: Record<string, unknown>
  let blog: string
  try {
    core = yaml.parse(await fs.readFile(corePath, 'utf8'))
  } catch {
    return { status: 'fail', failed_rules: ['export:core_missing'] }
  }
  try {
    blog = await fs.readFile(blogPath, 'utf8')
  } catch {
    return { status: 'fail', failed_rules: ['export:blog_missing'] }
  }

  const tpl = Handlebars.compile(
    await fs.readFile(path.join(input.templatesDir, 'llm-wiki-page.md.hbs'), 'utf8'),
    { noEscape: true }
  )
  const stamp = (core.updated as string) ?? (core.created as string) ?? '1970-01-01T00:00:00Z'
  const wordCount = countWords(blog) + countWords(String(core.summary_short ?? ''))
  const ctx = {
    ...core,
    blog_body: blog.trim(),
    slug: input.slug,
    lang: input.lang,
    created: stamp,
    updated: stamp,
    word_count: wordCount,
    reading_time_min: Math.max(1, Math.round(wordCount / 220)),
    evidence_count: Array.isArray(core.evidence) ? (core.evidence as unknown[]).length : 0,
  }
  const out = tpl(ctx)
  await fs.mkdir(path.join(input.publishDir, input.lang), { recursive: true })
  const outPath = path.join(input.publishDir, input.lang, `${input.slug}.md`)
  await fs.writeFile(outPath, out)
  return { status: 'ok', output_path: outPath, word_count: wordCount }
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}
