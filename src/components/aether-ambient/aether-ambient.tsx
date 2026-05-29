/**
 * AetherAmbient — Canvas2D animated grain/fog/vortex overlay
 * (bundle-safe: <6KB, no dependencies)
 *
 * Real-time procedural grain that breathes and moves — replaces static SVG noise.
 * 3 modes: grain (fast static noise), fog (slow organic drift), vortex (spiral convergence)
 * Performance: rAF loop, visible only when in viewport, auto-pauses on reduced-motion.
 * 4x4 supersampled pixel blocks for performance at full-screen.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

export type AmbientMode = 'grain' | 'fog' | 'vortex'

export interface AetherAmbientProps {
  class?: string
  mode?: AmbientMode
  opacity?: number
  blendMode?: 'overlay' | 'multiply' | 'screen' | 'normal'
  density?: number // 0.0–1.0, controls noise density
  speed?: number // animation speed multiplier
  color?: string // optional tint, e.g. 'oklch(60% 0.2 265)'
  grainSize?: number // pixel block size (1=sharp, 4=chunky)
}

export const AetherAmbient = component$<AetherAmbientProps>(props => {
  const {
    class: classList,
    mode = 'grain',
    opacity = 0.04,
    blendMode = 'overlay',
    density = 1.0,
    speed = 1.0,
    color,
    grainSize = 3,
  } = props

  const canvasRef = useSignal<HTMLCanvasElement>()
  const isVisible = useSignal(false)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (isServer) return

    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // Static single-frame grain
      canvas.width = 128
      canvas.height = 128
      const imgData = ctx.createImageData(128, 128)
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255
        imgData.data[i] = v
        imgData.data[i + 1] = v
        imgData.data[i + 2] = v
        imgData.data[i + 3] = 20
      }
      ctx.putImageData(imgData, 0, 0)
      return // no animation loop
    }

    let animFrameId = 0
    let frame = 0

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.min(w, 1024) // cap for performance
      canvas.height = Math.min(h, 768)
    }
    resize()

    // Visibility observer
    const obs = new IntersectionObserver(
      entries => {
        isVisible.value = entries[0]?.isIntersecting ?? false
      },
      { threshold: 0.01 }
    )
    obs.observe(canvas)

    const parseColor = (c?: string): [number, number, number] => {
      if (!c) return [0, 0, 0]
      // Extract oklch numbers: oklch(60% 0.2 265)
      const m = c.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
      if (m) {
        return [Number.parseFloat(m[1]), Number.parseFloat(m[2]), Number.parseFloat(m[3])]
      }
      return [60, 0.2, 265] // default cyan-indigo
    }

    const [_hueL, _hueC, _hueH] = parseColor(color)

    const draw = () => {
      frame++
      if (!isVisible.value) {
        animFrameId = requestAnimationFrame(draw)
        return
      }

      const W = canvas.width
      const H = canvas.height
      const gs = grainSize // pixel block size
      const cols = Math.floor(W / gs)
      const rows = Math.floor(H / gs)

      const imgData = ctx.createImageData(cols, rows)
      const data = imgData.data
      const len = cols * rows
      const d = density
      const sp = speed

      if (mode === 'grain') {
        // Static noise that changes subtly each frame (film grain)
        for (let i = 0; i < len; i++) {
          const idx = i * 4
          const noise = Math.random() * 255 * d
          data[idx] = noise
          data[idx + 1] = noise
          data[idx + 2] = noise
          data[idx + 3] = 30 * d
        }
      } else if (mode === 'fog') {
        // Slow organic drift — scrolling gradient fog
        const t = frame * 0.002 * sp
        for (let i = 0; i < len; i++) {
          const x = i % cols
          const y = Math.floor(i / cols)
          const n1 = Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t * 0.7)
          const n2 = Math.sin(x * 0.02 + y * 0.03 + t * 0.5)
          const val = (n1 * 0.5 + n2 * 0.5 + 1) * 0.5 // 0..1
          const idx = i * 4
          const v = val * 255 * d
          data[idx] = v
          data[idx + 1] = v
          data[idx + 2] = v
          data[idx + 3] = 25 * d
        }
      } else if (mode === 'vortex') {
        // Spiral convergence — organic flow field
        const t = frame * 0.003 * sp
        const cx = cols / 2
        const cy = rows / 2
        for (let i = 0; i < len; i++) {
          const x = i % cols
          const y = Math.floor(i / cols)
          const dx = x - cx
          const dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx) + t + dist * 0.02
          const n = Math.sin(angle * 3 + t) * Math.cos(dist * 0.05 - t * 0.5)
          const val = (n + 1) * 0.5
          const idx = i * 4
          const v = val * 255 * d
          data[idx] = v
          data[idx + 1] = v * 0.8
          data[idx + 2] = v * 1.2
          data[idx + 3] = 20 * d
        }
      }

      // Upscale block pixels to fill canvas
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = cols
      tempCanvas.height = rows
      const tempCtx = tempCanvas.getContext('2d')
      if (tempCtx) {
        tempCtx.putImageData(imgData, 0, 0)
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(tempCanvas, 0, 0, cols, rows, 0, 0, W, H)
      }

      animFrameId = requestAnimationFrame(draw)
    }

    animFrameId = requestAnimationFrame(draw)

    // Debounced resize
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 200)
    }
    window.addEventListener('resize', onResize)

    cleanup(() => {
      cancelAnimationFrame(animFrameId)
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    })
  })

  return (
    <canvas
      ref={canvasRef}
      class={['aether-ambient fixed inset-0 w-full h-full pointer-events-none', classList]}
      style={{
        opacity,
        mixBlendMode: blendMode,
        zIndex: 0,
      }}
    />
  )
})
