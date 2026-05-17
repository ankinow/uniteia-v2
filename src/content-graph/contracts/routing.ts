import type { ContentLocale } from './node'

export interface RouteContract {
  home(locale: ContentLocale): string
  signalsIndex(locale: ContentLocale): string
  signal(locale: ContentLocale, niche: string, slug: string): string
  localized(currentPath: string, targetLocale: ContentLocale): string // intelligent switch
}
