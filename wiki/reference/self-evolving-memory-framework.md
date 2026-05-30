# Self-Evolving Memory Framework (arXiv 2603.21520)
# PLANO-064 LANE-4: formalizing L2 auto-evolution

## Framework Overview

Based on "Generalizable Self-Evolving Memory for Automatic Prompt Optimization"
(arXiv 2603.21520, 23 Mar 2026). Applied to UniTeia P4 RSIP∞ memory tiers.

### Core Components

```
Memory Buffer (L2 findings)
  ├─ success traces: findings with eval_d9 ≥ 85 → promoted to L3
  ├─ failure traces: findings with eval_d9 < 30 → archived to L4
  └─ active traces: findings with 30 ≤ eval_d9 < 85 → cycling

Evolution Rule (gradient-based prompt update)
  ├─ Δ = target_score - current_score
  ├─ update = learning_rate × Δ × gradient
  └─ gradient = similarity(current_context, successful_contexts)

Generalization (cross-task transfer)
  └─ If finding in domain A succeeds, boost eval_d9 for similar
      findings in domain B by cross_domain_similarity × boost_factor
```

### Integration with Our L2

| Our Component | Framework Equivalent | Status |
|---------------|---------------------|--------|
| `consolidate-L1-L2.py` | Memory Buffer insert | ✅ |
| `eval_d9` scoring | Evolution Rule gradient | ✅ (heuristic) |
| `promote-L2-L3.py` | Evolution Rule update | ✅ (threshold-based) |
| `build-L2-graph.py` | Generalization (cross-domain) | ⚠ partial — no cross-domain boost |
| Domain tags (8 domains) | Context similarity | ✅ |

### Gap: Cross-Domain Boost

Current `promote-L2-L3.py` scores each finding independently.
Per arXiv 2603.21520, findings in similar domains should receive
a cross-domain similarity boost:

```python
def cross_domain_boost(finding: dict, promoted: list[dict]) -> float:
    """Boost eval_d9 based on similar successfully promoted findings."""
    domain = finding.get("domain", "unknown")
    similar = [f for f in promoted if f.get("domain") == domain]
    if not similar:
        return 1.0  # no boost
    avg_promoted_eval = sum(f.get("eval_d9", 85) for f in similar) / len(similar)
    return avg_promoted_eval / 85.0  # normalized boost
```

### Convergence Check

The framework guarantees convergence when:
1. Memory buffer is bounded (L2 max 200 findings) — ✅ via L4 archival
2. Evolution rule has diminishing returns (eval_d9 plateau at L2) — ⚠ not enforced
3. Cross-domain generalization is active — ❌ not implemented

### Recommendation

Add to `promote-L2-L3.py`:
1. Cross-domain boost function (3 lines)
2. Learning rate decay (halve learning_rate every 3 cycles without >5% improvement)
3. Plateau detection: if eval_d9 avg unchanged for 5 cycles → stop mutation

References:
- arXiv 2603.21520 (23 Mar 2026)
- Our L2 schema: memory/schema/L0-L4.json
- L3 entry format: memory/L3/
