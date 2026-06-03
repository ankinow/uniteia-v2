import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  return (
    <main id="main-content" class="grid min-h-[80vh] place-items-center bg-void">
      <div class="text-center max-w-md px-6">
        <p class="font-mono text-cyan-600 text-sm mb-6">∅ signal lost</p>
        <h1 class="font-display text-4xl text-bone mb-4">No signal at this frequency</h1>
        <p class="text-bone-muted text-sm leading-relaxed">
          The page you're looking for has been deprecated or never existed.
        </p>
        <a
          href="/en/signals"
          class="mt-8 inline-block border-2 border-bone/20 px-5 py-2.5 font-mono text-sm text-bone hover:border-cyan-600 hover:text-cyan-600 transition-colors"
        >
          Back to signals →
        </a>
      </div>
    </main>
  )
})

export const head: DocumentHead = {
  title: '404 - No Signal | UniTeia',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for has been deprecated or never existed.',
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}
