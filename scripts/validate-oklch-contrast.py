#!/usr/bin/env python3
"""
validate-oklch-contrast.py — WCAG AA/AAA contrast validator for OKLCH tokens.

Parses oklch() color values from src/global.css, converts to relative luminance,
and checks all foreground-background token pairs for WCAG compliance.

Usage:
  python3 scripts/validate-oklch-contrast.py
  python3 scripts/validate-oklch-contrast.py src/global.css --aa-only
"""

import re
import sys
import math
from pathlib import Path

# ── OKLCH → relative luminance (WCAG) ──

def oklch_to_linear_srgb(l: float, c: float, h: float) -> tuple[float, float, float]:
    hrad = math.radians(h)
    a = c * math.cos(hrad)
    b = c * math.sin(hrad)
    l_ = l + 0.3963377774 * a + 0.2158037573 * b
    m_ = l - 0.1055613458 * a - 0.0638541728 * b
    s_ = l - 0.0894841775 * a - 1.2914855480 * b
    def lab_to_linear(c: float) -> float:
        t = c ** 3
        return t if t > 0.008856 else (c - 16 / 116) / 7.787
    return (lab_to_linear(l_), lab_to_linear(m_), lab_to_linear(s_))

def relative_luminance(r: float, g: float, b: float) -> float:
    def channel(c: float) -> float:
        c = abs(c)
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def contrast_ratio(l1: float, l2: float) -> float:
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def parse_oklch(token: str) -> tuple[float, float, float] | None:
    m = re.match(r"oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)", token)
    if not m:
        return None
    l = float(m.group(1).rstrip("%")) / 100 if "%" in m.group(1) else float(m.group(1))
    c = float(m.group(2))
    h = float(m.group(3))
    return (l, c, h)

def parse_alpha(token: str) -> float:
    m = re.search(r"/\s*([\d.]+)", token)
    return float(m.group(1)) if m else 1.0

def extract_tokens(css_path: Path) -> dict[str, tuple[float, float, float, float]]:
    text = css_path.read_text()
    tokens: dict[str, tuple[float, float, float, float]] = {}
    for m in re.finditer(
        r'--([\w-]+):\s*oklch\(([^)]+)\)',
        text,
    ):
        name = m.group(1)
        oklch_str = f"oklch({m.group(2)})"
        parsed = parse_oklch(oklch_str)
        if not parsed:
            continue
        alpha = parse_alpha(oklch_str)
        l, c, h = parsed
        tokens[name] = (l, c, h, alpha)
    return tokens

# ── Known semantic groupings ──

SKIP_SUFFIXES = {"-glow", "-hi"}

FG_BASES = {
    "color-bone", "color-silver",
    "color-action", "color-verified", "color-curation",
    "color-coral", "color-acid", "color-gold", "color-safe",
    "color-caution", "color-unsafe", "color-cyan",
    "color-aether-indigo", "color-aether-amber", "color-aether-teal",
    "color-agent-moderator", "color-agent-researcher",
    "color-agent-writer", "color-agent-curator", "color-agent-analyst",
}

BG_BASES = {
    "color-void", "color-deep", "color-mid", "color-raised",
    "color-aether-parchment",
}

def classify(name: str) -> str:
    for suffix in SKIP_SUFFIXES:
        if name.endswith(suffix):
            return "other"
    if name in FG_BASES:
        return "fg"
    if name in BG_BASES:
        return "bg"
    if name.startswith("color-glass"):
        return "other"
    return "other"

def luminance(t: tuple[float, float, float, float]) -> float:
    _, _, _, alpha = t
    if alpha < 0.9:
        return 0.0
    l, c, h = t[:3]
    r, g, b = oklch_to_linear_srgb(l, c, h)
    return relative_luminance(r, g, b)

def main():
    css_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/global.css")
    aa_only = "--aa-only" in sys.argv

    if not css_path.exists():
        print(f"❌ File not found: {css_path}")
        sys.exit(1)

    tokens = extract_tokens(css_path)
    print(f"Found {len(tokens)} OKLCH tokens in {css_path}\n")

    fg_tokens = {n: t for n, t in tokens.items() if classify(n) == "fg"}
    bg_tokens = {n: t for n, t in tokens.items() if classify(n) == "bg"}

    if not bg_tokens:
        print("⚠️  No background tokens classified. Falling back to 'void' as bg.")
        bg_tokens = {n: t for n, t in tokens.items() if "void" in n}
        bg_tokens = bg_tokens or {n: t for n, t in tokens.items() if "deep" in n}

    failures = []
    for fg_name, fg_t in fg_tokens.items():
        fg_lum = luminance(fg_t)
        for bg_name, bg_t in bg_tokens.items():
            bg_lum = luminance(bg_t)
            cr = contrast_ratio(fg_lum, bg_lum)
            passes_aa = cr >= 4.5
            passes_aa_large = cr >= 3.0
            passes_aaa = cr >= 7.0
            if not passes_aa:
                failures.append((fg_name, bg_name, cr, "AA"))
            elif not passes_aa_large:
                failures.append((fg_name, bg_name, cr, "AA-large"))
            elif not passes_aaa and not aa_only:
                failures.append((fg_name, bg_name, cr, "AAA"))

    if failures:
        print(f"❌ {len(failures)} contrast failure(s):\n")
        for fg, bg, cr, level in failures:
            print(f"   {fg:30s} on {bg:30s} → {cr:.2f}:1  FAILS {level}")
        sys.exit(1)
    else:
        print("✅ All foreground-background pairs pass WCAG AA minimum (4.5:1).")
        sys.exit(0)

if __name__ == "__main__":
    main()
