#!/usr/bin/env python3
"""
scripts/compression/audit-te-compliance.py — LANE-2: TE Compliance Audit

Audits SOUL.md and all skill files for Token Engineering (TE) compliance.
TE = symbolic rewriting with explicit logical operators (→, ∧, ∀, ∃, ⊕, ⊗)
vs plain token deletion (LLMLingua-2).

Usage:
  python3 scripts/compression/audit-te-compliance.py              # full audit
  python3 scripts/compression/audit-te-compliance.py --soul-only  # SOUL.md only
  python3 scripts/compression/audit-te-compliance.py --fix        # annotate missing ops

Gate: TE compliance score ≥ 80% (target: 90%)
"""

import json
import re
import sys
from pathlib import Path

HOME = Path.home()
SOUL_PATH = HOME / ".hermes" / "SOUL.md"
SKILLS_DIR = HOME / ".hermes" / "skills"

# TE operators that should be present
TE_OPERATORS = {
    "→": "implies / leads_to",
    "∧": "and / conjunction",
    "∨": "or / disjunction",
    "∀": "for_all / universal",
    "∃": "exists / existential",
    "⊕": "combine / combine_with",
    "⊗": "conflicts / conflicts_with",
    "Σ": "aggregate / sum",
    "λ": "transform / function",
    "Δ": "delta / change",
    "∞": "infinity / continuous",
    "⦿": "composition / process",
}

# Anti-patterns (plain-text that should use TE)
ANTI_PATTERNS = [
    r'\bleads?\s+to\b',
    r'\bcombined?\s+with\b',
    r'\bconflicts?\s+with\b',
    r'\bfor\s+all\b',
    r'\bthere\s+exists\b',
    r'\bin\s+other\s+words\b',
    r'\bthat\s+is\b',
    r'\bi\.e\.\b',
    r'\be\.g\.\b',
]


def count_te_operators(text: str) -> dict[str, int]:
    """Count all TE operators in text."""
    counts = {}
    for op in TE_OPERATORS:
        counts[op] = text.count(op)
    return counts


def find_anti_patterns(text: str) -> list[tuple[str, int]]:
    """Find plain-text patterns that should use TE notation."""
    matches = []
    for pat in ANTI_PATTERNS:
        for m in re.finditer(pat, text, re.IGNORECASE):
            start = max(0, m.start() - 20)
            end = min(len(text), m.end() + 20)
            context = text[start:end].replace('\n', ' ')
            matches.append((m.group(), len(matches)))
    return matches


def audit_soul() -> dict:
    """Audit SOUL.md for TE compliance."""
    if not SOUL_PATH.exists():
        return {"error": "SOUL.md not found", "score": 0}

    content = SOUL_PATH.read_text(encoding="utf-8", errors="replace")
    total_chars = len(content)

    # Count operators
    op_counts = count_te_operators(content)
    total_ops = sum(op_counts.values())
    unique_ops = sum(1 for v in op_counts.values() if v > 0)

    # Density: operators per 1000 chars
    density = (total_ops / total_chars) * 1000 if total_chars > 0 else 0

    # Anti-patterns
    anti = find_anti_patterns(content)
    anti_count = len(anti)

    # Score: 0-100
    # Base from unique operators (need ≥ 8 of 12 for 100%)
    op_score = min(100, (unique_ops / 8) * 100)
    # Density bonus (≥ 2.0 ops/1K chars = full)
    density_score = min(100, (density / 2.0) * 100)
    # Anti-pattern penalty
    anti_penalty = anti_count * 5
    score = max(0, min(100, (op_score * 0.6 + density_score * 0.4) - anti_penalty))

    return {
        "file": str(SOUL_PATH),
        "total_chars": total_chars,
        "total_operators": total_ops,
        "unique_operators": unique_ops,
        "density_per_1k": round(density, 2),
        "operator_breakdown": {k: v for k, v in sorted(op_counts.items()) if v > 0},
        "anti_patterns_found": anti_count,
        "anti_examples": anti[:5],
        "score": round(score, 1),
        "grade": "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D",
    }


def audit_skills() -> dict:
    """Audit all SKILL.md files for TE compliance."""
    results = {"total": 0, "compliant": 0, "scores": []}
    if not SKILLS_DIR.exists():
        return results

    for skill_file in SKILLS_DIR.rglob("SKILL.md"):
        results["total"] += 1
        content = skill_file.read_text(encoding="utf-8", errors="replace")
        op_counts = count_te_operators(content)
        total_ops = sum(op_counts.values())
        # A skill is "TE-compliant" if it uses ≥ 3 different operators
        unique_ops = sum(1 for v in op_counts.values() if v > 0)
        if unique_ops >= 3:
            results["compliant"] += 1
        results["scores"].append({
            "path": str(skill_file.relative_to(SKILLS_DIR)),
            "operators": total_ops,
            "unique_ops": unique_ops,
            "compliant": unique_ops >= 3,
        })

    return results


def main():
    import argparse
    parser = argparse.ArgumentParser(description="TE Compliance Audit")
    parser.add_argument("--soul-only", action="store_true", help="Audit SOUL.md only")
    parser.add_argument("--fix", action="store_true", help="Add missing TE annotations")
    parser.add_argument("--json", action="store_true", help="JSON output")
    args = parser.parse_args()

    print(f"╔══ TE Compliance Audit (PLANO-064 LANE-2) ══╗")

    # Audit SOUL.md
    soul_result = audit_soul()
    print(f"\n📄 SOUL.md:")
    print(f"  Characters: {soul_result.get('total_chars', 0)}")
    print(f"  TE operators: {soul_result.get('total_operators', 0)} ({soul_result.get('unique_operators', 0)} unique)")
    print(f"  Density: {soul_result.get('density_per_1k', 0)} ops/1K chars")
    print(f"  Anti-patterns: {soul_result.get('anti_patterns_found', 0)}")
    if soul_result.get("operator_breakdown"):
        for op, count in soul_result["operator_breakdown"].items():
            print(f"    {op}: {count}x")
    print(f"  Score: {soul_result.get('score', 0)}% (Grade {soul_result.get('grade', 'F')})")
    if soul_result.get("anti_examples"):
        print(f"  Examples (first 3):")
        for example, _ in soul_result["anti_examples"][:3]:
            ctx = example[:60]
            print(f"    ⚠ '{ctx}'")

    if args.soul_only:
        print(f"\n{'✅ TE Compliant' if soul_result.get('score',0) >= 80 else '⚠ Needs improvement'}")
        if args.json:
            print(json.dumps(soul_result, indent=2))
        return 0 if soul_result.get("score", 0) >= 80 else 1

    # Audit skills
    skill_results = audit_skills()
    print(f"\n📚 Skills:")
    print(f"  Total SKILL.md files: {skill_results['total']}")
    print(f"  TE-compliant (≥3 ops): {skill_results['compliant']}/{skill_results['total']}")
    for s in skill_results["scores"]:
        flag = "✅" if s["compliant"] else "⚠"
        print(f"  {flag} {s['path']} ({s['unique_ops']} unique ops)")

    # Overall
    soul_score = soul_result.get("score", 0)
    skill_rate = (skill_results.get("compliant", 0) / max(1, skill_results.get("total", 1))) * 100
    overall = round(soul_score * 0.5 + skill_rate * 0.5, 1)
    print(f"\n📊 Overall TE Score: {overall}% {'✅' if overall >= 80 else '⚠'}")

    if args.json:
        print(json.dumps({"soul": soul_result, "skills": skill_results, "overall": overall}, indent=2))

    return 0 if overall >= 80 else 1


if __name__ == "__main__":
    sys.exit(main())
