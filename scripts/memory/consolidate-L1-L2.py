#!/usr/bin/env python3
"""
scripts/memory/consolidate-L1-L2.py — Fase 1: L1→L2 Daily Bridge

Scans raw session logs + ~/.hermes/memory + document files.
Extracts structured daily entries (L1) and findings (L2).
Writes memory/L1/YYYY-MM-DD.json and memory/L2/findings.json.

Usage:
  python3 scripts/memory/consolidate-L1-L2.py               # full scan
  python3 scripts/memory/consolidate-L1-L2.py --dry-run     # preview only
  python3 scripts/memory/consolidate-L1-L2.py --since=2026-05-20  # date filter

Gate: L1 has valid schema, L2 findings deduped
"""

import json
import os
import re
import sys
import glob
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MEMORY_DIR = REPO_ROOT / "memory"
L1_DIR = MEMORY_DIR / "L1"
L2_DIR = MEMORY_DIR / "L2"
SCHEMA_PATH = MEMORY_DIR / "schema" / "L0-L4.json"

HOME = Path.home()

FINDING_PATTERNS = [
    r"(?:finding|issue|bug|todo|TODO|FIXME|HACK|XXX):\s*(.+?)(?:\n|$)",
    r"F-\d{4}",
    r"(?:problem|error|falha|broken|quebrado|não funciona|not working)[^.]*",
    r"(?:grita|diagnóstico|diagnostic):\s*(.+?)(?:\n|$)",
]


def scan_session_logs(since: str | None = None) -> list[dict]:
    """Scan ~/session-ses_*.md files for structured entries."""
    entries = []
    log_files = sorted(HOME.glob("session-ses_*.md"))

    for fpath in log_files:
        # Extract date from filename or mtime
        mtime = datetime.fromtimestamp(fpath.stat().st_mtime, tz=timezone.utc)
        if since and mtime.strftime("%Y-%m-%d") < since:
            continue

        content = fpath.read_text(encoding="utf-8", errors="replace")
        size_kb = len(content) // 1024

        # Extract actions and summaries
        actions = re.findall(r'(?:→|λ|EXECUTOU|executed|completed|fixed|added|created)\s*(.+?)(?:\n|$)', content, re.IGNORECASE)
        commits = re.findall(r'[a-f0-9]{7,}\b', content)
        tools = set(re.findall(r'(?:tool:|terminal|write_file|read_file|patch|web_search|browser)\w*', content, re.IGNORECASE))
        findings = []
        for pat in FINDING_PATTERNS:
            findings.extend(re.findall(pat, content, re.IGNORECASE))

        entries.append({
            "date": mtime.strftime("%Y-%m-%d"),
            "source": fpath.name,
            "size_kb": size_kb,
            "actions": actions[:10],
            "commits": list(set(commits))[:10],
            "tools": list(tools),
            "findings_raw": list(set(findings))[:20],
            "age_days": (datetime.now(timezone.utc) - mtime).days,
        })

    return entries


def scan_planos(since: str | None = None) -> list[dict]:
    """Scan ~/Documentos/PLANOS/*.md for findings and actions."""
    entries = []
    plano_dir = HOME / "Documentos" / "PLANOS"
    if not plano_dir.exists():
        return entries

    for fpath in sorted(plano_dir.glob("PLANO-*.md")):
        content = fpath.read_text(encoding="utf-8", errors="replace")
        # Extract state from §0
        state_match = re.search(r'P\d+\.?\d*\s*[✅⏳❌]', content)
        # Extract findings from §Y_EVAL
        eval_match = re.search(r'§Y_EVAL.*?(?=§|$)', content, re.DOTALL)
        # Extract actions from §W_WORKFLOW
        workflow = re.search(r'§W_WORKFLOW.*?(?=§|$)', content, re.DOTALL)

        entries.append({
            "source": fpath.name,
            "has_state": bool(state_match),
            "has_eval": bool(eval_match),
            "has_workflow": bool(workflow),
            "content_preview": content[:200] if len(content) > 200 else content,
        })

    return entries


def compute_eval_d9(text: str, domain: str) -> int:
    """Heuristic eval-D⁹ score for a finding based on content quality."""
    score = 50  # baseline
    text_lower = text.lower()

    # Length signal
    if len(text) > 200: score += 15
    elif len(text) > 100: score += 10
    elif len(text) > 50: score += 5

    # Specificity signals
    if any(c.isdigit() for c in text): score += 10
    if re.search(r'\b[Ff]ix\b|\b[Ii]mplement\b|\b[Cc]reate\b', text): score += 10
    if re.search(r'\b[Ee]rror\b|\b[Bb]ug\b|\b[Ii]ssue\b', text): score += 10
    if re.search(r'\b[Nn]eed\b|\b[Mm]ust\b|\b[Uu]rgent\b|\b[Cc]ritical\b', text): score += 10
    if re.search(r'\b[Pp]0\b|\b[Pp]1\b|\bblocker\b|\bblocked\b', text): score += 15

    # Domain-specific
    if domain == "security" and any(w in text_lower for w in ["key", "secret", "auth", "token"]):
        score += 15
    if domain == "infra" and any(w in text_lower for w in ["disk", "disk", "memory", "fail"]):
        score += 10

    # Deduction for vagueness
    if len(text) < 20: score -= 20
    if text_lower.count('maybe') + text_lower.count('perhaps') > 2: score -= 15

    return max(0, min(100, score))


