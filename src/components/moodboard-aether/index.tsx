import { component$ } from '@builder.io/qwik'
// biome-ignore lint/suspicious/noArrayIndexKey: static collage elements, order is always stable

/** A hand-drawn arrow connecting two nodes on the canvas */
export interface CollageArrow {
  /** SVG path data (e.g., "M 100 200 Q 150 150 250 100") */
  path: string
  /** Stroke color (OKLCH or hex). Default: indigo */
  color?: string
  /** Stroke width. Default: 2.5 */
  strokeWidth?: number
  /** Whether to animate the arrow drawing. Default: true */
  animated?: boolean
}

/** A sketchy annotation box with handwritten text */
export interface CollageNote {
  /** Horizontal position in pixels */
  x: number
  /** Vertical position in pixels */
  y: number
  /** Annotation text */
  text: string
  /** Width of the note box. Default: 140 */
  width?: number
  /** Height of the note box. Default: 55 */
  height?: number
  /** Rotation in degrees. Default: auto (-2 to +2) */
  rotation?: number
}

/** An abstract shape node (circle, diamond, hexagon) */
export interface CollageNode {
  /** Center X position */
  cx: number
  /** Center Y position */
  cy: number
  /** Radius or size. Default: 30 */
  r?: number
  /** Node label (short, 1-3 words) */
  label?: string
  /** Shape variant */
  shape?: 'circle' | 'diamond' | 'hexagon' | 'rounded-rect'
  /** Fill color */
  fill?: string
  /** Whether to apply wobble filter. Default: true */
  wobble?: boolean
}

export interface AetherHanddrawCollageProps {
  /** Accessibility title */
  title: string
  /** Hand-drawn arrows connecting nodes */
  arrows?: CollageArrow[]
  /** Annotation notes */
  notes?: CollageNote[]
  /** Abstract shape nodes */
  nodes?: CollageNode[]
  /** Custom class for the container */
  class?: string
  /** Canvas width. Default: 800 */
  width?: number
  /** Canvas height. Default: 600 */
  height?: number
  /** Background tone. Default: 'obsidian' */
  tone?: 'obsidian' | 'parchment' | 'transparent'
}

/**
 * AetherHanddrawCollage — Pure hand-drawn editorial collage
 *
 * Renders abstract knowledge visualizations using:
 * - Hand-drawn arrows (curved bezier paths with wobble)
 * - Sketchy annotation boxes (hachure-style rectangles)
 * - Abstract shape nodes (circles, diamonds, hexagons)
 * - feTurbulence grain overlay
 * - Aether OS OKLCH palette (Indigo, Amber, Teal, Parchment, Obsidian)
 *
 * Zero raster images. Zero polaroid frames. Pure vector hand-drawn aesthetic.
 *
 * @see ADR-014 Visual Asset Forge
 */
