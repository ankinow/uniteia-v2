import { component$ } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { getTranslation } from '~/i18n/context'
import type { EditorialVerdictProps, VerdictLevel } from './types'

/** Color mapping per verdict level — matches SolarLanso palette */
const VERDICT_COLORS: Record<VerdictLevel, string> = {
  trusted: 'text-cyan',
  caution: 'text-bronze',
  flagged: 'text-vine',
}

const VERDICT_BORDERS: Record<VerdictLevel, string> = {
  trusted: 'border-cyan/40',
  caution: 'border-bronze/40',
  flagged: 'border-vine/40',
}

const VERDICT_BGS: Record<VerdictLevel, string> = {
  trusted: 'bg-cyan/10',
  caution: 'bg-bronze/10',
  flagged: 'bg-vine/10',
}

/** Visual indicator dot for the verdict level */
const VERDICT_DOTS: Record<VerdictLevel, string> = {
  trusted: 'bg-cyan',
  caution: 'bg-bronze',
  flagged: 'bg-vine',
}

/** i18n keys for verdict labels */
const VERDICT_I18N_KEYS: Record<VerdictLevel, 'trusted' | 'caution' | 'flagged'> = {
  trusted: 'trusted',
  caution: 'caution',
  flagged: 'flagged',
}

const VERDICT_TONES: Record<VerdictLevel, 'verified' | 'curation' | 'action'> = {
  trusted: 'verified',
  caution: 'curation',
  flagged: 'action',
}

/**
 * EditorialVerdict — trust badge showing the editorial verdict level.
 * Color-coded: trusted=cyan, caution=bronze, flagged=vine.
 * Static component (no animation per R012).
 */
export const EditorialVerdict = component$<EditorialVerdictProps>(
  ({ verdict, lang, class: className }) => {
    const t = getTranslation(lang)
    const color = VERDICT_COLORS[verdict]
    const border = VERDICT_BORDERS[verdict]
    const bg = VERDICT_BGS[verdict]
    const dot = VERDICT_DOTS[verdict]
    const label = t.editorial[VERDICT_I18N_KEYS[verdict]]

    return (
      <output
        data-testid="editorial-verdict"
        data-verdict={verdict}
        data-lang={lang}
        class={['hud-panel', 'inline-flex items-center gap-3 px-3 py-2 text-sm font-medium', border, bg, className]}
        aria-label={`${t.editorial.verdictLabel}: ${label}`}
      >
        <span class={`inline-block h-2 w-2 shrink-0 ${dot}`} aria-hidden="true" />
        <div class="flex flex-col gap-1">
          <HudLabel
            label={t.editorial.verdictLabel}
            tone={VERDICT_TONES[verdict]}
            surface="verdict"
          />
          <span class={color}>{label}</span>
        </div>
      </output>
    )
  }
)
