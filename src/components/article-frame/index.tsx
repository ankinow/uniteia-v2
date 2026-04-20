import { Slot, component$ } from '@builder.io/qwik'
import type { ArticleFrameProps } from './types'

/**
 * ArticleFrame - Main content container for wiki articles
 *
 * Provides a prose-styled, max-width-constrained container with
 * dark theme surface styling and responsive padding.
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const ArticleFrame = component$<ArticleFrameProps>(props => {
  return (
    <article
      data-testid="article-frame"
      class={[
        'article-frame',
        'mx-auto w-full max-w-prose',
        'px-4 py-8',
        'sm:px-6',
        'md:px-8 md:py-10',
        'lg:px-10 lg:py-12',
        'surface-void',
        props.class,
      ]}
    >
      <Slot />
    </article>
  )
})

export type { ArticleFrameProps, ArticleFrameLogEvent } from './types'
