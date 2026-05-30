#!/usr/bin/env python3
"""
scripts/memory/p4-audit-trail.py — P4 Audit Trail Bootstrap

Monitors L2 health, triggers consolidation, and scores pipeline state.
Designed to run as a cron job: every 6h or on demand.

Usage:
  python3 scripts/memory/p4-audit-trail.py        # full audit
  python3 scripts/memory/p4-audit-trail.py --score-only  # just Eval-D⁹
  python3 scripts/memory/p4-audit-trail.py --auto  # run + fix

Gate: Eval-D⁹ pipeline health > 80%
"""

import json
import sys
import subprocess
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = REPO_ROOT / "memory"
SCRIPTS_DIR = REPO_ROOT / "scripts" / "memory"

REQUIRED_SCRIPTS = [
    "consolidate-L1-L2.py",
    "promote-L2-L3.py",
    "build-L2-graph.py",
    "disk-cleanup-archive.py",
]

REQUIRED_DIRS = [
    "memory/L0",
    "memory/L1",
    "memory/L2",
    "memory/L3",
    "memory/L4",
    "memory/schema",
    "wiki/actionable",
    "wiki/reference",
    "meta/archive",
]


def check_dirs() -> list[str]:
    issues = []
    for d in REQUIRED_DIRS:
        p = REPO_ROOT / d
        if not p.exists():
            issues.append(f"missing dir: {d}")
    return issues


def check_scripts() -> list[str]:
    issues = []
    for s in REQUIRED_SCRIPTS:
        p = SCRIPTS_DIR / s
        if not p.exists():
            issues.append(f"missing script: {s}")
    return issues


def check_l2_health() -> dict:
    l2_file = MEMORY_DIR / "L2" / "findings.json"
    if not l2_file.exists():
        return {"exists": False, "count": 0, "eval_d9_avg": 0}

    with open(l2_file) as f:
        data = json.load(f)

    findings = data.get("findings", [])
    if not findings:
        return {"exists": True, "count": 0, "eval_d9_avg": 0}

    avg_eval = sum(f.get("eval_d9", 0) for f in findings) / len(findings)
    promoted = sum(1 for f in findings if f.get("status") in ("promoted_L3", "promoted_L4"))
    cold = sum(1 for f in findings if f.get("status") == "cold_storage")
    open_count = sum(1 for f in findings if f.get("status") == "open")

    return {
        "exists": True,
        "count": len(findings),
        "eval_d9_avg": round(avg_eval, 1),
        "open": open_count,
        "promoted": promoted,
        "cold": cold,
    }


def check_l3_health() -> dict:
    l3_dir = MEMORY_DIR / "L3"
    if not l3_dir.exists():
        return {"count": 0}

    files = list(l3_dir.glob("*.json"))
    return {"count": len(files)}


def check_graph_health() -> dict:
    graph_file = REPO_ROOT / "dist" / "entity-graph.json"
    if not graph_file.exists():
        return {"exists": False, "finding_nodes": 0}

    with open(graph_file) as f:
        data = json.load(f)

    nodes = data.get("nodes", [])
    finding_nodes = sum(1 for n in nodes if n.get("id", "").startswith("finding-"))
    return {"exists": True, "total": len(nodes), "findings": finding_nodes}


def compute_pipeline_score(l2: dict, l3: dict, graph: dict, dir_issues: list, script_issues: list) -> dict:
    scores = {}

    # L2 health
    if l2.get("exists"):
        scores["l2_count"] = min(100, l2["count"] / 1.5)
        scores["l2_eval_d9"] = l2.get("eval_d9_avg", 0)
        if l2.get("count", 0) > 0:
            scores["l2_promotion_rate"] = min(100, l2.get("promoted", 0) / l2["count"] * 200)
        else:
            scores["l2_promotion_rate"] = 0
    else:
        scores["l2_count"] = 0
        scores["l2_eval_d9"] = 0
        scores["l2_promotion_rate"] = 0

    # L3 health
    scores["l3_count"] = min(100, l3.get("count", 0) * 8)

    # Graph health
    if graph.get("exists"):
        scores["graph_findings"] = min(100, graph.get("findings", 0) * 0.7)
    else:
        scores["graph_findings"] = 0

    # Infrastructure
    scores["dirs"] = 100 - len(dir_issues) * 20
    scores["scripts"] = 100 - len(script_issues) * 25

    avg = sum(scores.values()) / max(1, len(scores))
    scores["_avg"] = round(avg, 1)

    return scores


