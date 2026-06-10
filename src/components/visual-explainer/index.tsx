/**
 * index.tsx — VisualExplainer Qwik component
 *
 * Live-drawn North Star architecture diagram on the homepage.
 *
 * Architecture:
 *   1. Static SVG pyramid — SSG/SSR render (no JS required for initial view)
 *   2. Canvas 2D overlay — perfect-freehand stroke animation on scroll
 *   3. IntersectionObserver — auto-play when visible
 *   4. Click-to-expand — each layer reveals agent cards and details
 *   5. Aether aesthetic — OKLCH colors, grain overlay, dark surface
 *
 * Bundle: perfect-freehand (2KB) + ~6KB component = ~8KB total
 *
 * Usage:
 *   <VisualExplainer />
 */

import { $, component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { NORTH_STAR_DATA } from './north-star-data'
import type { LayerData } from './types'

/** Helpers for deterministic positioning (SSG-safe, no Math.random) */
function idHash(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/** Static SVG path for the pyramid outline — precomputed, deterministic */
function pyramidPath(w: number, h: number): string {
  const mx = w / 2
  const topY = 60
  const botY = h - 40
  const halfW = w / 2 - 40
  return `M${mx},${topY} L${mx - halfW},${botY} L${mx + halfW},${botY} Z`
}

/** Layer divider lines — horizontal cuts at each level */
function levelLineY(h: number, level: number): number {
  const topY = 60
  const botY = h - 40
  return topY + (1 - level) * (botY - topY)
}

// ═══════════════════════════════════════════════════
// SVG-only static fallback renderer
// Used during SSG/SSR — no JS, no Canvas.
// ═══════════════════════════════════════════════════

const SVG_W = 600
const SVG_H = 480

function StaticPyramidFallback() {
  const { layers, agents, theme } = NORTH_STAR_DATA
  const mx = SVG_W / 2
  const _topY = 60
  const botY = SVG_H - 40
  const halfW = SVG_W / 2 - 40

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      class="w-full max-w-2xl mx-auto"
      aria-label="UniTeia North Star Architecture — 6 layers pyramid"
      role="img"
    >
      {/* Pyramid outline */}
      <path
        d={pyramidPath(SVG_W, SVG_H)}
        fill="none"
        stroke={theme.stroke}
        stroke-width="1.5"
        opacity={0.4}
      />

      {/* Layer dividers + labels */}
      {layers.map(layer => {
        const yy = levelLineY(SVG_H, layer.level)
        const t = layer.level
        const lineHalfW = halfW * t
        const lx = mx - lineHalfW + 16
        const rx = mx + lineHalfW - 16

        return (
          <g key={layer.id} class="visual-explainer-layer" data-layer={layer.id}>
            {/* Horizontal divider */}
            <line
              x1={lx}
              y1={yy}
              x2={rx}
              y2={yy}
              stroke={layer.color}
              stroke-width="1"
              opacity={0.3}
            />
            {/* Layer label */}
            <text
              x={mx}
              y={yy - 10}
              text-anchor="middle"
              fill={layer.color}
              font-size="13"
              font-family="sans-serif"
              opacity={0.9}
            >
              {layer.icon} {layer.label}
            </text>
            {/* Description on hover */}
            <title>{layer.description}</title>
          </g>
        )
      })}

      {/* Agent labels below pyramid */}
      {agents.map((agent, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const ax = 80 + col * 200
        const ay = botY + 50 + row * 40
        return (
          <g key={agent.id}>
            <text
              x={ax}
              y={ay}
              text-anchor="middle"
              fill={agent.color}
              font-size="12"
              font-family="sans-serif"
              opacity={0.8}
            >
              {agent.icon} {agent.label}
            </text>
          </g>
        )
      })}

      {/* Title */}
      <text
        x={mx}
        y={30}
        text-anchor="middle"
        fill={theme.text}
        font-size="18"
        font-family="sans-serif"
        font-weight="700"
        opacity={0.9}
      >
        UniTeia North Star
      </text>
      <text
        x={mx}
        y={46}
        text-anchor="middle"
        fill={theme.text}
        font-size="11"
        font-family="sans-serif"
        opacity={0.5}
      >
        6 layers · 6 agents · live-drawn architecture
      </text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════
// SVG path generation for stroke animation
// ═══════════════════════════════════════════════════

interface StrokeSegment {
  path: string
  color: string
  duration: number // ms
}

function generateStrokeSegments(w: number, h: number): StrokeSegment[] {
  const { layers, theme } = NORTH_STAR_DATA
  const segments: StrokeSegment[] = []
  const mx = w / 2
  const topY = 60
  const botY = h - 40
  const halfW = w / 2 - 40

  // 1. Pyramid outline (slow, dramatic)
  const p1 = mx - halfW
  const p2 = botY
  const p3 = mx + halfW

  segments.push({
    path: `M ${mx},${topY} L ${p1},${p2} L ${p3},${p2} Z`,
    color: theme.stroke,
    duration: 1200,
  })

  // 2. Layer dividers + labels (one per layer)
  for (const layer of layers) {
    const yy = levelLineY(h, layer.level)
    const t = layer.level
    const lineHalfW = halfW * t
    const lx = mx - lineHalfW + 16
    const rx = mx + lineHalfW - 16

    segments.push({
      path: `M ${lx},${yy} L ${rx},${yy}`,
      color: layer.color,
      duration: 400,
    })
  }

  return segments
}

// ═══════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════

export interface VisualExplainerProps {
  /** Width in px for canvas (default: 600) */
  width?: number
  /** Height in px for canvas (default: 480) */
  height?: number
  /** CSS class to apply */
  class?: string
}

export const VisualExplainer = component$<VisualExplainerProps>(props => {
  const { width = 600, height = 480 } = props
  const canvasRef = useSignal<HTMLCanvasElement>()
  const containerRef = useSignal<HTMLDivElement>()
  const isVisible = useSignal(false)
  const animationComplete = useSignal(false)
  const selectedLayer = useSignal<string | null>(null)

  // Expanded layer details
  const expandedLayer = useStore<{
    data: LayerData | null
    visible: boolean
  }>({ data: null, visible: false })

  // Handle layer click on mobile / desktop
  const handleLayerClick = $((layer: LayerData) => {
    if (expandedLayer.data?.id === layer.id) {
      expandedLayer.visible = !expandedLayer.visible
    } else {
      expandedLayer.data = layer
      expandedLayer.visible = true
    }
    selectedLayer.value = layer.id
  })

  const closeExpanded = $(() => {
    expandedLayer.visible = false
    expandedLayer.data = null
    selectedLayer.value = null
  })

  // ▶ Animation on scroll
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const container = containerRef.value
    const canvas = canvasRef.value
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas to container
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.scale(dpr, dpr)

    const cw = rect.width
    const ch = rect.height

    // Generate segments
    const segments = generateStrokeSegments(cw, ch)

    // IntersectionObserver for auto-play
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && !animationComplete.value) {
            isVisible.value = true
            startAnimation(ctx, cw, ch, segments)
          }
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(container)

    // Handle resize
    const onResize = () => {
      const r = container.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.scale(dpr, dpr)
      // Re-draw if complete
      if (animationComplete.value) {
        drawComplete(ctx, r.width, r.height, segments)
      }
    }

    window.addEventListener('resize', onResize)

    cleanup(() => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    })
  })

  return (
    <div
      ref={containerRef}
      class={[
        'visual-explainer relative w-full overflow-hidden rounded-xl',
        'bg-[oklch(10%_0.02_270)] border border-white/5',
        props.class,
      ].join(' ')}
      role="region"
      aria-label="UniTeia North Star Architecture Diagram"
    >
      {/* Static SVG fallback — always present, shows during SSR/SSG */}
      <div class="static-fallback">
        <StaticPyramidFallback />
      </div>

      {/* Canvas overlay — animated stroke on top of static SVG */}
      <canvas ref={canvasRef} class="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Layer click areas — transparent overlays for interaction */}
      <div class="absolute inset-0 pointer-events-none">
        {NORTH_STAR_DATA.layers.map(layer => {
          const yy = levelLineY(height, layer.level)
          const t = layer.level
          const halfW = (width / 2 - 40) * t
          const _mx = width / 2

          return (
            <button
              key={layer.id}
              class={[
                'absolute left-1/2 -translate-x-1/2 pointer-events-auto',
                'cursor-pointer transition-[color,transform] duration-200',
                'rounded-lg text-center',
                selectedLayer.value === layer.id ? 'ring-1 ring-inset z-10' : 'hover:bg-white/5',
              ].join(' ')}
              style={{
                top: `${yy - 18}px`,
                width: `${halfW * 2 - 32}px`,
                height: '36px',
                transform: 'translateX(-50%)',
              }}
              onClick$={() => handleLayerClick(layer)}
              aria-label={`${layer.icon} ${layer.label}: ${layer.description}. Click to expand.`}
            >
              <span class="text-xs opacity-0 group-hover:opacity-100">{layer.icon}</span>
            </button>
          )
        })}
      </div>

      {/* Expanded layer detail panel */}
      {expandedLayer.visible && expandedLayer.data && (
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-[oklch(12%_0.02_270)] border-t border-white/10 backdrop-blur-md z-20">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">{expandedLayer.data.icon}</span>
                <h4 class="text-sm font-semibold" style={{ color: expandedLayer.data.color }}>
                  {expandedLayer.data.label}
                </h4>
                <span class="text-[10px] text-bone/40 font-mono uppercase tracking-wider">
                  {expandedLayer.data.id}
                </span>
              </div>
              <p class="text-xs text-bone/80 leading-relaxed max-w-prose">
                {expandedLayer.data.description}
              </p>
              {expandedLayer.data.details && (
                <p class="text-[11px] text-bone/40 mt-1 font-mono">{expandedLayer.data.details}</p>
              )}
              {/* Agents working at this layer */}
              {expandedLayer.data.agents.length > 0 && (
                <div class="flex flex-wrap gap-2 mt-2">
                  {expandedLayer.data.agents.map(agentId => {
                    const agent = NORTH_STAR_DATA.agents.find(a => a.id === agentId)
                    if (!agent) return null
                    return (
                      <span
                        key={agent.id}
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{
                          backgroundColor: `${agent.color}15`,
                          color: agent.color,
                          border: `1px solid ${agent.color}30`,
                        }}
                      >
                        {agent.icon} {agent.label}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
            <button
              onClick$={closeExpanded}
              class="text-bone/40 hover:text-bone/80 transition-colors text-sm p-1 ml-2"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Scroll hint */}
      {!animationComplete.value && (
        <div class="absolute bottom-3 right-3 text-[10px] text-bone/20 animate-pulse-slow">
          Scroll to animate ▸
        </div>
      )}
    </div>
  )
})

// ═══════════════════════════════════════════════════
// Canvas animation engine
// ═══════════════════════════════════════════════════

function drawComplete(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  segments: StrokeSegment[]
) {
  ctx.clearRect(0, 0, w, h)

  for (const seg of segments) {
    ctx.strokeStyle = seg.color
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.6
    const path = new Path2D(seg.path)
    ctx.stroke(path)
  }
  ctx.globalAlpha = 1
}

function startAnimation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  segments: StrokeSegment[]
) {
  let currentSeg = 0
  const _progress = 0
  let startTime = 0
  let _animId = 0

  function frame(timestamp: number) {
    if (!startTime) startTime = timestamp

    if (currentSeg >= segments.length) {
      drawComplete(ctx, w, h, segments)
      return
    }

    const seg = segments[currentSeg]!
    const elapsed = timestamp - startTime
    const easeT = Math.min(elapsed / seg.duration, 1)

    // Ease-out cubic
    const t = 1 - (1 - easeT) ** 3

    ctx.clearRect(0, 0, w, h)

    // Draw completed segments fully
    for (let i = 0; i < currentSeg; i++) {
      const doneSeg = segments[i]!
      ctx.strokeStyle = doneSeg.color
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.6
      const path = new Path2D(doneSeg.path)
      ctx.stroke(path)
    }

    // Draw current segment with stroke-dasharray animation
    ctx.strokeStyle = seg.color
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.6 + 0.4 * (1 - t) // fade in

    // Use dash for draw-in effect
    const totalLength = estimatePathLength(seg.path)
    const drawn = totalLength * t

    ctx.setLineDash([drawn, totalLength - drawn + 1])
    ctx.lineDashOffset = 0

    const segPath = new Path2D(seg.path)
    ctx.stroke(segPath)

    ctx.setLineDash([])
    ctx.globalAlpha = 1

    if (easeT >= 1) {
      currentSeg++
      startTime = timestamp
    }

    _animId = requestAnimationFrame(frame)
  }

  _animId = requestAnimationFrame(frame)
}

/** Rough estimate of path length for dash animation */
function estimatePathLength(pathStr: string): number {
  // Parse M and L commands to compute approximate length
  const re = /[ML]\s*([\d.+-]+)[,\s]+([\d.+-]+)/g
  let match
  let prevX = 0
  let prevY = 0
  let first = true
  let len = 0

  while ((match = re.exec(pathStr)) !== null) {
    const x = Number.parseFloat(match[1] ?? '0')
    const y = Number.parseFloat(match[2] ?? '0')
    if (!first) {
      len += Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2)
    }
    prevX = x
    prevY = y
    first = false
  }

  return Math.max(len, 100) // minimum 100px
}
