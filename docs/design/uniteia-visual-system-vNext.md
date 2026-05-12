---
title: "UniTeia Mirror-Chameleon Knowledge Interface"
version: "vNext"
status: "proposal"
author: "StyleGuideΔ"
created: "2026-05-12"
schema: "visual_system/v1"
---

# UniTeia Visual System — StyleGuideΔ

> **Document type:** Comprehensive Design System Proposal
> **Status:** vNext · Draft for discussion

---

## 1. Thesis

> "A fábrica gera conteúdo. O frontend transmuta conteúdo em presença."

The UniTeia Mirror-Chameleon Knowledge Interface is a design system that treats content not as static data but as living presence. Every page, component, and interaction is calibrated to make knowledge feel **editorial, tactile, agentic, and memorable**.

We reject flat, generic UIs. Instead we build a system where:

- **Editorial** = typographic craft, generous whitespace, reading-rhythm-first layout
- **Tactile** = real-feeling materials (glass, paper, chrome) with physical depth cues
- **Agentic** = interfaces that anticipate, react, and guide without friction
- **Memorable** = dopamine-rich microinteractions, signature visual moves, Y2K-reminiscent personality

The frontend is not a delivery mechanism. It is the transformation layer — the place where raw content becomes felt experience.

---

## 2. Aesthetic Mix

The visual identity is a controlled blend of six aesthetic layers, each with a defined weight:

| Layer | Weight | Core Vibe |
|-------|--------|-----------|
| Editorial Collage | 30% | Typographic sophistication, generous whitespace, grid rhythm |
| Hyper-Tactile Material Depth | 25% | Glass morphism, physical depth, layered surfaces |
| Dopamine Microinteractions | 15% | Joyful motion, haptic-like feedback, sparkle moments |
| Retrofuture / Y2K | 12% | Chromium accents, frosted translucency, digital nostalgia |
| Neo-Brutal Controlled | 10% | Bold borders, raw typography, intentional asymmetry |
| Handdraw / Sketchnote | 8% | Hand-drawn arrows, circles, stickers, warmth |

### 2.1 Editorial Collage (30%)

**Description:** A typography-first layer inspired by premium editorial design — magazines, monograph layouts, and art catalogues. Content is composed in generous columns with deliberate hierarchy. Text is the hero, supported by whitespace as an active design element.

**Visual Signature:**
- Multi-column layouts with asymmetric grids
- Pull quotes, drop caps, marginalia
- Generous measure (65-75 characters per line)
- Type scale with dramatic range (tiny labels to massive headlines)

**CSS Implementation Notes:**
```css
:root {
  --measure-ideal: 70ch;
  --type-scale: clamp(0.75rem, 0.5vw + 0.75rem, 3rem);
  --grid-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.article-body {
  max-width: var(--measure-ideal);
  margin-inline: auto;
  column-gap: 2rem;
}
```

### 2.2 Hyper-Tactile Material Depth (25%)

**Description:** Surfaces feel real. Glass blurs, layered transparencies, physical depth cues that respond to scroll and hover. The interface borrows from industrial design — you can almost feel the materials.

**Visual Signature:**
- Multi-layer backdrop filters (8px-24px blur range)
- Beveled edges with subtle lighting
- Depth via box-shadows with color (not just black)
- Surface textures (scanlines, noise, grain)

