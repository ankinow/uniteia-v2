/**
 * Canva Magica — i18n helper for SSG-safe translations
 * PLANO-075/080: Pre-resolves all translation keys at component mount,
 * avoiding Qwik SSR closure serialization issues.
 *
 * Returns a Record of all translated strings, not a function.
 */
import { getTranslation } from '~/i18n/context'
import type { CanvaMagicaI18n } from '~/types/canva'
import type { SupportedLanguage } from '~/i18n/types'

export type CanvaMagicaT = Record<keyof CanvaMagicaI18n, string>

/**
 * Pre-resolve all canvaMagicaProduction i18n keys for SSG/SSR safety.
 * Returns a flat Record<string,string> — works in SSG without Qwik context.
 *
 * Usage:
 *   const t = useCanvaMagicaT(lang)
 *   t.magicaWorkflowBuilder // → "Magica Workflow Builder"
 */
export function useCanvaMagicaT(lang: string): CanvaMagicaT {
  const all = getTranslation(lang as SupportedLanguage)
  // canvaMagicaProduction is nested under article in TranslationStrings
  const ns = (all as any).article?.canvaMagicaProduction as Record<string, string> | undefined
  if (!ns) {
    // Fallback: return key names if namespace missing
    return new Proxy({} as CanvaMagicaT, {
      get: (_, key) => key as string,
    })
  }
  return ns as CanvaMagicaT
}
