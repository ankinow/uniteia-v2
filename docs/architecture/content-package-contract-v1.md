# Content Package Contract v1 — Architecture Spec

> **Repo:** uniteia-v2
> **Branch:** feat/content-package-import-contract
> **Date:** 2026-05-11

## 1. Purpose

Define the static contract between **uniteia-mega-factory** (content producer) and **uniteia-v2** (content consumer). The contract enables mega-factory to export versioned Content Packages as static files, and v2 to validate, import, and render them as draft/preview — with **zero runtime coupling** between the two repositories.

## 2. Architecture

```
uniteia-mega-factory                    uniteia-v2
┌─────────────────────┐                 ┌──────────────────────┐
│  src/exporters/     │  static files   │  src/content-import/ │
│    uniteia-v2/      │ ──────────────► │    validate-package  │
│    package-writer   │  (no runtime    │    import-package    │
│    manifest-writer  │   dependency)   │    map-layout        │
│    design-md-writer │                 │    map-tags          │
│    tags-writer      │                 │                      │
│    quality-writer   │                 │  fixtures/           │
│    sources-writer   │                 │    content-packages/ │
│    blocks-writer    │                 │    tecent-vm-benefits│
│    assets-writer    │                 │                      │
│    validate-export  │                 │  src/content-contracts/
│                     │                 │    manifest.schema   │
│  exports/           │                 │    tags.schema       │
│    cnt_tecent_*/    │                 │    quality.schema    │
│      manifest.json  │                 │    design.schema     │
│      content.*.mdx  │                 │    blocks.schema     │
│      design.md      │                 │  layouts/registry.ts
│      sources.json   │                 │  taxonomy/tags.yaml  │
│      quality.json   │                 │                      │
│      tags.json      │                 │  Tests (Vitest)      │
│      blocks/        │                 │    valid-passes      │
│        *.json       │                 │    invalid-schema    │
│      assets/        │                 │    invalid-layout    │
└─────────────────────┘                 │    missing-design    │
                                        │    unknown-pipeline  │
                                        │    draft-noindex     │
                                        └──────────────────────┘
```

## 3. Package Shape

```
content-package/
├── manifest.json            # Schema version, contentId, source/target projects, status, contentType, locales, layout metadata, tags, quality, hashes, provenance
├── content.pt-BR.mdx        # Localized content (required)
├── content.en.mdx           # Optional
├── content.es.mdx           # Optional
├── design.md                # Design spec for this package (required)
├── sources.json             # Source references (required)
├── quality.json             # Quality assessment (required)
├── tags.json                # Tag assignments by taxonomy (required)
├── blocks/
│   ├── benefit-grid.json    # Block type + content
│   └── decision-map.json    # Block type + content
└── assets/                  # Optional static assets (images, etc.)
```

### manifest.json Structure

```json
{
  "schemaVersion": "uniteia-content-package/v1",
  "contentId": "cnt_tecent_vm_benefits_2026_05",
  "sourceProject": "uniteia-mega-factory",
  "targetProject": "uniteia-v2",
  "status": "draft",
  "contentType": "opportunity_map",
  "canonicalSlug": "tecent-vm-benefits",
  "title": { "en": "...", "pt": "..." },
  "description": { "en": "...", "pt": "..." },
  "locales": ["pt-BR", "en", "es"],
  "layout": {
    "layoutId": "opportunity-map-v1",
    "designProfile": "default",
    "density": "comfortable",
    "audience": "technical"
  },
  "tags": {
    "topic": ["cloud-computing", "virtual-machines"],
    "intent": ["teach-opportunity", "cost-saving"],
    "audience": ["devops-engineers"],
    "vendor": ["tencent-cloud"],
    "format": ["comparison"],
    "risk": [],
    "pipeline": ["curated"]
  },
  "quality": {
    "publishable": false,
    "sourceCount": 3,
    "trustLevel": "medium",
    "blockers": [],
    "warnings": []
  },
  "sources": [...],
  "hashes": { "contentHash": "...", "manifestHash": "..." },
  "provenance": { "exportedAt": "...", "exportTool": "uniteia-v2-content-package-export" }
}
```

## 4. Responsibilities

### uniteia-mega-factory
- Generate content, blocks, sources, quality, design.md, tags
- Export static files to local `exports/` directory
- Include provenance, contentHash, design.md, all metadata
- **Never write into v2 repo**

### uniteia-v2
- Validate package by filesystem path
- Validate schemaVersion, layoutId, design.md, tags, blocks
- Import as draft/preview only
- Apply noindex when status=draft or publishable=false
- **Never call mega-factory at runtime**

## 5. Layout Registry

| Layout ID | Allowed Blocks | Forbidden Blocks |
|-----------|---------------|-----------------|
| `visual-explainer-v1` | Any | — |
| `opportunity-map-v1` | Any | `ReferralCTA`, `FakeUrgencyBanner` |
| `comparison-v1` | Any | — |
| `ops-lab-fixture-v1` | Any | — |

Unknown `layoutId` = hard fail.

## 6. Tag Taxonomy

Categories (all optional except pipeline when used for routing):
- `topic` — content domain tags
- `intent` — purpose tags (teach-opportunity, cost-saving, cloud-benefits, etc.)
- `audience` — target audience
- `vendor` — cloud/product vendor
- `format` — content format (comparison, guide, etc.)
- `risk` — risk assessment tags
- `pipeline` — editorial pipeline stage

Unknown `pipeline` tag = hard fail.
Unknown `format` tag = fail if used for layout routing.
Other unknown tags = warning.

## 7. Quality Gates

| Condition | Result |
|-----------|--------|
| `unknown layoutId` | Hard fail |
| `missing design.md` | Hard fail |
| `unknown pipeline tag` | Hard fail |
| `block not allowed by layout` | Hard fail |
| `draft` status | noindex, not in sitemap |
| `publishable=false` | Cannot publish |
| `low trust` | Draft only |
| `publishable=true` + missing sources | Hard fail |

## 8. Tecent VM Benefits Fixture

Intent: `teach-opportunity`, `cost-saving`, `cloud-benefits`
Forbidden: `referral-marketing`, `affiliate-conversion`, `fake-urgency`, `unverified-pricing-claim`

## 9. Test Plan

### v2 Tests
- Valid package passes all gates
- Invalid schemaVersion fails
- Invalid layoutId fails
- Missing design.md fails
- Unknown pipeline tag fails
- Draft gets noindex
- Low trust cannot publish
- Forbidden block fails

### mega-factory Tests
- Package writer creates all required files
- Missing manifest/design/quality/tags/sources fails validation
- ContentHash generated
- Tecent fixture exports correctly
- No direct writes into v2 directory

## 10. Branching

- `uniteia-v2`: `feat/content-package-import-contract`
- `uniteia-mega-factory`: `feat/uniteia-v2-content-package-export`

No merge, no deploy, no force push.