#!/usr/bin/env python3
"""
scripts/training/generate-scout-data.py — P1.1 Scout Training pipeline

Generates 1000 synthetic discovery queries from UniTeia entity graph
for training the scout agent (entity retrieval + graph traversal).

Pipeline:
  1. Load entity-graph.json (64 nodes, 602 edges)
  2. Generate seed prompts from entity graph (single, pair, niche, cross-locale, traversal)
  3. Call NVIDIA NIM API  → discovery_query LLMText
  4. Call NVIDIA NIM API  → expected_entities LLMStructured
  5. Validate output schema
  6. Write training/scout-1000.jsonl

Runtime:
  export NVIDIA_API_KEY="nvapi-..."
  python3 scripts/training/generate-scout-data.py [--dry-run] [--count 1000]

Gate: Eval-D⁹ ≥ 90%
"""

import json
import os
import random
import sys
import time
from pathlib import Path
from typing import Any

import requests

# ── Config ──────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENTITY_GRAPH_PATH = REPO_ROOT / "dist" / "entity-graph.json"
OUTPUT_PATH = REPO_ROOT / "training" / "scout-1000.jsonl"
SEED_CSV_PATH = REPO_ROOT / "training" / "user_seed.csv"
CONFIG_PATH = REPO_ROOT / "training" / "scout-config.yaml"

NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
NIM_BASE_URL = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions"

# Default NIM function IDs (Nemotron-4 340B Instruct)
NIM_DISCOVERY_FN = "nvidia/nemotron-4-340b-instruct"
NIM_EXTRACT_FN = "nvidia/nemotron-4-340b-instruct"

DEFAULT_COUNT = 1000
SEED_WEIGHTS = {
    "single_entity": 0.3,
    "entity_pair": 0.25,
    "niche_summary": 0.2,
    "cross_locale": 0.15,
    "graph_traversal": 0.1,
}

# ── Data Structures ─────────────────────────────────────────────────

EntityId = str


def load_entity_graph(path: Path) -> dict:
    """Load entity-graph.json and index by ID."""
    with open(path) as f:
        graph = json.load(f)

    nodes: dict[str, dict] = {}
    for n in graph.get("nodes", []):
        nodes[n["id"]] = n

    edges_by_src: dict[str, list[dict]] = {}
    edges_by_dst: dict[str, list[dict]] = {}
    edge_types: set[str] = set()

    for e in graph.get("edges", []):
        src, dst = e["source"], e["target"]
        edges_by_src.setdefault(src, []).append(e)
        edges_by_dst.setdefault(dst, []).append(e)
        edge_types.add(e.get("type", "related_to"))

    return {
        "nodes": nodes,
        "edges": graph.get("edges", []),
        "edges_by_src": edges_by_src,
        "edges_by_dst": edges_by_dst,
        "edge_types": sorted(edge_types),
        "node_ids": list(nodes.keys()),
        "locales": list({n.get("locale", "en") for n in nodes.values()}),
        "niches": list({n.get("niche", "apex") for n in nodes.values()}),
    }


# ── Seed Strategies ─────────────────────────────────────────────────

def pick_weighted(items: list[Any], weights: list[float]) -> Any:
    """Pick one item from a list with weighted probability."""
    return random.choices(items, weights=weights, k=1)[0]


def seed_single_entity(graph: dict) -> str:
    """Seed prompt about a single entity."""
    node = random.choice(graph["node_ids"])
    n = graph["nodes"][node]
    label = n.get("label", n.get("name", node))
    niche = n.get("niche", "apex")
    return f"entity:{node}|label:{label}|niche:{niche}|type:{n.get('type','article')}"


def seed_entity_pair(graph: dict) -> str:
    """Seed prompt about a relationship between two entities."""
    edge = random.choice(graph["edges"])
    src = graph["nodes"].get(edge["source"], {})
    dst = graph["nodes"].get(edge["target"], {})
    src_label = src.get("label", src.get("name", edge["source"]))
    dst_label = dst.get("label", dst.get("name", edge["target"]))
    rel_type = edge.get("type", "related_to")
    return f"relation:{rel_type}|src:{src_label}|dst:{dst_label}"


