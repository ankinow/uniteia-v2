import type { PagesFunction } from '@cloudflare/workers-types'
import { buildNicheLocaleRedirectPath } from '../../src/utils/niche-locale-redirect'

type Env = Record<string, never>

export const onRequest: PagesFunction<Env> = async context => {
  const { request } = context
  const url = new URL(request.url)

  const location = buildNicheLocaleRedirectPath(
    url.pathname,
    url.search,
    request.headers.get('Accept-Language')
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      Vary: 'Accept-Language',
    },
  })
}

export default onRequest
