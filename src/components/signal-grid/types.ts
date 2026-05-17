import type { ClassList } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'

export interface SignalGridProps {
  sourceCount?: number
  lang: SupportedLanguage
  class?: ClassList
}
