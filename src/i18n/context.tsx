import {
  type Signal,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import { en } from './en'
import { es } from './es'
import { ja } from './ja'
import { pt } from './pt'
import type { SupportedLanguage, TranslationStrings } from './types'
import { DEFAULT_LANGUAGE } from './types'
import { zh } from './zh'

/**
 * Translation map for all supported languages
 */
const translations: Record<SupportedLanguage, TranslationStrings> = {
  en,
  pt,
  es,
  ja,
  zh,
}

/**
 * i18n context interface
 */
export interface I18nContext {
  lang: Signal<SupportedLanguage>
  t: TranslationStrings
  isFallback: boolean
}

/**
 * Context ID for i18n
 */
export const I18nCtx = createContextId<I18nContext>('i18n')

/**
 * Hook to access i18n context
 * Must be used within a component that has i18n provider
 */
export function useI18n(): I18nContext {
  return useContext(I18nCtx)
}

/**
 * Get translation object for a language
 */
export function getTranslation(lang: SupportedLanguage): TranslationStrings {
  return translations[lang] || translations[DEFAULT_LANGUAGE]
}

/**
 * Get language name (native) for display
 */
export function getLanguageName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
    ja: '日本語',
    zh: '中文',
  }
  return names[lang] || names[DEFAULT_LANGUAGE]
}

/**
 * Provider component props
 */
export interface I18nProviderProps {
  initialLang?: SupportedLanguage
}

/**
 * Create i18n context value for provider
 * This should be called at the root level
 */
export function useCreateI18nContext(
  initialLang: SupportedLanguage = DEFAULT_LANGUAGE
): I18nContext {
  const lang = useSignal<SupportedLanguage>(initialLang)
  const t = getTranslation(initialLang)

  return {
    lang,
    t,
    isFallback: initialLang !== DEFAULT_LANGUAGE && !translations[initialLang],
  }
}

/**
 * Provide i18n context to child components
 * Call this in root layout or route components
 */
export function useProvideI18n(initialLang?: SupportedLanguage): void {
  const context = useCreateI18nContext(initialLang)
  useContextProvider(I18nCtx, context)
}

/**
 * Client-side language switcher hook
 * Returns the current language and a function to switch languages
 */
export function useLanguageSwitcher() {
  const { lang } = useI18n()

  // Run visible task to sync with client-side state
  useVisibleTask$(({ track }) => {
    track(() => lang.value)
    // Persist to cookie when language changes (1 year expiry)
    document.cookie = `uniteia_lang=${lang.value};path=/;max-age=31536000;SameSite=Lax`
  })

  const switchLanguage = (newLang: SupportedLanguage) => {
    lang.value = newLang
  }

  return {
    currentLang: lang,
    switchLanguage,
  }
}

/**
 * Re-export types for convenience
 */
export type { TranslationStrings, SupportedLanguage } from './types'
