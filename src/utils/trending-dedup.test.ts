import { describe, expect, test } from 'vitest'
import { dedupAgainstFeatured, dedupNews, dedupRepos } from './trending-dedup'
import type { NewsItem, TrendingRepo } from './trending-fetcher'

describe('Trending Dedup (F13 — R27)', () => {
  test('removes items present in featured set', () => {
    const featured: TrendingRepo[] = [
      {
        id: 1,
        name: 'foo/bar',
        fullName: 'foo/bar',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
      {
        id: 2,
        name: 'baz/qux',
        fullName: 'baz/qux',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
    ]
    const items: TrendingRepo[] = [
      {
        id: 1,
        name: 'foo/bar',
        fullName: 'foo/bar',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
      {
        id: 3,
        name: 'new/repo',
        fullName: 'new/repo',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
      {
        id: 4,
        name: 'another/repo',
        fullName: 'another/repo',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
    ]
    const result = dedupAgainstFeatured(items, featured)
    expect(result).toHaveLength(2)
    expect(result.map(r => r.id)).toEqual([3, 4])
  })

  test('returns all items when featured is empty', () => {
    const items: TrendingRepo[] = [
      {
        id: 1,
        name: 'a',
        fullName: 'a',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
      {
        id: 2,
        name: 'b',
        fullName: 'b',
        description: '',
        url: '',
        stars: 0,
        forks: 0,
        language: null,
        topics: [],
        avatarUrl: '',
      },
    ]
    expect(dedupAgainstFeatured(items, [])).toEqual(items)
  })

  test('dedupRepos excludes featured repos', () => {
    const repos: TrendingRepo[] = [
      {
        id: 10,
        name: 'repo1',
        fullName: 'user/repo1',
        description: '',
        url: '',
        stars: 5,
        forks: 1,
        language: 'TypeScript',
        topics: ['ai'],
        avatarUrl: '',
      },
      {
        id: 20,
        name: 'repo2',
        fullName: 'user/repo2',
        description: '',
        url: '',
        stars: 10,
        forks: 2,
        language: 'Python',
        topics: ['ml'],
        avatarUrl: '',
      },
      {
        id: 30,
        name: 'repo3',
        fullName: 'user/repo3',
        description: '',
        url: '',
        stars: 15,
        forks: 3,
        language: 'Rust',
        topics: ['robotics'],
        avatarUrl: '',
      },
    ]
    const firstRepo = repos[0]
    if (!firstRepo) return
    const featured: TrendingRepo[] = [firstRepo]
    const r1 = repos[1]
    const r2 = repos[2]
    if (!r1 || !r2) return
    expect(dedupRepos(repos, featured)).toEqual([r1, r2])
  })

  test('dedupNews excludes featured news', () => {
    const news: NewsItem[] = [
      { id: 100, title: 'A', url: 'http://a', score: 10, by: 'u', time: 1, descendants: 0 },
      { id: 200, title: 'B', url: 'http://b', score: 20, by: 'u', time: 2, descendants: 0 },
    ]
    const firstNews = news[0]
    if (!firstNews) return
    const featured: NewsItem[] = [firstNews]
    const n1 = news[1]
    if (!n1) return
    expect(dedupNews(news, featured)).toEqual([n1])
  })
})
