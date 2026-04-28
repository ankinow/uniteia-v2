import { component$ } from '@builder.io/qwik'
import type { AdaptiveHeaderProps, AdaptiveHeaderScale } from './types'

/**
 * Typography breakpoint scale
 * - small (default): 28px / 36px
 * - medium (md:): 36px / 44px
 * - large (lg:): 48px / 60px
 */
export const ADAPTIVE_HEADER_SCALE: AdaptiveHeaderScale = {
  small: { fontSize: '1.75rem', lineHeight: '2.25rem' }, // 28px / 36px
  medium: { fontSize: '2.25rem', lineHeight: '2.75rem' }, // 36px / 44px
  large: { fontSize: '3rem', lineHeight: '3.75rem' }, // 48px / 60px
}

/**
 * AdaptiveHeader - Viewport-aware heading component
 *
 * Renders title + optional subtitle with responsive typography
 * using Tailwind responsive classes:
 * - default (small): text-2xl (28px) / leading-9 (36px)
 * - md (medium): text-4xl (36px) / leading-11 (44px)
 * - lg (large): text-5xl (48px) / leading-tight (60px)
 *
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const AdaptiveHeader = component$<AdaptiveHeaderProps>(props => {
  return (
    <section data-testid="adaptive-header" class={['adaptive-header', props.class]}>
      <h1
        class={[
          'text-2xl leading-9',
          'md:text-4xl md:leading-11',
          'lg:text-5xl lg:leading-tight',
          'font-semibold text-bone',
        ]}
      >
        {props.title}
      </h1>
      {props.subtitle && (
        <p class="mt-2 text-base leading-relaxed text-bone-muted md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed">
          {props.subtitle}
        </p>
      )}
    </section>
  )
})

export type { AdaptiveHeaderProps, AdaptiveHeaderScale } from './types'
