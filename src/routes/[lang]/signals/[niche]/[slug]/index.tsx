import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { ArticleRenderer } from '~/components/article-renderer'
import { Breadcrumb } from '~/components/breadcrumb'
import { CanvaComposition } from '~/components/canva/CanvaComposition'
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
import { findNicheBySlug, loadNichesConfig } from '~/utils/niche-loader'
import { getMangaLayout, getStoryboardLayout } from '~/utils/storyboard-resolver'

import type { ContentLocale, ContentNode } from '~/content-graph/contracts/node'
import { toBcp47 } from '~/i18n/bcp47'
import { getTranslation, useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { canonicalUrl, xdefaultUrl } from '~/routing/routes'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { getBuildLocale } from '~/utils/build-locale'
import { canvasToCollageProps } from '~/utils/canvas-to-collage'
import { loadContent } from '~/utils/content-loader'
import { generateWebPageSchema } from '~/utils/schema-generators'
import { estimateReadTime, extractDescription } from '~/utils/text-utils'

const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

/** Slugs with real FLUX-generated images — use Cloudflare Images CDN URLs */
const HAS_REAL_IMAGES = new Set([
  'magica-overview',
  'magica-quickstart',
  'magica-mcp-server',
  'tencent-cloud-deal-stack-builders',
  'opencode-vibecoders',
  'multi-agent-vibecoding',
])

export const onStaticGenerate = async () => {
  const buildLocale = getBuildLocale()
  const { contentGraphProvider } = await import('~/content-graph.generated')
  const nodes = contentGraphProvider.getNodes()
  const { contentGraphData } = await import('~/content-graph.generated')
  const publicGroupIds = new Set(
    contentGraphData.groups?.publicGroups.flatMap(g => g.nodes.map(n => n.id)) ?? []
  )
  return {
    params: nodes
      .filter(n => n.slug !== '_index' && publicGroupIds.has(n.id) && n.locale === buildLocale)
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
    const content = await loadContent(niche, slug, lang as SupportedLanguage)
    // Attach curated summary from content graph for SEO (unique per article)
    content.summary = node.summary
    return content
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

export const useNicheSegmentLabel = routeLoader$<Record<string, string>>(async ({ params }) => {
  const lang = params.lang as SupportedLanguage
  const nicheSlug = params.niche ?? ''
  try {
    const niches = await loadNichesConfig()
    const niche = findNicheBySlug(niches, nicheSlug, lang)
    if (niche) {
      return { [niche.slug]: niche.title[lang] }
    }
  } catch {
    // niche config not available (e.g., during SSG) — fall through
  }
  return {}
})

export const useCanvaComposition = routeLoader$<{ refs: string[]; sceneType: string } | null>(
  async () => {
    // PLANO-04 v0.6: Stub — returns null until canva pipeline is wired
    return null
  }
)

export default component$(() => {
  const content = useArticle()
  const relatedNodes = useRelated()
  const collageAssets = useCollageAssets()
  const nicheSegmentLabel = useNicheSegmentLabel()
  const { t } = useI18n()
  const loc = useLocation()

  if (!content.value) {
    return <div class="text-bone-muted p-8 text-center">Content not found</div>
  }

  const canvasData = content.value.canvas
  const useCanvasCollage = !HAS_REAL_IMAGES.has(content.value.slug ?? '')
  const collage =
    useCanvasCollage && canvasData
      ? canvasToCollageProps(canvasData, { width: 800, height: 500 })
      : null

  // Canva composition (PLANO-04 v0.6 wire): SSR-resolved at build time
  // via routeLoader$. Renders ABOVE StoryboardGrid so users see the canva
  // visual first, then the storyboard.
  const canvaComposition = useCanvaComposition()

  // JSON-LD WebPage for the current article page (per-locale structured data)
  const pageUrl = canonicalUrl(loc.url.origin, loc.url.pathname + loc.url.search)
  const description = content.value.summary || extractDescription(content.value.content)
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
      {canvaComposition.value ? (
        <div class="w-full bg-void py-4">
          <CanvaComposition
            refs={canvaComposition.value.refs}
            lang={content.value.lang}
            sceneType={canvaComposition.value.sceneType}
          />
        </div>
      ) : null}
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
            <Breadcrumb segmentLabels={nicheSegmentLabel.value} />
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
            subtitle: `${content.value.summary || extractDescription(content.value.content)} · ${readTime}`,
            hashtags: content.value.subjects,
            variant:
              (canvasData?.variant as any) ||
              (content.value.slug === 'opencode-vibecoders' ? 'terminal' : 'default'),
            heroImage:
              content.value.slug === 'opencode-vibecoders'
                ? 'https://uniteia.com/cdn-cgi/image/w=1920,h=1080,fit=cover,format=auto,q=90/assets/flux/jrpg-opencode/hero-bg.webp'
                : content.value.slug === 'multi-agent-vibecoding'
                  ? 'https://uniteia.com/cdn-cgi/image/w=1920,h=1080,fit=cover,format=auto,q=90/assets/flux/jrpg-opencode/agent-workflow.webp'
                  : HAS_REAL_IMAGES.has(content.value.slug ?? '')
                    ? `https://uniteia.com/cdn-cgi/image/w=1920,h=1080,fit=cover,format=auto,q=90/assets/flux/jrpg-magica/hero-insight.webp`
                    : undefined,
            buttons: [],
          }}
          {...(collageAssets.value
            ? { collage: { ...collageAssets.value, variant: canvasData?.variant as any } }
            : content.value.slug === 'opencode-vibecoders'
              ? {
                  collage: {
                    variant: (canvasData?.variant as any) || 'cyber',
                    polaroids: [
                      // ── Row 1 (y: 5-30) ──
                      {
                        id: 'terminal',
                        src: '/assets/flux/jrpg-opencode/terminal-cli.webp',
                        label: 'The Terminal',
                        rotate: -2,
                        width: 155,
                        offsetX: 5,
                        offsetY: 5,
                      },
                      {
                        id: 'code-gen',
                        src: '/assets/flux/jrpg-opencode/code-generation.webp',
                        label: 'Code Gen',
                        rotate: 3,
                        width: 150,
                        offsetX: 140,
                        offsetY: 18,
                      },
                      {
                        id: 'preview',
                        src: '/assets/flux/jrpg-opencode/live-preview.webp',
                        label: 'Live Output',
                        rotate: -1,
                        width: 150,
                        offsetX: 275,
                        offsetY: 8,
                      },
                      {
                        id: 'deploy',
                        src: '/assets/flux/jrpg-opencode/auto-deploy.webp',
                        label: 'Auto Deploy',
                        rotate: 2,
                        width: 155,
                        offsetX: 410,
                        offsetY: 22,
                      },
                      {
                        id: 'workflow',
                        src: '/assets/flux/jrpg-opencode/agent-workflow.webp',
                        label: 'Agent Flow',
                        rotate: -3,
                        width: 160,
                        offsetX: 545,
                        offsetY: 10,
                      },
                      {
                        id: 'versions',
                        src: '/assets/flux/jrpg-opencode/version-control.webp',
                        label: 'Version Ctrl',
                        rotate: 1,
                        width: 150,
                        offsetX: 680,
                        offsetY: 25,
                      },
                      // ── Row 2 (y: 175-210) ──
                      {
                        id: 'mindset',
                        src: '/assets/flux/jrpg-opencode/vibecoding-mindset.webp',
                        label: 'Vibe Mindset',
                        rotate: -2,
                        width: 155,
                        offsetX: 20,
                        offsetY: 180,
                      },
                      {
                        id: 'stories',
                        src: '/assets/flux/jrpg-opencode/real-stories.webp',
                        label: 'Real Stories',
                        rotate: 4,
                        width: 150,
                        offsetX: 150,
                        offsetY: 195,
                      },
                      {
                        id: 'started',
                        src: '/assets/flux/jrpg-opencode/getting-started.webp',
                        label: 'Get Started',
                        rotate: -1,
                        width: 155,
                        offsetX: 285,
                        offsetY: 178,
                      },
                      {
                        id: 'how-works',
                        src: '/assets/flux/jrpg-opencode/how-it-works.webp',
                        label: 'How It Works',
                        rotate: 2,
                        width: 160,
                        offsetX: 420,
                        offsetY: 205,
                      },
                      {
                        id: 'can-build',
                        src: '/assets/flux/jrpg-opencode/what-can-build.webp',
                        label: 'What U Can Build',
                        rotate: -4,
                        width: 155,
                        offsetX: 555,
                        offsetY: 185,
                      },
                      {
                        id: 'why-vibes',
                        src: '/assets/flux/jrpg-opencode/why-vibecoders.webp',
                        label: 'Why Vibecoders',
                        rotate: 1,
                        width: 155,
                        offsetX: 690,
                        offsetY: 200,
                      },
                    ],
                    emoticons: [
                      '💻',
                      '🚀',
                      '✨',
                      '🤖',
                      '⚡',
                      '🔧',
                      '🎮',
                      '🦊',
                      '⭐',
                      '💎',
                      '🧠',
                      '📜',
                    ],
                    tapeVariants: [
                      'yellow',
                      'white',
                      'washi',
                      'clear',
                      'yellow',
                      'white',
                      'washi',
                      'clear',
                      'yellow',
                      'white',
                      'washi',
                      'clear',
                    ] as any,
                    showFlora: false,
                  },
                }
              : content.value.slug === 'multi-agent-vibecoding'
                ? {
                    collage: {
                      variant: 'cyber',
                      polaroids: [
                        {
                          id: 'agent1',
                          src: '/assets/flux/jrpg-opencode/agent-workflow.webp',
                          label: 'Agent Team',
                          rotate: -2,
                          width: 155,
                          offsetX: 5,
                          offsetY: 5,
                        },
                        {
                          id: 'agent2',
                          src: '/assets/flux/jrpg-opencode/terminal-cli.webp',
                          label: 'Orchestrator',
                          rotate: 3,
                          width: 150,
                          offsetX: 140,
                          offsetY: 18,
                        },
                        {
                          id: 'agent3',
                          src: '/assets/flux/jrpg-opencode/code-generation.webp',
                          label: 'Code Agent',
                          rotate: -1,
                          width: 150,
                          offsetX: 275,
                          offsetY: 8,
                        },
                        {
                          id: 'agent4',
                          src: '/assets/flux/jrpg-opencode/live-preview.webp',
                          label: 'Test Agent',
                          rotate: 2,
                          width: 155,
                          offsetX: 410,
                          offsetY: 22,
                        },
                        {
                          id: 'agent5',
                          src: '/assets/flux/jrpg-opencode/auto-deploy.webp',
                          label: 'Deploy Agent',
                          rotate: -3,
                          width: 160,
                          offsetX: 545,
                          offsetY: 10,
                        },
                        {
                          id: 'agent6',
                          src: '/assets/flux/jrpg-opencode/version-control.webp',
                          label: 'Review Agent',
                          rotate: 1,
                          width: 150,
                          offsetX: 680,
                          offsetY: 25,
                        },
                        {
                          id: 'multi1',
                          src: '/assets/flux/jrpg-opencode/vibecoding-mindset.webp',
                          label: 'Parallel Work',
                          rotate: -2,
                          width: 155,
                          offsetX: 20,
                          offsetY: 180,
                        },
                        {
                          id: 'multi2',
                          src: '/assets/flux/jrpg-opencode/real-stories.webp',
                          label: 'Real Results',
                          rotate: 4,
                          width: 150,
                          offsetX: 150,
                          offsetY: 195,
                        },
                        {
                          id: 'multi3',
                          src: '/assets/flux/jrpg-opencode/getting-started.webp',
                          label: 'Quick Start',
                          rotate: -1,
                          width: 155,
                          offsetX: 285,
                          offsetY: 178,
                        },
                        {
                          id: 'multi4',
                          src: '/assets/flux/jrpg-opencode/how-it-works.webp',
                          label: 'Architecture',
                          rotate: 2,
                          width: 160,
                          offsetX: 420,
                          offsetY: 205,
                        },
                        {
                          id: 'multi5',
                          src: '/assets/flux/jrpg-opencode/what-can-build.webp',
                          label: 'What Agents Do',
                          rotate: -4,
                          width: 155,
                          offsetX: 555,
                          offsetY: 185,
                        },
                        {
                          id: 'multi6',
                          src: '/assets/flux/jrpg-opencode/why-vibecoders.webp',
                          label: 'Why Multi',
                          rotate: 1,
                          width: 155,
                          offsetX: 690,
                          offsetY: 200,
                        },
                      ],
                      emoticons: [
                        '🤖',
                        '🤖',
                        '🤖',
                        '🔧',
                        '📋',
                        '✅',
                        '⚡',
                        '🚀',
                        '💡',
                        '🏗️',
                        '🎯',
                        '🔗',
                      ],
                      tapeVariants: [
                        'yellow',
                        'white',
                        'washi',
                        'clear',
                        'yellow',
                        'white',
                        'washi',
                        'clear',
                        'yellow',
                        'white',
                        'washi',
                        'clear',
                      ] as any,
                      showFlora: false,
                    },
                  }
                : {})}
        >
          <div q:slot="breadcrumb">
            <Breadcrumb segmentLabels={nicheSegmentLabel.value} />
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
  const nicheLabels = resolveValue(useNicheSegmentLabel)
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
      href: canonicalUrl(`https://${l.code}.uniteia.com`, `/${l.code}/signals/${niche}/${slug}`),
    }))

  alternateLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: xdefaultUrl('https://en.uniteia.com', niche, slug),
  })

  const description = content.summary || extractDescription(content.content)

  // JSON-LD BreadcrumbList for article pages
  const nicheLabel = niche ? nicheLabels?.[niche] || niche : niche
  const pageUrl = canonicalUrl(url.origin, `/${lang}/signals/${niche}/${slug}`)
  const breadcrumbItems = [
    {
      '@type': 'ListItem' as const,
      position: 1,
      name: t.seo.siteName,
      item: canonicalUrl(url.origin, `/${lang}`),
    },
    {
      '@type': 'ListItem' as const,
      position: 2,
      name: t.nav?.breadcrumb?.signals || 'Signals',
      item: canonicalUrl(url.origin, `/${lang}/signals`),
    },
    ...(niche
      ? [
          {
            '@type': 'ListItem' as const,
            position: 3,
            name: nicheLabel,
            item: canonicalUrl(url.origin, `/${lang}/signals/${niche}`),
          },
        ]
      : []),
    {
      '@type': 'ListItem' as const,
      position: niche ? 4 : 3,
      name: content.title,
      item: pageUrl,
    },
  ]

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
      { property: 'og:locale', content: toBcp47(content.lang) },
      {
        property: 'og:image',
        content: HAS_REAL_IMAGES.has(slug)
          ? `https://uniteia.com/cdn-cgi/image/w=1200,h=630,fit=cover,format=auto,q=90/assets/flux/jrpg-magica/${slug === 'magica-overview' ? 'hero-insight' : slug === 'magica-quickstart' ? 'hero-tutorial' : slug === 'magica-mcp-server' ? 'mcp-arch' : slug === 'tencent-cloud-deal-stack-builders' ? 'stack-builder' : slug === 'opencode-vibecoders' ? 'hero-bg' : 'agent-workflow'}.webp`
          : 'https://uniteia.com/og-image.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:image',
        content: HAS_REAL_IMAGES.has(slug)
          ? `https://uniteia.com/cdn-cgi/image/w=1200,h=600,fit=cover,format=auto,q=90/assets/flux/jrpg-magica/${slug === 'magica-overview' ? 'hero-insight' : slug === 'magica-quickstart' ? 'hero-tutorial' : slug === 'magica-mcp-server' ? 'mcp-arch' : slug === 'tencent-cloud-deal-stack-builders' ? 'stack-builder' : slug === 'opencode-vibecoders' ? 'hero-bg' : 'agent-workflow'}.webp`
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
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        }),
      },
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
          inLanguage: toBcp47(content.lang),
        }),
      },
    ],
  } as any
}
