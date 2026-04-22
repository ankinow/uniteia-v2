import type { ClassList } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'

/** Editorial verdict levels */
export type VerdictLevel = 'trusted' | 'caution' | 'flagged'

export interface EditorialVerdictProps {
  /** The editorial verdict level */
  verdict: VerdictLevel
  /** Current language for i18n */
  lang: SupportedLanguage
  /** Optional CSS class */
  class?: ClassList
}
