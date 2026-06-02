# Shared Design Tokens M4 — PLANO-076

**Status:** ✅ committed (42d01ba)  
**Data:** 2026-06-02  
**Plan:** [PLANO-076](/home/lermf/Documentos/PLANOS/PLANO-076-Shared-Tokens-M4-2026-06-02-1820-BR-076.md)

## O que foi feito

- Taxonomia 3 camadas: PRIMITIVE → SEMANTIC → COMPONENT
- **115 tokens totais:** 79 primitive + 27 semantic + 14 component
- SolarLanso neutral scale (solar-0..100), accents (blue/green/red/cyan/gold)
- Typography: Inter (Latin) + Noto Sans JP/SC (CJK) + JetBrains Mono
- Spacing: 8px base (0.5rem), fluid clamp()
- Radius: none/sm/md/lg/xl/pill
- Shadow: sm/md/lg/glow-blue/glow-cyan
- Easing: smooth/bounce/spring, durations: fast/base/slow
- Light + Dark semantic themes via `[data-theme="light/dark"]`
- 4 materials opt-in via `[data-materials="enabled"]`
- Component tokens: card/button/input/heading/body

## Arquivos

- `packages/uniteia-tokens/tokens.css` — canonical source
- `packages/uniteia-tokens/scripts/build.js` — CSS→JSON/YAML/d.ts
- `packages/uniteia-tokens/scripts/test.js` — 189 assertions
- `src/assets/uniteia-tokens.css` — imported via global.css

## Migração

`canva.module.css` atualizado para usar `var(--material-*)` com fallbacks hardcoded.

## Validação

- Token build: 115 tokens ✅
- Tests: 189/189 ✅
- SSG build: 83 pages, 2.5s ✅

## Próximos passos

- Migrar mais componentes para tokens compartilhados
- Adicionar verification CI
- Publicar como npm package `@hermes/uniteia-tokens`

## Verdito

Sistema de tokens funcional com fallbacks, 3 camadas, build script e testes.
