import { component$ } from '@builder.io/qwik'

export interface NextLessonCardProps {
  href: string
  title: string
  label?: string
}

/**
 * NextLessonCard — Navigation card to next lesson.
 * Glass background, arrow (→), hover lift effect (translateY -2px).
 * Uses the .whisper-hover pattern for the lift animation.
 */
export const NextLessonCard = component$<NextLessonCardProps>(({ href, title, label }) => {
  return (
    <a
      href={href}
      data-testid="next-lesson-card"
      class={[
        'glass p-6 md:p-8 flex items-center justify-between group',
        'whisper-hover',
        'hover:border-cyan/40',
      ]}
    >
      <div class="flex flex-col gap-1">
        {label && (
          <span class="text-xs font-mono text-bone-muted uppercase tracking-widest">{label}</span>
        )}
        <span class="text-lg font-display text-bone group-hover:text-cyan transition-colors duration-base">
          {title}
        </span>
      </div>
      <span class="text-2xl text-cyan/60 group-hover:text-cyan transition-colors duration-base shrink-0 ml-4">
        →
      </span>
    </a>
  )
})
