import type { ClassList } from '@builder.io/qwik'
import type { NicheConfig } from '~/types/niche'
import type { SupportedLanguage } from '~/i18n/types'

/**
 * NicheCard component props
 * Renders a single niche as a clickable card with icon, title, and description
 */
export interface NicheCardProps {
  /** The niche configuration to render */
  niche: NicheConfig
  /** Current language for localized display */
  lang: SupportedLanguage
  /** Optional CSS class for additional styling */
  class?: ClassList
}
