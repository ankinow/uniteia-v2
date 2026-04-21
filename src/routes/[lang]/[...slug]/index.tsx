import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import { AdaptiveHeader } from '~/components/adaptive-header'
import { ArticleFrame } from '~/components/article-frame'
import { FrontmatterSlots } from '~/components/frontmatter-slots'
import { SourceLedger } from '~/components/source-ledger'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { ContentValidationError, LlmWikiContent } from './types'

/**
 * Supported language codes for quick lookup
 */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

/**
 * routeLoader$ that reads markdown from /llm-wiki/*.md,
 * parses frontmatter with gray-matter,
 * validates against the AJV Draft 2020-12 schema,
 * validates slug via validateSlug(),
 * and returns typed content or throws 404.
 *
 * All Node.js imports are inside the loader to ensure they are
 * excluded from the client bundle by Qwik's code splitting.
 */
export const useContent = routeLoader$<LlmWikiContent>(async ({ params, error }) => {
  // Dynamic server-only imports — these are tree-shaken from the client bundle
  const { readFileSync } = await import('node:fs')
  const { resolve, dirname } = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const matter = (await import('gray-matter')).default
  const Ajv2020 = (await import('ajv/dist/2020')).default
  const addFormats = (await import('ajv-formats')).default
  const { validateSlug } = await import('~/utils/url-validation')

  const __dirname = dirname(fileURLToPath(import.meta.url))
  const CONTENT_ROOT = resolve(__dirname, '../../../../llm-wiki')

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

  // Build file path and attempt to read
  const filePath = resolve(CONTENT_ROOT, lang, `${slug}.md`)
  let rawContent: string
  try {
    rawContent = readFileSync(filePath, 'utf-8')
  } catch {
    console.warn(`[content-loader] Content not found: ${lang}/${slug}`)
    throw error(404, `Article not found: ${lang}/${slug}`)
  }

  // Parse frontmatter with gray-matter
  const { data: frontmatter, content: markdownBody } = matter(rawContent)

  // Build the content object expected by the schema
  const contentObject = {
    ...frontmatter,
    content: markdownBody.trim(),
  }

  // Initialize AJV with Draft 2020-12 support and validate
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  addFormats(ajv)

  const schemaPath = resolve(__dirname, '../../../../schemas/llm-wiki-v1.schema.json')
  const schemaContent = readFileSync(schemaPath, 'utf-8')
  const schema = JSON.parse(schemaContent) as object
  ajv.addSchema(schema)
  const validate = ajv.compile(schema)

  const valid = validate(contentObject)
  if (!valid) {
    const errors = (validate.errors as { instancePath: string; message?: string }[] | null)?.map(
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

    throw error(404, `Article not found: ${lang}/${slug}`)
  }

  // Additional slug validation beyond schema pattern match
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    console.error(
      `[content-validation] Slug validation failed for ${lang}/${slug}: ${slugValidation.error}`
    )
    throw error(404, `Article not found: ${lang}/${slug}`)
  }

  return contentObject as LlmWikiContent
})

/**
 * Content route page component
 * Uses ArticleFrame + AdaptiveHeader components for content display
 */
export default component$(() => {
  const content = useContent()

  return (
    <ArticleFrame>
      <AdaptiveHeader title={content.value.title} subtitle={content.value.subjects.join(', ')} />
      <FrontmatterSlots
        subjects={content.value.subjects}
        lang={content.value.lang}
        metadata={content.value.metadata}
      />
      <div class="prose prose-invert mt-8 max-w-none text-bone-primary">
        {content.value.content}
      </div>
      <SourceLedger referralLinks={content.value.referral_links} />
    </ArticleFrame>
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
