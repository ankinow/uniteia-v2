#!/usr/bin/env python3
"""
scripts/training/generate-writer-data.py — P1.2 Writer Training pipeline

Generates synthetic article writing prompts for training the writer agent
(content generation + 8-locale translation).

Pipeline:
  1. Load entity-graph.json (64 nodes, 602 edges)
  2. Generate seed prompts (niche summary, entity deep-dive, comparison, tutorial)
  3. Generate writing task using local templates + NIM (if available)
  4. Extract expected article structure (headings, entities, locale)
  5. Validate
  6. Write training/writer-N.jsonl

Usage:
  python3 scripts/training/generate-writer-data.py --count=50
  python3 scripts/training/generate-writer-data.py --local --count=10

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

DEFAULT_COUNT = 500
NIM_TIMEOUT = 60
NIM_COOLDOWN = 3
MAX_RETRIES = 2

SEED_WEIGHTS = {
    "niche_overview": 0.25,
    "entity_deep_dive": 0.30,
    "comparison": 0.20,
    "tutorial": 0.15,
    "translation_task": 0.10,
}

# ── Graph Loading ───────────────────────────────────────────────────

def load_entity_graph(path: Path) -> dict:
    with open(path) as f:
        graph = json.load(f)
    nodes: dict[str, dict] = {}
    for n in graph.get("nodes", []):
        nodes[n["id"]] = n
    return {
        "nodes": nodes,
        "edges": graph.get("edges", []),
        "node_ids": list(nodes.keys()),
        "locales": list({n.get("locale", "en") for n in nodes.values()}),
        "node_by_locale": _group_by(nodes, "locale"),
        "node_by_type": _group_by(nodes, "type"),
    }

def _group_by(nodes: dict, key: str) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for nid, n in nodes.items():
        v = n.get(key, "unknown")
        groups.setdefault(v, []).append(nid)
    return groups


# ── Seed Generation ─────────────────────────────────────────────────

def seed_niche_overview(graph: dict) -> str:
    """Pick entities from same niche for an overview article."""
    pool = []
    for nid in random.sample(graph["node_ids"], min(5, len(graph["node_ids"]))):
        n = graph["nodes"][nid]
        pool.append(f"entity:{nid}|label:{n.get('name',nid)}|type:{n.get('type','article')}")
    return "niche_overview:" + "|".join(pool[:5])


def seed_entity_deep_dive(graph: dict) -> str:
    """Pick one entity for a deep-dive article."""
    nid = random.choice(graph["node_ids"])
    n = graph["nodes"][nid]
    return f"deep_dive:entity:{nid}|label:{n.get('name', nid)}|type:{n.get('type','article')}|locale:{n.get('locale','en')}"


def seed_comparison(graph: dict) -> str:
    """Pick two related entities for a comparison article."""
    edges = graph.get("edges", [])
    if not edges:
        return seed_entity_deep_dive(graph)
    edge = random.choice(edges)
    src = graph["nodes"].get(edge["source"], {})
    dst = graph["nodes"].get(edge["target"], {})
    src_label = src.get("name", edge["source"])
    dst_label = dst.get("name", edge["target"])
    return f"comparison:src:{edge['source']}|src_label:{src_label}|dst:{edge['target']}|dst_label:{dst_label}|rel:{edge.get('type','related_to')}"


def seed_tutorial(graph: dict) -> str:
    """Pick a how-to/tutorial topic."""
    topics = [
        "Configurar ambiente de desenvolvimento",
        "Criar pipeline de conteúdo automatizado",
        "Analisar sinais de mercado com IA",
        "Implementar busca semântica",
        "Traduzir conteúdo para 8 locales",
        "Conectar API NIM para embeddings",
        "Monitorar qualidade do conteúdo",
        "Automatizar deploy no Cloudflare Pages",
    ]
    topic = random.choice(topics)
    target_entity = random.choice(graph["node_ids"])
    n = graph["nodes"][target_entity]
    return f"tutorial:{topic}|entity:{target_entity}|label:{n.get('name', target_entity)}"


def seed_translation_task(graph: dict) -> str:
    """Pick a source article and target locale for translation."""
    en_articles = [nid for nid in graph["node_ids"] if graph["nodes"][nid].get("locale") == "en" and graph["nodes"][nid].get("type") == "article"]
    if not en_articles:
        en_articles = graph["node_ids"][:10]
    source = random.choice(en_articles)
    n = graph["nodes"][source]
    target_locale = random.choice([l for l in graph["locales"] if l != "en"])
    return f"translation:source:{source}|label:{n.get('name', source)}|from:en|to:{target_locale}"


SEED_GENERATORS = {
    "niche_overview": seed_niche_overview,
    "entity_deep_dive": seed_entity_deep_dive,
    "comparison": seed_comparison,
    "tutorial": seed_tutorial,
    "translation_task": seed_translation_task,
}


# ── Writing Task Generation (Local Templates) ──────────────────────

LOCAL_TEMPLATES = {
    "niche_overview": lambda seed, graph: _overview_from_seed(seed, graph),
    "entity_deep_dive": lambda seed, graph: _deep_dive_from_seed(seed, graph),
    "comparison": lambda seed, graph: _comparison_from_seed(seed, graph),
    "tutorial": lambda seed, graph: _tutorial_from_seed(seed, graph),
    "translation_task": lambda seed, graph: _translation_from_seed(seed, graph),
}


def _pick_entity(seed: str, graph: dict) -> tuple[str, dict] | None:
    """Get entity from seed fields."""
    for part in seed.split("|"):
        if part.startswith("entity:"):
            eid = part.split(":", 1)[-1].strip()
            if eid in graph["nodes"]:
                return eid, graph["nodes"][eid]
        if part.startswith("src:"):
            eid = part.split(":", 1)[-1].strip()
            if eid in graph["nodes"]:
                return eid, graph["nodes"][eid]
    return None


def _overview_from_seed(seed: str, graph: dict) -> dict:
    """Generate an overview writing task."""
    entities = re.findall(r'entity:([^|]+)', seed)
    names = []
    for eid in entities[:3]:
        n = graph["nodes"].get(eid, {})
        names.append(n.get("name", eid))

    locale = random.choice(graph["locales"])
    lang_name = {
        "en": "English", "pt": "Portuguese", "es": "Spanish", "fr": "French",
        "de": "German", "it": "Italian", "ja": "Japanese", "zh": "Chinese",
    }.get(locale, locale)

    prompt = f"Write a 500-word overview article in {lang_name} about AI-powered signal curation. Cover: {', '.join(names[:3])}."

    expected_headings = [
        f"Introdução à Curadoria de Sinais",
        f"Visão Geral das Ferramentas",
        f"Como Começar",
    ]
    if locale != "en":
        expected_headings = [f"{h} (em {lang_name})" for h in expected_headings]

    return {
        "writing_prompt": prompt,
        "expected_headings": expected_headings,
        "expected_entities": entities[:5],
        "target_locale": locale,
        "target_language": lang_name,
        "word_count": 500,
        "difficulty": "medium",
    }


def _deep_dive_from_seed(seed: str, graph: dict) -> dict:
    """Generate a deep-dive writing task."""
    entity = _pick_entity(seed, graph)
    if not entity:
        return _overview_from_seed(seed, graph)
    eid, n = entity
    name = n.get("name", eid)
    locale = n.get("locale", "en")
    lang_name = {
        "en": "English", "pt": "Portuguese", "es": "Spanish", "fr": "French",
        "de": "German", "it": "Italian", "ja": "Japanese", "zh": "Chinese",
    }.get(locale, locale)

    prompt = f"Write a detailed 800-word article in {lang_name} about '{name}'. Include: overview, key features, use cases, and pricing."

    return {
        "writing_prompt": prompt,
        "expected_headings": [
            f"O que é {name}",
            "Principais Características",
            "Casos de Uso",
            "Preços e Planos",
            "Conclusão",
        ],
        "expected_entities": [eid],
        "target_locale": locale,
        "target_language": lang_name,
        "word_count": 800,
        "difficulty": "medium",
    }


def _comparison_from_seed(seed: str, graph: dict) -> dict:
    """Generate a comparison writing task."""
    src_label = ""
    dst_label = ""
    for part in seed.split("|"):
        if part.startswith("src_label:"):
            src_label = part.split(":", 1)[-1]
        if part.startswith("dst_label:"):
            dst_label = part.split(":", 1)[-1]

    locale = random.choice(graph["locales"])
    lang_name = {
        "en": "English", "pt": "Portuguese", "es": "Spanish", "fr": "French",
        "de": "German", "it": "Italian", "ja": "Japanese", "zh": "Chinese",
    }.get(locale, locale)

    prompt = f"Write a 600-word comparison article in {lang_name} between '{src_label}' and '{dst_label}'. Compare: features, pricing, use cases, and ecosystem."

    return {
        "writing_prompt": prompt,
        "expected_headings": [
            f"Introdução: {src_label} vs {dst_label}",
            "Comparação de Características",
            "Comparação de Preços",
            "Casos de Uso Ideais",
            "Veredito Final",
        ],
        "expected_entities": [],
        "target_locale": locale,
        "target_language": lang_name,
        "word_count": 600,
        "difficulty": "hard",
    }


def _tutorial_from_seed(seed: str, graph: dict) -> dict:
    """Generate a tutorial writing task."""
    parts = seed.split("|")
    topic = parts[0].split(":", 1)[-1] if ":" in parts[0] else "Tutorial"
    entity = _pick_entity(seed, graph)
    name = entity[1].get("name", entity[0]) if entity else topic
    locale = random.choice(graph["locales"])
    lang_name = {
        "en": "English", "pt": "Portuguese", "es": "Spanish", "fr": "French",
        "de": "German", "it": "Italian", "ja": "Japanese", "zh": "Chinese",
    }.get(locale, locale)

    prompt = f"Write a step-by-step tutorial in {lang_name} about '{topic}' using '{name}'. Include prerequisites, setup, and examples."

    return {
        "writing_prompt": prompt,
        "expected_headings": [
            "Pré-requisitos",
            f"Passo 1: Configuração",
            f"Passo 2: Implementação",
            f"Passo 3: Testes",
            "Conclusão",
        ],
        "expected_entities": [entity[0]] if entity else [],
        "target_locale": locale,
        "target_language": lang_name,
        "word_count": 1000,
        "difficulty": "hard",
    }


def _translation_from_seed(seed: str, graph: dict) -> dict:
    """Generate a translation task."""
    target_locale = "en"
    source_label = ""
    for part in seed.split("|"):
        if part.startswith("label:"):
            source_label = part.split(":", 1)[-1]
        if part.startswith("to:"):
            target_locale = part.split(":", 1)[-1].strip()

    lang_name = {
        "en": "English", "pt": "Portuguese", "es": "Spanish", "fr": "French",
        "de": "German", "it": "Italian", "ja": "Japanese", "zh": "Chinese",
    }.get(target_locale, target_locale)

    prompt = f"Translate the following article about '{source_label}' from English to {lang_name}. Preserve markdown formatting, links, and code blocks."

    return {
        "writing_prompt": prompt,
        "expected_headings": [],
        "expected_entities": [],
        "target_locale": target_locale,
        "target_language": lang_name,
        "word_count": None,
        "difficulty": "easy",
    }


# ── NIM API ─────────────────────────────────────────────────────────

def nim_chat(prompt: str, temperature: float = 0.7, max_tokens: int = 512) -> str | None:
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


# ── Eval-D⁹ ─────────────────────────────────────────────────────────

def eval_gate(rows: list[dict]) -> dict:
    n = len(rows)
    if n == 0:
        return {"score": 0, "pass": False, "dimensions": {}}
    distinct_prompts = len(set(r.get("writing_prompt", "") for r in rows))
    diversity = distinct_prompts / max(n, 1)
    locales = set(r.get("target_locale", "") for r in rows)
    locale_coverage = len(locales) / 8  # 8 locales
    composite = (diversity * locale_coverage) ** 0.5
    return {
        "score": round(composite, 3),
        "pass": composite >= 0.7,
        "dimensions": {
            "prompt_diversity": round(diversity, 3),
            "locale_coverage": round(locale_coverage, 3),
        },
    }


# ── Main ────────────────────────────────────────────────────────────

def main():
    local_only = "--local" in sys.argv
    dry_run = "--dry-run" in sys.argv
    count = DEFAULT_COUNT
    for arg in sys.argv:
        if arg.startswith("--count="):
            count = int(arg.split("=", 1)[1])

    if not ENTITY_GRAPH_PATH.exists():
        print(f"❌ Entity graph not found: {ENTITY_GRAPH_PATH}")
        sys.exit(1)

    graph = load_entity_graph(ENTITY_GRAPH_PATH)
    print(f"Loaded {len(graph['node_ids'])} nodes · {len(graph['edges'])} edges")
    print(f"  Locales: {graph['locales']}")
    print(f"  Mode: {'LOCAL ONLY' if local_only else 'HYBRID (NIM+local)'}")

    if not NVIDIA_API_KEY and not local_only:
        print("⚠️  No NVIDIA_API_KEY — falling back to local mode")
        local_only = True

    strategies = list(SEED_GENERATORS.keys())
    weights = [SEED_WEIGHTS[s] for s in strategies]

    seeds = []
    for i in range(count):
        strategy = random.choices(strategies, weights=weights, k=1)[0]
        seed = SEED_GENERATORS[strategy](graph)
        seeds.append((strategy, seed))

    print(f"\nSeeds: {count}")
    for s, w in zip(strategies, weights):
        c = sum(1 for st, _ in seeds if st == s)
        print(f"  {s}: {c} ({c / count * 100:.0f}%)")

    if dry_run:
        print("\n✅ Dry-run complete")
        return

    rows = []
    for i, (strategy, seed) in enumerate(seeds):
        task = LOCAL_TEMPLATES[strategy](seed, graph)
        task["id"] = f"writer-{i:04d}"
        task["strategy"] = strategy
        task["seed_prompt"] = seed
        rows.append(task)

        if (i + 1) % 50 == 0:
            print(f"  [{i+1}/{count}]")

    print(f"\n✅ Generated {len(rows)} rows")
    print("\n─── Eval-D⁹ Gate ───")
    report = eval_gate(rows)
    print(f"Score: {report['score']} {'✅ PASS' if report['pass'] else '❌ FAIL'}")
    for dim, val in report["dimensions"].items():
        print(f"  {dim}: {val}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / f"writer-{count}.jsonl"
    with open(output_file, "w") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"\n📄 {output_file} ({len(rows)} rows)")


if __name__ == "__main__":
    main()
