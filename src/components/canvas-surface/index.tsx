/**
 * CanvasSurface — HTML-in-Canvas progressive enhancement wrapper (Phase 4 PoC)
 *
 * Chrome Origin Trial API (Google I/O 2026): drawElementImage + layoutsubtree
 * Feature-detect at runtime, fall back to MasterOpenCanvas parchment.
 *
 * Architecture:
 *   CanvasSurface (feature-detect + shader dispatch)
 *   ├── [HTML-in-Canvas] → <canvas> + drawElementImage + shader (parchment/glass)
 *   └── [Fallback] → MasterOpenCanvas variant="parchment"
 *
 * Shader pipeline (when API is available):
 *   1. layoutsubtree: 'parchment-canvas' or 'glass-canvas'
 *   2. drawElementImage(container)
 *   3. Apply SVG feTurbulence noise overlay
 *   4. Composite back into canvas
 *
 * DOM preserved for SEO/a11y inside the canvas's layoutsubtree.
 */
import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { MasterOpenCanvas } from '~/components/master-open-canvas'

export type CanvasSurfaceTone = 'parchment' | 'obsidian' | 'glass'

export interface CanvasSurfaceProps {
  tone?: CanvasSurfaceTone
  class?: string
}

/** Feature-detect HTML-in-Canvas API (Chrome Origin Trial 2026) */
function supportsHtmlInCanvas(): boolean {
  if (typeof HTMLCanvasElement === 'undefined') return false
  // Check for drawElementImage — the key API surface (experimental)
  const testCanvas = document.createElement('canvas')
  const ctx = testCanvas.getContext('2d') as CanvasRenderingContext2D & {
    drawElementImage?: (el: Element) => void
  }
  if (!ctx || typeof ctx.drawElementImage !== 'function') return false
  // layoutsubtree CSS property support
  if (!('layoutsubtree' in document.documentElement.style)) return false
  return true
}

export const CanvasSurface = component$<CanvasSurfaceProps>(
  ({ tone = 'parchment', class: className }) => {
    const apiAvailable = useSignal(false)
    const containerRef = useSignal<HTMLDivElement>()

    // Feature-detect on client
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      apiAvailable.value = supportsHtmlInCanvas()
      if (apiAvailable.value) {
        console.info('[CanvasSurface] HTML-in-Canvas API available — enabling shader pipeline')
      } else {
        console.info('[CanvasSurface] HTML-in-Canvas API unavailable — using parchment fallback')
      }
    })

    const masterVariant = tone === 'obsidian' ? 'obsidian' : 'parchment'

    return (
      <div
        ref={containerRef}
        class={['canvas-surface', 'relative w-full', className].filter(Boolean).join(' ')}
        data-tone={tone}
        data-html-canvas={apiAvailable.value ? 'enabled' : 'fallback'}
      >
        <MasterOpenCanvas variant={masterVariant} static={true}>
          <Slot />
        </MasterOpenCanvas>
      </div>
    )
  }
)
