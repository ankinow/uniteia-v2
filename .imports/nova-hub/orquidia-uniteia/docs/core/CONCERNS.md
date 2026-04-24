# Concerns & Technical Debt

## Stability & Bleeding Edge
- **TanStack Start:** This is a very new/beta framework. Breaking changes are likely.
- **Bun:** While fast, edge cases in compatibility with specific Node.js APIs may arise.

## Legacy Migration
- **Reference:** `packages/ai-core/legacy_migration/`
- **Risk:** Integration with "Rust + Python cores (neofuse)" suggests complex interop that could be fragile or difficult to debug in a pure JS/TS environment.

## Security
- **Secrets:** High reliance on environment variables for API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.). Ensure these are never committed.
- **Access:** Database is edge-based (D1); access control rules in the application layer must be strict.

## Performance
- **Cold Starts:** While Cloudflare Workers are fast, loading heavy AI libraries or WASM modules (from the legacy core) could introduce latency.
- **Database:** D1 is eventually consistent in some modes; verify read-after-write requirements.
