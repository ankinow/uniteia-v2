/**
 * VisualDNAIntegrator v2026.05 — JIT Skill Mutant
 *
 * Composable wrapper that applies the full Editorial Collage + Signal Grid V3 +
 * 2.5D Neo-Realistic visual DNA treatment in a single component.
 *
 * Variants:
 *   - cinematic-2-5d: Full 2.5D perspective + grain-4k + glassmorphism-2 depth stack
 *   - editorial-collage: Tactile grain + paper fiber with signal grid backdrop
 *   - signal-minimal: Subtle grain only — minimal visual overhead for dense signal pages
 *
 * Architecture: Wraps children in perspective container → shadow plane →
 *               glass card → grain overlay → content slot.
 */
import { Slot, component$ } from '@builder.io/qwik'

export type VisualDNAVariant = 'cinematic-2-5d' | 'editorial-collage' | 'signal-minimal'

export interface VisualDNAIntegratorProps {
  variant?: VisualDNAVariant
  class?: string
}

const VARIANT_LAYERS: Record<
  VisualDNAVariant,
  {
    perspective: string
    shadowZ: string
    contentZ: string
    grainOpacity: string
    backdropBlur: string
    glassBorder: string
  }
> = {
  'cinematic-2-5d': {
    perspective: 'perspective-dramatic',
    shadowZ: 'translateZ(-10px) scale(0.96)',
    contentZ: 'translateZ(var(--depth-2-5d))',
    grainOpacity: '0.05',
    backdropBlur: 'backdrop-blur-glass',
    glassBorder: 'border border-white/[0.08]',
  },
  'editorial-collage': {
    perspective: 'perspective-2d5',
    shadowZ: 'translateZ(-6px) scale(0.97)',
    contentZ: 'translateZ(8px)',
    grainOpacity: '0.04',
    backdropBlur: 'backdrop-blur-glass-sm',
    glassBorder: 'border border-bone/[0.06]',
  },
  'signal-minimal': {
    perspective: '',
    shadowZ: 'translateZ(0)',
    contentZ: 'translateZ(0)',
    grainOpacity: '0.02',
    backdropBlur: '',
    glassBorder: '',
  },
}

/**
 * VisualDNAIntegrator — applies the complete Visual DNA treatment stack.
 *
 * Layers (front-to-back):
 *   4. Grain-4k texture overlay (pointer-events: none)
 *   3. Glassmorphism-2 content card
 *   2. Content via <Slot />
 *   1. Shadow plane (back)
 *
 * Zero runtime overhead — all effects are CSS-only, compositor-friendly.
 */
export const VisualDNAIntegrator = component$<VisualDNAIntegratorProps>(
  ({ variant = 'cinematic-2-5d', class: className }) => {
    const layers = VARIANT_LAYERS[variant]

    return (
      <div
        class={[layers.perspective, 'relative', className]}
        style={{ perspectiveOrigin: 'center center' }}
      >
        {/* Layer 1 — Shadow accent plane */}
        {variant !== 'signal-minimal' && (
          <div
            class="absolute inset-0 rounded-lg"
            style={{
              transform: layers.shadowZ,
              boxShadow: '0 12px 32px rgb(0 0 0 / 0.24)',
              opacity: 0.85,
            }}
            aria-hidden="true"
          />
        )}

        {/* Layer 2+3+4 — Content card + glass + grain */}
        <div
          class={[
            'glassmorphism-2 depth-surface relative preserve-3d rounded-lg',
            layers.backdropBlur,
            layers.glassBorder,
          ]}
          style={{
            transform: layers.contentZ,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Layer 4 — Grain overlay */}
          <div
            class="grain-4k absolute inset-0 pointer-events-none z-0 rounded-lg"
            style={{ opacity: layers.grainOpacity }}
            aria-hidden="true"
          />

          {/* Content */}
          <div class="relative z-[1]">
            <Slot />
          </div>
        </div>
      </div>
    )
  }
)