**CSS Implementation Notes:**
```css
.glass-deep {
  background: linear-gradient(
    135deg,
    rgba(0, 255, 255, 0.08) 0%,
    rgba(0, 40, 80, 0.4) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 2.3 Dopamine Microinteractions (15%)

**Description:** Small moments of delight — micro-animations that trigger on hover, click, scroll, and state change. These are the "sparkle" of the system: subtle enough not to distract, present enough to reward exploration.

**Visual Signature:**
- Scale bumps on hover (transform: scale(1.02))
- Staggered entrance animations
- Counter/stat number rollups
- Success sparkles, confetti, or particle bursts
- Smooth spring-based transitions

**CSS Implementation Notes:**
```css
.dopamine-bump {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dopamine-bump:hover {
  transform: scale(1.03);
}
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}
```

### 2.4 Retrofuture / Y2K (12%)

**Description:** Chromium finishes, frosted translucency, Y2K-era digital optimism. This layer adds personality and nostalgia — a wink to the cyberfuture imagined in the early 2000s. Think Windows Vista-era glass meets Tron- legacy.

**Visual Signature:**
- Chrome gradients (cyan → gold → silver)
- Specular highlights on buttons and badges
- Aurora/nebula background effects
- Pixel-perfect borders with glow
- Monospace digital clock influences

**CSS Implementation Notes:**
```css
.chrome-surface {
  background: linear-gradient(
    135deg,
    #00e5ff 0%,
    #ffd700 50%,
    #c0c0c0 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 229, 255, 0.3));
}
```

### 2.5 Neo-Brutal Controlled (10%)

**Description:** Intentional roughness within a disciplined system. Bold borders, raw typography, asymmetric compositions that break the grid deliberately. This layer prevents the system from becoming too precious or sterile.

**Visual Signature:**
- Thick borders (2-4px solid)
- Raw/untreated type treatments
- Off-grid element placement
- High-contrast color blocking
- Slightly oversize UI elements

**CSS Implementation Notes:**
```css
.neo-brutal {
  border: 3px solid var(--cyan);
  box-shadow: 6px 6px 0 var(--deep);
  transform: rotate(-0.5deg);
}
.neo-brutal:hover {
  box-shadow: 3px 3px 0 var(--deep);
  transform: rotate(0deg) translate(-3px, -3px);
}
```

### 2.6 Handdraw / Sketchnote (8%)

**Description:** Imperfect, hand-drawn elements that add human warmth. Used sparingly for emphasis, explanation, and wayfinding. The digital equivalent of margin doodles.

**Visual Signature:**
- Hand-drawn arrows and circles (SVG stroke-dasharray)
- Wobbly/wavy borders
- Sketch-style icons
- Sticky-note callouts
- Chalkboard/whiteboard textures

**CSS Implementation Notes:**
```css
.handdraw-arrow {
  stroke: var(--cyan);
  stroke-width: 2;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-arrow 1.5s ease-in-out forwards;
}
@keyframes draw-arrow {
  to { stroke-dashoffset: 0; }
}
```

---

## 3. Materials System

Four core materials define all surfaces in the UniTeia interface. Every component uses exactly one of these materials as its base.

### 3.1 Carbon Glass

**Use in:** Navigation, site shell, hero sections, persistent UI chrome.

| Property | Value |
|----------|-------|
| Base | Dark (#0a0f1a to #0d1a2d) |
| Tint | Cyan (#00e5ff at 5-15% opacity) |
| Blur | backdrop-filter: blur(12px) |
| Layers | Multi-layer gradient (base → tint → highlight) |

**CSS Tokens:**
```css
--carbon-glass-bg: linear-gradient(
  135deg,
  rgba(10, 15, 26, 0.95) 0%,
  rgba(13, 26, 45, 0.85) 50%,
  rgba(0, 229, 255, 0.05) 100%
);
--carbon-glass-border: rgba(0, 229, 255, 0.15);
--carbon-glass-blur: 12px;
```

### 3.2 Frosted Knowledge Glass

**Use in:** Cards, dropdowns, content panels, overlays, modals.

| Property | Value |
|----------|-------|
| Base | Semi-transparent light (rgba 255,255,255, 0.03-0.08) |
| Blur | backdrop-filter: blur(4-8px) |
| Border | Subtle, rgba(255,255,255, 0.06-0.12) |
| Shadow | Soft, diffused |

**CSS Tokens:**
```css
--frosted-glass-bg: rgba(255, 255, 255, 0.04);
--frosted-glass-border: rgba(255, 255, 255, 0.08);
--frosted-glass-blur: 6px;
```

### 3.3 Torn Editorial Paper

**Use in:** Callouts, visual explainers, highlights, quotes, analogies.

| Property | Value |
|----------|-------|
| Base | Warm beige (#e8ddc8) |
| Text | Dark sepia (#2a2218) |
| Border | Torn/wavy edge (#d4c9b4) |
| Texture | Subtle paper grain noise |

**CSS Tokens:**
```css
--paper-bg: #e8ddc8;
--paper-text: #2a2218;
--paper-border: #d4c9b4;
--paper-noise: url("data:image/svg+xml,...");
```

### 3.4 Chrome Cyan-Gold

**Use in:** Primary CTAs, active states, key interactive highlights, donation buttons.

| Property | Value |
|----------|-------|
| Gradient | Cyan (#00e5ff) → Gold (#ffd700) |
| Metalness | High specular reflection simulation |
| Shadow | Colored metal shadow (cyan/gold tint) |
| Edge | Bright edge highlight (white → transparent) |

**CSS Tokens:**
```css
--chrome-gradient: linear-gradient(
  135deg,
  #00e5ff 0%,
  #00c8ff 25%,
  #ffd700 70%,
  #ffaa00 100%
);
--chrome-specular: rgba(255, 255, 255, 0.3);
--chrome-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
```

---

## 4. Per-Page Mood Matrix

Each page type in UniTeia gets a unique mood and visual approach tailored to its purpose.

| Page Type | Mood | Visual Approach | Primary Material |
|-----------|------|-----------------|-----------------|
| **Home** | Impact + Identity | Hero material layers, editorial collage splash, tactile CTA | Carbon Glass + Chrome |
| **Article** | Premium Reading | Editorial clean, generous whitespace, paper callouts, light texture | Frosted Glass + Paper |
| **Topic Index** | Exploration | 2.5D depth cards, badge clusters, filter bars, grid of discovery | Frosted Glass |
| **Language Root** | Portal | Simple navigation, strong i18n indicators, flag/badge language markers | Carbon Glass |
| **Visual Explainer** | Teaching | Whiteboard layout, hand-drawn annotations, sticker badges, step flows | Torn Paper + Handdraw |
| **Support / About** | Trust | Human copy, warm tones, CTA chrome, testimonial paper cards | Chrome + Paper |

### 4.1 Home — Impact + Identity

```css
.page-home {
  --page-mood: "impact";
  --hero-material: var(--carbon-glass-bg);
  --cta-material: var(--chrome-gradient);
  --collage-density: high;
}
```

### 4.2 Article — Premium Reading

```css
.page-article {
  --page-mood: "premium-reading";
  --text-measure: 70ch;
  --callout-material: var(--paper-bg);
  --texture-overlay: var(--paper-noise);
}
```

### 4.3 Topic Index — Exploration

```css
.page-topic-index {
  --page-mood: "exploration";
  --card-depth: 2.5d;
  --badge-style: "pill";
  --grid-density: high;
}
```

### 4.4 Language Root — Portal

```css
.page-language-root {
  --page-mood: "portal";
  --nav-simplified: true;
  --i18n-prominence: high;
}
```

### 4.5 Visual Explainer — Teaching

```css
.page-visual-explainer {
  --page-mood: "teaching";
  --background: var(--paper-bg);
  --annotation-style: "handdrawn";
  --sticker-visible: true;
}
```

### 4.6 Support / About — Trust

```css
.page-support {
  --page-mood: "trust";
  --cta-style: "chrome";
  --copy-tone: "warm";
  --testimonial-style: "paper-torn";
}
```

---

## 5. Token Plan

All design tokens organized by group with their CSS custom property names.

### 5.1 Surface Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Void | `--void` | `#0a0f1a` |
| Deep | `--deep` | `#0d1a2d` |
| Mid | `--mid` | `#1a2a40` |
| Raised | `--raised` | `#243450` |

### 5.2 Accent Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Cyan | `--cyan` | `#00e5ff` |
| Vine | `--vine` | `#00ff88` |
| Bronze | `--bronze` | `#cda45e` |
| Orange | `--orange` | `#ff6b35` |

### 5.3 Text Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Bone | `--bone` | `#e8e0d4` |
| Bone Muted | `--bone-muted` | `#a09884` |

### 5.4 Glass Tokens

| Token | CSS Variable | Value | Notes |
|-------|-------------|-------|-------|
| Glass BG | `--glass-bg` | `rgba(255,255,255,0.04)` | Base frosted background |
| Glass Border | `--glass-border` | `rgba(255,255,255,0.08)` | Subtle rim |
| Glass Blur L1 | `--glass-blur-1` | `4px` | Light frosted |
| Glass Blur L2 | `--glass-blur-2` | `8px` | Standard frosted |
| Glass Blur L3 | `--glass-blur-3` | `16px` | Heavy frosted / carbon |

### 5.5 Depth 2.5D Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Z-2.5D Back | `--z-2d5-back` | `translateZ(-40px) scale(0.9)` |
| Z-2.5D Base | `--z-2d5-base` | `translateZ(0) scale(1)` |
| Z-2.5D Front | `--z-2d5-front` | `translateZ(20px) scale(1.05)` |
| Z-2.5D Floating | `--z-2d5-floating` | `translateZ(60px) scale(1.1)` |
| Perspective | `--perspective-2d5` | `800px` |

### 5.6 PBR (Physical Based Rendering) Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Specular | `--pbr-specular` | `rgba(255,255,255,0.15)` |
| Metalness | `--pbr-metalness` | `0.6` |

### 5.7 Paper Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Paper BG | `--paper-bg` | `#e8ddc8` |
| Paper Text | `--paper-text` | `#2a2218` |
| Paper Border | `--paper-border` | `#d4c9b4` |

### 5.8 Motion Tokens

| Token | CSS Variable | Value |
|-------|-------------|-------|
| Time Fast | `--t-fast` | `120ms` |
| Time Base | `--t-base` | `250ms` |
| Time Slow | `--t-slow` | `500ms` |
| Ease Solar | `--ease-solar` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Ease Snap | `--ease-snap` | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| Ease Bounce | `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` |

### 5.9 Signal Utility

```css
.grid-signal {
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

## 6. Component Plan

Every component group mapped to its visual material and design behavior.

| Component | Base Material | Design Features | States |
|-----------|--------------|-----------------|--------|
| **SiteShell** | Carbon Glass + Signal Grid | Full-viewport background, persistent chrome, signal grid overlay | — |
| **Sidebar** | Carbon Glass + Scanlines | Pixel font labels, cyan accent borders, collapsible with glass blur | collapsed/expanded |
| **DepthCard** | Frosted Knowledge Glass | 2.5D perspective on hover, layered shadow, cyan edge glow | default/hover/active |
| **DopamineCard** | Torn Paper | Badge in corner, scale-bump hover, entrance stagger | default/hover |
| **LessonBlock** | Frosted Knowledge Glass | 3 tone variants (default/highlight/warning), left accent border | default/highlight/warning |
| **AnalogyBox** | Torn Editorial Paper | Wavy border, hand-drawn icon prefix, warm shadow | default/hover |
| **HanddrawArrow** | Cyan Stroke | SVG dasharray animation, 2px stroke, rounded caps | drawing/complete |
| **HanddrawCircle** | Cyan Stroke | SVG dasharray animation, 3px stroke, pulsing glow | drawing/complete |
| **QuestProgress** | Carbon Glass + Chrome | JRPG diamond tracker, step indicators, completion sparkle | locked/active/complete |
| **CTA / Donation** | Chrome Cyan-Gold | Specular highlight, metalness shadow, scale-bump, gradient flow | default/hover/active/loading |
| **Badge** | Frosted Glass or Chrome | Pill or square, icon + label, micro interactions | default/hover/selected |
| **FilterBar** | Carbon Glass | Horizontal scroll, pill filters, active chrome indicator | default/hover/active |

### 6.1 SiteShell

```css
.siteshell {
  background: var(--carbon-glass-bg);
  backdrop-filter: blur(var(--glass-blur-3));
  position: relative;
}
.siteshell::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--signal-grid);
  pointer-events: none;
}
```

### 6.2 DepthCard

```css
.depth-card {
  background: var(--frosted-glass-bg);
  backdrop-filter: blur(var(--glass-blur-2));
  border: 1px solid var(--glass-border);
  transform: perspective(var(--perspective-2d5)) var(--z-2d5-base);
  transition: transform var(--t-base) var(--ease-solar);
}
.depth-card:hover {
  transform: perspective(var(--perspective-2d5)) var(--z-2d5-front);
  box-shadow: 0 20px 60px rgba(0, 229, 255, 0.1);
}
```

### 6.3 QuestProgress

```css
.quest-diamond {
  width: 12px;
  height: 12px;
  background: var(--frosted-glass-bg);
  border: 1px solid var(--glass-border);
  transform: rotate(45deg);
  transition: all var(--t-base) var(--ease-snap);
}
.quest-diamond.active {
  background: var(--chrome-gradient);
  border-color: var(--cyan);
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.5);
}
.quest-diamond.complete {
  background: var(--vine);
  border-color: var(--vine);
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
}
```

---

## 7. Mirror-Chameleon Principle

The design system is not static — it **mutates** based on context. This is the core innovation of the Mirror-Chameleon approach.

### Mutation Axes

The interface transforms across four independent axes:

```
Route      →  home | article | topic | explainer | support | language-root
Language   →  en | pt | es | fr | de | ja | zh | ar (affects spacing, font stack, line height)
Content    →  prose | code | visual-explainer | data-table | analogy
Device     →  mobile | tablet | desktop | wide
```

### Mutation Formula

```
Σ($ROUTE + $LANG + $CONTENT_TYPE)
  → ⊕(tokens + collage + material)
    → λ(layout)
      → ♻️(a11y/link/perf)
        → Δ(style mutation candidate)
