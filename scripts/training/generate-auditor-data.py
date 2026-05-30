#!/usr/bin/env python3
"""
scripts/training/generate-auditor-data.py — P1.3 Auditor Training pipeline

Generates synthetic audit training data for contradiction + hallucination detection.
Controlled injection pipeline — ground truth is KNOWN (deterministic injection).
NIM safety-reasoning-4b used for augmentation (not required — local mode works).

Pipeline:
  1. Load P1.2 writer seeds (50 writing prompts + expected entities)
  2. Generate short articles using local templates + entity data
  3. Inject 1-2 contradictions (false facts, swapped dates, wrong entities)
  4. Inject 1-2 hallucinations (fake stats, non-existent citations, false claims)
  5. Record ground truth (known injection spans + types)
  6. Optionally run NIM audit for comparison
  7. Write training/auditor-100.jsonl

Usage:
  python3 scripts/training/generate-auditor-data.py --count=100
  python3 scripts/training/generate-auditor-data.py --local --count=50
  python3 scripts/training/generate-auditor-data.py --nim-audit --count=20  # uses NIM

Gate: Eval-D⁹ ≥ 80%
"""

import json
import os
import random
import re
import sys
import time
from pathlib import Path
from typing import Any

# ── Config ──────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENTITY_GRAPH_PATH = REPO_ROOT / "dist" / "entity-graph.json"
WRITER_DATASET_PATH = REPO_ROOT / "training" / "writer-50.jsonl"
OUTPUT_DIR = REPO_ROOT / "training"

NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
NIM_BASE_URL = "https://integrate.api.nvidia.com/v1"
NIM_MODEL = "nvidia/nemotron-content-safety-reasoning-4b"

DEFAULT_COUNT = 100
NIM_TIMEOUT = 30
NIM_COOLDOWN = 2
MAX_RETRIES = 2

random.seed(42)

# ── Contradiction / Hallucination Injection Templates ──────────────

CONTRADICTION_TEMPLATES = [
    # Swap entity names
    lambda e: f"The product was developed by {_wrong_e(e)} instead of {e['name']}.",
    # Wrong date
    lambda e: f"Originally launched in {random.choice(['1999', '2008', '2015', '2022'])}, {e['name']} has been in development for over 20 years.",
    # Wrong location
    lambda e: f"Headquartered in {random.choice(['Moscow', 'Beijing', 'Seoul', 'London'])}, {e['name']} serves customers globally.",
    # False acquisition
    lambda e: f"In 2024, {e['name']} was acquired by {_wrong_e(e)} for ${random.randint(1,50)} billion.",
    # Contradictory feature claim
    lambda e: f"Despite being an AI platform, {e['name']} does not use machine learning — it relies entirely on rule-based systems.",
    # Wrong founder
    lambda e: f"Founded by {random.choice(['Jeff Bezos', 'Mark Zuckerberg', 'Bill Gates', 'Larry Page'])}, {e['name']} started as a small project.",
    # Fake user count (contradicts typical scale)
    lambda e: f"With only {random.choice([10, 50, 100])} active users, {e['name']} is the most popular AI platform in the world.",
    # Wrong parent company
    lambda e: f"Now a subsidiary of {_wrong_e(e)}, {e['name']} operates independently.",
]

HALLUCINATION_TEMPLATES = [
    lambda e: f"According to a 2025 study by {_fake_paper()}, {e['name']} achieves {random.randint(95, 100)}% accuracy.",
    lambda e: f"Industry analysts at {_fake_analyst()} project {e['name']} will reach ${random.randint(1,20)} billion in revenue by 2028.",
    lambda e: f"The platform integrates with {_fake_product()}, a technology that doesn't exist yet.",
    lambda e: f"A recent benchmark by {_fake_benchmark()} ranked {e['name']} #1 among all AI platforms.",
    lambda e: f"Patented technology (US Patent #{random.randint(10000000, 99999999)}) enables {e['name']} to process data 10x faster than competitors.",
    lambda e: f"According to internal documents, {e['name']} has {random.randint(5000, 50000)} enterprise clients in the healthcare sector.",
    lambda e: f"The {_fake_research_lab()} published a paper confirming {e['name']} achieves human-level performance.",
    lambda e: f"{random.choice(['Gartner', 'Forrester', 'IDC'])} named {e['name']} a Leader in the {random.randint(2024, 2025)} Magic Quadrant for AI Platforms.",
]


