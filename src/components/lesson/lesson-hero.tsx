import { component$ } from '@builder.io/qwik'

export interface LessonHeroProps {
  title: string
  promise: string
  lang: string
}

/**
 * LessonHero — Hero section for lesson pages.
 * Glass background, title in large clamp text (2rem–3rem),
 * promise in smaller text, subtle cyan border-bottom.
 */
export const LessonHero = component$<LessonHeroProps>(({ title, promise, lang }) => {
  return (
    <div lang={lang} data-testid="lesson-hero" class="glass p-8 md:p-12 border-b border-cyan/20">
      <h1 class="font-display text-bone leading-tight mb-4 text-[clamp(2rem,5vw,3rem)]">{title}</h1>
      <p class="text-bone-muted text-lg md:text-xl max-w-3xl leading-relaxed">{promise}</p>
    </div>
  )
})
