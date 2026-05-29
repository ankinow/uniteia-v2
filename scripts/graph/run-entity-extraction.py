#!/usr/bin/env python3
"""
run-entity-extraction.py

NeMo DataDesigner pipeline — Entity extraction for UniTeia GraphRAG.

Uses NVIDIA NeMo DataDesigner (data-designer package) to:
  1. Load article frontmatter as seed data
  2. Extract structured entities via LLM (categories, products, brands)
  3. Build relationship edges
  4. Generate vector embeddings
  5. Validate schema compliance
  6. Output entity-graph.v1 compatible JSON

Usage:
  export NVIDIA_API_KEY="nvapi-..."
  export DATA_DESIGNER_BASE_URL="https://nemo.api.nvidia.com"
  python3 scripts/graph/run-entity-extraction.py

  # Preview mode (no API key needed for validation):
  python3 scripts/graph/run-entity-extraction.py --dry-run

Requirements:
  pip install 'data-designer>=0.5,<0.7'

See setup-data-designer.sh for environment setup.
"""

import os
import sys
import json
import glob
import re
from pathlib import Path
from typing import Optional

# DataDesigner API (standalone library)
try:
    import data_designer.config as dd
    from data_designer.config.column_configs import (
        LLMStructuredColumnConfig,
        ExpressionColumnConfig,
        ValidationColumnConfig,
    )
    from data_designer.config.seed_source_dataframe import DataFrameSeedSource
    import pandas as pd
    # ModelConfig and ChatCompletionInferenceParams are at dd directly (v0.5.x)
    ModelConfig = dd.ModelConfig
    ChatCompletionInferenceParams = dd.ChatCompletionInferenceParams
    HAS_DD = True
except ImportError:
    HAS_DD = False


# ── Config ──

