# UniTeia v2 — uniteia.com

> **A factory gera conteúdo. O frontend transmuta conteúdo em presença.**

```txt
uniteia-mega-factory  →  prepara, edita, empacota
uniteia-v2            →  recebe, renderiza, ilumina, orienta, encanta
```

UniTeia-v2 é o **palco visual premium** do ecossistema UniTeia. Não é fábrica de conteúdo — é uma **interface viva** que transforma conhecimento importado em uma experiência editorial, tátil, multilíngue e impossível de quebrar.

---

## Direção Visual · Mirror-Chameleon Knowledge Interface

```yaml
aesthetic_mix:
  editorial_collage:          30%  # torn textures, stickers, cutouts, scrapbook
  hyper_tactile_material:     25%  # glass, 2.5D, PBR fake, microtexture
  dopamine_microinteractions: 15%  # badges, pills, whispers, reward moments
  retrofuture_y2k:            12%  # pixel hints, neon, chrome, sci-fi editorial
  neo_brutal_controlled:      10%  # 90° corners, strong borders, anti-SaaS
  handdraw_sketchnote:         8%  # SVG hand-drawn arrows, circles, annotations
```

**Princípio Mirror-Chameleon:** o design espelha o assunto, público e contexto — cada tipo de página recebe um estilo derivado dos tokens canônicos sem quebrar a identidade geral.

Fórmula: `Σ($ROUTE + $LANG + $CONTENT_TYPE) → ⊕(tokens + collage + material) → λ(layout) → ♻️(a11y/link/perf)`

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Qwik** 1.19.x + Qwik-City |
| Runtime | **Bun** 1.3.6 |
| Tipo | **CSS** — Tailwind 3.x + PostCSS (nesting, preset-env) |
| Lint | **Biome** 1.9.x (0 errors) |
| Testes | **Vitest** 4.x (224/224 passando) |
| Build | SSG — **19 páginas** em ~1.2s |
| Deploy | **Cloudflare Pages** via Wrangler |
| Domínio | **uniteia.com** |
| Ícones | Lucide via @iconify/tailwind |

---

## Arquitetura · Separação de Responsabilidades

```
┌──────────────────────────────────────────────────┐
│                  uniteia.com                      │
│                                                   │
│  uniteia-v2 (este repo)          mega-factory     │
│  ──────────────────────          ────────────     │
│  design system                   conteúdo         │
│  webdesign                       assets           │
│  frontend Qwik                   imagens          │
│  UX/UI                           vídeos           │
│  navegação                       edição           │
│  layout editorial                geração          │
│  componentes                     empacotamento    │
│  tokens visuais                                     │
│  animação leve                  ├── importa ──┤    │
│  acessibilidade                 manualmente        │
│  performance                                       │
│  i18n visual                                       │
│  anti-link quebrado                                │
│  anti-rota quebrada                                │
└──────────────────────────────────────────────────┘
```

**uniteia-mega-factory** prepara assets e conteúdo em pacotes importáveis manualmente.  
**uniteia-v2** renderiza, ilumina, orienta e encanta — sem gerar conteúdo, sem depender de runtime da factory.

---

## Design System · Em 3 Camadas

| Camada | Fonte | Função |
|---|---|---|
| **Foundation** | SolarLanso tokens | Dark mode base, cyan/orange highlights |
| **Texture** | Neumorphism Ultra 2026 | Glass, 2.5D, PBR fake, microtextura |
| **Charm** | JRPG pixel nostalgia | Sidebar, quest progress, pixel fonts |

### Tokens (50+ CSS custom properties em `:root`)

```css
--void, --deep, --mid, --raised     /* superfícies */
--cyan, --vine, --bronze             /* acentos */
--bone, --bone-muted                 /* texto */
--glass-bg, --glass-border           /* glass em 3 níveis (4px/12px/24px blur) */
--z-2d5-front, --perspective-2d5     /* profundidade 2.5D */
--pbr-specular, --pbr-metalness      /* PBR fake */
--paper-bg: #e8ddc8                  /* paper labels */
--t-fast: 120ms, --ease-solar        /* motion */
```

