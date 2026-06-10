/**
 * Aether OS — Pipeline page documenting the PA∞ development system
 * that builds and curates UniTeia.
 */

import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { useI18n } from '~/i18n/context'

export default component$(() => {
  const { t } = useI18n()

  return (
    <div class="mesh-background min-h-screen">
      <div class="max-w-4xl mx-auto px-4 py-12 text-bone relative z-10">
        <header class="mb-12">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-bone mb-2">
            Aether OS <span class="text-action/60">PA∞</span>
          </h1>
          <p class="text-bone-muted text-lg">
            The curation engine powered by the passion of the UniTeia and LERMF team.
          </p>
        </header>

        {/* Pipeline overview */}
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Our Commitment to Vibe-Coders</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: 'Σ',
                label: 'Discover',
                desc: 'Seeking out the most valuable insights globally.',
              },
              {
                step: 'Δ',
                label: 'Filter',
                desc: 'Separating the noise so you can focus on building.',
              },
              {
                step: 'Ω',
                label: 'Design',
                desc: 'Crafting beautiful, high-fidelity visual context.',
              },
              {
                step: '⊕',
                label: 'Empower',
                desc: 'Delivering knowledge across 8 languages with zero friction.',
              },
            ].map(s => (
              <div
                key={s.step}
                class="border border-action/20 rounded p-4 bg-void/40 hover:border-action/40 transition-colors"
              >
                <div class="text-2xl text-action mb-1">{s.step}</div>
                <div class="font-semibold text-sm mb-1">{s.label}</div>
                <div class="text-xs text-bone-muted">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Gates */}
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">The 7 Pillars of Trust</h2>
          <ul class="space-y-3">
            {[
              'Source Verification & Reputation Scoring',
              'Cross-referencing claims against independent data',
              'Surgical localization to preserve technical nuance',
              'High-fidelity visual design for cognitive ease',
              'Zero-glassmorphism rendering for max performance',
              'Accessibility checks for inclusive delivery',
              'Global edge deployment for instant access',
            ].map((gate, idx) => (
              <li key={idx} class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-action/15 text-action text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span class="text-sm">{gate}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* i18n */}
        <section class="mb-12">
          <h2 class="text-xl font-semibold mb-4">Global Reach · 100% Commitment</h2>
          <p class="text-sm text-bone-muted mb-4">
            We believe knowledge should have no borders. Our team meticulously verifies every
            translation to ensure the passion and technical accuracy of our insights resonate
            clearly across {['EN', 'PT', 'ES', 'FR', 'DE', 'IT', 'JA', 'ZH'].join(' · ')}.
          </p>
        </section>

        {/* Footer badge */}
        <footer class="border-t border-action/10 pt-6 mt-12 text-center">
          <p class="text-xs text-bone-muted">Curated with ❤️ by the UniTeia & LERMF Team</p>
        </footer>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Aether OS PA∞ | UniTeia',
  meta: [
    {
      name: 'description',
      content:
        'The autonomous pipeline that builds and curates UniTeia — 7 quality gates, global reach, 100% i18n coverage.',
    },
  ],
}
