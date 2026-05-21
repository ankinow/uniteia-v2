import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { QualityRingProps } from './types'

const getRingColor = (score: number): string => {
  if (score >= 90) return 'var(--color-acid)'
  if (score >= 70) return 'var(--color-gold)'
  if (score >= 40) return 'var(--color-caution)'
  return 'var(--color-unsafe)'
}

export const QualityRing = component$<QualityRingProps>(
  ({ score, size = 48, strokeWidth = 4, label, class: className, publishedAt }) => {
    const clampedScore = Math.max(0, Math.min(100, score))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = useSignal(circumference)

    const daysSincePublished = publishedAt
      ? Math.floor((Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24))
      : null

    const isStale = daysSincePublished !== null && daysSincePublished > 90
    const isArchived = daysSincePublished !== null && daysSincePublished > 180

    const adjustedScore = Math.max(
      0,
      Math.min(100, clampedScore - (isArchived ? 20 : isStale ? 10 : 0))
    )
    const adjustedOffset = circumference - (adjustedScore / 100) * circumference
    const ringColor = getRingColor(adjustedScore)
    const ringOpacity = isArchived ? 0.4 : isStale ? 0.6 : 1
    const dashArray = isArchived ? '4 6' : isStale ? '8 6' : circumference

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      dashOffset.value = adjustedOffset
    })

    return (
      <div data-testid="quality-ring" class={['flex flex-col items-center gap-1', className]}>
        <div
          role="progressbar"
          aria-valuenow={adjustedScore}
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
              stroke-dasharray={dashArray}
              stroke-dashoffset={dashOffset.value}
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                opacity: ringOpacity,
              }}
            />
          </svg>
        </div>
        <span
          class="font-mono font-bold text-sm"
          style={{ color: ringColor, opacity: ringOpacity }}
        >
          {adjustedScore}
        </span>
        {label && <span class="text-xs text-bone-muted">{label}</span>}
        {daysSincePublished !== null && (
          <span class="text-xs text-bone-muted">{daysSincePublished}d old</span>
        )}
      </div>
    )
  }
)

export type { QualityRingProps }
