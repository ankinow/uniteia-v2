import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import matter from 'gray-matter'
import addFormats from 'ajv-formats'
import Ajv2020, { type DefinedError } from 'ajv/dist/2020'
import { validateSlug } from '~/utils/url-validation'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent, ContentValidationError } from './types'

/**
 * Supported language codes for quick lookup
 */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

/**
 * Root directory for markdown content files
 * Resolved relative to this source file's location at build/runtime
 */
const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_ROOT = resolve(__dirname, '../../../../llm-wiki')

/**
 * Lazily initialized AJV validator with Draft 2020-12 support
 * Compiled once and reused across requests
 */
let _validate: ReturnType<Ajv2020['compile']>

function getValidator() {
  if (_validate) return _validate

  const ajv = new Ajv2020({ allErrors: true, strict: true })
  addFormats(ajv)

  const schemaPath = resolve(__dirname, '../../../../schemas/llm-wiki-v1.schema.json')
  const schemaContent = readFileSync(schemaPath, 'utf-8')
  const schema = JSON.parse(schemaContent) as object
  ajv.addSchema(schema)

  _validate = ajv.compile(schema)
  return _validate
}

/**
 * Reads and validates a markdown content file
 * Returns typed LlmWikiContent or throws for 404/validation errors
 */
function loadContentFile(lang: string, slug: string): LlmWikiContent {
  const filePath = resolve(CONTENT_ROOT, lang, `${slug}.md`)

  // Attempt to read the file; throw 404 if missing
  let rawContent: string
  try {
    rawContent = readFileSync(filePath, 'utf-8')
  } catch {
    throw new Error(`NOT_FOUND:${lang}/${slug}`)
  }

  // Parse frontmatter with gray-matter
  const { data: frontmatter, content: markdownBody } = matter(rawContent)

  // Build the content object expected by the schema
  const contentObject = {
    ...frontmatter,
    content: markdownBody.trim(),
  }

  // Validate against AJV schema
  const validate = getValidator()
  const valid = validate(contentObject)
  if (!valid) {
    const errors = (validate.errors as DefinedError[] | null)?.map(
      err => `${err.instancePath || '/'}: ${err.message ?? 'unknown error'}`
    ) ?? ['Unknown validation error']

    const validationError: ContentValidationError = {
      slug,
      lang,
      errors,
    }

    // Log validation failures to server console (not client-exposed)
    console.error(
      `[content-validation] Validation failed for ${lang}/${slug}:`,
      JSON.stringify(validationError, null, 2)
    )

    throw new Error(`VALIDATION_FAILED:${lang}/${slug}`)
  }

  // Additional slug validation beyond schema pattern match
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    console.error(
      `[content-validation] Slug validation failed for ${lang}/${slug}: ${slugValidation.error}`
    )
    throw new Error(`VALIDATION_FAILED:${lang}/${slug}`)
  }

  return contentObject as LlmWikiContent
}

/**
 * routeLoader$ that reads markdown from /llm-wiki/*.md,
 * parses frontmatter with gray-matter,
 * validates against the AJV Draft 2020-12 schema,
 * validates slug via validateSlug(),
 * and returns typed content or throws 404.
 */
export const useContent = routeLoader$<LlmWikiContent>(async ({ params, error }) => {
  const lang = params.lang
  const slugRaw = params.slug

  // Validate language prefix
  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  // Reconstruct slug from catchall segments (Qwik-City joins with /)
  if (!slugRaw) {
    throw error(404, 'No slug provided')
  }
  const slug = slugRaw.replaceAll('/', '-')

  try {
    return loadContentFile(lang, slug)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    if (message.startsWith('NOT_FOUND:')) {
      // Missing content returns 404 via Qwik-City error mechanism
      console.warn(`[content-loader] Content not found: ${lang}/${slug}`)
      throw error(404, `Article not found: ${lang}/${slug}`)
    }

    if (message.startsWith('VALIDATION_FAILED:')) {
      // Schema-invalid content returns 404 to client (details already logged server-side)
      throw error(404, `Article not found: ${lang}/${slug}`)
    }

    // Unexpected errors — log and return 500
    console.error(`[content-loader] Unexpected error loading ${lang}/${slug}:`, message)
    throw error(500, 'Internal server error')
  }
})

/**
 * Content route page component
 * Renders the article content (full component wiring in T04)
 */
export default component$(() => {
  const content = useContent()

  return (
    <article data-testid="article-frame" class="mx-auto max-w-prose px-4 py-8 md:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-bone-primary md:text-4xl lg:text-5xl">
        {content.value.title}
      </h1>
      <div class="mt-4 text-sm text-bone-secondary">{content.value.lang.toUpperCase()}</div>
      <div class="prose prose-invert mt-8 max-w-none">
        {content.value.content}
      </div>
    </article>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const content = resolveValue(useContent)
  return {
    title: `${content.title} | UniTeia`,
    meta: [
      { name: 'description', content: content.subjects.join(', ') },
      { name: 'robots', content: 'index, follow' },
    ],
  }
}
