import { component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { onLanguageNegotiation } from '~/i18n/middleware'

/**
 * Root route redirector.
 * Enforces the 'i18n-first' law by redirecting the root path (/)
 * to a language-specific path (/[lang]/) based on edge negotiation.
 */
export const onGet: RequestHandler = (event) => {
  // Execute negotiation if it hasn't run yet (though it should have in layout.tsx)
  onLanguageNegotiation(event)

  // Retrieve the negotiated language from headers set by the middleware
  const lang = event.headers.get('x-negotiated-lang') || 'en'

  // Perform 302 redirect to the language-specific home page
  throw event.redirect(302, `/${lang}/`)
}

export default component$(() => null)
