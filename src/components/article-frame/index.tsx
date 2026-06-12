import { Slot, component$ } from '@builder.io/qwik'
import { DopamineCard } from '~/components/dopamine-card'
import { KindlePlayground } from '~/components/kindle-playground'
import type { ArticleFrameProps } from './types'

export const ArticleFrame = component$<ArticleFrameProps>(props => {
  return (
    <article
      data-testid="article-frame"
      data-surface="article-frame"
      class={[
        'article-frame',
        'mx-auto w-full max-w-prose',
        'px-6 py-12 md:px-12 md:py-24',
        'font-sans antialiased',
        props.kindleMode
          ? 'bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100'
          : 'surface-panel',
        'relative',
        '[&>h1]:mb-12 [&>h2]:mb-8 [&>h2]:mt-16 [&>p]:mb-6',
        '[&>h1]:text-wrap-balance [&>h2]:text-wrap-balance',
        props.class,
      ]}
    >
      <div
        class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
        aria-hidden="true"
      />
      {props.dopamineCard &&
        (() => {
          const dc = props.dopamineCard
          return (
            <div class="mb-8">
              <DopamineCard
                title={dc.title}
                description={dc.description}
                href={dc.href}
                lang={dc.lang}
                {...(dc.score !== undefined ? { score: dc.score } : {})}
                {...(dc.verdict !== undefined ? { verdict: dc.verdict } : {})}
                {...(dc.sourceCount !== undefined ? { sourceCount: dc.sourceCount } : {})}
                {...(dc.icon !== undefined ? { icon: dc.icon } : {})}
              />
            </div>
          )
        })()}
      {props.kindleMode && (
        <KindlePlayground title="" content="" progress={0} font="serif" fontSize="base" />
      )}
      <Slot />
    </article>
  )
})

export type { ArticleFrameProps, ArticleFrameLogEvent } from './types'
