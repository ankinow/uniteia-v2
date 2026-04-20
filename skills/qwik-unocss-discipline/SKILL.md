---
name: qwik-unocss-discipline
description: Stack-specific rules for Qwik resumability and UnoCSS config
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Qwik + UnoCSS Discipline

Stack-specific patterns for UniTeia.

## Substitutions

| From | To | Reason |
|------|-----|--------|
| React | Qwik | Resumability, no hydration |
| Tailwind | UnoCSS | Faster, smaller bundle |
| Phosphor | Lucide | via preset-icons, no React dep |
| Framer Motion | CSS transitions | 20KB budget |

## Qwik Patterns

### Component Declaration

```tsx
export const MyComponent = component$<Props>((props) => {
  return <div class="surface-deep">...</div>
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

## UnoCSS Config

```ts
presets: [
  presetWind3(),
  presetAttributify(),
  presetTypography(),
  presetIcons({ scale: 1.2 }),
  presetWebFonts({ fonts: { sans: 'Inter', display: 'Geist', mono: 'JetBrains Mono' } })
],
transformers: [
  transformerVariantGroup(),
  transformerDirectives()
]
```

## Attributify Mode

```tsx
<div text="bone" bg="void" p="4">Content</div>
```

Instead of `class="text-bone bg-void p-4"`.

## PostCSS Pipeline

Runs AFTER UnoCSS:
1. postcss-nesting
2. postcss-custom-media
3. postcss-preset-env (stage 2)
4. autoprefixer

## Banned

- ❌ `useVisibleTask$` for logic (only for DOM integration)
- ❌ Client-side routing with full page reloads
- ❌ Inline styles (use UnoCSS classes)
