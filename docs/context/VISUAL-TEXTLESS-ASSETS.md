---
id: CTX-V2-VISUAL-01
repo: uniteia-v2
role: consumer
symbol: Ψ
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: []
hash: SELF
---

# VISUAL-TEXTLESS-ASSETS — How v2 Consumes Public Visuals

## 0. Trace
| Field | Value |
|---|---|
| id | CTX-V2-VISUAL-01 |
| symbol | Ψ |
| repo | uniteia-v2 |
| role | consumer |
| source | AGENTS.md |
| last_verified | 2026-05-11 |
| hash | SELF |

## 1. Use When
- Rendering images from Content Packages
- Deciding where to display captions/alt text
- Implementing image components

## 2. Context Summary
Σ: Public visuals are textless by policy. All localized text is in captions, alt attributes, and image metadata.

## 3. Rendering Rules

- Display image with <img> or Qwik <Image>
- Alt text: localized per language, descriptive of visual content
- Caption: localized text below image
- Metadata: image source, attribution, description from package metadata

## 4. Non-Negotiable
[!]
- NEVER overlay text on images at render time (violates textless policy)
- Captions rendered as HTML below image, not in image
- Alt text required for every image (WCAG 2.2 AA)
- Alt text must be localized per language

## 5. Related Contexts
⊕:
- /home/lermf/uniteia-mega-factory/docs/context/VISUAL-TEXTLESS-POLICY.md — producer-side policy
- docs/context/MULTILINGUAL-ROUTING-SEO.md — per-language alt/caption
