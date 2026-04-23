import { renderToStream } from '@builder.io/qwik/server'
import type { RenderToStreamOptions } from '@builder.io/qwik/server'
import Root from './root'

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    ...opts,
  })
}
