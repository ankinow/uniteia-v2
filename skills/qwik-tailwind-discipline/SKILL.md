---
name: qwik-tailwind-discipline
description: Stack-specific rules for Qwik resumability and Tailwind CSS config
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Qwik + Tailwind Discipline

Stack-specific patterns for UniTeia.

## Substitutions

| From | To | Reason |
|------|-----|--------|
| React | Qwik | Resumability, no hydration |
| UnoCSS | Tailwind | Canonical framework choice |
| Phosphor | Lucide | via iconify-tailwind, no React dep |
| Framer Motion | CSS transitions | 20KB budget |

## Qwik Patterns

### Component Declaration

```tsx
export const MyComponent = component$<Props>((props) => {
  return <div class="bg-void/deep">...</div>
})
```

### Server Data Loading

```tsx
export const useMyData = routeLoader$(async (requestEvent) => {
  // Runs on server only
  return await loadData()
})
```

### Event Handlers

```tsx
<button onClick$={() => handleClick()}>Click</button>
```

Use `$()` for lazy boundaries.

## Tailwind Config

Tailwind 3.4+ configured with SolarLanso 2100 tokens and dynamic icon selectors.

```js
theme: {
  extend: {
    colors: {
      void: '#0D1117',
      // ...
    }
  }
}
```

## PostCSS Pipeline

1. tailwindcss
2. postcss-nesting
3. postcss-custom-media
4. postcss-preset-env
5. autoprefixer

## Banned

- ❌ `useVisibleTask$` for logic (only for DOM integration)
- ❌ Client-side routing with full page reloads
- ❌ Inline styles
- ❌ UnoCSS (removed)
