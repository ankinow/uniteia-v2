import { component$ } from '@builder.io/qwik'

/**
 * SvgFilters - Centralized host for shared SVG filter definitions.
 * Provides #scratch and #noise filters for use across the application.
 * Kept hidden from layout and screen readers.
 */
export const SvgFilters = component$(() => {
  return (
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute h-0 w-0"
      style={{ visibility: 'hidden' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 
          #scratch - Horizontal scratch texture 
          Used for dividers and editorial callouts to add "flesh" to the brutalist layout.
        */}
        <filter id="scratch" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.65 0.05"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.4 0"
            result="scratched"
          />
          <feComposite operator="in" in="SourceGraphic" in2="scratched" />
        </filter>

        {/* 
          #noise - Subtle grain texture
          Used as a global or localized overlay to soften the high-contrast void surfaces.
        */}
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.07 0"
          />
        </filter>
      </defs>
    </svg>
  )
})
