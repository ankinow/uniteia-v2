import { component$ } from '@builder.io/qwik'
import { EditorialVerdict } from '~/components/editorial-verdict'
import { HudLabel } from '~/components/hud-label'
import { QualityRing } from '~/components/quality-ring'
import { ScratchDivider } from '~/components/scratch-divider'
import { getTranslation } from '~/i18n/context'
import type { SignalGridProps } from './types'

export const SignalGrid = component$<SignalGridProps>(
  ({ qualityScore, verdict, sourceCount, lang, variant = 'panel', class: className }) => {
    const t = getTranslation(lang)

    if (variant === 'bar') {
      return (
        <div
          data-testid="signal-bar"
          data-verdict={verdict}
          class={['flex items-center gap-3', className]}
        >
          <QualityRing score={qualityScore} lang={lang} size={28} strokeWidth={3} />
          <EditorialVerdict verdict={verdict} lang={lang} />
          {sourceCount !== undefined && sourceCount > 0 && (
            <span class="flex items-center gap-1 text-xs text-bone-muted">
              <HudLabel label={`${sourceCount}`} tone="muted" surface="signal" />
              <span class="hidden sm:inline">{t.signal.sources}</span>
            </span>
          )}
        </div>
      )
    }

    return (
      <div
        data-testid="signal-grid"
        data-verdict={verdict}
        data-quality={qualityScore}
        class={[
          'hud-panel',
          'grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 p-4',
          'border border-action/10',
          className,
        ]}
      >
        <div class="flex items-center gap-4 col-span-full">
          <QualityRing score={qualityScore} lang={lang} size={48} strokeWidth={4} />
          <div class="flex flex-col gap-1">
            <HudLabel label={t.signal.qualityLabel} tone="verified" surface="signal" />
            <span class="text-lg font-semibold text-bone">{qualityScore}/100</span>
          </div>
          <ScratchDivider orientation="vertical" tone="action" surface="signal" class="h-10" />
          <EditorialVerdict verdict={verdict} lang={lang} />
        </div>

        {sourceCount !== undefined && sourceCount > 0 && (
          <div class="flex items-center gap-2 col-span-full">
            <HudLabel
              label={t.signal.sourceCount.replace('{count}', String(sourceCount))}
              tone="curation"
              surface="signal"
            />
          </div>
        )}
      </div>
    )
  }
)
