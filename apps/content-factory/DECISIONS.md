# DECISIONS

## Locked

- ✅ **D-001** monorepo isolado (`apps/content-factory/` em `uniteia-v2`, sem cross-import com app Qwik)
- ✅ **D-002** output combinado (wiki + blog + evidence) em um único `.md` final
- ✅ **D-003** 5 línguas (`en, pt, es, ja, zh`)
- ✅ **D-004** `## Editorial` = inclusão integral do `blog.md` (v0)
- ✅ **D-005** manual-first: sem watcher, sem CI raiz publicando, sem hook cross-package
- ✅ **D-006** Tailwind consolidado, UnoCSS eliminado (no monorepo `uniteia-v2`)

## Open / Future debates

- 🔮 **D-FUTURE-01** Re-render `## Editorial` from `core.yaml` at export time vs. integral inclusion of `blog.md` (v0).
  - *Trade-off*: consistency ↑, complexity ↑.
  - *Trigger*: after first content discrepancy between blog.md and core.yaml is observed.

- 🔮 **D-FUTURE-02** Versioned `content/<slug>/i18n/<lang>.yaml` per language for full multi-lang determinism vs. on-the-fly `llmFn` translation in export.
  - *Trade-off*: zero LLM at export ↑, manual translation effort ↑.
  - *Trigger*: when 3rd entity needs all 5 languages.

- 🔮 **D-FUTURE-03** Promote evidence binding from regex/string-match to AST parser (markdown-it / remark).
  - *Trade-off*: precision ↑, dependency surface ↑.
  - *Trigger*: when false positives/negatives are observed in real content.

- 🔮 **D-FUTURE-04** When/if to connect `content-factory` to the Qwik app (auto-publish, file watcher, content sync).
  - *Today*: explicitly NO.
  - *Trigger*: only after >10 published entities and a clear UX win.

## Audit findings (uniteia-v2) — not blockers for content-factory

These are tracked separately from the content-factory MVP. They affect the Qwik app, not this app:

- TS errors em `src/routes/[lang]/[...slug]/index.tsx` (x-default not in SupportedLanguage)
- e2e CLS layout shift, smoke duplicate H1
- Lighthouse performance 44%
- content-loader sem `validateContent()` no runtime
- XSS risk em `marked.parse` + `dangerouslySetInnerHTML`
- Cookie HttpOnly contradiction com README claim
- `console.log` em hot path (middleware, site-shell, lang-switcher)
- RouterHead removeu suporte a `head.styles` / `head.scripts`
- `server/` versionado e dirty
- Size gate threshold 61,440 vs hard limit 20kB
- CLI scaffold mínimo (`console.log('uniteia-v2 scaffold ready')`)

Remediar em tracks paralelos quando o operador quiser.
