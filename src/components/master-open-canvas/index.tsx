/**
 * MasterOpenCanvas v2026.05 — M012 bleeding-edge interactive canvas.
 *
 * Mixed-media depth canvas with 3-tier variant system:
 *   subtle   → minimal corkboard hint, no paper/ink, slight grain, ±3° tilt
 *   medium   → corkboard + paper + ink, moderate grain, ±5° tilt
 *   rich     → full stack: shadow plane, dense corkboard, paper, ink, grain, ±8° tilt
 *
 * Architecture (front-to-back):
 *   Layer 0 (back):   Shadow plane (rich only, translateZ(-10px) scale(0.96))
 *   Layer 1 (middle): Content card — glass[data-blur="lg"] + depth-surface
 *     - Corkboard texture span (medium/rich) with data-intensity
 *     - Paper real texture span (medium/rich)
 *     - Grain 4K overlay (all variants, variant opacity)
 *     - DecisionMap with conditional ink-effect
 *     - Sketchnote spec placeholder (preserved)
 *
 * Tilt: WAAPI Element.animate() spring — compositor-only.
 * Hydration-safe: useVisibleTask$ isolates browser-only pointer events.
 */
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { DecisionMap, type DecisionNode } from '~/components/lesson/decision-map'

// ── Types ──

export type MasterOpenCanvasVariant = 'subtle' | 'medium' | 'rich'

export interface VariantConfigEntry {
  /** 'none' means the corkboard layer is not rendered */
  corkboardIntensity: 'none' | 'medium' | 'rich'
  /** Whether paper-real-texture span is rendered */
  paperVisible: boolean
  /** 'none' means the ink-effect class is not applied */
  inkIntensity: 'none' | 'medium' | 'rich'
  /** Opacity for the grain-4k overlay */
  grainOpacity: string
  /** Max tilt angle in degrees (positive) */
  tiltMax: number
  /** Whether a translated shadow plane is rendered behind the card */
  shadowPlane: boolean
}

// ── Variant Config ──

export const VARIANT_CONFIG: Record<MasterOpenCanvasVariant, VariantConfigEntry> = {
  subtle: {
    corkboardIntensity: 'none',
    paperVisible: false,
    inkIntensity: 'none',
    grainOpacity: '0.02',
    tiltMax: 3,
    shadowPlane: false,
  },
  medium: {
    corkboardIntensity: 'medium',
    paperVisible: true,
    inkIntensity: 'medium',
    grainOpacity: '0.04',
    tiltMax: 5,
    shadowPlane: false,
  },
  rich: {
    corkboardIntensity: 'rich',
    paperVisible: true,
    inkIntensity: 'rich',
    grainOpacity: '0.06',
    tiltMax: 8,
    shadowPlane: true,
  },
}

// ── Props ──

export interface MasterOpenCanvasProps {
  title: string
  decisionNodes: DecisionNode[]
  sketchnoteSpec?: string
  /** Visual intensity tier (default: 'medium') */
  variant?: MasterOpenCanvasVariant
  /** Additional CSS classes */
  class?: string
  /** Renders a sticky note overlay (yellow, rotated, hand-drawn border) */
  showStickyNote?: boolean
  /** Renders a cardboard texture layer behind the content */
  showCardboard?: boolean
}

// ── Component ──

