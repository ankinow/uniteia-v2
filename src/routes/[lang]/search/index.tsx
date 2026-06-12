import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { routeLoader$, useLocation } from '@builder.io/qwik-city'
import { SearchResults } from '~/components/search'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

export const useSearchIndex = routeLoader$(async ({ url }) => {
  const { searchIndexDocuments } = await import('~/search-index.generated')
  const query = url.searchParams.get('q') ?? ''
  const filtered = query
    ? searchIndexDocuments.filter(
        d =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.summary.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : []
  return { documents: filtered, query }
})

export default component$(() => {
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)
  const searchIndex = useSearchIndex()

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <form method="GET" class="mb-8">
        <label class="sr-only" for="search-input">
          {t.search.label}
        </label>
        <div class="relative">
          <input
            id="search-input"
            type="search"
            name="q"
            value={searchIndex.value.query}
            placeholder={t.search.placeholder}
            class="w-full px-4 py-3 bg-void border border-action/30 rounded-lg text-bone placeholder:text-bone-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 focus:border-action"
            aria-label={t.search.label}
          />
        </div>
      </form>

      <SearchResults
        documents={searchIndex.value.documents}
        query={searchIndex.value.query}
        lang={lang}
      />
    </div>
  )
})

export const head: DocumentHead = ({ params, url }) => {
  const lang = (params.lang as SupportedLanguage) || 'en'
  const t = getTranslation(lang)
  const query = url.searchParams.get('q') ?? ''

  return {
    title: query
      ? `${t.search.resultsFor.replace('{query}', query)} | UniTeia`
      : `${t.search.searchTitle} | UniTeia`,
    meta: [
      { name: 'description', content: t.search.searchDescription },
      { name: 'robots', content: 'index, follow' },
    ],
  }
}
