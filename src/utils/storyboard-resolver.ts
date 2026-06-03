/**
 * storyboard-resolver.ts
 * Resolves article content into StoryboardGrid layouts.
 * Textless whiteboard FLUX images — same image serves all 8 languages.
 * 
 * PLANO-083: 4 articles mapped, each with 4 whiteboard cells.
 */

import type { ResolvedCell, ResolvedLayout } from '~/components/storyboard-grid/types'
import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'

const WHITEBOARD = '/assets/whiteboard/articles'

type ArticleMeta = {
  slug: string
  title: string
  body: string
  evidenceTitle: string
  listItems: string[]
  ctaTitle: string
  ctaBody: string
  ctaLabel: string
  ctaHref: string
  alt: string
}

const ARTICLE_METAS: Record<string, ArticleMeta> = {
  'magica-overview': {
    slug: 'magica-overview',
    title: 'Magica: The AI Command Center',
    body: 'Magica unifies prompt engineering, model routing, and evaluation in a single interface.',
    evidenceTitle: 'Workflow Visualization',
    listItems: [
      'Node-based prompt chaining',
      'Multi-model fallback routing',
      'Real-time latency telemetry',
    ],
    ctaTitle: 'Start Building',
    ctaBody: 'Try Magica free — no credit card required.',
    ctaLabel: 'Visit Magica',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Magica AI Command Center workflow diagram',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'Getting Started with Magica',
    body: 'Set up your Magica account, generate an API key, and make your first AI model call in minutes.',
    evidenceTitle: 'Setup Flow',
    listItems: [
      'Create account and verify email',
      'Generate API key from dashboard',
      'Choose your AI model provider',
      'Make your first API call',
    ],
    ctaTitle: 'Start Now',
    ctaBody: 'Free tier available — no credit card required.',
    ctaLabel: 'Get Started',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Magica quickstart setup flow diagram',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'Building MCP Servers with Magica',
    body: 'Create Model Context Protocol servers that let AI agents discover and interact with external tools and data sources.',
    evidenceTitle: 'MCP Architecture',
    listItems: [
      'MCP transport layer (stdio/SSE)',
      'Tool definition and registration',
      'Agent integration and discovery',
      'Security and sandboxing',
    ],
    ctaTitle: 'Build with MCP',
    ctaBody: 'Start building MCP servers with Magica today.',
    ctaLabel: 'MCP Docs',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCP server architecture diagram',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Tencent Cloud Deal Stack for Builders',
    body: 'Deploy your applications on Tencent Cloud with Lighthouse, CVM, and EdgeOne at competitive prices.',
    evidenceTitle: 'Cloud Stack Overview',
    listItems: [
      'Lighthouse: Simple VPS hosting',
      'CVM: Full cloud compute power',
      'EdgeOne: Global CDN acceleration',
      'Cost-effective for indie builders',
    ],
    ctaTitle: 'Deploy Now',
    ctaBody: 'Check current Tencent Cloud promotions and deals.',
    ctaLabel: 'View Deals',
    ctaHref: 'https://tencentcloud.com',
    alt: 'Tencent Cloud architecture diagram',
  },
}

function buildCells(meta: ArticleMeta): ResolvedCell[] {
  return [
    {
      id: 'insight',
      variant: 'insight',
      gridArea: 'insight1',
      title: meta.title,
      body: meta.body,
      arrowTo: ['evidence'],
    },
    {
      id: 'evidence',
      variant: 'evidence',
      gridArea: 'evidence1',
      title: meta.evidenceTitle,
      image: {
        src: `${WHITEBOARD}/${meta.slug}/hero-insight.webp`,
        alt: meta.alt,
      },
      arrowTo: ['diagram'],
    },
    {
      id: 'diagram',
      variant: 'diagram',
      gridArea: 'diagram1',
      title: 'Architecture',
      list: meta.listItems,
      arrowTo: ['cta'],
    },
    {
      id: 'cta',
      variant: 'cta',
      gridArea: 'cta1',
      title: meta.ctaTitle,
      body: meta.ctaBody,
      cta: {
        label: meta.ctaLabel,
        href: meta.ctaHref,
        variant: 'primary',
      },
    },
  ]
}

export function getStoryboardLayout(
  slug: string,
  _lang: SupportedLanguage,
  _t: TranslationStrings
): ResolvedLayout | null {
  const meta = ARTICLE_METAS[slug]
  if (!meta) return null

  return {
    version: '2.0',
    gridTemplate: '"insight1 evidence1 evidence1" "diagram1 diagram1 cta1"',
    gridColumns: '1fr 1fr 1fr',
    gridRows: 'auto auto',
    cells: buildCells(meta),
  }
}

export function hasStoryboardLayout(slug: string): boolean {
  return slug in ARTICLE_METAS
}
