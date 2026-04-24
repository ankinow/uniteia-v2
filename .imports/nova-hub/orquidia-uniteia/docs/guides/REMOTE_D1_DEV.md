# Development with D1 Remote (wrangler dev --remote)

SOTA 2026: Use Cloudflare D1 database in local development.

## Quick Start

```bash
# 1. Authenticate with Cloudflare (if not already)
npx wrangler login

# 2. Start development server with remote D1 access
cd apps/orchestrator
npx wrangler dev --remote

# 3. Open http://localhost:8976 (wrangler dev port)
```

## How It Works

- `--remote` flag makes wrangler dev use **production D1 database**
- All DB queries run against real database in Cloudflare
- No local SQLite or mock data
- Changes persist in production DB

## Benefits

| Feature | Without --remote | With --remote |
|---------|------------------|---------------|
| Data | Mock/fake | Real production data |
| Schema changes | May be out of sync | Always current |
| Debugging | Limited | Full production-like |

## Requirements

1. **Cloudflare authentication**
   ```bash
   npx wrangler whoami  # Verify login
   ```

2. **D1 database configured**
   - Database: `uniteia-db` (ID: 8396cb37-422a-4ea4-ad16-16372cbc6224)
   - Binding: `DB` in wrangler.jsonc

3. **GEMINI_API_KEY configured** (for AI features)
   ```bash
   npx wrangler secret put GEMINI_API_KEY --name orquidia-admin
   ```

## Troubleshooting

### "Database not available" error

```bash
# Verify D1 binding
npx wrangler d1 execute uniteia-db --command="SELECT 1" --remote

# Check wrangler.jsonc has correct binding
cat wrangler.jsonc | grep -A5 '"d1_databases"'
```

### Port conflict

```bash
# Default port is 8976, change with:
npx wrangler dev --remote --port 3000
```

### Slow responses

Remote D1 may be slower than local. Consider:
- Add indexing to frequently queried columns
- Cache expensive queries in KV

## Alternative: Local D1

For faster development without hitting production:

```bash
# Create local D1 from production dump
npx wrangler d1 execute uniteia-db --local --file=./schema.sql

# Start with local database
npx wrangler dev
```

## Environment Variables

Secrets are loaded from Cloudflare Secrets, not .env files:

| Secret | Purpose | Set Command |
|--------|---------|-------------|
| GEMINI_API_KEY | AI content generation | `wrangler secret put GEMINI_API_KEY` |
| WORKERS_AI_TOKEN | Fallback AI provider | `wrangler secret put WORKERS_AI_TOKEN` |
| OPENROUTER_API_KEY | Backup AI provider | `wrangler secret put OPENROUTER_API_KEY` |

## Current Status

- ✅ D1 binding configured in wrangler.jsonc
- ✅ All mock data removed from UI
- ✅ UI shows error messages when DB unavailable
- ⏳ Tests pending with `wrangler dev --remote`
