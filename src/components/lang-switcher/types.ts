import type { ClassList } from '@builder.io/qwik'

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

type SupportedLanguage = 'en' | 'pt' | 'es' | 'ja' | 'zh'
