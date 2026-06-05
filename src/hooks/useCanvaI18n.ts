/**
 * useCanvaI18n — flat Record pattern for nested i18n keys (Qwik SSR-safe).
 *
 * Validated pitfall (uniteia-canva #45, #97): Qwik SSR closures can't resolve
 * values accessed via nested property paths on a `t()` returned from
 * `useI18n()`. Solution: pre-resolve translations using `getTranslation(lang)`
 * directly, return a flat `Record<CanvaI18nKey, string>`, access via `t.keyName`
 * (NOT `t('keyName')`).
 *
 * Usage:
 *   const t = useCanvaI18n('en')
 *   return <p aria-label={t['canva.hero.title']}>...</p>
 */

import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

export type CanvaI18nKey =
  | 'canva.hero.title'
  | 'canva.hero.subtitle'
  | 'canva.hero.cta'
  | 'canva.concept.central'
  | 'canva.concept.satellite.1'
  | 'canva.concept.satellite.2'
  | 'canva.code.step.1.title'
  | 'canva.code.step.1.body'
  | 'canva.code.step.2.title'
  | 'canva.compare.option.a'
  | 'canva.compare.option.b'
  | 'canva.compare.decision.yes'
  | 'canva.compare.decision.no'
  | 'canva.timeline.milestone.1'
  | 'canva.timeline.milestone.2'
  | 'canva.summary.takeaway.1'
  | 'canva.summary.takeaway.2'
  | 'canva.summary.nextstep'

export const CANVA_KEYS: readonly CanvaI18nKey[] = [
  'canva.hero.title',
  'canva.hero.subtitle',
  'canva.hero.cta',
  'canva.concept.central',
  'canva.concept.satellite.1',
  'canva.concept.satellite.2',
  'canva.code.step.1.title',
  'canva.code.step.1.body',
  'canva.code.step.2.title',
  'canva.compare.option.a',
  'canva.compare.option.b',
  'canva.compare.decision.yes',
  'canva.compare.decision.no',
  'canva.timeline.milestone.1',
  'canva.timeline.milestone.2',
  'canva.summary.takeaway.1',
  'canva.summary.takeaway.2',
  'canva.summary.nextstep',
] as const

/**
 * Pre-resolve all 18 canva keys for a given locale into a flat Record.
 * Returns the KEY as the value when translation is missing (graceful fallback).
 */
export function useCanvaI18n(lang: SupportedLanguage): Record<CanvaI18nKey, string> {
  const all = getTranslation(lang) as unknown as Record<string, unknown>
  const out: Partial<Record<CanvaI18nKey, string>> = {}
  for (const key of CANVA_KEYS) {
    const path = key.split('.') // ['canva', 'hero', 'title']
    let cur: unknown = all
    let found = true
    for (const seg of path) {
      if (cur && typeof cur === 'object' && seg in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[seg]
      } else {
        found = false
        break
      }
    }
    out[key] = found && typeof cur === 'string' ? cur : key
  }
  return out as Record<CanvaI18nKey, string>
}

/**
 * useCanvaMagicaT — flat Record pattern for magica i18n keys.
 * Handles the magica namespace translations.
 */
export type CanvaMagicaI18nKey =
  | 'magicaWorkflowBuilder'
  | 'magicaCommandCenter'
  | 'magicaDescription'
  | 'aiProcessing'
  | 'nodeBasedPromptChaining'
  | 'architecture'
  | 'multiModelFallback'
  | 'startBuilding'
  | 'tryMagicaFree'
  | 'workflowVisualization'
  | 'unifiedPromptEngineering'
  | 'languages'
  | 'keyMetrics'
  | 'visitMagica'
  | 'workflowSteps'
  | 'poweredBy'

export const MAGICA_KEYS: readonly CanvaMagicaI18nKey[] = [
  'magicaWorkflowBuilder',
  'magicaCommandCenter',
  'magicaDescription',
  'aiProcessing',
  'nodeBasedPromptChaining',
  'architecture',
  'multiModelFallback',
  'startBuilding',
  'tryMagicaFree',
  'workflowVisualization',
  'unifiedPromptEngineering',
  'languages',
  'keyMetrics',
  'visitMagica',
  'workflowSteps',
  'poweredBy',
] as const

/**
 * Pre-resolve all magica keys for a given locale into a flat Record.
 * Returns the KEY as the value when translation is missing (graceful fallback).
 * Looks under the 'magica' namespace in translations.
 */
export function useCanvaMagicaT(lang: SupportedLanguage): Record<CanvaMagicaI18nKey, string> {
  const all = getTranslation(lang) as unknown as Record<string, unknown>
  const magicaNs = (all.magica as Record<string, unknown>) ?? {}
  const out: Partial<Record<CanvaMagicaI18nKey, string>> = {}
  for (const key of MAGICA_KEYS) {
    const cur = magicaNs[key]
    out[key] = typeof cur === 'string' ? cur : key
  }
  return out as Record<CanvaMagicaI18nKey, string>
}
