import { component$ } from '@builder.io/qwik'
import { ArticleFrame } from '~/components/article-frame'
import { ErrorBoundary } from '~/components/error-boundary'
import { type FrontmatterLabels, FrontmatterSlots } from '~/components/frontmatter-slots'
import { RelatedArticles } from '~/components/related-articles'
import type { ContentNode } from '~/content-graph/contracts/node'
import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import type { SchemaType } from '~/types/schema-org'
import { generateArticleSchema } from '~/utils/schema-generators'
import { extractDescription } from '~/utils/text-utils'

export interface ArticleRendererProps {
  content: LlmWikiContent
  relatedNodes: ContentNode[]
  labels: FrontmatterLabels
  /** Wrap content and related sections in ErrorBoundary (default: true) */
  withErrorBoundary?: boolean
  /** Optional inline SVGs to render after prose content */
  svgs?: string[]
}

const JSONLD = ({ data }: { data: SchemaType }) => {
  const json = JSON.stringify(data, null, 2)
  // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for JSON-LD
  return <script type="application/ld+json" dangerouslySetInnerHTML={json} />
}

const AdaptiveHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) => (
  <section class="adaptive-header glass-light">
    <h1
      class={[
        'text-2xl leading-9',
        'md:text-2xl md:leading-10',
        'lg:text-3xl lg:leading-tight',
        'font-semibold text-bone text-wrap:balance',
      ]}
    >
      {title}
    </h1>
    {subtitle && (
      <p class="mt-2 text-base leading-relaxed text-bone-muted md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed">
        {subtitle}
      </p>
    )}
  </section>
)

export const ArticleRenderer = component$<ArticleRendererProps>(
  ({ content, relatedNodes, labels, withErrorBoundary = true, svgs }) => {
    const description = extractDescription(content.content)

    const articleSchema: SchemaType = generateArticleSchema({
      headline: content.title,
      description,
      author: content.metadata?.author || 'UniTeia System',
      url: content.slug,
      niche: content.slug,
      lang: content.lang,
    })

    const contentBlock = (
      <>
        <div
          class="prose prose-invert mt-8 max-w-none text-bone-primary prose-a:text-action hover:prose-a:text-action-hi transition-colors"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: content is pre-validated markdown
          dangerouslySetInnerHTML={content.content}
        />
      </>
    )

    const svgBlock = svgs && svgs.length > 0 && (
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {svgs.map((svg, idx) => (
          <div
            key={idx}
            class="max-w-md rounded-lg border border-action/10 p-2"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVGs are pre-validated
            dangerouslySetInnerHTML={svg}
          />
        ))}
      </div>
    )

    const relatedBlock = (
      <div class="mt-12">
        <RelatedArticles nodes={relatedNodes} lang={content.lang as SupportedLanguage} />
      </div>
    )

    return (
      <ArticleFrame>
        <JSONLD data={articleSchema} />
        <AdaptiveHeader title={content.title} subtitle={description} />
        <FrontmatterSlots
          subjects={content.subjects}
          lang={content.lang}
          metadata={content.metadata}
          labels={labels}
        />
        {withErrorBoundary ? (
          <>
            <ErrorBoundary label="Article Content">{contentBlock}</ErrorBoundary>
            {svgBlock}
            <ErrorBoundary label="Related Articles">{relatedBlock}</ErrorBoundary>
          </>
        ) : (
          <>
            {contentBlock}
            {svgBlock}
            {relatedBlock}
          </>
        )}
      </ArticleFrame>
    )
  }
)
