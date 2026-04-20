---
name: dopamine-budget
description: Hard motion limits — 1 whisper/viewport, max -2px translateY, ≤250ms
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Dopamine Budget

Hard limits on motion and effects for UniTeia.

## Motion Limits

| Property | Limit | Reason |
|----------|-------|--------|
| translateY (hover) | max -2px | Subtle, not distracting |
| animation-duration | max 250ms | Snappy, not sluggish |
| hover-glow | max 1 per viewport | Focus, not chaos |
| JRPG whisper | max 1 per viewport | Restraint is aesthetic |

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

**MANDATORY:** All animations must honor `prefers-reduced-motion`.

## Dopamine Card (Hover)

```css
.dopamine-card:hover {
  transform: translateY(-2px); /* MAX */
  box-shadow: 0 0 20px var(--sl-cyan-glow);
  transition: transform 200ms, box-shadow 220ms;
}
```

## JRPG Whisper (Example)

```css
.border-whisper {
  border-left: 2px solid var(--sl-bronze-bright);
  padding-left: 1rem;
}
```

Use for ONE element per page — editorial callout, quality ring, or evidence marker.

## Banned Patterns

- ❌ Perpetual animations
- ❌ Scroll-reveal cascades
- ❌ Parallax effects
- ❌ Auto-rotating carousels
- ❌ Linear easing (use cubic-bezier)

## Enforcement

Build fails if:
- Animation > 250ms
- translateY > -2px
- Multiple hover-glows in same viewport
