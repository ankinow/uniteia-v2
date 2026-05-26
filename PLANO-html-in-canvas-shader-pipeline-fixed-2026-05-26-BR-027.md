# PLANO-html-in-canvas-shader-pipeline-fixed-2026-05-26-BR-027

**Σ — AUDITORIA EXECUTIVA**

Pipeline: HTML-in-Canvas Shader + AetherCanvasEngine + feTurbulence + CanvasSurface
Target: uniteia-v2 Phase 4 / Aether OS
Agent: PA∞ SOTA Executive (Hermes Agent)
Data: 2026-05-26T18:30-03:00
Duration: 45min wall time (under budget)
Screenshot: User's image.png not on disk — substituído por live browser inspection (Browserbase) + browser_console CSS/DOM extraction

---

## Δ — SCREENSHOT vs LIVE SITE COMPARISON

| Seção | Screenshot do Usuário (image.png) | Live Site (2026-05-26 18:00) | Status |
|---|---|---|---|
| Estado da Rede | "empty/blurry" | Open Canvas Decision Flow renders com 20 elementos <br>MasterOpenCanvas variant=medium (default) | ⚠️ Visual dark-on-dark — outer wrapper transparent (rgba 0,0,0,0) <br>Inner glass: gradient bg + backdrop-blur 24px + bone text |
| SINAIS EM DESTAQUE | "garbled" | 3 signal cards with summaries visible <br>CinematicDepthCard bg=oklch(0.15 0.02 260 / 0.75) <br>Text summaries populated: "O que é a Magica?" etc. | ✅ Content presente <br>⚠️ Visual: dark glass cards on dark bg |
| CLUSTERS DE CONHECIMENTO | "empty" | Apex cluster: 4 signals · ∅84 <br>KnowledgeCluster renders with href | ✅ Content presente |
| CORRENTES DE FRONTEIRA | "empty" | 4 signals with freshness scores (100, 90) <br>FrontierStream renders with href | ✅ Content presente |
| CanvasSurface | N/A no screenshot | data-html-canvas="fallback" <br>HTML-in-Canvas API indisponível (Chrome OT não ativo) <br>No `<canvas>` child created | ⚠️ Sempre fallback |
| canvas-parchment | "no parchment active" | `.canvas-parchment` SAFEGUARDED: <br>bg=transparent!important, color=bone!important <br>Commit 5cb2826 | ❌ Safeguard ativo |

### Screenshot do Usuário Não Disponível

O arquivo `image.png` referenciado no PLANO-026 não está no disco (`/home/lermf/`). Usei live browser navigation + browser_console CSS/DOM extraction como substituto. Se o screenshot mostrava seções vazias/com blur, pode ter sido capturado antes do deploy do content-graph ou em estado intermediário de build.

---

## φ — ROOT CAUSE ANALYSIS (3 bugs identificados)

### Bug A — SAFEGUARD: canvas-parchment NEUTERED (CRÍTICO)
**File:** `src/global.css:889-896`
```css
.canvas-parchment {
  color: var(--bone) !important;
  background-color: transparent !important;
  border-color: var(--color-parchment-border);
}
```
**Origem:** Commit `5cb2826` ("fix: empty gray cards — remove variant=parchment das rotas ativas"). Após o revert do Phase 0 (`0155f38`), a classe `.canvas-parchment` foi desativada para prevenir cascade leak (`.canvas-parchment` definia `color: oklch(20%)` que sumia no fundo escuro do `.glass`). A solução foi neutrar com `!important` — mas isso impede QUALQUER uso de parchment no frontend.

**Impacto:** CanvasSurface tone="parchment" → MasterOpenCanvas variant="parchment" → zoneClass="canvas-parchment" → bg transparente, text bone. Visual = glass escuro sobre dark shell = baixo contraste.

### Bug B — zoneClass no inner div, não no outer wrapper
**File:** `src/components/master-open-canvas/index.tsx:225-250`
```tsx
// OUTER wrapper - line 225: SEM zoneClass!
<div class="mixed-media-canvas cursor-stylus perspective-dramatic preserve-3d relative">
  // INNER .glass - line 250: zoneClass AQUI
  <div class={['glass depth-surface relative preserve-3d', zoneClass]...}>
```
**Resultado:** O outer `.mixed-media-canvas` fica transparente (`rgba(0,0,0,0)`, sem background-image). O parchment/chrome só afeta o inner card. Visual = card flutuando no void.

