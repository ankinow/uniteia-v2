import { type ClassList, component$ } from '@builder.io/qwik'

export interface UpsilonSigilProps {
  size?: number
  class?: ClassList
}

/**
 * UpsilonSigil — inline SVG brand sigil for UniTeia.
 * Greek capital Upsilon (Υ) centered in a dashed circle,
 * typeset in JetBrains Mono at currentColor.
 * 0 KB marginal cost (no external assets).
 */
export const UpsilonSigil = component$<UpsilonSigilProps>(({ size = 48, class: className }) => {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.44
  const fontSize = size * 0.52

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="UniTeia"
      class={className}
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="currentColor"
        stroke-width={Math.max(1.5, size * 0.04)}
        stroke-dasharray={`${size * 0.1} ${size * 0.07}`}
        fill="none"
      />
      <text
        x={cx}
        y={cy}
        text-anchor="middle"
        dominant-baseline="central"
        font-family="'JetBrains Mono', monospace"
        font-size={fontSize}
        font-weight="700"
        fill="currentColor"
      >
        {'\u03A5'}
      </text>
    </svg>
  )
})
