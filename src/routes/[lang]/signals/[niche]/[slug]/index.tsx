import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { ArticleRenderer } from '~/components/article-renderer'
import { Breadcrumb } from '~/components/breadcrumb'
import { CTASection } from '~/components/cta-section'
import { JSONLD } from '~/components/json-ld'
import { LivingBrief2Col } from '~/components/living-brief'
import type { LivingBriefCollageProps } from '~/components/living-brief/types'
import { MangaGrid } from '~/components/manga-grid'
import { NewsletterForm } from '~/components/newsletter-form'
import { ShareBar } from '~/components/share-bar'
import { StoryboardGrid } from '~/components/storyboard-grid'
import { TableOfContents } from '~/components/table-of-contents'
import { collagePackageToProps, parseCollagePackage } from '~/utils/collage-importer'
import { getMangaLayout, getStoryboardLayout } from '~/utils/storyboard-resolver'

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
import { estimateReadTime, extractDescription } from '~/utils/text-utils'

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
  try {
    // Read pre-generated collage JSON at build time using fs
    // Runs only during SSG (Node.js available), never on CF Workers edge
    const fs = await import('node:fs')
    const path = await import('node:path')
    const repoRoot = process.cwd()
    const jsonPath = path.join(
      repoRoot,
      `content/${params.niche}/${params.lang}/assets/collage/${slug}.json`
    )
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
  // Skip procedural canvas collage for articles that have real polaroid images
  const useCanvasCollage = content.value.slug !== 'opencode-vibecoders'
  const collage = useCanvasCollage && canvasData ? canvasToCollageProps(canvasData, { width: 800, height: 500 }) : null

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
    hideHeader: true,
    readTime: estimateReadTime(content.value.content),
    ...(collage ? ({ collage } as const) : {}),
  }

  // Check for MangaGrid layout (12-panel sequential narrative)
  const mangaPanels = content.value.slug
    ? getMangaLayout(content.value.slug, content.value.lang)
    : null

  // Check for StoryboardGrid layout
  const storyboardLayout = content.value.slug
    ? getStoryboardLayout(content.value.slug, content.value.lang, t)
    : null

  const readTime = estimateReadTime(content.value.content)

  return (
    <>
      {mangaPanels ? (
        <>
          <JSONLD data={webPageSchema} />
          <MangaGrid panels={mangaPanels} />
          <div class="max-w-6xl mx-auto px-4 mt-8">
            <CTASection
              slug={content.value.slug ?? ''}
              lang={content.value.lang}
              url={canonicalUrl(loc.url.origin, loc.url.pathname)}
              githubUrl="https://github.com/ankinow/uniteia-v2"
            />
          </div>
          <div class="max-w-6xl mx-auto px-4 mt-6 pb-12 space-y-6">
            <ShareBar url={pageUrl} title={content.value.title} />
            <NewsletterForm class="max-w-sm" />
          </div>
        </>
      ) : storyboardLayout ? (
        <>
          <div class="px-4 pt-6 pb-2 w-full max-w-6xl mx-auto">
            <Breadcrumb />
            <h1 class="text-2xl md:text-3xl font-bold font-display tracking-tight text-bone mt-6 mb-2">
              {storyboardLayout.metaTitle || content.value.title}
            </h1>
            <span class="text-sm text-bone-muted">{readTime}</span>
          </div>
          <JSONLD data={webPageSchema} />
          <StoryboardGrid layout={storyboardLayout} />
          <div class="max-w-6xl mx-auto px-4 mt-8">
            <CTASection
              slug={content.value.slug ?? ''}
              lang={content.value.lang}
              url={canonicalUrl(loc.url.origin, loc.url.pathname)}
              githubUrl="https://github.com/ankinow/uniteia-v2"
            />
          </div>
          <div class="max-w-6xl mx-auto px-4 mt-6 pb-12 space-y-6">
            <ShareBar url={pageUrl} title={content.value.title} />
            <NewsletterForm class="max-w-sm" />
          </div>
        </>
      ) : (
        <LivingBrief2Col
          hero={{
            title: content.value.title,
            subtitle: `${extractDescription(content.value.content)} · ${readTime}`,
            hashtags: content.value.subjects,
            variant:
              content.value.slug === 'opencode-vibecoders' ? 'terminal' : 'default',
            heroImage:
              content.value.slug === 'opencode-vibecoders'
                ? '/assets/flux/jrpg-opencode/hero-bg.webp'
                : undefined,
            buttons: [],
          }}
          {...(collageAssets.value
            ? { collage: collageAssets.value }
            : content.value.slug === 'opencode-vibecoders'
              ? {
                  collage: {
                    polaroids: [
                      // ── Row 1 (y: 5-30) ──
                      {
                        id: 'terminal', src: '/assets/flux/jrpg-opencode/terminal-cli.webp',
                        label: 'The Terminal', rotate: -2, width: 155, offsetX: 5, offsetY: 5,
                      },
                      {
                        id: 'code-gen', src: '/assets/flux/jrpg-opencode/code-generation.webp',
                        label: 'Code Gen', rotate: 3, width: 150, offsetX: 140, offsetY: 18,
                      },
                      {
                        id: 'preview', src: '/assets/flux/jrpg-opencode/live-preview.webp',
                        label: 'Live Output', rotate: -1, width: 150, offsetX: 275, offsetY: 8,
                      },
                      {
                        id: 'deploy', src: '/assets/flux/jrpg-opencode/auto-deploy.webp',
                        label: 'Auto Deploy', rotate: 2, width: 155, offsetX: 410, offsetY: 22,
                      },
                      {
                        id: 'workflow', src: '/assets/flux/jrpg-opencode/agent-workflow.webp',
                        label: 'Agent Flow', rotate: -3, width: 160, offsetX: 545, offsetY: 10,
                      },
                      {
                        id: 'versions', src: '/assets/flux/jrpg-opencode/version-control.webp',
                        label: 'Version Ctrl', rotate: 1, width: 150, offsetX: 680, offsetY: 25,
                      },
                      // ── Row 2 (y: 175-210) ──
                      {
                        id: 'mindset', src: '/assets/flux/jrpg-opencode/vibecoding-mindset.webp',
                        label: 'Vibe Mindset', rotate: -2, width: 155, offsetX: 20, offsetY: 180,
                      },
                      {
                        id: 'stories', src: '/assets/flux/jrpg-opencode/real-stories.webp',
                        label: 'Real Stories', rotate: 4, width: 150, offsetX: 150, offsetY: 195,
                      },
                      {
                        id: 'started', src: '/assets/flux/jrpg-opencode/getting-started.webp',
                        label: 'Get Started', rotate: -1, width: 155, offsetX: 285, offsetY: 178,
                      },
                      {
                        id: 'how-works', src: '/assets/flux/jrpg-opencode/how-it-works.webp',
                        label: 'How It Works', rotate: 2, width: 160, offsetX: 420, offsetY: 205,
                      },
                      {
                        id: 'can-build', src: '/assets/flux/jrpg-opencode/what-can-build.webp',
                        label: 'What U Can Build', rotate: -4, width: 155, offsetX: 555, offsetY: 185,
                      },
                      {
                        id: 'why-vibes', src: '/assets/flux/jrpg-opencode/why-vibecoders.webp',
                        label: 'Why Vibecoders', rotate: 1, width: 155, offsetX: 690, offsetY: 200,
                      },
                    ],
                    emoticons: ['💻', '🚀', '✨', '🤖', '⚡', '🔧', '🎮', '🦊', '⭐', '💎', '🧠', '📜'],
                    tapeVariants: ['yellow', 'white', 'washi', 'clear', 'yellow', 'white', 'washi', 'clear', 'yellow', 'white', 'washi', 'clear'] as any,
                    showFlora: false,
                  },
                }
              : {})}
        >
          <div q:slot="breadcrumb">
            <Breadcrumb />
          </div>
          <div q:slot="toc">
            <TableOfContents />
          </div>
          <JSONLD data={webPageSchema} />
          <ArticleRenderer {...rendererProps} />
          <div class="mt-8">
            <CTASection
              slug={content.value.slug ?? ''}
              lang={content.value.lang}
              url={canonicalUrl(loc.url.origin, loc.url.pathname)}
              githubUrl="https://github.com/ankinow/uniteia-v2"
            />
          </div>
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
    } as any
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
      {
        property: 'og:image',
        content: [
          'magica-overview',
          'magica-quickstart',
          'magica-mcp-server',
          'tencent-cloud-deal-stack-builders',
          'opencode-vibecoders',
        ].includes(slug)
          ? 'https://uniteia.com/assets/kawaii-vibecoder/hero-postit-collage.webp'
          : 'https://uniteia.com/og-image.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: [
          'magica-overview',
          'magica-quickstart',
          'magica-mcp-server',
          'tencent-cloud-deal-stack-builders',
          'opencode-vibecoders',
        ].includes(slug)
          ? 'https://uniteia.com/assets/kawaii-vibecoder/hero-postit-collage.webp'
          : 'https://uniteia.com/og-image.png',
      },
      { name: 'twitter:title', content: content.title },
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`) },
      ...alternateLinks,
    ],
    scripts: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.title,
          description: description,
          image: 'https://uniteia.com/og-image.png',
          datePublished: content.metadata?.created_at ?? new Date().toISOString().split('T')[0],
          author: { '@type': 'Organization', name: 'UniTeia' },
          publisher: {
            '@type': 'Organization',
            name: 'UniTeia',
            logo: { '@type': 'ImageObject', url: 'https://uniteia.com/logo.png' },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`),
          },
          inLanguage: content.lang,
        }),
      },
    ],
  } as any
}
