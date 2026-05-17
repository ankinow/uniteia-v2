import type { VerdictLevel } from '~/components/editorial-verdict/types'

export interface DopamineCardProps {
  /** Card title */
  title: string
  /** Card description */
  description: string
  /** Link destination */
  href: string
  /** Optional quality score 0-100 */
  score?: number
  /** Optional verdict level (shows SignalBar if provided) */
  verdict?: VerdictLevel
  /** Optional source count */
  sourceCount?: number
  /** Optional Lucide icon name */
  icon?: string
  /** Current language for i18n */
  lang: SupportedLanguage
  /** Optional CSS class */
  class?: ClassList
}
