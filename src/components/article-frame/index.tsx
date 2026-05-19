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
        'px-6 py-12 md:px-12 md:py-24',
        'font-sans antialiased',
        'glassmorphism-1',
        /* Swiss Grid: align children to a consistent baseline if possible */
        '[&>h1]:mb-12 [&>h2]:mb-8 [&>h2]:mt-16 [&>p]:mb-6',
        /* Editorial: balance headings */
        '[&>h1]:text-wrap-balance [&>h2]:text-wrap-balance',
        props.class,
      ]}
    >
      <Slot />
    </article>
  )
})

export type { ArticleFrameProps, ArticleFrameLogEvent } from './types'
