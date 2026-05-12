# Σ MISSION: Refatoração Exponencial de Qualidade — UniTeia-v2 Frontend

> **Arquiteto:** UniTeia-v2 Frontend Design Architect
> **Repo:** ankinow/uniteia-v2 → uniteia.com
> **Data:** 2026-05-12
> **Direção Visual:** Editorial Collage + Signal Grid + Material Myth UI + Hyper-Tactile Knowledge Console
> **Lema:** "uniteia-mega-factory = cozinha editorial. uniteia-v2 = restaurante premium."

---

## φ AUDITORIA — Estado Atual

| Gate | Resultado | Detalhe |
|---|---|---|
| `bun run lint` | ✅ PASS | 0 errors, 179 files |
| `bun run typecheck` | ✅ PASS | tsc --noEmit |
| `bun run test:unit` | ✅ PASS | 224/224, 21 files, 5.9s |
| `bun run build` | ✅ PASS | 19 SSG pages, 1.2s |
| Git status | ✅ CLEAN | main @ e1398a2 |
| PR #4 merge | ✅ DONE | docs/design/ merged |

### Legado Aproveitável

| Ativo | Status |
|---|---|
| 11 skills em skills/ | ✅ Prontos |
| 40 componentes em src/components/ | ✅ Existentes |
| 11 rotas i18n | ✅ Funcionais |
| SolarLanso tokens (CSS + Tailwind) | ✅ Base sólida |
| Dopamine Budget store | ✅ Pronto |
| HUD label, scratch-divider, surface-hud | ✅ Pronto |
| docs/design/ (4 arquivos do PR #4) | ✅ Mergeado |

### Gaps Identificados

| Gap | Impacto | Prioridade |
|---|---|---|
| Teaching components (lesson-hero, etc.) NÃO existem | Bloqueia conteúdo educacional importado | P0 |
| Visual components (handdraw, quest-progress) NÃO existem | Experiência visual incompleta | P0 |
| Glass/2.5D/PBR fake effects NÃO existem | Direção visual não realizada | P0 |
| Signal Grid NÃO implementado | Marca visual ausente | P0 |
| Material Depth Contract não documentado | Sem especificação técnica | P1 |
| Motion Contract não documentado | Animações inconsistentes | P1 |
| Imported Content Rendering Contract não existe | Risco de escopo vazar | P0 |
| Experience Storyboard não existe | Jornada visual não mapeada | P1 |
| Anti-Gap Checklist não existe | Qualidade sem verificação | P1 |
| Paper labels precisam refinamento | Estilo incompleto | P1 |
| Mobile/link/route integrity sem auditoria recente | Risco de produção | P1 |

---

## λ PLANO DE REFATORAÇÃO — Slices Paralelizáveis

### Slice 0 — Foundation Docs (PARALELO)

**O que:** Criar 5 documentos de design que faltam para formalizar a direção visual e contratos.

**Outputs:**
1. `docs/design/imported-content-rendering-contract.md` — O contrato mais importante: separa factory de site
2. `docs/design/material-depth-contract.yaml` — Especificação técnica de PBR fake, 2.5D, glass, microtextura
3. `docs/design/motion-contract.yaml` — Contrato de animações com timing, easing, reduced-motion
4. `docs/design/experience-storyboard.schema.yaml` — Mapa da jornada visual (Signal Grid → Hero → Editorial → JRPG whisper)
5. `docs/design/anti-gap-checklist.yaml` — Checklist do que NÃO pode faltar (alt, href, a11y, mobile, links, rotas)

**Arquivos afetados:** `docs/design/*.md`, `docs/design/*.yaml`
**Tempo estimado:** 25min
**Pode rodar paralelo com:** Slice 1

---

### Slice 1 — Token Evolution (PARALELO)

**O que:** Evoluir `global.css` + `tailwind.config.js` para a nova direção visual.

**Tokens a adicionar:**
- `--glass-bg`, `--glass-border`, `--glass-blur` — glass profundo
- `--pbr-specular`, `--pbr-roughness`, `--pbr-metalness` — PBR fake em CSS
- `--z-2d5-*` — perspectiva 2.5D (layers -2, -1, 0, 1, 2)
- `--signal-grid-*` — Signal Grid pattern
- `--paper-*` — paper label tokens
- OKLCH conversion: CSS variables atuais usam hex, migrar para oklch

**Tailwind additions:**
- `glass`, `glass-heavy`, `glass-light` utilities
- `depth-2d5-front`, `depth-2d5-mid`, `depth-2d5-back`
- `signal-grid` background pattern utility
- `paper-label`, `paper-tag` utilities

**Outputs:**
- `src/global.css` atualizado
- `tailwind.config.js` atualizado

**Arquivos afetados:** `src/global.css`, `tailwind.config.js`
**Tempo estimado:** 30min
**Pode rodar paralelo com:** Slice 0, Slice 2, Slice 3

---

### Slice 2 — Teaching Components (PARALELO)

**O que:** Implementar os 5 componentes teaching que existem no component-map mas não no código.

**Lista:**
1. `src/components/lesson/lesson-hero.tsx` — Hero com promise e lang
2. `src/components/lesson/lesson-block.tsx` — Content block com tone (default/highlight/warning)
3. `src/components/lesson/analogy-box.tsx` — Paper-styled analogy box
4. `src/components/lesson/summary-board.tsx` — Checklist-style summary
5. `src/components/lesson/next-lesson-card.tsx` — Navigation card

**Design principles:**
- LessonHero: glass background, signal grid subtle, headline clamp
- LessonBlock: depth-card base com tone variants (cyan border highlight, bronze border warning)
- AnalogyBox: paper-bg (#e8ddc8) com ink text, handdraw accents
- SummaryBoard: checklist items com vine/bronze checkmarks
- NextLessonCard: card com seta handdraw

**Arquivos afetados:** `src/components/lesson/*.tsx`
**Tempo estimado:** 35min
**Pode rodar paralelo com:** Slice 0, Slice 1, Slice 3

---

### Slice 3 — Visual Components (PARALELO)

**O que:** Implementar os 3 componentes visuais que existem no component-map mas não no código.

**Lista:**
1. `src/components/visual/handdraw-arrow.tsx` — SVG arrow com stroke-dasharray animation
2. `src/components/visual/handdraw-circle.tsx` — SVG circle com stroke-dasharray animation
3. `src/components/jrpg/quest-progress.tsx` — JRPG-styled step progress tracker

**Design principles:**
- Handdraw: SVG puro sem dependências, reduced-motion guard, cyan stroke
- QuestProgress: pixel font opcional, diamond/square markers, vine para complete

**Arquivos afetados:** `src/components/visual/*.tsx`, `src/components/jrpg/*.tsx`
**Tempo estimado:** 25min
**Pode rodar paralelo com:** Slice 0, Slice 1, Slice 2

---

### Slice 4 — Material Depth Evolution (DEPENDE DE SLICE 1)

**O que:** Evoluir DepthCard, DepthSection com glass variants, 2.5D, PBR fake.

**Mudanças:**
1. Adicionar variante `glass` ao DepthCard (backdrop-filter, glass border)
2. Adicionar variante `2d5-front/mid/back` — perspective transforms
3. Adicionar microtextura via CSS pseudo-elements (noise SVG filter)
4. Evoluir surface-hud utility para incluir PBR fake (specular highlight via gradient)

**Arquivos afetados:** `src/components/depth-card/index.tsx`, `src/components/depth-section/index.tsx`, `src/components/depth/types.ts`
**Tempo estimado:** 30min
**Depende de:** Slice 1 (token evolution)

---

### Slice 5 — Layout & Signal Grid (DEPENDE DE SLICE 1)

**O que:** Evoluir SiteShell + Sidebar + NicheLanding com Signal Grid, paper labels, editorial collage.

**Mudanças:**
1. Signal Grid como background opcional no SiteShell
2. Sidebar refinada com glass panel, paper labels no lang selector
3. NicheLanding com editorial collage headers (sobreposição de elementos)
4. AdaptiveHeader com glass variant
5. Footer refinado com paper-style donation button

**Arquivos afetados:** `src/components/site-shell/*`, `src/components/sidebar/*`, `src/components/niche-landing/*`, `src/components/footer/*`
**Tempo estimado:** 40min
**Depende de:** Slice 1 (token evolution)

---

### ♻️ Slice 6 — Verification & Link/Route Audit

**O que:** Auditar links, rotas, mobile, a11y, performance.

**Checklist:**
1. Rodar `bun run ship:check` completo
2. Auditar hrefs em todos os componentes (nenhum href vazio)
3. Verificar rotas: /xx/anything → 404, /{lang} → /n redirect
4. Verificar alt text em todas as imagens
5. Verificar mobile (320px viewport)
6. Lighthouse audit (via script)
7. Validar todos os componentes novos com test:unit

**Arquivos afetados:** Verificação apenas, sem mudanças de código
**Tempo estimado:** 15min
**Depende de:** Slices 0-5 completos

---

## ♻️ VERIFICATION GATES

Após cada slice, verificar:

| Gate | Comando |
|---|---|
| Lint | `bun run lint` |
| Typecheck | `bun run typecheck` |
| Testes | `bun run test:unit` |
| Build | `bun run build` |

**Regra:** Se qualquer gate falhar, parar o slice, diagnosticar, corrigir, re-verificar.
**Limite de tentativas:** 3 por slice. Após 3 falhas, parar e reportar.

---

## Ω OUTPUT

### Relatório Final por Slice

Para cada slice executado:

```md
## Slice [N] — [Nome]

### Arquivos Criados/Modificados
- path/to/file (N lines)

### Gates
- lint: ✅ | ❌
- typecheck: ✅ | ❌
- test:unit: ✅ | ❌
- build: ✅ | ❌

### Diff Summary
+ N lines / - M lines

### Status
✅ COMPLETO | ⚠️ PARCIAL | ❌ FALHA
```

### Relatório Consolidado Final

```md
# Ω RELATÓRIO DE REFATORAÇÃO FRONTEND

## Slices Executados
| Slice | Status | Arquivos | Linhas |
|---|---|---|---|
| 0 Foundation Docs | ✅/⚠️/❌ | N | +N/-M |
| 1 Token Evolution | ... | N | +N/-M |
| 2 Teaching Components | ... | N | +N/-M |
| 3 Visual Components | ... | N | +N/-M |
| 4 Material Depth | ... | N | +N/-M |
| 5 Layout & Signal Grid | ... | N | +N/-M |
| 6 Verification Audit | ... | N | +N/-M |

## Gates Finais
- lint: ✅ | ❌
- typecheck: ✅ | ❌
- test:unit: ✅ | ❌ (N/M pass)
- build: ✅ | ❌ (N pages)

## Direção Visual Alcançada
- [ ] Editorial Collage
- [ ] Signal Grid
- [ ] Material Myth UI
- [ ] Hyper-Tactile Knowledge Console
- [ ] Glass profundo
- [ ] PBR fake CSS
- [ ] 2.5D leve
- [ ] Paper labels
- [ ] Handdraw annotations
- [ ] Dopamine microinteractions
- [ ] JRPG whisper discreto

## Bloqueios Restantes
- Nenhum | Lista de P0/P1/P2

## Próximos Passos
1. ...
```

---

## REGRAS FIXAS

1. **Menor diff possível** — cada slice é mínimo e reversível
2. **Nenhum href vazio** — verificar antes de commit
3. **Nenhuma imagem sem alt** — obrigatório
4. **Nenhuma rota quebrada** — verificar com smoke
5. **Nenhum conteúdo gerado** — site não vira factory
6. **Git status antes/depois** de cada slice
7. **Commit descritivo** por slice (conventional commit)
8. **Sem push automático** — apenas commit local
9. **Se 3 falhas consecutivas no mesmo gate → STOP + diagnóstico**
10. **Rodar gates entre slices** — nunca pular verificação
