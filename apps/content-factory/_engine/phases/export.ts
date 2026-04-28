import fs from 'node:fs/promises'
import path from 'node:path'
import Handlebars from 'handlebars'
import yaml from 'yaml'
import { getCtaLabel } from '../i18n/cta'
import { getDisclosure } from '../i18n/disclosure'
import { type SupportedLang, getHeadings } from '../i18n/headings'
import { generateJsonLd, generateSeoMetadata } from '../seo/metadata'

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

/** Escape a string for safe YAML scalar (wrap in quotes if special chars) */
function yamlSafe(s: string): string {
  if (/[:\n"{}[\],&*?|>!%#@`]/.test(s)) {
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  return s
}

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

  // Register helpers
  const hbs = Handlebars.create()
  hbs.registerHelper('yamlSafe', yamlSafe)
  hbs.registerHelper('json', (v: unknown) => JSON.stringify(v))
  hbs.registerHelper('eq', (a: any, b: any) => a === b)
  hbs.registerHelper('zip', (a: any[], b: any[]) => {
    const len = Math.max(a?.length || 0, b?.length || 0)
    const out = []
    for (let i = 0; i < len; i++) {
      out.push([a?.[i] || '', b?.[i] || ''])
    }
    return out
  })

  const tpl = hbs.compile(
    await fs.readFile(path.join(input.templatesDir, 'llm-wiki-page.md.hbs'), 'utf8'),
    { noEscape: true }
  )

  // Use stable timestamps from core, not new Date()
  const stamp = (core.updated as string) ?? (core.created as string) ?? '1970-01-01T00:00:00Z'
  const wordCount = countWords(blog) + countWords(String(core.summary_short ?? ''))

  // Get i18n headings
  const headings = getHeadings(input.lang as SupportedLang)
  const disclosureText = getDisclosure(input.lang as SupportedLang)
  const ctaOfficial = getCtaLabel(input.lang as SupportedLang, 'official')
  const ctaPartner = getCtaLabel(input.lang as SupportedLang, 'partner')

  // Get SEO metadata
  const seo = generateSeoMetadata(input.slug, input.lang as SupportedLang)
  const jsonLd = generateJsonLd(core, input.slug, input.lang as SupportedLang)

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
    h: headings,
    disclosure_text: disclosureText,
    cta: {
      official: ctaOfficial,
      partner: ctaPartner,
    },
    seo_meta: seo,
    json_ld: jsonLd,
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