export const AetherHanddrawCollage = component$<AetherHanddrawCollageProps>(
  ({
    title,
    arrows = [],
    notes = [],
    nodes = [],
    class: classList,
    width = 800,
    height = 600,
    tone = 'obsidian',
  }) => {
    const bgColors: Record<string, string> = {
      obsidian: 'oklch(0.18 0.02 280)',
      parchment: 'oklch(0.95 0.01 80)',
      transparent: 'transparent',
    }

    return (
      <div
        class={[
          'aether-collage relative overflow-hidden rounded-2xl',
          tone === 'obsidian' && 'border border-white/5',
          classList,
        ]}
        style={{ aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label={title}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          class="absolute inset-0 w-full h-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grain texture — paper-like noise */}
            <filter id="collage-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.06" />
              </feComponentTransfer>
            </filter>

            {/* Wobble — hand-drawn stroke irregularity */}
            <filter id="collage-wobble">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>

            {/* Arrowhead marker */}
            <marker
              id="collage-arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="oklch(0.55 0.15 270)" />
            </marker>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width={width} height={height} fill={bgColors[tone]} />

          {/* Abstract nodes */}
          {nodes.map((node, i) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: static collage nodes, order is stable
            const r = node.r ?? 30
            const fill = node.fill ?? 'oklch(0.35 0.12 280)'
            const wobble = node.wobble !== false

            const shapeEl = (() => {
              switch (node.shape ?? 'circle') {
                case 'diamond':
                  return (
                    <polygon
                      points={`${node.cx},${node.cy - r} ${node.cx + r},${node.cy} ${node.cx},${node.cy + r} ${node.cx - r},${node.cy}`}
                      fill={fill}
                      opacity="0.12"
                      stroke="oklch(0.55 0.15 270)"
                      stroke-width="1.5"
                      filter={wobble ? 'url(#collage-wobble)' : undefined}
                    />
                  )
                case 'hexagon': {
                  const pts: string[] = []
                  for (let a = 0; a < 6; a++) {
                    const angle = (Math.PI / 3) * a - Math.PI / 6
                    pts.push(
                      `${(node.cx + r * Math.cos(angle)).toFixed(0)},${(node.cy + r * Math.sin(angle)).toFixed(0)}`
                    )
                  }
                  return (
                    <polygon
                      points={pts.join(' ')}
                      fill={fill}
                      opacity="0.12"
                      stroke="oklch(0.55 0.15 270)"
                      stroke-width="1.5"
                      filter={wobble ? 'url(#collage-wobble)' : undefined}
                    />
                  )
                }
                case 'rounded-rect':
                  return (
                    <rect
                      x={node.cx - r}
                      y={node.cy - r * 0.6}
                      width={r * 2}
                      height={r * 1.2}
                      rx="8"
                      fill={fill}
                      opacity="0.12"
                      stroke="oklch(0.55 0.15 270)"
                      stroke-width="1.5"
                      filter={wobble ? 'url(#collage-wobble)' : undefined}
                    />
                  )
                default: // circle
                  return (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={r}
                      fill={fill}
                      opacity="0.12"
                      stroke="oklch(0.55 0.15 270)"
                      stroke-width="1.5"
                      filter={wobble ? 'url(#collage-wobble)' : undefined}
                    />
                  )
              }
            })()

            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static collage nodes, order is stable
              <g key={`node-${i}`}>
                {shapeEl}
                {node.label && (
                  <text
                    x={node.cx}
                    y={node.cy + r + 18}
                    text-anchor="middle"
                    font-family="system-ui, sans-serif"
                    font-size="11"
                    font-weight="500"
                    fill={tone === 'parchment' ? 'oklch(0.35 0.12 280)' : 'oklch(0.85 0.01 80)'}
                    opacity="0.7"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Hand-drawn arrows */}
          {arrows.map((arrow, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static collage arrows, order is stable
            <path
              key={`arrow-${i}`}
              d={arrow.path}
              fill="none"
              stroke={arrow.color ?? 'oklch(0.55 0.15 270)'}
              stroke-width={arrow.strokeWidth ?? 2.5}
              stroke-linecap="round"
              stroke-linejoin="round"
              marker-end="url(#collage-arrowhead)"
              filter="url(#collage-wobble)"
              class={arrow.animated !== false ? 'collage-arrow' : ''}
              style={{
                strokeDasharray: arrow.animated !== false ? '8 3' : undefined,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}

          {/* Annotation notes */}
          {notes.map((note, i) => {
            const w = note.width ?? 140
            const h = note.height ?? 55
            const rot = note.rotation ?? (i % 3) - 1
            // biome-ignore lint/suspicious/noArrayIndexKey: static collage notes, order is stable
            return (
              <g key={`note-${i}`} transform={`translate(${note.x}, ${note.y}) rotate(${rot})`}>
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  rx="6"
                  fill="oklch(0.95 0.01 80 / 0.15)"
                  stroke="oklch(0.55 0.15 270)"
                  stroke-width="1.5"
                  filter="url(#collage-wobble)"
                />
                <text
                  x={w / 2}
                  y={h / 2 + 4}
                  text-anchor="middle"
                  font-family="Georgia, serif"
                  font-size="12"
                  font-style="italic"
                  fill={tone === 'parchment' ? 'oklch(0.35 0.12 280)' : 'oklch(0.85 0.01 80)'}
                >
                  {note.text}
                </text>
              </g>
            )
          })}

          {/* Grain overlay — top layer over everything */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="transparent"
            filter="url(#collage-grain)"
            opacity="0.30"
            style={{ pointerEvents: 'none', mixBlendMode: 'multiply' as const }}
          />
        </svg>
      </div>
    )
  }
)
