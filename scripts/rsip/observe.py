#!/usr/bin/env python3
"""
scripts/rsip/observe.py — P4 RSIP∞ OBSERVE step

Ingests L2 findings + P1.3 audit output + metrics + logs.
Outputs structured observation report for REFLECT step.

Usage:
  python3 scripts/rsip/observe.py                          # full ingest
  python3 scripts/rsip/observe.py --check                  # check only, no write
  python3 scripts/rsip/observe.py --since=2026-05-20       # date filter

Gate: observation report written → memory/L4/obs-latest.json
"""

import json
import sys
import gzip
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = REPO_ROOT / "memory"
L2_PATH = MEMORY_DIR / "L2" / "findings.json"
L3_DIR = MEMORY_DIR / "L3"
L4_DIR = REPO_ROOT / "meta" / "archive"
DIST_DIR = REPO_ROOT / "dist"
SCRIPTS_DIR = REPO_ROOT / "scripts"


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text())
    except (json.JSONDecodeError, OSError):
        return None


def observe_l2() -> dict:
    """Score L2 health: count, eval_d9 distribution, domain coverage."""
    data = load_json(L2_PATH)
    if not data:
        return {"status": "missing", "count": 0}

    findings = data.get("findings", [])
    if not findings:
        return {"status": "empty", "count": 0}

    eval_scores = [f.get("eval_d9", 0) for f in findings]
    domains = {}
    for f in findings:
        d = f.get("domain", "unknown")
        domains[d] = domains.get(d, 0) + 1

    return {
        "status": "ok",
        "count": len(findings),
        "eval_d9_avg": round(sum(eval_scores) / len(eval_scores), 1),
        "eval_d9_min": min(eval_scores),
        "eval_d9_max": max(eval_scores),
        "promoted_l3": sum(1 for f in findings if f.get("status") == "promoted_L3"),
        "open": sum(1 for f in findings if f.get("status") == "open"),
        "domains": domains,
    }


def observe_l3() -> dict:
    """Score L3 health: entry count, actionability split."""
    if not L3_DIR.exists():
        return {"count": 0}
    files = list(L3_DIR.glob("*.json"))
    actionable = sum(1 for f in files if "actionable" in f.read_text(encoding="utf-8", errors="replace")[:500])
    return {"count": len(files), "actionable": actionable}


def observe_graph() -> dict:
    """Score entity-graph health: total nodes, finding nodes."""
    graph = load_json(DIST_DIR / "entity-graph.json")
    if not graph:
        return {"status": "missing"}
    nodes = graph.get("nodes", [])
    findings = sum(1 for n in nodes if n.get("id", "").startswith("finding-"))
    return {"total": len(nodes), "findings": findings}


def observe_metrics() -> dict:
    """Score disk, git, and operational health."""
    import shutil
    total, used, free = shutil.disk_usage(REPO_ROOT)
    disk_pct = round(used / total * 100, 1)

    # Git state
    import subprocess
    try:
        r = subprocess.run(["git", "rev-list", "--count", "HEAD"],
                           capture_output=True, text=True, timeout=5,
                           cwd=REPO_ROOT)
        commits = int(r.stdout.strip())
    except:
        commits = 0

    try:
        r = subprocess.run(["git", "status", "--porcelain"],
                           capture_output=True, text=True, timeout=5,
                           cwd=REPO_ROOT)
        dirty = len(r.stdout.strip().split("\n")) if r.stdout.strip() else 0
    except:
        dirty = -1

    return {
        "disk_pct": disk_pct,
        "disk_free_gb": round(free / (1024**3), 1),
        "commits": commits,
        "dirty_files": dirty,
    }


def write_observation(l2: dict, l3: dict, graph: dict, metrics: dict) -> Path:
    """Write observation report to memory/L4/."""
    report = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "schema": "p4-observation.v1",
        "l2": l2,
        "l3": l3,
        "graph": graph,
        "metrics": metrics,
        "p4_score": round((
            (l2.get("eval_d9_avg", 0) * 0.3) +
            (min(100, l3.get("count", 0) * 5) * 0.2) +
            (min(100, graph.get("findings", 0) * 0.7) * 0.2) +
            (max(0, 100 - metrics.get("disk_pct", 50)) * 0.15) +
            (max(0, min(100, metrics.get("commits", 0) * 0.2)) * 0.15)
        ), 1),
    }

    L4_DIR.mkdir(parents=True, exist_ok=True)
    path = L4_DIR / "obs-latest.json"
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    return path


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P4 RSIP — OBSERVE")
    parser.add_argument("--check", action="store_true", help="Check only, no write")
    parser.add_argument("--since", type=str, default=None)
    args = parser.parse_args()

    print(f"╔══ P4 RSIP: OBSERVE ══╗")

    l2 = observe_l2()
    l3 = observe_l3()
    graph = observe_graph()
    metrics = observe_metrics()

    print(f"  L2: {l2.get('count', 0)} findings, avg_eval={l2.get('eval_d9_avg', '?')}")
    print(f"  L3: {l3.get('count', 0)} entries")
    print(f"  Graph: {graph.get('findings', 0)} finding nodes / {graph.get('total', 0)} total")
    print(f"  Disk: {metrics.get('disk_pct', '?')}% · Commits: {metrics.get('commits', '?')} · Dirty: {metrics.get('dirty_files', '?')}")

    p4 = round((
        (l2.get("eval_d9_avg", 0) * 0.3) +
        (min(100, l3.get("count", 0) * 5) * 0.2) +
        (min(100, graph.get("findings", 0) * 0.7) * 0.2) +
        (max(0, 100 - metrics.get("disk_pct", 50)) * 0.15) +
        (max(0, min(100, metrics.get("commits", 0) * 0.2)) * 0.15)
    ), 1)
    print(f"  P4 Score: {p4}%")

    if not args.check:
        path = write_observation(l2, l3, graph, metrics)
        print(f"  → {path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
