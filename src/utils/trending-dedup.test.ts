import { describe, expect, test } from "bun:test";
import { dedupRepos, dedupNews, dedupAgainstFeatured } from "./trending-dedup";

describe("Trending Dedup (F13 — R27)", () => {
  test("removes items present in featured set", () => {
    const featured = [
      { id: 1, name: "foo/bar", fullName: "foo/bar" },
      { id: 2, name: "baz/qux", fullName: "baz/qux" },
    ];
    const items = [
      { id: 1, name: "foo/bar", fullName: "foo/bar" },
      { id: 3, name: "new/repo", fullName: "new/repo" },
      { id: 4, name: "another/repo", fullName: "another/repo" },
    ];
    const result = dedupAgainstFeatured(items, featured);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual([3, 4]);
  });

  test("returns all items when featured is empty", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ];
    expect(dedupAgainstFeatured(items, [])).toEqual(items);
  });

  test("dedupRepos excludes featured repos", () => {
    const repos = [
      { id: 1, name: "a", fullName: "a/b", description: "", url: "", stars: 0, forks: 0, language: null, topics: [], avatarUrl: "" },
      { id: 2, name: "c", fullName: "c/d", description: "", url: "", stars: 0, forks: 0, language: null, topics: [], avatarUrl: "" },
    ];
    const featured = [repos[0]];
    expect(dedupRepos(repos, featured)).toEqual([repos[1]]);
  });

  test("dedupNews excludes featured news", () => {
    const news = [
      { id: 100, title: "A", url: "http://a", score: 10, by: "u", time: 1, descendants: 0 },
      { id: 200, title: "B", url: "http://b", score: 20, by: "u", time: 2, descendants: 0 },
    ];
    const featured = [news[0]];
    expect(dedupNews(news, featured)).toEqual([news[1]]);
  });
});