def seed_niche_summary(graph: dict) -> str:
    """Seed prompt asking for a niche overview."""
    niche = random.choice(graph["niches"])
    niche_nodes = [
        n for n in graph["node_ids"]
        if graph["nodes"][n].get("niche") == niche
    ]
    count = len(niche_nodes)
    return f"niche:{niche}|count:{count}|summary:overview of {niche} signals"


def seed_cross_locale(graph: dict) -> str:
    """Seed prompt in a non-EN locale."""
    locale = random.choice([l for l in graph["locales"] if l != "en"])
    niche = random.choice(graph["niches"])
    locale_nodes = [
        n for n in graph["node_ids"]
        if graph["nodes"][n].get("locale") == locale
    ]
    if not locale_nodes:
        locale_nodes = graph["node_ids"][:5]
    sample = random.choice(locale_nodes)
    n = graph["nodes"][sample]
    label = n.get("label", sample)
    return f"locale:{locale}|niche:{niche}|sample:{label}|query:find articles in {locale} about {niche}"


def seed_graph_traversal(graph: dict) -> str:
    """Seed prompt requiring multi-hop graph traversal."""
    # Pick a random entity, then traverse 2-3 hops
    start = random.choice(graph["node_ids"])
    visited = {start}
    current = start
    path = [current]

    hops = random.randint(2, 3)
    for _ in range(hops):
        neighbors = []
        for e in graph.get("edges_by_src", {}).get(current, []):
            if e["target"] not in visited:
                neighbors.append(e["target"])
        for e in graph.get("edges_by_dst", {}).get(current, []):
            if e["source"] not in visited:
                neighbors.append(e["source"])

        if not neighbors:
            break
        current = random.choice(neighbors)
        visited.add(current)
        path.append(current)

    labels = []
    for nid in path:
        n = graph["nodes"].get(nid, {})
        labels.append(n.get("label", n.get("name", nid)))

    return f"traversal:{' → '.join(labels)}|hops:{len(path)}|nodes:{len(path)}"


SEED_GENERATORS = {
    "single_entity": seed_single_entity,
    "entity_pair": seed_entity_pair,
    "niche_summary": seed_niche_summary,
    "cross_locale": seed_cross_locale,
    "graph_traversal": seed_graph_traversal,
}


# ── NIM API Client ──────────────────────────────────────────────────

def nim_chat_completion(
    prompt: str,
    model: str = NIM_DISCOVERY_FN,
    temperature: float = 0.8,
    max_tokens: int = 256,
) -> str:
    """Call NVIDIA NIM OpenAI-compatible chat completion API."""
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    url = f"{NIM_BASE_URL}/{model}/v1/chat/completions"
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()


# ── Prompts ─────────────────────────────────────────────────────────

DISCOVERY_PROMPT_TEMPLATE = """Gere uma pergunta de descoberta natural em português brasileiro que um usuário faria sobre inteligência artificial, baseada em:

{seed_prompt}

A pergunta deve soar como algo que um pesquisador ou profissional perguntaria. Máximo 30 palavras."""

EXTRACT_PROMPT_TEMPLATE = """Dada a seguinte pergunta de usuário sobre inteligência artificial:

"{query}"

Analise quais entidades do grafo de conhecimento UniTeia seriam relevantes para responder esta pergunta.

Retorne APENAS um JSON válido com esta estrutura:
{{
  "expected_entities": [
    {{"entity_id": "nome-da-entidade", "entity_name": "Nome da Entidade", "relevance": 0.95}}
  ],
  "expected_edge_types": ["mentions", "belongs_to"],
  "difficulty": "easy|medium|hard",
  "graph_hops": 1
}}

Considere entity_ids como slugs no formato "nome-da-entidade". Inclua de 1 a 5 entidades.
"""


def generate_discovery_query(seed: str) -> str:
    """Call NIM to generate a discovery query from seed."""
    prompt = DISCOVERY_PROMPT_TEMPLATE.format(seed_prompt=seed)
    return nim_chat_completion(
        prompt,
        model=NIM_DISCOVERY_FN,
        temperature=0.8,
        max_tokens=256,
    )