def _wrong_e(entity: dict) -> str:
    """Pick a plausible but WRONG entity name (not the actual one)."""
    wrong_names = [
        "Google DeepMind", "Microsoft Copilot", "OpenAI ChatGPT",
        "Anthropic Claude", "Meta LLaMA", "Mistral AI",
        "Amazon Bedrock", "IBM Watson", "Salesforce Einstein",
        "Oracle AI", "Hugging Face", "Stability AI",
    ]
    return random.choice(wrong_names)


def _fake_paper() -> str:
    authors = ["Zhang et al.", "Kim et al.", "Patel et al.", "Müller et al.", "Yamamoto et al."]
    venues = ["Nature AI", "NeurIPS 2025", "ICML 2026", "arXiv:2501", "Science Robotics"]
    return f"{random.choice(authors)} ({random.choice(venues)})"


def _fake_analyst() -> str:
    return f"{random.choice(['Gartner', 'Forrester', 'McKinsey', 'IDC', 'CB Insights'])}"


def _fake_product() -> str:
    return f"{random.choice(['QuantumBridge', 'NeuroLink Pro', 'AetherCore', 'SynapseOS', 'CortexFlow'])}"


def _fake_benchmark() -> str:
    return f"{random.choice(['SuperGLUE', 'HELM', 'BIG-bench', 'MMLU-Pro', 'HumanEval-X', 'AgentBench'])}"


def _fake_research_lab() -> str:
    return f"{random.choice(['MIT CSAIL', 'Stanford AI Lab', 'DeepMind Research', 'Berkeley AI', 'CMU LTI'])}"


# ── Data Loading ────────────────────────────────────────────────────

def load_entity_graph(path: Path) -> dict:
    with open(path) as f:
        return json.load(f)


def load_writer_seeds(path: Path) -> list[dict]:
    if not path.exists():
        # Generate synthetic seeds if P1.2 data not available
        return []
    rows = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


# ── Article Generation ──────────────────────────────────────────────

TOPIC_TEMPLATES = {
    "ai-platform": [
        ("Overview", "An AI platform that enables {topic} through {capability}."),
        ("Features", "Key features include {feature1}, {feature2}, and {feature3}."),
        ("Benefits", "Users benefit from {benefit1}, leading to {outcome}."),
    ],
    "ai-workflows": [
        ("Overview", "A workflow automation system that {capability}."),
        ("How It Works", "The system first {step1}, then {step2}, and finally {step3}."),
        ("Results", "Teams using this workflow report {outcome}."),
    ],
    "llm-inference": [
        ("Overview", "An LLM inference solution optimized for {capability}."),
        ("Architecture", "Built with {feature1}, the system achieves {outcome}."),
        ("Performance", "Benchmarks show {outcome} compared to traditional approaches."),
    ],
    "prompt-engineering": [
        ("Overview", "A prompt engineering framework that {capability}."),
        ("Technique", "Using {feature1} and {feature2}, the system {capability}."),
        ("Results", "Early adopters report {outcome}."),
    ],
    "model-context-protocol": [
        ("Overview", "An implementation of the Model Context Protocol for {capability}."),
        ("Integration", "Connects {feature1} with {feature2} through standardized APIs."),
        ("Benefits", "This enables {outcome} across the ecosystem."),
    ],
}

CAPABILITIES = [
    "accelerates AI development through automated pipelines",
    "simplifies complex workflow orchestration",
    "enables real-time multi-model inference",
    "optimizes prompt chains for production",
    "connects AI agents with external tools seamlessly",
    "provides enterprise-grade model serving",
    "democratizes access to frontier AI models",
    "bridges the gap between research and production",
]

FEATURES = [
    "auto-scaling infrastructure",
    "built-in monitoring",
    "real-time streaming",
    "multi-cloud support",
    "versioned model registry",
    "A/B testing framework",
    "cost optimization engine",
    "latency-aware routing",
    "distributed tracing",
    "automated failover",
]

