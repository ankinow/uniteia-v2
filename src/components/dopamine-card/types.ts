import type { ClassList } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'

export interface DopamineCardProps {
  /** Card title */
  title: string
  /** Card description */
  description: string
  /** Link destination */
  href: string
  /** Optional quality score 0-100 (shows QualityRing if provided) */
  score?: number
  /** Optional Lucide icon name */
  icon?: string
  /** Current language for i18n */
  lang: SupportedLanguage
  /** Optional CSS class */
  class?: ClassList
}
