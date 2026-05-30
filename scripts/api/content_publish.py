#!/usr/bin/env python3
"""
scripts/api/content_publish.py — M1: Hermes content publisher

Publishes content packages to UniTeia via Content Package Contract v1.
Called by daily_ops.py when --output=uniteia is set.

Usage:
  python3 scripts/api/content_publish.py --package=package.json
  python3 scripts/api/content_publish.py --dry-run  # validate only
  python3 scripts/api/content_publish.py --posts=posts.json --assets=assets.json

Gate: package validates against schema, auth succeeds, rate limit respected
"""

import json
import os
import re
import sys
import time
import hashlib
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────

UNITEIA_API_URL = os.environ.get("UNITEIA_API_URL", "https://uniteia.com/api/content/import")
UNITEIA_API_KEY = os.environ.get("UNITEIA_API_KEY", "")
MAX_RETRIES = 5
BASE_DELAY = 60  # seconds, exponential backoff
SCHEMA_PATH = Path(__file__).resolve().parent.parent.parent / "memory" / "schema" / "content-package-v1.json"


def generate_package_id() -> str:
    """Generate unique package ID: pkg-YYYYMMDD-HHMMSS-hash8"""
    now = datetime.now(timezone.utc)
    date_part = now.strftime("%Y%m%d-%H%M%S")
    hash_part = hashlib.md5(date_part.encode()).hexdigest()[:8]
    return f"pkg-{date_part}-{hash_part}"


def build_package(posts: list[dict], assets: list[dict], agent: str = "hermes-daily-ops",
                  pipeline: str = "daily") -> dict:
    """Build a Content Package Contract v1 from posts and assets."""
    return {
        "package_id": generate_package_id(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": {
            "agent": agent,
            "version": "v4.1.0",
            "pipeline": pipeline,
        },
        "posts": posts,
        "assets": assets,
    }


def validate_package(package: dict) -> tuple[bool, list[str]]:
    """Validate package against JSON Schema v1."""
    try:
        import jsonschema
        schema = json.loads(SCHEMA_PATH.read_text())
        jsonschema.validate(package, schema)
        return True, []
    except ImportError:
        # Basic validation if jsonschema not available
        errors = []
        if "package_id" not in package:
            errors.append("missing package_id")
        if "timestamp" not in package:
            errors.append("missing timestamp")
        if "posts" not in package or not package["posts"]:
            errors.append("missing or empty posts")
        if "source" not in package:
            errors.append("missing source")
        return len(errors) == 0, errors
    except Exception as e:
        return False, [str(e)]


def sign_package(package: dict) -> str:
    """Sign package payload for integrity verification."""
    payload = json.dumps(package, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode()).hexdigest()


def publish_package(package: dict, dry_run: bool = False) -> dict:
    """Publish package to UniTeia import endpoint."""
    if not UNITEIA_API_KEY and not dry_run:
        return {"status": "error", "error": "UNITEIA_API_KEY not set"}

    # Validate
    valid, errors = validate_package(package)
    if not valid:
        return {"status": "error", "error": f"Schema validation failed: {'; '.join(errors)}"}

    # Sign
    package["signature"] = sign_package(package)

    if dry_run:
        print(f"[DRY RUN] Package {package['package_id']} validated OK")
        print(f"  Posts: {len(package['posts'])}")
        print(f"  Assets: {len(package.get('assets', []))}")
        print(f"  Signature: {package['signature'][:16]}...")
        return {"status": "dry_run", "package_id": package["package_id"]}

    # Send with retry
    for attempt in range(MAX_RETRIES):
        try:
            req = urllib.request.Request(
                UNITEIA_API_URL,
                data=json.dumps(package).encode(),
                headers={
                    "Authorization": f"Bearer {UNITEIA_API_KEY}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = json.loads(resp.read())
                return {"status": "success", "package_id": package["package_id"], "response": result}

        except urllib.error.HTTPError as e:
            if e.code == 429:
                delay = BASE_DELAY * (2 ** attempt)
                print(f"  Rate limited. Retrying in {delay}s (attempt {attempt+1}/{MAX_RETRIES})")
                time.sleep(delay)
                continue
            elif e.code in (500, 503):
                delay = BASE_DELAY * (2 ** attempt)
                print(f"  Server error {e.code}. Retrying in {delay}s")
                time.sleep(delay)
                continue
            else:
                return {"status": "error", "error": f"HTTP {e.code}: {e.read().decode()[:200]}"}

        except urllib.error.URLError as e:
            delay = BASE_DELAY * (2 ** attempt)
            print(f"  Connection error. Retrying in {delay}s")
            time.sleep(delay)
            continue

        except Exception as e:
            return {"status": "error", "error": str(e)}

    return {"status": "error", "error": f"Max retries ({MAX_RETRIES}) exceeded"}


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Hermes Content Publisher (M1)")
    parser.add_argument("--package", type=str, help="Path to full package JSON")
    parser.add_argument("--posts", type=str, help="Path to posts JSON array")
    parser.add_argument("--assets", type=str, default=None, help="Path to assets JSON array")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, no send")
    args = parser.parse_args()

    print(f"╔══ Hermes Content Publisher (M1) ══╗")
    print(f"║ mode={'dry-run' if args.dry_run else 'live'}")

    if args.package:
        with open(args.package) as f:
            package = json.load(f)
        print(f"📦 Loaded package from: {args.package}")
    elif args.posts:
        with open(args.posts) as f:
            posts = json.load(f)
        assets = []
        if args.assets:
            with open(args.assets) as f:
                assets = json.load(f)
        package = build_package(posts, assets)
        print(f"📦 Built package: {package['package_id']}")
    else:
        print("❌ Either --package or --posts required")
        return 1

    # Validate
    valid, errors = validate_package(package)
    if not valid:
        print(f"❌ Schema validation failed: {'; '.join(errors)}")
        return 1
    print(f"✅ Schema validation passed ({len(package['posts'])} posts)")

    # Publish
    result = publish_package(package, dry_run=args.dry_run)
    print(f"  Status: {result['status']}")
    if result.get("package_id"):
        print(f"  Package ID: {result['package_id']}")
    if result.get("error"):
        print(f"  Error: {result['error']}")

    return 0 if result["status"] in ("success", "dry_run") else 1


if __name__ == "__main__":
    sys.exit(main())
