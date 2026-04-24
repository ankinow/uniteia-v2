# External Integrations

## Cloud Infrastructure
- **Provider:** Cloudflare
- **Services:**
  - Cloudflare Pages (Hosting for `apps/orchestrator`)
  - Cloudflare D1 (Database - SQLite at the edge)
  - Cloudflare Workers AI (Inference - mentioned in README)

## AI Providers
(Inferred from `packages/ai-core` and README descriptions)
- **Primary:** Cloudflare Workers AI
- **External APIs:**
  - OpenAI (via API Key)
  - Anthropic (via API Key)

## Database
- **Primary:** SQLite (Cloudflare D1) managed via Drizzle ORM

## Secrets & Config
- **Environment Variables:**
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_API_TOKEN`
  - `ADMIN_API_KEY`
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `DATABASE_URL`

## Internal Ecosystem
- **UniTeiaAI:** The parent ecosystem this project serves.
- **Legacy Systems:** `packages/ai-core/legacy_migration` indicates integration with Rust/Python components (Neofuse).
