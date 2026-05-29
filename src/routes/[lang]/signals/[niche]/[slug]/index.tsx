import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { ArticleRenderer } from '~/components/article-renderer'
import { JSONLD } from '~/components/json-ld'
import { LivingBrief2Col } from '~/components/living-brief'
import type { LivingBriefCollageProps } from '~/components/living-brief/types'
import { StoryboardGrid } from '~/components/storyboard-grid'
import { collagePackageToProps, parseCollagePackage } from '~/utils/collage-importer'
import { getStoryboardLayout } from '~/utils/storyboard-resolver'

import type { ContentLocale, ContentNode } from '~/content-graph/contracts/node'
import { getTranslation, useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { canonicalUrl, xdefaultUrl } from '~/routing/routes'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { canvasToCollageProps } from '~/utils/canvas-to-collage'
import { loadContent } from '~/utils/content-loader'
import { generateWebPageSchema } from '~/utils/schema-generators'
import { extractDescription } from '~/utils/text-utils'

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
    .getRelated(current.id, locale)
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

export const useCollageAssets = routeLoader$<LivingBriefCollageProps | null>(async ({ params }) => {
  const slug = params.slug
  if (!slug) return null
  // Load collage for any article that has pre-generated assets
  const COLLAGE_SLUGS = new Set([
    'magica-overview',
    'magica-quickstart',
    'magica-mcp-server',
    'tencent-cloud-deal-stack-builders',
  ])
  if (!COLLAGE_SLUGS.has(slug)) return null
  try {
    // Read pre-generated collage JSON at build time using fs
    // Runs only during SSG (Node.js available), never on CF Workers edge
    const fs = await import('node:fs')
    const path = await import('node:path')
    const repoRoot = process.cwd()
    const jsonPath = path.join(repoRoot, `content/apex/${params.lang}/assets/collage/${slug}.json`)
    if (!fs.existsSync(jsonPath)) return null
    const raw = fs.readFileSync(jsonPath, 'utf-8')
    const pkg = parseCollagePackage(raw)
    return pkg ? collagePackageToProps(pkg) : null
  } catch {
    return null
  }
})

export default component$(() => {
  const content = useArticle()
  const relatedNodes = useRelated()
  const collageAssets = useCollageAssets()
  const { t } = useI18n()
  const loc = useLocation()

  if (!content.value) {
    return <div class="text-bone-muted p-8 text-center">Content not found</div>
  }

  const canvasData = content.value.canvas
  const collage = canvasData ? canvasToCollageProps(canvasData, { width: 800, height: 500 }) : null

  // JSON-LD WebPage for the current article page (per-locale structured data)
  const pageUrl = canonicalUrl(loc.url.origin, loc.url.pathname + loc.url.search)
  const description = extractDescription(content.value.content)
  const webPageSchema = generateWebPageSchema({
    name: content.value.title,
    url: pageUrl,
    description,
    lang: content.value.lang,
  })

  const rendererProps = {
    content: content.value,
    relatedNodes: relatedNodes.value,
    labels: {
      subjectsLabel: t.article.subjectsLabel,
      byAuthor: t.article.byAuthor,
      version: t.article.version,
      readInLang: t.article.readInLang,
    },
    ...(collage ? ({ collage } as const) : {}),
  }

  // Check for StoryboardGrid layout
  const storyboardLayout = content.value.slug
    ? getStoryboardLayout(content.value.slug, content.value.lang, t)
    : null

  return (
    <>
      {storyboardLayout ? (
        <StoryboardGrid layout={storyboardLayout} />
      ) : (
        <LivingBrief2Col
          hero={{
            title: content.value.title,
            subtitle: extractDescription(content.value.content),
            hashtags: content.value.subjects,
            variant: content.value.slug === 'magica-overview' ? 'magica' : 'default',
            buttons: [
              {
                label: content.value.lang === 'pt' ? 'VISITAR MAGICA' : 'VISIT MAGICA',
                variant: 'primary',
                href: 'https://try.magica.com/clique-serio',
              },
              {
                label:
                  content.value.lang === 'pt' ? 'CÓDIGO PROMO: GXZMYCP' : 'PROMO CODE: GXZMYCP',
                variant: 'secondary',
                href: 'https://try.magica.com/redeem',
              },
              {
                label: content.value.lang === 'pt' ? 'SAIBA MAIS' : 'LEARN MORE',
                variant: 'ghost',
                href: '/signals/apex/magica-quickstart',
              },
            ],
          }}
          {...(collageAssets.value ? { collage: collageAssets.value } : {})}
        >
          <JSONLD data={webPageSchema} />
          <ArticleRenderer {...rendererProps} />
        </LivingBrief2Col>
      )}
    </>
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

  const description = extractDescription(content.content)

  return {
    title: t.seo.articleTitleTemplate.replace('{title}', content.title),
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: content.title },
      { property: 'og:description', content: description },
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
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`) },
      ...alternateLinks,
    ],
  }
}