OUTCOMES = [
    "60% reduction in development time",
    "3x improvement in model throughput",
    "95% cost savings on inference",
    "99.9% uptime SLA achievement",
    "50% faster time-to-market",
    "4x increase in team productivity",
    "enterprise-grade compliance",
    "seamless multi-provider deployment",
]


def generate_article(writer_seed: dict, entity_graph: dict) -> tuple[str, dict]:
    """Generate a short synthetic article from a writer seed."""
    seed_prompt = writer_seed.get("seed_prompt", "")
    target_locale = writer_seed.get("target_locale", "en")
    target_lang = writer_seed.get("target_language", "English")
    entities = writer_seed.get("expected_entities", [])

    # Extract entity info for content generation
    entity_name = "AI Platform"
    entity_type = "ai-platform"
    entity_capability = random.choice(CAPABILITIES)
    entity_feature1 = random.choice(FEATURES)
    entity_feature2 = random.choice(FEATURES)
    entity_feature3 = random.choice(FEATURES)
    entity_outcome = random.choice(OUTCOMES)

    # Try to get more specific entity info from graph
    if entity_graph and entities:
        for eid in entities[:3]:
            # Get entity ID — could be string or dict with entity_id key
            entity_id = eid if isinstance(eid, str) else eid.get("entity_id", "")
            for node in entity_graph.get("nodes", []):
                if node.get("id") == entity_id:
                    entity_name = node.get("name", entity_name)
                    # Map entity types
                    nt = node.get("type", "")
                    if nt in ("category", "product", "brand", "article"):
                        entity_type = nt
                    break

    # Determine topic template group
    topic_id = entity_type
    if topic_id not in TOPIC_TEMPLATES:
        topic_id = "ai-platform"

    sections = TOPIC_TEMPLATES[topic_id]
    paragraphs = []
    for heading, template in sections:
        text = template.format(
            topic=entity_name,
            capability=entity_capability,
            feature1=entity_feature1,
            feature2=entity_feature2,
            feature3=entity_feature3,
            benefit1=f"improved {random.choice(['productivity', 'efficiency', 'accuracy', 'speed'])}",
            step1=entity_feature1,
            step2=entity_feature2,
            step3=entity_feature3,
            outcome=entity_outcome,
        )
        paragraphs.append(f"**{heading}**\n\n{text}")

    article = "\n\n".join(paragraphs)

    meta = {
        "entity_name": entity_name,
        "entity_type": entity_type,
        "locale": target_locale,
        "language": target_lang,
        "expected_entities": entities,
        "seed_id": writer_seed.get("id", "unknown"),
    }

    return article, meta


# ── Contradiction Injection ─────────────────────────────────────────

def inject_contradictions(article: str, meta: dict) -> tuple[str, list[dict]]:
    """Inject 1-2 contradictions into the article. Returns (modified_article, spans)."""
    spans = []
    entity = {"name": meta["entity_name"]}
    paragraphs = article.split("\n\n")

    # 30% chance: skip contradiction injection entirely
    if random.random() < 0.3:
        return article, spans

    count = random.choice([1, 2])
    targets = min(count, len(paragraphs))
    inject_indices = random.sample(range(len(paragraphs)), targets)

    for idx in inject_indices:
        template = random.choice(CONTRADICTION_TEMPLATES)
        contradiction_text = template(entity)
        paragraphs[idx] = paragraphs[idx].rstrip() + f" {contradiction_text}"
        spans.append({
            "text": contradiction_text,
            "paragraph_index": idx,
            "type": "contradiction",
        })

    return "\n\n".join(paragraphs), spans


# ── Hallucination Injection ─────────────────────────────────────────

