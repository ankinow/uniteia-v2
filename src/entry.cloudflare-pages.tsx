import { qwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages'

// @ts-ignore
import render from '../entry.ssr'

const onRequest: PagesFunction = qwikCity({ render })

export { onRequest }
