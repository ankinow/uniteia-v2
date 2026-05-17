import { component$ } from '@builder.io/qwik'
import { type DocumentHead, type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { AdaptiveHeader } from '~/components/adaptive-header'
import { ArticleFrame } from '~/components/article-frame'
import { FrontmatterSlots } from '~/components/frontmatter-slots'
import { JSONLD } from '~/components/json-ld'
import { RelatedArticles } from '~/components/related-articles'

import type { ContentLocale, ContentNode } from '~/content-graph/contracts/node'
import { getTranslation, useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { canonicalUrl, xdefaultUrl } from '~/routing/routes'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'
import { generateArticleSchema } from '~/utils/schema-generators'

const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onStaticGenerate = async () => {
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const nodes = contentGraphProvider.getNodes()
  const { contentGraphData } = await import('~/content-graph.generated')
  const publicGroupIds = new Set(
    contentGraphData.groups?.publicGroups.flatMap(g => g.nodes.map(n => n.id)) ?? []
  )
  return {
    params: nodes
      .filter(n => n.slug !== '_index' && publicGroupIds.has(n.id))
      .map(node => ({
        lang: node.locale,
        niche: node.niche[0] ?? 'apex',
        slug: node.slug,
      })),
  }
}

export const onRequest: RequestHandler = async event => {
  const lang = event.params.lang ?? ''
  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw event.error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }
}

export const useArticle = routeLoader$<LlmWikiContent | null>(async ({ params, error }) => {
  const lang = params.lang
  const niche = params.niche
  const slug = params.slug

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }
  if (!niche || !slug) {
    throw error(404, 'Missing niche or slug')
  }

  const { contentGraphProvider } = await import('~/content-graph.generated')
  const node = contentGraphProvider.getNode(slug, lang as ContentLocale)
  if (!node || !contentGraphProvider.isPublic(node)) {
    throw error(404, `Content not found or not published: ${niche}/${slug} (${lang})`)
  }

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
      throw error(404, `Content not found: ${niche}/${slug} (${lang})`)
    }
    throw err
  }
})

export const useRelated = routeLoader$<ContentNode[]>(async ({ params }) => {
  const lang = params.lang
  const slug = params.slug
  if (!lang || !slug) return []

  const { contentGraphProvider, contentGraphData } = await import('~/content-graph.generated')
  const publicGroupIds = new Set(
    contentGraphData.groups?.publicGroups.flatMap(g => g.nodes.map(n => n.id)) ?? []
  )

  const locale = lang as ContentLocale
  const current = contentGraphProvider.getNodes({ locale }).find(n => n.slug === slug)

  if (!current) {
    return contentGraphProvider
      .getNodes({ locale, visibility: 'public' })
      .filter(n => n.slug !== slug && publicGroupIds.has(n.id))
      .slice(0, 4)
  }

  const related = contentGraphProvider
    .getRelated(current.id)
    .filter(n => publicGroupIds.has(n.id))
    .slice(0, 4)
  if (related.length > 0) return related

  return contentGraphProvider
    .getNodes({ locale, visibility: 'public' })
    .filter(
      n =>
        n.niche.some(nn => current.niche.includes(nn)) &&
        n.id !== current.id &&
        publicGroupIds.has(n.id)
    )
    .slice(0, 4)
})

export default component$(() => {
  const content = useArticle()
  const relatedNodes = useRelated()
  const { t } = useI18n()

  if (!content.value) {
    return <div class="text-bone-muted p-8 text-center">Content not found</div>
  }

  const articleSchema = generateArticleSchema({
    headline: content.value.title,
    description: content.value.subjects.join(', '),
    author: content.value.metadata?.author || 'UniTeia System',
    url: content.value.slug,
    niche: content.value.slug,
    lang: content.value.lang,
  })

  return (
    <ArticleFrame>
      <JSONLD data={articleSchema} />
      <AdaptiveHeader title={content.value.title} subtitle={content.value.subjects.join(', ')} />
      <FrontmatterSlots
        subjects={content.value.subjects}
        lang={content.value.lang}
        metadata={content.value.metadata}
        labels={{
          subjectsLabel: t.article.subjectsLabel,
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

      <div class="mt-12">
        <RelatedArticles
          nodes={relatedNodes.value}
          lang={content.value.lang as SupportedLanguage}
        />
      </div>
    </ArticleFrame>
  )
})

export const head: DocumentHead = ({ resolveValue, params, url }) => {
  const content = resolveValue(useArticle)
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

  const niche = params.niche ?? ''
  const slug = params.slug ?? ''

  const alternateLinks: Array<{ rel: string; hreflang: string; href: string }> =
    SUPPORTED_LANGUAGES.map(l => ({
      rel: 'alternate' as const,
      hreflang: l.code,
      href: canonicalUrl(url.origin, `/${l.code}/signals/${niche}/${slug}`),
    }))

  alternateLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: xdefaultUrl(url.origin, niche, slug),
  })

  return {
    title: t.seo.articleTitleTemplate.replace('{title}', content.title),
    meta: [
      { name: 'description', content: content.subjects.join(', ') },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: content.title },
      { property: 'og:description', content: content.subjects.join(', ') },
      {
        property: 'og:url',
        content: canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`),
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: t.seo.siteName },
      { property: 'og:locale', content: content.lang },
      { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://uniteia.com/og-image.png' },
      { name: 'twitter:title', content: content.title },
      { name: 'twitter:description', content: content.subjects.join(', ') },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`) },
      ...alternateLinks,
    ],
  }
}
