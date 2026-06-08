import { component$ } from '@builder.io/qwik'
import { type DocumentHead, type RequestHandler } from '@builder.io/qwik-city'
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
        <header class="space-y-4">
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
            Uni<span class="text-accent">Teia</span>
          </h1>
          <p class="text-bone-muted text-lg leading-relaxed">
            Knowledge signals. Clean. Multilingual. No noise.
          </p>
        </header>

        <div class="flex flex-wrap justify-center gap-3" aria-label="Select language">
          {SUPPORTED_LANGUAGES.map(l => (
            <a
              key={l.code}
              href={`/${l.code}/`}
              class="px-4 py-2 rounded-lg border border-white/10 bg-deep hover:bg-mid hover:border-accent/30 transition-all duration-150 text-bone no-underline text-sm font-medium"
            >
              {l.nativeName ?? l.code.toUpperCase()}
            </a>
          ))}
        </div>

        <p class="text-bone/25 text-xs font-mono">8 locales · no metaphors</p>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia OS — Knowledge Signals',
  meta: [
    { name: 'description', content: 'Multilingual knowledge portal. Clean signals, zero noise.' },
    { name: 'robots', content: 'index, follow' },
  ],
}
