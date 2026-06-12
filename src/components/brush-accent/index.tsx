import { component$ } from '@builder.io/qwik'

export interface BrushAccentProps {
  color?: 'gold' | 'amber' | 'ember' | 'rose' | undefined
  width?: 'sm' | 'md' | 'lg' | undefined
  class?: string | undefined
}

export const BrushAccent = component$<BrushAccentProps>(
  ({ color = 'gold', width = 'md', class: className }) => {
    const colorMap: Record<string, string> = {
      gold: 'var(--sp-gold)',
      amber: 'var(--sp-amber)',
      ember: 'var(--sp-ember)',
      rose: 'var(--sp-rose)',
    }

    const widthMap: Record<string, string> = {
      sm: 'h-1',
      md: 'h-1.5',
      lg: 'h-2',
    }

    const accentColor = colorMap[color] || colorMap.gold

    return (
      <div
        class={['brush-stroke', widthMap[width], className].filter(Boolean).join(' ')}
        style={{
          background: `linear-gradient(175deg, transparent 0%, ${accentColor} 30%, var(--sp-ember) 60%, var(--sp-gold) 90%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
    )
  }
)
