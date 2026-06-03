import { $, component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import { LangSwitcherSegmented } from '~/components/lang-switcher'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { updateLangCookie } from '~/i18n/set-lang-cookie'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onGet: RequestHandler = event => {
  onLanguageNegotiation(event)
}

// ghost notes — marginalia, opacity-25, select-none
// "we don't want other signals. we want mirrors." — Stanisław Lem, Solaris
// "the difference between the almost right filter and the right filter..." — Twain (adapted)
// "a man gotta have a code. a filter gotta have a cutoff." — Omar Little (adapted)
// "time is a flat circle. noise is a flat line." — Rust Cohle (adapted)
// "when you have eliminated the noise..." — Holmes (adapted)
// "the street finds its own uses" — Gibson
// "read the data. don't narrate it." — Caeiro (adapted)
// "404. so it goes." — Vonnegut

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
  const switchUrl = useComputed$(() => `/${lang.value === 'pt' ? 'en' : 'pt'}/signals`)

  const handleLangChange = $((newLang: SupportedLanguage) => {
    if (newLang === lang.value) return
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    updateLangCookie(newLang).finally(() => {
      if (typeof window !== 'undefined') {
        window.location.href = `/${newLang}/${search}${hash}`
      }
    })
  })

  return (
    <div class="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* ghost note: bottom-right */}
      <span
        class="fixed bottom-4 right-4 text-[10px] font-mono text-gray-300 opacity-25 select-none pointer-events-none z-50"
        aria-hidden="true"
      >
        {'// when you have eliminated the noise...'}
      </span>
      {/* ghost note: top-left */}
      <span
        class="fixed top-4 left-4 text-[10px] font-mono text-gray-300 opacity-25 select-none pointer-events-none z-50 rotate-180"
        aria-hidden="true"
      >
        {'// we don\'t want other signals. we want mirrors.'}
      </span>

      <section class="flex-1 flex flex-col items-center justify-center px-6 py-24 relative">
        <div class="w-full max-w-4xl mx-auto">
          {/* grid background — exposed, CAD-like */}
          <svg
            aria-hidden="true"
            class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" stroke-width="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* ghost note: bottom-left */}
          <span
            class="fixed bottom-4 left-4 text-[10px] font-mono text-gray-300 opacity-25 select-none pointer-events-none z-50"
            aria-hidden="true"
          >
            {'// a man gotta have a code. a filter gotta have a cutoff.'}
          </span>

          <div class="relative z-[1] flex flex-col items-start gap-6 max-w-2xl">
            {/* hero block — §4.8 */}
            <div class="flex flex-col items-start gap-2">
              <h1 class="font-mono text-2xl md:text-4xl text-gray-900 tracking-tight font-medium">
                UniTeia <span class="text-cyan-600">OS</span>
              </h1>
              <p class="font-mono text-sm text-gray-500 max-w-xl">
                8 langs · 7-stage pipeline · no metaphors
              </p>
            </div>

            {/* SVG system architecture diagram — §5.2 */}
            <svg
              width="600"
              height="200"
              viewBox="0 0 600 200"
              role="img"
              aria-label="UniTeia OS pipeline: raw → gate_1 → ... → signal"
              class="w-full h-auto opacity-80 max-w-xl"
            >
              <title>UniTeia OS pipeline diagram</title>
              <rect x="20" y="80" width="80" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-400" />
              <text x="60" y="105" text-anchor="middle" class="text-[10px] font-mono fill-gray-500">raw</text>

              <line x1="100" y1="100" x2="140" y2="100" stroke="currentColor" stroke-width="1" class="text-gray-300" />

              <rect x="140" y="80" width="80" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-400" />
              <text x="180" y="105" text-anchor="middle" class="text-[10px] font-mono fill-gray-500">gate_1</text>

              <line x1="220" y1="100" x2="260" y2="100" stroke="currentColor" stroke-width="1" class="text-gray-300" />

              <rect x="260" y="80" width="80" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="1" class="text-gray-400" />
              <text x="300" y="105" text-anchor="middle" class="text-[10px] font-mono fill-gray-500">...</text>

              <line x1="340" y1="100" x2="380" y2="100" stroke="currentColor" stroke-width="1" class="text-gray-300" stroke-dasharray="4 2" />

              <rect x="380" y="80" width="80" height="40" rx="2" fill="none" stroke="currentColor" stroke-width="1" class="text-cyan-600" />
              <text x="420" y="105" text-anchor="middle" class="text-[10px] font-mono fill-cyan-700">signal</text>

              {/* marginalia — ghost notes within SVG */}
              <text x="580" y="20" text-anchor="end" class="text-[8px] font-mono fill-gray-300 opacity-50">{'// we don\'t want other worlds'}</text>
              <text x="580" y="190" text-anchor="end" class="text-[8px] font-mono fill-gray-300 opacity-50">{'// when you have eliminated the noise...'}</text>
            </svg>

            {/* CTA links — minimal, structural */}
            <div class="flex flex-wrap gap-3 pt-2">
              <a
                href={exploreUrl.value}
                class="inline-flex items-center px-4 py-2 font-mono text-sm text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
              >
                /explore
              </a>
              <a
                href={switchUrl.value}
                class="inline-flex items-center px-4 py-2 font-mono text-sm text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
              >
                /lang:{lang.value === 'pt' ? 'en' : 'pt'}
              </a>
            </div>

            {/* language switcher — inline */}
            <div class="pt-4">
              <LangSwitcherSegmented currentLang={lang} onLangChange$={handleLangChange} />
            </div>
          </div>
        </div>
      </section>

      {/* ghost note: data-attributes for DevTools */}
      <div
        data-architect="gibson"
        data-note="the street finds its own uses"
        data-pipeline="v7"
        data-altruism="free-public-infrastructure"
        class="hidden"
      />
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia OS',
  meta: [
    {
      name: 'description',
      content: 'Aether OS. Signal filtering system. 8 languages. 7-stage pipeline.',
    },
    {
      property: 'og:description',
      content: 'Aether OS. Signal filtering system.',
    },
    { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://uniteia.com/' },
    {
      property: 'og:title',
      content: 'UniTeia OS',
    },
    { property: 'og:site_name', content: 'UniTeia OS' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content: 'UniTeia OS',
    },
    {
      name: 'twitter:description',
      content: 'Aether OS. 8 languages.',
    },
    { name: 'robots', content: 'index, follow' },
  ],
  links: [{ rel: 'canonical', href: 'https://uniteia.com/' }],
}
