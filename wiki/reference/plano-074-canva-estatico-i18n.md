# Canva Estático i18n 8lang — PLANO-074

**Status:** ✅ committed (ab16d74)  
**Data:** 2026-06-02  
**Plan:** [PLANO-074](/home/lermf/Documentos/PLANOS/PLANO-074-Canva-Estatico-Refinamento-i18n-2026-06-02-1737-BR-074.md)

## O que foi feito

- Extração de todas as strings hardcoded do SVG workflow do StoryboardGrid para i18n keys
- 17 chaves `canvaMagica` adicionadas a `types.ts` e preenchidas em 8 locales (pt/en/es/fr/de/it/ja/zh)
- Função `buildWorkflowSvg()` em `storyboard-resolver.ts` com XML-escaped text + `role="img"` + `aria-label`
- CSS a11y: `focus-visible` rings (3px #3b82f6), tablet breakpoint 1024px, CJK `line-height: 1.8`

## Validação

- i18n: 102/102 tests pass
- Build: 83 SSG pages, 2.8s
- 8/8 SVGs verificados com texto localizado

## Arquivos alterados

- `src/i18n/types.ts` (+ canvaMagica namespace)
- `src/i18n/*.ts` (8 locales)
- `src/utils/storyboard-resolver.ts` (buildWorkflowSvg)
- `src/components/storyboard-grid/storyboard-grid.css` (a11y + CJK)

## Verdito

SVG workflow builder agora renderiza texto em 8 línguas. Zero hardcoded strings. Acessível.
