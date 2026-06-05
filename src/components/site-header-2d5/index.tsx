import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export const SiteHeader2D5 = component$(() => {
  const tiltX = useSignal(0)
  const wrapperRef = useSignal<HTMLDivElement>()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const el = wrapperRef.value
    if (!el) return

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId = 0

    const handleMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = (e.clientX - rect.left) / rect.width - 0.5
        tiltX.value = cx * -3

        el.animate(
          { transform: `rotateY(${tiltX.value}deg) translateZ(20px)` },
          { duration: 500, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
        )
      })
    }

    const handleLeave = () => {
      if (rafId) cancelAnimationFrame(rafId)
      tiltX.value = 0
      el.animate(
        { transform: 'rotateY(0deg) translateZ(20px)' },
        { duration: 700, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
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
    <div class="perspective-dramatic perspective-origin-center-top relative">
      <div class="absolute inset-x-0 top-0 h-full depth-shadow-plane" aria-hidden="true" />
      <div
        ref={wrapperRef}
        class="surface-panel relative preserve-3d depth-content-plane"
        data-blur="lg"
      >
        <div
          class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)] opacity-micro"
          aria-hidden="true"
        />
        <div class="relative z-[1]">
          <Slot />
        </div>
      </div>
    </div>
  )
})
