import { type ClassList, component$ } from '@builder.io/qwik'

export type HudLabelTone = 'action' | 'curation' | 'verified' | 'muted'

export type HudLabelSize = 'normal' | 'compact'

export interface HudLabelProps {
  label: string
  tone?: HudLabelTone
  surface?: string
  size?: HudLabelSize
  class?: ClassList
}

export const HudLabel = component$<HudLabelProps>(
  ({ label, tone = 'action', surface, size = 'normal', class: classList }) => {
    return (
      <span
        data-testid="hud-label"
        data-surface={surface}
        data-tone={tone}
        data-size={size}
        class={['hud-label-base', classList]}
      >
        {label}
      </span>
    )
  }
)
