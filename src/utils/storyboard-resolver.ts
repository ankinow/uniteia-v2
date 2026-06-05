/**
 * storyboard-resolver.ts
 * Resolves article content into StoryboardGrid layouts.
 * Textless whiteboard FLUX images + inline SOTA SVG diagrams — same assets serve all 8 languages.
 *
 * PLANO-083 + R28: 4 articles mapped, each with insight → evidence (FLUX) → diagram (SVG) → cta cells.
 * Diagrams teach advanced SOTA concepts (router fallback, MCP 4-layer, Tencent cost ladder).
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
  diagram: 'magica-arch' | 'quickstart-flow' | 'mcp-arch' | 'tencent-stack'
  /** Highlight metric for the insight cell (SOTA pedagogy: anchor the reader's attention) */
  metric: { value: string; label: string; delta?: string }
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
    body: 'A unified workspace for prompt engineering, model routing, and live evaluation — every request flows through a single router that picks the cheapest model that meets your latency budget, with automatic fallback when a provider degrades.',
    evidenceTitle: 'Workflow Visualization',
    listItems: [
      'Node-based prompt chaining with version control',
      'Multi-model fallback routing (GPT-4o → Claude → DeepSeek)',
      'Real-time latency & token telemetry per request',
      'Auto-retry with exponential backoff and circuit breaker',
    ],
    diagram: 'magica-arch',
    metric: {
      value: '40%',
      label: 'avg cost reduction vs single-provider',
      delta: '↓ from baseline',
    },
    ctaTitle: 'Start Building',
    ctaBody: 'Try Magica free — no credit card required.',
    ctaLabel: 'Visit Magica',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Magica AI Command Center workflow diagram',
  },
  'magica-quickstart': {
    slug: 'magica-quickstart',
    title: 'Getting Started with Magica',
    body: 'From zero to first API call in under 90 seconds. The quickstart path: create an account, generate a scoped API key, pick a model, fire your first request. Every step has a cURL and a Node.js example.',
    evidenceTitle: 'Setup Flow',
    listItems: [
      'Create account with email + OAuth (Google, GitHub)',
      'Generate API key with per-environment scope',
      'Choose model: GPT-4o, Claude 3.5, DeepSeek V3, Llama 3.1',
      'Make your first call — stream or batch',
    ],
    diagram: 'quickstart-flow',
    metric: { value: '~90s', label: 'account → first response', delta: 'p50 latency' },
    ctaTitle: 'Start Now',
    ctaBody: 'Free tier available — no credit card required.',
    ctaLabel: 'Get Started',
    ctaHref: 'https://try.magica.com/clique-serio',
    alt: 'Magica quickstart setup flow diagram',
  },
  'magica-mcp-server': {
    slug: 'magica-mcp-server',
    title: 'Building MCP Servers with Magica',
    body: 'MCP (Model Context Protocol) is the standard for connecting AI agents to external tools. Build a server in 30 lines: define tools as JSON schemas, choose stdio or SSE transport, register resources, and your agent can discover capabilities at runtime.',
    evidenceTitle: 'MCP Architecture',
    listItems: [
      'JSON-RPC 2.0 over stdio (local) or SSE/HTTP (remote)',
      'Capability discovery: tools, resources, prompts',
      'Capability-scoped sandboxing with bearer auth',
      'Hot-reload server during development',
    ],
    diagram: 'mcp-arch',
    metric: { value: '4', label: 'layer protocol: Host → Client → Transport → Server' },
    ctaTitle: 'Build with MCP',
    ctaBody: 'Start building MCP servers with Magica today.',
    ctaLabel: 'MCP Docs',
    ctaHref: 'https://modelcontextprotocol.io',
    alt: 'MCP server architecture diagram',
  },
  'tencent-cloud-deal-stack-builders': {
    slug: 'tencent-cloud-deal-stack-builders',
    title: 'Tencent Cloud Deal Stack for Builders',
    body: 'The three-tier stack that powers indie launches: Lighthouse for managed VPS (1-click apps, snapshots, $3/mo), CVM for elastic compute (S5, SA2, GPU), and EdgeOne for global CDN (280+ PoPs, anycast). All with one billing account and unified IAM.',
    evidenceTitle: 'Cloud Stack Overview',
    listItems: [
      'Lighthouse: 1-click WordPress, Ghost, n8n, ntfy',
      'CVM: S5 general, SA2 AMD, GN7 GPU instances',
      'EdgeOne: HTTP/3, WAF, Bot manager at the edge',
      'Bundle discount: 30% off Lighthouse + CVM combo',
    ],
    diagram: 'tencent-stack',
    metric: { value: '30%', label: 'bundle discount Lighthouse + CVM', delta: 'first 12 months' },
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
      variant: 'metric',
      gridArea: 'insight1',
      metric: meta.metric,
      arrowTo: ['evidence'],
    },
    {
      id: 'insight-text',
      variant: 'insight',
      gridArea: 'insight2',
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
      diagram: meta.diagram,
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
    // Dark manga aesthetic — matches global design system
    gridTemplate: '"insight1 insight2 evidence1" "diagram1 diagram1 diagram1" "cta1 cta1 cta1"',
    gridColumns: 'auto 1fr 1fr',
    gridRows: 'auto auto auto',
    cells: buildCells(meta),
  }
}

export function hasStoryboardLayout(slug: string): boolean {
  return slug in ARTICLE_METAS
}
