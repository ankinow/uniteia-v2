import { Slot, component$ } from '@builder.io/qwik'
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city'
import { useProvideI18n } from '~/i18n/context'
import { isValidLocale } from '~/i18n/locale-validation'
import { LANGUAGE_COOKIE_MAX_AGE, LANGUAGE_COOKIE_NAME, SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onRequest: RequestHandler = async ({ params, cookie, url, redirect }) => {
  const lang = params.lang
  if (!lang || !isValidLocale(lang)) {
    throw redirect(308, `/en${url.pathname}`)
  }
  if (cookie.get(LANGUAGE_COOKIE_NAME)?.value !== lang) {
    cookie.set(LANGUAGE_COOKIE_NAME, lang, {
      path: '/',
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    })
  }
}

export const useLanguage = routeLoader$<SupportedLanguage>(({ params }) => {
  const lang = params.lang
  if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)) return lang as SupportedLanguage
  return 'en'
})

export default component$(() => {
  const langSignal = useLanguage()
  useProvideI18n(langSignal.value)

  return <Slot />
})