export const MasterOpenCanvas = component$<MasterOpenCanvasProps>(
  ({
    title,
    decisionNodes,
    sketchnoteSpec,
    variant = 'medium',
    class: className,
    showStickyNote,
    showCardboard,
  }) => {
    const cfg = VARIANT_CONFIG[variant]
    const tiltX = useSignal(0)
    const tiltY = useSignal(0)
    const cardRef = useSignal<HTMLDivElement>()

    // WAAPI cursor tilt — browser-only, SSR-safe via useVisibleTask$
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const el = cardRef.value
      if (!el) return

      // Guard: WAAPI animate() availability
      if (typeof el.animate !== 'function') {
        console.warn('[MasterOpenCanvas] WAAPI animate() unavailable — tilt disabled')
        return
      }

      // Guard: reduced motion preference
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        console.warn('[MasterOpenCanvas] Tilt skipped: prefers-reduced-motion is active')
        return
      }

      // Guard: non-hover device (touch-only)
      const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

      if (!hasHover) {
        console.warn('[MasterOpenCanvas] Tilt skipped: device does not support hover')
        return
      }

      const handleMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const cx = (e.clientX - rect.left) / rect.width - 0.5
        const cy = (e.clientY - rect.top) / rect.height - 0.5

        tiltX.value = cy * -cfg.tiltMax
        tiltY.value = cx * cfg.tiltMax

        // Finish existing animations before applying new one
        for (const a of el.getAnimations()) a.finish()

        el.animate(
          {
            transform: `rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`,
          },
          {
            duration: 400,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'forwards',
          }
        )
      }

      const handleLeave = () => {
        tiltX.value = 0
        tiltY.value = 0

        for (const a of el.getAnimations()) a.finish()

        el.animate(
          { transform: 'rotateX(0deg) rotateY(0deg)' },
          {
            duration: 600,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'forwards',
          }
        )
      }

      el.addEventListener('pointermove', handleMove)
      el.addEventListener('pointerleave', handleLeave)

      cleanup(() => {
        el.removeEventListener('pointermove', handleMove)
        el.removeEventListener('pointerleave', handleLeave)
      })
    })

    return (
      <div
        data-testid="master-open-canvas"
        class={[
          'mixed-media-canvas cursor-stylus perspective-dramatic preserve-3d relative',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Layer 0 — Shadow plane (rich only) */}
        {cfg.shadowPlane && (
          <div
            class="absolute inset-0 rounded-none"
            style={{
              transform: 'translateZ(-10px) scale(0.96)',
              boxShadow: '0 18px 42px rgb(0 0 0 / 0.34)',
              opacity: 0.9,
            }}
            aria-hidden="true"
          />
        )}

        {/* Layer 1 — Content card */}
        <div
          ref={cardRef}
          class="glass depth-surface relative preserve-3d"
          data-blur="lg"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Corkboard texture layer */}
          {cfg.corkboardIntensity !== 'none' && (
            <span
              class="corkboard-layer"
              data-intensity={cfg.corkboardIntensity}
              aria-hidden="true"
            />
          )}

          {/* Paper real texture layer */}
          {cfg.paperVisible && <span class="paper-real-texture" aria-hidden="true" />}

          {/* Paper fiber — background layer */}
          <div class="paper-fiber" aria-hidden="true" />

          {/* Grain 4K overlay */}
          <div class="grain-4k" style={{ opacity: cfg.grainOpacity }} aria-hidden="true" />

          {/* Cardboard texture layer */}
          {showCardboard && <div class="cardboard-layer" aria-hidden="true" />}

          {/* Content */}
          <div class="relative z-[1] p-6 md:p-8">
            <h1 class="text-4xl font-display text-bone mb-8">{title}</h1>

            <div
              class={cfg.inkIntensity !== 'none' ? 'ink-effect' : undefined}
              {...(cfg.inkIntensity !== 'none'
                ? { 'data-intensity': cfg.inkIntensity }
                : undefined)}
            >
              <DecisionMap
                title="Open Canvas Decision Flow"
                nodes={decisionNodes}
                variant="sketchnote"
              />
            </div>

            {/* Sketchnote spec placeholder — M012 render-worker hook */}
            {sketchnoteSpec && (
              <div
                data-sketchnote={sketchnoteSpec}
                class="grain-4k absolute inset-0 pointer-events-none opacity-[0.03]"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Sticky note overlay */}
          {showStickyNote && <div class="sticky-note" aria-hidden="true" />}
        </div>
      </div>
    )
  }
)
