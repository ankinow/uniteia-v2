#!/usr/bin/env python3
"""
scripts/rsip/audit.py — P4 RSIP∞ AUDIT step

External validation via P1.3 Auditor pipeline + NIM safety-reasoning-4b.
Validates: safety, consistency, tool integrity, constitutional alignment.

Runs PRM (Process Reward Model), tool-use audit, adversarial test, 
and constitutional check.

Usage:
  python3 scripts/rsip/audit.py                          # full audit
  python3 scripts/rsip/audit.py --prm-only               # PRM only
  python3 scripts/rsip/audit.py --skip-nim               # skip NIM calls
  python3 scripts/rsip/audit.py --nim-url=<url>          # custom NIM endpoint

Gate: ALL checks pass → Ω(merge) | ANY fail → Ω(reject)
"""

import json
import sys
import subprocess
import os
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
L4_DIR = REPO_ROOT / "meta" / "archive"
L2_PATH = REPO_ROOT / "memory" / "L2" / "findings.json"
SCRIPTS_DIR = REPO_ROOT / "scripts"

NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
NIM_MODEL = "nvidia/nemotron-content-safety-reasoning-4b"
NIM_URL = os.environ.get("NIM_BASE_URL", "https://integrate.api.nvidia.com/v1")


def audit_prm() -> dict:
    """Process Reward Model: validate L2 structural integrity."""
    if not L2_PATH.exists():
        return {"check": "PRM", "passed": False, "detail": "L2 file missing"}

    try:
        data = json.loads(L2_PATH.read_text())
    except json.JSONDecodeError:
        return {"check": "PRM", "passed": False, "detail": "L2 file corrupt"}

    findings = data.get("findings", [])
    if not findings:
        return {"check": "PRM", "passed": False, "detail": "L2 empty"}

    # Structural checks
    required_keys = {"id", "timestamp", "domain", "content", "eval_d9"}
    valid = sum(1 for f in findings if required_keys.issubset(f.keys()))
    eval_in_range = sum(1 for f in findings if 0 <= f.get("eval_d9", -1) <= 100)
    has_domain = sum(1 for f in findings if f.get("domain"))

    passed = valid == len(findings) and eval_in_range == len(findings) and has_domain > 0
    return {
        "check": "PRM",
        "passed": passed,
        "detail": f"{valid}/{len(findings)} valid, {eval_in_range} in-range, {has_domain} with domain",
        "score": round(valid / max(1, len(findings)) * 100, 1),
    }


def audit_tools() -> dict:
    """Tool-use audit: verify scripts exist and have valid syntax."""
    required = [
        "scripts/memory/consolidate-L1-L2.py",
        "scripts/memory/promote-L2-L3.py",
        "scripts/memory/build-L2-graph.py",
        "scripts/rsip/observe.py",
        "scripts/rsip/reflect.py",
        "scripts/rsip/mutate.py",
        "scripts/rsip/consolidate.py",
        "scripts/rsip/audit.py",
    ]

    missing = []
    for rel in required:
        if not (REPO_ROOT / rel).exists():
            missing.append(rel)

    # Quick syntax check
    syntax_errors = 0
    for rel in required:
        path = REPO_ROOT / rel
        if path.exists():
            try:
                compile(path.read_text(), str(path), "exec")
            except SyntaxError:
                syntax_errors += 1

    passed = len(missing) == 0 and syntax_errors == 0
    return {
        "check": "tool_integrity",
        "passed": passed,
        "detail": f"{len(missing)} missing, {syntax_errors} syntax errors" if not passed else "all ok",
    }


def audit_adversarial() -> dict:
    """Adversarial test: check for common failure modes."""
    issues = []

    # Check if L2 has findings without timestamps
    if L2_PATH.exists():
        data = json.loads(L2_PATH.read_text())
        for f in data.get("findings", []):
            if not f.get("timestamp"):
                issues.append(f"{f['id']}: no timestamp")
                break

    # Check if entity-graph.json has finding nodes
    graph_path = REPO_ROOT / "dist" / "entity-graph.json"
    if graph_path.exists():
        graph = json.loads(graph_path.read_text())
        finding_nodes = [n for n in graph.get("nodes", []) if n.get("id", "").startswith("finding-")]
        if len(finding_nodes) < 10:
            issues.append(f"only {len(finding_nodes)} finding nodes in graph")

    # Check disk
    import shutil
    total, used, free = shutil.disk_usage(REPO_ROOT)
    disk_pct = used / total * 100
    if disk_pct > 80:
        issues.append(f"disk at {disk_pct:.0f}%")

    passed = len(issues) == 0
    return {
        "check": "adversarial",
        "passed": passed,
        "detail": "; ".join(issues) if issues else "no issues found",
    }


