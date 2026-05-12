# UniTeia Frontend Design Cookbook

> Visual language for teaching AI concepts with brutalist clarity and JRPG soul.

---

## 1. Design DNA

UniTeia blends three aesthetics:

| Layer | Source | Role |
|-------|--------|------|
| **Foundation** | SolarLanso tokens | Dark mode base, cyan/orange highlights |
| **Texture** | Neumorphism Ultra 2026 | Layered depth, subtle shadows |
| **Charm** | JRPG pixel nostalgia | Sidebar soul, quest progress, pixel fonts |

---

## 2. Color System

### SolarLanso Palette (primary)

```css
--void:    oklch(0.13 0.02 260);    /* deep space background */
--ink:     oklch(0.17 0.02 260);    /* card surfaces */
--graphite: oklch(0.25 0.03 260);   /* borders, muted text */
--silver:  oklch(0.70 0.02 260);    /* body text */
--bone:    oklch(0.92 0.02 80);     /* headings, bright text */
--cyan:    oklch(0.75 0.15 195);    /* primary accent, links */
--orange:  oklch(0.72 0.18 50);     /* warnings, CTAs */
--vine:    oklch(0.65 0.14 145);    /* success states */
--bronze:  oklch(0.55 0.12 60);     /* secondary accent */
```

### Teaching Aliases (ut-* tokens)

```css
--ut-bg:       var(--void);
--ut-cyan:     var(--cyan);
--ut-paper:    #e8ddc8;            /* analogy boxes */
--ut-success:  var(--vine);
--ut-warning:  var(--bronze);
--ut-handdraw-stroke: var(--cyan);
```

---

## 3. Typography

### Font Stack

| Use | Font | Fallback |
|-----|------|----------|
| Body | Inter | system-ui |
| Headings | Inter 700 | system-ui |
| Sidebar | Silkscreen (pixel) | monospace |
| Code | JetBrains Mono | monospace |

### Scale

```css
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
```

---

## 4. Spacing

Use 4px grid (`gap-1` = 4px, `gap-2` = 8px, etc.):

| Token | Value | Use |
|-------|-------|-----|
| `gap-1` | 4px | Tight inline spacing |
| `gap-2` | 8px | Icon-to-text |
| `gap-4` | 16px | Component padding |
| `gap-6` | 24px | Section spacing |
| `gap-8` | 32px | Major sections |

---

## 5. Depth System

### Neumorphic Layers

```css
/* Surface (cards) */
.depth-surface {
  background: var(--ink);
  box-shadow:
    inset 1px 1px 2px oklch(1 0 0 / 0.03),
    inset -1px -1px 2px oklch(0 0 0 / 0.2);
}

/* Raised (buttons, interactive) */
.depth-raised {
  background: var(--graphite);
  box-shadow:
    2px 2px 4px oklch(0 0 0 / 0.3),
    -1px -1px 2px oklch(1 0 0 / 0.02);
}

/* Pressed (active state) */
.depth-pressed {
  box-shadow:
    inset 2px 2px 4px oklch(0 0 0 / 0.3),
    inset -1px -1px 2px oklch(1 0 0 / 0.02);
}
```

---

## 6. Motion

### Timing Functions

```css
--ease-solar:   cubic-bezier(0.4, 0, 0.2, 1);  /* default */
--ease-snap:    cubic-bezier(0.2, 0, 0, 1);    /* quick feedback */
--ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Scale

| Token | Duration | Use |
|-------|----------|-----|
| `duration-75` | 75ms | Micro-interactions |
| `duration-150` | 150ms | Hover states |
| `duration-300` | 300ms | Transitions |
| `duration-500` | 500ms | Page elements |

### Reduced Motion

Always wrap animations:

```css
@media (prefers-reduced-motion: no-preference) {
  .animate-pulse { animation: pulse 2s infinite; }
}
```

---

## 7. Component Patterns

### Depth Card

```tsx
<DepthCard variant="raised" class="p-4">
  <h3 class="text-bone text-lg font-bold">Title</h3>
  <p class="text-silver">Content</p>