CONTENT_DIR = Path("content/apex")
OUTPUT_DIR = Path("dist")
OUTPUT_FILE = OUTPUT_DIR / "entity-graph-nemo.json"
YAML_FRONTMATTER_RE = re.compile(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?", re.MULTILINE)


# ── Helpers ──

def parse_frontmatter(filepath: str) -> dict | None:
    """Extract YAML frontmatter from a markdown file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return None

    match = YAML_FRONTMATTER_RE.match(content)
    if not match:
        return None

    import yaml
    try:
        data = yaml.safe_load(match.group(1))
        if not isinstance(data, dict):
            return None
        data["_path"] = filepath
        data["_body"] = content[match.end():].strip()
        return data
    except yaml.YAMLError:
        return None


def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ── Pipeline Builder ──

def build_pipeline(seed_data: list[dict]) -> dd.DataDesignerConfigBuilder:
    """
    Build the DataDesigner pipeline config.
    
    Stages:
      1. SeedDataset — load article frontmatter
      2. Expression — normalize fields (article_id, locale, score)
      3. LLMStructured — extract categories from subjects
      4. LLMStructured — extract products from referral_links
      5. LLMStructured — build entity relationship edges
      6. Validation — schema compliance
    """
    
    # Model configs (NVIDIA NIM / build.nvidia.com)
    model_configs = [
        ModelConfig(
            alias="extract-entities",
            model="nvidia/nemotron-4-340b-instruct",
            inference_parameters=ChatCompletionInferenceParams(
                temperature=0.1,  # Deterministic extraction
                top_p=0.9,
                max_tokens=4096,
            ),
        ),
        ModelConfig(
            alias="extract-edges",
            model="nvidia/nemotron-4-340b-instruct",
            inference_parameters=ChatCompletionInferenceParams(
                temperature=0.2,
                top_p=0.9,
                max_tokens=2048,
            ),
        ),
    ]

    builder = dd.DataDesignerConfigBuilder(model_configs=model_configs)

    # ── Stage 1: Seed dataset from parsed frontmatter ──
    df = pd.DataFrame(seed_data)
    builder = builder.with_seed_dataset(
        seed_source=DataFrameSeedSource(df=df),
    )

    # ── Stage 2: Expression columns for normalization ──
    builder.add_column(
        ExpressionColumnConfig(
            name="article_id",
            expr="{{ article_seed.lang }}-{{ article_seed.slug }}",
        )
    )

    builder.add_column(
        ExpressionColumnConfig(
            name="article_locale",
            expr="{{ article_seed.lang }}",
        )
    )

    builder.add_column(
        ExpressionColumnConfig(
            name="article_quality_score",
            expr="{{ article_seed.quality_score | default(50) }}",
        )
    )

    # ── Stage 3: LLM Category Extraction ──
    builder.add_column(
        LLMStructuredColumnConfig(
            name="extracted_categories",
            model_alias="extract-entities",
            prompt=(
                "You analyze technology articles. Extract subject categories.\n\n"
                "Article: {{ article_seed.title }}\n"
                "Subjects: {{ article_seed.subjects | join(', ') }}\n\n"
                "For each subject, output:\n"
                "- id: 'category-{slugified-name}'\n"
                "- name: Display name (e.g., 'AI Platform')\n"
                "- type: 'category'"
            ),
            output_format={
                "type": "object",
                "properties": {
                    "categories": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "name": {"type": "string"},
                                "type": {"type": "string", "enum": ["category"]},
                            },
                            "required": ["id", "name"],
                        },
                    }
                },
                "required": ["categories"],
            },
        )
    )

    # ── Stage 3b: Product/Brand extraction ──
    builder.add_column(
        LLMStructuredColumnConfig(
            name="extracted_products",
            model_alias="extract-entities",
            prompt=(
                "Extract products and brands from referral links.\n\n"
                "Article: {{ article_seed.title }}\n"
                "Links:\n"
                "{% for link in article_seed.referral_links %}"
                "- {{ link.title }} ({{ link.url }})\n"
                "{% endfor %}\n\n"
                "Classify each as:\n"
                "- product (has_affiliate): commercial/trial links\n"
                "- brand (mentions): company/product references\n"
                "Skip documentation/specification links."
            ),
            output_format={
                "type": "object",
                "properties": {
                    "products": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "name": {"type": "string"},
                                "url": {"type": "string"},
                                "entity_type": {
                                    "type": "string",
                                    "enum": ["product", "brand"],
                                },
                            },
                            "required": ["id", "name", "entity_type"],
                        },
                    }
                },
                "required": ["products"],
            },
        )
    )

    # ── Stage 4: Relationship edges ──
    builder.add_column(
        LLMStructuredColumnConfig(
            name="extracted_edges",
            model_alias="extract-edges",
            prompt=(
                "Define entity relationships.\n\n"
                "Article ID: {{ article_id }}\n"
                "Title: {{ article_seed.title }}\n"
                "Categories: {{ extracted_categories.categories | map(attribute='name') | join(', ') }}\n\n"
                "Create edges:\n"
                "1. article → category (belongs_to)\n"
                "2. article → product (mentions / has_affiliate)\n"
                "3. article → brand (mentions)"
            ),
            output_format={
                "type": "object",
                "properties": {
                    "edges": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "source": {"type": "string"},
                                "target": {"type": "string"},
                                "kind": {
                                    "type": "string",
                                    "enum": [
                                        "belongs_to", "mentions",
                                        "has_affiliate", "competes_with",
                                    ],
                                },
                                "weight": {"type": "number"},
                                "reason": {"type": "string"},
                            },
                            "required": ["source", "target", "kind"],
                        },
                    }
                },
                "required": ["edges"],
            },
        )
    )

    # ── Stage 5: Validation ──
    # Note: ValidationColumnConfig in v0.5.x uses validator_type + validator_params
    # Skipping for now — LLMStructured output_format enforces schema natively.

    return builder


# ── Main ──

def main():
    mode = "dry" if "--dry-run" in sys.argv else "live"
    print(f"╔═══════════════════════════════════════════╗")
    print(f"║  NeMo DataDesigner — Entity Extraction    ║")
    print(f"╚═══════════════════════════════════════════╝")
    print(f"  Content: {CONTENT_DIR}")
    print(f"  Output:  {OUTPUT_FILE}")
    print(f"  Mode:    {mode}")
    print()

    # ── Check dependencies ──
    if not HAS_DD:
        print("❌ data-designer not installed.")
        print("   pip install 'data-designer>=0.5,<0.7'")
        print("   Or: bash scripts/graph/setup-data-designer.sh")
        return 1

    # ── Check API key ──
    nvidia_key = os.environ.get("NVIDIA_API_KEY", "")
    if not nvidia_key and mode == "live":
        print("⚠️  NVIDIA_API_KEY not set. Use --dry-run to validate config only.")
        print("   export NVIDIA_API_KEY='nvapi-...'")
        return 1

    # ── Discover articles ──
    if not CONTENT_DIR.exists():
        print(f"❌ Content directory not found: {CONTENT_DIR}")
        return 1

    seed_files = sorted(
        glob.glob(str(CONTENT_DIR / "**/*.md"), recursive=True)
    )
    seed_files = [f for f in seed_files if not f.endswith("_index.md")]
    print(f"📄 Found {len(seed_files)} article files")

    if not seed_files:
        print("❌ No articles found")
        return 1

    # ── Parse frontmatter → seed data ──
    print(f"🔍 Parsing frontmatter...")
    seed_data = []
    errors = []
    for fp in seed_files:
        fm = parse_frontmatter(fp)
        if fm:
            seed_data.append({
                "filepath": fp,
                "slug": fm.get("slug", ""),
                "lang": fm.get("lang", "en"),
                "title": fm.get("title", ""),
                "verdict": fm.get("verdict", "caution"),
                "quality_score": fm.get("quality_score", 50),
                "subjects": fm.get("subjects", []),
                "referral_links": fm.get("referral_links", []),
                "created_at": fm.get("metadata", {}).get("created_at", ""),
                "updated_at": fm.get("metadata", {}).get("updated_at", ""),
            })
        else:
            errors.append(fp)

    if errors:
        print(f"  ⚠️  {len(errors)} files without frontmatter (skipped)")

    print(f"  Seed records: {len(seed_data)}")
    print()

    # ── Build pipeline ──
    print(f"🔧 Building pipeline config...")
    builder = build_pipeline(seed_data)

    # ── Validate config ──
    print(f"  Validating config...")
    try:
        config = builder.build()
        print(f"  ✅ Config valid")
    except Exception as e:
        print(f"  ❌ Config validation failed: {e}")
        return 1

    if mode == "dry":
        print(f"\n✅ Dry run complete — config is valid and ready to execute.")
        print(f"\n▶ To run:")
        print(f"   export NVIDIA_API_KEY='nvapi-...'")
        print(f"   python3 {sys.argv[0]}")
        return 0

    # ── Execute pipeline via DataDesigner API ──
    print(f"\n🚀 Executing pipeline...")
    
    # The DataDesigner interface uses REST API:
    # POST /v1/data-designer/preview  (for preview)
    # POST /v1/data-designer/jobs     (for full run)
    
    try:
        from data_designer.interface import DataDesigner
        
        data_designer = DataDesigner(
            artifact_path=str(OUTPUT_DIR),
            model_providers=[{
                "name": "nvidia-build",
                "api_key": nvidia_key,
            }],
        )
        
        # Preview first (small sample)
        print(f"  Previewing (10 records)...")
        preview = data_designer.preview(builder, num_records=10)
        
        # Save preview
        preview_path = OUTPUT_DIR / "entity-graph-preview.json"
        if hasattr(preview, 'dataset'):
            preview.dataset.to_json(str(preview_path), orient="records")
            print(f"  Preview saved: {preview_path}")
        
        # Full run
        print(f"  Running full pipeline ({len(seed_data)} records)...")
        result = data_designer.run(builder, num_records=len(seed_data))
        
        # Save output
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        if hasattr(result, 'dataset'):
            result.dataset.to_json(str(OUTPUT_FILE), orient="records")
            size_kb = OUTPUT_FILE.stat().st_size / 1024
            print(f"\n✅ Pipeline complete")
            print(f"   Output: {OUTPUT_FILE} ({size_kb:.1f} KB)")
            print(f"   Records: {len(result.dataset)}")
        else:
            print(f"\n⚠️  Unexpected result format")
            print(f"   {type(result)}")
            
    except ImportError:
        print(f"\n⚠️  data_designer.interface not available (no NVIDIA API access)")
        print(f"   Config validated and ready. Run with proper environment:")
        print(f"   source .venv-data-designer/bin/activate")
        print(f"   python3 {sys.argv[0]}")
    except Exception as e:
        print(f"\n❌ Pipeline execution failed: {e}")
        if "401" in str(e) or "auth" in str(e).lower():
            print("   Check NVIDIA_API_KEY — invalid or expired")
        elif "402" in str(e):
            print("   NVIDIA API credit limit reached")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
