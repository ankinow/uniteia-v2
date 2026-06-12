# PLANO: Neo Pixel × Sunset Saga — Refatoracao Visual UniTeia v2

> **Σ — CONTRACT**
> Fusao de duas esteticas do deep-research-report(10):
> - **Neo Pixel**: estrutura pixel-perfect, solid colors, nearest-neighbor, translateZ depth
> - **Sunset Saga**: paleta quente crepuscular, texturas de pergaminho/pincel, iluminacao dramatica
>
> Resultado: **"Retro Digital Crepuscular"** — UI pixelada com alma de por do sol, texturas ricas
> e detalhes ornamentais inspirados em JRPGs de era 16-bit (Chrono Trigger, Final Fantasy VI).

---

## 1. PALETA: Sunset Pixel

### Cores Base (substitui SolarLanso progressivamente)

```css
/* ═══ SUNSET PIXEL PALETTE ═══ */
:root {
  /* ── Surfaces (crepuscular dark) ── */
  --sp-void:      oklch(0.12 0.03 310);   /* vinho escuro #2E003E-like */
  --sp-deep:      oklch(0.18 0.04 320);   /* purple-black profundo */
  --sp-mid:       oklch(0.25 0.03 315);   /* superficie intermediaria */
  --sp-raised:    oklch(0.32 0.02 300);   /* card elevado */

  /* ── Text (quente) ── */
  --sp-bone:      oklch(0.94 0.02 85);    /* branco creme */
  --sp-ink:       oklch(0.88 0.03 80);    /* texto corpo */
  --sp-muted:     oklch(0.60 0.02 70);    /* texto secundario */

  /* ── Sunset Accents ── */
  --sp-gold:      oklch(0.82 0.15 85);    /* #FDD835 ouro */
  --sp-amber:     oklch(0.72 0.18 60);    /* #F57F17 laranja queimado */
  --sp-ember:     oklch(0.58 0.22 35);    /* vermelho purpura #B71C1C */
  --sp-rose:      oklch(0.65 0.15 10);    /* rosa poente */

  /* ── Pixel Neon (toques frios para contraste) ── */
  --sp-cyan:      oklch(0.72 0.10 195);   /* ciano pixel — raro, so para contraste */
  --sp-mint:      oklch(0.68 0.08 160);   /* verde pixel — sucesso */

  /* ── Texture Colors ── */
  --sp-parchment: oklch(0.90 0.03 85);    /* pergaminho claro */
  --sp-ash:       oklch(0.35 0.02 300);   /* cinza quente para bordas */
}
```

### Mapa de Substituicao SolarLanso → Sunset Pixel

| SolarLanso | Sunset Pixel | Uso |
|-----------|-------------|-----|
| `--void` | `--sp-void` | background principal |
| `--ink` | `--sp-deep` | cards |
| `--graphite` | `--sp-mid` | bordas |
| `--silver` | `--sp-ink` | texto corpo |
| `--bone` | `--sp-bone` | headings |
| `--cyan` | `--sp-gold` | accent primario |
| `--orange` | `--sp-amber` | CTA |
| `--vine` | `--sp-mint` | sucesso |
| `--bronze` | `--sp-ember` | accent secundario |

---

## 2. TIPOGRAFIA: Pixel + Editorial

### Font Stack

| Role | Font | Peso | Tamanho | Uso |
|------|------|------|---------|-----|
| **Display/Hero** | Press Start 2P | 400 | 24-36px | Titulos principais |
| **Section Headings** | VT323 | 400 | 28-32px | h2, h3 |
| **Body** | Manrope | 400-500 | 16-18px | Texto corrido |
| **UI Labels** | VT323 | 400 | 18-20px | Botoes, badges, HUD |
| **Sidebar** | Press Start 2P | 400 | 12-14px | Navegacao |
| **Code** | JetBrains Mono | 400 | 14px | Blocos de codigo |
| **Editorial Contrast** | Playfair Display | 600-700 | 20-28px | Pull quotes, callouts |

### Regras de Rendering

