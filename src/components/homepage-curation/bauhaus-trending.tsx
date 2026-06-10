import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'
import type { NicheArticleEntry } from '~/utils/content-loader'
import {
  type NewsItem,
  type TrendingRepo,
  fetchTrendingData,
  getRandomArticleKey,
} from '~/utils/trending-fetcher'
import { BauhausCard, BauhausSection } from '../bauhaus-section'

/**
 * BauhausRepoCard — Bold, geometric GitHub repo card.
 */
export const BauhausRepoCard = component$<{ repo: TrendingRepo }>(({ repo }) => {
  return (
    <BauhausCard
      href={repo.url}
      class="border-r border-b border-[var(--color-border)] flex flex-col justify-between"
    >
      <div>
        <div class="flex items-center justify-between mb-6">
          <span class="bauhaus-label text-[var(--color-accent)] truncate max-w-[150px]">
            {repo.fullName.split('/')[0]}
          </span>
          <span class="font-mono text-xs opacity-40">REPO</span>
        </div>
        <h4 class="bauhaus-h2 text-xl mb-4 group-hover:text-[var(--color-headline)]">
          {repo.name}
        </h4>
        {repo.description && <p class="text-xs opacity-60 line-clamp-2 mb-6">{repo.description}</p>}
      </div>
      <div class="flex items-end justify-between mt-auto">
        <div class="flex flex-col">
          <span class="bauhaus-label opacity-40 mb-1">Stars</span>
          <span class="font-mono text-2xl font-black tracking-tighter">
            {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}K` : repo.stars}
          </span>
        </div>
        {repo.language && (
          <span class="bauhaus-label text-[10px] border border-currentColor px-2 py-0.5">
            {repo.language}
          </span>
        )}
      </div>
    </BauhausCard>
  )
})

/**
 * BauhausNewsCard — High-contrast HackerNews story card.
 */
export const BauhausNewsCard = component$<{ news: NewsItem }>(({ news }) => {
  return (
    <BauhausCard
      href={news.url || `https://news.ycombinator.com/item?id=${news.id}`}
      class="border-b border-[var(--color-border)] py-6 px-8 hover:bg-white/5"
    >
      <div class="flex gap-6 items-start">
        <span class="font-mono text-2xl font-black opacity-20 tabular-nums">
          {String(news.score).padStart(3, '0')}
        </span>
        <div class="flex-1">
          <h4 class="text-base font-bold leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {news.title}
          </h4>
          <div class="flex items-center gap-4 text-[10px] opacity-40 uppercase tracking-widest font-bold">
            <span>By {news.by}</span>
            {news.descendants > 0 && <span>{news.descendants} Comments</span>}
          </div>
        </div>
        <span class="text-xl opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
      </div>
    </BauhausCard>
  )
})

export interface BauhausTrendingSectionProps {
  articles: NicheArticleEntry[]
  lang: SupportedLanguage
  mood?: 'blackout' | 'voltage'
}

export const BauhausTrendingSection = component$<BauhausTrendingSectionProps>(
  ({ articles, lang, mood = 'blackout' }) => {
    const data = useSignal<{ repos: TrendingRepo[]; news: NewsItem[] } | null>(null)
    const loading = useSignal(true)
    const fetchTrigger = useSignal(0)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({ track }) => {
      track(() => fetchTrigger.value)
      loading.value = true
      try {
        const result = await fetchTrendingData()
        data.value = { repos: result.repos, news: result.news }
      } catch (err) {
        console.error('BauhausTrendingSection fetch error:', err)
      } finally {
        loading.value = false
      }
    })

    const randomSlug = getRandomArticleKey(articles.map(a => a.slug))
    const randomArticle = randomSlug ? articles.find(a => a.slug === randomSlug) : null

    return (
      <BauhausSection mood={mood} class="bauhaus-trending">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div class="max-w-2xl">
            <span class="bauhaus-label text-[var(--color-accent)] mb-4 block">Pulse Check</span>
            <h2 class="bauhaus-h1">
              Trending <br />
              Intelligence
            </h2>
          </div>
          <div class="flex flex-col items-end">
            <span class="bauhaus-label opacity-40 mb-2">Live Stream</span>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span class="font-mono text-sm opacity-60">
                {data.value ? 'Synchronized' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
          {/* Repo Column */}
          <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px">
            {loading.value
              ? [1, 2, 3, 4].map(i => <div key={i} class="h-64 bg-white/5 animate-pulse" />)
              : data.value?.repos
                  .slice(0, 4)
                  .map(repo => <BauhausRepoCard key={repo.id} repo={repo} />)}
          </div>

          {/* News Column */}
          <div class="lg:col-span-4 flex flex-col bg-[var(--color-bg-primary)]">
            <div class="p-8 border-b border-[var(--color-border)]">
              <h3 class="bauhaus-label opacity-60">Global Signals</h3>
            </div>
            <div class="flex-1 flex flex-col">
              {loading.value
                ? [1, 2, 3, 4, 5].map(i => (
                    <div key={i} class="h-24 border-b border-white/5 animate-pulse" />
                  ))
                : data.value?.news
                    .slice(0, 5)
                    .map(item => <BauhausNewsCard key={item.id} news={item} />)}
            </div>
          </div>
        </div>

        {/* Random Article CTA */}
        {randomArticle && (
          <a
            href={`/${lang}/signals/apex/${randomArticle.slug}`}
            class="group mt-16 p-12 border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] flex flex-col md:flex-row items-center justify-between gap-8 transition-colors"
          >
            <div class="flex-1">
              <span class="bauhaus-label opacity-40 mb-4 block">Recommended Insight</span>
              <h3 class="bauhaus-h2 group-hover:text-[var(--color-accent)] transition-colors">
                {randomArticle.title}
              </h3>
            </div>
            <div class="bauhaus-h1 opacity-10 group-hover:opacity-100 transition-opacity">GO →</div>
          </a>
        )}
      </BauhausSection>
    )
  }
)