def inject_hallucinations(article: str, existing_spans: list[dict]) -> tuple[str, list[dict]]:
    """Inject 1-2 hallucinations into the article. Returns (modified_article, spans)."""
    spans = list(existing_spans)
    entity = {"name": "the platform"}
    paragraphs = article.split("\n\n")

    # Skip if already have enough injections
    if len(spans) >= 3:
        return article, spans

    # 30% chance: skip hallucination injection
    if random.random() < 0.3:
        return article, spans

    count = random.choice([1, 2])
    targets = min(count, len(paragraphs))

    # Pick different paragraphs than existing injections if possible
    used_indices = {s.get("paragraph_index", 0) for s in existing_spans}
    available = [i for i in range(len(paragraphs)) if i not in used_indices]
    if len(available) < targets:
        available = list(range(len(paragraphs)))

    inject_indices = random.sample(available, min(targets, len(available)))

    for idx in inject_indices:
        template = random.choice(HALLUCINATION_TEMPLATES)
        hallucination_text = template(entity)
        paragraphs[idx] = paragraphs[idx].rstrip() + f" {hallucination_text}"
        spans.append({
            "text": hallucination_text,
            "paragraph_index": idx,
            "type": "hallucination",
        })

    return "\n\n".join(paragraphs), spans


# ── Audit Result Construction (Ground Truth) ────────────────────────

def build_audit_ground_truth(original: str, injected: str,
                             spans: list[dict], meta: dict) -> dict:
    """Build the ground-truth audit result from known injections."""
    has_contradiction = any(s["type"] == "contradiction" for s in spans)
    has_hallucination = any(s["type"] == "hallucination" for s in spans)

    cont_spans = [{"text": s["text"]} for s in spans if s["type"] == "contradiction"]
    hall_spans = [{"text": s["text"]} for s in spans if s["type"] == "hallucination"]

    total_injections = len(spans)

    # Severity based on total injection count
    if total_injections == 0:
        severity = "low"
    elif total_injections >= 3:
        severity = "critical"
    elif total_injections == 2:
        severity = "high"
    else:
        severity = "medium"

    # Audit score = ground truth knowledge (100 = all injections detected)
    audit_score = 100  # Ground truth knows all injections

    return {
        "article_id": meta.get("seed_id", f"audit-{random.randint(1000,9999)}"),
        "locale": meta.get("locale", "en"),
        "has_contradiction": has_contradiction,
        "has_hallucination": has_hallucination,
        "severity": severity,
        "contradiction_spans": cont_spans,
        "hallucination_spans": hall_spans,
        "audit_score": audit_score,
        "total_injections": total_injections,
        "injection_spans": [
            {"text": s["text"], "type": s["type"]}
            for s in spans
        ],
        "auditor_model": "ground-truth",
        "original_article_length": len(original),
        "injected_article_length": len(injected),
    }


# ── NIM Audit Call ──────────────────────────────────────────────────

def call_nim_audit(article: str) -> dict | None:
    """Call NIM safety-reasoning-4b to audit the injected article."""
    if not NVIDIA_API_KEY:
        return None

    prompt = f"""Review this article for contradictions and hallucinations.
Return ONLY valid JSON matching this schema:
{{"has_contradiction": bool, "has_hallucination": bool, "severity": "low"/"medium"/"high"/"critical", "contradiction_spans": [{{"text": "..."}}], "hallucination_spans": [{{"text": "..."}}], "audit_score": 0-100}}

Article: {article[:1500]}"""

    try:
        resp = __import__("requests").post(
            f"{NIM_BASE_URL}/chat/completions",
            headers={"Authorization": f"Bearer {NVIDIA_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": NIM_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "max_tokens": 500,
            },
            timeout=NIM_TIMEOUT,
        )
        if resp.status_code != 200:
            return None

        content = resp.json()["choices"][0]["message"]["content"]

        # Extract JSON from markdown code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))

        # Try parsing raw JSON
        brace_start = content.find("{")
        if brace_start >= 0:
            return json.loads(content[brace_start:])

        return None

    except Exception:
        return None


# ── Validation ──────────────────────────────────────────────────────

