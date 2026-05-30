#!/usr/bin/env python3
"""
scripts/rsip/consolidate.py — P4 RSIP∞ CONSOLIDATE step

Reads L2 findings, promotes high-value (eval_d9≥85 + no safety flag) to L3/wiki.
Archives stale (age>30d + no deps) to L4 cold storage.
Updates L2 STATUS for promoted/archived findings.

Usage:
  python3 scripts/rsip/consolidate.py                          # run gate
  python3 scripts/rsip/consolidate.py --dry-run                # preview only
  python3 scripts/rsip/consolidate.py --force                  # force promotion

Gate: L2 findings processed, L3/Wiki updated
"""

import json
import sys
import re
import gzip
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = REPO_ROOT / "memory"
L2_PATH = MEMORY_DIR / "L2" / "findings.json"
L3_DIR = MEMORY_DIR / "L3"
L4_DIR = REPO_ROOT / "meta" / "archive"
WIKI_DIR = REPO_ROOT / "wiki"

PROMOTE_EVAL_MIN = 85
COLD_AGE_MAX = 30


def load_l2() -> list[dict]:
    if not L2_PATH.exists():
        return []
    return json.loads(L2_PATH.read_text()).get("findings", [])


def save_l2(findings: list[dict]):
    L2_PATH.parent.mkdir(parents=True, exist_ok=True)
    L2_PATH.write_text(json.dumps({
        "schema": "L2_finding",
        "generated": datetime.now(timezone.utc).isoformat(),
        "total": len(findings),
        "findings": findings,
    }, indent=2, ensure_ascii=False))


def promote_to_l3(finding: dict, dry_run: bool) -> bool:
    """Promote a finding to L3 if eval_d9 ≥ 85 and no safety flag."""
    eval_d9 = finding.get("eval_d9", 0)
    content = finding.get("content", "")
    is_safety = finding.get("domain") == "security" and eval_d9 < 70

    if eval_d9 < PROMOTE_EVAL_MIN:
        return False
    if is_safety:
        return False

    fid = finding["id"]
    title = content[:80]
    title_slug = re.sub(r'[^a-z0-9-]', '', title.lower().replace(' ', '-'))[:40] or fid.lower()

    # Determine actionability
    has_deps = finding.get("deps_satisfied", False)
    actionability = "actionable" if has_deps else "reference"

    l3_entry = {
        "id": f"W-{fid[2:]}",
        "title": title,
        "domain": finding.get("domain", "general"),
        "content": content[:5000],
        "actionability": actionability,
        "cross_refs": finding.get("tags", []),
        "source_findings": [fid],
        "eval_d9_promotion": eval_d9,
        "promoted_at": datetime.now(timezone.utc).isoformat(),
    }

    if dry_run:
        return True

    # Write L3 structured entry
    L3_DIR.mkdir(parents=True, exist_ok=True)
    (L3_DIR / f"{fid}-{finding.get('domain', 'general')}-{title_slug}.json").write_text(
        json.dumps(l3_entry, indent=2, ensure_ascii=False))

    # Write wiki entry
    wiki_dir = WIKI_DIR / ("actionable" if actionability == "actionable" else "reference")
    wiki_dir.mkdir(parents=True, exist_ok=True)
    wiki_path = wiki_dir / f"{fid}_{title_slug}.md"
    wiki_path.write_text(
        f"# {title}\n\n{l3_entry['content']}\n\n"
        f"---\n- Domain: {l3_entry['domain']}\n- Source: {fid}\n"
        f"- Eval-D⁹: {eval_d9}\n- Actionability: {actionability}\n"
        f"- Promoted: {l3_entry['promoted_at']}\n")

    finding["status"] = "promoted_L3"
    return True


def archive_to_l4(findings: list[dict], dry_run: bool) -> bool:
    """Archive stale findings to L4 cold storage."""
    if not findings:
        return False

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    archive_path = L4_DIR / f"archive-{timestamp}.json.gz"
    L4_DIR.mkdir(parents=True, exist_ok=True)

    archive_data = {
        "archive_id": f"M-{timestamp[:8]}",
        "ts": datetime.now(timezone.utc).isoformat(),
        "paradigm": "cold_storage",
        "compressed": True,
        "count": len(findings),
        "original_ids": [f["id"] for f in findings],
        "findings": findings,
    }

    if dry_run:
        return True

    with gzip.open(archive_path, "wt", encoding="utf-8") as f:
        json.dump(archive_data, f, ensure_ascii=False)

    for f in findings:
        f["status"] = "cold_storage"

    return True


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P4 RSIP — CONSOLIDATE")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    parser.add_argument("--force", action="store_true", help="Force promotion")
    args = parser.parse_args()

    dry_run = args.dry_run
    print(f"╔══ P4 RSIP: CONSOLIDATE ══╗")
    print(f"║ mode={'dry-run' if dry_run else 'live'}")

    findings = load_l2()
    print(f"📦 {len(findings)} L2 findings loaded")

    promoted = 0
    cold = 0
    remaining = []

    for f in findings:
        eval_d9 = f.get("eval_d9", 0)
        age = f.get("age_days", 0)
        deps = f.get("deps_satisfied", False)

        # Cold: old + no deps
        if age > COLD_AGE_MAX and not deps and not args.force:
            cold += 1
            continue  # handle below

        # Promote: high eval + not safety
        if (eval_d9 >= PROMOTE_EVAL_MIN or args.force) and \
           not (f.get("domain") == "security" and eval_d9 < 70):
            if promote_to_l3(f, dry_run):
                promoted += 1
                remaining.append(f)
                continue

        remaining.append(f)

    # Cold archive
    cold_findings = [f for f in findings if f.get("status") == "cold_storage"]
    if cold_findings:
        archive_to_l4(cold_findings, dry_run)

    if not dry_run:
        save_l2(remaining)

    print(f"\n📊 Results:")
    print(f"  Promoted to L3: {promoted}")
    print(f"  Archived to L4: {cold}")
    print(f"  Remaining in L2: {len(remaining)}")

    # Stats
    promoted_ids = [f["id"] for f in findings if f.get("status") == "promoted_L3"]
    print(f"\n  Promoted IDs: {promoted_ids[:10]}{'...' if len(promoted_ids) > 10 else ''}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
