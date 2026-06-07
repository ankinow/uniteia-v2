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
    <div class="max-w-4xl mx-auto px-4 py-12 text-bone">
      <header class="mb-12">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-bone mb-2">
          Aether OS <span class="text-action/60">PA∞</span>
        </h1>
        <p class="text-bone-muted text-lg">
          The autonomous pipeline that builds and curates {t.seo.siteName}.
        </p>
      </header>

      {/* Pipeline overview */}
      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">Pipeline PA∞</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 'Σ', label: 'Audit', desc: 'MCP full discovery + zero-trust scan' },
            { step: 'Δ', label: 'Diagnose', desc: 'Root cause per bug + gap analysis' },
            { step: 'Ω', label: 'Fix', desc: 'Surgical patches, preserve 29 tests + 80 pages' },
            { step: '⊕', label: 'Verify', desc: '8 locales + visual + a11y + Eval-D⁹' },
          ].map(s => (
            <div key={s.step} class="border border-action/20 rounded p-4 bg-void/40">
              <div class="text-2xl text-action mb-1">{s.step}</div>
              <div class="font-semibold text-sm mb-1">{s.label}</div>
              <div class="text-xs text-bone-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Gates */}
      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">7 Quality Gates</h2>
        <ul class="space-y-3">
          {[
            'Lint & Format (Biome)',
            'Type check (TypeScript strict)',
            'Unit tests + i18n 100% key consistency (22 tests)',
            'Build (81 SSG pages, 8 locales)',
            'Visual regression + E2E (Playwright)',
            'Content graph verification + slug check',
            'Deploy via Cloudflare Pages + cache headers',
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
        <h2 class="text-xl font-semibold mb-4">8 Locales · 127+ Keys · 100% Coverage</h2>
        <p class="text-sm text-bone-muted mb-4">
          Every translation file is validated against the canonical English source. Missing keys,
          extra keys, and count mismatches fail the build. Pre-commit hook + ship:check enforce
          consistency across {['EN', 'PT', 'ES', 'FR', 'DE', 'IT', 'JA', 'ZH'].join(' · ')}.
        </p>
      </section>

      {/* Footer badge */}
      <footer class="border-t border-action/10 pt-6 mt-12 text-center">
        <p class="text-xs text-bone-muted">
          Built with <span class="font-mono text-action/80">PA∞ v0.14</span> ·{' '}
          <a
            href="https://github.com/ankinow/uniteia-v2"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:text-action transition-colors"
          >
            Source
          </a>
        </p>
      </footer>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Aether OS PA∞ | UniTeia',
  meta: [
    {
      name: 'description',
      content:
        'The autonomous pipeline that builds and curates UniTeia — 7 quality gates, 8 locales, 100% i18n coverage.',
    },
  ],
}