```css
/* Pixel-perfect para fonts pixel */
.pixel-text {
  font-family: "Press Start 2P", "Silkscreen", monospace;
  image-rendering: pixelated;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  text-rendering: optimizeSpeed;
}

/* Body mantem anti-alias para legibilidade */
.body-text {
  font-family: "Manrope", "Inter Variable", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

---

## 3. TEXTURAS: 5 Camadas de Materialidade

### 3.1 Parchment Paper (pergaminho)

```css
/* Fundo de pergaminho — usado em cards de conteudo, analogy boxes */
.parchment {
  background-color: var(--sp-parchment);
  background-image:
    /* Manchas sutis de envelhecimento */
    radial-gradient(ellipse at 20% 80%, oklch(0.75 0.05 70 / 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, oklch(0.80 0.03 60 / 0.1) 0%, transparent 40%),
    /* Textura de fibras */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      oklch(0.85 0.02 80 / 0.03) 2px,
      oklch(0.85 0.02 80 / 0.03) 3px
    );
  border: 2px solid var(--sp-ash);
  box-shadow:
    4px 4px 0 oklch(0.20 0.02 300 / 0.4),  /* pixel drop shadow */
    inset 0 0 40px oklch(0.90 0.03 85 / 0.3); /* glow interno */
}
```

### 3.2 Torn Paper Edge (borda rasgada)

```css
/* Efeito de papel rasgado via clip-path + SVG filter */
.torn-edge {
  position: relative;
  filter: url(#torn-paper-filter);
}

/* SVG filter para borda irregular */
/* Adicionar em src/components/site-shell/svg-filters.tsx */
```

### 3.3 Brush Stroke (pincelada aquarela)

```css
/* Pincelada decorativa — usada em dividers, backgrounds de hero */
.brush-stroke {
  background:
    linear-gradient(175deg,
      transparent 0%,
      var(--sp-amber) 20%,
      var(--sp-ember) 50%,
      var(--sp-gold) 80%,
      transparent 100%
    );
  opacity: 0.15;
  mask-image: url("data:image/svg+xml,..."); /* mascara de pincelada */
  height: 4px;
}
```

### 3.4 Sunset Gradient Sky (fundo parallax)

```css
/* Ceu crepuscular para hero sections */
.sunset-sky {
  background:
    /* Camada 1: ceu profundo */
    linear-gradient(180deg,
      var(--sp-void) 0%,
      oklch(0.20 0.06 320) 30%,
      oklch(0.35 0.10 30) 55%,
      oklch(0.55 0.15 50) 70%,
      oklch(0.70 0.18 60) 85%,
      oklch(0.78 0.15 70) 100%
    ),
    /* Camada 2: ruido de pixel */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      oklch(0 0 0 / 0.03) 3px,
      oklch(0 0 0 / 0.03) 4px
    );
}
```

### 3.5 Pixel Gold Rim Light (brilho dourado nas bordas)

```css
/* Efeito de luz dourada nas bordas — substitui glass glow */
.pixel-gold-rim {
  border: 2px solid var(--sp-gold);
  box-shadow:
    4px 4px 0 oklch(0.20 0.02 300 / 0.5),           /* shadow direcional */
    0 0 12px oklch(0.82 0.15 85 / 0.2),              /* gold glow */
    inset 0 1px 0 oklch(0.94 0.02 85 / 0.1);        /* highlight top */
}
```

---

## 4. DETALHES: Ornamentacao JRPG 16-bit

### 4.1 Pixel Borders System

```css
/* Sistema de bordas pixeladas — substitui border-radius */
.pixel-border-2 {
  border: 2px solid currentColor;
  border-radius: 0;
  box-shadow: 2px 2px 0 oklch(0 0 0 / 0.3);
}

.pixel-border-4 {
  border: 4px solid;
  border-image: repeating-linear-gradient(
    90deg,
    var(--sp-gold) 0px,
    var(--sp-gold) 4px,
    var(--sp-amber) 4px,
    var(--sp-amber) 8px
  ) 4;
}

/* Moldura ornamentada estilo JRPG menu */
.pixel-frame {
  border: 3px solid var(--sp-gold);
  border-radius: 0;
  outline: 1px solid var(--sp-ember);
  outline-offset: -5px;
  box-shadow:
    0 0 0 2px var(--sp-void),
    0 0 0 5px var(--sp-ash);
}
```

### 4.2 HUD Elements (Barras, Coracoes, Esferas)

```css
/* Barra de progresso estilo JRPG */
.hud-bar {
  height: 10px;
  background: var(--sp-mid);
  border: 1px solid var(--sp-ash);
  image-rendering: pixelated;
}
.hud-bar-fill {
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--sp-gold) 0px,
    var(--sp-gold) 4px,
    var(--sp-amber) 4px,
    var(--sp-amber) 6px,
    var(--sp-ember) 6px,
    var(--sp-ember) 8px
  );
}

