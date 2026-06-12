import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { getTranslation } from '~/i18n/context'
import { reserveRouteWhisper, useDopamineBudget } from '~/stores/dopamine-budget'
import { getLucideIconClass } from '~/utils/icon-classes'
import type { DopamineCardProps } from './types'

export const DopamineCard = component$<DopamineCardProps>(
  ({ title, description, href, icon, lang, class: className }) => {
    const t = getTranslation(lang)
    const budget = useDopamineBudget()
    const whisperState = useSignal<'pending' | 'armed' | 'spent' | 'blocked'>('pending')
    const iconClass = getLucideIconClass(icon)

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
        ? 'hover:-translate-y-[var(--whisper-y,2px)] hover:border-cyan/30 hover:shadow-[0_8px_32px_rgba(0,210,211,0.12)]'
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
          'group relative flex flex-col gap-3 rounded-lg border border-action/20 bg-raised p-4 shadow-d1 h-full',
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
        <div class="flex items-start gap-3">
          {iconClass && <div class={iconClass} aria-hidden="true" />}
          <h3 class="text-base font-semibold text-bone group-hover:text-action transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
        </div>
        <p class="text-sm text-bone leading-relaxed line-clamp-3">{description}</p>
        <div class="mt-auto flex items-center justify-between pt-2">
          <span class="ml-auto text-xs text-action group-hover:text-action-hi transition-colors duration-200">
            {t.dopamineCard.readMore} →
          </span>
        </div>
      </a>
    )
  }
)
