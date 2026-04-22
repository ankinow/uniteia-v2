import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { QualityRingProps } from './types'

/** Color mapping per score range — matches SolarLanso palette */
function getScoreColor(score: number): string {
  if (score >= 70) return '#00E0FF' // cyan — trusted
  if (score >= 40) return '#C8A56D' // bronze — caution
  return '#5CD68F' // vine — flagged
}

/**
 * QualityRing — animated circular gauge showing quality score.
 * R012 compliant: stroke-dashoffset transition ≤250ms.
 */
export const QualityRing = component$<QualityRingProps>(
  ({ score, lang, size = 64, strokeWidth = 4, class: className }) => {
    const animatedOffset = useSignal(0)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    // Dash offset: full circle = no fill, 0 = full fill
    const targetOffset = circumference - (score / 100) * circumference
    const color = getScoreColor(score)

    // Clamp score to 0-100
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)))

    // Animate on mount
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      // Start fully hidden, then animate to target
      animatedOffset.value = circumference
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animatedOffset.value = targetOffset
        })
      })
    })

    return (
      <div
        data-testid={`quality-ring-${clampedScore}`}
        data-lang={lang}
        class={['inline-flex flex-col items-center', className]}
        role="img"
        aria-label={`Quality score: ${clampedScore} out of 100`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          class="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            stroke-width={strokeWidth}
            class="text-bone/10"
          />
          {/* Score ring — animated */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            stroke-width={strokeWidth}
            stroke-linecap="round"
            stroke-dasharray={circumference}
            stroke-dashoffset={animatedOffset.value}
            style={{
              transition: 'stroke-dashoffset 250ms ease-out',
            }}
          />
        </svg>
        {/* Score number centered */}
        <span
          class="mt-1 text-xs font-medium text-bone"
          style={{ marginTop: `-${size / 2 + 8}px`, marginBottom: `${size / 2 - 8}px` }}
        >
          {clampedScore}
        </span>
      </div>
    )
  }
)
