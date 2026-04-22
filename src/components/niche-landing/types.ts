import type { ClassList } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'
import type { NicheConfig } from '~/types/niche'

/**
 * NicheLanding component props
 * Renders the full niche landing page: header, description, article placeholder, and related niches grid
 */
export interface NicheLandingProps {
  /** The niche to display on the landing page */
  niche: NicheConfig
  /** Other niches to show in the related-content grid */
  otherNiches: NicheConfig[]
  /** Current language for localized display */
  lang: SupportedLanguage
  /** Optional CSS class for additional styling */
  class?: ClassList
}
