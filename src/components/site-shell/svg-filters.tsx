import { component$ } from '@builder.io/qwik'

/**
 * SvgFilters - Centralized host for shared SVG filter definitions.
 * Provides #scratch, #noise, #torn-paper, and #pixel-noise filters.
 * Kept hidden from layout and screen readers.
 */
export const SvgFilters = component$(() => {
  return (
    <svg aria-hidden="true" class="svg-hidden" xmlns="http://www.w3.org/2000/svg">
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

        {/* 
          #torn-paper - Borda de papel rasgado (Sunset Saga)
          Usa feDisplacementMap + feTurbulence para criar borda irregular.
          Aplicar via filter: url(#torn-paper-filter) em elementos .torn-paper
        */}
        <filter id="torn-paper-filter" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04 0.15"
            numOctaves="4"
            stitchTiles="stitch"
            result="torn-noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="torn-noise"
            scale="8"
            yChannelSelector="G"
            result="torn"
          />
          <feDropShadow
            in="torn"
            dx="3"
            dy="3"
            stdDeviation="1"
            flood-color="oklch(0.15 0.02 310)"
            flood-opacity="0.4"
          />
        </filter>

        {/* 
          #pixel-noise - Pixel-perfect noise overlay (Sunset Pixel)
          Ruido de alta frequencia com nearest-neighbor para textura pixelada.
          Aplicar como overlay em backgrounds para atmosfera crepuscular.
        */}
        <filter id="pixel-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.5"
            numOctaves="2"
            stitchTiles="stitch"
            result="px-noise"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.82
                    0 0 0 0 0.72
                    0 0 0 0 0.58
                    0 0 0 0.04 0"
            result="px-colored"
          />
        </filter>

        {/* 
          #sunset-glow - Golden glow filter (Sunset Saga)
          Aplica brilho dourado difuso em elementos de destaque.
        */}
        <filter id="sunset-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.82
                    0 0 0 0 0.72
                    0 0 0 0 0.58
                    0 0 0 0.3 0"
            result="gold-blur"
          />
          <feComposite operator="over" in="SourceGraphic" in2="gold-blur" />
        </filter>
      </defs>
    </svg>
  )
})
