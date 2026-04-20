---
name: uniteia-core
description: Master activator for UniTeia skills — loads all other skills in correct order, defines Layer 1/2/3 priority
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# UniTeia Core Skill

Master activation skill that loads all other UniTeia skills.

## Load Order

1. canonical-url-law
2. i18n-first
3. brutalist-editorial
4. solarlanso-tokens
5. qwik-unocss-discipline
6. dopamine-budget
7. output-enforcement
8. anti-slop-content

## Layer Priority

- **Layer 1 (CANONICAL):** Non-negotiable, always wins conflicts
- **Layer 2 (AESTHETIC):** Applied via tokens + shortcuts
- **Layer 3 (PER-ATOM):** Contextual expressiveness

## Stack Lock

- Runtime: Bun 1.x
- Framework: Qwik-City 2.x
- CSS: UnoCSS + PostCSS
- Lint: Biome
- Icons: Lucide via preset-icons

## Anti-Goals

❌ React, Tailwind, shadcn, Framer Motion, glassmorphism, light mode, analytics, proper nouns in slugs
