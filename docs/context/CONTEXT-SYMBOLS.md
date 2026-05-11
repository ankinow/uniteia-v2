---
id: CTX-V2-SYMBOLS-01
repo: uniteia-v2
role: consumer
symbol: Σ
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: true
depends_on: []
hash: SELF
---

# CONTEXT-SYMBOLS — Symbol Notation Reference (v2)

## 1. Symbol Table

| Symbol | Name | Purpose |
|---|---|---|
| Σ | Inventory | List, decompose, load context |
| φ | Plan | Task graph, acceptance criteria |
| λ | Implementation | Concrete patch or change |
| Δ | Diff/Risk | Critique, risk, contradiction |
| ♻️ | Verify | Verification, retry, reflection |
| Ω | Evidence | Final synthesis, report |
| ⊕ | Combine | Merge contexts or sources |
| ⊗ | Conflict | Contradictory or incompatible rules |
| ⋈ | Bridge | Interop / cross-repo contract |
| ⛓️ | Dependency | Upstream-downstream relation |
| Ψ | Explore | Multi-hypothesis / branch exploration |
| [?] | Unknown | Verify before acting |
| [!] | Blocker | High risk, must resolve |
| [✓] | Proven | Confirmed by command or output |
| [✗] | Failed | Failed verification |
| [~] | Partial | Degraded or provider-gated |

## 2. Prefix Notation

Used in trace headers and section markers:
- `Σ:` — "inventory of" / "context summary"
- `φ:` — "plan for"
- `λ:` — "implementation of"
- `Δ:` — "risk/critique of"
- `♻️:` — "verification of"
- `Ω:` — "evidence for"
- `⊕:` — "related to"
- `⋈:` — "bridge between"

## 3. Status Symbols

| Symbol | Meaning |
|---|---|
| γ | Production-stable |
| β | Experimental / local-only |
| ∅ | None / absent |
