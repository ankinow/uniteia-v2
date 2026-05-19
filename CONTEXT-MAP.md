---
id: CTX-V2-ROOT-02
repo: uniteia-v2
role: consumer
symbol: Σ
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-19
source_of_truth: true
depends_on: [CTX-V2-ROOT-01, CTX-V2-VISUAL-02]
hash: SELF
---

# CONTEXT-MAP.md — UniTeia v2

## 0. Boot Priority

| Priority | File | Symbol | Read When |
|---:|---|---|---|
| 1 | AGENTS.md | Σ | every session |
| 2 | CONTEXT-MAP.md (this file) | Σ | every session |
| 3 | docs/context/README.md | Σ | before context work |
| 4 | task-specific docs/context/*.md | ⊕ | when relevant |
| 5 | package.json | ♻️ | before commands |
| 6 | git status | Δ | before writes |

## 1. Domain Contexts

### Content Niche Contexts (v2 legacy)

> **Note:** The per-niche CONTEXT.md files and ADR directories listed below have been removed from disk as part of project consolidation. The apex/infrastructure docs/adr/ directory is the only surviving ADR location. This section is retained as a reference for historical niche structure; agents should rely on docs/context/*.md for current operational context.

| Context | CONTEXT.md | ADR Directory | Description | Status |
|---|---|---|---|---|
| singularity | content/singularity/CONTEXT.md | content/singularity/docs/adr/ | AI/LLM content niche | ⛔ removed |
| hardware | content/hardware/CONTEXT.md | content/hardware/docs/adr/ | Hardware reviews | ⛔ removed |
| dev | content/dev/CONTEXT.md | content/dev/docs/adr/ | Dev tools | ⛔ removed |
| privacy | content/privacy/CONTEXT.md | content/privacy/docs/adr/ | Privacy/security | ⛔ removed |
| apex | CONTEXT.md (root) | docs/adr/ | Apex landing | ⛔ removed (ADR survives) |
| infrastructure | CONTEXT.md (root) | docs/adr/ | Build pipeline | ⛔ removed (ADR survives) |
| jrpg-sidebar | docs/jrpg-sidebar/CONTEXT.md | docs/jrpg-sidebar/docs/adr/ | JRPG sidebar | ⛔ removed |

### Context Engineering Documents (CER-v1)

| ID | Context | File | Symbol | Use When |
|---|---|---|---|---|
| CTX-V2-ROOT-01 | Agent Bootloader | AGENTS.md | Σ | every session |
| CTX-V2-ROOT-02 | Context Map | CONTEXT-MAP.md | Σ | every session |
| CTX-V2-ROOT-03 | Context System Guide | docs/context/README.md | Σ | before context work |
| CTX-V2-ROOT-04 | Project Mission | docs/context/PROJECT-CONTEXT.md | Ω | new agents |
| CTX-V2-IMPORT-01 | Content Package Import | docs/context/CONTENT-PACKAGE-IMPORT.md | ⋈ | bridge/import work |
| CTX-V2-I18N-01 | Multilingual Routing + SEO | docs/context/MULTILINGUAL-ROUTING-SEO.md | ⊕ | i18n / routing |
| CTX-V2-SEO-01 | SEO Rendering Contract | docs/context/SEO-RENDERING-CONTRACT.md | ⛓️ | SEO generation |
| CTX-V2-VISUAL-01 | Visual Textless Assets | docs/context/VISUAL-TEXTLESS-ASSETS.md | Ψ | visual consumption |
| CTX-V2-BOOT-01 | Agent Boot Sequence | docs/context/AGENT-BOOT-SEQUENCE.md | φ | session start |
| CTX-V2-RECOVERY-01 | Session Recovery | docs/context/SESSION-RECOVERY.md | ♻️ | after interruption |
| CTX-V2-SYMBOLS-01 | Symbol Reference | docs/context/CONTEXT-SYMBOLS.md | Σ | symbol lookup |

## 2. Source of Truth

| Topic | Source |
|---|---|
| Repo role | AGENTS.md |
| Context index | CONTEXT-MAP.md |
| Context artifacts | docs/context/context-manifest.json |
| Trace ledger | docs/context/context-ledger.jsonl |
| Language model | src/i18n/types.ts (8 languages) |

## 3. Cross-Repo Bridge

- Consumer side: this repo (uniteia-v2)
- Producer side: /home/lermf/uniteia-mega-factory
- Contract: Content Package Contract v1
- Mechanism: static filesystem import
- Zero runtime coupling

## 4. Do Not Touch Without Approval

| Path | Reason |
|---|---|
| .gsd/ | runtime/state artifact |
| .bg-shell/ | background shell artifact |
| .gsd-id | runtime id |
| src/content-contracts/ | bridge implementation (separate task) |
| src/content-import/ | bridge implementation (separate task) |
| fixtures/ | bridge fixtures (separate task) |

## 5. Verification Matrix

| Task Type | Commands |
|---|---|
| context docs | git diff --check; secret scan; git status --short |
| source change | vitest; tsc --noEmit; bun run build |
| bridge/import | vitest content-package + content-import |
| roundtrip | factory export → v2 validate → import → render |

## 6. Recovery

Read: docs/context/SESSION-RECOVERY.md
st; tsc --noEmit; bun run build |
| bridge/import | vitest content-package + content-import |
| roundtrip | factory export → v2 validate → import → render |

## 6. Recovery

Read: docs/context/SESSION-RECOVERY.md
