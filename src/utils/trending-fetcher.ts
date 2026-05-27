/**
 * trending-fetcher.ts
 * Client-side fetcher for GitHub trending repos + HackerNews top stories.
 * Used by the homepage curation components to display live AI/robotics content.
 *
 * Both APIs are free and require no authentication for read access.
 * Results are cached in sessionStorage to avoid redundant fetches.
 */

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function getCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(`trending:${key}`)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL) return null
    return entry.data
  } catch {
    return null
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    sessionStorage.setItem(`trending:${key}`, JSON.stringify(entry))
  } catch {
    // sessionStorage may be full — silently fail
  }
}

// ── Types ──

export interface TrendingRepo {
  id: number
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  avatarUrl: string
}

export interface NewsItem {
  id: number
  title: string
  url: string | null
  score: number
  by: string
  time: number
  descendants: number
}

export interface TrendingData {
  repos: TrendingRepo[]
  news: NewsItem[]
  fetchedAt: string
}

// ── GitHub Trending Repos (AI/Robotics) ──

const _GITHUB_TOPICS = [
  'ai',
  'artificial-intelligence',
  'machine-learning',
  'deep-learning',
  'robotics',
  'llm',
  'large-language-model',
  'multimodal',
  'agent',
]

export async function fetchTrendingRepos(): Promise<TrendingRepo[]> {
  const cached = getCache<TrendingRepo[]>('github-repos')
  if (cached) return cached

  try {
    // GitHub search API — no auth needed for public search (rate limited)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const query = `q=topic:ai+created:>${weekAgo}&sort=stars&order=desc&per_page=10`
    const res = await fetch(`https://api.github.com/search/repositories?${query}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) return getCache<TrendingRepo[]>('github-repos-fallback') || []

    const json = await res.json()
    const repos: TrendingRepo[] = (json.items || []).map(
      (item: {
        id: number
        name: string
        full_name: string
        description: string
        html_url: string
        stargazers_count: number
        forks_count: number
        language: string | null
        topics: string[]
        owner?: { avatar_url: string }
      }) => ({
        id: item.id,
        name: item.name,
        fullName: item.full_name,
        description: item.description || '',
        url: item.html_url,
        stars: item.stargazers_count,
        forks: item.forks_count,
        language: item.language,
        topics: item.topics || [],
        avatarUrl: item.owner?.avatar_url || '',
      })
    )

    setCache('github-repos', repos)
    setCache('github-repos-fallback', repos) // persistent fallback
    return repos
  } catch (err) {
    console.warn('[trending] GitHub API failed:', err)
    return getCache<TrendingRepo[]>('github-repos-fallback') || []
  }
}

// ── HackerNews Top Stories (AI/Tech News) ──

const HN_BASE = 'https://hacker-news.firebaseio.com/v0'

export async function fetchTopNews(): Promise<NewsItem[]> {
  const cached = getCache<NewsItem[]>('hn-news')
  if (cached) return cached

  try {
    // Get top story IDs
    const idsRes = await fetch(`${HN_BASE}/topstories.json`)
    if (!idsRes.ok) return getCache<NewsItem[]>('hn-news-fallback') || []
    const ids: number[] = await idsRes.json()

    // Fetch first 15 stories (filter to ~10 AI/tech related)
    const topIds = ids.slice(0, 15)
    const items: NewsItem[] = []

    for (const id of topIds) {
      try {
        const itemRes = await fetch(`${HN_BASE}/item/${id}.json`)
        if (!itemRes.ok) continue
        const item = await itemRes.json()
        if (!item || item.type !== 'story' || !item.title) continue
        items.push({
          id: item.id,
          title: item.title,
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          score: item.score || 0,
          by: item.by || 'anonymous',
          time: item.time,
          descendants: item.descendants || 0,
        })
      } catch {
        /* skip individual item errors */
      }
    }

    // Sort by score and take top 10
    const sorted = items.sort((a, b) => b.score - a.score).slice(0, 10)
    setCache('hn-news', sorted)
    setCache('hn-news-fallback', sorted)
    return sorted
  } catch (err) {
    console.warn('[trending] HN API failed:', err)
    return getCache<NewsItem[]>('hn-news-fallback') || []
  }
}

// ── Combined fetch ──

export async function fetchTrendingData(): Promise<TrendingData> {
  const [repos, news] = await Promise.all([fetchTrendingRepos(), fetchTopNews()])

  return {
    repos,
    news,
    fetchedAt: new Date().toISOString(),
  }
}

// ── Content Graph: Random Article ──

export function getRandomArticleKey(articles: string[]): string | null {
  if (!articles || articles.length === 0) return null
  const keys = articles.filter(k => k !== '_index')
  if (keys.length === 0) return null
  const idx = Math.floor(Math.random() * keys.length)
  return keys[idx] || null
}
