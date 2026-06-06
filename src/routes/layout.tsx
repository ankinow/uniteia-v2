import { Slot, component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { useProvideI18n } from '~/i18n/context'

export const onRequest: RequestHandler = async event => {
  const { onLanguageNegotiation } = await import('~/i18n/middleware')
  await onLanguageNegotiation(event)
}

/**
 * Root layout — language negotiation + i18n context for root page.
 */
export default component$(() => {
  useProvideI18n('en')
  return <Slot />
})
