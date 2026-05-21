import { component$ } from '@builder.io/qwik'
import { CinematicDepthCard } from '~/components/cinematic-depth/CinematicDepthCard'
import type { SignalGridItem, SignalGridProps } from './types'

const getQualityBadgeColor = (score: number): string => {
  if (score >= 90) return 'var(--color-acid)'
  if (score >= 70) return 'var(--color-gold)'
  if (score >= 40) return 'var(--color-caution)'
  return 'var(--color-unsafe)'
}

export const SignalGrid = component$<SignalGridProps>(({ signals, class: className }) => {
  return (
    <div class={['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className]}>
      {signals.map(signal => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  )
})

const SignalCard = component$<{ signal: SignalGridItem }>(({ signal }) => {
  return (
    <a href={signal.href} class="block no-underline group">
      <CinematicDepthCard variant="card">
        <div class="p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <span
              class="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded"
              style={{
                color: getQualityBadgeColor(signal.quality_score),
                backgroundColor: 'color-mix(in srgb, var(--color-void) 80%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-cyan) 15%, transparent)',
              }}
            >
              <span class="text-bone-muted">QS</span>
              {signal.quality_score}
            </span>
            <div class="flex items-center gap-2 text-xs text-bone-muted">
              <span class="font-mono">{signal.verdict}</span>
              {signal.locales.length > 0 && (
                <span class="flex items-center gap-1">
                  <span aria-hidden="true">🌐</span>
                  {signal.locales.length}
                </span>
              )}
            </div>
          </div>
          <h3 class="font-display text-lg text-bone leading-snug group-hover:text-action transition-colors duration-200 line-clamp-2">
            {signal.title}
          </h3>
          <p class="text-sm text-bone-muted leading-relaxed line-clamp-2">{signal.summary}</p>
        </div>
      </CinematicDepthCard>
    </a>
  )
})

export type { SignalGridItem, SignalGridProps }
