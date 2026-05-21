import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { QualityRingProps } from './types'

const getRingColor = (score: number): string => {
  if (score >= 90) return 'var(--color-acid)'
  if (score >= 70) return 'var(--color-gold)'
  if (score >= 40) return 'var(--color-caution)'
  return 'var(--color-unsafe)'
}

export const QualityRing = component$<QualityRingProps>(
  ({ score, size = 48, strokeWidth = 4, label, class: className }) => {
    const clampedScore = Math.max(0, Math.min(100, score))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedScore / 100) * circumference
    const ringColor = getRingColor(clampedScore)
    const dashOffset = useSignal(circumference)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      dashOffset.value = offset
    })

    return (
      <div class={['flex flex-col items-center gap-1', className]}>
        <div
          role="progressbar"
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            class="transform -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-raised)"
              stroke-width={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              stroke-width={strokeWidth}
              stroke-linecap="round"
              stroke-dasharray={circumference}
              stroke-dashoffset={dashOffset.value}
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </svg>
        </div>
        <span class="font-mono font-bold text-sm" style={{ color: ringColor }}>
          {clampedScore}
        </span>
        {label && <span class="text-xs text-bone-muted">{label}</span>}
      </div>
    )
  }
)

export type { QualityRingProps }
