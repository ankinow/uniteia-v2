/**
 * CanvaComposition — generic 6-template wrapper around ShapeCanvas (pitfall 96)
 *
 * Renders a CanvaSceneType-specific title key over the ShapeCanvas SVG.
 * Pure SSR: refs and lang are resolved server-side (via routeLoader$) —
 * no useVisibleTask$, no $localize, no client-side fetch (pitfall 95).
 *
 * Replaces per-article CanvaXxx components with one generic component
 * driven by sceneType. All text comes from TranslationStrings['canva']
 * (pitfall 45: flat record via useCanvaI18n, accessed by dot-key).
 */

import { component$ } from '@builder.io/qwik'
import { ShapeCanvas, type ShapeRef } from '~/components/canva/ShapeCanvas'
import { type CanvaI18nKey, useCanvaI18n } from '~/hooks/useCanvaI18n'
import type { SupportedLanguage } from '~/i18n/types'
import type { CanvaSceneType } from '~/utils/storyboard-resolver'

export interface CanvaCompositionProps {
  refs: ShapeRef[]
  lang: SupportedLanguage
  sceneType: CanvaSceneType
  /** Optional viewBox override (defaults to 1200×800) */
  viewBoxWidth?: number
  viewBoxHeight?: number
}

/**
 * Map sceneType → the dot-notation canva i18n key used as aria-label + caption.
 * Matches TranslationStrings['canva'] keys defined in src/i18n/types.ts.
 */
const SCENE_TITLE_KEY: Record<CanvaSceneType, CanvaI18nKey> = {
  hero: 'canva.hero.title',
  concept: 'canva.concept.central',
  code: 'canva.code.step.1.title',
  comparison: 'canva.compare.option.b',
  timeline: 'canva.timeline.milestone.1',
  summary: 'canva.summary.nextstep',
}

export const CanvaComposition = component$<CanvaCompositionProps>(
  ({ refs, lang, sceneType, viewBoxWidth = 1200, viewBoxHeight = 800 }) => {
    // Pre-resolve flat i18n record at SSR (pitfall 45)
    const t = useCanvaI18n(lang)
    const titleKey = SCENE_TITLE_KEY[sceneType]
    const ariaLabel = t[titleKey]

    return (
      <section
        class="canva-composition"
        data-scene-type={sceneType}
        data-lang={lang}
        aria-label={ariaLabel}
      >
        <h2 class="canva-composition-title sr-only">{ariaLabel}</h2>
        <ShapeCanvas
          refs={refs}
          lang={lang}
          titleKey={titleKey}
          viewBoxWidth={viewBoxWidth}
          viewBoxHeight={viewBoxHeight}
        />
      </section>
    )
  }
)

export default CanvaComposition
