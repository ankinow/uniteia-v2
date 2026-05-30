#!/usr/bin/env python3
"""
Quick validation of the P1.1 Scout Training pipeline.
Runs 3 end-to-end queries to prove API connectivity + data generation works.
"""

import json, os, requests, time, sys

key = os.environ.get("NVIDIA_API_KEY", "")
if not key:
    print("❌ NVIDIA_API_KEY not set")
    sys.exit(1)

headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
model = "nvidia/llama-3.1-nemotron-nano-8b-v1"
base = "https://integrate.api.nvidia.com/v1/chat/completions"

seeds = [
    "entity:magica-overview|label:Magica Overview|niche:apex",
    "entity:tencent-cloud-deal-stack-builders|label:Tencent Cloud|niche:apex",
    "relation:related_to|src:AI Command Center|dst:Magica MCP Server",
]

print("╔═══ P1.1 Scout Training — Live Test ═══╗\n")

for i, seed in enumerate(seeds):
    print(f"─── Row {i+1}/3 ───")
    
    # Step 1: Generate discovery query
    prompt1 = f"Gere uma pergunta de descoberta natural em português brasileiro que um pesquisador faria sobre IA, baseada em: {seed}. Máximo 20 palavras."
    
    resp = requests.post(base, headers=headers, json={
        "model": model, "messages": [{"role": "user", "content": prompt1}],
        "temperature": 0.8, "max_tokens": 256
    }, timeout=60)
    
    if resp.status_code != 200:
        print(f"  ❌ Discovery FAIL: {resp.text[:100]}")
        time.sleep(3)
        continue
    
    query = resp.json()["choices"][0]["message"]["content"]
    print(f"  🔍 Query: {query[:80]}")
    
    time.sleep(2)  # Rate limit buffer
    
    # Step 2: Extract expected entities
    prompt2 = f'''Dada a pergunta: "{query}"

Analise quais entidades do grafo de conhecimento UniTeia seriam relevantes.
Retorne APENAS JSON:
{{
  "expected_entities": [{{"entity_id": "...", "entity_name": "...", "relevance": 0.9}}],
  "expected_edge_types": ["related_to"],
  "difficulty": "easy|medium|hard",
  "graph_hops": 1
}}'''

    resp2 = requests.post(base, headers=headers, json={
        "model": model, "messages": [{"role": "user", "content": prompt2}],
        "temperature": 0.1, "max_tokens": 512
    }, timeout=60)
    
    if resp2.status_code != 200:
        print(f"  ❌ Extract FAIL: {resp2.text[:100]}")
        time.sleep(3)
        continue
    
    raw = resp2.json()["choices"][0]["message"]["content"]
    
    # Parse JSON (strip markdown fences if present)
    clean = raw.strip()
    if "```" in clean:
        clean = clean.split("```")[1] if "```json" not in clean else clean.split("```json")[1]
        clean = clean.split("```")[0]
    try:
        parsed = json.loads(clean)
        entities = parsed.get("expected_entities", [])
        print(f"  ✅ Entities: {len(entities)} → {[e.get('entity_id','?') for e in entities[:3]]}")
        print(f"  📊 Difficulty: {parsed.get('difficulty','?')} · Hops: {parsed.get('graph_hops','?')}")
    except json.JSONDecodeError:
        print(f"  ❌ JSON parse FAIL: {raw[:100]}")
    
    print()
    time.sleep(3)  # Rate limit buffer

print("╚═══ Test complete ═══╝")
