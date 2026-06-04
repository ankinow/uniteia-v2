/**
 * useCanvaI18n — Flat record of canva translations (pitfall 45)
 *
 * Qwik SSR closures cannot resolve nested i18n keys like `t.canva.hero.title`
 * (the resumability serializer flattens the proxy and loses the dotted path).
 * Pre-resolve every key with `getTranslation(lang)` and return a flat
 * `Record<string, string>` keyed by the dot-notation path. Components then
 * access values via `t['canva.hero.title']` — never `t.canva.hero.title`.
 *
 * Also re-exports the legacy `useCanvaMagicaT` (canvaMagicaProduction
 * namespace) so existing call sites keep working.
 */
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage, TranslationStrings } from '~/i18n/types'
import type { CanvaMagicaI18n } from '~/types/canva'

type CanvaBlock = TranslationStrings['canva']

/** All 18 dot-paths exposed by TranslationStrings['canva'] */
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

export type CanvaI18n = Record<CanvaI18nKey, string>

function flatten(canva: CanvaBlock): CanvaI18n {
  return {
    'canva.hero.title': canva.hero.title,
    'canva.hero.subtitle': canva.hero.subtitle,
    'canva.hero.cta': canva.hero.cta,
    'canva.concept.central': canva.concept.central,
    'canva.concept.satellite.1': canva.concept.satellite[1],
    'canva.concept.satellite.2': canva.concept.satellite[2],
    'canva.code.step.1.title': canva.code.step[1].title,
    'canva.code.step.1.body': canva.code.step[1].body,
    'canva.code.step.2.title': canva.code.step[2].title,
    'canva.compare.option.a': canva.compare.option.a,
    'canva.compare.option.b': canva.compare.option.b,
    'canva.compare.decision.yes': canva.compare.decision.yes,
    'canva.compare.decision.no': canva.compare.decision.no,
    'canva.timeline.milestone.1': canva.timeline.milestone[1],
    'canva.timeline.milestone.2': canva.timeline.milestone[2],
    'canva.summary.takeaway.1': canva.summary.takeaway[1],
    'canva.summary.takeaway.2': canva.summary.takeaway[2],
    'canva.summary.nextstep': canva.summary.nextstep,
  }
}

export function useCanvaI18n(lang: string): CanvaI18n {
  const all = getTranslation(lang as SupportedLanguage)
  return flatten(all.canva)
}

// ── Legacy: canvaMagicaProduction namespace (kept for back-compat) ─────

export type CanvaMagicaT = Record<keyof CanvaMagicaI18n, string>

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
