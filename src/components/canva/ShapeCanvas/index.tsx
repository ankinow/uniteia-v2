/**
 * ShapeCanvas — Qwik SVG composition surface for canva visuals (pitfall 96)
 *
 * Receives a flat list of shape refs and renders an SVG with one <image>
 * tag per ref. Paths come from the canonical shapePath() resolver in the
 * shared render-worker shape-registry (imported as `~/../../packages/...`).
 *
 * No tldraw / Excalidraw — pure inline SVG. No $localize — useI18n() only.
 * All text is opt-in via the `titleKey` prop; refs are pure geometry.
 *
 * i18n: titles come from the new `canva` block in TranslationStrings,
 * pre-resolved at SSR time by `useCanvaI18n` (pitfall 45 — flat Record
 * keyed by dot-paths, accessed via `t[titleKey]`, not nested proxies).
 */

import { component$ } from '@builder.io/qwik'
import { type CanvaI18nKey, useCanvaI18n } from '~/hooks/useCanvaI18n'
import type { SupportedLanguage } from '~/i18n/types'
import {
  type ShapeMood,
  type ShapeStyle,
  shapePath,
} from '../../../../packages/render-worker/src/visual-asset-agent/shape-registry'

export interface ShapeRef {
  shapeId: string
  style: ShapeStyle
  mood: ShapeMood
  x: number
  y: number
  w: number
  h: number
}

export interface ShapeCanvasProps {
  refs: ShapeRef[]
  lang: SupportedLanguage
  titleKey: CanvaI18nKey
  viewBoxWidth?: number
  viewBoxHeight?: number
}

export const ShapeCanvas = component$<ShapeCanvasProps>(
  ({ refs, lang, titleKey, viewBoxWidth = 1200, viewBoxHeight = 800 }) => {
    // Pre-resolve flat i18n record at SSR (pitfall 45)
    const t = useCanvaI18n(lang)
    const ariaLabel = t[titleKey]
    return (
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
        class="shape-canvas"
      >
        {refs.map(ref => (
          <image
            key={`${ref.shapeId}-${ref.x}-${ref.y}`}
            href={shapePath(ref.shapeId, ref.style, ref.mood)}
            x={ref.x}
            y={ref.y}
            width={ref.w}
            height={ref.h}
            preserveAspectRatio="xMidYMid meet"
            data-shape-id={ref.shapeId}
            data-style={ref.style}
            data-mood={ref.mood}
          />
        ))}
      </svg>
    )
  }
)

export default ShapeCanvas
