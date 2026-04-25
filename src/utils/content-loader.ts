import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'

/**
 * Load and validate wiki content from a markdown file.
 *
 * Encapsulates the full pipeline: read .md file → parse with gray-matter →
 * transform Markdown to HTML with marked → validate slug → return typed
 * LlmWikiContent or throw ContentLoaderError.
 *
 * Uses Vite's import.meta.glob to bundle all markdown files.
 * This ensures content is available in Cloudflare Workers where node:fs is unavailable.
 */
export async function loadContent(
  niche: string,
  slug: string,
  lang: SupportedLanguage
): Promise<LlmWikiContent> {
  // Dynamic imports for browser-safe modules (gray-matter works in worker)
  const matter = (await import('gray-matter')).default
  const { marked } = await import('marked')
  const { validateSlug } = await import('~/utils/url-validation')

  const contentModules = import.meta.glob<string>('../../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const contentKey = `../../content/${niche}/${lang}/${slug}.md`
  const rawContent = contentModules[contentKey]

  if (!rawContent) {
    console.error(
      `[content-loader] Content not found: ${niche}/${lang}/${slug} (tried ${contentKey})`
    )
    throw new ContentLoaderError({
      niche,
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
    const parsed = matter(rawContent, {
      engines: {
        js: () => {
          throw new Error('JS eval disabled')
        },
      },
    })
    frontmatter = parsed.data as Record<string, unknown>
    markdownBody = parsed.content
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[content-loader] Parse failed for ${niche}/${lang}/${slug}: ${message}`)
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'parse',
      errors: [message],
    })
  }

  // ---- Phase: transform ----
  let htmlContent: string
  try {
    // marked.parse is async or sync based on options; we await it for safety
    htmlContent = (await marked.parse(markdownBody.trim())) as string
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(
      `[content-loader] Markdown transformation failed for ${niche}/${lang}/${slug}: ${message}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'parse', // Reuse parse phase for transformation errors
      errors: [`Markdown transformation failed: ${message}`],
    })
  }

  // ---- Phase: schema ----
  const contentObject = {
    ...frontmatter,
    slug,
    lang,
    content: htmlContent,
  }

  // ---- Phase: slug ----
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    console.error(
      `[content-loader] Slug validation failed for ${niche}/${lang}/${slug}: ${slugValidation.error}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'slug',
      errors: [slugValidation.error ?? 'Slug validation failed'],
    })
  }

  const translations = await getAvailableLanguages(niche, slug)

  return {
    ...contentObject,
    translations,
  } as LlmWikiContent
}

/**
 * Discover all available languages for a specific article slug within a niche.
 *
 * Scans the virtual filesystem (import.meta.glob) for matches following the
 * pattern: content/{niche}/{lang}/{slug}.md
 */
export async function getAvailableLanguages(
  niche: string,
  slug: string
): Promise<SupportedLanguage[]> {
  const contentModules = import.meta.glob('../../content/**/*.md')

  const prefix = `../../content/${niche}/`
  const suffix = `/${slug}.md`

  return Object.keys(contentModules)
    .filter((key) => key.startsWith(prefix) && key.endsWith(suffix))
    .map((key) => {
      // Extract the {lang} part from ../../content/{niche}/{lang}/{slug}.md
      const parts = key.replace(prefix, '').replace(suffix, '').split('/')
      return parts[0] as SupportedLanguage
    })
}

/**
 * Lightweight sitemap discovery helper that returns all valid article files
 * for a niche without parsing markdown bodies.
 *
 * Invalid slugs are skipped so editorial fixtures used for validation do not
 * leak into the public sitemap.
 */
export interface NicheArticleEntry {
  slug: string
  lang: SupportedLanguage
}

export async function listNicheArticles(niche: string): Promise<NicheArticleEntry[]> {
  const { validateSlug } = await import('~/utils/url-validation')
  const contentModules = import.meta.glob('../../content/**/*.md')

  const prefix = `../../content/${niche}/`

  const articles = Object.keys(contentModules)
    .filter((key) => key.startsWith(prefix))
    .flatMap((key) => {
      const relativePath = key.slice(prefix.length)
      const segments = relativePath.split('/')

      if (segments.length !== 2 || !segments[0] || !segments[1]?.endsWith('.md')) {
        return []
      }

      const lang = segments[0] as SupportedLanguage
      const slug = segments[1].replace(/\.md$/, '')
      const slugValidation = validateSlug(slug)

      if (!slugValidation.valid) {
        console.warn(
          `[content-loader] Skipping invalid sitemap slug ${niche}/${lang}/${slug}: ${slugValidation.error}`
        )
        return []
      }

      return [{ slug, lang }]
    })

  return articles.sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang))
}
