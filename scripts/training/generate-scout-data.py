#!/usr/bin/env python3
"""
scripts/training/generate-scout-data.py — P1.1 Scout Training pipeline v2

Generates synthetic discovery queries from UniTeia entity graph
for training the scout agent (entity retrieval + graph traversal).

Pipeline:
  1. Load entity-graph.json (64 nodes, 602 edges)
  2. Generate seed prompts from entity graph (5 strategies, weighted)
  3. Call NVIDIA NIM API → discovery_query LLMText
  4. Extract expected entities:
     - Primary: NIM LLMStructured (if API available)
     - Fallback: local entity graph matching (deterministic, zero API cost)
  5. Validate output schema
  6. Write training/scout-N.jsonl

Usage:
  export NVIDIA_API_KEY="nvapi-..."
  python3 scripts/training/generate-scout-data.py --count=10    # small batch
  python3 scripts/training/generate-scout-data.py --count=1000  # full
  python3 scripts/training/generate-scout-data.py --local       # offline mode

Gate: Eval-D⁹ ≥ 70%
"""

import json
import os
import random
import re
import sys
import time
from pathlib import Path
from typing import Any

import requests

# ── Config ──────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENTITY_GRAPH_PATH = REPO_ROOT / "dist" / "entity-graph.json"
OUTPUT_DIR = REPO_ROOT / "training"

NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "")
NIM_BASE_URL = "https://integrate.api.nvidia.com/v1"
NIM_MODEL = "nvidia/llama-3.1-nemotron-nano-8b-v1"

DEFAULT_COUNT = 1000
NIM_TIMEOUT = 60     # seconds per call
NIM_COOLDOWN = 3     # seconds between calls (free tier rate limit)
MAX_RETRIES = 2

SEED_WEIGHTS = {
    "single_entity": 0.40,
    "entity_pair": 0.30,
    "cross_locale": 0.15,
    "graph_traversal": 0.15,
}


# ── Graph Loading ───────────────────────────────────────────────────

def load_entity_graph(path: Path) -> dict:
    """Load entity-graph.json and index."""
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

    # Build text index for local entity matching
    text_index: list[dict] = []
    for nid, n in nodes.items():
        label = n.get("label", n.get("name", nid))
        desc = n.get("description", "")
        niche = n.get("niche", "")
        locale = n.get("locale", "en")
        text_index.append({
            "id": nid,
            "label": label,
            "text": f"{label} {desc} {niche}".lower(),
            "niche": niche,
            "locale": locale,
        })

    return {
        "nodes": nodes,
        "edges": graph.get("edges", []),
        "edges_by_src": edges_by_src,
        "edges_by_dst": edges_by_dst,
        "edge_types": sorted(edge_types),
        "node_ids": list(nodes.keys()),
        "locales": list({n.get("locale", "en") for n in nodes.values()}),
        "niches": list({n.get("niche", "apex") for n in nodes.values()}),
        "text_index": text_index,
    }


# ── Seed Generation ─────────────────────────────────────────────────

def pick_weighted(items: list[Any], weights: list[float]) -> Any:
    return random.choices(items, weights=weights, k=1)[0]


def seed_single_entity(graph: dict) -> str:
    node = random.choice(graph["node_ids"])
    n = graph["nodes"][node]
    label = n.get("label", n.get("name", node))
    niche = n.get("niche", "apex")
    return f"entity:{node}|label:{label}|niche:{niche}|type:{n.get('type','article')}"


def seed_entity_pair(graph: dict) -> str:
    edge = random.choice(graph["edges"])
    src = graph["nodes"].get(edge["source"], {})
    dst = graph["nodes"].get(edge["target"], {})
    src_label = src.get("label", src.get("name", edge["source"]))
    dst_label = dst.get("label", dst.get("name", edge["target"]))
    rel_type = edge.get("type", "related_to")
    return f"relation:{rel_type}|src:{src_label}|dst:{dst_label}"


def seed_niche_summary(graph: dict) -> str:
    niche = random.choice(graph["niches"])
    niche_nodes = [n for n in graph["node_ids"] if graph["nodes"][n].get("niche") == niche]
    return f"niche:{niche}|count:{len(niche_nodes)}|summary:overview of {niche} signals"


