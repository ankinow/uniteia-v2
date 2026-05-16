import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city'
import { AdaptiveHeader } from '~/components/adaptive-header'
import { ArticleFrame } from '~/components/article-frame'
import { NotFound } from '~/components/error-pages/not-found'
import { FrontmatterSlots } from '~/components/frontmatter-slots'
import { JSONLD } from '~/components/json-ld'
import { RelatedArticles } from '~/components/related-articles'
import { SignalGrid } from '~/components/signal-grid'
import { SourceLedger } from '~/components/source-ledger'
import type { ContentNode } from '~/content-graph/contracts/node'
import { getTranslation, useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'
import { parseHost } from '~/utils/host-parser'
import { generateArticleSchema } from '~/utils/schema-generators'

/**
 * Supported language codes for quick lookup
 */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onStaticGenerate = async () => {
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const { isPublicNode } = await import('~/content-graph')
  const allNodes = contentGraphProvider.getNodes()
  const params = allNodes
    .filter(n => n.slug !== '_index' && isPublicNode(n))
    .map(node => ({
      lang: node.locale,
      slug: node.slug,
    }))
  return { params }
}

/**
 * Thin routeLoader$ wrapper that validates lang, calls loadContent(),
 * and catches ContentLoaderError → error(404).
 *
 * All server-only logic (fs, gray-matter, ajv) lives in loadContent()
 * which uses dynamic imports per D001 to stay tree-shaken from client.
 */
export const useContent = routeLoader$<LlmWikiContent | null>(async ({ params, error, url }) => {
  const lang = params.lang
  const slugRaw = params.slug

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  if (!slugRaw) {
    throw error(404, 'No slug provided')
  }

  const { niche } = parseHost(url.host)
  const slug = slugRaw.replaceAll('/', '-')

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

  const related = contentGraphProvider.getRelated(current.id).filter(isPublicNode).slice(0, 4)

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
  const { t } = useI18n()
  const location = useLocation()
  const { niche } = parseHost(location.url.host)
  const relatedNodes = useRelated()

  if (!content.value) {
    return <NotFound />
  }

  const articleSchema = generateArticleSchema({
    headline: content.value.title,
    description: content.value.subjects.join(', '),
    author: content.value.metadata?.author || 'UniTeia System',
    datePublished: content.value.metadata?.created_at || new Date().toISOString(),
    dateModified: content.value.metadata?.updated_at || undefined,
    url: content.value.slug,
    niche,
    lang: content.value.lang,
  })

  return (
    <ArticleFrame>
      <JSONLD data={articleSchema} />
      <AdaptiveHeader title={content.value.title} subtitle={content.value.subjects.join(', ')} />
      {/* Editorial signals grid */}
      <div class="mt-3">
        <SignalGrid
          qualityScore={content.value.quality_score ?? 85}
          verdict={content.value.verdict ?? 'trusted'}
          lang={content.value.lang}
        />
      </div>
      <FrontmatterSlots
        subjects={content.value.subjects}
        lang={content.value.lang}
        metadata={content.value.metadata}
        labels={{
          subjectsLabel: t.article.subjectsLabel,
          published: t.article.published,
          updated: t.article.updated,
          byAuthor: t.article.byAuthor,
          version: t.article.version,
          readInLang: t.article.readInLang,
        }}
      />
      <div
        class="prose prose-invert mt-8 max-w-none text-bone-primary prose-a:text-action hover:prose-a:text-action-hi transition-colors"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: content is pre-validated markdown
        dangerouslySetInnerHTML={content.value.content}
      />
      <SourceLedger
        referralLinks={content.value.referral_links}
        sourcesLabel={t.article.sourcesLabel}
      />
      <div class="mt-12">
        <RelatedArticles
          nodes={relatedNodes.value}
          lang={content.value.lang as SupportedLanguage}
        />
      </div>
    </ArticleFrame>
  )
})

function extractExcerpt(html: string, maxLength = 155): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLength) return text
  if (text[maxLength] === ' ') return `${text.slice(0, maxLength)}…`
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

export const head: DocumentHead = ({ resolveValue, url, params }) => {
  const content = resolveValue(useContent)
  const t = getTranslation(params.lang as SupportedLanguage)

  if (!content) {
    return {
      title: `404 - ${t.errorPages['404'].title} | ${t.seo.siteName}`,
      meta: [
        { name: 'description', content: t.errorPages['404'].message },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  }

  const canonicalUrl = new URL(url.href)
  canonicalUrl.search = '' // Strip query params for canonical
  if (canonicalUrl.pathname !== '/' && canonicalUrl.pathname.endsWith('/')) {
    canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/$/, '')
  }

  const alternateLinks: Array<{ rel: string; hreflang: string; href: string }> = (
    content.translations || []
  ).map(tLang => ({
    rel: 'alternate',
    hreflang: tLang,
    href: new URL(`/${tLang}/${content.slug}`, url.origin).href,
  }))

  // Add x-default hreflang pointing to English version if available
  // If not, point to the first available translation
  const fallbackLang = content.translations?.includes('en') ? 'en' : content.translations?.[0]
  if (fallbackLang) {
    alternateLinks.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: new URL(`/${fallbackLang}/${content.slug}`, url.origin).href,
    })
  }

  const excerpt = extractExcerpt(content.content)

  return {
    title: t.seo.articleTitleTemplate.replace('{title}', content.title),
    meta: [
      { name: 'description', content: excerpt || content.subjects.join(', ') },
      {
        name: 'robots',
        content:
          content.verdict === 'caution' || (content.quality_score ?? 0) < 95
            ? 'noindex, nofollow'
            : 'index, follow',
      },
      // Open Graph
      { property: 'og:title', content: content.title },
      { property: 'og:description', content: excerpt || content.subjects.join(', ') },
      { property: 'og:url', content: canonicalUrl.href },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: t.seo.siteName },
      { property: 'og:locale', content: content.lang },
      { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
      // Twitter
      { name: 'twitter:image', content: 'https://uniteia.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: content.title },
      { name: 'twitter:description', content: excerpt || content.subjects.join(', ') },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl.href }, ...alternateLinks],
  }
}
