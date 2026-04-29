import matter from 'gray-matter'
import { marked } from 'marked'
import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'

/**
 * Article metadata structure for navigation
 * Lightweight version of LlmWikiContent with only navigation-relevant fields
 */
export interface ArticleMeta {
  slug: string
  lang: SupportedLanguage
  title: string
  type: 'article' | 'index'
  subjects: string[]
}

/**
 * Navigation data structure keyed by niche
 * Build-time derived from content scans
 */
export interface NavigationData {
  niches: {
    [niche: string]: {
      langs: SupportedLanguage[]
      articles: ArticleMeta[]
    }
  }
}

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
  const { validateSlug } = await import('~/utils/url-validation')
  const { validateContent } = await import('~/utils/schema-validation')

  const contentModules = import.meta.glob<string>('../../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const contentKey = Object.keys(contentModules).find(k =>
    k.endsWith(`/content/${niche}/${lang}/${slug}.md`)
  )
  const rawContent = contentKey ? contentModules[contentKey] : undefined

  if (!rawContent) {
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
    marked.use({
      async: false,
      breaks: false,
      gfm: true,
      renderer: {
        heading({ tokens, depth }) {
          if (depth === 1) return ''
          return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`
        },
      },
    })

    // marked.parse is async or sync based on options; we await it for safety
    // No DOMPurify here to avoid SSR transformation issues.
    // Content is pre-validated during generation.
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

  const validation = validateContent(contentObject, contentKey, { skipSlugValidation: true })
  if (!validation.valid) {
    const errorMessages = validation.errors.map(e => `[${e.field}] ${e.message}`)
    console.error(
      `[content-loader] Schema validation failed for ${niche}/${lang}/${slug}: ${errorMessages.join('; ')}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'schema',
      errors: errorMessages,
    })
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

  const suffix = `/${niche}/`
  const fileSuffix = `/${slug}.md`

  return Object.keys(contentModules)
    .filter(key => key.includes(suffix) && key.endsWith(fileSuffix))
    .map(key => {
      // Extract lang from .../content/{niche}/{lang}/{slug}.md
      const segments = key.split('/')
      const langIndex = segments.indexOf(niche) + 1
      return segments[langIndex] as SupportedLanguage
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
  updatedAt: string | undefined
  title: string
  summary: string | undefined
}

const nicheArticlesCache = new Map<string, NicheArticleEntry[]>()

export function clearNicheArticlesCache(): void {
  nicheArticlesCache.clear()
}

export async function listNicheArticles(niche: string): Promise<NicheArticleEntry[]> {
  const cachedArticles = nicheArticlesCache.get(niche)
  if (cachedArticles) {
    return cachedArticles
  }

  const { validateSlug } = await import('~/utils/url-validation')

  // Use a relative path that works for both dev and build
  const contentModules = import.meta.glob<string>('../../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  // Normalize niche for matching - handle apex case
  const isApex = niche === 'apex'
  const targetPrefix = isApex ? '/content/apex/' : `/content/${niche}/`

  const articles = Object.entries(contentModules)
    .filter(([key]) => {
      const normalizedKey = key.replace(/^\.\.\/\.\.\//, '/')
      return normalizedKey.startsWith(targetPrefix)
    })
    .flatMap(([key, rawContent]) => {
      const normalizedKey = key.replace(/^\.\.\/\.\.\//, '/')
      const relativePath = normalizedKey.slice(targetPrefix.length)
      const segments = relativePath.split('/')

      if (segments.length !== 2 || !segments[0] || !segments[1]?.endsWith('.md')) {
        return []
      }

      const lang = segments[0] as SupportedLanguage
      const slug = segments[1].replace(/\.md$/, '')
      const slugValidation = validateSlug(slug)

      if (!slugValidation.valid) {
        return []
      }

      // Parse frontmatter for updatedAt
      let updatedAt: string | undefined
      let title = slug
      let summary: string | undefined
      try {
        if (rawContent) {
          const parsed = matter(rawContent, {
            engines: {
              js: () => {
                throw new Error('JS eval disabled')
              },
            },
          })
          updatedAt = (parsed.data.metadata?.updated_at ||
            parsed.data.metadata?.created_at) as string
          title = parsed.data.title || title
          summary = parsed.data.summary || parsed.data.description
        }
      } catch {}

      return [{ slug, lang, updatedAt, title, summary }]
    })
    .sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang))

  nicheArticlesCache.set(niche, articles)
  return articles
}

/**
 * Memoization cache for navigation data (dev builds only).
 * Build-time operation - persists across calls within the same build process.
 */
let navigationCache: NavigationData | null = null

/**
 * Derives complete navigation structure from content files.
 *
 * Scans content/{niche}/{lang}/{slug}.md using import.meta.glob,
 * extracts frontmatter (slug, lang, title, type, subjects),
 * and structures as { niches: { [niche]: { langs: [], articles: [] } } }.
 *
 * Identifies _index.md files as landing pages (type: 'index').
 * Results are memoized for dev builds to avoid repeated glob scans.
 *
 * Build-time only - runs during Vite build, not at runtime in Workers.
 */
export async function deriveNavigation(): Promise<NavigationData> {
  // Return cached result if available (dev builds)
  if (navigationCache) {
    return navigationCache
  }

  const { validateSlug } = await import('~/utils/url-validation')

  // Build-time scan of all content files
  const contentModules = import.meta.glob<string>('../../content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const niches: NavigationData['niches'] = {}

  for (const [key, rawContent] of Object.entries(contentModules)) {
    // Parse path: .../content/{niche}/{lang}/{slug}.md
    const match = key.match(/\/content\/([^/]+)\/([^/]+)\/(.+)\.md$/)
    if (!match) continue

    const [, niche, lang, slug] = match
    // Validate capture groups exist before using as index
    if (!niche || !lang || !slug) continue

    // Skip invalid slugs
    const slugValidation = validateSlug(slug)
    if (!slugValidation.valid) {
      continue
    }

    // Parse frontmatter
    try {
      const parsed = matter(rawContent, {
        engines: {
          js: () => {
            throw new Error('JS eval disabled')
          },
        },
      })

      const frontmatter = parsed.data as Record<string, unknown>

      // Extract required fields
      const title = typeof frontmatter.title === 'string' ? frontmatter.title : slug
      const subjects = Array.isArray(frontmatter.subjects)
        ? frontmatter.subjects.filter((s): s is string => typeof s === 'string')
        : []

      // Determine type: index for _index.md, article otherwise
      const type: ArticleMeta['type'] = slug === '_index' ? 'index' : 'article'

      // Initialize niche structure if needed
      if (!niches[niche]) {
        niches[niche] = {
          langs: [],
          articles: [],
        }
      }

      // Add language if not already present
      const langSupported = lang as SupportedLanguage
      if (!niches[niche].langs.includes(langSupported)) {
        niches[niche].langs.push(langSupported)
      }

      // Add article metadata
      niches[niche].articles.push({
        slug,
        lang: langSupported,
        title,
        type,
        subjects,
      })
    } catch {}
  }

  const result: NavigationData = { niches }

  // Memoize for dev builds
  navigationCache = result

  return result
}

/**
 * Clears the navigation memoization cache.
 * Useful for test isolation or when content changes in dev mode.
 */
export function clearNavigationCache(): void {
  navigationCache = null
}
