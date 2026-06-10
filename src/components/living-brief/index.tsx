/**
 * LivingBrief2Col — 2-Column Living Brief Layout
 *
 * Fixed 2-col layout: left 35% dark hero panel + right 65% Parchment collage.
 * Mobile: collapses to vertical stack (hero on top, collage below).
 *
 * Exact match to "The Living Brief" image reference:
 * - Left: dark gradient bg, glowing yellow title, purple desc, hashtags, CTA buttons
 * - Right: torn paper collage, tape, polaroids, hand-drawn arrows, bonecos, labels, flora
 *
 * @example
 * ```tsx
 * <LivingBrief2Col
 *   hero={{
 *     title: "Magica: O Centro de Comando de IA",
 *     subtitle: "O que é a Magica? ...",
 *     hashtags: ["ASSENTOS", "magica", "ai-platform"],
 *     buttons: [{ label: "POR UNITEIA SYSTEM", variant: "primary" }]
 *   }}
 *   collage={{
 *     polaroids: [...],
 *     arrows: [...],
 *     bonecos: [...],
 *     labels: [...],
 *     emoticons: ["🚀", "✨", "🧠"]
 *   }}
 * />
 * ```
 */

import { Slot, component$ } from '@builder.io/qwik'
import { LivingBriefCollage } from './living-brief-collage'
import { LivingBriefHero } from './living-brief-hero'
import type { LivingBrief2ColProps } from './types'

export const LivingBrief2Col = component$<LivingBrief2ColProps>(
  ({ hero, collage, class: className }) => {
    return (
      <div
        class={[
          'living-brief-2col',
          'flex flex-col md:flex-row',
          'min-h-screen w-full',
          className,
        ].join(' ')}
        data-testid="living-brief-2col"
      >
        {/* Left Panel — Hero (35% desktop, full-width mobile) */}
        <div class="w-full md:w-[35%] flex-shrink-0 living-brief-left">
          <LivingBriefHero
            title={hero.title}
            subtitle={hero.subtitle}
            hashtags={hero.hashtags}
            buttons={hero.buttons}
            variant={hero.variant}
          >
            <div q:slot="breadcrumb">
              <Slot name="breadcrumb" />
            </div>
            <div q:slot="toc">
              <Slot name="toc" />
            </div>
          </LivingBriefHero>
        </div>

        {/* Right Panel — Collage (65% desktop, full-width mobile) */}
        <div class="w-full md:w-[65%] flex-1 living-brief-right">
          {collage ? (
            <LivingBriefCollage
              variant={collage.variant || (hero.variant === 'terminal' ? 'cyber' : hero.variant)}
              polaroids={collage.polaroids}
              labels={collage.labels}
              arrows={collage.arrows}
              bonecos={collage.bonecos}
              emoticons={collage.emoticons}
              showFlora={collage.showFlora}
              sections={collage.sections}
            />
          ) : (
            <div class="living-brief-right-content p-6 md:p-10">
              <Slot />
            </div>
          )}
        </div>
      </div>
    )
  }
)

export { LivingBriefHero } from './living-brief-hero'
export { LivingBriefCollage } from './living-brief-collage'
export type * from './types'
