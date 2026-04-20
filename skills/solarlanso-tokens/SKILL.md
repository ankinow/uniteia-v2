---
name: solarlanso-tokens
description: Color palette (void/cyan/vine/bronze/bone) + motion tokens for UniTeia
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# SolarLanso Tokens

Design tokens for UniTeia — colors, motion, typography.

## Surfaces

```
void: #0D1117 (primary bg)
deep: #161B22 (surface)
mid: #21262D (raised)
raised: #30363D (borders)
```

## Cyan (Action)

```
base: #00E0FF
hi: #00FFFF
fade: rgba(0,224,255,0.10)
glow: rgba(0,224,255,0.40)
oklch: oklch(0.85 0.18 210)
```

## Vine (Verified)

```
glow: #5CD68F
oklch: oklch(0.78 0.18 145)
```

Use for: verified sources, success states, quality indicators.

## Bronze (Curation)

```
bright: #C8A56D
oklch: oklch(0.72 0.09 75)
```

Use for: curation accents, evidence IDs, JRPG whisper.

## Bone (Text)

```
base: #F0E8D8
cream: #E8DCC8
muted: #8B949E
```

Contrast ratio: **15.2:1** (AAA).

## Motion Tokens

```
t-fast: 120ms
t-base: 200ms
t-slow: 250ms
ease: cubic-bezier(.2,.8,.2,1)
```

## Location

Externalized in `uno-presets/solarlanso.ts` for refinability.