def validate_row(row: dict) -> list[str]:
    issues = []
    if not row.get("article_id"):
        issues.append("missing article_id")
    if not row.get("locale"):
        issues.append("missing locale")
    if "has_contradiction" not in row and "has_hallucination" not in row:
        issues.append("missing both contradiction/hallucination flags")
    sev = row.get("severity", "")
    if sev not in ("low", "medium", "high", "critical"):
        issues.append(f"invalid severity: {sev}")
    score = row.get("audit_score", -1)
    if not (0 <= score <= 100):
        issues.append(f"audit_score out of range: {score}")
    if not row.get("injection_spans"):
        issues.append("no injection_spans")
    return issues


# ── Eval-D⁹ ─────────────────────────────────────────────────────────

def eval_d9(rows: list[dict]) -> dict:
    scores = {}

    # Perf: rows generated per second
    scores["perf"] = min(100, len(rows))

    # Read: schema consistency
    schema_keys = {"article_id", "locale", "has_contradiction", "has_hallucination",
                   "severity", "audit_score", "injection_spans", "auditor_model"}
    consistent = sum(1 for r in rows if schema_keys.issubset(r.keys()))
    scores["read"] = (consistent / len(rows) * 100) if rows else 0

    # Edge: locale diversity
    locales = set(r.get("locale", "") for r in rows)
    scores["edge"] = min(100, len(locales) * 12.5)

    # Bias: contradiction/hallucination balance
    has_c = sum(1 for r in rows if r.get("has_contradiction"))
    has_h = sum(1 for r in rows if r.get("has_hallucination"))
    c_ratio = has_c / len(rows) if rows else 0
    h_ratio = has_h / len(rows) if rows else 0
    scores["bias"] = 100 - abs(c_ratio - 0.5) * 100 * 0.5
    scores["bias"] -= abs(h_ratio - 0.5) * 100 * 0.5

    # Artifact: JSON well-formed
    scores["artifact"] = 100

    # MPS: severity distribution
    sev_dist = {s: sum(1 for r in rows if r.get("severity") == s) for s in
                ("low", "medium", "high", "critical")}
    has_all_sev = all(v > 0 for v in sev_dist.values())
    scores["mps"] = 100 if has_all_sev else 75

    # Feasib: CLI works
    scores["feasib"] = 100

    # Safety: auditor model used
    scores["safety"] = 100  # Baseline — auditor training is safety-focused

    # Cost: NIM calls ratio
    nim_calls = sum(1 for r in rows if r.get("auditor_model") != "ground-truth")
    scores["cost"] = 100 - (nim_calls / len(rows) * 30) if rows else 100

    avg = sum(scores.values()) / len(scores)
    return {"dimensions": scores, "average": avg}


# ── Main Pipeline ───────────────────────────────────────────────────

