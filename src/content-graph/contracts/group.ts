import type { ContentLocale, ContentNode } from './node'

export const REQUIRED_LOCALES: ContentLocale[] = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']

export interface ContentGroup {
  canonicalSlug: string
  title: string
  contentType: 'guide' | 'article' | 'reference'
  nodes: ContentNode[]
  publishedLocales: ContentLocale[]
  missingLocales: ContentLocale[]
  completionScore: number
  isFullySymmetric: boolean
}

export interface ContentGroupCollection {
  groups: ContentGroup[]
  byCompletion: {
    complete: ContentGroup[]
    partial: ContentGroup[]
    incomplete: ContentGroup[]
  }
  fullySymmetric: ContentGroup[]
  publicGroups: ContentGroup[]
}
