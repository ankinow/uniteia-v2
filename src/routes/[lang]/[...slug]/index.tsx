import { component$ } from '@builder.io/qwik'
import { type DocumentHead, type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { ArticleRenderer } from '~/components/article-renderer'
import { NotFound } from '~/components/error-pages/not-found'
import type { ContentLocale, ContentNode } from '~/content-graph/contracts/node'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'
import { extractDescription } from '~/utils/text-utils'

/**
 * Supported language codes for quick lookup
 */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onRequest: RequestHandler = async event => {
  const lang = event.params.lang ?? ''
  const slugRaw = event.params.slug ?? ''

  if (!lang || !VALID_LANG_CODES.has(lang)) return

  const slug = slugRaw.replaceAll('/', '-')
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const { isPublicNode } = await import('~/content-graph')

  const node = contentGraphProvider
    .getNodes({ locale: lang as ContentLocale, visibility: 'public' })
    .find(n => n.slug === slug && isPublicNode(n))

  if (node) {
    const firstNiche = node.niche[0] ?? 'apex'
    throw event.redirect(308, `/${lang}/signals/${firstNiche}/${node.slug}`)
  }
}

/**
 * Thin routeLoader$ wrapper that validates lang, calls loadContent(),
 * and catches ContentLoaderError → error(404).
 *
 * All server-only logic (fs, gray-matter, ajv) lives in loadContent()
 * which uses dynamic imports per D001 to stay tree-shaken from client.
 */
export const useContent = routeLoader$<LlmWikiContent | null>(async ({ params, error }) => {
  const lang = params.lang
  const slugRaw = params.slug

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  if (!slugRaw) {
    throw error(404, 'No slug provided')
  }

  const slug = slugRaw.replaceAll('/', '-')

  const { contentGraphProvider } = await import('~/content-graph.generated')
  const node = contentGraphProvider
    .getNodes({ locale: lang as ContentLocale })
    .find(n => n.slug === slug)
  const niche = node?.niche[0] ?? 'apex'

  try {
    return await loadContent(niche, slug, lang as SupportedLanguage)
  } catch (err) {
    if (err instanceof ContentLoaderError) {
      if (err.phase !== 'read') {
        console.error(
          `[content-loader] ${err.phase} failed for ${err.lang}/${err.slug}:`,
          err.errors
        )
      }
      return null as unknown as LlmWikiContent | null
    }
    throw err
  }
})

export const useRelated = routeLoader$<ContentNode[]>(async ({ params }) => {
  const lang = params.lang
  const slugRaw = params.slug
  if (!lang || !slugRaw) return []

  const { contentGraphProvider } = await import('~/content-graph.generated')
  const { isPublicNode } = await import('~/content-graph')

  const slug = slugRaw.replaceAll('/', '-')
  const locale = lang as import('~/content-graph').ContentLocale
  const current = contentGraphProvider.getNodes({ locale }).find(n => n.slug === slug)

  if (!current) {
    const nicheNodes = contentGraphProvider
      .getNodes({ locale })
      .filter(n => n.locale === lang && isPublicNode(n) && n.slug !== slug)
    return nicheNodes.slice(0, 4)
  }

  const related = contentGraphProvider
    .getRelated(current.id, locale)
    .filter(isPublicNode)
    .slice(0, 4)

  if (related.length > 0) return related

  const nicheRelated = contentGraphProvider
    .getNodes({ locale, visibility: 'public' })
    .filter(n => n.niche.some(nn => current.niche.includes(nn)) && n.id !== current.id)

  return nicheRelated.slice(0, 4)
})

/**
 * Content route page component
 * Uses ArticleFrame + AdaptiveHeader + FrontmatterSlots + SourceLedger
 * with i18n-aware labels from the translation context
 */
export default component$(() => {
  const content = useContent()
  const relatedNodes = useRelated()

  if (!content.value) {
    return <NotFound />
  }

  return (
    <ArticleRenderer
      content={content.value}
      relatedNodes={relatedNodes.value}
      withErrorBoundary={false}
      labels={{
        subjectsLabel: getTranslation(content.value.lang).article.subjectsLabel,
        byAuthor: getTranslation(content.value.lang).article.byAuthor,
        version: getTranslation(content.value.lang).article.version,
        readInLang: getTranslation(content.value.lang).article.readInLang,
      }}
    />
  )
})

export const head: DocumentHead = ({ resolveValue, params }) => {
  const content = resolveValue(useContent)
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)

  if (!content) {
    return {
      title: `404 - ${t.errorPages['404'].title} | ${t.seo.siteName}`,
      meta: [
        { name: 'description', content: t.errorPages['404'].message },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  }

  const description = extractDescription(content.content)

  return {
    title: t.seo.articleTitleTemplate.replace('{title}', content.title),
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: content.title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: t.seo.siteName },
      { property: 'og:locale', content: content.lang },
      { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://uniteia.com/og-image.png' },
      { name: 'twitter:title', content: content.title },
      { name: 'twitter:description', content: description },
    ],
  }
}
