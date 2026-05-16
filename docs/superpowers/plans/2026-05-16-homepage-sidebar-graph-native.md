# Gap 3+4 — Graph-Native Homepage + Dynamic Sidebar

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace homepage 302 redirect with a graph-native landing page and derive sidebar niche links from ContentGraphProvider instead of hardcoded strings.

**Architecture:** Projection-light layer on top of ContentGraphProvider. Thin pure functions that merge graph data with NicheConfig to produce UI projections. Qwik route loaders consume projections and pass data to presentational components.

**Tech Stack:** Qwik City, Bun, TypeScript, Biome, Vitest

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/content-graph/projections/navigation.ts` | Create | `getPublicNavigation()` — merge graph nodes + niche config → `NavigationItem[]` |
| `src/content-graph/projections/homepage.ts` | Create | `getHomepageProjection()` → featuredSignals + knowledgeClusters + frontierStreams |
| `src/content-graph/projections/index.ts` | Create | Barrel re-export |
| `src/components/sidebar/sidebar-nav.tsx` | Modify | Accept `NavigationItem[]` prop instead of hardcoded niche list |
| `src/components/sidebar/index.tsx` | Modify | Pass through `navigationItems` and `currentLang` to SidebarNav |
| `src/routes/layout.tsx` | Modify | Add `useSidebarNavigation` routeLoader + pass to `<Sidebar>` |
| `src/routes/[lang]/index.tsx` | Modify | Replace 302 redirect with homepage component rendering three sections |

---

## Task 1: Projection — Navigation

**Files:**
- Create: `src/content-graph/projections/navigation.ts`
- Create: `src/content-graph/projections/index.ts`

- [ ] **Step 1: Create navigation.ts**

```ts
import type { ContentGraph, ContentLocale } from '../contracts'
import type { NicheConfig } from '~/types/niche'

export interface NavigationItem {
  nicheSlug: string
  label: string
  href: string
  articleCount: number
  avgGraphScore: number
}

export function getPublicNavigation(
  graph: ContentGraph,
  nicheConfig: NicheConfig[],
  locale: ContentLocale,
): NavigationItem[] {
  const nicheMap = new Map(nicheConfig.map(n => [n.slug, n]))
  const items: NavigationItem[] = []

  for (const [nicheSlug, nodes] of graph.collections.byNiche) {
    const localeNodes = nodes.filter(n => n.locale === locale)
    if (localeNodes.length === 0) continue

    const config = nicheMap.get(nicheSlug)
    if (!config) continue

    const publicNodes = localeNodes.filter(n =>
      n.visibility === 'published' && n.trustScore >= 80,
    )
    if (publicNodes.length === 0) continue

    const totalScore = publicNodes.reduce((s, n) => s + n.metrics.graphScore, 0)

    items.push({
      nicheSlug,
      label: config.titles[locale] ?? config.titles.en,
      href: `/${locale}/signals/${nicheSlug}`,
      articleCount: publicNodes.length,
      avgGraphScore: totalScore / publicNodes.length,
    })
  }

  return items.sort((a, b) => b.avgGraphScore - a.avgGraphScore)
}
```

- [ ] **Step 2: Create barrel index.ts**

```ts
export type { NavigationItem } from './navigation'
export { getPublicNavigation } from './navigation'
export type { FeaturedSignal, KnowledgeCluster, FrontierStream, HomepageProjection } from './homepage'
export { getHomepageProjection } from './homepage'
```

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS — no type errors in new files

---

## Task 2: Projection — Homepage

**Files:**
- Create: `src/content-graph/projections/homepage.ts`

- [ ] **Step 1: Create homepage.ts**

```ts
import type { ContentGraph, ContentLocale, ContentNode } from '../contracts'
import type { NicheConfig } from '~/types/niche'

export interface FeaturedSignal {
  node: ContentNode
  href: string
}

export interface KnowledgeCluster {
  nicheSlug: string
  label: string
  href: string
  articleCount: number
  avgGraphScore: number
}

export interface FrontierStream {
  node: ContentNode
  href: string
}

export interface HomepageProjection {
  featuredSignals: FeaturedSignal[]
  knowledgeClusters: KnowledgeCluster[]
  frontierStreams: FrontierStream[]
}

