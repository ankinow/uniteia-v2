import { type ClassList, component$ } from '@builder.io/qwik'

export interface HanddrawCircleProps {
  class?: ClassList
}

/**
 * HanddrawCircle — SVG circle with hand-drawn bezier path and draw-in animation.
 * Uses stroke-dasharray + stroke-dashoffset animation (1.5s).
 * Respects prefers-reduced-motion.
 *
 * The circle is approximated with 4 cubic bezier curves with slightly
 * offset control points for a natural hand-drawn appearance.
 */
export const HanddrawCircle = component$<HanddrawCircleProps>(({ class: classList }) => {
  return (
    <svg
      data-testid="handdraw-circle"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      class={[classList]}
      role="img"
      aria-hidden="true"
      style={{
        '--draw-duration': '1.5s',
      }}
    >
      <title>Hand-drawn circle</title>
      <path
        d="M 50,5 C 76,6 95,24 94,50 C 95,77 73,95 50,94 C 27,96 5,76 6,50 C 4,24 24,6 50,5 Z"
        fill="none"
        stroke="var(--cyan)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="282"
        stroke-dashoffset="282"
        style={{ '--offset': '282' } as Record<string, string>}
        class="handdraw-circle-path"
      />
      <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .handdraw-circle-path {
              animation: hc-draw var(--draw-duration, 1.5s) ease-out forwards;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .handdraw-circle-path {
              stroke-dashoffset: 0 !important;
            }
          }
          @keyframes hc-draw {
            from { stroke-dashoffset: var(--offset); }
            to { stroke-dashoffset: 0; }
          }
        `}</style>
    </svg>
  )
})
