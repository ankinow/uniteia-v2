import { type ClassList, component$ } from '@builder.io/qwik'
import type { HudLabelTone } from '~/components/hud-label'

export interface ScratchDividerProps {
  tone?: HudLabelTone
  surface?: string
  orientation?: 'horizontal' | 'vertical'
  class?: ClassList
}

export const ScratchDivider = component$<ScratchDividerProps>(
  ({ tone = 'action', surface, orientation = 'horizontal', class: classList }) => {
    return (
      <span
        aria-hidden="true"
        data-testid="scratch-divider"
        data-surface={surface}
        data-tone={tone}
        data-orientation={orientation}
        class={['scratch-divider', classList]}
      />
    )
  }
)
