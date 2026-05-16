import { component$ } from '@builder.io/qwik'
import { DopamineCard } from '~/components/dopamine-card'
import type { SearchIndexDocument } from '~/content-graph/contracts/search'
import { useI18n } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

interface SearchResultsProps {
  documents: SearchIndexDocument[]
  query: string
  lang: SupportedLanguage
}

export const SearchResults = component$<SearchResultsProps>(({ documents, query, lang }) => {
  const { t } = useI18n()

  const filtered = query
    ? documents.filter(
        d =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.summary.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <div class="max-w-3xl mx-auto px-4 py-8">
      {query && (
        <p class="text-bone-muted mb-6">
          {t.search.resultsFor.replace('{query}', query)}
          {' — '}
          {t.search.resultCount.replace('{count}', String(filtered.length))}
        </p>
      )}

      {filtered.length > 0 ? (
        <div class="grid grid-cols-1 gap-4">
          {filtered.map(doc => (
            <DopamineCard
              key={doc.id}
              title={doc.title}
              description={doc.summary}
              href={doc.href}
              lang={lang}
            />
          ))}
        </div>
      ) : query ? (
        <div class="border border-dashed border-action/20 rounded-lg p-8 text-center text-bone-muted">
          <p class="text-lg mb-2">{t.search.noResults}</p>
          <p class="text-sm">{t.search.noResultsHint}</p>
        </div>
      ) : null}
    </div>
  )
})
