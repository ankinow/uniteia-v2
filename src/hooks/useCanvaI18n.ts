/**
 * Canva Magica — i18n hook that injects locale-aware translations
 * PLANO-075: Uses build-time locale injection via existing i18n context
 */
import { useI18n as useAppI18n } from '~/i18n/context'
import type { CanvaMagicaI18n } from '~/types/canva'

/**
 * Returns a type-safe `t()` function for CanvaMagica keys.
 * Wraps the app-level useI18n() and extracts the canvaMagicaProduction namespace.
 *
 * Usage:
 *   const { t } = useCanvaI18n()
 *   t('magicaWorkflowBuilder') // → "Magica Workflow Builder" (or localized)
 */
export function useCanvaI18n(): { t: (key: keyof CanvaMagicaI18n) => string } {
  const { t } = useAppI18n()
  return {
    t: (key: keyof CanvaMagicaI18n): string => {
      // Access nested canvaMagicaProduction keys via the app i18n
      const val = (t as any).canvaMagicaProduction?.[key]
      // Fallback: return the key name if translation missing (visible in dev)
      return val ?? key
    },
  }
}
