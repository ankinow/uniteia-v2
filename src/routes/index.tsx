import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'

export const onGet: RequestHandler = event => {
  onLanguageNegotiation(event)
}

export default component$(() => {
  const lang = useSignal('en')
  const mounted = useSignal(false)

  useVisibleTask$(() => {
    const el = document.querySelector('[data-negotiated-lang]')
    if (el) {
      lang.value = el.getAttribute('data-negotiated-lang') || 'en'
    }
    mounted.value = true
  })

  return (
    <div class="min-h-screen flex flex-col">
      <section class="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative">
        <div
          aria-hidden="true"
          class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(100,220,255,0.06),transparent_70%)] pointer-events-none"
        />
        <div class="relative z-[1] max-w-3xl">
          <div class="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-bold leading-[1.1] tracking-tight mb-4">
            <span class="text-bone">Uni</span>
            <span class="text-cyan">Teia</span>
          </div>
          <p class="text-lg md:text-xl text-bone-muted leading-relaxed max-w-2xl mx-auto mb-8">
            Aether OS — a camada de curadoria que transforma ruído em sinal.
            <br />
            <span class="text-sm text-bone/50">
              8 idiomas · curadoria perene · qualidade em 7 gates
            </span>
          </p>
          <div class="flex flex-wrap gap-4 justify-center mb-12">
            <a
              href={`/${lang.value}/signals`}
              class="inline-flex items-center gap-2 px-6 py-3 bg-cyan/20 border border-cyan/50 text-cyan hover:bg-cyan/30 transition-colors rounded-none text-sm uppercase tracking-wider font-medium"
            >
              Explorar Tópicos
            </a>
            <a
              href={`/${lang.value === 'pt' ? 'en' : lang.value}/signals`}
              class="inline-flex items-center gap-2 px-6 py-3 border border-bone/20 text-bone-muted hover:text-bone hover:border-bone/40 transition-colors rounded-none text-sm uppercase tracking-wider"
            >
              {lang.value === 'pt' ? 'Switch to English' : 'Switch Language'}
            </a>
          </div>
          <div class="flex flex-wrap gap-3 justify-center">
            {SUPPORTED_LANGUAGES.map(l => (
              <a
                key={l.code}
                href={`/${l.code}/signals`}
                class={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                  l.code === lang.value
                    ? 'border-cyan/40 text-cyan bg-cyan/10'
                    : 'border-transparent text-bone-muted hover:text-bone hover:border-bone/20'
                }`}
              >
                {l.code}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
})
