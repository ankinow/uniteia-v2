import { component$ } from '@builder.io/qwik'

/**
 * TopicCard — UE5 Illusion + Glass 2.5D + Tactile Depth
 *
 * Σ LOAD refinement: mixed UI directive (light canvas content + dark compact interfaces).
 * Applies perspective, translateZ, volumetric shadows, and grain overlay
 * without touching Content Graph, i18n, or build pipeline.
 */
export interface TopicCardProps {
  title: string
  summary: string
  href?: string
  class?: string
}

export const TopicCard = component$<TopicCardProps>(
  ({ title, summary, href, class: classList }) => {
    const content = (
      <article
        class={[
          'ue5-illusion glassmorphism-2 group glass-2-5d relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.4deg]',
          classList,
        ]}
        style={{ perspective: '1400px' }}
      >
        <div class="relative z-10">
          <h3 class="font-display text-3xl md:text-4xl tracking-[-2px] text-bone mb-4">{title}</h3>
          <p class="text-[15.5px] text-zinc-300 leading-relaxed">{summary}</p>
        </div>
        {/* UE5 volumetric glow edge */}
        <div class="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-cyan)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
      </article>
    )

    if (href) {
      return (
        <a href={href} class="block no-underline">
          {content}
        </a>
      )
    }

    return content
  }
)
