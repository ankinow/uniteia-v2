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
 * Map a quality score (0-100) to an OKLCH hue variant of base accents (#0070f3 / #f5a623).
 * - 95-100 → vibrant (high chroma)
 * - 80-94  → muted/pastel (lower chroma, higher lightness)
 * - <80    → very muted
 * Cool variants (moderator, researcher, curator) use blue (hue 260).
 * Warm variants (writer, analyst) use amber (hue 73).
 */
export function qualityScoreToHue(score: number, variant: SignalChipVariant = 'moderator'): string {
  const isWarm = variant === 'writer' || variant === 'analyst'
  const hue = isWarm ? 73 : 260

  if (score >= 95) {
    return isWarm ? 'oklch(76% 0.20 73)' : 'oklch(60% 0.25 260)'
  } else if (score >= 80) {
    return isWarm ? 'oklch(88% 0.09 73)' : 'oklch(85% 0.08 260)'
  } else {
    return isWarm ? 'oklch(94% 0.03 73)' : 'oklch(92% 0.03 260)'
  }
}

export function qualityScoreToBand(score: number): QualityBand {
  if (score >= 95) return 'high'
  if (score >= 80) return 'mid'
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
  ({
    metric,
    label,
    locale,
    trend = 'stable',
    variant = 'moderator',
    qualityScore,
    class: className,
  }) => {
    useStylesScoped$(styles)

    const band = qualityScore !== undefined ? qualityScoreToBand(qualityScore) : undefined
    const hue = qualityScore !== undefined ? qualityScoreToHue(qualityScore, variant) : undefined
    const languageNames: Record<string, string> = {
      en: 'English',
      pt: 'Português',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      ja: '日本語',
      zh: '中文',
    }

    const prepositions: Record<string, string> = {
      en: 'in',
      pt: 'em',
      es: 'en',
      fr: 'en',
      de: 'auf',
      it: 'in',
      ja: 'の',
      zh: '用',
    }

    const langName = locale ? languageNames[locale] || locale : ''
    const prep = locale ? prepositions[locale] || 'in' : ''
    const ariaLabel = locale ? `${metric} ${label} ${prep} ${langName}` : `${metric} ${label}`

    return (
      <span
        role="img"
        aria-label={ariaLabel}
        class={['root', band ? `root--score-${band}` : null, className]}
        data-variant={variant}
        data-trend={trend}
        data-quality-band={band}
        data-testid="signal-chip"
        style={
          hue
            ? ({
                '--chip-accent': hue,
                '--chip-glow': hue.replace(')', ' / 0.35)'),
                borderLeftColor: hue,
              } as any)
            : undefined
        }
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
