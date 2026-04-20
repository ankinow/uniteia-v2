---
name: anti-slop-content
description: No Jane Doe, no Acme, no 99.99%, no Elevate — reject AI-slop patterns
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
source: forked from Leonxlnx/taste-skill section 7
---

# Anti-Slop Content

Reject generic AI content patterns.

## Banned Names

- ❌ John Doe, Jane Doe
- ❌ Sarah Chan, Jack Su
- ❌ Any fictional persona

## Banned Companies

- ❌ Acme, Acme Corp
- ❌ Nexus, NexGen
- ❌ SmartFlow, TechCorp

## Banned Numbers

- ❌ 99.99% (success rate)
- ❌ 50% (improvement)
- ❌ 1234567 (fake ID)

## Banned Phrases

- ❌ Elevate your [X]
- ❌ Seamless integration
- ❌ Unleash the power of
- ❌ Next-generation
- ❌ Cutting-edge
- ❌ Game-changer

## Banned Images

- ❌ Unsplash direct URLs
- ✅ Use: `picsum.photos/seed/{random}` for placeholders
- ✅ Use: SVG UI avatars for profile pics

## Content Audit

Before submitting, check:

1. No banned names
2. No banned companies
3. No fake statistics
4. No promotional hyperbole
5. All claims sourced

## From taste-skill

Adopted from taste-skill section 7 (anti-slop content rules).
