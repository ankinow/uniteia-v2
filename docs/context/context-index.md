---
id: CTX-V2-GUARD-04
repo: uniteia-v2
role: consumer
symbol: Ω
status: active
version: 1.0.1
created_at: 2026-05-11
updated_at: 2026-05-17
hash: SELF
---

# Context Index — uniteia-v2

## Artifact Index

| ID | Path | Symbol | SHA-256 |
|---|---|---|---|
| CTX-V2-ROOT-01 | e119344d3d2558559fb6f0311a0ef0870806b11cb1736e4e7c029233382c706d AGENTS.md | Σ | e119344d3d2558559fb6f0311a0ef0870806b11cb1736e4e7c029233382c706d |
| CTX-V2-ROOT-02 | 03aa5b5c36237d4e2920b27becb70a14d6f16883de70366d7a3da9532ed15df5 CONTEXT-MAP.md | Σ | 03aa5b5c36237d4e2920b27becb70a14d6f16883de70366d7a3da9532ed15df5 |
| CTX-V2-ROOT-03 | 6a13c2bfa771cb473936c5416f70ed200dc494d3976aa4885e25ca6287505bff docs/context/README.md | Σ | 6a13c2bfa771cb473936c5416f70ed200dc494d3976aa4885e25ca6287505bff |
| CTX-V2-ROOT-04 | f5988578db2f1e508af4d596d0498f5c9550cd6d88c537552d94d713b7e734c4 docs/context/PROJECT-CONTEXT.md | Ω | f5988578db2f1e508af4d596d0498f5c9550cd6d88c537552d94d713b7e734c4 |
| CTX-V2-IMPORT-01 | 8b5f85e680cab7034de40ddbf154afc63aec4874e3420173a6c73ae34a6aa8f6 docs/context/CONTENT-PACKAGE-IMPORT.md | ⋈ | 8b5f85e680cab7034de40ddbf154afc63aec4874e3420173a6c73ae34a6aa8f6 |
| CTX-V2-I18N-01 | 06bc097a1d1b82a1963e229c1893c998112accaba83e79243a89a6547a17d4ff docs/context/MULTILINGUAL-ROUTING-SEO.md | ⊕ | 06bc097a1d1b82a1963e229c1893c998112accaba83e79243a89a6547a17d4ff |
| CTX-V2-SEO-01 | bc19ff5109616c254484722d93f62a94425aa648166926eb58ec4a429a07dd0f docs/context/SEO-RENDERING-CONTRACT.md | ⛓️ | bc19ff5109616c254484722d93f62a94425aa648166926eb58ec4a429a07dd0f |
| CTX-V2-VISUAL-01 | edc1e5dfce966940417d541d4560b7959c85bc33555a6e346f7d0a23c66383af docs/context/VISUAL-TEXTLESS-ASSETS.md | Ψ | edc1e5dfce966940417d541d4560b7959c85bc33555a6e346f7d0a23c66383af |
| CTX-V2-BOOT-01 | e59723c0433474aa7fa576214a9acc8e2f289a183bf33bce8d020150bb2f4355 docs/context/AGENT-BOOT-SEQUENCE.md | φ | e59723c0433474aa7fa576214a9acc8e2f289a183bf33bce8d020150bb2f4355 |
| CTX-V2-RECOVERY-01 | e491967edeb0f50c30e681d329be3d9566cbab3f12925ab90810babb5fdab0df docs/context/SESSION-RECOVERY.md | ♻️ | e491967edeb0f50c30e681d329be3d9566cbab3f12925ab90810babb5fdab0df |
| CTX-V2-SYMBOLS-01 | ba7d5caabe5ba8322dd033f3ebca9fb7fa2f53c2a2cb9f1cfb1aa806a2047a21 docs/context/CONTEXT-SYMBOLS.md | Σ | ba7d5caabe5ba8322dd033f3ebca9fb7fa2f53c2a2cb9f1cfb1aa806a2047a21 |
| CTX-V2-SYMBOLS-02 | 033d5e0f9de1326eefd29bb47eee1a6a59328f61d32d177f3405251474aebcac docs/context/context-symbols.json | Σ | 033d5e0f9de1326eefd29bb47eee1a6a59328f61d32d177f3405251474aebcac |
| CTX-V2-GUARD-01 | 52a4d0904779bb539be1575b284452e318e0fe2831c6374b24ee717c861977b2 docs/context/context-ids.json | ⛓️ | 52a4d0904779bb539be1575b284452e318e0fe2831c6374b24ee717c861977b2 |
| CTX-V2-GUARD-02 | docs/context/context-manifest.json | Ω | SELF |
| CTX-V2-GUARD-03 | d5b7bcf8dfd037fe3366b048eafca29dca0acb865130bc8e38de53cedd8a6986 docs/context/context-ledger.jsonl | Δ | d5b7bcf8dfd037fe3366b048eafca29dca0acb865130bc8e38de53cedd8a6986 |
| CTX-V2-GUARD-04 | dd350dc52c3039d6519a198214747dd8dbaca140fa64488b9e747c2f49554eb6 docs/context/context-index.md | Ω | dd350dc52c3039d6519a198214747dd8dbaca140fa64488b9e747c2f49554eb6 |

## How to Verify

```bash
sha256sum AGENTS.md CONTEXT-MAP.md docs/context/*.md docs/context/*.json
```

Compare against this index.

## Hash Policy

sha256 over canonicalized file content where frontmatter.hash is replaced with SELF.
