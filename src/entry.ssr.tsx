import { QwikCityMockProvider } from '@builder.io/qwik-city'
import { renderToStream } from '@builder.io/qwik/server'
import type { RenderToStreamOptions } from '@builder.io/qwik/server'
import Root from './root'

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    ...opts,
    qwikMapper: QwikCityMockProvider({
      url: opts.url ?? 'http://localhost:3000/',
      ...opts.qwikMapperProps,
    }),
  })
}