```

**Explanation:**
1. **Σ** — Sum the three context signals (route, language, content type)
2. **⊕** — Select the token set, collage density, and primary material
3. **λ** — Apply layout adjustments (columns, measure, spacing)
4. **♻️** — Run accessibility, linking, and performance checks
5. **Δ** — Output the final style mutation

### Route-Based Mutation

| Route | Token Override | Material Shift | Layout Delta |
|-------|---------------|----------------|--------------|
| Home | Default set | Carbon → Chrome (CTA) | Hero full-bleed |
| Article | High-contrast text | Frosted → Paper (callouts) | Narrow measure |
| Topic | Raised surface values | Frosted heavy | Grid dense |
| Explainer | Paper palette dominant | Torn + Handdraw | Whiteboard flex |

### Language-Based Mutation

| Language Property | Adjustment |
|------------------|------------|
| Long text (DE, RU) | Increased letter-spacing, reduced font-size 5% |
| CJK (JA, ZH) | Increased line-height (1.8 vs 1.5), different font stack |
| RTL (AR, HE) | Mirror layout, adjust margin/padding directionals |

### Content-Type Mutation

| Content Type | Visual Shift |
|-------------|--------------|
| Prose Article | Editorial clean, minimal chrome, max readability |
| Visual Explainer | Paper background, hand-drawn annotations, sticker badges |
| Code Block | Terminal-inspired dark surface, mono font, line highlights |
| Analogy | Torn paper box, hand-drawn arrow connectors |

### Device Mutation

| Device | Grid Columns | Glass Blur | Card Density |
|--------|-------------|------------|--------------|
| Mobile | 1 column | 4px (L1) | Single stack |
| Tablet | 2 columns | 6px (L2) | 2-column grid |
| Desktop | 3-4 columns | 8px (L2) | Multi-grid |

```javascript
// Conceptual mutation engine
function mutateStyle(route, lang, contentType, device) {
  const tokens = selectTokens(route, lang);
  const material = selectMaterial(route, contentType);
  const layout = computeLayout(device, lang);
  const accessibility = auditContrast(tokens);
  const perf = optimizeGlass(layout, device);

  return {
    tokens: applyOverrides(tokens, accessibility),
    material,
    layout: perf.grid,
    mutations: [route, lang, contentType, device],
  };
}
```

---

## 8. Anti-Patterns

These patterns are explicitly **banned** from the UniTeia visual system with reasoning.

### ❌ Flat Generic UI

**Banned:** Solid, flat backgrounds with no depth, texture, or material cues.
**Reasoning:** Contradicts the tactile thesis. UniTeia surfaces must feel like *something* — glass, paper, chrome, or carbon.

### ❌ Pure Black (#000000)

**Banned:** Using `#000000` for backgrounds or text.
**Reasoning:** The system uses `--void (#0a0f1a)` as its darkest value — a near-black with blue/cyan depth. Pure black flattens the visual hierarchy and eliminates the carbon-glass illusion.