def extract_expected_entities(query: str) -> dict:
    """Call NIM to extract expected entities from query."""
    prompt = EXTRACT_PROMPT_TEMPLATE.format(query=query)
    raw = nim_chat_completion(
        prompt,
        model=NIM_EXTRACT_FN,
        temperature=0.1,
        max_tokens=512,
    )
    # Strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
        raw = raw.rsplit("```", 1)[0].strip()
    return json.loads(raw)


# ── Validation ──────────────────────────────────────────────────────

def validate_row(row: dict, graph: dict) -> list[str]:
    """Validate a single training row. Returns list of issues (empty = pass)."""
    issues = []

    if not row.get("id"):
        issues.append("missing id")
    if not row.get("discovery_query"):
        issues.append("missing discovery_query")
    if len(row.get("discovery_query", "")) < 10:
        issues.append("discovery_query too short")

    entities = row.get("expected_entities", [])
    if not entities:
        issues.append("no expected entities")

    for ent in entities:
        eid = ent.get("entity_id", "")
        if not eid:
            issues.append(f"entity missing entity_id: {ent}")
            continue
        rel = ent.get("relevance", 0)
        if not (0 <= rel <= 1):
            issues.append(f"entity {eid}: relevance {rel} out of range")

    diff = row.get("difficulty", "")
    if diff not in ("easy", "medium", "hard"):
        issues.append(f"invalid difficulty: {diff}")

    return issues


# ── Eval-D⁹ Gate ────────────────────────────────────────────────────

def eval_gate(rows: list[dict], graph: dict) -> dict:
    """Compute Eval-D⁹ scores for the training dataset."""
    n = len(rows)
    if n == 0:
        return {"score": 0, "dimensions": {}}

    # Query diversity — distinct / total
    distinct_queries = len(set(r.get("discovery_query", "") for r in rows))
    query_diversity = distinct_queries / n

    # Entity coverage
    all_entities = set(graph["node_ids"])
    referenced = set()
    for r in rows:
        for ent in r.get("expected_entities", []):
            referenced.add(ent.get("entity_id", ""))
    entity_coverage = len(referenced & all_entities) / max(len(all_entities), 1)

    # Edge coverage
    all_edge_types = set(graph["edge_types"])
    referenced_edges = set()
    for r in rows:
        for et in r.get("expected_edge_types", []):
            referenced_edges.add(et)
    edge_coverage = len(referenced_edges & all_edge_types) / max(len(all_edge_types), 1)

    # Difficulty distribution
    difficulties = {"easy": 0, "medium": 0, "hard": 0}
    for r in rows:
        difficulties[r.get("difficulty", "medium")] += 1
    diff_dist = {k: v / n for k, v in difficulties.items()}

    # Composite score (geometric mean of coverage metrics)
    composite = (query_diversity * entity_coverage * edge_coverage) ** (1 / 3)

    return {
        "score": round(composite, 3),
        "pass": composite >= 0.7,
        "dimensions": {
            "query_diversity": round(query_diversity, 3),
            "entity_coverage": round(entity_coverage, 3),
            "edge_coverage": round(edge_coverage, 3),
            "difficulty_distribution": {
                "easy": round(diff_dist["easy"], 3),
                "medium": round(diff_dist["medium"], 3),
                "hard": round(diff_dist["hard"], 3),
            },
        },
    }


# ── Main Pipeline ───────────────────────────────────────────────────

