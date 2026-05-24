import type { ClassList, QRL, Signal } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'

/**
 * LangSwitcherSegmented component props
 */
export interface LangSwitcherSegmentedProps {
  currentLang: Signal<SupportedLanguage>
  onLangChange$: QRL<(lang: SupportedLanguage) => void>
  class?: ClassList
}

/**
 * LangSwitcher component props
 */
export interface LangSwitcherProps {
  /** Additional CSS classes */
  class?: ClassList
  /** Compact mode - shows only flag/code */
  compact?: boolean
}

/**
 * Language option structure for dropdown
 */
export interface LanguageOption {
  code: SupportedLanguage
  name: string
  nativeName: string
  selected: boolean
}

/**
 * LangSwitcher log event for debugging
 */
export interface LangSwitcherLogEvent {
  type: 'open' | 'close' | 'select' | 'redirect'
  timestamp: string
  from?: string
  to?: string
  redirectUrl?: string
}
