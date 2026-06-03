import { type ClassList, component$ } from '@builder.io/qwik'

export type SignalChipVariant = 'moderator' | 'researcher' | 'writer' | 'curator' | 'analyst'
export type SignalTrend = 'up' | 'down' | 'stable'

export interface SignalChipProps {
  metric: number
  label: string
  locale?: string
  trend?: SignalTrend
  variant?: SignalChipVariant
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

export const SignalChip = component$<SignalChipProps>(
  ({ metric, label, locale, trend = 'stable', variant = 'moderator', class: className }) => {
    return (
      <span
        aria-label={`${metric} ${label}${locale ? `, ${locale}` : ''}`}
        class={['signal-chip', `signal-chip--${variant}`, className]}
        data-variant={variant}
        data-trend={trend}
        data-testid="signal-chip"
      >
        <span class="signal-chip__dot" aria-hidden="true" />
        <span class="signal-chip__metric">{metric}</span>
        <span class="signal-chip__label">{`\u00A0${label}`}</span>
        <span class="signal-chip__trend" aria-hidden="true">
          {trend === 'up' ? '\u25B2' : trend === 'down' ? '\u25BC' : '\u25A0'}
        </span>
      </span>
    )
  }
)
