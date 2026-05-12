import { type ClassList, component$ } from '@builder.io/qwik'

export interface HanddrawArrowProps {
  direction?: 'left' | 'right' | 'up' | 'down'
  class?: ClassList
}

const directions: Record<string, string> = {
  right: '0',
  down: '90',
  left: '180',
  up: '270',
}

/**
 * HanddrawArrow — SVG arrow with hand-drawn bezier paths and draw-in animation.
 * Uses stroke-dasharray + stroke-dashoffset animation (2s).
 * Respects prefers-reduced-motion.
 */
export const HanddrawArrow = component$<HanddrawArrowProps>(
  ({ direction = 'right', class: classList }) => {
    return (
      <svg
        data-testid="handdraw-arrow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 80"
        class={[classList]}
        role="img"
        aria-hidden="true"
        style={{
          transform: `rotate(${directions[direction]}deg)`,
          '--draw-duration': '2s',
        }}
      >
        <title>{`Hand-drawn arrow pointing ${direction}`}</title>
        <g
          fill="none"
          stroke="var(--cyan)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {/* Shaft — organic bezier wobble */}
          <path
            d="M 15,42 C 28,38 38,44 50,42 S 65,39 76,41"
            stroke-dasharray="75"
            stroke-dashoffset="75"
            style={{ '--offset': '75' } as Record<string, string>}
            class="handdraw-arrow-path"
          />
          {/* Upper wing of arrowhead */}
          <path
            d="M 76,41 C 80,36 84,28 91,18"
            stroke-dasharray="35"
            stroke-dashoffset="35"
            style={{ '--offset': '35' } as Record<string, string>}
            class="handdraw-arrow-path"
          />
          {/* Lower wing of arrowhead */}
          <path
            d="M 76,41 C 80,47 85,53 91,63"
            stroke-dasharray="35"
            stroke-dashoffset="35"
            style={{ '--offset': '35' } as Record<string, string>}
            class="handdraw-arrow-path"
          />
          {/* Feather notch on shaft */}
          <path
            d="M 28,28 C 33,27 38,27 40,53 C 37,53 34,53 28,51"
            stroke-dasharray="35"
            stroke-dashoffset="35"
            style={{ '--offset': '35' } as Record<string, string>}
            class="handdraw-arrow-path"
          />
        </g>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .handdraw-arrow-path {
              animation: ha-draw var(--draw-duration, 2s) ease-out forwards;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .handdraw-arrow-path {
              stroke-dashoffset: 0 !important;
            }
          }
          @keyframes ha-draw {
            from { stroke-dashoffset: var(--offset); }
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </svg>
    )
  }
)
