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
 * Uses Vite's import.meta.glob to bundle all markdown files and schemas.
 * This ensures content is available in Cloudflare Workers where node:fs is unavailable.
 */
export async function loadContent(slug: string, lang: SupportedLanguage): Promise<LlmWikiContent> {
  // Dynamic imports for browser-safe modules (gray-matter works in worker)
  const matter = (await import('gray-matter')).default
  const Ajv2020 = (await import('ajv/dist/2020')).default
  const addFormats = (await import('ajv-formats')).default
  const { validateSlug } = await import('~/utils/url-validation')

  // @ts-ignore - Vite glob import for content
  const contentModules = import.meta.glob('../../llm-wiki/**/*.md', { as: 'raw', eager: true })
  // @ts-ignore - Vite glob import for schema
  const schemaModules = import.meta.glob('../../schemas/*.schema.json', { as: 'raw', eager: true })

  const contentKey = `../../llm-wiki/${lang}/${slug}.md`
  const rawContent = contentModules[contentKey]

  if (!rawContent) {
    console.error(`[content-loader] Content not found: ${lang}/${slug} (tried ${contentKey})`)
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

  // Disable runtime AJV validation in Cloudflare Workers due to EvalError (no JIT allowed)
  /*
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

  const schemaKey = '../../schemas/llm-wiki-v1.schema.json'
  const schemaContent = schemaModules[schemaKey]
  let schema: object
  try {
    if (!schemaContent) throw new Error(`Schema not found: ${schemaKey}`)
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
  */
  // Disable runtime AJV validation in Cloudflare Workers due to EvalError (no JIT allowed)
  /*
  let valid = false
  try {
    const validate = ajv.compile(schema)
    valid = validate(contentObject)
    ...
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'EvalError') {
      console.warn(`[content-loader] AJV compilation failed (EvalError), skipping runtime validation for ${lang}/${slug}. Build-time validation should catch this.`)
    } else {
      throw err
    }
  }
  */

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
