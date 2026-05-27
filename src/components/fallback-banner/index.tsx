import { component$ } from '@builder.io/qwik'
import { useI18n } from '~/i18n/context'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'

/**
 * FallbackBanner — shown when content is displayed in a language
 * different from the user's requested locale because the article
 * isn't available in their preferred language.
 *
 * Controlled by `isFallback` in i18n context.
 * Set by route loaders when content locale ≠ URL locale.
 */
export const FallbackBanner = component$(() => {
  const { lang, t, isFallback } = useI18n()

  if (!isFallback.value) return null

  const languageName =
    SUPPORTED_LANGUAGES.find(l => l.code === lang.value)?.nativeName ?? lang.value

  const message = t.fallbackBanner.message.replace('{lang}', languageName)

  return (
    <div
      role="alert"
      class={[
        'w-full bg-amber/10 border-b border-amber/30 px-4 py-3',
        'text-amber text-sm text-center',
        'backdrop-blur-sm',
      ]}
    >
      <span>{message}</span>
      <span class="mx-2 opacity-50">·</span>
      <span class="text-amber/70">{t.fallbackBanner.dismiss}</span>
    </div>
  )
})
