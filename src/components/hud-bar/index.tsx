import { component$ } from '@builder.io/qwik'

export interface HudBarProps {
  value?: number | undefined
  max?: number | undefined
  label?: string | undefined
  variant?: 'health' | 'magic' | 'xp' | 'sunset' | undefined
  class?: string | undefined
}

export const HudBar = component$<HudBarProps>(
  ({ value = 75, max = 100, label, variant = 'sunset', class: className }) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))

    const variantFills: Record<string, string> = {
      health: 'bg-[var(--sp-ember)]',
      magic: 'bg-[var(--sp-cyan)]',
      xp: 'bg-[var(--sp-mint)]',
      sunset: 'hud-bar-fill',
    }

    return (
      <div
        class={['flex flex-col gap-1', className].filter(Boolean).join(' ')}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(pct)}%`}
      >
        {label && (
          <div class="flex justify-between text-xs font-[var(--font-family-pixel)] text-[var(--sp-muted)]">
            <span>{label}</span>
            <span>{Math.round(pct)}%</span>
          </div>
        )}
        <div class="hud-bar w-full">
          <div
            class={['hud-bar-fill', variantFills[variant] || 'hud-bar-fill']
              .filter(Boolean)
              .join(' ')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }
)
