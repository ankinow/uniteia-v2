---
id: CTX-V2-IMPORT-01
repo: uniteia-v2
role: consumer
symbol: ⋈
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: [CTX-V2-ROOT-01]
hash: SELF
---

# CONTENT-PACKAGE-IMPORT — Consumer-Side Import Contract

## 0. Trace
| Field | Value |
|---|---|
| id | CTX-V2-IMPORT-01 |
| symbol | ⋈ |
| repo | uniteia-v2 |
| role | consumer |
| source | AGENTS.md, docs/architecture/content-package-contract-v1.md |
| last_verified | 2026-05-11 |
| hash | SELF |

## 1. Use When
- Implementing or modifying import pipeline
- Debugging a package that fails validation
- Updating layout registry or tag taxonomy
- Adding new block kinds
- Running roundtrip tests

## 2. Context Summary
Σ: Content Packages arrive as static filesystem bundles. validatePackage() gates integrity, then importPackage() creates an import report with publishability, noindex, and warnings. Layout/tag mapping prepares content for render.

## 3. Files / Modules

| Path | Role | Read/Write |
|---|---|---|
| src/content-contracts/manifest.schema.ts | Manifest validation | R/W |
| src/content-contracts/tags.schema.ts | Tag taxonomy validation | R/W |
| src/content-contracts/quality.schema.ts | Quality gate validation | R/W |
| src/content-contracts/design.schema.ts | Design spec validation | R/W |
| src/content-contracts/blocks.schema.ts | Block kind validation | R/W |
| src/content-contracts/content-package.test.ts | Contract tests | R/W |
| src/content-import/validate-package.ts | Full package validation | R/W |
| src/content-import/import-package.ts | Import report generation | R/W |
| src/content-import/map-layout.ts | Layout resolution | R/W |
| src/content-import/map-tags.ts | Tag mapping (pass-through) | R/W |
| src/layouts/registry.ts | Layout registry | R/W |
| src/taxonomy/tags.yaml | Human-readable tag taxonomy | R |
| fixtures/content-packages/tecent-vm-benefits/ | Reference fixture | R |

## 4. Non-Negotiable Rules
[!]
- schemaVersion must be 'uniteia-content-package/v1'
- Every import must validate: manifest, design, tags, quality, sources, blocks, localized MDX
- Layout ID must exist in registry
- Tags must pass 7-category validation
- Quality: publishable=true requires ≥3 sources, trustLevel≠low, blockers empty
- Draft packages: noindex, not-in-sitemap, no-publish

## 5. Workflow
φ:
1. Package path offered to validatePackage()
2. validatePackage() reads manifest → schemaVersion gate
3. Layout ID validated against registry
4. design.md parsed (JSON or markdown fallback)
5. Tags validated against taxonomy (7 categories)
6. Quality validated against gate rules
7. Sources file existence verified
8. Blocks validated against allowed/forbidden per layout
9. Localized .mdx files checked per locale list
10. Import report generated with canPublish, shouldNoindex, warnings

## 6. Verification
♻️:

| Check | Command | Expected |
|---|---|---|
| Contract tests | vitest run src/content-contracts/content-package.test.ts | PASS |
| Import tests | vitest run src/content-import/ | PASS |
| Typecheck | tsc --noEmit | 0 errors |
| Fixture validation | validatePackage(path to fixture) | PASS |

## 7. Do Not Touch
| Path | Reason |
|---|---|
| src/exporters/ | lives in factory, not v2 |
| scripts/export-*.ts | lives in factory, not v2 |
| .gsd/ | runtime/state |

## 8. Failure / Recovery
Δ:
- If manifest validation fails → check schemaVersion = 'uniteia-content-package/v1'
- If locale validation fails → check pt_br/pt-BR normalization in factory
- If quality fails → check ≥3 sources, trustLevel, blockers
- If typecheck errors → check density union types (needs `as const`)

## 9. Related Contexts
⊕:
- /home/lermf/uniteia-mega-factory/docs/context/DUAL-REPO-BRIDGE.md — producer side
- docs/context/MULTILINGUAL-ROUTING-SEO.md — locale handling
- docs/context/SEO-RENDERING-CONTRACT.md — SEO after import
- docs/context/VISUAL-TEXTLESS-ASSETS.md — visual after import
