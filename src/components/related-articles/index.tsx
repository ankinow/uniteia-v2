import { component$ } from '@builder.io/qwik'
import { DepthCard } from '~/components/depth-card'
import { DepthSection } from '~/components/depth-section'
import { DopamineCard } from '~/components/dopamine-card'
import type { RelatedArticlesProps } from './types'

export const RelatedArticles = component$<RelatedArticlesProps>(({ nodes, lang, label }) => {
  if (nodes.length === 0) return null

  return (
    <DepthSection depth="back" aria-label={label ?? 'Related articles'}>
      <DepthCard depth="back" class="p-6 md:p-8">
        {label && <h2 class="text-xl font-semibold text-bone mb-4">{label}</h2>}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nodes.map(node => (
            <DopamineCard
              key={node.id}
              title={node.title}
              description={node.summary}
              href={node.routes.canonical}
              lang={lang}
            />
          ))}
        </div>
      </DepthCard>
    </DepthSection>
  )
})

export type { RelatedArticlesProps }