### Bug C — CanvasSurface só usado na rota de artigo (ESCOPO INCOMPLETO)
**File:** `src/routes/[lang]/signals/[niche]/[slug]/index.tsx:124`
```tsx
<CanvasSurface tone="obsidian">
```
**Homepage** (`[lang]/index.tsx`): Usa `MasterOpenCanvas` sem `variant` (default='medium') + `ScrollContentCanvas`. **Zero** CanvasSurface na homepage.
**CanvasSurface** com HTML-in-Canvas shader pipeline (feTurbulence, drawElementImage, multiply blend, ink-bleed) — só executa se Chrome 148+ com Origin Trial ativo → feature detection falha → cai no fallback.

---

## λ — SHADER PIPELINE COMPLETENESS

### AetherCanvasEngine (SVG-based) — src/components/aether-canvas/
| Arquivo | Função | Status |
|---|---|---|
| aether-canvas-engine.tsx | Renderiza nodes + connectors em SVG, layout strategy | ✅ Completo |
| canvas-connector.tsx | Bezier connectors SVG | ✅ Completo |
| canvas-node.tsx | Canvas node com slot | ✅ Completo |
| layout-strategy.ts | Auto-layout algorithms (6805 chars) | ✅ Completo |
| aether-canvas-engine.test.ts | Testes | ✅ Presente |

### CanvasSurface (HTML-in-Canvas) — src/components/canvas-surface/
| Feature | Implementação | Status |
|---|---|---|
| Feature detection drawElementImage | `supportsHtmlInCanvas()` | ✅ Completo |
| layoutsubtree | `container.style.setProperty('layoutsubtree', ...)` | ✅ Completo |
| SVG feTurbulence parchment noise | 3 octaves, baseFrequency=0.65, opacity=0.06 | ✅ Completo |
| SVG ink-bleed displacement | feDisplacementMap scale=1.5 | ✅ Completo |
| Multiply blend composition | `globalCompositeOperation='multiply'` | ✅ Completo |
| Fallback to MasterOpenCanvas | variant='parchment' ou 'obsidian' | ✅ Completo |
| CanvasSurface CSS filters | data-tone CSS selectors | ✅ Completo |

### Aether Assets — src/assets/
| Asset | Função | Status |
|---|---|---|
| aether-assets-textures.css | feTurbulence parchment/fiber/grain/stain/coffee (SVG data URIs) | ✅ Completo |
| aether-assets-glow.css | Indigo/amber/teal glows, text glow, gradient meshes | ✅ Completo |
| aether-assets-frames.css | Polaroid frame, tape overlay, torn paper edge | ✅ Completo |
| aether-assets-animations.css | Lift, float, shimmer, fade-in (compositor-only) | ✅ Completo |

### Content Graph
| Metric | Value | Status |
|---|---|---|
| Total articles | 32 (4 por locale, 8 locales) | ✅ |
| Empty articles | 0 | ✅ |
| Locale symmetry | isFullySymmetric: true | ✅ |
| WCAG AAA contrast | 6/6 pass | ✅ |
| Generated at | 2026-05-26T18:01:30Z | ✅ Fresh |
| Homepage projection | returns featuredSignals, knowledgeClusters, frontierStreams | ✅ Populated |

---

## ♻️ — VERIFICATION GATES

### validate-oklch-contrast.ts
```
✅ parchment-surface → parchment-text   14.72:1  (≥ 7:1 AAA)
✅ chrome-surface → bone-text           16.90:1  (≥ 7:1 AAA)
✅ raised → bone                        10.02:1  (≥ 4.5:1 AA)
✅ void → bone                          15.54:1  (≥ 7:1 AAA)
✅ obsidian-surface → obsidian-text     13.15:1  (≥ 4.5:1 AA)
✅ parchment → parchment-text (canvas)  14.72:1  (≥ 7:1 AAA)
Total: 6 pass, 0 fail
```

### inventory-content.ts
```
Total: 32  Good: 32  Empty: 0  EN-stubs: 0
```

