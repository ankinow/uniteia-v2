import type { VerdictLevel } from '~/components/editorial-verdict/types'
import type { SupportedLanguage } from '~/i18n/types'

/**
 * ArticleFrame component props
 * Wraps article content in a prose-styled container with dark theme surface
 */
export interface ArticleFrameProps {
  /** Optional CSS class for additional styling */
  class?: string
  kindleMode?: boolean
  dopamineCard?: {
    title: string
    description: string
    href: string
    score?: number
    verdict?: VerdictLevel
    sourceCount?: number
    icon?: string
    lang: SupportedLanguage
  }
}

/**
 * ArticleFrame emits structured log events for debugging
 * Observable in browser console and server logs
 */
export interface ArticleFrameLogEvent {
  type: 'render'
  timestamp: string
  slug?: string
  lang?: string
}
