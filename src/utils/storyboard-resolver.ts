/**
 * storyboard-resolver.ts
 * Resolves article content into StoryboardGrid layouts.
 * Uses i18n keys for text — no HTML hardcoding.
 *
 * Each article slug maps to a layout builder function that returns
 * a ResolvedLayout with text already resolved via getTranslation().
 */

import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'
import type { ResolvedCell, ResolvedLayout } from '~/components/storyboard-grid/types'

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
  const m = (t as any).article?.magica

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
      image: {
        src: m?.evidence?.image ?? '/og-image.png',
        alt: m?.evidence?.alt ?? 'Screenshot of Magica workflow builder',
      },
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
