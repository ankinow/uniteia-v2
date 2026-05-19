import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { JSXChildren } from '@builder.io/qwik'

/**
 * useScrollObserver — Centralized scroll velocity + dwell detection.
 *
 * Reactive signals: scrollY, velocity (px/frame), dwellRatio (0–1),
 * progress (0–1 page). rAF-batched, zero layout thrashing.
 */
export interface ScrollMetrics {
  scrollY: number
  velocity: number
  dwellRatio: number
  progress: number
}

export const useScrollObserver = () => {
  const metrics = useSignal<ScrollMetrics>({
    scrollY: 0,
    velocity: 0,
    dwellRatio: 0,
    progress: 0,
  })

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (typeof window === 'undefined') return

    let lastY = window.scrollY
    let lastTime = performance.now()
    let dwellTimer = 0
    const _DWELL_THRESHOLD = 300
    let rafId = 0

    const update = () => {
      const now = performance.now()
      const currentY = window.scrollY
      const dt = Math.max(now - lastTime, 1)
      const dy = Math.abs(currentY - lastY)
      const rawVelocity = dy / (dt / 16.67)

      const smoothedVelocity = metrics.value.velocity * 0.7 + rawVelocity * 0.3

      if (smoothedVelocity < 2 && dy < 2) {
        dwellTimer += dt
      } else {
        dwellTimer = 0
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? currentY / maxScroll : 0
      const dwellRatio = Math.min(dwellTimer / 2000, 1)

      metrics.value = {
        scrollY: currentY,
        velocity: Math.round(smoothedVelocity * 100) / 100,
        dwellRatio: Math.round(dwellRatio * 100) / 100,
        progress: Math.round(progress * 1000) / 1000,
      }

      lastY = currentY
      lastTime = now
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    cleanup(() => cancelAnimationFrame(rafId))
  })

  return metrics
}

/**
 * ScrollHeroOrganism — 5-layer parallax hero com velocity glow.
 *
 * Cada layer tem speed (0.2 distante a 1.2 próximo) + depth (translateZ px).
 * CSS @scroll-timeline --narrative vincula todas as animações.
 *
 * Uso:
 * ```tsx
 * <ScrollHeroOrganism layers={[
 *   { content: <BgSky />, speed: 0.2, depth: -40 },
 *   { content: <Mountains />, speed: 0.4, depth: -20 },
 *   { content: <HeroText />, speed: 0.8, depth: 0 },
 *   { content: <ForegroundParticles />, speed: 1.2, depth: 20 },
 * ]} />
 * ```
 */
export interface ParallaxLayer {
  content: JSXChildren
  speed: number
  depth?: number
  class?: string
}

export interface ScrollHeroOrganismProps {
  layers: ParallaxLayer[]
  class?: string
  timelineName?: string
}

export const ScrollHeroOrganism = component$<ScrollHeroOrganismProps>(
  ({ layers, class: classList, timelineName = '--narrative' }) => {
    const _metrics = useScrollObserver()
    const normalizedSpeed = layers.map(l => String(l.speed))

    return (
      <section
        class={['scroll-narrative-root ue5-illusion relative overflow-hidden', classList]}
        style={{
          perspective: '1400px',
          transformStyle: 'preserve-3d',
          height: '100vh',
          minHeight: '600px',
          scrollTimelineName: timelineName,
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={`${layer.speed}-${layer.depth ?? 0}-${i}`}
            class={[
              'parallax-layer absolute inset-0 flex items-center justify-center',
              layer.class,
            ]}
            data-speed={normalizedSpeed[i]}
            style={{
              transform: `translateZ(${layer.depth ?? 0}px)`,
              zIndex: i,
            }}
          >
            {layer.content}
          </div>
        ))}

        {/* Velocity glow edge */}
        <div
          class="velocity-glow absolute bottom-0 left-1/2 w-1/2 h-px -translate-x-1/2 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(100,220,255,0.5), transparent)',
          }}
        />
      </section>
    )
  }
)
