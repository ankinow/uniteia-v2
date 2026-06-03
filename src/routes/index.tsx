import { $, component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import { LangSwitcherSegmented } from '~/components/lang-switcher'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { updateLangCookie } from '~/i18n/set-lang-cookie'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onGet: RequestHandler = event => {
  onLanguageNegotiation(event)
}

const SVG_GRID_SIZE = 32
const PANEL_BORDER = 'border-2 border-bone/20'

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
    <div class="min-h-screen flex flex-col bg-void text-bone relative overflow-hidden">

      {/* ── background texture + grid ── */}
      <svg aria-hidden="true" class="fixed inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          {/* manga screentone dot pattern */}
          <pattern id="screentone" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.6" fill="currentColor" class="text-bone/5" />
          </pattern>
          {/* structural grid */}
          <pattern id="manga-grid" width={SVG_GRID_SIZE} height={SVG_GRID_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${SVG_GRID_SIZE} 0 L 0 0 0 ${SVG_GRID_SIZE}`} fill="none" stroke="currentColor" stroke-width="0.3" class="text-bone/8" />
          </pattern>
          {/* grain noise filter */}
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#screentone)" />
        <rect width="100%" height="100%" fill="url(#manga-grid)" />
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── manga speed lines — decorative ── */}
      <svg aria-hidden="true" class="fixed top-0 right-0 h-full w-32 pointer-events-none z-0 opacity-20">
        <defs>
          <linearGradient id="speed-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="transparent" />
            <stop offset="100%" stop-color="currentColor" class="text-bone" />
          </linearGradient>
        </defs>
        {[
          { x: 83, y1: 20, y2: 60, w: 1.0, o: 0.3 },
          { x: 86, y1: 50, y2: 110, w: 1.5, o: 0.5 },
          { x: 89, y1: 80, y2: 160, w: 0.8, o: 0.4 },
          { x: 92, y1: 110, y2: 210, w: 1.2, o: 0.6 },
          { x: 95, y1: 140, y2: 260, w: 1.0, o: 0.3 },
          { x: 98, y1: 170, y2: 310, w: 1.8, o: 0.5 },
          { x: 101, y1: 200, y2: 360, w: 0.9, o: 0.4 },
          { x: 104, y1: 230, y2: 410, w: 1.3, o: 0.6 },
          { x: 107, y1: 260, y2: 460, w: 1.1, o: 0.3 },
          { x: 110, y1: 290, y2: 510, w: 1.6, o: 0.5 },
          { x: 113, y1: 320, y2: 560, w: 0.7, o: 0.4 },
          { x: 116, y1: 350, y2: 610, w: 1.4, o: 0.6 },
          { x: 119, y1: 380, y2: 660, w: 1.0, o: 0.3 },
        ].map((l, i) => (
          <line
            key={i}
            x1={l.x}
            y1={l.y1}
            x2={120}
            y2={l.y2}
            stroke="url(#speed-fade)"
            stroke-width={l.w}
            opacity={l.o}
          />
        ))}
      </svg>

      {/* ── ghost notes ── */}
      <span class="fixed bottom-4 right-4 text-[10px] font-mono text-bone/25 select-none pointer-events-none z-50" aria-hidden="true">
        {'// when you have eliminated the noise...'}
      </span>
      <span class="fixed top-4 left-4 text-[10px] font-mono text-bone/25 select-none pointer-events-none z-50" aria-hidden="true">
        {'// para o olho nu, tudo é sujeito.'}
      </span>
      <span class="fixed bottom-4 left-4 text-[10px] font-mono text-bone/25 select-none pointer-events-none z-50" aria-hidden="true">
        {'// 404. so it goes.'}
      </span>

      {/* ── main content ── */}
      <section class="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 relative z-10">
        <div class="w-full max-w-6xl mx-auto space-y-10">

          {/* ═══════════════ PANEL 1: HERO ═══════════════ */}
          <div class={`${PANEL_BORDER} bg-deep/80 p-6 md:p-10`}>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div class="space-y-3">
                <h1 class="font-display text-4xl md:text-6xl text-bone leading-tight tracking-tight">
                  Uni<span class="text-cyan">Teia</span>
                  <span class="text-bone/40 text-xl md:text-2xl ml-2 font-mono">OS</span>
                </h1>
                <p class="font-mono text-sm md:text-base text-bone-muted/80 max-w-2xl leading-relaxed">
                  8 langs · 7-stage pipeline · no metaphors
                </p>
              </div>
              {/* manga-style decorative corner badge */}
              <div class={`${PANEL_BORDER} px-4 py-2 bg-void/60 self-end md:self-start`}>
                <span class="font-mono text-[10px] text-bone/40">v7.0 / pipeline</span>
              </div>
            </div>
          </div>

          {/* ═══════════════ PANEL 2: PIPELINE SVG (DOBRADO) ═══════════════ */}
          <div class={`${PANEL_BORDER} bg-deep/80 p-4 md:p-8`}>
            <div class="flex items-center justify-between mb-3">
              <span class="font-mono text-xs text-bone/40">// system architecture</span>
              <span class="font-mono text-[10px] text-bone/20">pipeline:v7</span>
            </div>
            <svg width="100%" height="auto" viewBox="0 0 1200 280" preserveAspectRatio="xMidYMid meet"
              role="img" aria-label="UniTeia OS 7-stage pipeline diagram"
              class="w-full h-auto max-h-[320px]">
              <title>UniTeia OS pipeline: 7 stages from raw input to filtered signal</title>

              {/* stage 1: raw */}
              <rect x="40" y="100" width="100" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-bone/50" />
              <text x="90" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/60">raw</text>
              {/* manga panel border accent — corner ticks */}
              <line x1="40" y1="100" x2="60" y2="100" stroke="currentColor" stroke-width="4" class="text-cyan" />
              <line x1="40" y1="100" x2="40" y2="120" stroke="currentColor" stroke-width="4" class="text-cyan" />

              {/* arrow 1 */}
              <line x1="140" y1="130" x2="180" y2="130" stroke="currentColor" stroke-width="1.5" class="text-bone/30" />
              <polygon points="178,125 190,130 178,135" fill="currentColor" class="text-bone/30" />

              {/* stage 2: gate_1 */}
              <rect x="190" y="100" width="100" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-bone/50" />
              <text x="240" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/60">gate_1</text>
              <line x1="190" y1="100" x2="210" y2="100" stroke="currentColor" stroke-width="4" class="text-cyan" />

              {/* arrow 2 */}
              <line x1="290" y1="130" x2="330" y2="130" stroke="currentColor" stroke-width="1.5" class="text-bone/30" />
              <polygon points="328,125 340,130 328,135" fill="currentColor" class="text-bone/30" />

              {/* stage 3: gate_2 */}
              <rect x="340" y="100" width="100" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-bone/50" />
              <text x="390" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/60">gate_2</text>
              <line x1="340" y1="100" x2="360" y2="100" stroke="currentColor" stroke-width="4" class="text-cyan" />

              {/* arrow 3 */}
              <line x1="440" y1="130" x2="480" y2="130" stroke="currentColor" stroke-width="1.5" class="text-bone/30" stroke-dasharray="4 3" />
              <polygon points="478,125 490,130 478,135" fill="currentColor" class="text-bone/30" />

              {/* stage 4: ... */}
              <rect x="490" y="100" width="100" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4" class="text-bone/40" />
              <text x="540" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/40">...</text>

              {/* arrow 4 */}
              <line x1="590" y1="130" x2="630" y2="130" stroke="currentColor" stroke-width="1.5" class="text-bone/30" stroke-dasharray="4 3" />
              <polygon points="628,125 640,130 628,135" fill="currentColor" class="text-bone/30" />

              {/* stage 5: classify */}
              <rect x="640" y="80" width="120" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-bone/50" />
              <text x="700" y="118" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/60">classify</text>
              {/* secondary path */}
              <rect x="640" y="150" width="120" height="30" rx="0" fill="none" stroke="currentColor" stroke-width="1" class="text-bone/20" />
              <text x="700" y="170" text-anchor="middle" class="text-[8px] font-mono fill-bone/30">confidence: 0.94</text>
              <line x1="640" y1="80" x2="660" y2="80" stroke="currentColor" stroke-width="4" class="text-cyan" />

              {/* arrow 5 */}
              <line x1="760" y1="110" x2="800" y2="110" stroke="currentColor" stroke-width="1.5" class="text-bone/30" />
              <polygon points="798,105 810,110 798,115" fill="currentColor" class="text-bone/30" />

              {/* stage 6: translate */}
              <rect x="810" y="100" width="110" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-bone/50" />
              <text x="865" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-bone/60">translate</text>
              <text x="865" y="155" text-anchor="middle" class="text-[8px] font-mono fill-bone/30">8 locales</text>
              <line x1="810" y1="100" x2="830" y2="100" stroke="currentColor" stroke-width="4" class="text-cyan" />

              {/* arrow 6 */}
              <line x1="920" y1="130" x2="960" y2="130" stroke="currentColor" stroke-width="1.5" class="text-bone/30" />
              <polygon points="958,125 970,130 958,135" fill="currentColor" class="text-bone/30" />

              {/* stage 7: signal — active */}
              <rect x="970" y="100" width="140" height="60" rx="0" fill="none" stroke="currentColor" stroke-width="3" class="text-cyan" />
              <text x="1040" y="138" text-anchor="middle" class="text-xs md:text-sm font-mono fill-cyan font-bold">signal</text>
              {/* double border — manga accent */}
              <rect x="972" y="102" width="136" height="56" rx="0" fill="none" stroke="currentColor" stroke-width="1" class="text-cyan/40" />

              {/* marginalia */}
              <text x="1170" y="25" text-anchor="end" class="text-[8px] font-mono fill-bone/20">// we don't want other worlds</text>
              <text x="1170" y="270" text-anchor="end" class="text-[8px] font-mono fill-bone/20">// the street finds its own uses</text>
            </svg>
          </div>

          {/* ═══════════════ PANEL 3: METRICS + CTA ═══════════════ */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* metric card 1 */}
            <div class={`${PANEL_BORDER} bg-deep/80 p-4 md:p-6 flex flex-col items-start gap-2`}>
              <span class="font-mono text-[10px] text-bone/30">// stages</span>
              <span class="font-display text-3xl md:text-4xl text-bone">7</span>
              <span class="font-mono text-xs text-bone/50">pipeline gates</span>
            </div>
            {/* metric card 2 */}
            <div class={`${PANEL_BORDER} bg-deep/80 p-4 md:p-6 flex flex-col items-start gap-2`}>
              <span class="font-mono text-[10px] text-bone/30">// languages</span>
              <span class="font-display text-3xl md:text-4xl text-bone">8</span>
              <span class="font-mono text-xs text-bone/50">locales</span>
            </div>
            {/* metric card 3 — CTA */}
            <div class={`${PANEL_BORDER} bg-cyan/5 border-cyan/20 p-4 md:p-6 flex flex-col items-start gap-3`}>
              <span class="font-mono text-[10px] text-cyan/40">// explore</span>
              <div class="flex flex-wrap gap-2 pt-1">
                <a href={exploreUrl.value}
                  class="inline-flex items-center px-4 py-2 font-mono text-sm text-bone border-2 border-bone/30 hover:bg-bone/10 hover:border-bone/60 transition-colors focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none">
                  /explore
                </a>
                <a href={switchUrl.value}
                  class="inline-flex items-center px-4 py-2 font-mono text-sm text-bone/50 border-2 border-bone/10 hover:text-bone/80 hover:border-bone/30 transition-colors focus-visible:ring-2 focus-visible:ring-cyan/50 focus-visible:outline-none">
                  /lang:{lang.value === 'pt' ? 'en' : 'pt'}
                </a>
              </div>
            </div>
          </div>

          {/* ═══════════════ PANEL 4: DECORATIVE SVG ASSETS ═══════════════ */}
          <div class={`${PANEL_BORDER} bg-deep/80 p-4 md:p-6`}>
            <div class="flex items-center justify-between mb-3">
              <span class="font-mono text-xs text-bone/40">// signal flow — detail</span>
              <span class="font-mono text-[10px] text-bone/20">manga-style v1</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* SVG mini-panel 1 */}
              <div class="border border-bone/10 p-3 bg-void/40 flex flex-col items-center gap-2">
                <svg width="80" height="60" viewBox="0 0 80 60" class="w-full h-auto">
                  <rect x="5" y="15" width="30" height="30" rx="0" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                  <line x1="10" y1="15" x2="15" y2="15" stroke="currentColor" stroke-width="3" class="text-cyan" />
                  <line x1="35" y1="30" x2="50" y2="30" stroke="currentColor" stroke-width="1" class="text-bone/20" />
                  <polygon points="48,26 55,30 48,34" fill="currentColor" class="text-bone/20" />
                  <circle cx="62" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                </svg>
                <span class="font-mono text-[8px] text-bone/30">ingest</span>
              </div>
              {/* SVG mini-panel 2 */}
              <div class="border border-bone/10 p-3 bg-void/40 flex flex-col items-center gap-2">
                <svg width="80" height="60" viewBox="0 0 80 60" class="w-full h-auto">
                  <rect x="5" y="10" width="30" height="20" rx="0" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                  <rect x="5" y="35" width="30" height="15" rx="0" fill="none" stroke="currentColor" stroke-width="1" class="text-bone/20" />
                  <line x1="35" y1="20" x2="50" y2="20" stroke="currentColor" stroke-width="1" class="text-bone/20" />
                  <line x1="35" y1="42" x2="50" y2="42" stroke="currentColor" stroke-width="1" class="text-bone/20" />
                  <circle cx="62" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                  <rect x="55" y="35" width="14" height="14" rx="0" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/30" />
                </svg>
                <span class="font-mono text-[8px] text-bone/30">filter</span>
              </div>
              {/* SVG mini-panel 3 */}
              <div class="border border-bone/10 p-3 bg-void/40 flex flex-col items-center gap-2">
                <svg width="80" height="60" viewBox="0 0 80 60" class="w-full h-auto">
                  <line x1="10" y1="40" x2="70" y2="10" stroke="currentColor" stroke-width="1" class="text-bone/20" stroke-dasharray="3 2" />
                  <line x1="10" y1="40" x2="30" y2="30" stroke="currentColor" stroke-width="2" class="text-cyan" />
                  <circle cx="10" cy="40" r="4" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                  <circle cx="30" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan" />
                  <rect x="45" y="15" width="25" height="25" rx="0" fill="none" stroke="currentColor" stroke-width="1.5" class="text-bone/40" />
                </svg>
                <span class="font-mono text-[8px] text-bone/30">route</span>
              </div>
              {/* SVG mini-panel 4 */}
              <div class="border border-bone/10 p-3 bg-void/40 flex flex-col items-center gap-2">
                <svg width="80" height="60" viewBox="0 0 80 60" class="w-full h-auto">
                  <rect x="10" y="15" width="50" height="30" rx="0" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan/60" />
                  <rect x="12" y="17" width="46" height="26" rx="0" fill="none" stroke="currentColor" stroke-width="1" class="text-cyan/30" />
                  <text x="35" y="35" text-anchor="middle" class="text-[10px] font-mono fill-cyan">✓</text>
                </svg>
                <span class="font-mono text-[8px] text-bone/30">signal</span>
              </div>
            </div>
          </div>

          {/* ═══════════════ PANEL 5: LANG SWITCHER ═══════════════ */}
          <div class={`${PANEL_BORDER} bg-deep/80 p-4 md:p-6`}>
            <div class="flex items-center justify-between flex-wrap gap-4">
              <span class="font-mono text-xs text-bone/40">// language selector</span>
              <LangSwitcherSegmented currentLang={lang} onLangChange$={handleLangChange} />
            </div>
          </div>

        </div>
      </section>

      {/* hidden data attributes */}
      <div data-architect="gibson" data-note="the street finds its own uses" data-pipeline="v7" data-altruism="free-public-infrastructure" class="hidden" />
    </div>
  )
})

export const head: DocumentHead = {
  title: 'UniTeia OS',
  meta: [
    { name: 'description', content: 'UniTeia OS. Signal filtering system. 8 languages. 7-stage pipeline.' },
    { property: 'og:description', content: 'UniTeia OS. Signal filtering system.' },
    { property: 'og:image', content: 'https://uniteia.com/og-image.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://uniteia.com/' },
    { property: 'og:title', content: 'UniTeia OS' },
    { property: 'og:site_name', content: 'UniTeia OS' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'UniTeia OS' },
    { name: 'twitter:description', content: 'UniTeia OS. 8 languages.' },
    { name: 'robots', content: 'index, follow' },
  ],
  links: [{ rel: 'canonical', href: 'https://uniteia.com/' }],
}
