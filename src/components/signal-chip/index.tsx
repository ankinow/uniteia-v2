import { type ClassList, component$, useStylesScoped$ } from '@builder.io/qwik'
import styles from './signal-chip.module.css?inline'

export type SignalChipVariant = 'moderator' | 'researcher' | 'writer' | 'curator' | 'analyst'
export type SignalTrend = 'up' | 'down' | 'stable'
export type QualityBand = 'high' | 'mid' | 'low'

export interface SignalChipProps {
  metric: number
  label: string
  locale?: string
  trend?: SignalTrend
  variant?: SignalChipVariant
  qualityScore?: number
  class?: ClassList
}

export const ALL_VARIANTS: SignalChipVariant[] = [
  'moderator',
  'researcher',
  'writer',
  'curator',
  'analyst',
]
export const ALL_TRENDS: SignalTrend[] = ['up', 'down', 'stable']
export const ALL_QUALITY_BANDS: QualityBand[] = ['high', 'mid', 'low']

/**
 * Map a quality score (0-100) to an OKLCH hue.
 * - 95-100 → cyan-400 (hue 200) — SOTA tier
 * - 90-94  → amber-400 (hue 80) — solid
 * - <90    → rose-400 (hue 25) — needs work
 * Smooth interpolation per rapid-dev pitfall 21: avoids hard threshold jumps.
 */
export function qualityScoreToHue(score: number): string {
  if (score >= 95) return 'oklch(75% 0.18 200)'
  if (score >= 90) return 'oklch(72% 0.165 80)'
  return 'oklch(68% 0.18 25)'
}

export function qualityScoreToBand(score: number): QualityBand {
  if (score >= 95) return 'high'
  if (score >= 90) return 'mid'
  return 'low'
}

/**
 * SignalChip — Qwik ISLAND (static, 0 bytes JS)
 *
 * Migration R28: useStylesScoped$ + data-* attribute selectors
 * replaces global BEM classes (.signal-chip--*).
 * True island: server-render only, no client JS.
 */
export const SignalChip = component$<SignalChipProps>(
  ({ metric, label, locale, trend = 'stable', variant = 'moderator', qualityScore, class: className }) => {
    useStylesScoped$(styles)

    const band = qualityScore !== undefined ? qualityScoreToBand(qualityScore) : undefined
    const hue = qualityScore !== undefined ? qualityScoreToHue(qualityScore) : undefined
    return (
      <span
        aria-label={`${metric} ${label}${locale ? `, ${locale}` : ''}`}
        class={['root', band ? `root--score-${band}` : null, className]}
        data-variant={variant}
        data-trend={trend}
        data-quality-band={band}
        data-testid="signal-chip"
        style={hue ? { borderLeftColor: hue } : undefined}
      >
        <span class="dot" aria-hidden="true" />
        <span class="metric">{metric}</span>
        <span class="label">{`\u00A0${label}`}</span>
        <span class="trend" aria-hidden="true">
          {trend === 'up' ? '\u25B2' : trend === 'down' ? '\u25BC' : '\u25A0'}
        </span>
      </span>
    )
  }
)
