import { component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { buildNicheLocaleRedirectPath } from '~/utils/niche-locale-redirect'

export const onRequest: RequestHandler = event => {
  const location = buildNicheLocaleRedirectPath(
    event.url.pathname,
    event.url.search,
    event.request.headers.get('Accept-Language')
  )

  event.headers.set('Vary', 'Accept-Language')
  throw event.redirect(302, location)
}

export default component$(() => null)
