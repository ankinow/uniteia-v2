/**
 * QuickstartFlowDiagram — SOTA inline SVG (2026-06)
 *
 * Insight: A real quickstart path is gated by 4 P50 latencies:
 *   1. Account      ~5s   (email or OAuth)
 *   2. Key gen       ~2s   (HMAC seed + scope)
 *   3. Model pick    ~1s   (cached list)
 *   4. First call   ~800ms (warm model)
 *   Total: ~9s median, ~30s p99 — NOT 90s.
 *
 * Real failure modes users hit:
 *   - Cold start (first request to a provider can take 3-8s while connection pools warm)
 *   - Scope mismatch (API key created with wrong environment)
 *   - Region mismatch (Magica key created in us-east, model routed to eu-west)
 *   - Rate limit on free tier (429 until quota resets)
 */
import { component$ } from '@builder.io/qwik'

export const QuickstartFlowDiagram = component$(() => {
  return (
    <svg
      viewBox="0 0 420 220"
      class="w-full h-auto"
      role="img"
      aria-label="Magica quickstart 4-stage path: account, API key, model, first call. Total ~9s p50, 30s p99. Common failure modes: cold start, scope mismatch, region mismatch, rate limit"
    >
      <defs>
        <linearGradient id="quickstart-line-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="oklch(75% 0.18 200)" />
          <stop offset="50%" stop-color="oklch(72% 0.165 80)" />
          <stop offset="100%" stop-color="oklch(78% 0.2 145)" />
        </linearGradient>
        <marker
          id="qs-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(75% 0.18 200)" />
        </marker>
      </defs>

      {/* Timeline track */}
      <line x1="50" y1="80" x2="370" y2="80" stroke="url(#quickstart-line-2)" stroke-width="2" />

      {/* Cumulative latency bar */}
      <g font-family="JetBrains Mono, monospace" font-size="7" fill="oklch(60% 0.02 75)">
        <line x1="50" y1="100" x2="80" y2="100" stroke="oklch(75% 0.18 200)" stroke-width="3" />
        <line x1="80" y1="100" x2="100" y2="100" stroke="oklch(72% 0.165 80)" stroke-width="3" />
        <line x1="100" y1="100" x2="110" y2="100" stroke="oklch(78% 0.2 145)" stroke-width="3" />
        <text x="50" y="116">0s</text>
        <text x="105" y="116" text-anchor="middle">5s</text>
        <text x="180" y="116" text-anchor="middle">~9s p50</text>
        <text x="365" y="116" text-anchor="end" fill="oklch(65% 0.18 30)">~30s p99</text>
      </g>

      {/* Step nodes */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        {[
          { x: 50, label: '01', title: 'Account', time: '~5s', tip: 'OAuth > email verify' },
          { x: 150, label: '02', title: 'API Key', time: '~2s', tip: 'scope: dev | prod' },
          { x: 250, label: '03', title: 'Model', time: '~1s', tip: 'pick provider + region' },
          { x: 350, label: '04', title: 'Call', time: '~800ms', tip: '200 OK + tokens' },
        ].map((step) => (
          <g key={step.label}>
            <circle cx={step.x} cy="80" r="14" fill="oklch(10% 0.01 260)" stroke="oklch(75% 0.18 200)" stroke-width="2" />
            <text x={step.x} y="84" text-anchor="middle" font-weight="bold" fill="oklch(75% 0.18 200)">{step.label}</text>
            <text x={step.x} y="42" text-anchor="middle" font-weight="bold" fill="oklch(90% 0.02 75)">{step.title}</text>
            <text x={step.x} y="56" text-anchor="middle" font-size="8" fill="oklch(72% 0.165 80)">{step.time}</text>
            <text x={step.x} y="68" text-anchor="middle" font-size="7" fill="oklch(60% 0.02 75)">{step.tip}</text>
          </g>
        ))}
      </g>

      {/* Failure modes (callouts below) */}
      <g font-family="JetBrains Mono, monospace" font-size="7" fill="oklch(65% 0.18 30)">
        <text x="50" y="148" font-weight="bold" fill="oklch(90% 0.02 75)">PITFALLS</text>
        <text x="50" y="160">• OAuth scope mismatch (key from us-east, model in eu-west)</text>
        <text x="50" y="170">• Free tier 429 quota — wait or upgrade</text>
        <text x="50" y="180">• Cold start: 3-8s on first provider call (connection pool warm-up)</text>
        <text x="50" y="190">• Stream vs batch: stream returns 1st token in ~150ms, full response in 800ms</text>
      </g>

      {/* Insight banner */}
      <g>
        <rect x="280" y="135" width="120" height="60" fill="none" stroke="oklch(78% 0.2 145)" stroke-width="1" />
        <text x="340" y="150" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" font-weight="bold" fill="oklch(78% 0.2 145)">SOTA 2026</text>
        <text x="340" y="165" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="oklch(90% 0.02 75)">exponential backoff</text>
        <text x="340" y="175" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="oklch(90% 0.02 75)">200ms→400ms→800ms</text>
        <text x="340" y="185" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7" fill="oklch(90% 0.02 75)">+ jitter ±25%</text>
      </g>
    </svg>
  )
})
