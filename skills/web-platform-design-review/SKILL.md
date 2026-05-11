---
name: web-platform-design-review
description: Review UniTeia-v2 UI, UX, MDX pages, visual packages and Qwik components for clarity, accessibility, hierarchy, mobile-first behavior and SolarLanso consistency
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
source: inspired by ehmo/platform-design-skills/tree/main/skills/web
---

# Web Platform Design Review

Internal design-review skill for UniTeia-v2. Evaluate UI clarity, accessibility, visual hierarchy, and SolarLanso token consistency before shipping.

## Trigger

Activate this skill when a task touches:

- Qwik components (`component$`, `routeLoader$`)
- Route layouts (`layout.tsx`, `index.tsx`)
- MDX pages or visual publication packages
- Content cards, accordions, decision maps
- Source cards, quality dashboards
- Tailwind classes or custom CSS
- Accessibility attributes (ARIA, roles, landmarks)
- Typography, spacing, or responsive behavior
- Beginner/intermediate readability concerns

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| Changed files | Yes | List of modified component/layout/MDX files |
| Target route | Yes | Route path being reviewed (e.g., `/en/n/ai-agents`) |
| Screenshot | No | Visual capture for quick assessment |
| Audience level | No | `beginner`, `intermediate`, `advanced` |
| Content purpose | No | `wiki`, `blog`, `comparison`, `buying_guide` |

## Review Checklist

### Structure (5-second test)

- [ ] Is the page understandable in 5 seconds?
- [ ] Is the main action or message obvious?
- [ ] Is the content hierarchy clear (H1 > H2 > H3)?
- [ ] Are sections visually grouped with consistent spacing?
- [ ] Does the layout use semantic HTML (`<main>`, `<article>`, `<aside>`)?

### Visual Hierarchy

- [ ] Primary CTA is visually dominant
- [ ] Secondary actions are clearly subordinate
- [ ] Whitespace guides the eye naturally
- [ ] No competing focal points
- [ ] Icon usage is consistent (Lucide only)

### Accessibility (A11y)

- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Focus states are visible and consistent
- [ ] Interactive elements have accessible names
- [ ] No reliance on color alone to convey meaning
- [ ] Skip links present for navigation
- [ ] Images have meaningful alt text or `aria-hidden="true"`

### Mobile-First

- [ ] Content reads well at 320px viewport
- [ ] Touch targets are minimum 44x44px
- [ ] No horizontal scroll at any breakpoint
- [ ] Typography scales appropriately
- [ ] Navigation is accessible on mobile

### SolarLanso Token Consistency

| Token | Purpose | Check |
|-------|---------|-------|
| `void` / `deep` / `mid` | Backgrounds | Using surface tokens? |
| `cyan-base` / `cyan-hi` | Actions | CTAs use action color? |
| `vine-glow` | Verified/success | Trust indicators correct? |
| `bronze-bright` | Curation | Evidence IDs styled? |
| `bone-base` / `bone-muted` | Text | Proper text hierarchy? |
| `t-fast` / `t-base` | Motion | Transitions under budget? |

### Copy Density

- [ ] Paragraphs are 3-5 sentences max
- [ ] Bullet points where lists make sense
- [ ] No wall-of-text sections
- [ ] Scannable headings and subheadings
- [ ] Technical terms explained for target audience

### Friction Points

- [ ] No hidden important information
- [ ] No generic empty states
- [ ] Error states are helpful and actionable
- [ ] Loading states are informative
- [ ] No dead-end pages

## Output Contract

Return structured review:

```txt
Design Review
─────────────
Verdict: pass | pass-with-fixes | fail

Main Issue:
[One sentence describing the primary concern]

Top 5 Fixes:
1. [Fix with file:line if applicable]
2. ...
3. ...
4. ...
5. ...

Minimal Diff:
[Smallest code change to address main issue]

A11y Concerns:
- [List any accessibility issues]

Mobile Concerns:
- [List any mobile layout issues]

SolarLanso/Token Concerns:
- [List any token misuse]

Copy Density Notes:
- [List any content issues]

Risk: low | medium | high
[Brief explanation of shipping risk]
```

## Rules

1. **Minimal diff** — Suggest the smallest change that fixes the issue
2. **No decorative UI** — Every element must serve a function
3. **Performance budget** — Keep under 20KB JS for interactions
4. **Semantic HTML first** — Use proper elements before ARIA
5. **No animation without purpose** — Motion must improve comprehension
6. **No UnoCSS** — Tailwind only, per stack discipline
7. **SolarLanso tokens** — Use design system colors, never raw hex

## Integration with Other Skills

This skill complements:

- `qwik-tailwind-discipline` — Stack patterns
- `solarlanso-tokens` — Color/motion tokens
- `brutalist-editorial` — Content tone
- `dopamine-budget` — Visual restraint
- `i18n-first` — Localization checks

## Example Review

```txt
Design Review
─────────────
Verdict: pass-with-fixes

Main Issue:
CTA button uses raw #00E0FF instead of cyan-base token

Top 5 Fixes:
1. src/components/cta-button.tsx:12 — Replace #00E0FF with bg-cyan-base
2. src/routes/[lang]/layout.tsx:45 — Add skip link for a11y
3. content/ai-agents/en/_index.md:15 — Break paragraph into bullet list
4. src/components/source-card.tsx:8 — Add aria-label to icon button
5. src/components/verdict-box.tsx:22 — Use vine-glow for verified badge

Minimal Diff:
- className="bg-[#00E0FF]"
+ className="bg-cyan-base"

A11y Concerns:
- Missing skip link in main layout
- Icon-only button lacks accessible name

Mobile Concerns:
- None detected

SolarLanso/Token Concerns:
- Raw hex in CTA button (see fix #1)

Copy Density Notes:
- /en/_index.md intro paragraph is 8 sentences, consider splitting

Risk: low
Token fix is cosmetic; a11y fixes are minor additions.
```
