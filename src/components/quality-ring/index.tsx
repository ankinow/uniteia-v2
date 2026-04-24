import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { getTranslation } from '~/i18n/context'
import { reserveSessionWhisper, useDopamineBudget } from '~/stores/dopamine-budget'
import type { QualityRingProps } from './types'

/** Color mapping per score range — matches SolarLanso palette */
function getScoreColor(score: number): string {
  if (score >= 70) return '#00E0FF' // cyan — trusted
  if (score >= 40) return '#C8A56D' // bronze — caution
  return '#5CD68F' // vine — flagged
}

/**
 * QualityRing — animated circular gauge showing quality score.
 * R012 compliant: stroke-dashoffset transition ≤250ms via --whisper-duration token.
 */
export const QualityRing = component$<QualityRingProps>(
  ({ score, lang, size = 64, strokeWidth = 4, class: className }) => {
    const budget = useDopamineBudget()
    const animatedOffset = useSignal(0)
    const whisperState = useSignal<'pending' | 'armed' | 'spent' | 'blocked'>('pending')
    const t = getTranslation(lang)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Dash offset: full circle = no fill, 0 = full fill
    const targetOffset = circumference - (score / 100) * circumference
    const color = getScoreColor(score)

    // Clamp score to 0-100
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)))

    // Animate on mount — R012: single whisper, ≤250ms
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      track(() => budget.sessionId)
      const decision = reserveSessionWhisper(budget, `quality-ring:${clampedScore}`)
      whisperState.value = decision.allowed
        ? 'armed'
        : decision.reason === 'apex-only'
          ? 'blocked'
          : 'spent'

      if (!decision.allowed) {
        animatedOffset.value = targetOffset
        return
      }

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
        data-testid="quality-ring"
        data-score={clampedScore}
        data-lang={lang}
        data-dopamine-whisper-scope="session"
        data-dopamine-whisper-state={whisperState.value}
        data-dopamine-route-remaining={budget.routeBudget.remaining}
        data-dopamine-session-remaining={budget.sessionBudget.remaining}
        class={['inline-flex flex-col items-center', className]}
        role="img"
        aria-label={`${t.qualityRing.qualityScore}: ${clampedScore}/100 — ${t.qualityRing.editorialQuality}`}
        style={{ '--whisper-duration': '250ms' } as Record<string, string>}
      >
        <div
          class="relative"
          style={{ width: `${size}px`, height: `${size}px` }}
          aria-hidden="true"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} class="-rotate-90">
            <title>{`${t.qualityRing.qualityScore}: ${clampedScore}/100`}</title>
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
            {/* Score ring — animated via --whisper-duration token (R012) */}
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
                transition: 'stroke-dashoffset var(--whisper-duration, 250ms) ease-out',
              }}
            />
          </svg>
          {/* Score number centered within the ring */}
          <span class="absolute inset-0 flex items-center justify-center text-sm font-semibold text-bone">
            {clampedScore}
          </span>
        </div>
      </div>
    )
  }
)
