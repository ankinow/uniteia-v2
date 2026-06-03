/**
 * Canva Magica — i18n helper for SSG-safe translations
 * PLANO-075/080: Pre-resolves all translation keys at component mount,
 * avoiding Qwik SSR closure serialization issues.
 *
 * Returns a Record of all translated strings, not a function.
 */
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import type { TranslationStrings } from '~/i18n/types'
import type { CanvaMagicaI18n } from '~/types/canva'

export type CanvaMagicaT = Record<keyof CanvaMagicaI18n, string>

/** Type-safe access to canvaMagicaProduction from TranslationStrings */
type CanvaProductionT = TranslationStrings['article']['canvaMagicaProduction']

export function useCanvaMagicaT(lang: string): CanvaMagicaT {
  const all = getTranslation(lang as SupportedLanguage)
  const ns: Partial<CanvaProductionT> | undefined = all.article?.canvaMagicaProduction
  if (!ns) {
    return new Proxy({} as CanvaMagicaT, {
      get: (_, key) => key as string,
    })
  }
  return ns as unknown as CanvaMagicaT
}
