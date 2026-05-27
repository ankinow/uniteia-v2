import { component$ } from '@builder.io/qwik'
import { CinematicDepthCard } from '~/components/cinematic-depth/CinematicDepthCard'
import type { SignalGridItem, SignalGridProps } from './types'

const getQualityBadgeColor = (score: number): string => {
  if (score >= 90) return 'var(--color-acid)'
  if (score >= 70) return 'var(--color-gold)'
  if (score >= 40) return 'var(--color-caution)'
  return 'var(--color-unsafe)'
}

const SPANS = [
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-2',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-1 lg:row-span-1',
  'lg:col-span-1 lg:row-span-2',
  'lg:col-span-1 lg:row-span-1',
]

const ROTATIONS = [
  'rotate-0',
  '-rotate-1',
  'rotate-1',
  '-rotate-0.5',
  'rotate-0.5',
  '-rotate-1',
  'rotate-0',
  'rotate-1',
  '-rotate-0.5',
  'rotate-0.5',
]

export const SignalGrid = component$<SignalGridProps>(
  ({ signals, variant = 'tabular', class: className }) => {
    if (variant === 'organic') {
      return (
        <div
          data-testid="signal-grid-organic"
          class={[
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-auto',
            'paper-fiber bg-paper/5 border border-paper-border/20 rounded-xl p-4 sm:p-6',
            className,
          ]}
        >
          {signals.map((signal, i) => (
            <div
              key={signal.id}
              class={[
                SPANS[i % SPANS.length],
                ROTATIONS[i % ROTATIONS.length],
                'transition-transform duration-300 hover:scale-[1.02] hover:z-10',
              ]}
            >
              <SignalCard signal={signal} organic />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div
        data-testid="signal-grid-tabular"
        class={['grid grid-cols-1 sm:grid-cols-2 gap-6', className]}
      >
        {signals.map(signal => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    )
  }
)

const SignalCard = component$<{ signal: SignalGridItem; organic?: boolean }>(
  ({ signal, organic }) => {
    return (
      <a href={signal.href} class="block no-underline group">
        <CinematicDepthCard variant={organic ? 'subtle' : 'card'}>
          <div
            class={[
              'p-5 flex flex-col gap-3',
              organic && 'paper-fiber font-display leading-relaxed text-bone',
            ]}
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded"
                style={{
                  color: getQualityBadgeColor(signal.quality_score),
                  backgroundColor: 'color-mix(in srgb, var(--color-void) 80%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-cyan) 15%, transparent)',
                }}
              >
                <span class="text-bone/80">QS</span>
                <span class="tabular-nums">{signal.quality_score}</span>
              </span>
              <div class="flex items-center gap-2 text-xs text-bone/75">
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
            <p class="text-sm text-bone leading-relaxed line-clamp-2">{signal.summary}</p>
          </div>
        </CinematicDepthCard>
      </a>
    )
  }
)

export type { SignalGridItem, SignalGridProps }
