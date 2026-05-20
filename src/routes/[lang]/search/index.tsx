import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { routeLoader$, useLocation } from '@builder.io/qwik-city'
import { SearchResults } from '~/components/search'
import { getTranslation } from '~/i18n/context'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'

export const onStaticGenerate = () => {
  return {
    params: SUPPORTED_LANGUAGES.map(l => ({
      lang: l.code,
    })),
  }
}

export const useSearchIndex = routeLoader$(async () => {
  const { searchIndexDocuments } = await import('~/search-index.generated')
  return searchIndexDocuments
})

export default component$(() => {
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const query = location.url.searchParams.get('q') ?? ''
  const documents = useSearchIndex()

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      <form method="GET" class="mb-8" preventdefault:submit>
        <label class="sr-only" for="search-input">
          Search topics, articles
        </label>
        <div class="relative">
          <input
            id="search-input"
            type="search"
            name="q"
            value={query}
            placeholder="Search topics, articles..."
            class="w-full px-4 py-3 bg-void border border-action/30 rounded-lg text-bone placeholder:text-bone-muted/50 focus:outline-none focus:border-action"
            aria-label="Search topics, articles"
          />
        </div>
      </form>

      <SearchResults documents={documents.value} query={query} lang={lang} />
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