### Live Browser Console
```
ScrollContentCanvas bg:        rgb(19,24,32)  ✅ dark (fix 81b4b0b)
MasterOpenCanvas outer bg:     rgba(0,0,0,0)  ❌ transparent (Bug B)
MasterOpenCanvas inner glass:  gradient bg    ✅ renders on inner div
CinematicDepthCard bg:         oklch(15% 2% 260 / 75%) ✅ dark
CanvasSurface:                 fallback       ⚠️ Chrome OT not available
No JS errors                   except favicon:404
```

---

## ⚡ — NEXT STEPS PARA REATIVAR SHADER PIPELINE (Phase 4 genuine)

Para sair do estado atual (100% dark monolítico, parchment desativado) para Mixed UI Zones funcional, a sequência de correções necessárias:

### 1. Fix CSS Cascade (remove SAFEGUARD, parchment-aware glass)
Replace `global.css:892-896` — parchment variant should NOT use `.glass` gradient.
Criar `parchment-surface` class separada com:
- Background: `var(--color-parchment-surface)` (oklch 93% warm)
- Text: `var(--color-canvas-parchment-text)` (oklch 20% dark)
- feTurbulence noise overlay (SVG data URI)
- NO backdrop-filter glass (light surface doesn't need it)
- Border: `var(--color-parchment-border)`

### 2. Fix Bug B — move zoneClass to outer wrapper
MasterOpenCanvas: aplicar `canvas-parchment` / `canvas-chrome` no outer `.mixed-media-canvas` em vez do inner `.glass`. O parchment preenche toda a área. `.glass` mantém dark gradient só para variantes não-parchment.

### 3. Wrap homepage Estado da Rede with CanvasSurface
`[lang]/index.tsx`: Mestre do OpenCanvas existente dentro de `<CanvasSurface tone="parchment">` para ativar o pipeline de shader (ou o fallback parchment).

### 4. Progressive Enhancement
- Chrome 148+: HTML-in-Canvas API (drawElementImage + layoutsubtree + feTurbulence + multiply blend + ink-bleed) → canvas rasteriza DOM
- Fallback: MasterOpenCanvas variant="parchment" com a nova parchment-surface CSS (sem glass gradient, fundo claro)

---

## ⊕ — MEMORY UPDATE

```yaml
# Save to memory:
- canvas-parchment SAFEGUARD at global.css:889-896 neuters all parchment — to re-enable, fix cascade properly (remove glass gradient dependency, use dedicated parchment-surface class)
- CanvasSurface only used on article route ([slug]/index.tsx) with tone="obsidian" — homepage uses bare MasterOpenCanvas medium variant
- HTML-in-Canvas API (drawElementImage + layoutsubtree) NOT available in current browser — always falls back to MasterOpenCanvas
- 3 bugs identified: (A) SAFEGUARD, (B) zoneClass on inner div, (C) limited CanvasSurface scope
- All validation gates pass: 32/32 content healthy, 6/6 WCAG AAA, fresh content-graph

# Do NOT save:
- This plan (stale artifact after next session)
- The fix sequence (execution detail)
```

---

## Ψ — FINAL STATUS

```
┌──────────────────────────────────────────────────────────────────┐
│ PLANO-027 — SHADER PIPELINE EXECUTIVE SUMMARY                  │
├──────────────────────────────────────────────────────────────────┤
│ Content: 32/32 healthy, 8 locales symmetric  ✅                │
│ WCAG AAA: 6/6 pass                              ✅              │
│ CanvasSurface: feature detection implemented     ✅             │
│ Aether Assets: 4 CSS files completed             ✅             │
│ AetherCanvasEngine: nodes + connectors + layout  ✅             │
│ HTML-in-Canvas API: Chrome OT unavailable        ⚠️ Fallback    │
│ canvas-parchment: SAFEGUARDED (Bug A)            ❌             │
│ zoneClass position: inner div (Bug B)            ❌             │
│ CanvasSurface scope: article route only (Bug C)  ❌             │
│ Live site visual: 100% dark monolítico           ⚠️ Médio       │
│ Required fix sequence: 4 steps (see ↑)           🔧 Pronto      │
└──────────────────────────────────────────────────────────────────┘
```

**HASH**: $PA∞-027 | **Agent**: PA∞ SOTA | **Status**: complete-diagnosis | **Bugs**: 3 (A/B/C)
**Previous**: PLANO-026 | **Next**: Apply 4-step fix sequence → build → preview → human sign-off → deploy
**Human@write-boundary**: All patches >20 LOC blocked. Required: review PLANO-027, approve fix approach, then execute.
