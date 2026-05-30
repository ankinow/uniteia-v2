#!/usr/bin/env python3
"""
scripts/memory/build-L2-graph.py — Fase 3: L2 → GraphRAG Queryable

Builds entity-graph nodes + embeddings from L2 findings.
Outputs to dist/ so P0.3 QueryEngine can index findings alongside wiki entities.

Usage:
  python3 scripts/memory/build-L2-graph.py
  python3 scripts/memory/build-L2-graph.py --findings=<path>

Gate: Graph includes memory/L2 nodes, API returns findings in results
"""

import json
import sys
import hashlib
import math
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
L2_PATH = REPO_ROOT / "memory" / "L2" / "findings.json"
L3_DIR = REPO_ROOT / "memory" / "L3"
DIST_DIR = REPO_ROOT / "dist"
GRAPH_PATH = DIST_DIR / "entity-graph.json"

FINDING_PREFIX = "finding-"


def load_l2_findings(path: Path) -> list[dict]:
    if not path.exists():
        print(f"⚠ L2 file not found: {path}")
        return []
    with open(path) as f:
        data = json.load(f)
    return data.get("findings", [])


def load_l3_findings() -> list[dict]:
    """Load promoted L3 entries too."""
    findings = []
    if L3_DIR.exists():
        for fpath in sorted(L3_DIR.glob("*.json")):
            with open(fpath) as f:
                findings.append(json.load(f))
    return findings


def build_finding_nodes(l2_findings: list[dict], l3_entries: list[dict]) -> tuple[list[dict], dict]:
    """
    Convert L2 findings and L3 entries into entity-graph nodes.
    Returns (nodes, embeddings_flat).
    """
    nodes = []
    embeddings = {}

    # ── L2 findings as nodes ──
    for f in l2_findings:
        fid = f["id"]
        content = f.get("content", "")
        domain = f.get("domain", "general")
        status = f.get("status", "open")
        eval_d9 = f.get("eval_d9", 50)
        tags = f.get("tags", [])

        node = {
            "id": f"{FINDING_PREFIX}{fid}",
            "name": f"[{domain}] {content[:60]}",
            "type": "finding",
            "locale": "en",
            "description": content[:500],
            "domain": domain,
            "finding_status": status,
            "eval_d9": eval_d9,
            "tags": tags,
            "source": "memory/L2",
            "niche": domain,
            "visibility": "published",
            "qualityScore": eval_d9,
        }
        nodes.append(node)

        # Embedding: hash-based 1024d (keyword bag)
        words = content.lower().split()[:50]
        dims = 1024
        vec = [0.0] * dims
        freq = {}
        for w in words:
            h = 5381
            for c in w:
                h = (h << 5) + h + ord(c)
                h = h & h
            idx = abs(h) % dims
            freq[idx] = freq.get(idx, 0) + 1

        max_freq = max(freq.values(), default=1)
        for idx, count in freq.items():
            vec[idx] = count / max_freq

        embeddings[f"{FINDING_PREFIX}{fid}"] = vec

    # ── L3 entries as wiki nodes ──
    for entry in l3_entries:
        eid = f"l3-{entry.get('id', 'unknown')}"
        content = entry.get("content", "")
        title = entry.get("title", "Untitled")
        domain = entry.get("domain", "general")
        actionability = entry.get("actionability", "reference")

        node = {
            "id": eid,
            "name": title[:80],
            "type": "wiki",
            "locale": "en",
            "description": content[:500],
            "domain": domain,
            "finding_status": "promoted",
            "eval_d9": entry.get("eval_d9_promotion", 80),
            "tags": entry.get("cross_refs", []),
            "source": "memory/L3",
            "niche": domain,
            "visibility": "published",
            "qualityScore": entry.get("eval_d9_promotion", 80),
        }
        nodes.append(node)

        words = content.lower().split()[:50]
        dims = 1024
        vec = [0.0] * dims
        freq = {}
        for w in words:
            h = 5381
            for c in w:
                h = (h << 5) + h + ord(c)
                h = h & h
            idx = abs(h) % dims
            freq[idx] = freq.get(idx, 0) + 1

        max_freq = max(freq.values(), default=1)
        for idx, count in freq.items():
            vec[idx] = count / max_freq

        embeddings[eid] = vec

    return nodes, embeddings


def write_graph(nodes: list[dict], output_path: Path):
    """Write entity-graph.json compatible with P0.3 API."""
    graph = {
        "schema": "entity-graph.v1",
        "meta": {
            "generated": datetime.now(timezone.utc).isoformat(),
            "source": "memory/L2 + L3",
            "total_nodes": len(nodes),
            "prefix": FINDING_PREFIX,
        },
        "nodes": nodes,
        "edges": [],  # No edges for L2 findings yet
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    return output_path


def write_embeddings(embeddings: dict, output_path: Path):
    """Write flat-map embeddings compatible with P0.3 API."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(embeddings, f, separators=(",", ":"))
    meta = {
        "schema": "entity-embeddings.v1",
        "generated": datetime.now(timezone.utc).isoformat(),
        "dimensions": 1024,
        "count": len(embeddings),
        "source": "memory/L2",
    }
    with open(output_path.with_suffix(".meta.json"), "w") as f:
        json.dump(meta, f, indent=2)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P2 Fase 3: L2 → GraphRAG")
    parser.add_argument("--findings", type=str, default=str(L2_PATH))
    parser.add_argument("--output-graph", type=str, default=str(DIST_DIR / "entity-graph-v2.json"))
    parser.add_argument("--output-embeddings", type=str, default=str(DIST_DIR / "entity-embeddings-v2.json"))
    args = parser.parse_args()

    print(f"╔══ P2 Fase 3: L2 → GraphRAG ══╗")

    # Load
    l2 = load_l2_findings(Path(args.findings))
    l3 = load_l3_findings()
    print(f"📦 Loaded: {len(l2)} L2 findings + {len(l3)} L3 entries")

    # Build
    nodes, embeddings = build_finding_nodes(l2, l3)
    print(f"🏗  Built: {len(nodes)} graph nodes + {len(embeddings)} embeddings")

    # Write
    graph_path = write_graph(nodes, Path(args.output_graph))
    emb_path = write_embeddings(embeddings, Path(args.output_embeddings))
    print(f"✅ Graph: {graph_path}")
    print(f"✅ Embeddings: {emb_path}")

    # Also write a combined graph.json for the P0.3 API
    combined_graph = Path(args.output_graph).parent / "entity-graph.json"
    if combined_graph.exists():
        with open(combined_graph) as f:
            existing = json.load(f)
        existing_nodes = existing.get("nodes", [])
        existing_ids = {n["id"] for n in existing_nodes}
        new_nodes = [n for n in nodes if n["id"] not in existing_ids]
        existing["nodes"] = existing_nodes + new_nodes
        if "meta" not in existing:
            existing["meta"] = {}
        existing["meta"]["total_nodes"] = len(existing["nodes"])
        existing["meta"]["memory_tiers"] = "L2+L3"
        existing["meta"]["finding_count"] = len(new_nodes)
        with open(combined_graph, "w") as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
        print(f"✅ Merged {len(new_nodes)} finding nodes into {combined_graph}")

    print(f"\n📊 Summary: {len(l2)} L2 + {len(l3)} L3 = {len(nodes)} total")

    return 0


if __name__ == "__main__":
    sys.exit(main())
