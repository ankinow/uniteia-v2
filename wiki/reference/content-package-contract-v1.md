# Content Package Contract v1 — Hermes→UniTeia
# PLANO-070 M1+M2 specification

## Overview

Content Package Contract v1 defines the machine-to-machine API contract between
Hermes content pipeline (daily_ops.py) and UniTeia-v2 editorial platform.

## Files

| File | Purpose | Status |
|------|---------|--------|
| `memory/schema/content-package-v1.json` | JSON Schema v7 lock | ✅ committed |
| `scripts/api/content_publish.py` | M1: Hermes publisher | ✅ committed |
| `src/routes/api/content/import/index.ts` | M2: UniTeia import endpoint | ✅ committed |

## Schema

- `$id`: https://hermes.lermf.org/schemas/content-package-v1.json
- Version: v1
- Max posts/package: 10
- Max content/post: 50KB
- Languages: pt, en, es, fr, de, it, ja, zh

## Auth

- Flow: Client Credentials (OAuth 2.1)
- Header: `Authorization: Bearer <JWT>`
- Scope: `content:import`
- MVP: accepts any non-empty signature

## Rate Limiting

- 10 packages/hour per client
- 429 response with retry_after_seconds
- Exponential backoff: 2^N minutes, max 5 retries

## Test Commands

```bash
# Validate schema
python3 scripts/api/content_publish.py --dry-run --posts=tests/fixtures/sample-posts.json

# Full flow (MVP)
curl -X POST https://uniteia.com/api/content/import \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"package_id":"test-001","timestamp":"2026-05-30T00:00:00Z","source":{"agent":"test","version":"v1.0.0","pipeline":"test"},"posts":[{"post_id":"post-001","slug":"hello-world","title":"Hello World Test Article","content":"Content body with at least 100 characters for schema validation purposes.","lang":"pt","category":"default"}],"signature":"test"}'
```

## Next Steps (PLANO-071)
- M3: Image pipeline (nim_flux_gen.py --format=uniteia-assets)
- JWT integration with Hermes key pair
- SSG rebuild trigger on import
- Production rate limiting (CF KV)
