import { component$ } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'

/**
 * Root landing page — language selector.
 * Redirects to /[lang]/ for content automatically.
 */
export const onRequest: RequestHandler = async ({ request, redirect }) => {
  const acceptLang = request.headers.get('accept-language') || ''
  const preferredLang = (acceptLang.split(',')[0]?.split('-')[0] || 'en').toLowerCase()

  const supported = SUPPORTED_LANGUAGES.find(l => l.code === preferredLang)
  const targetLang = supported ? supported.code : 'en'

  throw redirect(302, `/${targetLang}/`)
}

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-void text-bone px-4">
      <div class="text-center space-y-8 max-w-md">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          Uni<span class="text-accent">Teia</span>
        </h1>

        <div class="flex flex-wrap justify-center gap-3" aria-label="Select language">
          {SUPPORTED_LANGUAGES.map(l => (
            <a
              key={l.code}
              href={`/${l.code}/`}
              class="inline-flex px-4 py-2 rounded-lg border border-accent/20 bg-deep hover:bg-mid hover:border-accent/40 transition-colors duration-150 active:scale-[0.96] text-bone no-underline text-sm font-medium whitespace-nowrap"
            >
              {l.nativeName ?? l.code.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia',
  meta: [
    { name: 'description', content: 'Multilingual knowledge portal.' },
    { name: 'robots', content: 'index, follow' },
  ],
}
