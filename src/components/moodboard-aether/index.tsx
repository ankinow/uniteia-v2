import { component$ } from '@builder.io/qwik'

/** A single polaroid-style frame with optional caption */
export interface PolaroidFrame {
  /** Image URL or SVG inline data */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Optional handwritten caption below the photo */
  caption?: string
  /** Rotation in degrees (-15 to +15) */
  rotation: number
  /** Horizontal position as percentage (0-100) */
  x: number
  /** Vertical position as percentage (0-100) */
  y: number
}

/** A hand-drawn arrow connecting two points on the canvas */
export interface MoodboardArrow {
  /** SVG path data (e.g., "M 100 200 Q 150 150 250 100") */
  path: string
  /** Stroke color (OKLCH or hex) */
  color: string
  /** Stroke width (default: 2.5) */
  strokeWidth?: number
}

/** A sketchy annotation box with text */
export interface MoodboardNote {
  /** Horizontal position in pixels */
  x: number
  /** Vertical position in pixels */
  y: number
  /** Annotation text */
  text: string
  /** Width of the note box (default: 140) */
  width?: number
  /** Height of the note box (default: 60) */
  height?: number
}

export interface MoodboardAetherProps {
  /** Accessibility title */
  title: string
  /** Polaroid photo frames to display */
  frames?: PolaroidFrame[]
  /** Hand-drawn arrow paths */
  arrows?: MoodboardArrow[]
  /** Annotation notes */
  notes?: MoodboardNote[]
  /** Custom class for the container */
  class?: string
  /** Canvas width (default: 800) */
  width?: number
  /** Canvas height (default: 600) */
  height?: number
}

/**
 * MoodboardAether — Aether OS Hand-Drawn Moodboard Collage
 *
 * Renders an editorial moodboard in the Aether hand-drawn style:
 * polaroid-style photo frames with rotation, curved hand-drawn arrows,
 * sketchy annotation boxes, and a grain/parchment texture overlay.
 *
 * Inspired by the Magica page aesthetic on uniteia.com.
 * Part of the Zero Image Models pipeline — all visuals are SVG + CSS.
 *
 * @see ADR-014 Visual Asset Forge (mega-factory)
 */
export const MoodboardAether = component$<MoodboardAetherProps>(
  ({
    title,
    frames = [],
    arrows = [],
    notes = [],
    class: classList,
    width = 800,
    height = 600,
  }) => {
    return (
      <div
        class={[
          'moodboard-aether relative overflow-hidden rounded-2xl',
          'bg-[oklch(0.18_0.02_280)] border border-white/5',
          classList,
        ]}
        style={{ aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label={title}
      >
        {/* SVG Layer: arrows, notes, grain filters */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          class="absolute inset-0 w-full h-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grain texture filter */}
            <filter id="moodboard-grain">
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

            {/* Wobble filter for hand-drawn stroke feel */}
            <filter id="moodboard-wobble">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03"
                numOctaves="3"
              />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>

            {/* Arrow marker definition */}
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 Z"
                fill="oklch(0.35 0.12 280)"
              />
            </marker>
          </defs>

          {/* Parchment background with grain */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="oklch(0.22 0.02 280)"
            filter="url(#moodboard-grain)"
          />

          {/* Hand-drawn arrows */}
          {arrows.map((arrow, i) => (
            <path
              key={`arrow-${i}`}
              d={arrow.path}
              fill="none"
              stroke={arrow.color}
              stroke-width={arrow.strokeWidth ?? 2.5}
              stroke-linecap="round"
              stroke-linejoin="round"
              marker-end="url(#arrowhead)"
              filter="url(#moodboard-wobble)"
              class="moodboard-arrow"
              style={{ strokeDasharray: '8 3', animationDelay: `${i * 0.15}s` }}
            />
          ))}

          {/* Annotation notes */}
          {notes.map((note, i) => {
            const w = note.width ?? 140
            const h = note.height ?? 60
            return (
              <g
                key={`note-${i}`}
                transform={`translate(${note.x}, ${note.y}) rotate(${(i % 3) - 1})`}
              >
                <rect
                  x="0"
                  y="0"
                  width={w}
                  height={h}
                  rx="6"
                  fill="oklch(0.95 0.01 80 / 0.25)"
                  stroke="oklch(0.55 0.15 270)"
                  stroke-width="1.5"
                  filter="url(#moodboard-wobble)"
                />
                <text
                  x={w / 2}
                  y={h / 2 + 4}
                  text-anchor="middle"
                  fill="oklch(0.85 0.01 80)"
                  font-size="13"
                  font-family="Caveat, cursive"
                  font-style="italic"
                >
                  {note.text}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Polaroid frames (CSS layer — positioned absolutely) */}
        {frames.map((frame, i) => (
          <div
            key={`frame-${i}`}
            class="polaroid-frame"
            style={{
              position: 'absolute',
              left: `${frame.x}%`,
              top: `${frame.y}%`,
              transform: `rotate(${frame.rotation}deg)`,
              width: '22%',
              maxWidth: '180px',
              zIndex: 10 + i,
            }}
          >
            <div class="polaroid-inner">
              <img
                src={frame.src}
                alt={frame.alt}
                class="polaroid-image"
                loading="lazy"
                width="160"
                height="120"
              />
            </div>
            {frame.caption && (
              <span class="polaroid-caption">{frame.caption}</span>
            )}
          </div>
        ))}

        {/* Grain overlay (CSS layer, over everything) */}
        <div
          class="grain-4k absolute inset-0 pointer-events-none opacity-30 z-50"
          aria-hidden="true"
        />
      </div>
    )
  }
)