### ❌ Default System Font Stack

**Banned:** Relying on `system-ui, sans-serif` without a curated typeface.
**Reasoning:** Editorial quality demands intentional typography. The system requires a chosen type family (e.g., Inter, Satoshi, or similar) with defined weights and sizes.

### ❌ Undifferentiated Cards

**Banned:** Cards that all look identical with no material variation.
**Reasoning:** Each card type (DepthCard, DopamineCard, LessonBlock, AnalogyBox) must be visually distinguishable by its material, not just its content.

### ❌ No-Motion / Instant Transitions

**Banned:** `transition: none` or 0ms transitions on interactive elements.
**Reasoning:** Dopamine microinteractions require motion. Even subtle 120ms transitions signal reactivity. Dead-instant transitions feel broken.

### ❌ Heavy Box Shadows in Gray

**Banned:** `box-shadow: 0 4px 12px rgba(0,0,0,0.5)` style shadows.
**Reasoning:** Shadows should use colored light sources — cyan-tinted for glass, gold-tinted for chrome. Gray shadows are dead and generic.

### ❌ Centered Everything

**Banned:** Centered text and centered layouts on article/reading pages.
**Reasoning:** Editorial design uses asymmetric composition, generous margins, and left-aligned reading columns. Centered text is reserved for hero moments only.