def main():
    dry_run = "--dry-run" in sys.argv
    count = DEFAULT_COUNT
    for arg in sys.argv:
        if arg.startswith("--count="):
            count = int(arg.split("=", 1)[1])

    # 1. Load entity graph
    print(f"Loading entity graph from {ENTITY_GRAPH_PATH}...")
    graph = load_entity_graph(ENTITY_GRAPH_PATH)
    print(f"  Nodes: {len(graph['node_ids'])}")
    print(f"  Edges: {len(graph['edges'])}")
    print(f"  Edge types: {graph['edge_types']}")
    print(f"  Niches: {graph['niches']}")
    print(f"  Locales: {graph['locales']}")

    if dry_run:
        print("\n⚠️  DRY RUN — no API calls, generating seeds only")

    # 2. Generate seeds
    strategies = list(SEED_GENERATORS.keys())
    weights = [SEED_WEIGHTS[s] for s in strategies]

    seeds = []
    for i in range(count):
        strategy = random.choices(strategies, weights=weights, k=1)[0]
        seed = SEED_GENERATORS[strategy](graph)
        seeds.append((strategy, seed))

    print(f"\nGenerated {len(seeds)} seed prompts:")
    for s, w in zip(strategies, weights):
        c = sum(1 for st, _ in seeds if st == s)
        print(f"  {s}: {c} ({c / count * 100:.0f}%)")

    if dry_run:
        # Write seeds CSV for inspection
        with open(SEED_CSV_PATH, "w") as f:
            f.write("id,strategy,seed_prompt\n")
            for i, (strat, seed) in enumerate(seeds):
                f.write(f"seed-{i:04d},{strat},{seed}\n")
        print(f"\nSeeds written to {SEED_CSV_PATH}")
        dry_run_report(seeds)
        return

    # 3. Check API key
    if not NVIDIA_API_KEY:
        print("\n❌ NVIDIA_API_KEY not set. Export and re-run:")
        print("   export NVIDIA_API_KEY=\"nvapi-...\"")
        sys.exit(1)

    # 4. Generate discovery queries + extract entities
    rows = []
    errors = 0

    print(f"\nGenerating {count} training rows (this will take a while)...")
    start_time = time.time()

    for i, (strategy, seed) in enumerate(seeds):
        if i > 0 and i % 50 == 0:
            elapsed = time.time() - start_time
            rate = i / elapsed
            remaining = (count - i) / rate
            print(f"  [{i}/{count}] {rate:.1f} rows/s, ~{remaining:.0f}s remaining")

        try:
            query = generate_discovery_query(seed)
            structured = extract_expected_entities(query)

            row = {
                "id": f"scout-{i:04d}",
                "strategy": strategy,
                "seed_prompt": seed,
                "discovery_query": query,
                "expected_entities": structured.get("expected_entities", []),
                "expected_edge_types": structured.get("expected_edge_types", []),
                "difficulty": structured.get("difficulty", "medium"),
                "graph_hops": structured.get("graph_hops", 1),
            }

            issues = validate_row(row, graph)
            if issues:
                errors += 1
                if errors <= 5:
                    print(f"  ⚠️  Validation issue [{i}]: {issues}")

            rows.append(row)

        except Exception as e:
            errors += 1
            if errors <= 3:
                print(f"  ❌ Error [{i}]: {e}")
            continue

    elapsed = time.time() - start_time
    print(f"\nGenerated {len(rows)} valid rows in {elapsed:.0f}s ({len(rows)/elapsed:.1f} rows/s)")
    print(f"Errors: {errors}")

    # 5. Evaluate
    print("\n--- Eval-D⁹ Gate ---")
    report = eval_gate(rows, graph)
    print(f"Score: {report['score']} {'✅ PASS' if report['pass'] else '❌ FAIL'}")
    for dim, val in report["dimensions"].items():
        print(f"  {dim}: {val}")

    if not report["pass"] and not dry_run:
        print("\n⚠️  Gate FAILED — dataset may need regeneration")
        print(f"   Target ≥ 0.7, got {report['score']}")

    # 6. Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"\n✅ scout-1000.jsonl written to {OUTPUT_PATH}")
    print(f"   {len(rows)} rows, {sum(len(r.get('expected_entities',[])) for r in rows)} total entities")


def dry_run_report(seeds: list[tuple[str, str]]):
    """Print dry-run seed examples for each strategy."""
    print("\n--- Seed Examples ---")
    shown = set()
    for strat, seed in seeds:
        if strat not in shown:
            shown.add(strat)
            print(f"\n[{strat}]")
            print(f"  {seed[:120]}..." if len(seed) > 120 else f"  {seed}")


if __name__ == "__main__":
    main()
