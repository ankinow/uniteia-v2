import { type ClassList, component$ } from '@builder.io/qwik'

export interface QuestProgressProps {
  steps: string[]
  current: number // zero-based index
  class?: ClassList
}

/**
 * QuestProgress — JRPG-styled progress tracker.
 *
 * Steps rendered as diamond shapes (rotated 45deg squares) with labels.
 * - Current step: vine (green) background
 * - Completed steps: vine/50 background with border
 * - Future steps: mid background with raised border
 * - Connecting line between diamonds
 */
export const QuestProgress = component$<QuestProgressProps>(
  ({ steps, current, class: classList }) => {
    return (
      <div
        data-testid="quest-progress"
        class={['quest-progress', classList]}
        role="progressbar"
        tabIndex={0}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={steps.length - 1}
        aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
      >
        <div class="quest-progress-track">
          {steps.map((label, index) => {
            const isCurrent = index === current
            const isCompleted = index < current

            let diamondClass = ''
            if (isCurrent) {
              diamondClass = 'bg-verified'
            } else if (isCompleted) {
              diamondClass = 'bg-verified/50 border border-verified/60'
            } else {
              diamondClass = 'bg-mid border border-[var(--raised)]'
            }

            return (
              <div
                key={label}
                class={['quest-progress-step', isCurrent ? 'quest-progress-step--current' : '']}
              >
                <div class="quest-progress-diamond-wrapper">
                  {/* Connecting line (before diamond, except first) */}
                  {index > 0 && (
                    <div
                      class="quest-progress-line"
                      data-filled={isCompleted || isCurrent ? 'true' : 'false'}
                      aria-hidden="true"
                    />
                  )}

                  {/* Diamond */}
                  <div
                    class={['quest-progress-diamond', diamondClass]}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {/* Empty — diamond is just the rotated square */}
                  </div>
                </div>

                {/* Label */}
                <span
                  class={['quest-progress-label', isCurrent ? 'text-action' : 'text-bone-muted']}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <style>{`
          .quest-progress {
            display: inline-flex;
            flex-direction: column;
            width: 100%;
          }

          .quest-progress-track {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            gap: 0;
          }

          .quest-progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            min-width: 0;
          }

          .quest-progress-diamond-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .quest-progress-diamond {
            width: 16px;
            height: 16px;
            transform: rotate(45deg);
            flex-shrink: 0;
            position: relative;
            z-index: 1;
          }

          .quest-progress-line {
            height: 2px;
            flex: 1;
            min-width: 8px;
            background-color: var(--mid);
          }

          .quest-progress-line[data-filled="true"] {
            background-color: color-mix(in srgb, var(--vine) 50%, transparent);
          }

          .quest-progress-label {
            margin-top: 0.5rem;
            font-size: 0.6875rem;
            line-height: 1.2;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            padding: 0 0.25rem;
          }

          .quest-progress-step--current .quest-progress-label {
            font-weight: 600;
          }
        `}</style>
      </div>
    )
  }
)
