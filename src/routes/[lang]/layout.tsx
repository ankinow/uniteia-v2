import { Slot, component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { isValidLocale } from '~/i18n/locale-validation'

/**
 * Locale Validation Middleware for /[lang] routes.
 * Ensures that the 'lang' parameter is a supported locale.
 * Returns 404 for invalid locales (e.g., /xx/anything).
 */
export const onRequest: RequestHandler = async ({ params, error }) => {
  const lang = params.lang

  if (!lang || !isValidLocale(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" is not supported.`)
  }
}

export default component$(() => {
  return <Slot />
})
