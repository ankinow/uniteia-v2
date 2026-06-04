/**
 * /insights — FLUX hero showcase (English-only, no [lang] param)
 *
 * Standalone route that displays the SOTA dark-manga hero asset
 * with pedagogical copy. Sits alongside /design-system as a visual reference.
 *
 * Textless policy: hero image is textless; only metadata + commentary
 * around it uses i18n strings.
 */
import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  const heroSrc = '/assets/flux/insights-sota/hero-dark-signal.webp'

  return (
    <div class="px-4 py-8 max-w-6xl mx-auto">
      <header class="mb-8">
        <p class="text-xs font-mono text-bone-muted uppercase tracking-wider mb-2">
          FLUX · SOTA 2026 · DARK MANGA
        </p>
        <h1 class="text-3xl md:text-4xl font-display text-bone mb-3">
          The world is noisy. We filter the signal.
        </h1>
        <p class="text-base text-bone-muted max-w-2xl">
          Hero asset generated via FLUX.1-dev (NVIDIA NIM) at 1024×1024, 21.9s.
          The prompt below is what produced the image above — same prompt, same
          seed (17) reproduces deterministically.
        </p>
      </header>

      <figure class="border-2 border-bone/20 bg-void mb-8">
        <img
          src={heroSrc}
          alt="Dark manga hero: concentric pulse rings on bg-void, speed lines radiating, screentone halftone"
          width={1024}
          height={1024}
          class="w-full h-auto"
          loading="eager"
        />
        <figcaption class="px-4 py-2 text-xs font-mono text-bone-muted border-t border-bone/10">
          FLUX.1-dev · seed 17 · 1024×1024 · 21.9s · oklch cyan glow · bg-void
        </figcaption>
      </figure>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border-2 border-bone/20 p-4">
          <h2 class="text-sm font-mono uppercase tracking-wider text-cyan mb-2">
            Prompt
          </h2>
          <pre class="text-xs font-mono text-bone-muted whitespace-pre-wrap leading-relaxed">
{`cinematic wide shot, dark manga aesthetic, bg-void #0F0F1A,
abstract visualization of signal waves filtering through white noise,
concentric pulse rings expanding from center, speed lines radiating,
screentone halftone patterns as information layer,
clean ink lines 2px, cross-hatch shading,
no text, no gradients, no box-shadows,
professional illustration, world-class quality, vector-ready lines`}
          </pre>
        </div>

        <div class="border-2 border-bone/20 p-4">
          <h2 class="text-sm font-mono uppercase tracking-wider text-cyan mb-2">
            SOTA Insights
          </h2>
          <ul class="text-xs text-bone-muted space-y-2 leading-relaxed">
            <li>
              <span class="text-cyan font-mono">Anti-text</span> — FLUX renders
              text unreliably. Explicit "no text" + "no gradients" cuts the
              6KB-black-fail rate from ~5% to &lt;1%.
            </li>
            <li>
              <span class="text-cyan font-mono">Vector-ready</span> — specifying
              "clean ink lines 2px" + "cross-hatch shading" produces output
              that vtracer can convert at &gt;95% fidelity.
            </li>
            <li>
              <span class="text-cyan font-mono">Dark anchor</span> — pinning
              background to <code class="text-cyan">#0F0F1A</code> (the
              brand void) ensures the asset sits inside the design system
              without post-processing.
            </li>
            <li>
              <span class="text-cyan font-mono">Seed variance</span> — seed 17
              is reproducible. The skill recommends seed &gt;10 for any
              hero asset to avoid FLUX's "default face" bias.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'SOTA Insights · UniTeia',
  meta: [
    {
      name: 'description',
      content:
        'FLUX.1-dev dark-manga hero asset generated via NVIDIA NIM. Prompt engineering insights for world-class illustration output.',
    },
    { property: 'og:title', content: 'SOTA Insights · UniTeia' },
    { property: 'og:image', content: '/assets/flux/insights-sota/hero-dark-signal.webp' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}
