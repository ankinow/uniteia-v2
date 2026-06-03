/**
 * LivingBrief2Col — 2-Column Living Brief Layout
 *
 * Default: 2-col (left 35% dark hero + right 65% content).
 * singleCol={true}: full-width, no split.
 *
 * @example
 * ```tsx
 * <LivingBrief2Col
 *   hero={{ title: "Apex", subtitle: "...", hashtags: ["ai"] }}
 *   singleCol
 * >
 *   <NicheLanding ... />
 * </LivingBrief2Col>
 * ```
 */

import { Slot, component$ } from '@builder.io/qwik'
import { LivingBriefCollage } from './living-brief-collage'
import { LivingBriefHero } from './living-brief-hero'
import type { LivingBrief2ColProps } from './types'

export const LivingBrief2Col = component$<LivingBrief2ColProps>(
  ({ hero, collage, singleCol, class: className }) => {
    if (singleCol) {
      return (
        <div
          class={['living-brief-single', 'flex flex-col w-full', className].join(' ')}
          data-testid="living-brief-single"
        >
          <div class="w-full">
            {collage ? (
              <LivingBriefCollage
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
          />
        </div>

        {/* Right Panel — Collage (65% desktop, full-width mobile) */}
        <div class="w-full md:w-[65%] flex-1 living-brief-right">
          {collage ? (
            <LivingBriefCollage
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
