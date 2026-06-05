/**
 * upsilon-sigil.tsx — UniTeia brand mark (Υ)
 *
 * A distinctive geometric shape: the Greek letter upsilon rendered as
 * a three-branch fork with holographic animation. Used as:
 *   - Page loader / transition
 *   - Empty state placeholder
 *   - Brand watermark
 *   - Favicon alternative
 *
 * R26 P1 — "Derivative aesthetic needs signature visual"
 */

import { component$ } from '@builder.io/qwik'
import './upsilon-sigil.css'

export interface UpsilonSigilProps {
  size?: number
  animated?: boolean
  variant?: 'fork' | 'ring' | 'watermark'
  color?: string
  class?: string
}

export const UpsilonSigil = component$<UpsilonSigilProps>(
  ({ size = 48, animated = true, variant = 'fork', color, class: className }) => {
    const strokeColor = color ?? 'oklch(72% 0.165 80)'
    const glowColor = color ?? 'oklch(75% 0.18 200)'

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class={['upsilon-sigil', animated && 'upsilon-sigil--animated', className]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
        role="img"
        aria-label="UniTeia upsilon sigil"
      >
        {/* Outer glow ring (variant: ring or all) */}
        {(variant === 'ring' || variant === 'watermark') && (
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={glowColor}
            stroke-width="0.5"
            opacity="0.3"
            class={animated ? 'upsilon-ring' : ''}
          />
        )}

        {/* Υ fork — three branches converging at center */}
        <g class={animated ? 'upsilon-fork' : ''}>
          {/* Left branch */}
          <path
            d="M20 16 L32 36 L20 56"
            stroke={strokeColor}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"
          />
          {/* Right branch */}
          <path
            d="M44 16 L32 36 L44 56"
            stroke={strokeColor}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"
          />
          {/* Center stem */}
          <line
            x1="32"
            y1="36"
            x2="32"
            y2="56"
            stroke={strokeColor}
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.5"
          />
        </g>

        {/* Central node (variant: watermark omits this) */}
        {variant !== 'watermark' && (
          <circle cx="32" cy="36" r="3" fill={glowColor} class={animated ? 'upsilon-core' : ''} />
        )}

        {/* Subtle neon pulse ring around center */}
        {(variant === 'fork' || variant === 'ring') && (
          <circle
            cx="32"
            cy="36"
            r="8"
            stroke={glowColor}
            stroke-width="0.5"
            opacity="0"
            class={animated ? 'upsilon-pulse' : ''}
          />
        )}
      </svg>
    )
  }
)
