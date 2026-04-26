=== UniTeia Header Diagnostic Report ===

Server: http://localhost:8788
Report: /dev/null

## Source Code Header Locations
```
src/routes/[lang]/n/index.tsx:38:      <header class="mb-8">
src/components/site-shell/index.tsx:65:      <header class="site-header" data-testid="site-header">
src/components/adaptive-header/index.tsx:29:    <header data-testid="adaptive-header" class={['adaptive-header', props.class]}>
src/components/niche-landing/index.tsx:28:        <header class="mb-10">
src/components/error-pages/server-error.tsx:21:      <header q:slot="header" class="site-header w-full">
```

## Header Element Count Per Source File
```
src/routes/[lang]/n/index.tsx: 1
src/components/site-shell/index.tsx: 1
src/components/adaptive-header/index.tsx: 1
src/components/niche-landing/index.tsx: 1
src/components/error-pages/server-error.tsx: 1
```

## AdaptiveHeader Usage Locations
```
src/routes/[lang]/[...slug]/index.tsx:3:import { AdaptiveHeader } from '~/components/adaptive-header'
src/routes/[lang]/[...slug]/index.tsx:72:      <AdaptiveHeader title={content.value.title} subtitle={content.value.subjects.join(', ')} />
src/components/adaptive-header/index.tsx:2:import type { AdaptiveHeaderProps, AdaptiveHeaderScale } from './types'
src/components/adaptive-header/index.tsx:27:export const AdaptiveHeader = component$<AdaptiveHeaderProps>(props => {
```

## Rendered Output - Header Count Per Route
Testing routes...

### Route: /en/n
  Header count: 0

### Route: /en/llm-aggregators-compared