</DepthCard>
```

### Dopamine Card (reward moments)

```tsx
<DopamineCard
  icon="sparkles"
  title="Achievement"
  description="You learned something!"
/>
```

### Editorial Verdict

```tsx
<EditorialVerdict
  verdict="recommended"
  summary="This tool delivers on its promise."
/>
```

### Niche Card

```tsx
<NicheCard
  niche={{ slug: 'ai-agents', emoji: 'robot' }}
  label="AI Agents"
/>
```

---

## 8. Teaching Components

### Lesson Hero

```tsx
<LessonHero
  title="What is a Neural Network?"
  promise="In 5 minutes, you will understand how machines learn."
  lang="en"
/>
```

### Lesson Block

```tsx
<LessonBlock
  title="Key Concept"
  body="Neural networks are inspired by biological neurons..."
  action={{ label: "Try it", href: "/playground" }}
  tone="highlight"
/>
```

### Analogy Box

```tsx
<AnalogyBox
  analogy="A neural network is like a team of specialists voting on an answer."
/>
```

### Summary Board

```tsx
<SummaryBoard
  items={[
    "Neural networks have layers",
    "Each layer transforms data",
    "Training adjusts weights"
  ]}
/>
```

### Next Lesson Card

```tsx
<NextLessonCard
  href="/en/n/ai-agents/lesson-2"
  title="Training Your First Model"
  label="Next up"
/>
```

---

## 9. JRPG Components

### Quest Progress

```tsx
<QuestProgress
  steps={["Intro", "Core Concepts", "Practice", "Quiz"]}
  current={1}
/>
```

### Sidebar (existing)

- Pixel font (Silkscreen)
- Scanlines overlay
- BuyMeACoffee button
- Navigation with JRPG-style labels

---

## 10. Handdraw Visuals

SVG-based hand-drawn annotations for teaching emphasis:

### Arrow

```tsx
<HanddrawArrow direction="right" class="w-24 h-8" />
```

### Circle

```tsx
<HanddrawCircle class="w-16 h-16" />
```

Both use `stroke-dasharray` animation with reduced-motion guards.

---

## 11. Anti-Patterns

### DO NOT

- Use `rounded-*` Tailwind classes (global reset enforces `border-radius: 0`)
- Use `h-screen` (banned per AGENTS.md)
- Hardcode content in components (use props)
- Skip reduced-motion guards on animations
- Use placeholder images or lorem ipsum

### DO

- Use `style={{ borderRadius: '...' }}` for radius exceptions
- Use `min-h-screen` for full-height layouts
- Pass all content via props
- Wrap all animations in `prefers-reduced-motion` checks
- Use real copy or leave slots empty

---

## 12. Accessibility

| Rule | Implementation |
|------|----------------|
| Color contrast | All text meets WCAG AA (4.5:1) |
| Focus indicators | `focus-visible:ring-2 ring-cyan` |
| Skip links | Hidden skip-to-content link |
| Alt text | All images require `alt` prop |
| Motion | `prefers-reduced-motion` honored |
| Keyboard nav | All interactive elements focusable |

---

## 13. File Structure

```
src/components/
├── depth-card/
├── dopamine-card/
├── editorial-verdict/
├── niche-card/
├── article-frame/
├── sidebar/
├── lesson/
│   ├── lesson-hero.tsx
│   ├── lesson-block.tsx
│   ├── analogy-box.tsx
│   ├── summary-board.tsx
│   └── next-lesson-card.tsx
├── visual/
│   ├── handdraw-arrow.tsx
│   └── handdraw-circle.tsx
└── jrpg/
    └── quest-progress.tsx
```

---

## 14. Token Reference

See `src/global.css` for full token definitions.
See `tailwind.config.js` for Tailwind theme extensions.
See `docs/design/design-dna.yaml` for machine-readable design spec.