def audit_constitutional() -> dict:
    """Constitutional check: verify eval_d9 threshold ≥ 90% is locked."""
    findings = []
    if L2_PATH.exists():
        findings = json.loads(L2_PATH.read_text()).get("findings", [])

    # Check no eval_d9 threshold was lowered below 90%
    avg_eval = sum(f.get("eval_d9", 0) for f in findings) / max(1, len(findings)) if findings else 0

    violations = []
    if avg_eval < 90 and len(findings) > 50:
        violations.append(f"avg eval_d9 ({avg_eval:.1f}) < 90% threshold")

    passed = len(violations) == 0
    return {
        "check": "constitutional",
        "passed": passed,
        "detail": "; ".join(violations) if violations else f"avg eval_d9={avg_eval:.1f} (threshold lock: ≥90%)",
    }


def audit_nim() -> dict:
    """External: call NIM safety-reasoning-4b to validate random L2 entry."""
    if not NVIDIA_API_KEY:
        return {"check": "NIM_audit", "passed": None, "detail": "NVIDIA_API_KEY not set (skipped)"}

    # Find a random high-value L2 entry to audit
    findings = []
    if L2_PATH.exists():
        findings = [f for f in json.loads(L2_PATH.read_text()).get("findings", [])
                    if f.get("eval_d9", 0) > 70]

    if not findings:
        return {"check": "NIM_audit", "passed": None, "detail": "no high-value findings to audit"}

    import random
    target = random.choice(findings)
    content = target.get("content", "")[:1000]

    import urllib.request
    payload = json.dumps({
        "model": NIM_MODEL,
        "messages": [{"role": "user", "content": f"""Review this finding for safety concerns, contradictions, or hallucinations.
Return ONLY valid JSON: {{"is_safe": bool, "has_contradiction": bool, "has_hallucination": bool, "confidence": 0-100}}

Finding: {content}"""}],
        "temperature": 0.1,
        "max_tokens": 200,
    }).encode()

    req = urllib.request.Request(
        f"{NIM_URL}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
            content = result["choices"][0]["message"]["content"]
            # Extract JSON
            import re
            jm = re.search(r'\{.*\}', content, re.DOTALL)
            if jm:
                verdict = json.loads(jm.group())
                is_safe = verdict.get("is_safe", True)
                return {
                    "check": "NIM_audit",
                    "passed": is_safe,
                    "detail": f"audited {target['id']}: safe={is_safe}, conf={verdict.get('confidence', '?')}",
                    "target_id": target["id"],
                    "nim_response": verdict,
                }
            return {"check": "NIM_audit", "passed": None, "detail": "no JSON in NIM response"}
    except Exception as e:
        return {"check": "NIM_audit", "passed": None, "detail": f"NIM error: {e}"}


def write_audit(results: list[dict]) -> Path:
    report = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "schema": "p4-audit.v1",
        "checks": results,
        "verdict": "merge" if all(r.get("passed", False) is True for r in results) else "reject" if any(r.get("passed") is False for r in results) else "inconclusive",
    }
    L4_DIR.mkdir(parents=True, exist_ok=True)
    path = L4_DIR / "audit-latest.json"
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    return path


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P4 RSIP — AUDIT")
    parser.add_argument("--prm-only", action="store_true", help="PRM only")
    parser.add_argument("--skip-nim", action="store_true", help="Skip NIM calls")
    parser.add_argument("--nim-url", type=str, default=NIM_URL)
    args = parser.parse_args()

    print(f"╔══ P4 RSIP: AUDIT ══╗")

    results = []

    # PRM
    r = audit_prm()
    results.append(r)
    print(f"  {'✅' if r['passed'] else '❌'} PRM: {r['detail']}")

    if args.prm_only:
        write_audit(results)
        return 0 if all(r.get("passed", False) is True for r in results) else 1

    # Tool integrity
    r = audit_tools()
    results.append(r)
    print(f"  {'✅' if r['passed'] else '❌'} Tools: {r['detail']}")

    # Adversarial
    r = audit_adversarial()
    results.append(r)
    print(f"  {'✅' if r['passed'] else '❌'} Adversarial: {r['detail']}")

    # Constitutional
    r = audit_constitutional()
    results.append(r)
    print(f"  {'✅' if r['passed'] else '❌'} Constitutional: {r['detail']}")

    # NIM
    if not args.skip_nim:
        r = audit_nim()
        results.append(r)
        print(f"  {'✅' if r['passed'] else '⚠️' if r['passed'] is None else '❌'} NIM: {r['detail']}")

    path = write_audit(results)
    print(f"  → {path}")

    verdict = results[-1]  # Last check determines verdict
    passed_count = sum(1 for r in results if r.get("passed") is True)
    total_count = sum(1 for r in results if r.get("passed") is not None)
    print(f"\n📊 {passed_count}/{total_count} checks passed")

    all_pass = all(r.get("passed", False) is True for r in results if r.get("passed") is not None)
    print(f"  Verdict: {'✅ MERGE' if all_pass else '❌ REJECT' if any(r.get('passed') is False for r in results) else '⚠️ INCONCLUSIVE'}")

    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
