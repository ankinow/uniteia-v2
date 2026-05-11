---
id: CTX-V2-GUARD-04
repo: uniteia-v2
role: consumer
symbol: Ω
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
hash: SELF
---

# Context Index — uniteia-v2

## Artifact Index

| ID | Path | Symbol | SHA-256 |
|---|---|---|---|
| CTX-V2-ROOT-01 | 9ebba085a3978514acee7f94b6dc7c55bffa92c7f73c3d8d4cfb6aea890b8ef2 AGENTS.md | Σ | TODO_HASH |
| CTX-V2-ROOT-02 | 9ef211d064ca341c616e89ec370446384a6c7639156feb4d04a6686ab3dcd0a8 CONTEXT-MAP.md | Σ | TODO_HASH |
| CTX-V2-ROOT-03 | c03b44d48e740efc22882af76ff395ee98c093468c9c1aafcd4ed533caed7fd3 docs/context/README.md | Σ | TODO_HASH |
| CTX-V2-ROOT-04 | f5988578db2f1e508af4d596d0498f5c9550cd6d88c537552d94d713b7e734c4 docs/context/PROJECT-CONTEXT.md | Ω | TODO_HASH |
| CTX-V2-IMPORT-01 | 8b5f85e680cab7034de40ddbf154afc63aec4874e3420173a6c73ae34a6aa8f6 docs/context/CONTENT-PACKAGE-IMPORT.md | ⋈ | TODO_HASH |
| CTX-V2-I18N-01 | 06bc097a1d1b82a1963e229c1893c998112accaba83e79243a89a6547a17d4ff docs/context/MULTILINGUAL-ROUTING-SEO.md | ⊕ | TODO_HASH |
| CTX-V2-SEO-01 | bc19ff5109616c254484722d93f62a94425aa648166926eb58ec4a429a07dd0f docs/context/SEO-RENDERING-CONTRACT.md | ⛓️ | TODO_HASH |
| CTX-V2-VISUAL-01 | edc1e5dfce966940417d541d4560b7959c85bc33555a6e346f7d0a23c66383af docs/context/VISUAL-TEXTLESS-ASSETS.md | Ψ | TODO_HASH |
| CTX-V2-BOOT-01 | e59723c0433474aa7fa576214a9acc8e2f289a183bf33bce8d020150bb2f4355 docs/context/AGENT-BOOT-SEQUENCE.md | φ | TODO_HASH |
| CTX-V2-RECOVERY-01 | e491967edeb0f50c30e681d329be3d9566cbab3f12925ab90810babb5fdab0df docs/context/SESSION-RECOVERY.md | ♻️ | TODO_HASH |
| CTX-V2-SYMBOLS-01 | ba7d5caabe5ba8322dd033f3ebca9fb7fa2f53c2a2cb9f1cfb1aa806a2047a21 docs/context/CONTEXT-SYMBOLS.md | Σ | TODO_HASH |
| CTX-V2-SYMBOLS-02 | 033d5e0f9de1326eefd29bb47eee1a6a59328f61d32d177f3405251474aebcac docs/context/context-symbols.json | Σ | TODO_HASH |
| CTX-V2-GUARD-01 | 320f4f94833c7307fdf22666dfebba52698899cc30344832066216312704fbd8 docs/context/context-ids.json | ⛓️ | TODO_HASH |
| CTX-V2-GUARD-02 | docs/context/context-manifest.json | Ω | SELF |
| CTX-V2-GUARD-03 | 2e1f20affa1e8bfcc0fe1ce269433da8bd93e3f8f2e5c6f68ba67bfe8d522d2d docs/context/context-ledger.jsonl | Δ | TODO_HASH |
| CTX-V2-GUARD-04 | 1c7b8b19c1a4a21d858711b61643157ec6cd067be3143b015280567b27411a4e docs/context/context-index.md | Ω | TODO_HASH |

## How to Verify

```bash
sha256sum AGENTS.md CONTEXT-MAP.md docs/context/*.md docs/context/*.json
```

Compare against this index.

## Hash Policy

sha256 over canonicalized file content where frontmatter.hash is replaced with SELF.
