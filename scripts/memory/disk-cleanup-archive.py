#!/usr/bin/env python3
"""
scripts/memory/disk-cleanup-archive.py — Fase 4: Disk cleanup + L4 compression

Scans home for:
  1. Old session logs (>7d): archive to meta/archive/
  2. Large raw files (>10MB): suggest deletion
  3. Duplicate CONNECTED.md, AGENTS.md in projects: flag
  4. Old PLANOs in ~/Downloads: move to ~/Documentos/PLANOS/

Usage:
  python3 scripts/memory/disk-cleanup-archive.py --dry-run
  python3 scripts/memory/disk-cleanup-archive.py --auto  # actually moves/deletes

Gate: Disk freed > 5GB or report if not
"""

import os
import sys
import json
import shutil
import gzip
from datetime import datetime, timezone, timedelta
from pathlib import Path

HOME = Path.home()
REPO_ROOT = HOME / "uniteia-v2"
ARCHIVE_DIR = REPO_ROOT / "meta" / "archive"
PLANOS_DST = HOME / "Documentos" / "PLANOS"

SIZE_THRESHOLD_MB = 10
SESSION_LOG_AGE_DAYS = 7

CLEANUP_TARGETS = [
    # Format: (glob_pattern, category, action)
    ("session-ses_*.md", "session_logs", "archive_gzip"),
    ("*.zip", "archives", "suggest_delete"),
    ("*.png", "images", "suggest_delete"),
    ("session-ses_*.md", "uniteia_build_cache"),
]


def get_size_mb(path: Path) -> float:
    return path.stat().st_size / (1024 * 1024)


def scan_for_cleanup() -> dict:
    """Scan home for cleanup candidates."""
    candidates = {
        "session_logs": [],
        "large_archives": [],
        "large_images": [],
        "old_planos_in_downloads": [],
        "stale_logs": [],
        "duplicate_configs": [],
    }

    # Session logs in ~/
    for f in HOME.glob("session-ses_*.md"):
        age_days = (datetime.now() - datetime.fromtimestamp(f.stat().st_mtime)).days
        size = get_size_mb(f)
        candidates["session_logs"].append({
            "path": str(f), "size_mb": round(size, 1), "age_days": age_days
        })

    # Large archives in ~/
    for f in HOME.glob("*.zip"):
        size = get_size_mb(f)
        candidates["large_archives"].append({
            "path": str(f), "size_mb": round(size, 1)
        })

    # Large images in ~/
    for f in HOME.glob("*.png"):
        size = get_size_mb(f)
        if size > 1:
            candidates["large_images"].append({
                "path": str(f), "size_mb": round(size, 1)
            })

    # PLANOs in Downloads
    downloads = HOME / "Downloads"
    if downloads.exists():
        for f in downloads.glob("PLANO-*.md"):
            age = (datetime.now() - datetime.fromtimestamp(f.stat().st_mtime)).days
            candidates["old_planos_in_downloads"].append({
                "path": str(f), "age_days": age
            })

    # Stale logs (playwright, etc.)
    for f in HOME.glob("playwright-mcp-server.log*"):
        size = get_size_mb(f)
        if size > 0.1:
            candidates["stale_logs"].append({
                "path": str(f), "size_mb": round(size, 1)
            })

    return candidates


def archive_session_log(paths: list[dict], dry_run: bool) -> tuple[int, int]:
    """Compress old session logs to meta/archive/. Returns (count, bytes_saved)."""
    archived = 0
    bytes_saved = 0
    for entry in paths:
        fpath = Path(entry["path"])
        if entry["age_days"] < SESSION_LOG_AGE_DAYS:
            continue
        if not fpath.exists():
            continue

        size = fpath.stat().st_size
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_name = f"{fpath.stem}-{timestamp}.gz"
        archive_path = ARCHIVE_DIR / archive_name

        if dry_run:
            print(f"  [DRY] Would archive: {fpath.name} ({entry['size_mb']}MB)")
            archived += 1
            bytes_saved += size
            continue

        # Compress
        with open(fpath, "rb") as fin, gzip.open(archive_path, "wb") as fout:
            shutil.copyfileobj(fin, fout)

        # Remove original
        fpath.unlink()
        archived += 1
        bytes_saved += size
        print(f"  ✅ Archived {fpath.name} -> {archive_path.name} ({entry['size_mb']}MB)")

    return archived, bytes_saved