export function getHomepageProjection(
  graph: ContentGraph,
  nicheConfig: NicheConfig[],
  locale: ContentLocale,
): HomepageProjection {
  const nicheMap = new Map(nicheConfig.map(n => [n.slug, n]))
  const localeNodes = graph.collections.byLocale[locale] ?? []
  const publicNodes = localeNodes.filter(n =>
    n.visibility === 'published' && n.trustScore >= 80,
  )

  const featuredSignals: FeaturedSignal[] = [...publicNodes]
    .sort((a, b) => b.metrics.graphScore - a.metrics.graphScore)
    .slice(0, 3)
    .map(node => ({ node, href: node.routes.canonical }))

  const knowledgeClusters: KnowledgeCluster[] = []
  for (const [nicheSlug, nodes] of graph.collections.byNiche) {
    const clusterNodes = nodes.filter(n =>
      n.locale === locale && n.visibility === 'published' && n.trustScore >= 80,
    )
    if (clusterNodes.length === 0) continue

    const config = nicheMap.get(nicheSlug)
    if (!config) continue

    knowledgeClusters.push({
      nicheSlug,
      label: config.titles[locale] ?? config.titles.en,
      href: `/${locale}/signals/${nicheSlug}`,
      articleCount: clusterNodes.length,
      avgGraphScore:
        clusterNodes.reduce((s, n) => s + n.metrics.graphScore, 0) / clusterNodes.length,
    })
  }

  const frontierStreams: FrontierStream[] = [...publicNodes]
    .sort((a, b) => b.metrics.freshnessScore - a.metrics.freshnessScore)
    .slice(0, 5)
    .map(node => ({ node, href: node.routes.canonical }))

  return { featuredSignals, knowledgeClusters, frontierStreams }
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

---

## Task 3: Dynamic SidebarNav

**Files:**
- Modify: `src/components/sidebar/sidebar-nav.tsx`

- [ ] **Step 1: Read current sidebar-nav.tsx**

Read the current file to understand the exact structure.

- [ ] **Step 2: Modify SidebarNavProps**

Replace hardcoded niche references with `NavigationItem[]` prop.

Changes:
1. Import `NavigationItem` from `~/content-graph/projections`
2. Import `SupportedLanguage` from `~/i18n/types`
3. Add `navigationItems: NavigationItem[]` to `SidebarNavProps`
4. Remove `currentLang` prop (niche items already have localized hrefs)
5. Replace hardcoded `<li>` elements with `navigationItems.map()`

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

---

## Task 4: Sidebar index.tsx — Pass Through Props

**Files:**
- Modify: `src/components/sidebar/index.tsx`

- [ ] **Step 1: Read current sidebar/index.tsx**

- [ ] **Step 2: Update SidebarProps and pass through to SidebarNav**

Add `navigationItems: NavigationItem[]` and `currentLang: SupportedLanguage` props. Pass them to `<SidebarNav>`.

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

---

## Task 5: Layout — RouteLoader + Wire Sidebar

**Files:**
- Modify: `src/routes/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

- [ ] **Step 2: Add useSidebarNavigation routeLoader**

```ts
import { contentGraphProvider } from '~/content-graph.generated'
import { getPublicNavigation } from '~/content-graph/projections'

export const useSidebarNavigation = routeLoader$(async ({ resolveValue }) => {
  const lang = (await resolveValue(useLanguage)) as SupportedLanguage
  const niches = await resolveValue(useNiches)
  return getPublicNavigation(contentGraphProvider, niches, lang)
})
```

Note: Import `SupportedLanguage` if not already imported.

- [ ] **Step 3: Pass data to Sidebar component**

In the component:
```tsx
const sidebarNavSignal = useSidebarNavigation()
```

Then update `<Sidebar>` invocation to pass props.

- [ ] **Step 4: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

---

## Task 6: Graph-Native Homepage

**Files:**
- Modify: `src/routes/[lang]/index.tsx`

- [ ] **Step 1: Read current homepage route**

- [ ] **Step 2: Replace 302 redirect with routeLoader + component**

Remove `onRequest` handler entirely. Add `useHomepage` routeLoader that resolves parent `useLanguage` and `useNiches`, then calls `getHomepageProjection`. Render three sections (Featured Signals, Knowledge Clusters, Frontier Streams) with empty-state fallback.

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: PASS

---

## Task 7: Full Pipeline Verification

- [ ] **Step 1: Run generate:content**

Run: `bun run generate:content`
Expected: PASS — 20 nodes, 186 edges, etc.

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: 0 errors

- [ ] **Step 3: Run lint**

Run: `bun run lint`
Expected: 0 issues

- [ ] **Step 4: Run test:unit**

Run: `bun run test:unit`
Expected: 241/241 tests passing

- [ ] **Step 5: Run build**

Run: `bun run build`
Expected: SSG generates pages including locale-specific homepages
