import { component$ } from '@builder.io/qwik'

export interface LessonBlockProps {
  title: string
  body: string
  action?: { label: string; href: string }
  tone?: 'default' | 'highlight' | 'warning'
}

/**
 * LessonBlock — Content block based on DepthCard pattern.
 *
 * Tone variants:
 * - default: no extra border
 * - highlight: border-l-4 border-cyan
 * - warning:   border-l-4 border-bronze
 *
 * Optional action renders an outline-styled link button.
 */
export const LessonBlock = component$<LessonBlockProps>(
  ({ title, body, action, tone = 'default' }) => {
    const borderClass =
      tone === 'highlight'
        ? 'border-l-4 border-cyan'
        : tone === 'warning'
          ? 'border-l-4 border-[var(--bronze)]'
          : ''

    return (
      <div
        data-testid="lesson-block"
        data-tone={tone}
        class={['surface-hud p-6 md:p-8', borderClass]}
      >
        <h2 class="text-xl font-display text-bone font-semibold mb-3 leading-snug">{title}</h2>
        <p class="text-bone-muted leading-relaxed mb-0">{body}</p>
        {action && (
          <a
            href={action.href}
            class="btn-outline mt-4 inline-block text-cyan border-cyan/40 hover:border-cyan"
          >
            {action.label}
          </a>
        )}
      </div>
    )
  }
)