/* Coracao pixelado (vida) — feito com box-shadow */
.pixel-heart {
  width: 8px;
  height: 8px;
  background: var(--sp-ember);
  box-shadow:
    2px 0 0 var(--sp-ember), 6px 0 0 var(--sp-ember),
    0 2px 0 var(--sp-ember), 2px 2px 0 var(--sp-ember),
    4px 2px 0 var(--sp-ember), 6px 2px 0 var(--sp-ember),
    8px 2px 0 var(--sp-ember),
    2px 4px 0 var(--sp-ember), 4px 4px 0 var(--sp-ember),
    6px 4px 0 var(--sp-ember),
    4px 6px 0 var(--sp-ember);
  image-rendering: pixelated;
}
```

### 4.3 Pixel Dividers (substitui scratch-divider)

```css
/* Divisor com diamantes — motivo JRPG */
.pixel-divider-diamond {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--sp-gold);
  font-family: "Press Start 2P", monospace;
  font-size: 10px;
}
.pixel-divider-diamond::before,
.pixel-divider-diamond::after {
  content: "";
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    currentColor 0px,
    currentColor 4px,
    transparent 4px,
    transparent 8px
  );
}
```

### 4.4 Golden Reflections (nos cards/paineis)

```css
/* Reflexo dourado sutil no topo de cards — simula iluminacao de por do sol */
.sunset-sheen {
  position: relative;
}
.sunset-sheen::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    oklch(0.82 0.15 85 / 0.08) 0%,
    transparent 30%,
    oklch(0.58 0.22 35 / 0.04) 100%
  );
  pointer-events: none;
  z-index: 1;
}
```

---

## 5. NOVOS COMPONENTES

### Componentes a Criar

| # | Componente | Arquivo | Descricao |
|---|-----------|---------|-----------|
| C1 | `PixelCard` | `src/components/pixel-card/index.tsx` | Card com borda 2px, sombra direcional, variantes: parchment/gold-rim/sunset |
| C2 | `PixelButton` | `src/components/pixel-button/index.tsx` | Botao retangular, hover com translate(-2px,-2px) + gold glow |
| C3 | `PixelDivider` | `src/components/pixel-divider/index.tsx` | Divisor com motivos: diamond/crystal/sword — substitui scratch-divider |
| C4 | `HudBar` | `src/components/hud-bar/index.tsx` | Barra de progresso JRPG com gradiente sunset e marcadores |
| C5 | `HudHeart` | `src/components/hud-heart/index.tsx` | Indicador de "vida" para dopamine moments — coracao pixelado animado |
| C6 | `ParchmentPanel` | `src/components/parchment-panel/index.tsx` | Painel com textura de pergaminho + borda rasgada, para analogy boxes |
| C7 | `SunsetSky` | `src/components/sunset-sky/index.tsx` | Background crepuscular com gradiente + ruido, usado em hero sections |
| C8 | `BrushAccent` | `src/components/brush-accent/index.tsx` | Pincelada decorativa aquarela — acento visual em sections |
| C9 | `PixelFrame` | `src/components/pixel-frame/index.tsx` | Moldura ornamentada JRPG para conteudo destacado |
| C10 | `GoldenReflection` | `src/components/golden-reflection/index.tsx` | Overlay de reflexo dourado (sheen) para cards/paineis |

### Componentes a Modificar

| # | Componente | Mudanca |
|---|-----------|---------|
| M1 | `depth-card` | Substituir glass variants por pixel-border + sunset-sheen. Remover backdrop-filter. |
| M2 | `depth-section` | Trocar blur por translateZ. Adicionar ParchmentPanel como variant. |
| M3 | `dopamine-card` | HUD hearts em vez de sparkles. Pixel shake em vez de scale. |
| M4 | `scratch-divider` | Substituir por PixelDivider com motivos JRPG. |
| M5 | `site-shell` | Background sunset-sky no hero. Sidebar com sp-void + borda pixelada. |
| M6 | `sidebar` | Fonte Press Start 2P. Links com pixel-border no hover. |
| M7 | `site-header-2d5` | Solid sp-void, sem blur. Borda inferior 2px sp-gold. |
| M8 | `article-frame` | Body: Manrope 16px. Headings: VT323. Pull quotes: Playfair Display + parchment bg. |
| M9 | `signal-grid` | Grid pixelado com `image-rendering: pixelated`. |
| M10 | `cinematic-depth` | Trocar blur parallax por translateZ + pixel-border layers. |
| M11 | `hud-label` | Fonte VT323. Borda pixelada. Background sp-mid. |
| M12 | `quest-progress` | Diamond tracker com cores sunset. Animacao pixel-step. |
| M13 | `scroll-driven` | Parallax via translateZ/Z-index (nao blur). Sunsett sky layers. |
| M14 | `theme-toggle` | Icone pixel-art sol/lua 8-bit. |
| M15 | `lang-switcher` | Moldura pixelada. Fonte VT323. |

---

## 6. FASES DE IMPLEMENTACAO

### φ0: PRE-FLIGHT (agora)
- [ ] Confirmar direcao: Neo Pixel × Sunset Saga ✓
- [ ] Verificar Google Fonts disponiveis: Press Start 2P, VT323, Manrope, Playfair Display
- [ ] Backup dos arquivos atuais de tokens
- [ ] Criar branch: `feat/neo-pixel-sunset-refactor`

### φ1: TOKENS + FONTS (Dia 1)
**Arquivos:** `src/styles/tokens.css`, `src/global.css`, `src/components/router-head/`

1. Adicionar paleta Sunset Pixel ao `@theme` block (nao remover SolarLanso ainda)
2. Adicionar @font-face para Press Start 2P, VT323, Manrope, Playfair Display
3. Adicionar classes utilitarias: `.pixel-text`, `.body-text`, `.parchment`, `.sunset-sky`
4. Adicionar SVG filters: `#torn-paper-filter`, `#pixel-noise`
5. `bun run build` → deve passar sem quebrar paginas existentes

