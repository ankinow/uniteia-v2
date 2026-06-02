/**
 * storyboard-resolver.ts
 * Resolves article content into StoryboardGrid layouts.
 * Uses i18n keys for text — no HTML hardcoding.
 *
 * Each article slug maps to a layout builder function that returns
 * a ResolvedLayout with text already resolved via getTranslation().
 *
 * PLANO-074: SVG workflow diagram now uses i18n keys for all text
 * labels across 8 languages (en, pt, es, fr, de, it, ja, zh).
 */

import type { ResolvedCell, ResolvedLayout } from '~/components/storyboard-grid/types'
import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'

/** Type-safe access to the magica article i18n block */
type MagicaI18n = TranslationStrings['article']['magica'] & TranslationStrings['article']['canvaMagica']
type MagicaProductionI18n = TranslationStrings['article']['canvaMagicaProduction']

function esc(str: string): string {
  // Escape XML special chars for safe SVG embedding
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildWorkflowSvg(
  workflowTitle: string,
  inputLabel: string,
  aiTitle: string,
  aiSubtitle: string,
  qualityScore: string,
  languages: string,
  outputLabel: string,
  alt: string
): { src: string; alt: string } {
  return {
    src: `data:image/svg+xml,${encodeURIComponent(
      `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(alt)}">
        <rect width="400" height="200" fill="#f8f8f8" rx="4"/>
        <text x="200" y="25" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#666">${esc(workflowTitle)}</text>
        <rect x="20" y="40" width="100" height="50" rx="6" fill="#3b82f6" opacity="0.9"/>
        <text x="70" y="68" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#fff" font-weight="bold">${esc(inputLabel)}</text>
        <path d="M120,65 L170,65" stroke="#111" stroke-width="2"/>
        <polygon points="170,60 178,65 170,70" fill="#111"/>
        <rect x="175" y="40" width="140" height="50" rx="6" fill="#10b981" opacity="0.9"/>
        <text x="245" y="58" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#fff" font-weight="bold">${esc(aiTitle)}</text>
        <text x="245" y="74" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#fff" opacity="0.8">${esc(aiSubtitle)}</text>
        <path d="M315,65 L355,65" stroke="#111" stroke-width="2"/>
        <polygon points="355,60 363,65 355,70" fill="#111"/>
        <rect x="360" y="40" width="25" height="50" rx="6" fill="#f59e0b" opacity="0.9"/>
        <text x="372" y="68" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#fff" font-weight="bold">→</text>
        <rect x="60" y="110" width="100" height="40" rx="4" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" stroke-width="1"/>
        <text x="110" y="134" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#8b5cf6">${esc(qualityScore)}</text>
        <rect x="220" y="110" width="100" height="40" rx="4" fill="#ec4899" opacity="0.1" stroke="#ec4899" stroke-width="1"/>
        <text x="270" y="134" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#ec4899">${esc(languages)}</text>
        <line x1="110" y1="150" x2="270" y2="150" stroke="#ddd" stroke-width="0.5"/>
        <text x="200" y="175" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#999">${esc(outputLabel)}</text>
      </svg>`
    )}`,
    alt,
  }
}

/**
 * Maps from article slug to StoryboardLayout definition.
 * Returns null for articles that should use the legacy collage.
 */
export function getStoryboardLayout(
  slug: string,
  lang: SupportedLanguage,
  t: TranslationStrings
): ResolvedLayout | null {
  switch (slug) {
    case 'magica-overview':
      return buildMagicaOverviewLayout(lang, t)
    default:
      return null
  }
}

function buildMagicaOverviewLayout(
  _lang: SupportedLanguage,
  t: TranslationStrings
): ResolvedLayout {
  // Type-safe access to magica article keys — defined in i18n files
  const m: Partial<MagicaI18n> = t.article?.magica ?? {}
  const cv: Partial<MagicaProductionI18n> = t.article?.canvaMagicaProduction ?? {}

  const workflowSvg = buildWorkflowSvg(
    cv?.workflowTitle ?? 'Magica Workflow Builder',
    cv?.inputLabel ?? 'INPUT',
    cv?.aiProcessing?.title ?? 'AI PROCESSING',
    cv?.aiProcessing?.subtitle ?? 'Node-based prompt chaining',
    cv?.qualityScore ?? '84 quality score',
    cv?.languages ?? '8 languages',
    cv?.outputLabel ?? 'Prompt → Model Router → Output',
    m?.evidence?.alt ?? 'Screenshot of Magica workflow builder'
  )

  const cells: ResolvedCell[] = [
    {
      id: 'insight-workflow',
      variant: 'insight',
      gridArea: 'insight1',
      title: m?.insight?.title ?? 'Magica: The AI Command Center',
      body:
        m?.insight?.body ??
        'Magica unifies prompt engineering, model routing, and evaluation in a single interface.',
      arrowTo: ['evidence-workflow'],
    },
    {
      id: 'evidence-workflow',
      variant: 'evidence',
      gridArea: 'evidence1',
      title: m?.evidence?.title ?? 'Workflow Visualization',
      image: workflowSvg,
      arrowTo: ['diagram-arch'],
    },
    {
      id: 'diagram-arch',
      variant: 'diagram',
      gridArea: 'diagram1',
      title: m?.architecture?.title ?? 'Architecture',
      list: [
        m?.architecture?.point1 ?? 'Node-based prompt chaining',
        m?.architecture?.point2 ?? 'Multi-model fallback routing',
        m?.architecture?.point3 ?? 'Real-time latency telemetry',
      ],
      arrowTo: ['cta-start'],
    },
    {
      id: 'cta-start',
      variant: 'cta',
      gridArea: 'cta1',
      title: m?.cta?.title ?? 'Start Building',
      body: m?.cta?.body ?? 'Try Magica free — no credit card required.',
      cta: {
        label: m?.cta?.button ?? 'Visit Magica',
        href: 'https://try.magica.com/clique-serio',
        variant: 'primary',
      },
    },
  ]

  return {
    version: '2.0',
    gridTemplate: '"insight1 evidence1 evidence1" "diagram1 diagram1 cta1"',
    gridColumns: '1fr 1fr 1fr',
    gridRows: 'auto auto',
    cells,
  }
}

/** Check if a slug has a storyboard layout defined */
export function hasStoryboardLayout(slug: string): boolean {
  return slug === 'magica-overview'
}
