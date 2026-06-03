import type { RequestHandler } from '@builder.io/qwik-city'

export const onRequest: RequestHandler = event => {
  throw event.redirect(301, '/en/signals/apex')
}
