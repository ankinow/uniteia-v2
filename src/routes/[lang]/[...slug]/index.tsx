import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import { AdaptiveHeader } from '~/components/adaptive-header'
import { ArticleFrame } from '~/components/article-frame'
import { EditorialVerdict } from '~/components/editorial-verdict'
import { NotFound } from '~/components/error-pages/not-found'
import { FrontmatterSlots } from '~/components/frontmatter-slots'
import { QualityRing } from '~/components/quality-ring'
import { SourceLedger } from '~/components/source-ledger'
import { useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'

/**
 * Supported language codes for quick lookup
 */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

/**
 * Thin routeLoader$ wrapper that validates lang, calls loadContent(),
 * and catches ContentLoaderError → error(404).
 *
 * All server-only logic (fs, gray-matter, ajv) lives in loadContent()
 * which uses dynamic imports per D001 to stay tree-shaken from client.
 */
export const useContent = routeLoader$<LlmWikiContent | null>(async ({ params, error }) => {
  const lang = params.lang
  const slugRaw = params.slug

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  if (!slugRaw) {
    throw error(404, 'No slug provided')
  }

  const slug = slugRaw.replaceAll('/', '-')

  try {
    return await loadContent(slug, lang as SupportedLanguage)
  } catch (err) {
    if (err instanceof ContentLoaderError) {
      console.error(`[content-loader] ${err.phase} failed for ${err.lang}/${err.slug}:`, err.errors)
      return null as unknown as LlmWikiContent | null
    }
    throw err
  }
})

/**
 * Content route page component
 * Uses ArticleFrame + AdaptiveHeader + FrontmatterSlots + SourceLedger
 * with i18n-aware labels from the translation context
 */
export default component$(() => {
  const content = useContent()
  const { t } = useI18n()

  if (!content.value) {
    return <NotFound />
  }

  return (
    <ArticleFrame>
      <AdaptiveHeader title={content.value.title} subtitle={content.value.subjects.join(', ')} />
      {/* Editorial verdict — derived from content metadata if available */}
      <div class="mt-3 flex items-center gap-4">
        <EditorialVerdict verdict={content.value.verdict ?? 'trusted'} lang={content.value.lang} />
        <QualityRing
          score={content.value.quality_score ?? 85}
          lang={content.value.lang}
          size={40}
          strokeWidth={3}
        />
      </div>
      <FrontmatterSlots
        subjects={content.value.subjects}
        lang={content.value.lang}
        metadata={content.value.metadata}
        labels={{
          subjectsLabel: t.article.subjectsLabel,
          published: t.article.published,
          updated: t.article.updated,
          byAuthor: t.article.byAuthor,
          version: t.article.version,
          readInLang: t.article.readInLang,
        }}
      />
      <div class="prose prose-invert mt-8 max-w-none text-bone-primary">
        {content.value.content}
      </div>
      <SourceLedger
        referralLinks={content.value.referral_links}
        sourcesLabel={t.article.sourcesLabel}
      />
    </ArticleFrame>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const content = resolveValue(useContent)
  if (!content) {
    return {
      title: '404 - Article Not Found | UniTeia',
      meta: [
        { name: 'description', content: 'The article you are looking for does not exist.' },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  }
  return {
    title: `${content.title} | UniTeia`,
    meta: [
      { name: 'description', content: content.subjects.join(', ') },
      { name: 'robots', content: 'index, follow' },
    ],
  }
}
