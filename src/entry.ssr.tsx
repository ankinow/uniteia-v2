import { renderToStream } from '@builder.io/qwik/server'
import type { RenderToStreamOptions } from '@builder.io/qwik/server'

import { resolveDocumentLanguageFromPathname } from './i18n/document-language'
import Root from './root'

export default function (opts: RenderToStreamOptions) {
  // In single-locale architecture, document language comes from build-time env.
  const documentLanguage = resolveDocumentLanguageFromPathname(`/${'en'}`)

  return renderToStream(<Root />, {
    ...opts,
    containerAttributes: {
      ...opts.containerAttributes,
      lang: documentLanguage,
    },
  })
}
