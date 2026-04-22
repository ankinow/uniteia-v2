import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'

/**
 * Load and validate wiki content from a markdown file.
 *
 * Encapsulates the full pipeline: read .md file → parse with gray-matter →
 * validate against AJV Draft 2020-12 schema → validate slug → return typed
 * LlmWikiContent or throw ContentLoaderError.
 *
 * ALL Node.js imports are dynamic `await import()` inside the function body
 * per D001/MEM002/MEM012 — static imports of node:*, gray-matter, ajv, or
 * ajv-formats would cause Rollup's __vite-browser-external error during the
 * Qwik client build because the code would not be tree-shaken from the
 * client bundle.
 *
 * The function computes the content root relative to its own file location
 * (src/utils/) going up 2 levels to the project root.
 */
export async function loadContent(slug: string, lang: SupportedLanguage): Promise<LlmWikiContent> {
  // D001: dynamic imports for all Node.js / server-only modules
  const { readFileSync } = await import('node:fs')
  const { resolve, dirname } = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const matter = (await import('gray-matter')).default
  const Ajv2020 = (await import('ajv/dist/2020')).default
  const addFormats = (await import('ajv-formats')).default
  const { validateSlug } = await import('~/utils/url-validation')

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const CONTENT_ROOT = resolve(__dirname, '..', '..', 'llm-wiki')

  // ---- Phase: read ----
  const filePath = resolve(CONTENT_ROOT, lang, `${slug}.md`)
  let rawContent: string
  try {
    rawContent = readFileSync(filePath, 'utf-8')
  } catch {
    console.error(`[content-loader] Content not found: ${lang}/${slug}`)
    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'read',
      errors: ['Content not found'],
    })
  }

  // ---- Phase: parse ----
  let frontmatter: Record<string, unknown>
  let markdownBody: string
  try {
    const parsed = matter(rawContent)
    frontmatter = parsed.data as Record<string, unknown>
    markdownBody = parsed.content
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[content-loader] Parse failed for ${lang}/${slug}: ${message}`)
    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'parse',
      errors: [message],
    })
  }

  // ---- Phase: schema ----
  const contentObject = {
    ...frontmatter,
    content: markdownBody.trim(),
  }

  let ajv: InstanceType<typeof Ajv2020>
  try {
    ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[content-loader] AJV init failed for ${lang}/${slug}: ${message}`)
    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'schema',
      errors: [`AJV initialization failed: ${message}`],
    })
  }

  const schemaPath = resolve(CONTENT_ROOT, '..', 'schemas', 'llm-wiki-v1.schema.json')
  let schema: object
  try {
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    schema = JSON.parse(schemaContent) as object
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[content-loader] Schema read failed for ${lang}/${slug}: ${message}`)
    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'schema',
      errors: [`Schema file read/parse failed: ${message}`],
    })
  }

  ajv.addSchema(schema)
  const validate = ajv.compile(schema)
  const valid = validate(contentObject)

  if (!valid) {
    const errors = (validate.errors as { instancePath: string; message?: string }[] | null)?.map(
      err => `${err.instancePath || '/'}: ${err.message ?? 'unknown error'}`
    ) ?? ['Unknown validation error']

    console.error(
      `[content-loader] Schema validation failed for ${lang}/${slug}:`,
      JSON.stringify({ slug, lang, errors }, null, 2)
    )

    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'schema',
      errors,
    })
  }

  // ---- Phase: slug ----
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    console.error(
      `[content-loader] Slug validation failed for ${lang}/${slug}: ${slugValidation.error}`
    )
    throw new ContentLoaderError({
      slug,
      lang,
      phase: 'slug',
      errors: [slugValidation.error ?? 'Slug validation failed'],
    })
  }

  return contentObject as LlmWikiContent
}
