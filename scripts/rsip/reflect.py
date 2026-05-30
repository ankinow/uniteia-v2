#!/usr/bin/env python3
"""
scripts/rsip/reflect.py — P4 RSIP∞ REFLECT step (MA-ToT k=3)

Takes observation report, runs multi-perspective reflection.
Outputs: reflection candidates + drift analysis.

Usage:
  python3 scripts/rsip/reflect.py                              # reflect on latest obs
  python3 scripts/rsip/reflect.py --obs=<path>                  # specific obs file
  python3 scripts/rsip/reflect.py --k=3                         # MA-ToT branches (1-5)

Gate: reflection written → memory/L4/reflect-latest.json
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
L4_DIR = REPO_ROOT / "meta" / "archive"
L2_PATH = REPO_ROOT / "memory" / "L2" / "findings.json"

REFLECTION_AXES = [
    "quality — are eval_d9 scores improving or plateauing?",
    "coverage — which domains are under-represented in L3?",
    "drift — is the system improving or accumulating technical debt?",
    "bottleneck — what's the slowest part of the pipeline?",
    "risk — any safety flags, disk pressure, or API cost spikes?",
]


def load_latest_obs() -> dict:
    path = L4_DIR / "obs-latest.json"
    if not path.exists():
        return {"error": "no observation found", "l2": {"count": 0}, "metrics": {}}
    return json.loads(path.read_text())


def load_l2_counts() -> dict:
    if not L2_PATH.exists():
        return {"total": 0}
    data = json.loads(L2_PATH.read_text())
    findings = data.get("findings", [])
    domains = {}
    for f in findings:
        d = f.get("domain", "?")
        domains[d] = domains.get(d, 0) + 1
    return {"total": len(findings), "domains": domains}


def reflect_ma_tot(obs: dict, branches: int) -> list[dict]:
    """Multi-Axis Tree of Thought reflection."""
    reflections = []
    metrics = obs.get("metrics", {})
    l2 = obs.get("l2", {})
    l2_counts = load_l2_counts()

    # Branch 1: Quality trend
    eval_avg = l2.get("eval_d9_avg", 50)
    reflections.append({
        "branch": "quality",
        "finding": f"L2 avg eval_d9 = {eval_avg}",
        "flag": eval_avg < 70,
        "suggestion": "increase eval_d9 scoring specificity in consolidate-L1-L2.py" if eval_avg < 70 else "stable",
    })

    # Branch 2: Domain coverage gap
    domains = l2_counts.get("domains", {})
    low_domains = [d for d, c in domains.items() if c < 5]
    reflections.append({
        "branch": "coverage",
        "finding": f"domains: {len(domains)}, thin: {low_domains}",
        "flag": len(low_domains) > 2,
        "suggestion": f"target scanning for domains: {low_domains}" if low_domains else "balanced",
    })

    # Branch 3: Disk drift
    disk_pct = metrics.get("disk_pct", 50)
    reflections.append({
        "branch": "drift",
        "finding": f"disk at {disk_pct}%",
        "flag": disk_pct > 80,
        "suggestion": "run disk-cleanup-archive.py --auto" if disk_pct > 80 else "healthy",
    })

    # Branch 4: Bottleneck
    dirty = metrics.get("dirty_files", 0)
    reflections.append({
        "branch": "bottleneck",
        "finding": f"{dirty} dirty files",
        "flag": dirty > 10,
        "suggestion": "commit or stash pending changes" if dirty > 10 else "clean",
    })

    # Branch 5: Risk
    l2_findings = load_l2()
    safety_flags = sum(1 for f in l2_findings if f.get("domain") == "security" and f.get("status") == "open")
    reflections.append({
        "branch": "risk",
        "finding": f"{safety_flags} open security findings",
        "flag": safety_flags > 3,
        "suggestion": "prioritize security findings in next promotion cycle" if safety_flags > 3 else "low risk",
    })

    return reflections[:branches]


def load_l2() -> list[dict]:
    if not L2_PATH.exists():
        return []
    return json.loads(L2_PATH.read_text()).get("findings", [])


def compute_drift(obs: dict) -> dict:
    """Compare current obs with previous to detect drift."""
    prev_path = L4_DIR / "reflect-latest.json"
    if not prev_path.exists():
        return {"status": "first_run", "drift": 0}

    prev = json.loads(prev_path.read_text())
    prev_score = prev.get("p4_score_after", 0) or prev.get("observation", {}).get("p4_score", 0)
    curr_score = obs.get("p4_score", 0)

    drift = curr_score - prev_score
    return {
        "status": "compared",
        "prev_score": prev_score,
        "curr_score": curr_score,
        "drift": round(drift, 1),
        "flagged": drift < -5,
    }


def write_reflection(reflections: list[dict], drift: dict, obs: dict) -> Path:
    report = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "schema": "p4-reflection.v1",
        "branches": reflections,
        "drift": drift,
        "p4_score_before": obs.get("p4_score", 0),
        "p4_score_after": obs.get("p4_score", 0),  # will be updated by MUTATE
    }
    L4_DIR.mkdir(parents=True, exist_ok=True)
    path = L4_DIR / "reflect-latest.json"
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    return path


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P4 RSIP — REFLECT")
    parser.add_argument("--obs", type=str, default=None)
    parser.add_argument("--k", type=int, default=3, choices=range(1, 6))
    args = parser.parse_args()

    print(f"╔══ P4 RSIP: REFLECT (k={args.k}) ══╗")

    obs = load_latest_obs()
    if "error" in obs:
        print(f"  ⚠ {obs['error']}")
        return 1

    reflections = reflect_ma_tot(obs, args.k)
    drift = compute_drift(obs)

    print(f"  Branches:")
    for r in reflections:
        flag = "⚠" if r.get("flag") else "✓"
        print(f"  {flag} [{r['branch']}] {r['finding']}")

    print(f"  Drift: {drift.get('drift', 'first run')} pts")
    if drift.get("flagged"):
        print(f"  ⚠ DRIFT EXCEEDS -5pt THRESHOLD")

    path = write_reflection(reflections, drift, obs)
    print(f"  → {path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
