import { REGISTRY_PATHS } from '~/utils/content-loader'
import type { SupportedLanguage } from '~/i18n/types'

export function getAvailableLanguages(niche: string, slug: string): SupportedLanguage[] {
  const suffix = `/${niche}/`
  const fileSuffix = `/${slug}.md`

  return REGISTRY_PATHS.filter(key => key.includes(suffix) && key.endsWith(fileSuffix)).map(key => {
    const segments = key.split('/')
    const langIndex = segments.indexOf(niche) + 1
    return segments[langIndex] as SupportedLanguage
  })
}