def seed_cross_locale(graph: dict) -> str:
    locale = random.choice([l for l in graph["locales"] if l != "en"])
    niche = random.choice(graph["niches"])
    locale_nodes = [n for n in graph["node_ids"] if graph["nodes"][n].get("locale") == locale]
    if not locale_nodes:
        locale_nodes = graph["node_ids"][:5]
    sample = random.choice(locale_nodes)
    n = graph["nodes"][sample]
    label = n.get("label", sample)
    return f"locale:{locale}|niche:{niche}|sample:{label}|query:find articles in {locale} about {niche}"


def seed_graph_traversal(graph: dict) -> str:
    start = random.choice(graph["node_ids"])
    visited = {start}
    current = start
    path = [current]
    hops = random.randint(2, 3)
    for _ in range(hops):
        neighbors = []
        neighbors += [e["target"] for e in graph.get("edges_by_src", {}).get(current, []) if e["target"] not in visited]
        neighbors += [e["source"] for e in graph.get("edges_by_dst", {}).get(current, []) if e["source"] not in visited]
        if not neighbors:
            break
        current = random.choice(neighbors)
        visited.add(current)
        path.append(current)
    labels = [graph["nodes"].get(nid, {}).get("label", nid) for nid in path]
    return f"traversal:{' → '.join(labels)}|hops:{len(path)}"


SEED_GENERATORS = {
    "single_entity": seed_single_entity,
    "entity_pair": seed_entity_pair,
    "cross_locale": seed_cross_locale,
    "graph_traversal": seed_graph_traversal,
}


# ── Local Entity Matching (Fallback) ────────────────────────────────

def local_entity_match(query: str, seed: str, graph: dict) -> dict:
    """Extract entities using seed parsing + text index fallback."""
    # Strategy 1: Parse entity IDs directly from seed
    entity_ids = set()
    niche = None
    locale = None

    for part in seed.split("|"):
        if part.startswith("entity:") or part.startswith("sample:"):
            eid = part.split(":", 1)[-1].strip()
            if eid and eid in graph["nodes"]:
                entity_ids.add(eid)
        elif part.startswith("src:"):
            # entity_pair / graph_traversal: src might be a label, try reverse lookup
            label = part.split(":", 1)[-1].strip()
            # Try as entity ID first
            if label in graph["nodes"]:
                entity_ids.add(label)
            else:
                for nid, n in graph["nodes"].items():
                    if n.get("name") == label:
                        entity_ids.add(nid)
        elif part.startswith("dst:"):
            label = part.split(":", 1)[-1].strip()
            if label in graph["nodes"]:
                entity_ids.add(label)
            else:
                for nid, n in graph["nodes"].items():
                    if n.get("name") == label:
                        entity_ids.add(nid)
        elif part.startswith("niche:"):
            niche = part.split(":", 1)[-1].strip()
        elif part.startswith("locale:"):
            locale = part.split(":", 1)[-1].strip()

    # Strategy 2: Add niche-related entities
    if niche:
        for nid, n in graph["nodes"].items():
            if n.get("niche") == niche:
                entity_ids.add(nid)
                if len(entity_ids) >= 10:
                    break

    # Strategy 3: Add locale-related entities
    if locale:
        for nid, n in graph["nodes"].items():
            if n.get("locale") == locale:
                entity_ids.add(nid)
                if len(entity_ids) >= 10:
                    break

    # Entity pair: also resolve by traversing edges
    for part in seed.split("|"):
        if part.startswith("traversal:"):
            labels_str = part.split(":", 1)[-1]
            # Remove trailing arrow and metadata
            labels_str = re.sub(r'\s*→\s*$', '', labels_str)
            labels_str = re.sub(r'\|.*$', '', labels_str)
            labels = [l.strip() for l in labels_str.split("→") if l.strip()]
            for lbl in labels:
                # Try as entity ID first
                if lbl in graph["nodes"]:
                    entity_ids.add(lbl)
                    continue
                # Fallback: reverse lookup by name
                for nid, n in graph["nodes"].items():
                    if n.get("name") == lbl:
                        entity_ids.add(nid)

    # Remove non-existent IDs
    entity_ids = {eid for eid in entity_ids if eid in graph["nodes"]}
    entities = []
    for eid in list(entity_ids)[:5]:
        n = graph["nodes"][eid]
        entities.append({
            "entity_id": eid,
            "entity_name": n.get("label", n.get("name", eid)),
            "relevance": round(1.0 - (list(entity_ids).index(eid) / max(len(entity_ids), 1) * 0.3), 3),
        })

    difficulty = "easy"
    if len(entities) >= 3:
        difficulty = "medium"
    if len(entities) >= 5:
        difficulty = "hard"

    return {
        "expected_entities": entities,
        "expected_edge_types": ["related_to"],
        "difficulty": difficulty,
        "graph_hops": min(len(entities), 3) if entities else 1,
    }


