---
name: brutalist-editorial
description: Swiss grid + corners 90° + editorial typography, forked from taste-skill/brutalist-skill
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Brutalist Editorial

Swiss print aesthetics + editorial typography for UniTeia.

## Keep from taste-skill/brutalist-skill

- Swiss grid discipline
- Corners at 90° (no border-radius on structural containers)
- Typography hierarchy (Inter for body, Geist for display)
- Monospace for metadata

## Remove from taste-skill

- ❌ CRT scanlines
- ❌ Halftones/dithering
- ❌ ASCII decorations
- ❌ Phosphor glow

## Typography Scale

```
display: 48/60 (hero only)
h1: 36/44
h2: 28/36
h3: 22/30
body-lg: 18/28
body: 16/26
meta: 14/22
mono: 14/22
```

## Prose Clamp

Max-width: 72ch for readability.

## Spacing

Use `border-t` and `divide-y` for section breaks, not card boxes.

## Monospace Usage

JetBrains Mono for:
- Slugs
- Timestamps
- Evidence IDs: `[^ex_001]`
- Footnote numbers

Never in body prose.