**Gate:** `bun run build` ✅ | `bun run typecheck` ✅

### φ2: NOVOS COMPONENTES (Dia 2-3)
**Arquivos:** 10 novos componentes (C1-C10 acima)

1. Criar cada componente com:
   - `component$` Qwik
   - Props interface com `| undefined` (exactOptionalPropertyTypes)
   - Variants via `variant` prop
   - CSS module ou tailwind classes
2. Criar barrel export em `src/components/` se necessario
3. `bun run typecheck` apos cada componente

**Gate:** Todos os 10 componentes exportam corretamente | typecheck passa

### φ3: MIGRACAO DE COMPONENTES EXISTENTES (Dia 4-6)
**Arquivos:** 15 componentes modificados (M1-M15 acima)

Ordem: depth → shell → navegacao → conteudo → ornamentos

1. M1-M3: depth-card, depth-section, dopamine-card (base do sistema visual)
2. M4-M7: scratch-divider, site-shell, sidebar, site-header-2d5 (chrome)
3. M8-M10: article-frame, signal-grid, cinematic-depth (conteudo)
4. M11-M15: hud-label, quest-progress, scroll-driven, theme-toggle, lang-switcher (detalhes)

Cada componente:
- `grep` por `backdrop-filter` → substituir por `transform: translateZ`
- `grep` por `rounded-` → `border-radius: 0` ou remover
- Adicionar `image-rendering: pixelated` onde relevante
- Adicionar texturas (parchment, sunset-sky, brush-stroke) via props `variant`

**Gate:** `bun run build` | `grep -r "backdrop-filter" src/components/` retorna <= 2 | `grep -r "rounded-" src/components/` retorna apenas excecoes documentadas

### φ4: SHELL + LAYOUT (Dia 6-7)
**Arquivos:** `src/routes/`, `src/layouts/`, `src/components/site-shell/`

1. Layout principal: fundo `sp-void` com `sunset-sky` no hero
2. Sidebar: `sp-void` solido, borda direita 2px `sp-gold`
3. Header: solid, sem blur, borda inferior `sp-gold`
4. Breadcrumbs: seta pixel `▶` em vez de `/`
5. Footer: background `sp-deep`, texto `sp-muted`

**Gate:** Navegacao funcional em 3 breakpoints | `bun run build` | SSG pages OK

### φ5: TEXTURAS + POLIMENTO (Dia 8-9)
**Arquivos:** `src/assets/aether-assets-textures.css`, `src/styles/craft-layer.css`

1. Ativar texturas nos pontos de contato:
   - Hero: sunset-sky gradient background
   - Cards de conteudo: parchment variant
   - Analogy boxes: torn-paper edge
   - Dividers: pixel-diamond
   - HUD labels: pixel-border
2. Ajustar opacidades para que texturas nao compitam com conteudo
3. Garantir que `prefers-reduced-motion` desativa animacoes de textura
4. Light mode: inverter paleta (parchment claro → fundo, sp-void → texto)

**Gate:** Visual review — screenshot de `/en/`, `/en/signals/apex/`, article page