# ── NIM API ─────────────────────────────────────────────────────────

def nim_chat(prompt: str, temperature: float = 0.8, max_tokens: int = 256) -> str | None:
    """Call NVIDIA NIM. Returns None on timeout/error."""
    if not NVIDIA_API_KEY:
        return None
    headers = {"Authorization": f"Bearer {NVIDIA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": NIM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    url = f"{NIM_BASE_URL}/chat/completions"

    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=NIM_TIMEOUT)
            if resp.status_code in (408, 429, 502, 503):
                time.sleep(NIM_COOLDOWN * 2)
                continue
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
        except (requests.Timeout, requests.ConnectionError, requests.HTTPError):
            if attempt < MAX_RETRIES - 1:
                time.sleep(NIM_COOLDOWN * 2)
                continue
            return None
    return None


DISCOVERY_TEMPLATE = "Gere uma pergunta de descoberta natural em português brasileiro que um pesquisador faria sobre IA, baseada em: {seed}. Máximo 20 palavras."


# ── Validation ──────────────────────────────────────────────────────

def validate_row(row: dict) -> list[str]:
    issues = []
    if not row.get("discovery_query") or len(row["discovery_query"]) < 5:
        issues.append("missing/short discovery_query")
    entities = row.get("expected_entities", [])
    if not entities:
        issues.append("no expected entities")
    for ent in entities:
        eid = ent.get("entity_id", "")
        rel = ent.get("relevance", 0)
        if not eid:
            issues.append("entity missing entity_id")
        if not (0 <= rel <= 1):
            issues.append(f"{eid}: relevance {rel} out of range")
    diff = row.get("difficulty", "")
    if diff not in ("easy", "medium", "hard"):
        issues.append(f"invalid difficulty: {diff}")
    return issues


def eval_gate(rows: list[dict], graph: dict) -> dict:
    """Compute Eval-D⁹ coverage metrics."""
    n = len(rows)
    if n == 0:
        return {"score": 0, "pass": False, "dimensions": {}}

    distinct_queries = len(set(r.get("discovery_query", "") for r in rows))
    query_diversity = distinct_queries / max(n, 1)
    all_entities = set(graph["node_ids"])
    referenced = set()
    for r in rows:
        for ent in r.get("expected_entities", []):
            referenced.add(ent.get("entity_id", ""))
    entity_coverage = len(referenced & all_entities) / max(len(all_entities), 1)
    composite = (query_diversity * entity_coverage) ** 0.5

    difficulties = {"easy": 0, "medium": 0, "hard": 0}
    for r in rows:
        difficulties[r.get("difficulty", "medium")] += 1

    return {
        "score": round(composite, 3),
        "pass": composite >= 0.7,
        "dimensions": {
            "query_diversity": round(query_diversity, 3),
            "entity_coverage": round(entity_coverage, 3),
            "difficulty_distribution": {k: round(v / n, 3) for k, v in difficulties.items()},
        },
    }


# ── Main Pipeline ───────────────────────────────────────────────────

