/**
 * MagicaCommandCenterDiagram — SOTA inline SVG (2026-06)
 *
 * Insight: A production router is more than a fan-out — it has 4 layers:
 *   1. Budget gate  — kill the request if cost > limit before calling any model
 *   2. Strategy     — pick model by (latency SLO × price × capability match)
 *   3. Circuit break — if 5xx rate > 30% in 60s, mark provider degraded, skip
 *   4. Telemetry    — emit latency, token count, $ cost per request → feedback loop
 *
 * Pattern visible in: OpenRouter, LiteLLM, Magica, Portkey, Cloudflare AI Gateway.
 */
import { component$ } from '@builder.io/qwik'

export const MagicaCommandCenterDiagram = component$(() => {
  return (
    <svg
      viewBox="0 0 420 280"
      class="w-full h-auto"
      role="img"
      aria-label="Magica command center: prompt enters budget gate, router picks model by latency SLO and price, circuit breaker skips degraded providers, telemetry feeds back to router"
    >
      <defs>
        <linearGradient id="magica-flow-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="oklch(75% 0.18 200)" stop-opacity="0.9" />
          <stop offset="50%" stop-color="oklch(72% 0.165 80)" stop-opacity="0.9" />
          <stop offset="100%" stop-color="oklch(78% 0.2 145)" stop-opacity="0.9" />
        </linearGradient>
        <marker
          id="magica-arrow-2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(75% 0.18 200)" />
        </marker>
        <marker
          id="magica-arrow-rose"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(65% 0.18 30)" />
        </marker>
      </defs>

      {/* Stage labels (top) */}
      <g
        font-family="JetBrains Mono, monospace"
        font-size="8"
        fill="oklch(60% 0.02 75)"
        letter-spacing="0.05em"
      >
        <text x="55" y="20" text-anchor="middle">
          01 BUDGET
        </text>
        <text x="170" y="20" text-anchor="middle">
          02 ROUTER
        </text>
        <text x="280" y="20" text-anchor="middle">
          03 MODELS
        </text>
        <text x="370" y="20" text-anchor="middle">
          04 OUTPUT
        </text>
      </g>

      {/* Stage 1: Budget gate */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect
          x="20"
          y="40"
          width="70"
          height="50"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(65% 0.18 30)"
          stroke-width="1.5"
        />
        <text x="55" y="60" text-anchor="middle" font-weight="bold" fill="oklch(65% 0.18 30)">
          $ GATE
        </text>
        <text x="55" y="78" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">
          cost &lt; $0.05?
        </text>
      </g>

      {/* Stage 2: Router */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect
          x="125"
          y="40"
          width="90"
          height="50"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(75% 0.18 200)"
          stroke-width="2"
        />
        <text x="170" y="60" text-anchor="middle" font-weight="bold" fill="oklch(75% 0.18 200)">
          ROUTER
        </text>
        <text x="170" y="75" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">
          strategy × SLO
        </text>
        <text x="170" y="85" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">
          × circuit
        </text>
      </g>

      {/* Stage 3: Model pool (3 options, only "active" highlighted) */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        {/* GPT-4o — active */}
        <rect
          x="240"
          y="40"
          width="78"
          height="22"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(78% 0.2 145)"
          stroke-width="1.5"
        />
        <text x="279" y="55" text-anchor="middle" fill="oklch(78% 0.2 145)">
          GPT-4o · ok
        </text>
        {/* Claude — active */}
        <rect
          x="240"
          y="66"
          width="78"
          height="22"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(78% 0.2 145)"
          stroke-width="1.5"
        />
        <text x="279" y="81" text-anchor="middle" fill="oklch(78% 0.2 145)">
          Claude · ok
        </text>
        {/* DeepSeek — degraded */}
        <rect
          x="240"
          y="92"
          width="78"
          height="22"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(65% 0.18 30)"
          stroke-width="1"
          stroke-dasharray="3 2"
        />
        <text x="279" y="107" text-anchor="middle" fill="oklch(65% 0.18 30)">
          DeepSeek · down
        </text>
      </g>

      {/* Stage 4: Output */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect
          x="345"
          y="55"
          width="60"
          height="50"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(78% 0.2 145)"
          stroke-width="1.5"
        />
        <text x="375" y="78" text-anchor="middle" font-weight="bold" fill="oklch(78% 0.2 145)">
          200 OK
        </text>
        <text x="375" y="92" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">
          + tokens
        </text>
        <text x="375" y="102" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">
          + $ cost
        </text>
      </g>

      {/* Forward flow */}
      <g
        fill="none"
        stroke="url(#magica-flow-2)"
        stroke-width="1.5"
        marker-end="url(#magica-arrow-2)"
      >
        <path d="M 90 65 L 125 65" />
        <path d="M 215 65 L 240 55" />
        <path d="M 215 65 L 240 80" />
        <path d="M 318 55 L 345 70" />
        <path d="M 318 80 L 345 80" />
      </g>

      {/* X on degraded model */}
      <g stroke="oklch(65% 0.18 30)" stroke-width="1.5" opacity="0.7">
        <line x1="305" y1="92" x2="313" y2="115" />
        <line x1="313" y1="92" x2="305" y2="115" />
      </g>
      <text
        x="330"
        y="120"
        font-family="JetBrains Mono, monospace"
        font-size="7"
        fill="oklch(65% 0.18 30)"
      >
        circuit OPEN
      </text>

      {/* Telemetry loop */}
      <path
        d="M 375 105 Q 375 165, 300 175 Q 200 185, 170 175 Q 100 175, 100 130"
        fill="none"
        stroke="oklch(72% 0.165 80)"
        stroke-width="1"
        stroke-dasharray="3 2"
        opacity="0.7"
        marker-end="url(#magica-arrow-2)"
      />
      <text
        x="230"
        y="200"
        text-anchor="middle"
        font-family="JetBrains Mono, monospace"
        font-size="8"
        fill="oklch(72% 0.165 80)"
      >
        telemetry feedback
      </text>
      <text
        x="230"
        y="212"
        text-anchor="middle"
        font-family="JetBrains Mono, monospace"
        font-size="7"
        fill="oklch(60% 0.02 75)"
      >
        latency · tokens · $ · 5xx-rate
      </text>

      {/* Reject path (budget exceeded) */}
      <path
        d="M 55 90 L 55 130"
        fill="none"
        stroke="oklch(65% 0.18 30)"
        stroke-width="1.2"
        stroke-dasharray="2 2"
        marker-end="url(#magica-arrow-rose)"
      />
      <text
        x="55"
        y="146"
        text-anchor="middle"
        font-family="JetBrains Mono, monospace"
        font-size="7"
        fill="oklch(65% 0.18 30)"
      >
        429 budget
      </text>

      {/* Insight callout */}
      <g font-family="JetBrains Mono, monospace" font-size="8" fill="oklch(60% 0.02 75)">
        <text x="20" y="240" font-weight="bold" fill="oklch(90% 0.02 75)">
          INSIGHT
        </text>
        <text x="20" y="252">
          circuit-breaker + budget gate = 40% cost↓ vs single-provider
        </text>
        <text x="20" y="262">
          degraded provider skipped within 60s of 5xx spike
        </text>
      </g>
    </svg>
  )
})
