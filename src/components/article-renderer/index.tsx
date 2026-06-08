import { component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { ArticleFrame } from '~/components/article-frame'
import { ErrorBoundary } from '~/components/error-boundary'
import { type FrontmatterLabels, FrontmatterSlots } from '~/components/frontmatter-slots'
import {
  AetherHanddrawCollage,
  type AetherHanddrawCollageProps,
} from '~/components/moodboard-aether'
import { NewsletterForm } from '~/components/newsletter-form'
import { RelatedArticles } from '~/components/related-articles'
import { ShareBar } from '~/components/share-bar'
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
  /** Optional hand-drawn collage props — renders Aether hand-drawn collage above content */
  collage?: AetherHanddrawCollageProps
  /** Hide the adaptive header (useful if title is shown in a hero component) */
  hideHeader?: boolean
  /** Reading time string to display */
  readTime?: string
}

const JSONLD = ({ data }: { data: SchemaType }) => {
  const json = JSON.stringify(data, null, 2)
  // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for JSON-LD
  return <script type="application/ld+json" dangerouslySetInnerHTML={json} />
}

const AdaptiveHeader = ({
  title,
  subtitle,
  readTime,
}: {
  title: string
  subtitle?: string
  readTime?: string
}) => (
  <section class="adaptive-header surface-panel mb-10">
    <h1
      class={[
        'text-3xl md:text-4xl lg:text-5xl font-bold font-display',
        'text-bone text-wrap:balance leading-tight',
      ]}
    >
      {title}
    </h1>
    {(subtitle || readTime) && (
      <div class="mt-4 flex flex-col gap-2">
        {subtitle && <p class="text-lg text-bone-muted leading-relaxed max-w-2xl">{subtitle}</p>}
        {readTime && (
          <span class="text-sm font-mono text-neon-cyan/60 uppercase tracking-widest">
            {readTime}
          </span>
        )}
      </div>
    )}
  </section>
)

export const ArticleRenderer = component$<ArticleRendererProps>(
  ({
    content,
    relatedNodes,
    labels,
    withErrorBoundary = true,
    svgs,
    collage,
    hideHeader,
    readTime,
  }) => {
    const loc = useLocation()
    const description = extractDescription(content.content)
    const pageUrl = `${loc.url.origin}${loc.url.pathname}`

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
        {!hideHeader && (
          <>
            {readTime ? (
              <AdaptiveHeader title={content.title} subtitle={description} readTime={readTime} />
            ) : (
              <AdaptiveHeader title={content.title} subtitle={description} />
            )}
          </>
        )}

        <div class="flex flex-col gap-6">
          <div class="flex justify-between items-center border-b border-white/5 pb-4">
            <FrontmatterSlots
              subjects={content.subjects}
              lang={content.lang}
              metadata={content.metadata}
              labels={labels}
              class="mt-0 p-0 bg-transparent border-0 shadow-none"
            />
            <ShareBar url={pageUrl} title={content.title} class="hidden md:flex" />
          </div>

          {collage && (
            <div class="mt-4 mb-4">
              <AetherHanddrawCollage {...collage} />
            </div>
          )}

          {withErrorBoundary ? (
            <>
              <ErrorBoundary fallbackMsg="Article Content">{contentBlock}</ErrorBoundary>
              {svgBlock}
              <div class="mt-12 pt-8 border-t border-white/5 space-y-12">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <ShareBar url={pageUrl} title={content.title} />
                  <NewsletterForm class="max-w-sm" />
                </div>
                <ErrorBoundary fallbackMsg="Related Articles">{relatedBlock}</ErrorBoundary>
              </div>
            </>
          ) : (
            <>
              {contentBlock}
              {svgBlock}
              <div class="mt-12 pt-8 border-t border-white/5 space-y-12">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <ShareBar url={pageUrl} title={content.title} />
                  <NewsletterForm class="max-w-sm" />
                </div>
                {relatedBlock}
              </div>
            </>
          )}
        </div>
      </ArticleFrame>
    )
  }
)