def main():
    local_only = "--local" in sys.argv
    dry_run = "--dry-run" in sys.argv
    count = DEFAULT_COUNT
    for arg in sys.argv:
        if arg.startswith("--count="):
            count = int(arg.split("=", 1)[1])

    # 1. Load entity graph
    if not ENTITY_GRAPH_PATH.exists():
        print(f"❌ Entity graph not found: {ENTITY_GRAPH_PATH}")
        print("   Run: curl -sL https://uniteia.com/entity-graph.json > dist/entity-graph.json")
        sys.exit(1)

    print(f"Loading {ENTITY_GRAPH_PATH}...")
    graph = load_entity_graph(ENTITY_GRAPH_PATH)
    print(f"  Nodes: {len(graph['node_ids'])} · Edges: {len(graph['edges'])}")
    print(f"  Niches: {graph['niches']} · Locales: {graph['locales']}")
    print(f"  Mode: {'LOCAL ONLY' if local_only else 'HYBRID (NIM+local)'}")

    if not NVIDIA_API_KEY and not local_only:
        print("⚠️  NVIDIA_API_KEY not set. Use --local for offline mode.")
        local_only = True

    # 2. Generate seeds
    strategies = list(SEED_GENERATORS.keys())
    weights = [SEED_WEIGHTS[s] for s in strategies]
    seeds = []
    for i in range(count):
        strategy = random.choices(strategies, weights=weights, k=1)[0]
        seed = SEED_GENERATORS[strategy](graph)
        seeds.append((strategy, seed))

    print(f"\nSeeds generated: {count}")
    for s, w in zip(strategies, weights):
        c = sum(1 for st, _ in seeds if st == s)
        print(f"  {s}: {c} ({c / count * 100:.0f}%)")

    if dry_run:
        print("\n✅ Dry-run complete — no API calls made")
        return

    # 3. Generate queries + extract entities
    rows = []
    api_calls = 0
    api_fails = 0
    local_fallbacks = 0
    start_time = time.time()

    print(f"\nGenerating {count} training rows...")
    for i, (strategy, seed) in enumerate(seeds):
        
        # --- Step A: Discovery query ---
        query = None
        if not local_only:
            q_prompt = DISCOVERY_TEMPLATE.format(seed=seed)
            query = nim_chat(q_prompt, temperature=0.8, max_tokens=256)
            api_calls += 1
            if query:
                time.sleep(NIM_COOLDOWN)

        if not query:
            # Fallback: use seed summary as query
            query = f"O que você sabe sobre {seed.split('|')[0].split(':')[-1]}?"

        # --- Step B: Extract entities ---
        entities = None
        nim_entities = False
        if not local_only and query:
            e_prompt = f'''Dada a pergunta: "{query}"

Retorne APENAS JSON com expected_entities (array de {{entity_id, entity_name, relevance}}), expected_edge_types, difficulty (easy/medium/hard), graph_hops.

Entity IDs são slugs como "magica-overview" ou "tencent-cloud-deal-stack-builders". Inclua 1-5 entidades.'''
            raw = nim_chat(e_prompt, temperature=0.1, max_tokens=512)
            api_calls += 1
            if raw:
                time.sleep(NIM_COOLDOWN)
                # Parse JSON
                clean = raw.strip()
                if "```" in clean:
                    clean = clean.split("```")[-2] if "json" in clean.split("```")[0] else clean.split("```")[1]
                    clean = clean.split("```")[0]
                try:
                    entities = json.loads(clean)
                    nim_entities = True
                except json.JSONDecodeError:
                    pass

        if not entities:
            entities = local_entity_match(query or seed, seed, graph)
            local_fallbacks += 1

        # --- Build row ---
        row = {
            "id": f"scout-{i:04d}",
            "strategy": strategy,
            "seed_prompt": seed,
            "discovery_query": query,
            "expected_entities": entities.get("expected_entities", []),
            "expected_edge_types": entities.get("expected_edge_types", ["related_to"]),
            "difficulty": entities.get("difficulty", "medium"),
            "graph_hops": entities.get("graph_hops", 1),
            "_source": "nim" if nim_entities else "local",
        }

        issues = validate_row(row)
        if issues:
            if api_fails < 3:
                print(f"  ⚠️  [{i}] {issues}")
            api_fails += 1

        rows.append(row)

        # Progress
        if (i + 1) % 10 == 0:
            elapsed = time.time() - start_time
            rate = (i + 1) / elapsed
            eta = (count - i - 1) / max(rate, 0.1)
            print(f"  [{i+1}/{count}] {rate:.1f} rows/s · ETA {eta:.0f}s · local_fallback={local_fallbacks}")

    elapsed = time.time() - start_time
    print(f"\n✅ Generated {len(rows)} rows in {elapsed:.0f}s")
    print(f"   API calls: {api_calls} · Falls back to local: {local_fallbacks}")

    # 4. Eval-D⁹
    print("\n─── Eval-D⁹ Gate ───")
    report = eval_gate(rows, graph)
    print(f"Score: {report['score']} {'✅ PASS' if report['pass'] else '❌ FAIL'}")
    for dim, val in report["dimensions"].items():
        print(f"  {dim}: {val}")

    # 5. Write output
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / f"scout-{count}.jsonl"
    with open(output_file, "w") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"\n📄 {output_file} ({len(rows)} rows)")

    # Summary stats
    sources = {}
    for r in rows:
        src = r.get("_source", "local")
        sources[src] = sources.get(src, 0) + 1
    print(f"   Source breakdown: {sources}")


if __name__ == "__main__":
    main()
