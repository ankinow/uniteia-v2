import { $, component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import { LangSwitcherSegmented } from '~/components/lang-switcher'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { updateLangCookie } from '~/i18n/set-lang-cookie'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onGet: RequestHandler = event => {
  onLanguageNegotiation(event)
}

export default component$(() => {
  const lang = useSignal<SupportedLanguage>('en')
  const mounted = useSignal(false)

  useVisibleTask$(() => {
    const el = document.querySelector('[data-negotiated-lang]')
    if (el) {
      const raw = el.getAttribute('data-negotiated-lang')
      const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))
      lang.value = raw && VALID_LANG_CODES.has(raw) ? (raw as SupportedLanguage) : 'en'
    }
    mounted.value = true
  })

  const exploreUrl = useComputed$(() => `/${lang.value}/signals`)
  const switchUrl = useComputed$(() => `/${lang.value === 'pt' ? 'en' : lang.value}/signals`)

  const handleLangChange = $((newLang: SupportedLanguage) => {
    lang.value = newLang
    updateLangCookie(newLang)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/${newLang}`)
    }
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
              href={exploreUrl.value}
              class="inline-flex items-center gap-2 px-6 py-3 bg-cyan/20 border border-cyan/50 text-cyan hover:bg-cyan/30 transition-colors rounded-none text-sm uppercase tracking-wider font-medium focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
            >
              Explorar Tópicos
            </a>
            <a
              href={switchUrl.value}
              class="inline-flex items-center gap-2 px-6 py-3 border border-bone/20 text-bone-muted hover:text-bone hover:border-bone/40 transition-colors rounded-none text-sm uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none"
            >
              {lang.value === 'pt' ? 'Switch to English' : 'Switch Language'}
            </a>
          </div>
          <div class="flex flex-wrap gap-3 justify-center">
            <LangSwitcherSegmented currentLang={lang} onLangChange$={handleLangChange} />
          </div>
        </div>
      </section>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia — Curadoria de Sinais em Inteligência Artificial',
  meta: [
    {
      name: 'description',
      content:
        'Aether OS — a camada de curadoria que transforma ruído em sinal. 8 idiomas · curadoria perene · qualidade em 7 gates.',
    },
    {
      property: 'og:description',
      content: 'Aether OS — a camada de curadoria que transforma ruído em sinal.',
    },
    { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://uniteia.com/' },
    {
      property: 'og:title',
      content: 'UniTeia — Curadoria de Sinais em Inteligência Artificial',
    },
    { property: 'og:site_name', content: 'UniTeia' },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content: 'UniTeia — Curadoria de Sinais em Inteligência Artificial',
    },
    {
      name: 'twitter:description',
      content: 'Aether OS — a camada de curadoria que transforma ruído em sinal. 8 idiomas.',
    },
    { name: 'robots', content: 'index, follow' },
  ],
  links: [{ rel: 'canonical', href: 'https://uniteia.com/' }],
}
