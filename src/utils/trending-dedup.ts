/**
 * trending-dedup.ts
 * F13 fix — exclude nodes already in `featured` from `frontier` stream.
 * Dedup key: canonicalSlug (preferred) or id.
 */
import type { TrendingRepo, NewsItem } from './trending-fetcher'

type DedupItem = { canonicalSlug?: string; id?: string | number; fullName?: string; name?: string }

function getKey(item: DedupItem): string {
  return String(item.canonicalSlug ?? item.fullName ?? item.id ?? item.name ?? '')
}

/**
 * Deduplicate items against a featured set by string key.
 * Preserves original order in `items`.
 */
export function dedupAgainstFeatured<T extends DedupItem>(items: T[], featured: T[]): T[] {
  if (!featured.length) return items
  const blocked = new Set(featured.map(getKey))
  return items.filter((it) => !blocked.has(getKey(it)))
}

export function dedupRepos(repos: TrendingRepo[], featured: TrendingRepo[]): TrendingRepo[] {
  return dedupAgainstFeatured(repos, featured)
}

export function dedupNews(news: NewsItem[], featured: NewsItem[]): NewsItem[] {
  return dedupAgainstFeatured(news, featured)
}
