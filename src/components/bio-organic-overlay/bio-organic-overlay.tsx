/**
 * BioOrganicOverlay — Tech-Organic Fusion Layer
 * Canvas2D procedural slow-growing L-system light branches.
 * (bundle-safe: <5KB, no dependencies)
 *
 * Grows organic branch structures toward cursor on hover.
 * Dormant = slow ambient sway. Active = tendril reach toward pointer.
 * Color: oklch(65% 0.15 140) emerald-green on dark background.
 * Performance: rAF, visibility-gated, reduced-motion → static SVG silhouette.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { isServer } from '@builder.io/qwik/build'

export interface BioOrganicOverlayProps {
  class?: string
  opacity?: number
  branchCount?: number
  growthSpeed?: number
  color?: string
}

interface Branch {
  x: number
  y: number
  angle: number
  length: number
  thickness: number
  children: Branch[]
  phase: number
  targetAngle: number
}

function createBranch(
  x: number,
  y: number,
  angle: number,
  length: number,
  thickness: number,
  depth: number
): Branch {
  const children: Branch[] = []
  if (depth > 0 && length > 4) {
    // Create 1-2 sub-branches
    const count = Math.random() > 0.4 ? 2 : 1
    for (let i = 0; i < count; i++) {
      const childAngle = angle + (Math.random() - 0.5) * 1.2
      const childLen = length * (0.5 + Math.random() * 0.25)
      children.push(
        createBranch(
          x + Math.cos(angle) * length * 0.6,
          y + Math.sin(angle) * length * 0.6,
          childAngle,
          childLen,
          thickness * 0.6,
          depth - 1
        )
      )
    }
  }
  return {
    x,
    y,
    angle,
    length,
    thickness,
    children,
    phase: Math.random() * Math.PI * 2,
    targetAngle: angle,
  }
}

export const BioOrganicOverlay = component$<BioOrganicOverlayProps>(props => {
  const {
    class: classList,
    opacity = 0.15,
    branchCount = 3,
    growthSpeed = 1,
    color = 'oklch(65% 0.15 140)',
  } = props

  const canvasRef = useSignal<HTMLCanvasElement>()
  const isVisible = useSignal(false)
  const mouseX = useSignal(0.5)
  const mouseY = useSignal(0.5)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (isServer) return
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Generate branch structure (deterministic seed per session)
    const branches: Branch[] = []
    const rng = () => {
      let s = 42
      return () => {
        s = (s * 16807 + 0) % 2147483647
        return (s - 1) / 2147483646
      }
    }
    const r = rng()
    for (let i = 0; i < branchCount; i++) {
      const x = 0.1 + r() * 0.8
      const y = 0.3 + r() * 0.5
      const angle = -Math.PI / 2 + (r() - 0.5) * 0.8
      branches.push(createBranch(x, y, angle, 40 + r() * 30, 2.5 + r() * 1.5, 3))
    }

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resize()

    const obs = new IntersectionObserver(
      entries => {
        isVisible.value = entries[0]?.isIntersecting ?? false
      },
      { threshold: 0.05 }
    )
    obs.observe(canvas)

    // Mouse tracking
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX.value = (e.clientX - rect.left) / rect.width
      mouseY.value = (e.clientY - rect.top) / rect.height
    }
    canvas.addEventListener('pointermove', onMove)

    let frameId = 0
    let time = 0

    // Parse color
    const colorMatch = color.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
    const [hL, hC, hH] = colorMatch
      ? [
          Number.parseFloat(colorMatch[1]),
          Number.parseFloat(colorMatch[2]),
          Number.parseFloat(colorMatch[3]),
        ]
      : [65, 0.15, 140]

    const drawBranch = (b: Branch, px: number, py: number, t: number) => {
      const mx = mouseX.value
      const my = mouseY.value
      const dx = mx - px
      const dy = my - py
      const dist = Math.sqrt(dx * dx + dy * dy)
      const influence = Math.max(0, 1 - dist * 2) * 0.5

      // Organic sway + cursor attraction
      const sway = Math.sin(t * 0.5 + b.phase) * 0.1
      const target = b.targetAngle + sway + (Math.atan2(dy, dx) - b.angle) * influence
      const angle = b.angle + (target - b.angle) * 0.02 * growthSpeed

      const ex = px + Math.cos(angle) * b.length * 0.01
      const ey = py + Math.sin(angle) * b.length * 0.01

      // Draw branch segment (growing animation)
      const growPhase = Math.min(1, (t - b.phase * 2) * 0.01 * growthSpeed)
      const currentLen = b.length * growPhase * 0.01

      ctx.beginPath()
      ctx.moveTo(px * canvas.width, py * canvas.height)
      ctx.lineTo(
        (px + Math.cos(angle) * currentLen) * canvas.width,
        (py + Math.sin(angle) * currentLen) * canvas.height
      )
      ctx.strokeStyle = `oklch(${hL + sway * 10}% ${hC} ${hH + sway * 20})`
      ctx.lineWidth = b.thickness * (0.5 + growPhase * 0.5)
      ctx.lineCap = 'round'
      ctx.stroke()

      // Glow tip
      if (growPhase > 0.8 && b.children.length === 0) {
        ctx.beginPath()
        ctx.arc(ex * canvas.width, ey * canvas.height, b.thickness * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(${hL + 10}% ${hC} ${hH} / 0.3)`
        ctx.fill()
      }

      // Children
      for (const child of b.children) {
        const cx = px + Math.cos(angle) * currentLen
        const cy = py + Math.sin(angle) * currentLen
        drawBranch(child, cx, cy, t)
      }

      b.angle = angle // persist for next frame
    }

    if (prefersReduced) {
      // Static SVG-like silhouette
      canvas.width = 200
      canvas.height = 200
      ctx.strokeStyle = `oklch(${hL}% ${hC} ${hH} / 0.15)`
      ctx.lineCap = 'round'
      for (const b of branches) {
        drawBranch(b, b.x, b.y, 100)
      }
      return
    }

    const draw = () => {
      if (!isVisible.value) {
        frameId = requestAnimationFrame(draw)
        return
      }

      time += 1
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      for (const b of branches) {
        drawBranch(b, b.x, b.y, time)
      }

      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)

    cleanup(() => {
      cancelAnimationFrame(frameId)
      obs.disconnect()
      canvas.removeEventListener('pointermove', onMove)
    })
  })

  return (
    <canvas
      ref={canvasRef}
      class={['bio-organic-overlay absolute inset-0 w-full h-full pointer-events-none', classList]}
      style={{ opacity, zIndex: 1 }}
    />
  )
})
