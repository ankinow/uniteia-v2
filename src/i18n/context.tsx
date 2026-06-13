import {
  type Signal,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik'
import type { SupportedLanguage, TranslationStrings } from './types'
import { DEFAULT_LANGUAGE } from './types'

// Always eagerly import English as the universal fallback
import { en } from './en'

/**
 * Build-time locale constant injected by Vite define (vite.config.ts).
 * Only the matching branch survives dead-code elimination, so only ONE
 * additional locale file (if not English) is bundled.  This cuts the
 * monolithic 8-locale translation chunk by ~85 %.
 */
const BUILD_LOCALE: string =
  typeof process !== 'undefined' ? (process.env as Record<string, string>).LOCALE || 'en' : 'en'

// ── Lazy loaders (one per locale) ──────────────────────────────────────
// Vite creates a separate chunk for each dynamic import().  At build time
// every branch except the one matching BUILD_LOCALE is dead code and is
// removed by esbuild, so only the needed locale lands in the bundle.

async function loadDe(): Promise<TranslationStrings> {
  const { de } = await import('./de')
  return de
}
async function loadEs(): Promise<TranslationStrings> {
  const { es } = await import('./es')
  return es
}
async function loadFr(): Promise<TranslationStrings> {
  const { fr } = await import('./fr')
  return fr
}
async function loadIt(): Promise<TranslationStrings> {
  const { it } = await import('./it')
  return it
}
async function loadJa(): Promise<TranslationStrings> {
  const { ja } = await import('./ja')
  return ja
}
async function loadPt(): Promise<TranslationStrings> {
  const { pt } = await import('./pt')
  return pt
}
async function loadZh(): Promise<TranslationStrings> {
  const { zh } = await import('./zh')
  return zh
}

// ── Build-locale resolution ────────────────────────────────────────────
// At build time the switch collapses to a single case; the other branches
// (and their dynamic imports) are dead-code eliminated.

async function resolveBuildTranslations(): Promise<TranslationStrings> {
  switch (BUILD_LOCALE) {
    case 'de':
      return loadDe()
    case 'es':
      return loadEs()
    case 'fr':
      return loadFr()
    case 'it':
      return loadIt()
    case 'ja':
      return loadJa()
    case 'pt':
      return loadPt()
    case 'zh':
      return loadZh()
    default:
      return en // 'en' or unknown → use the statically-imported English
  }
}

// ── Synchronous cache ──────────────────────────────────────────────────
// Populated eagerly with English; build locale is added before SSR runs.

const translations: Record<string, TranslationStrings> = { en }

// Top-level initialisation promise — resolved before any component renders.
const _initPromise: Promise<void> = (async () => {
  if (BUILD_LOCALE !== 'en') {
    translations[BUILD_LOCALE] = await resolveBuildTranslations()
  }
})()

// Expose so the layout/server-entry can await it before rendering.
export function ensureTranslationsReady(): Promise<void> {
  return _initPromise
}

// ── Public API (identical signatures to the original) ──────────────────

export interface I18nContext {
  lang: Signal<SupportedLanguage>
  t: TranslationStrings
  isFallback: Signal<boolean>
}

export const I18nCtx = createContextId<I18nContext>('i18n')

export function useI18n(): I18nContext {
  return useContext(I18nCtx)
}

/**
 * Synchronous translation lookup.
 *
 * IMPORTANT — the build locale MUST be initialised before the first call.
 * The `[lang]/layout.tsx` route loader awaits `ensureTranslationsReady()`
 * so the translations map is always populated by the time components render.
 */
export function getTranslation(lang: SupportedLanguage): TranslationStrings {
  return translations[lang] || translations[DEFAULT_LANGUAGE] || en
}

export function getLanguageName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語',
    zh: '中文',
  }
  return names[lang] || names[DEFAULT_LANGUAGE]
}

export interface I18nProviderProps {
  initialLang?: SupportedLanguage
}

export function useCreateI18nContext(
  initialLang: SupportedLanguage = DEFAULT_LANGUAGE
): I18nContext {
  const lang = useSignal<SupportedLanguage>(initialLang)
  const isFallback = useSignal(initialLang !== DEFAULT_LANGUAGE)
  const t = getTranslation(initialLang)

  return {
    lang,
    t,
    isFallback,
  }
}

export function useProvideI18n(initialLang?: SupportedLanguage): void {
  const context = useCreateI18nContext(initialLang)
  useContextProvider(I18nCtx, context)
}

export type { TranslationStrings, SupportedLanguage } from './types'