### φ6: VERIFICACAO FINAL (Dia 10)
1. `bun run build` — zero erros
2. `bun run typecheck` — zero erros
3. `bun run lint` — zero erros (biome)
4. Lighthouse audit — sem regressao de a11y/performance
5. `grep -r "backdrop-filter" src/` — zero (fora de assets/aether)
6. `grep -r "rounded-" src/components/` — apenas excecoes documentadas
7. Deploy preview: `bun run deploy:preview` (cf pages)
8. Visual check: 3 breakpoints × 3 paginas × 2 temas (light/dark)

---

## 7. ARVORE DE ARQUIVOS AFETADOS

```
src/
├── styles/
│   ├── tokens.css                    # φ1: +paleta Sunset Pixel
│   └── craft-layer.css               # φ5: +texturas
├── global.css                        # φ1: +@font-face, +utils
├── assets/
│   └── aether-assets-textures.css    # φ5: +parchment, +brush-stroke
├── components/
│   ├── pixel-card/                   # φ2: NOVO
│   ├── pixel-button/                 # φ2: NOVO
│   ├── pixel-divider/                # φ2: NOVO
│   ├── hud-bar/                      # φ2: NOVO
│   ├── hud-heart/                    # φ2: NOVO
│   ├── parchment-panel/              # φ2: NOVO
│   ├── sunset-sky/                   # φ2: NOVO
│   ├── brush-accent/                 # φ2: NOVO
│   ├── pixel-frame/                  # φ2: NOVO
│   ├── golden-reflection/            # φ2: NOVO
│   ├── depth-card/                   # φ3: MODIFICAR
│   ├── depth-section/                # φ3: MODIFICAR
│   ├── dopamine-card/                # φ3: MODIFICAR
│   ├── scratch-divider/              # φ3: MODIFICAR
│   ├── site-shell/                   # φ3: MODIFICAR
│   ├── sidebar/                      # φ3: MODIFICAR
│   ├── site-header-2d5/              # φ3: MODIFICAR
│   ├── article-frame/                # φ3: MODIFICAR
│   ├── signal-grid/                  # φ3: MODIFICAR
│   ├── cinematic-depth/              # φ3: MODIFICAR
│   ├── hud-label/                    # φ3: MODIFICAR
│   ├── quest-progress/ → components/ # φ3: MODIFICAR
│   ├── scroll-driven/                # φ3: MODIFICAR
│   ├── theme-toggle/                 # φ3: MODIFICAR
│   ├── lang-switcher/                # φ3: MODIFICAR
│   └── router-head/                  # φ1: +font preloads
└── docs/
    └── design/
        └── design-dna.yaml           # φ6: ATUALIZAR
```

---

## 8. GATES POR FASE

| Fase | Gate | Comando |
|------|------|---------|
| φ1 | Build passa | `bun run build` |
| φ1 | Typecheck | `bun run typecheck` |
| φ2 | 10 componentes exportam | `find src/components/{pixel-card,pixel-button,...} -name 'index.tsx'` |
| φ3 | Sem backdrop-filter | `grep -r "backdrop-filter" src/components/ \| wc -l` <= 2 |
| φ3 | Sem rounded- | `grep -r "rounded-" src/components/ \| grep -v "excecao\|exception" \| wc -l` <= 5 |
| φ4 | SSG completo | `find dist/ -name 'index.html' \| wc -l` >= 140 |
| φ4 | Responsivo | screenshots em 320px, 768px, 1440px |
| φ5 | Texturas visiveis | `document.querySelector('.parchment')` no browser |
| φ6 | Lighthouse >= 90 | Performance, A11y, Best Practices |
| φ6 | Deploy preview OK | `curl -sI <preview-url>` → 200 |

---

## 9. ROLLBACK

Cada fase comita em seu proprio commit. Rollback = `git revert <commit-da-fase>`.

```bash
# Rollback total
git checkout main  # ou branch pre-refactor

# Rollback parcial
git revert <φ3-commit>  # reverte migracao de componentes
```

---

## Ω — STOP CONDITIONS

| Condicao | Gatilho | Acao |
|----------|---------|------|
| COMPLETO | φ6 gates passam | Deploy + atualizar design-dna.yaml |
| BLOQUEIO | Paleta ilegivel (contraste < 4.5) | Ajustar tokens, re-verificar φ1 |
| BLOQUEIO | Build quebra por 3+ fases | Rollback para ultimo commit estavel |
| FALHA | Componente novo causa 10+ type errors | Isolar componente, seguir sem ele |

---

> **Notacao:** Σ = aggregate, Δ = delta, φ = fase, λ = implementacao, Ω = terminal, ♻️ = verificacao
>
> _\"The cage is the cathedral. The constraint is the catalyst.\" — IST v5_