def run_subprocess(script_name: str) -> tuple[int, str]:
    """Run a memory script and return (exit_code, output)."""
    script_path = SCRIPTS_DIR / script_name
    if not script_path.exists():
        return -1, f"Script not found: {script_name}"
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=True, text=True, timeout=120,
            cwd=REPO_ROOT,
        )
        return result.returncode, result.stdout[-500:] if result.stdout else result.stderr[:500]
    except subprocess.TimeoutExpired:
        return -2, f"Timeout running {script_name}"
    except Exception as e:
        return -3, f"Error running {script_name}: {e}"


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P4 Audit Trail")
    parser.add_argument("--score-only", action="store_true", help="Just score, no actions")
    parser.add_argument("--auto", action="store_true", help="Run consolidation cycle")
    args = parser.parse_args()

    print(f"╔══ P4 Audit Trail ══╗")
    print(f"║ mode={'auto' if args.auto else 'score' if args.score_only else 'check'}")
    print(f"╚══════════════════════╝")

    # Check infrastructure
    dir_issues = check_dirs()
    script_issues = check_scripts()

    # Check health
    l2 = check_l2_health()
    l3 = check_l3_health()
    graph = check_graph_health()

    # Score
    scores = compute_pipeline_score(l2, l3, graph, dir_issues, script_issues)

    print(f"\n📊 Pipeline Health:")
    for dim, score in sorted(scores.items()):
        if dim == "_avg":
            continue
        bar = "█" * int(score / 10) + "░" * (10 - int(score / 10))
        print(f"  {dim:20s} {bar} {score:.0f}%")
    print(f"  {'AVERAGE':20s} {'─' * 10} {scores['_avg']}%")

    print(f"\n🏛  Infrastructure:")
    print(f"  Directories: {'✅' if not dir_issues else '❌ ' + ', '.join(dir_issues)}")
    print(f"  Scripts:     {'✅' if not script_issues else '❌ ' + ', '.join(script_issues)}")

    print(f"\n📦 Memory Tiers:")
    print(f"  L2: {l2.get('count', 0)} findings, eval_d9={l2.get('eval_d9_avg', 0)}, "
          f"promoted={l2.get('promoted', 0)}, open={l2.get('open', 0)}")
    print(f"  L3: {l3.get('count', 0)} wiki entries")
    print(f"  Graph: {graph.get('findings', 0)} finding nodes in entity-graph.json")

    # Auto-run
    if args.auto:
        print(f"\n⚡ Running consolidation cycle...")
        for script_name in REQUIRED_SCRIPTS:
            print(f"  → {script_name}...")
            code, output = run_subprocess(script_name)
            if code == 0:
                print(f"    ✅ OK")
            else:
                print(f"    ⚠ Exit {code}: {output[:100]}")

        # Re-score after auto
        print(f"\n📊 Post-consolidation:")
        l2 = check_l2_health()
        l3 = check_l3_health()
        graph = check_graph_health()
        scores = compute_pipeline_score(l2, l3, graph, check_dirs(), check_scripts())
        print(f"  L2: {l2.get('count', 0)} findings, avg eval_d9={l2.get('eval_d9_avg', 0)}")
        print(f"  L3: {l3.get('count', 0)} wiki entries")
        print(f"  Graph: {graph.get('findings', 0)} finding nodes")

    # Final gate
    if scores["_avg"] >= 80:
        print(f"\n✅ P4 GATE PASSED (pipeline avg={scores['_avg']}%)")
    else:
        print(f"\n⚠ P4 GATE BLOCKED (pipeline avg={scores['_avg']}% < 80%)")

    return 0 if scores["_avg"] >= 80 else 1


if __name__ == "__main__":
    sys.exit(main())
