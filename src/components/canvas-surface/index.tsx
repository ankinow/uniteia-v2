/**
 * CanvasSurface — HTML-in-Canvas progressive enhancement wrapper (Phase 4)
 *
 * Chrome Origin Trial API (Google I/O 2026): drawElementImage + layoutsubtree
 * Feature-detect at runtime, fall back to MasterOpenCanvas parchment.
 *
 * Architecture:
 *   CanvasSurface (feature-detect + shader dispatch)
 *   ├── [HTML-in-Canvas] → <canvas> + drawElementImage + feTurbulence shader
 *   │   1. Trap DOM inside layoutsubtree
 *   │   2. ctx.drawElementImage(container) — render DOM to canvas
 *   │   3. Apply SVG feTurbulence parchment noise overlay
 *   │   4. Composite: multiply blend for ink-bleed effect
 *   └── [Fallback] → MasterOpenCanvas variant="parchment"
 *
 * DOM preserved for SEO/a11y inside the canvas's layoutsubtree.
 * Shader pipeline is compositor-only — zero main thread work.
 */
import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { MasterOpenCanvas } from '~/components/master-open-canvas'

export type CanvasSurfaceTone = 'parchment' | 'obsidian' | 'glass'

export interface CanvasSurfaceProps {
  tone?: CanvasSurfaceTone
  class?: string
}

// ── Feature Detection ──

interface HtmlInCanvasContext {
  drawElementImage(el: Element): void
}

/** Feature-detect HTML-in-Canvas API (Chrome Origin Trial 2026) */
function supportsHtmlInCanvas(): boolean {
  if (typeof HTMLCanvasElement === 'undefined') return false
  const testCanvas = document.createElement('canvas')
  const ctx = testCanvas.getContext('2d') as CanvasRenderingContext2D & {
    drawElementImage?: (el: Element) => void
  }
  if (!ctx || typeof ctx.drawElementImage !== 'function') return false
  if (!('layoutsubtree' in document.documentElement.style)) return false
  return true
}

// ── Parchment Shader Pipeline ──

const PARCHMENT_NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    </filter>
    <filter id="ink-bleed">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" opacity="0.06"/>
  </svg>`

const PARCHMENT_NOISE_DATA_URL = `data:image/svg+xml,${encodeURIComponent(PARCHMENT_NOISE_SVG)}`

function applyParchmentShader(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D & HtmlInCanvasContext,
  container: HTMLDivElement
): void {
  const dpr = window.devicePixelRatio || 1
  const rect = container.getBoundingClientRect()
  const w = rect.width * dpr
  const h = rect.height * dpr

  canvas.width = w
  canvas.height = h
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  ctx.scale(dpr, dpr)

  // Step 1: Draw DOM content to canvas
  ctx.drawElementImage(container)

  // Step 2: Load parchment noise texture
  const noiseImg = new Image()
  noiseImg.onload = () => {
    // Reset transform for noise overlay (already scaled)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    // Draw noise over content with multiply blend
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.06
    ctx.drawImage(noiseImg, 0, 0, rect.width, rect.height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }
  noiseImg.src = PARCHMENT_NOISE_DATA_URL
}

// ── Component ──

export const CanvasSurface = component$<CanvasSurfaceProps>(
  ({ tone = 'parchment', class: className }) => {
    const apiAvailable = useSignal(false)
    const canvasEnabled = useSignal(false)
    const containerRef = useSignal<HTMLDivElement>()

    // Feature-detect + initialize shader on client
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const hasApi = supportsHtmlInCanvas()
      apiAvailable.value = hasApi

      if (hasApi && containerRef.value) {
        const container = containerRef.value
        // Mark container for layoutsubtree
        container.style.setProperty('layoutsubtree', 'canvas-surface-root')

        // Wait for layout, then capture to canvas
        requestAnimationFrame(() => {
          const canvas = document.createElement('canvas')
          canvas.className = 'canvas-surface__canvas absolute inset-0 w-full h-full z-10'
          canvas.setAttribute('aria-hidden', 'true')
          const ctx = canvas.getContext('2d') as
            | (CanvasRenderingContext2D & HtmlInCanvasContext)
            | null

          if (ctx && typeof ctx.drawElementImage === 'function') {
            applyParchmentShader(canvas, ctx, container)
            container.appendChild(canvas)
            canvasEnabled.value = true
            console.info('[CanvasSurface] Parchment shader applied via drawElementImage')
          }
        })
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
        data-html-canvas={canvasEnabled.value ? 'enabled' : 'fallback'}
      >
        {/* Always render DOM children for SEO/a11y — canvas overlay is visual-only */}
        <MasterOpenCanvas variant={masterVariant} static={true}>
          <Slot />
        </MasterOpenCanvas>
      </div>
    )
  }
)
