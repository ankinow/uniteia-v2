import { renderToStream } from '@builder.io/qwik/server'
import type { RenderToStreamOptions } from '@builder.io/qwik/server'
import { resolveDocumentLanguageFromPathname } from './i18n/document-language'
import Root from './root'

export default function (opts: RenderToStreamOptions) {
  const requestedLang =
    typeof opts.serverData?.qwikcity?.params?.lang === 'string'
      ? opts.serverData.qwikcity.params.lang
      : undefined
  const documentLanguage = resolveDocumentLanguageFromPathname(
    requestedLang ? `/${requestedLang}` : undefined
  )

  return renderToStream(<Root />, {
    ...opts,
    containerAttributes: {
      ...opts.containerAttributes,
      lang: documentLanguage,
    },
  })
}
