import type { ClassList } from '@builder.io/qwik'
import type { VerdictLevel } from '~/components/editorial-verdict/types'
import type { SupportedLanguage } from '~/i18n/types'

export type SignalVariant = 'panel' | 'bar'

export interface SignalGridProps {
  qualityScore: number
  verdict: VerdictLevel
  sourceCount?: number
  lang: SupportedLanguage
  variant?: SignalVariant
  class?: ClassList
}
