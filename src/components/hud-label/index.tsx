import { type ClassList, component$ } from '@builder.io/qwik'

export type HudLabelTone = 'action' | 'curation' | 'verified' | 'muted'

export interface HudLabelProps {
  label: string
  tone?: HudLabelTone
  surface?: string
  class?: ClassList
}

export const HudLabel = component$<HudLabelProps>(
  ({ label, tone = 'action', surface, class: classList }) => {
    return (
      <span
        data-testid="hud-label"
        data-surface={surface}
        data-tone={tone}
        class={['hud-label', classList]}
      >
        {label}
      </span>
    )
  }
)
