import type { ClassList } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'

export interface QualityRingProps {
  /** Quality score 0-100 */
  score: number
  /** Current language for i18n */
  lang: SupportedLanguage
  /** Ring size in px (default 64) */
  size?: number
  /** Stroke width in px (default 4) */
  strokeWidth?: number
  /** Optional CSS class */
  class?: ClassList
}