### ❌ Ignoring Reduced Motion

**Banned:** Animations that don't respect `prefers-reduced-motion`.
**Reasoning:** Accessibility is non-negotiable. All motion must be gated behind `@media (prefers-reduced-motion: no-preference)`.

### ❌ Color-Only State Changes

**Banned:** Changing only color to indicate state (e.g., blue → red for error).
**Reasoning:** State changes must include at least two cues: color + icon, color + elevation, or color + motion. Single-cue states fail accessibility.

### ❌ Inconsistent Glass Blur

**Banned:** Arbitrary blur values per component.
**Reasoning:** Glass blur is constrained to exactly three levels (L1=4px, L2=8px, L3=16px). Any deviation breaks the material system's internal consistency.

---

## Appendix A: CSS Custom Properties Reference

```css
:root {
  /* Surfaces */
  --void: #0a0f1a;
  --deep: #0d1a2d;
  --mid: #1a2a40;
  --raised: #243450;

  /* Accents */
  --cyan: #00e5ff;
  --vine: #00ff88;
  --bronze: #cda45e;
  --orange: #ff6b35;

  /* Text */
  --bone: #e8e0d4;
  --bone-muted: #a09884;

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur-1: 4px;
  --glass-blur-2: 8px;
  --glass-blur-3: 16px;

  /* Depth 2.5D */
  --z-2d5-back: translateZ(-40px) scale(0.9);
  --z-2d5-base: translateZ(0) scale(1);
  --z-2d5-front: translateZ(20px) scale(1.05);
  --z-2d5-floating: translateZ(60px) scale(1.1);
  --perspective-2d5: 800px;

  /* PBR */
  --pbr-specular: rgba(255, 255, 255, 0.15);
  --pbr-metalness: 0.6;

  /* Paper */
  --paper-bg: #e8ddc8;
  --paper-text: #2a2218;
  --paper-border: #d4c9b4;

  /* Motion */
  --t-fast: 120ms;
  --t-base: 250ms;
  --t-slow: 500ms;
  --ease-solar: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snap: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Signal Grid Utility */
.grid-signal {
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

## Appendix B: YAML Machine-Readable Schema

```yaml
visual_system:
  name: "UniTeia Mirror-Chameleon Knowledge Interface"
  thesis: "Conhecimento vivo com interface editorial, tátil, agentic e memorável."
  version: "vNext"
  status: "proposal"

  aesthetic_mix:
    editorial_collage:
      weight: 30
      description: "Typographic sophistication, generous whitespace, grid rhythm"
    hyper_tactile_material_depth:
      weight: 25
      description: "Glass morphism, physical depth, layered surfaces"
    dopamine_microinteractions:
      weight: 15
      description: "Joyful motion, haptic-like feedback, sparkle moments"
    retrofuture_y2k:
      weight: 12
      description: "Chromium accents, frosted translucency, digital nostalgia"
    neo_brutal_controlled:
      weight: 10
      description: "Bold borders, raw typography, intentional asymmetry"
    handdraw_sketchnote:
      weight: 8
      description: "Hand-drawn arrows, circles, stickers, warmth"

  materials:
    - id: carbon_glass
      use: ["nav", "shell", "hero"]
      base: "Dark with cyan tint"
      blur: 12
    - id: frosted_knowledge_glass
      use: ["cards", "dropdowns", "content_panels"]
      base: "Light semi-transparent"
      blur: 6
    - id: torn_editorial_paper
      use: ["callouts", "visual_explainers", "highlights"]
      base: "#e8ddc8"
      texture: "paper_grain"
    - id: chrome_cyan_gold
      use: ["CTAs", "active_states"]
      gradient: ["#00e5ff", "#ffd700"]
      metalness: 0.6

  page_moods:
    home: { mood: "impact_identity", material: "carbon+chrome" }
    article: { mood: "premium_reading", material: "frosted+paper" }
    topic_index: { mood: "exploration", material: "frosted" }
    language_root: { mood: "portal", material: "carbon" }
    visual_explainer: { mood: "teaching", material: "paper+handdraw" }
    support: { mood: "trust", material: "chrome+paper" }

  tokens:
    surface: { void: "#0a0f1a", deep: "#0d1a2d", mid: "#1a2a40", raised: "#243450" }
    accents: { cyan: "#00e5ff", vine: "#00ff88", bronze: "#cda45e", orange: "#ff6b35" }
    text: { bone: "#e8e0d4", bone_muted: "#a09884" }
    glass: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", blur_L1: 4, blur_L2: 8, blur_L3: 16 }
    depth_2d5: { z_back: "translateZ(-40px) scale(0.9)", z_base: "translateZ(0) scale(1)", z_front: "translateZ(20px) scale(1.05)", z_floating: "translateZ(60px) scale(1.1)", perspective: "800px" }
    pbr: { specular: "rgba(255,255,255,0.15)", metalness: 0.6 }
    paper: { bg: "#e8ddc8", text: "#2a2218", border: "#d4c9b4" }
    motion: { t_fast: "120ms", t_base: "250ms", t_slow: "500ms", ease_solar: "cubic-bezier(0.34, 1.56, 0.64, 1)", ease_snap: "cubic-bezier(0.25, 0.1, 0.25, 1)", ease_bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }

  components:
    SiteShell: { material: "carbon_glass", features: ["signal_grid"], states: [] }
    Sidebar: { material: "carbon_glass", features: ["scanlines", "pixel_font"], states: ["collapsed", "expanded"] }
    DepthCard: { material: "frosted_knowledge_glass", features: ["2.5D_depth"], states: ["default", "hover", "active"] }
    DopamineCard: { material: "torn_editorial_paper", features: ["badge"], states: ["default", "hover"] }
    LessonBlock: { material: "frosted_knowledge_glass", features: ["3_tones"], states: ["default", "highlight", "warning"] }
    AnalogyBox: { material: "torn_editorial_paper", features: ["wavy_border"] }
    HanddrawArrow: { material: "cyan_stroke", features: ["dasharray_animation"] }
    HanddrawCircle: { material: "cyan_stroke", features: ["dasharray_animation", "pulse"] }
    QuestProgress: { material: "carbon_glass+chrome", features: ["diamond_tracker"], states: ["locked", "active", "complete"] }
    CTA_Donation: { material: "chrome_cyan_gold", features: ["specular", "metalness"], states: ["default", "hover", "active", "loading"] }

  mirror_chameleon:
    axes: ["route", "language", "content_type", "device"]
    formula: "Σ($ROUTE + $LANG + $CONTENT_TYPE) → ⊕(tokens + collage + material) → λ(layout) → ♻️(a11y/link/perf) → Δ(style mutation candidate)"

  anti_patterns:
    - id: flat_generic_ui
      severity: critical
    - id: pure_black
      severity: high
    - id: default_system_font
      severity: high
    - id: undifferentiated_cards
      severity: medium
    - id: no_motion
      severity: high
    - id: gray_shadows
      severity: medium
    - id: centered_everything
      severity: medium
    - id: ignore_reduced_motion
      severity: critical
    - id: color_only_states
      severity: high
    - id: inconsistent_glass_blur
      severity: medium
```

---

> **StyleGuideΔ — UniTeia vNext**  
> This document is a living proposal. All tokens, materials, and patterns are subject to refinement through implementation.
