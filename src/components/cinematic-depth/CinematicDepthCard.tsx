/**
 * CinematicDepthCard v2026 — JIT Skill Mutant D002
 * 2.5D Neo-Realistic depth card with WAAPI spring tilt,
 * glassmorphism-2, grain-4k texture, and sharp directional shadows.
 *
 * Composable unit — replaces flat depth-card across all surfaces.
 */
import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export type CinematicVariant = 'card' | 'hero' | 'subtle' | 'collage-editorial'

export interface CinematicDepthCardProps {
  /** Visual intensity tier */
  variant?: CinematicVariant
  /** Base translateZ offset in px (default: 0) */
  layer?: number
  /** Additional CSS classes */
  class?: string
}

const VARIANT_CONFIG: Record<
  CinematicVariant,
  { tiltMax: number; grainOpacity: string; shadow: string; translateZ: number }
> = {
  card: {
    tiltMax: 4,
    grainOpacity: '0.04',
    shadow: '0 14px 32px rgb(0 0 0 / 0.28)',
    translateZ: 10,
  },
  hero: {
    tiltMax: 8,
    grainOpacity: '0.06',
    shadow: '0 18px 42px rgb(0 0 0 / 0.34)',
    translateZ: 20,
  },
  subtle: {
    tiltMax: 2,
    grainOpacity: '0.02',
    shadow: '0 8px 20px rgb(0 0 0 / 0.20)',
    translateZ: 0,
  },
  'collage-editorial': {
    tiltMax: 12,
    grainOpacity: '0.05',
    shadow: '0 20px 48px rgb(0 0 0 / 0.30)',
    translateZ: 15,
  },
}

/**
 * CinematicDepthCard — 2.5D Perspective Card
 *
 * Architecture (front-to-back):
 *  Layer 2 (front): Grain-4k texture + glassmorphism-2 border
 *  Layer 1 (content): Card body with content via slot
 *  Layer 0 (back): Directional shadow plane
 *
 * Tilt: WAAPI Element.animate() spring — compositor-only, zero framer-motion.
 * Hydration-safe: useVisibleTask$ isolates browser-only pointer events.
 */
export const CinematicDepthCard = component$<CinematicDepthCardProps>(
  ({ variant = 'card', layer = 0, class: className }) => {
    const cfg = VARIANT_CONFIG[variant]
    const tiltX = useSignal(0)
    const tiltY = useSignal(0)
    const cardRef = useSignal<HTMLDivElement>()

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const el = cardRef.value
      if (!el) return

      const handleMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const cx = (e.clientX - rect.left) / rect.width - 0.5
        const cy = (e.clientY - rect.top) / rect.height - 0.5
        tiltX.value = cy * -cfg.tiltMax
        tiltY.value = cx * cfg.tiltMax

        // WAAPI spring tilt on the depth layer
        el.animate(
          {
            transform: `rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) translateZ(${cfg.translateZ + layer}px)`,
          },
          { duration: 400, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
        )
      }

      const handleLeave = () => {
        tiltX.value = 0
        tiltY.value = 0
        el.animate(
          { transform: `rotateX(0deg) rotateY(0deg) translateZ(${cfg.translateZ + layer}px)` },
          { duration: 600, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
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
        class={[
          'perspective-dramatic relative',
          variant === 'collage-editorial' && '-mx-1 -my-1',
          className,
        ]}
        style={{
          perspectiveOrigin: 'center center',
          ...(variant === 'collage-editorial' ? { overflow: 'visible' } : {}),
        }}
      >
        {/* Layer 0 — Shadow plane */}
        <div
          class="absolute inset-0 rounded-none"
          style={{
            transform: 'translateZ(-10px) scale(0.96)',
            boxShadow: cfg.shadow,
            opacity: 0.9,
          }}
          aria-hidden="true"
        />

        {/* Layer 1 + 2 — Content + texture */}
        <div
          ref={cardRef}
          class="glassmorphism-2 depth-surface depth-raised relative preserve-3d cursor-pointer"
          style={{
            transform: `translateZ(${cfg.translateZ + layer}px)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Layer 2 — Grain overlay */}
          <div
            class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
            style={{ opacity: cfg.grainOpacity }}
            aria-hidden="true"
          />

          {variant === 'collage-editorial' && (
            <>
              {/* Scrapbook layer */}
              <div class="scrapbook-layer" aria-hidden="true">
                <span class="corkboard-layer" />
                <div class="paper-fiber" />
                <div class="ink-effect" data-intensity="medium" />
              </div>

              {/* Clip-path diagonal overlay */}
              <div class="clip-diagonal-a" aria-hidden="true" />

              {/* HUD label */}
              <div class="collage-hud">EDITORIAL</div>
            </>
          )}

          {/* Content */}
          <div class={['relative z-[1]', variant === 'collage-editorial' && 'ink-annotations']}>
            <Slot />
          </div>
        </div>
      </div>
    )
  }
)
