import { component$ } from '@builder.io/qwik'
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
      <div
        data-testid="editorial-verdict"
        data-verdict={verdict}
        data-lang={lang}
        class={[
          'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium',
          border,
          bg,
          className,
        ]}
        role="status"
        aria-label={`${t.editorial.verdictLabel}: ${label}`}
      >
        <span
          class={`inline-block h-2 w-2 rounded-full ${dot}`}
          aria-hidden="true"
        />
        <span class={color}>
          {label}
        </span>
      </div>
    )
  }
)
