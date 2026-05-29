/**
 * DepthTilt — Mouse-reactive 3D tilt wrapper (Apple-like card tilt)
 *
 * Wraps children and applies CSS 3D perspective transform based on
 * mouse position within the element. Configurable max tilt angle,
 * perspective, scale-on-hover, and glare effect.
 *
 * Qwik-safe: uses signal-based tracking, no direct DOM mutation.
 */

import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

export interface DepthTiltProps {
  class?: string
  maxTilt?: number // max rotation angle (deg), default 8
  perspective?: number // CSS perspective (px), default 1000
  scale?: number // scale on hover, default 1.01
  glare?: boolean // show glare highlight, default true
  speed?: number // transition speed (ms), default 300
  triggerMode?: 'hover' | 'always' | 'motion'
}

export const DepthTilt = component$<DepthTiltProps>(props => {
  const {
    class: classList,
    maxTilt = 8,
    perspective = 1000,
    scale = 1.01,
    glare = true,
    speed = 300,
    triggerMode = 'hover',
  } = props

  const elRef = useSignal<HTMLDivElement>()
  const tiltX = useSignal(0)
  const tiltY = useSignal(0)
  const glowX = useSignal(50)
  const glowY = useSignal(50)
  const isHovering = useSignal(false)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (isServer) return
    const el = elRef.value
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Use pointer tracking only in hover mode or when user has a pointer
    const isTouchDevice = 'ontouchstart' in window
    if (isTouchDevice && triggerMode !== 'always') return

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width // 0..1
      const y = (e.clientY - rect.top) / rect.height // 0..1

      // Normalize to -1..1
      const nx = x * 2 - 1
      const ny = y * 2 - 1

      tiltX.value = -ny * maxTilt
      tiltY.value = nx * maxTilt
      glowX.value = x * 100
      glowY.value = y * 100
      isHovering.value = true
    }

    const onPointerLeave = () => {
      tiltX.value = 0
      tiltY.value = 0
      isHovering.value = false
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)

    cleanup(() => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
    })
  })

  const styleObj = {
    perspective: `${perspective}px`,
    transformStyle: 'preserve-3d' as const,
    transition: `transform ${speed}ms cubic-bezier(0.3, 1.2, 0.5, 1)`,
  }

  const innerStyle = isHovering.value
    ? {
        transform: `rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: `transform ${speed * 0.5}ms cubic-bezier(0.3, 1.2, 0.5, 1)`,
      }
    : {
        transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: `transform ${speed}ms cubic-bezier(0.3, 1.2, 0.5, 1)`,
      }

  return (
    <div ref={elRef} class={['depth-tilt relative', classList]} style={styleObj}>
      <div class="depth-tilt__inner relative" style={innerStyle}>
        {glare && isHovering.value && (
          <div
            class="depth-tilt__glare absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{
              background: `radial-gradient(circle at ${glowX.value}% ${glowY.value}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
              zIndex: 2,
            }}
            aria-hidden="true"
          />
        )}
        <div
          class="depth-tilt__content relative"
          style={{ transform: 'translateZ(20px)', zIndex: 1 }}
        >
          <Slot />
        </div>
      </div>
    </div>
  )
})
