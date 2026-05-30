#!/usr/bin/env python3
"""
scripts/memory/promote-L2-L3.py — Fase 2: L2→L3 Wiki Promotion

Reads memory/L2/findings.json.
For each finding:
  - age > 30d AND no deps_satisfied → move to L4 cold storage
  - eval_d9 > 85 AND deps_satisfied → promote to L3 wiki/actionable/
  - eval_d9 > 85 AND NOT deps_satisfied → promote to L3 wiki/reference/
  - else → keep in L2

Also archives old findings to L4 compressed JSON.

Usage:
  python3 scripts/memory/promote-L2-L3.py
  python3 scripts/memory/promote-L2-L3.py --dry-run

Gate: L3 entries get actionability tags, L4 gets archive paths
"""

import json
import sys
import os
import re
import gzip
import shutil
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = REPO_ROOT / "memory"
L2_DIR = MEMORY_DIR / "L2"
L3_DIR = MEMORY_DIR / "L3"
L4_DIR = REPO_ROOT / "meta" / "archive"
WIKI_DIR = REPO_ROOT / "wiki"

# Promotion thresholds
EVAL_THRESHOLD_PROMOTE = 85  # eval_d9 >= 85 promotes to L3
AGE_DAYS_COLD = 30  # age > 30d without deps -> L4 cold


def load_l2_findings(path: Path) -> list[dict]:
    if not path.exists():
        print("⚠ L2 findings file not found. Run consolidate-L1-L2.py first.")
        return []
    with open(path) as f:
        data = json.load(f)
    return data.get("findings", [])


def classify_finding(f: dict) -> str:
    """Classify a finding into: promote_L3, cold_L4, keep_L2."""
    age = f.get("age_days", 0)
    eval_d9 = f.get("eval_d9", 0)
    deps = f.get("deps_satisfied", False)

    if age > AGE_DAYS_COLD and not deps:
        return "cold_L4"
    elif eval_d9 >= EVAL_THRESHOLD_PROMOTE and deps:
        return "promote_L3_actionable"
    elif eval_d9 >= EVAL_THRESHOLD_PROMOTE and not deps:
        return "promote_L3_reference"
    else:
        return "keep_L2"


def promote_to_l3(finding: dict, actionability: str) -> Path:
    """Write a wiki entry for the promoted finding."""
    domain = finding.get("domain", "general")
    fid = finding["id"]
    title = finding.get("content", "Untitled")[:80]
    # Sanitize for filename
    title_slug = re.sub(r'[^a-z0-9-]', '', title.lower().replace(' ', '-'))[:40]
    if not title_slug:
        title_slug = fid.lower().replace('-', '')

    wiki_entry = {
        "id": f"W-{fid[2:]}",
        "title": title,
        "domain": domain,
        "content": finding.get("content", ""),
        "actionability": actionability,
        "cross_refs": finding.get("tags", []),
        "source_findings": [fid],
        "eval_d9_promotion": finding.get("eval_d9", 0),
        "promoted_at": datetime.now(timezone.utc).isoformat(),
    }

    # Write to L3 structured directory
    l3_path = L3_DIR / f"{fid}-{domain}-{title_slug}.json"
    l3_path.parent.mkdir(parents=True, exist_ok=True)
    with open(l3_path, "w") as f:
        json.dump(wiki_entry, f, indent=2, ensure_ascii=False)

    # Also write to wiki/domain/ for GraphRAG indexing
    wiki_file = WIKI_DIR / "actionable" if actionability == "actionable" else WIKI_DIR / "reference"
    wiki_file.mkdir(parents=True, exist_ok=True)
    wiki_path = wiki_file / f"{fid}_{title_slug}.md"
    with open(wiki_path, "w") as f:
        f.write(f"# {title}\n\n{wiki_entry['content']}\n\n")
        f.write(f"---\n- Domain: {domain}\n- Source: {fid}\n- Eval-D⁹: {wiki_entry['eval_d9_promotion']}\n- Actionability: {actionability}\n- Promoted: {wiki_entry['promoted_at']}\n")

    return l3_path