def move_planos(paths: list[dict], dry_run: bool) -> int:
    """Move PLANOs from Downloads to Documentos/PLANOS/."""
    moved = 0
    for entry in paths:
        src = Path(entry["path"])
        dst = PLANOS_DST / src.name

        if dry_run:
            print(f"  [DRY] Would move: {src.name} -> {dst}")
            moved += 1
            continue

        shutil.move(str(src), str(dst))
        moved += 1
        print(f"  ✅ Moved {src.name} -> Documentos/PLANOS/")

    return moved


def main():
    import argparse
    parser = argparse.ArgumentParser(description="P2 Fase 4: Disk Cleanup + L4 Compression")
    parser.add_argument("--dry-run", action="store_true", help="Preview only", default=True)
    parser.add_argument("--auto", action="store_true", help="Actually execute cleanup")
    args = parser.parse_args()

    dry_run = not args.auto  # Default to dry-run unless --auto
    if args.auto:
        dry_run = False

    print(f"╔══ P2 Fase 4: Disk Cleanup ══╗")
    print(f"║ mode={'AUTO' if not dry_run else 'DRY-RUN'}")
    print(f"╚═══════════════════════════════╝")

    candidates = scan_for_cleanup()

    print(f"\n📊 Scan results:")
    for cat, items in candidates.items():
        if items:
            total_mb = sum(i.get("size_mb", 0) for i in items if "size_mb" in i)
            unit = "MB" if total_mb > 0 else "files"
            print(f"  {cat}: {len(items)} items ({total_mb:.0f} {unit})")

    total_freed = 0

    # 1. Archive session logs
    if candidates["session_logs"]:
        print(f"\n📦 Archiving session logs (>={SESSION_LOG_AGE_DAYS}d)...")
        count, saved = archive_session_log(candidates["session_logs"], dry_run)
        total_freed += saved

    # 2. Move PLANOs from Downloads
    if candidates["old_planos_in_downloads"]:
        print(f"\n📄 Moving PLANOs from Downloads...")
        moved = move_planos(candidates["old_planos_in_downloads"], dry_run)
        if moved:
            print(f"  {'Moved' if not dry_run else 'Would move'} {moved} files")

    # 3. Suggest large file deletion
    if candidates["large_archives"]:
        print(f"\n⚠ Large archives (suggest review):")
        for a in candidates["large_archives"]:
            print(f"  {a['path']} ({a['size_mb']}MB)")

    if candidates["large_images"]:
        print(f"\n⚠ Large images (suggest review):")
        for a in candidates["large_images"]:
            print(f"  {a['path']} ({a['size_mb']}MB)")

    # 4. Stale logs
    if candidates["stale_logs"]:
        print(f"\n🗑 Stale logs:")
        for a in candidates["stale_logs"]:
            if dry_run:
                print(f"  [DRY] Would delete: {a['path']} ({a['size_mb']}MB)")
            else:
                Path(a["path"]).unlink(missing_ok=True)
                print(f"  ✅ Deleted: {a['path']} ({a['size_mb']}MB)")
                total_freed += int(a["size_mb"] * 1024 * 1024)

    total_mb = total_freed / (1024 * 1024) if total_freed > 0 else 0
    if dry_run:
        print(f"\n[DRY RUN] Potential space to free: {total_mb:.1f} MB")
        print("Run with --auto to execute")
    else:
        print(f"\n✅ Cleanup complete. Freed: {total_mb:.1f} MB")

    return 0


if __name__ == "__main__":
    sys.exit(main())
