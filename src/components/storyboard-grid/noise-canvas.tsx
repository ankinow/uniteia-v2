/**
 * NoiseCanvas — Lightweight canvas 2D noise → signal convergence
 * (bundle-safe: <5KB, no dependencies)
 *
 * Renders a canvas where static noise gradually converges
 * into a coherent signal wave, then resets (loop ~8s).
 * Used in StoryboardGrid insight cells to evoke "Aether" theme.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

interface NoiseCanvasProps {
  class?: string
}

// Inline ≈1KB — no imports beyond qwik
export const NoiseCanvas = component$<NoiseCanvasProps>(({ class: classList }) => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  const isVisible = useSignal(false)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2 // 2x for retina
      canvas.height = rect.height * 2
      ctx.scale(2, 2)
    }
    resize()

    // Observe visibility for lazy start/stop
    const observer = new IntersectionObserver(
      entries => {
        isVisible.value = entries[0]?.isIntersecting ?? false
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    // Animation loop — noise → signal
    let frameId = 0
    const W = canvas.width / 2
    const H = canvas.height / 2
    let phase = 0

    const draw = () => {
      if (!isVisible.value) {
        frameId = requestAnimationFrame(draw)
        return
      }

      phase += 0.02
      const cycle = (Math.sin(phase * 0.25) + 1) / 2 // 0..1 saw wave
      const isNoise = cycle < 0.3
      const isConverging = cycle >= 0.3 && cycle < 0.6
      const isSignal = cycle >= 0.6 && cycle < 0.85
      const isReset = cycle >= 0.85

      if (isReset) {
        // Brief flash reset
        ctx.fillStyle = '#faf9f6'
        ctx.fillRect(0, 0, W, H)
      } else if (isNoise || isConverging) {
        // Noise phase
        const alpha = isConverging ? 1 - (cycle - 0.3) / 0.3 : 1
        const imageData = ctx.createImageData(W, H)
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = Math.random() * 255 * alpha
          imageData.data[i] = v
          imageData.data[i + 1] = v
          imageData.data[i + 2] = v
          imageData.data[i + 3] = 30 // very subtle
        }
        ctx.putImageData(imageData, 0, 0)
      } else if (isSignal) {
        // Signal wave phase
        const t = (cycle - 0.6) / 0.25
        ctx.fillStyle = '#faf9f6'
        ctx.fillRect(0, 0, W, H)

        ctx.strokeStyle = `oklch(0.60 0.15 ${240 + t * 40})`
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let x = 0; x < W; x++) {
          const y = H / 2 + Math.sin(x * 0.04 + phase * 3) * 15 * t + Math.sin(x * 0.01 + phase) * 10 * t
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Second harmonic
        ctx.strokeStyle = `oklch(0.55 0.12 ${280 - t * 40})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = 0; x < W; x++) {
          const y = H / 2 + Math.cos(x * 0.06 + phase * 5) * 8 * t + Math.sin(x * 0.02 + phase * 0.5) * 5 * t
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)

    cleanup(() => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    })
  })

  return (
    <canvas
      ref={canvasRef}
      class={['noise-canvas absolute inset-0 w-full h-full pointer-events-none', classList]}
      aria-hidden="true"
    />
  )
})