def archive_to_l4(findings: list[dict]) -> Path:
    """Compress stale findings to L4 cold storage."""
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    archive_name = f"archive-{timestamp}.json.gz"
    archive_path = L4_DIR / archive_name
    L4_DIR.mkdir(parents=True, exist_ok=True)

    archive_data = {
        "archive_id": f"M-{timestamp[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "paradigm": "cold_storage",
        "compressed": True,
        "original_count": len(findings),
        "original_ids": [f["id"] for f in findings],
        "findings": findings,
    }

    with gzip.open(archive_path, "wt", encoding="utf-8") as f:
        json.dump(archive_data, f, ensure_ascii=False)

    return archive_path


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P2 Fase 2: L2→L3 Wiki Promotion")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    parser.add_argument("--force-promote-below", action="store_true",
                        help="Promote even findings below eval threshold (debug)")
    args = parser.parse_args()

    print(f"╔══ P2 Fase 2: L2→L3 Promotion ══╗")
    print(f"║ dry_run={args.dry_run}")
    print(f"╚═══════════════════════════════════╝")

    findings = load_l2_findings(L2_DIR / "findings.json")
    print(f"📦 Loaded {len(findings)} L2 findings")

    # Classify
    actions = {"promote_L3_actionable": [], "promote_L3_reference": [], "cold_L4": [], "keep_L2": []}
    for f in findings:
        verdict = classify_finding(f)
        actions[verdict].append(f)

    print(f"\n📊 Classification:")
    for k, v in actions.items():
        print(f"  {k}: {len(v)}")

    if args.dry_run:
        print(f"\n[DRY RUN] No changes made.")
        return 0

    # Promote to L3
    promoted_count = 0
    for finding in actions["promote_L3_actionable"]:
        path = promote_to_l3(finding, "actionable")
        finding["status"] = "promoted_L3"
        print(f"  ✅ {finding['id']} → L3 actionable: {path.name}")
        promoted_count += 1

    for finding in actions["promote_L3_reference"]:
        path = promote_to_l3(finding, "reference")
        finding["status"] = "promoted_L3"
        print(f"  📝 {finding['id']} → L3 reference: {path.name}")
        promoted_count += 1

    # Archive to L4
    cold = actions["cold_L4"]
    if cold:
        archive_path = archive_to_l4(cold)
        for f in cold:
            f["status"] = "cold_storage"
        print(f"  ❄️ {len(cold)} findings → L4 cold: {archive_path} ({archive_path.stat().st_size} bytes)")

        # Remove archived from L2
        archived_ids = {f["id"] for f in cold}
        findings = [f for f in findings if f["id"] not in archived_ids]

        # Clean up archived findings size
        if archive_path.stat().st_size > 1000:
            print(f"  💾 Freed ~{len(cold)} entries from L2")

    # Update L2 findings.json (keeping remaining)
    remaining = [f for f in findings
                 if f.get("status") in ("promoted_L3", "promoted_L4", "open", "in_progress")]
    with open(L2_DIR / "findings.json", "w") as f:
        json.dump({
            "schema": "L2_finding",
            "generated": datetime.now(timezone.utc).isoformat(),
            "total": len(remaining),
            "findings": remaining,
        }, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Promotion complete:")
    print(f"  L3 wiki entries created: {promoted_count}")
    print(f"  L4 archive entries: {len(cold)}")
    print(f"  L2 remaining: {len(remaining)}")

    # Count actionable vs reference
    actionable = sum(1 for f in actions["promote_L3_actionable"])
    reference = sum(1 for f in actions["promote_L3_reference"])
    print(f"  Actionable: {actionable} | Reference: {reference} | Archived: {len(cold)} | Keep: {len(remaining)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