def extract_l2_findings(session_entries: list[dict], planos: list[dict]) -> list[dict]:
    """Extract and deduplicate L2 findings from all sources."""
    seen_texts = set()
    findings = []
    fid_counter = 1

    # Assign domains heuristically
    domain_keywords = {
        "infra": ["disk", "dns", "server", "deploy", "host", "docker", "container"],
        "content": ["article", "content", "md", "locale", "translation", "i18n"],
        "ui": ["css", "component", "layout", "design", "card", "button", "render", "visual"],
        "pipeline": ["build", "ci", "pipeline", "test", "lint", "typecheck", "gate"],
        "agent": ["agent", "skill", "memory", "tool", "prompt", "eval"],
        "data": ["graph", "embedding", "entity", "node", "edge", "json", "schema"],
        "ops": ["cron", "workflow", "automation", "script", "backup"],
        "security": ["auth", "key", "secret", "token", "cors", "csp"],
    }

    for entry in session_entries:
        for raw_text in entry.get("findings_raw", []):
            text = str(raw_text).strip()
            if not text or len(text) < 10:
                continue

            # Dedup by normalized text
            norm = text.lower()[:100]
            if norm in seen_texts:
                continue
            seen_texts.add(norm)

            # Classify domain
            domain = "ops"
            for d, kws in domain_keywords.items():
                if any(kw in norm for kw in kws):
                    domain = d
                    break

            findings.append({
                "id": f"F-{fid_counter:04d}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "domain": domain,
                "source": entry.get("source", "unknown"),
                "content": text[:500],
                "eval_d9": compute_eval_d9(text, domain),  # Dynamic scoring
                "status": "open",
                "deps_satisfied": False,
                "age_days": entry.get("age_days", 0),
                "tags": [domain],
                "stash_refs": entry.get("commits", [])[:3],
            })
            fid_counter += 1

    return findings


def write_l1_daily(entries: list[dict]) -> Path:
    """Write consolidated daily entries to memory/L1/YYYY-MM-DD.json."""
    # Group by date
    by_date = defaultdict(list)
    for e in entries:
        by_date[e["date"]].append(e)

    for date_str, day_entries in sorted(by_date.items()):
        l1_file = L1_DIR / f"{date_str}.json"
        l1_data = {
            "date": date_str,
            "entries": [
                {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "action": e.get("actions", ["scanned"])[0] if e.get("actions") else "scanned",
                    "summary": f"{e.get('source', 'unknown')}: {len(e.get('actions', []))} actions, "
                               f"{len(e.get('findings_raw', []))} raw findings",
                    "files_changed": [],
                    "commits": e.get("commits", []),
                    "eval_d9_avg": None,
                    "stash_refs": [],
                    "findings_count": len(e.get("findings_raw", [])),
                    "disk_before": None,
                    "disk_after": None,
                }
                for e in day_entries
            ]
        }
        l1_file.parent.mkdir(parents=True, exist_ok=True)
        with open(l1_file, "w") as f:
            json.dump(l1_data, f, indent=2, ensure_ascii=False)
        return l1_file

    return L1_DIR / "empty.json"


def write_l2_findings(findings: list[dict]) -> Path:
    """Write deduplicated L2 findings."""
    l2_file = L2_DIR / "findings.json"
    l2_file.parent.mkdir(parents=True, exist_ok=True)
    with open(l2_file, "w") as f:
        json.dump({
            "schema": "L2_finding",
            "generated": datetime.now(timezone.utc).isoformat(),
            "total": len(findings),
            "findings": findings,
        }, f, indent=2, ensure_ascii=False)
    return l2_file


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P2 Fase 1: L1→L2 Daily Bridge")
    parser.add_argument("--dry-run", action="store_true", help="Preview only")
    parser.add_argument("--since", type=str, default="2026-05-01", help="Start date (YYYY-MM-DD)")
    args = parser.parse_args()

    print(f"╔══ P2 Fase 1: L1→L2 Consolidation ══╗")
    print(f"║ since={args.since}  dry_run={args.dry_run}")
    print(f"╚══════════════════════════════════════╝")

    # Scan sources
    print(f"\n🔍 Scanning session logs...")
    session_entries = scan_session_logs(since=args.since)
    print(f"  Found {len(session_entries)} session log entries")

    print(f"🔍 Scanning PLANOs...")
    planos = scan_planos(since=args.since)
    print(f"  Found {len(planos)} PLANO documents")

    # Extract findings
    print(f"\n🔍 Extracting L2 findings...")
    findings = extract_l2_findings(session_entries, planos)
    print(f"  Found {len(findings)} unique findings")

    # Domain breakdown
    from collections import Counter
    domains = Counter(f["domain"] for f in findings)
    print(f"  By domain: {dict(domains)}")

    # Status breakdown
    statuses = Counter(f["status"] for f in findings)
    print(f"  By status: {dict(statuses)}")

    if args.dry_run:
        print(f"\n[DRY RUN] Would write:")
        print(f"  memory/L1/{datetime.now().strftime('%Y-%m-%d')}.json")
        print(f"  memory/L2/findings.json ({len(findings)} findings)")
        return 0

    # Write L1
    l1_path = write_l1_daily(session_entries)
    print(f"\n✅ L1 daily written: {l1_path}")

    # Write L2
    l2_path = write_l2_findings(findings)
    print(f"✅ L2 findings written: {l2_path}")

    # Stats
    open_findings = sum(1 for f in findings if f["status"] == "open")
    resolved = sum(1 for f in findings if f["status"] == "resolved")
    print(f"\n📊 Summary: {len(findings)} total findings ({open_findings} open, {resolved} resolved)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
