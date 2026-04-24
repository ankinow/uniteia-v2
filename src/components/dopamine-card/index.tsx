import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { QualityRing } from '~/components/quality-ring'
import { getTranslation } from '~/i18n/context'
import { reserveRouteWhisper, useDopamineBudget } from '~/stores/dopamine-budget'
import type { DopamineCardProps } from './types'

/**
 * dopamine-card — engaging card with whisper animation.
 * R012 compliant: 1 whisper per viewport (hover-only), max -2px translateY, ≤250ms.
 * Uses CSS custom properties for motion tokens:
 *   --whisper-y: -2px (max translate distance)
 *   --whisper-duration: 250ms (max animation duration)
 * Respects prefers-reduced-motion via motion-reduce: variant.
 */
export const DopamineCard = component$<DopamineCardProps>(
  ({ title, description, href, score, icon, lang, class: className }) => {
    const t = getTranslation(lang)
    const budget = useDopamineBudget()
    const whisperState = useSignal<'pending' | 'armed' | 'spent' | 'blocked'>('pending')

    useVisibleTask$(({ track }) => {
      track(() => budget.pathname)
      const decision = reserveRouteWhisper(budget, `dopamine-card:${href}`)
      whisperState.value = decision.allowed
        ? 'armed'
        : decision.reason === 'apex-only'
          ? 'blocked'
          : 'spent'
    })

    const hoverClass =
      whisperState.value === 'armed'
        ? 'hover:-translate-y-[var(--whisper-y,2px)] hover:border-action'
        : ''

    return (
      <a
        href={href}
        data-testid="dopamine-card"
        data-dopamine-whisper-scope="route"
        data-dopamine-whisper-state={whisperState.value}
        data-dopamine-route-remaining={budget.routeBudget.remaining}
        data-dopamine-session-remaining={budget.sessionBudget.remaining}
        class={[
          'group relative flex flex-col gap-3 rounded-lg border border-action/20 bg-void/raised p-4',
          hoverClass,
          'motion-reduce:hover:translate-y-0',
          className,
        ]}
        style={
          {
            '--whisper-y': '-2px',
            '--whisper-duration': '250ms',
            transitionProperty: 'transform, color, border-color',
            transitionDuration: 'var(--whisper-duration)',
          } as Record<string, string>
        }
        lang={lang}
        aria-disabled={whisperState.value === 'blocked'}
      >
        {/* Header row: icon + title */}
        <div class="flex items-start gap-3">
          {icon && (
            <div
              class={`i-lucide-${icon} mt-0.5 h-5 w-5 shrink-0 text-action`}
              aria-hidden="true"
            />
          )}
          <h3 class="text-base font-semibold text-bone group-hover:text-action transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p class="text-sm text-bone/70 leading-relaxed">{description}</p>

        {/* Footer: QualityRing (if score provided) + read more link */}
        <div class="mt-auto flex items-center justify-between pt-2">
          {score !== undefined && (
            <QualityRing score={score} lang={lang} size={32} strokeWidth={3} />
          )}
          <span class="ml-auto text-xs text-action/60 group-hover:text-action transition-colors duration-200">
            {t.dopamineCard.readMore} →
          </span>
        </div>
      </a>
    )
  }
)
