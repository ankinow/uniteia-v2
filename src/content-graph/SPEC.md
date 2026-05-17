# SPEC.md — ContentGraph & Route Contract Specification

This document details the interface contracts and specifications for the stable `ContentGraphProvider` and `RouteContract` systems.

## 1. Data Contracts

### ContentNode Interface
Each content node represents a localized variant of a piece of content, synchronized across all target locales.

```typescript
export interface ContentNode {
  id: string;
  canonicalSlug: string;           // global identity
  locale: ContentLocale;
  canonicalLocale: ContentLocale;
  title: string;
  summary: string;
  slug: string;                    // locale variant
  niche: string[];                 // taxonomy
  tags: string[];
  entities: string[];
  qualityScore: number;
  trustScore: number;
  visibility: 'draft' | 'review' | 'published';
  verdict: 'safe' | 'caution' | 'unsafe';
  metrics: {
    edgeRank: number;
    semanticDensity: number;
    freshnessScore: number;
    graphScore: number;
  };
  routes: {
    canonical: string;
    aliases: string[];             // /signals/niche/slug etc.
  };
  alternates: Record<ContentLocale, string>;
  related: string[];               // node ids
  timestamps: { createdAt: string; updatedAt: string };
}
```

### ContentGraph Interface
The main in-memory representation of compiled content nodes.

```typescript
export interface ContentGraph {
  nodes: ContentNode[];
  groups: Map<string, ContentNode[]>; // by canonicalSlug
  niches: Map<string, ContentNode[]>;
}
```

## 2. Service Providers

### ContentGraphProvider Interface
Provides read-only queries against the pre-compiled static content graph.

```typescript
export interface ContentGraphProvider {
  getNode(slug: string, locale?: ContentLocale): ContentNode | null;
  getGroup(canonicalSlug: string): ContentNode[] | null; // all locales
  getPublicNodes(locale: ContentLocale, filters?: { niche?: string; limit?: number }): ContentNode[];
  getHomepageProjection(locale: ContentLocale): {
    featured: ContentNode[];      // by graphScore
    clusters: Array<{niche: string; nodes: ContentNode[]}>;
    frontier: ContentNode[];      // by freshness
  };
  getNavigation(): NavigationItem[];
  getRelated(fromId: string, locale: ContentLocale, limit?: number): ContentNode[];
  getSitemapEntries(): SitemapEntry[];
  isPublic(node: ContentNode): boolean; // quality + visibility + locales complete
}
```

### RouteContract Interface
Standardizes localized route construction and resolution.

```typescript
export interface RouteContract {
  home(locale: ContentLocale): string;
  signalsIndex(locale: ContentLocale): string;
  signal(locale: ContentLocale, niche: string, slug: string): string;
  localized(currentPath: string, targetLocale: ContentLocale): string; // intelligent switch
  // + matchers, builders, aliases
}
```

## 3. Implementation Rules

1. **Static First**: `StaticJsonProvider` reads a single compiled `generated/content-graph.json` at startup.
2. **isPublic Filtering**: All public queries must call and respect `isPublic()`, which enforces `qualityScore >= 95 && visibility === 'published'`.
3. **Locale Fallback**: If a queried locale is missing, fall back gracefully to the canonical locale or return a notice.
4. **Clean 404 Projections**: Access to non-existent niches or paths must produce deterministic projection fallbacks rather than crashing.
5. **Memoization**: Query methods must use lightweight build-time or load-time indexing/memoization to prevent O(N) scans.
