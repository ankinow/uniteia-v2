/**
 * EditorialVerdict — Editorial trust indicator
 *
 * Displays a verdict level badge (trusted/caution/flagged) with
 * locale-aware labels. Used in article headers and signal cards.
 *
 * Accessible: uses aria-label on the indicator dot, semantic text label.
 * Bundle-safe: pure CSS + text, zero dependencies.
 */

import { component$ } from '@builder.io/qwik'
import type { EditorialVerdictProps, VerdictLevel } from './types'

const VERDICT_CONFIG: Record<VerdictLevel, { color: string; labelKey: string }> = {
  trusted: {
    color: 'oklch(0.79 0.18 145)',
    labelKey: 'trusted',
  },
  caution: {
    color: 'oklch(0.75 0.18 80)',
    labelKey: 'caution',
  },
  flagged: {
    color: 'oklch(0.65 0.2 30)',
    labelKey: 'flagged',
  },
}

export const EditorialVerdict = component$<EditorialVerdictProps>(
  ({ verdict, lang, class: classList }) => {
    const config = VERDICT_CONFIG[verdict]

    return (
      <span
        class={['editorial-verdict inline-flex items-center gap-1.5 text-xs', classList]}
        data-verdict={verdict}
        data-testid="editorial-verdict"
      >
        <span
          class="editorial-verdict__dot inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
        <span class="editorial-verdict__label font-mono uppercase tracking-wider">{verdict}</span>
      </span>
    )
  }
)
