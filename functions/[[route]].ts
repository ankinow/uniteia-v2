import type { PagesFunction } from '@cloudflare/workers-types'
import { validateLocalePath } from '../src/i18n/locale-validation'

// Extend the Environment type for Cloudflare Pages
interface Env {
  // Cloudflare Pages environment - no custom bindings needed
}

export const onRequest: PagesFunction<Env> = async context => {
  const { request } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  // Validate the locale from the first path segment
  const { locale, isValid, originalSegment } = validateLocalePath(pathname)

  // Return 404 for invalid locales immediately at the edge
  if (!isValid && originalSegment) {
    return new Response('Not Found - Invalid locale', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'x-negotiated-lang': 'none',
        'x-locale-valid': 'false',
      },
    })
  }

  // Pass through to Qwik City handling for valid requests
  // Clone the request with additional headers
  const modifiedRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      'x-negotiated-lang': locale || 'none',
      'x-locale-valid': 'true',
    },
  })

  // Let the request continue to Qwik City
  // Note: Cloudflare Pages will handle this via the adapter
  return context.next(modifiedRequest)
}

export default onRequest