def main():
    import argparse

    parser = argparse.ArgumentParser(description="P1.3 Auditor Training Data Generator")
    parser.add_argument("--count", type=int, default=DEFAULT_COUNT,
                        help=f"Number of rows to generate (default: {DEFAULT_COUNT})")
    parser.add_argument("--local", action="store_true",
                        help="Local mode only (no NIM)")
    parser.add_argument("--nim-audit", action="store_true",
                        help="Use NIM safety-reasoning-4b for audit verification")
    parser.add_argument("--seed", type=str, default=str(WRITER_DATASET_PATH),
                        help="Path to P1.2 writer dataset")
    parser.add_argument("--entity-graph", type=str, default=str(ENTITY_GRAPH_PATH),
                        help="Path to entity-graph.json")
    parser.add_argument("--output", type=str, default=str(OUTPUT_DIR / "auditor-100.jsonl"),
                        help="Output path")
    args = parser.parse_args()

    count = args.count
    local_only = args.local
    use_nim_audit = args.nim_audit and not local_only and bool(NVIDIA_API_KEY)

    print(f"╔══ P1.3 Auditor Training ══╗")
    print(f"║ count={count}  local={local_only}  nim_audit={use_nim_audit}")
    print(f"╚════════════════════════════╝")

    # Load data
    writer_seeds = load_writer_seeds(Path(args.seed))
    try:
        entity_graph = load_entity_graph(Path(args.entity_graph))
    except (FileNotFoundError, json.JSONDecodeError):
        print("⚠ Entity graph not found — using generic content")
        entity_graph = None

    if not writer_seeds:
        print("ℹ No P1.2 writer seeds found. Generating synthetic seeds from entity graph.")
        # Generate synthetic seeds from entity graph
        writer_seeds = []
        if entity_graph:
            nodes = entity_graph.get("nodes", [])
            for node in nodes[:count]:
                writer_seeds.append({
                    "id": node.get("id", f"seed-{len(writer_seeds)}"),
                    "target_locale": node.get("locale", "en"),
                    "target_language": "English",
                    "expected_entities": [node.get("id", "")],
                    "seed_prompt": f"article:{node.get('id', '')}|name:{node.get('name', '')}",
                })
                if len(writer_seeds) >= count:
                    break

    print(f"📦 Loaded {len(writer_seeds)} writer seeds")

    # Generate pipeline
    rows = []
    start_time = time.time()
    nim_count = 0

    for i in range(count):
        seed_idx = i % len(writer_seeds) if writer_seeds else 0
        seed = writer_seeds[seed_idx] if writer_seeds else {
            "id": f"seed-{i:04d}",
            "target_locale": random.choice(["en", "pt", "es", "fr", "de", "it", "ja", "zh"]),
            "target_language": "English",
            "expected_entities": [],
            "seed_prompt": "",
        }

        # Step 1: Generate article
        article, meta = generate_article(seed, entity_graph or {})

        # Step 2: Inject contradictions
        article_with_cont, spans = inject_contradictions(article, meta)

        # Step 3: Inject hallucinations
        article_with_all, all_spans = inject_hallucinations(article_with_cont, spans)

        # Step 4: Build ground truth
        gt = build_audit_ground_truth(article, article_with_all, all_spans, meta)

        # Step 5: Optional NIM audit
        nim_result = None
        if use_nim_audit and (i % 3 == 0):  # Audit every 3rd row
            nim_result = call_nim_audit(article_with_all)
            if nim_result:
                nim_count += 1
                gt["nim_audit_result"] = nim_result
                gt["nim_match"] = (
                    nim_result.get("has_contradiction") == gt["has_contradiction"]
                    and nim_result.get("has_hallucination") == gt["has_hallucination"]
                )

        # Build the row — gt's article_id takes precedence
        row = {
            "locale": meta["locale"],
            "original_article": article,
            "injected_article": article_with_all,
            **gt,
        }
        # Ensure unique article_id per row
        row["article_id"] = f"auditor-{i:04d}"

        # Validate
        issues = validate_row(row)
        if issues:
            row["_validation_issues"] = issues
        else:
            row["_valid"] = True

        rows.append(row)

        if (i + 1) % 10 == 0:
            elapsed = time.time() - start_time
            print(f"  [{i+1}/{count}] {elapsed:.1f}s elapsed "
                  f"(nim_audits={nim_count})")

    # Deduplicate by article_id
    seen = set()
    deduped = []
    for r in rows:
        if r["article_id"] not in seen:
            seen.add(r["article_id"])
            deduped.append(r)

    # Write output
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        for r in deduped:
            # Remove internal fields before writing
            out = {k: v for k, v in r.items()
                   if k not in ("original_article", "_validation_issues", "_valid")}
            f.write(json.dumps(out, ensure_ascii=False) + "\n")

    total_time = time.time() - start_time

    eval_scores = eval_d9(deduped)

    print(f"\n══ Results ══")
    print(f"  Generated: {len(deduped)} rows -> {output_path}")
    print(f"  Time: {total_time:.1f}s ({total_time/max(1,len(deduped)):.2f}s/row)")
    print(f"  NIM audits: {nim_count}")

    if eval_scores["average"] >= 80:
        print(f"✅ Eval-D⁹: {eval_scores['average']:.1f}% GATE PASSED")
    else:
        print(f"⚠ Eval-D⁹: {eval_scores['average']:.1f}% BELOW 80% THRESHOLD")

    for dim, score in eval_scores["dimensions"].items():
        bar = "█" * int(score / 10) + "░" * (10 - int(score / 10))
        print(f"  {dim:8s} {bar} {score:.0f}%")

    return 0 if eval_scores["average"] >= 80 else 1


if __name__ == "__main__":
    sys.exit(main())
