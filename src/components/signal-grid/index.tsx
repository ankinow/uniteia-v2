import { component$ } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { getTranslation } from '~/i18n/context'
import type { SignalGridProps } from './types'

export const SignalGrid = component$<SignalGridProps>(({ sourceCount, lang, class: className }) => {
  const t = getTranslation(lang)

  return (
    <div data-testid="signal-grid" class={className}>
      {sourceCount !== undefined && sourceCount > 0 && (
        <div class="flex items-center gap-2">
          <HudLabel
            label={t.signal.sourceCount.replace('{count}', String(sourceCount))}
            tone="curation"
            surface="signal"
          />
        </div>
      )}
    </div>
  )
})
