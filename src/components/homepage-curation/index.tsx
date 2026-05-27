/**
 * HomepageCuration — Dynamic content components for niche landing page
 * GitHub trending repos + HackerNews top stories + random article picker
 * Rendered with Living Brief collage aesthetic
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { SupportedLanguage } from '~/i18n/types'
import type { NicheArticleEntry } from '~/utils/content-loader'
import {
  type NewsItem,
  type TrendingRepo,
  fetchTrendingData,
  getRandomArticleKey,
} from '~/utils/trending-fetcher'

// ── RepoCard (Polaroid-style with star count) ──

export const RepoCard = component$<{ repo: TrendingRepo }>(({ repo }) => {
  const languageColors: Record<string, string> = {
    Python: 'oklch(0.55 0.20 70)',
    TypeScript: 'oklch(0.55 0.20 240)',
    JavaScript: 'oklch(0.65 0.20 85)',
    Rust: 'oklch(0.60 0.15 30)',
    Go: 'oklch(0.55 0.18 200)',
    'C++': 'oklch(0.55 0.15 250)',
    Java: 'oklch(0.60 0.15 30)',
    Jupyter: 'oklch(0.65 0.18 40)',
  }

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${repo.name}: ${repo.description || 'No description'}`}
      class="repo-card polaroid-card inline-block p-3 rounded-sm bg-white/90 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:rotate-[0.5deg] w-full max-w-[280px]"
    >
      <div class="flex items-center gap-2 mb-2">
        {repo.avatarUrl && (
          <img src={repo.avatarUrl} alt="" class="w-5 h-5 rounded-full" loading="lazy" />
        )}
        <span class="text-[11px] font-mono text-[oklch(0.40_0.05_280)] truncate">
          {repo.fullName}
        </span>
      </div>
      <h4 class="text-sm font-semibold text-[oklch(0.20_0.03_280)] mb-1 line-clamp-2">
        {repo.name}
      </h4>
      {repo.description && (
        <p class="text-[11px] text-[oklch(0.40_0.03_280)] mb-2 line-clamp-2">{repo.description}</p>
      )}
      <div class="flex items-center gap-3 text-[11px] text-[oklch(0.45_0.04_280)]">
        {repo.language && (
          <span class="flex items-center gap-1">
            <span
              class="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: languageColors[repo.language] || 'oklch(0.50 0.05 280)' }}
            />
            {repo.language}
          </span>
        )}
        <span>⭐ {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span>
        <span>⑂ {repo.forks}</span>
      </div>
    </a>
  )
})

// ── NewsCard (Taped note style) ──

export const NewsCard = component$<{ news: NewsItem }>(({ news }) => {
  const timeAgo = Math.floor((Date.now() - news.time * 1000) / (1000 * 60 * 60))
  const timeStr =
    timeAgo < 1 ? 'agora' : timeAgo < 24 ? `${timeAgo}h` : `${Math.floor(timeAgo / 24)}d`

  return (
    <a
      href={news.url || `https://news.ycombinator.com/item?id=${news.id}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${news.title} — ${news.score} points`}
      class="news-card block p-3 rounded-sm bg-white/80 backdrop-blur-sm border-l-2 border-[oklch(0.72_0.165_80/0.4)] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      <h4 class="text-sm font-medium text-[oklch(0.20_0.03_280)] mb-1 line-clamp-2 leading-snug">
        {news.title}
      </h4>
      <div class="flex items-center gap-3 text-[10px] text-[oklch(0.45_0.04_280)]">
        <span>▲ {news.score}</span>
        <span>by {news.by}</span>
        <span>{timeStr}</span>
        {news.descendants > 0 && <span>💬 {news.descendants}</span>}
      </div>
    </a>
  )
})

// ── Skeleton Cards (Loading placeholders) ──

const SkeletonRepoCard = component$(() => (
  <div class="repo-card polaroid-card inline-block p-3 rounded-sm bg-white/60 shadow-md w-full max-w-[280px] animate-pulse">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-5 h-5 rounded-full bg-[oklch(0.75_0.02_80)]" />
      <div class="h-3 w-24 rounded bg-[oklch(0.75_0.02_80)]" />
    </div>
    <div class="h-4 w-3/4 rounded bg-[oklch(0.75_0.02_80)] mb-1" />
    <div class="h-3 w-full rounded bg-[oklch(0.75_0.02_80)] mb-2" />
    <div class="h-3 w-1/2 rounded bg-[oklch(0.75_0.02_80)]" />
    <div class="flex items-center gap-3 mt-2">
      <div class="h-3 w-10 rounded bg-[oklch(0.75_0.02_80)]" />
      <div class="h-3 w-12 rounded bg-[oklch(0.75_0.02_80)]" />
      <div class="h-3 w-10 rounded bg-[oklch(0.75_0.02_80)]" />
    </div>
  </div>
))

const SkeletonNewsCard = component$(() => (
  <div class="news-card block p-3 rounded-sm bg-white/50 backdrop-blur-sm border-l-2 border-[oklch(0.75_0.05_80/0.3)] animate-pulse">
    <div class="h-4 w-3/4 rounded bg-[oklch(0.75_0.02_80)] mb-1" />
    <div class="h-3 w-full rounded bg-[oklch(0.75_0.02_80)] mb-2" />
    <div class="flex items-center gap-3">
      <div class="h-3 w-8 rounded bg-[oklch(0.75_0.02_80)]" />
      <div class="h-3 w-16 rounded bg-[oklch(0.75_0.02_80)]" />
      <div class="h-3 w-10 rounded bg-[oklch(0.75_0.02_80)]" />
    </div>
  </div>
))

// ── TrendingSection (Main orchestrator) ──

export interface TrendingSectionProps {
  articles: NicheArticleEntry[]
  lang: SupportedLanguage
}

export const TrendingSection = component$<TrendingSectionProps>(({ articles, lang }) => {
  const data = useSignal<{ repos: TrendingRepo[]; news: NewsItem[] } | null>(null)
  const loading = useSignal(true)
  const error = useSignal<string | null>(null)
  const fetchTrigger = useSignal(0)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => fetchTrigger.value)

    loading.value = true
    error.value = null

    try {
      const result = await fetchTrendingData()
      data.value = { repos: result.repos, news: result.news }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to load trending data'
    } finally {
      loading.value = false
    }
  })

  // Random article selection
  const randomSlug = getRandomArticleKey(articles.map(a => a.slug))
  const randomArticle = randomSlug ? articles.find(a => a.slug === randomSlug) : null

  return (
    <div class="trending-section space-y-8">
      {/* Section Header */}
      <div class="flex items-center gap-3 mb-2">
        <span class="text-lg" aria-hidden="true">
          🔥
        </span>
        <h2 class="text-xl font-semibold text-[oklch(0.85_0.12_85)]">Trending AI & Robotics</h2>
        <span class="text-[10px] text-[oklch(0.50_0.05_280)] font-mono">
          {data.value
            ? `atualizado ${new Date((data.value.news[0]?.time || Date.now()) * 1000).toLocaleTimeString()}`
            : ''}
        </span>
      </div>

      {/* Loading state — skeleton cards matching RepoCard / NewsCard dimensions */}
      {loading.value && (
        <div class="space-y-6">
          {/* Skeleton repos */}
          <div>
            <div class="h-4 w-36 rounded bg-[oklch(0.75_0.02_80/0.3)] mb-3 animate-pulse" />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <SkeletonRepoCard />
              <SkeletonRepoCard />
              <SkeletonRepoCard />
            </div>
          </div>
          {/* Skeleton news */}
          <div>
            <div class="h-4 w-32 rounded bg-[oklch(0.75_0.02_80/0.3)] mb-3 animate-pulse" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SkeletonNewsCard />
              <SkeletonNewsCard />
              <SkeletonNewsCard />
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error.value && !loading.value && (
        <div
          class="rounded-sm border border-[oklch(0.55_0.15_30/0.3)] bg-[oklch(0.55_0.15_30/0.08)] p-4"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <span class="text-lg" aria-hidden="true">
              ⚠️
            </span>
            <div class="flex-1">
              <p class="text-sm text-[oklch(0.55_0.15_30)] mb-2">{error.value}</p>
              <button
                type="button"
                class="cursor-pointer rounded-sm bg-[oklch(0.72_0.165_80/0.15)] px-4 py-1.5 text-xs text-[oklch(0.85_0.12_85)] transition-colors hover:bg-[oklch(0.72_0.165_80/0.25)] focus-visible:outline-2 focus-visible:outline-[oklch(0.72_0.165_80/0.6)]"
                aria-label="Retry loading trending data"
                onClick$={() => {
                  fetchTrigger.value++
                }}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {data.value && (
        <>
          {/* GitHub Trending Repos */}
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm" aria-hidden="true">
                📦
              </span>
              <h3 class="text-sm font-semibold text-[oklch(0.70_0.10_280)] uppercase tracking-wider">
                Top Repos da Semana
              </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.value.repos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>

          {/* HackerNews Top Stories */}
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm" aria-hidden="true">
                📰
              </span>
              <h3 class="text-sm font-semibold text-[oklch(0.70_0.10_280)] uppercase tracking-wider">
                Notícias do Dia
              </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.value.news.map(item => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Random Article Highlight */}
      {randomArticle && (
        <div class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm" aria-hidden="true">
              🎲
            </span>
            <h3 class="text-sm font-semibold text-[oklch(0.70_0.10_280)] uppercase tracking-wider">
              Artigo Aleatório
            </h3>
          </div>
          <a
            href={`/${lang}/signals/apex/${randomArticle.slug}`}
            aria-label={`Random article: ${randomArticle.title}`}
            class="random-article-card block p-4 rounded-sm bg-gradient-to-br from-[oklch(0.15_0.04_280/0.8)] to-[oklch(0.10_0.03_280/0.9)] border border-white/10 hover:border-[oklch(0.72_0.165_80/0.3)] transition-all duration-200"
          >
            <h3 class="text-base font-semibold text-[oklch(0.85_0.12_85)] mb-1">
              {randomArticle.title}
            </h3>
            <p class="text-sm text-[oklch(0.55_0.06_280)] line-clamp-2">{randomArticle.summary}</p>
          </a>
        </div>
      )}
    </div>
  )
})
