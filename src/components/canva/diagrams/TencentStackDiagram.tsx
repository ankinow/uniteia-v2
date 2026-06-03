/**
 * TencentStackDiagram — SOTA inline SVG (2026-06)
 *
 * Insight: The 3-tier pattern is real, but the cost ladder is non-linear:
 *   - Lighthouse: $3-15/mo (managed VPS, 1-click apps, snapshots)
 *   - CVM: $20-200/mo (S5 general, SA2 AMD, GN7 GPU)
 *   - EdgeOne: 0.06 USD/GB egress (HTTP/3, WAF, Bot manager at edge)
 *
 * Practical patterns the SOTA stack enables:
 *   - Lighthouse behind EdgeOne = static frontend at $3/mo total
 *   - CVM Spot instances = up to 90% off for batch jobs (interrupt risk)
 *   - EdgeOne + Lighthouse bundle = 30% off for first 12 months
 *   - EdgeOne WebSocket acceleration = real-time apps without VPC peering
 */
import { component$ } from '@builder.io/qwik'

export const TencentStackDiagram = component$(() => {
  return (
    <svg
      viewBox="0 0 420 280"
      class="w-full h-auto"
      role="img"
      aria-label="Tencent Cloud builder stack: EdgeOne CDN egress at top, CVM compute middle, Lighthouse VPS at base. Cost ladder: $3/mo Lighthouse, $20+/mo CVM, $0.06/GB EdgeOne. Patterns: Spot 90% off, EdgeOne + Lighthouse bundle 30% off first 12 months"
    >
      <defs>
        <linearGradient id="tencent-cost-2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="oklch(78% 0.2 145)" />
          <stop offset="100%" stop-color="oklch(65% 0.18 30)" />
        </linearGradient>
      </defs>

      {/* Tier 1: EdgeOne (top, narrow) */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect x="135" y="30" width="170" height="52" fill="oklch(15% 0.02 260 / 0.6)" stroke="oklch(78% 0.2 145)" stroke-width="2" />
        <text x="220" y="50" text-anchor="middle" font-weight="bold" fill="oklch(78% 0.2 145)">EDGEONE</text>
        <text x="220" y="63" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">280+ PoPs · HTTP/3 · WAF</text>
        <text x="220" y="75" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">Bot manager · 0.06 USD/GB</text>
      </g>

      {/* Tier 2: CVM (middle) */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect x="90" y="96" width="260" height="60" fill="oklch(15% 0.02 260 / 0.6)" stroke="oklch(72% 0.165 80)" stroke-width="2" />
        <text x="220" y="116" text-anchor="middle" font-weight="bold" fill="oklch(72% 0.165 80)">CVM</text>
        <text x="220" y="130" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">S5 · SA2 AMD · GN7 GPU</text>
        <text x="220" y="140" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">Spot: up to 90% off (interrupt risk)</text>
        <text x="220" y="150" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">10 Gbps internal network</text>
      </g>

      {/* Tier 3: Lighthouse (bottom, widest) */}
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="oklch(90% 0.02 75)">
        <rect x="30" y="170" width="380" height="64" fill="oklch(15% 0.02 260 / 0.6)" stroke="oklch(75% 0.18 200)" stroke-width="2" />
        <text x="220" y="190" text-anchor="middle" font-weight="bold" fill="oklch(75% 0.18 200)">LIGHTHOUSE</text>
        <text x="220" y="204" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">managed VPS · 1-click apps (WordPress, Ghost, n8n, ntfy)</text>
        <text x="220" y="214" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">snapshot + backup · API · auto-renew</text>
        <text x="220" y="224" text-anchor="middle" font-size="8" fill="oklch(60% 0.02 75)">bundle with EdgeOne → 30% off (12mo)</text>
      </g>

      {/* Cost sidebar (left) */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(65% 0.18 30)">
        <line x1="20" y1="30" x2="20" y2="234" stroke="url(#tencent-cost-2)" stroke-width="3" />
        <text x="14" y="60" text-anchor="end">$0.06/GB</text>
        <text x="14" y="100" text-anchor="end">$20+</text>
        <text x="14" y="125" text-anchor="end" font-size="7" fill="oklch(60% 0.02 75)">+ spot 90%↓</text>
        <text x="14" y="190" text-anchor="end">$3</text>
        <text x="14" y="248" text-anchor="end" font-size="7" fill="oklch(60% 0.02 75)">/mo</text>
      </g>

      {/* Pattern callouts */}
      <g font-family="JetBrains Mono, monospace" font-size="8" fill="oklch(60% 0.02 75)">
        <text x="220" y="258" text-anchor="middle" font-weight="bold" fill="oklch(90% 0.02 75)">SOTA PATTERNS</text>
        <text x="220" y="270" text-anchor="middle">Lighthouse + EdgeOne = static site at $3/mo · CVM Spot = batch at 90%↓</text>
      </g>
    </svg>
  )
})