### Materiais

| Material | Uso | CSS |
|---|---|---|
| Carbon Glass | nav, shell, hero | `.glass-heavy`, backdrop-blur(24px) |
| Frosted Knowledge Glass | cards, dropdowns, panels | `.glass`, `.glass-light`, backdrop-blur(12px/4px) |
| Torn Editorial Paper | callouts, explainers, highlights | `.paper-label`, `--paper-bg: #e8ddc8` |
| Chrome Cyan-Gold | CTA, active states | `--pbr-specular`, `--pbr-metalness` |

---

## Componentes (48 arquivos)

### Layout & Navegação
`SiteShell` · `Sidebar` · `Footer` · `AdaptiveHeader` · `NavTree` · `LangSwitcher`

### Editorial
`DepthCard` (glass · 2.5D · 4 variantes) · `DepthSection` · `ArticleFrame` · `NicheLanding` · `NicheCard`

### Ensino
`LessonHero` · `LessonBlock` (3 tons) · `AnalogyBox` (paper) · `SummaryBoard` · `NextLessonCard`

### Visuais
`HanddrawArrow` · `HanddrawCircle` (SVG animado, cyan stroke) · `QuestProgress` (JRPG diamond tracker)

### Microinterações
`DopamineCard` · `HudLabel` · `ScratchDivider` · `QualityRing` · `DonationButton`

### Suporte
`SourceLedger` · `FrontmatterSlots` · `JsonLd` · `RouterHead` · `ErrorPages`

---

## Rotas (11)

| Rota | Função |
|---|---|
| `/` | Root redirect → language negotiation |
| `/{lang}/` | Language landing → `/n` redirect |
| `/{lang}/n/` | Niche index |
| `/{lang}/n/{niche}/` | Niche content page |
| `/{lang}/[...slug]/` | Article slug |
| `/n/` | Non-locale fallback |
| `/ops-lab/api-fixtures/dog-ceo/` | Demo API fixture |
| `[...catchall]` | 404 handler |

8 idiomas: PT, EN, ES, FR, DE, IT, JA, ZH — com hreflang, geo-routing e sitemap completo.

---

## Qualidade · Gates (todos verdes)

```bash
bun run lint        # ✅ 0 errors (187 files)
bun run typecheck   # ✅ PASS
bun run test:unit   # ✅ 224/224 (21 files, 5s)
bun run build       # ✅ 19 SSG pages (1.2s)
bun run ship:check  # ✅ pipeline completo
```

---

## Primeiros passos

```bash
# Instalar dependências
bun install

# Dev server
bun run dev

# Testes
bun run test:unit

# Build SSG
bun run build

# Full quality gate
bun run ship:check

# Preview local
bun run preview
```

---

## Documentos de Design

| Documento | Propósito |
|---|---|
| `docs/design/uniteia-visual-system-vNext.md` | StyleGuideΔ — sistema visual Mirror-Chameleon |
| `docs/design/imported-content-rendering-contract.md` | Contrato factory ↔ site |
| `docs/design/design-dna.yaml` | DNA de design legível por máquina |
| `docs/design/component-map.yaml` | Inventário completo de componentes |
| `docs/design/material-depth-contract.yaml` | Glass, 2.5D, PBR fake spec |
| `docs/design/motion-contract.yaml` | Contrato de animações |
| `docs/design/experience-storyboard.schema.yaml` | Jornada visual em 6 estágios |
| `docs/design/anti-gap-checklist.yaml` | Checklist de qualidade não-negociável |
| `docs/design/visual-verification-plan.md` | Plano operacional de verificação |

---

## Skills (para agentes)

| Skill | Escopo | Como carregar |
|---|---|---|
| `uniteia-frontend-design-system` | Design system, frontend, UX/UI | `skill_view(name='uniteia-frontend-design-system')` |
| `uniteia-core` | Master activator (11 skills) | `skill_view(name='uniteia-core')` |
| `web-platform-design-review` | Revisão de design | `skill_view(name='web-platform-design-review')` |

---

## Licença

MIT — aberto, colaborativo, feito para aprender e ensinar.
