import { Slot, component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { isValidLocale } from '~/i18n/locale-validation'
import { LANGUAGE_COOKIE_NAME } from '~/i18n/types'

/**
 * Locale Validation Middleware for /[lang] routes.
 * Ensures that the 'lang' parameter is a supported locale.
 * Returns 404 for invalid locales (e.g., /xx/anything).
 * Syncs the uniteia_lang cookie with the current URL path locale.
 */
export const onRequest: RequestHandler = async ({ params, cookie, error }) => {
  const lang = params.lang

  if (!lang || !isValidLocale(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" is not supported.`)
  }

  // Sync cookie to match current URL locale — ensures consistency across navigation
  if (cookie.get(LANGUAGE_COOKIE_NAME)?.value !== lang) {
    cookie.set(LANGUAGE_COOKIE_NAME, lang, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
    })
  }
}

export default component$(() => {
  return <Slot />
})
