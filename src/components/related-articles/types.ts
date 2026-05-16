import type { ContentNode } from '~/content-graph/contracts/node'
import type { SupportedLanguage } from '~/i18n/types'

export interface RelatedArticlesProps {
  nodes: ContentNode[]
  lang: SupportedLanguage
  label?: string
}
