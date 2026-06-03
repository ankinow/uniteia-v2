# PLANO-078: i18n RU Alignment — Decision Record

**Status:** DECISION PENDING → Hybrid-C recomendada  
**Data:** 2026-06-02

## Contexto

- **Hermes Agent:** suporta 9 idiomas (inclui RU)
- **UniTeia Site:** suporta 8 idiomas (sem RU)
- **Content API v1:** enum fixo em 8 lang

## Opções Avaliadas

| Opção | Descrição | Impacto |
|---|---|---|
| A. Add RU a UniTeia | +1 locale em 83 SSG pages | +12% build time, +1 idioma para manter |
| B. Drop RU do Hermes | Simplifica para 8 | Perde cobertura RU no agente |
| **C. Hybrid** | **8 shared + RU Hermes-only** | **Zero impacto UniTeia, mantém RU no agente** |

## Recomendação: Opção C (Hybrid)

```typescript
// src/i18n/types.ts — shared core (8 lang)
export const SHARED_LANGUAGES = ['en','pt','es','fr','de','it','ja','zh'] as const;
export type SupportedLanguage = typeof SHARED_LANGUAGES[number];

// hermes/i18n/types.ts — agent extension (9 lang)
export const HERMES_LANGUAGES = [...SHARED_LANGUAGES, 'ru'] as const;
```

- Content API v1 mantém `SupportedLanguage` (8).
- Hermes pode estender para `HermesLanguage` (9) sem quebrar contrato.
- Futuro: se demanda RU no site surgir, migra para Opção A com 1 PR.

## Veredicto

Aprovar **Opção C**. Nenhuma mudança de código necessária agora — apenas documentar boundary.
