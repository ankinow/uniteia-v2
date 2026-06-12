import { component$ } from '@builder.io/qwik'

export interface PixelDividerProps {
  motif?: 'diamond' | 'crystal' | 'sword' | 'simple' | undefined
  label?: string | undefined
  class?: string | undefined
}

export const PixelDivider = component$<PixelDividerProps>(
  ({ motif = 'diamond', label, class: className }) => {
    const motifSymbols: Record<string, string> = {
      diamond: '◆',
      crystal: '◇',
      sword: '†',
      simple: '—',
    }

    const symbol = motifSymbols[motif] || motifSymbols.diamond

    return (
      <div
        class={['pixel-divider-diamond', className].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {label ? (
          <>
            <span />
            <span class="shrink-0">
              {symbol} {label} {symbol}
            </span>
            <span />
          </>
        ) : (
          <>
            <span />
            <span class="shrink-0">
              {symbol} {symbol} {symbol}
            </span>
            <span />
          </>
        )}
      </div>
    )
  }
)
