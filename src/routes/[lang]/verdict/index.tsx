import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  return (
    <div class="max-w-3xl mx-auto px-4 py-16 text-bone">
      <h1 class="text-3xl md:text-4xl font-display font-bold mb-2">How We Evaluate</h1>
      <p class="text-bone-muted text-lg mb-12">
        Our Verdict system explained — transparent, auditable, and automated.
      </p>

      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">The Verdict Scale</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="border border-green-500/20 bg-green-500/5 rounded-lg p-5">
            <span class="text-green-400 font-mono text-sm font-bold uppercase tracking-wider">
              Trusted
            </span>
            <p class="text-xs text-bone-muted mt-2">
              Verified claims, cited sources, editorial review passed. Quality score ≥ 80.
            </p>
          </div>
          <div class="border border-amber-500/20 bg-amber-500/5 rounded-lg p-5">
            <span class="text-amber-400 font-mono text-sm font-bold uppercase tracking-wider">
              Caution
            </span>
            <p class="text-xs text-bone-muted mt-2">
              Promotional content, unverified claims, or pending review. Quality score 50–79.
            </p>
          </div>
          <div class="border border-red-500/20 bg-red-500/5 rounded-lg p-5">
            <span class="text-red-400 font-mono text-sm font-bold uppercase tracking-wider">
              Flagged
            </span>
            <p class="text-xs text-bone-muted mt-2">
              Factual errors, outdated information, or policy violation. Quality score &lt; 50.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">Quality Score (∅0–100)</h2>
        <p class="text-sm text-bone-muted mb-4">
          Every article receives an automated quality score computed from 7 weighted signals. The
          score is deterministic and auditable — same input always produces the same score.
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-white/10 text-left">
                <th class="py-2 pr-4 font-mono text-xs uppercase tracking-wider text-bone/60">
                  Signal
                </th>
                <th class="py-2 pr-4 font-mono text-xs uppercase tracking-wider text-bone/60">
                  Weight
                </th>
                <th class="py-2 font-mono text-xs uppercase tracking-wider text-bone/60">
                  What it measures
                </th>
              </tr>
            </thead>
            <tbody class="text-bone-muted">
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Source Reputation</td>
                <td class="py-2 pr-4 font-mono tabular-nums">25%</td>
                <td class="py-2">
                  Authority of cited domains (arxiv.org, github.com, official docs score highest)
                </td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Cross-Reference</td>
                <td class="py-2 pr-4 font-mono tabular-nums">20%</td>
                <td class="py-2">Claims corroborated by independent sources</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Freshness</td>
                <td class="py-2 pr-4 font-mono tabular-nums">15%</td>
                <td class="py-2">Recency of data and references (last 6 months weighted higher)</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Depth</td>
                <td class="py-2 pr-4 font-mono tabular-nums">15%</td>
                <td class="py-2">Word count, section count, code examples, data tables</td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Originality</td>
                <td class="py-2 pr-4 font-mono tabular-nums">10%</td>
                <td class="py-2">
                  Unique insights vs generic descriptions (duplicate excerpts penalized)
                </td>
              </tr>
              <tr class="border-b border-white/5">
                <td class="py-2 pr-4 font-mono text-xs">Locale Coverage</td>
                <td class="py-2 pr-4 font-mono tabular-nums">10%</td>
                <td class="py-2">
                  Number of languages the article is available in (8 locales = max score)
                </td>
              </tr>
              <tr>
                <td class="py-2 pr-4 font-mono text-xs">Accessibility</td>
                <td class="py-2 pr-4 font-mono tabular-nums">5%</td>
                <td class="py-2">Alt text, heading hierarchy, semantic HTML, contrast ratios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">The 7 Quality Gates</h2>
        <p class="text-sm text-bone-muted mb-4">
          Before any article reaches you, it passes through 7 automated gates. Any gate failure
          blocks publication.
        </p>
        <ol class="space-y-3 text-sm text-bone-muted">
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">1.</span>
            <span>
              <strong class="text-bone">Source Verification</strong> — Every factual claim must link
              to a verifiable source. Domains rated by reputation database.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">2.</span>
            <span>
              <strong class="text-bone">Cross-Reference Check</strong> — Key claims are checked
              against independent sources. Contradictory claims flagged.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">3.</span>
            <span>
              <strong class="text-bone">Localization Integrity</strong> — All 8 locales must have
              consistent structure. Missing translations block the gate.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">4.</span>
            <span>
              <strong class="text-bone">Visual Design</strong> — Articles must have high-fidelity
              visual assets. Generic or placeholder images rejected.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">5.</span>
            <span>
              <strong class="text-bone">Performance Budget</strong> — Pages must render under 2.5s
              LCP. Bundle size capped at 87KB gzip.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">6.</span>
            <span>
              <strong class="text-bone">Accessibility Audit</strong> — WCAG 2.1 AA compliance.
              Semantic HTML, ARIA labels, focus management, contrast ratios.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="font-mono text-neon-cyan shrink-0">7.</span>
            <span>
              <strong class="text-bone">Global Edge Deployment</strong> — Content served from 330+
              Cloudflare data centers. Cache-validated, zero-latency delivery.
            </span>
          </li>
        </ol>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold mb-4">Transparency Commitments</h2>
        <ul class="space-y-2 text-sm text-bone-muted">
          <li>
            • All quality scores are <strong class="text-bone">deterministic</strong> — computed
            from public algorithms, not human opinion.
          </li>
          <li>
            • The scoring code is <strong class="text-bone">open source</strong> at{' '}
            <a
              href="https://github.com/ankinow/uniteia-mega-factory"
              class="text-neon-cyan hover:underline"
            >
              github.com/ankinow/uniteia-mega-factory
            </a>
            .
          </li>
          <li>
            • Articles with <strong class="text-bone">referral links or promotional codes</strong>{' '}
            are explicitly labeled with a transparency notice.
          </li>
          <li>
            • Verdicts can change. If a source updates or new evidence emerges, scores are
            recalculated within 24 hours.
          </li>
          <li>
            • <strong class="text-bone">We are not journalists.</strong> We are engineers curating
            signals. Our editorial process is automated, not manual. Judge accordingly.
          </li>
        </ul>
      </section>

      <footer class="border-t border-white/5 pt-6 mt-12 text-center">
        <p class="text-xs text-bone-muted">
          Last updated: 2026-06-10 ·{' '}
          <a
            href="https://github.com/ankinow/uniteia-v2/blob/main/src/content-graph/compiler/compile-content-graph.ts"
            class="text-neon-cyan hover:underline"
          >
            Scoring source code
          </a>
        </p>
      </footer>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'How We Evaluate — Verdict System | UniTeia',
  meta: [
    {
      name: 'description',
      content:
        'Transparent explanation of the UniTeia verdict system — how quality scores are computed, what Trusted/Caution/Flagged means, and the 7 quality gates every article passes.',
    },
  ],
}
