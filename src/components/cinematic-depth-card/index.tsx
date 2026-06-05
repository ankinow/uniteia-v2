import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export type CinematicDepthCardVariant = 'logic' | 'insight' | 'flow'

export interface CinematicDepthCardProps {
  variant?: CinematicDepthCardVariant
  glowOnFocus?: boolean
  elevated?: boolean
  class?: string
}

export const ALL_VARIANTS: CinematicDepthCardVariant[] = ['logic', 'insight', 'flow']

export const CinematicDepthCard = component$<CinematicDepthCardProps>(
  ({ variant = 'flow', glowOnFocus = false, elevated = false, class: className }) => {
    const isFocused = useSignal(false)
    const cardRef = useSignal<HTMLDivElement>()

    useVisibleTask$(({ cleanup }) => {
      const el = cardRef.value
      if (!el || !glowOnFocus) return

      const handleFocus = () => {
        isFocused.value = true
      }
      const handleBlur = () => {
        isFocused.value = false
      }
      el.addEventListener('focusin', handleFocus)
      el.addEventListener('focusout', handleBlur)
      cleanup(() => {
        el.removeEventListener('focusin', handleFocus)
        el.removeEventListener('focusout', handleBlur)
      })
    })

    return (
      <div
        ref={cardRef}
        class={['cinematic-depth-card', 'depth-surface', 'surface-panel', variant, className]}
        data-variant={variant}
        data-glow-focus={glowOnFocus && isFocused.value ? '' : undefined}
        data-elevated={elevated ? '' : undefined}
      >
        <div class="cinematic-depth-card__border" aria-hidden="true" />
        <div class="cinematic-depth-card__content relative z-[1]">
          <Slot />
        </div>
        <div class="cinematic-depth-card__bloom" aria-hidden="true" />
        <div class="cinematic-depth-card__grain" aria-hidden="true" />
      </div>
    )
  }
)
