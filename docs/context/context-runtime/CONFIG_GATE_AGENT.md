# CONFIG_GATE_AGENT.md

## Gate Configuration

v2 ship-check gates (in order):
1. `lint` — biome check .
2. `typecheck` — tsc --noEmit
3. `test:unit` — vitest run
4. `build` — generate:content-registry → qwik build
5. `header:single` — scripts/check-single-header.ts
6. `size:check` — scripts/size-gate.ts (threshold: 61,440)
7. `slug:check` — scripts/slug-lint.ts
8. `content:check` — validates content registry
9. `sitemap:check` — validates sitemap
10. `lighthouse:check` — performance audit
11. `smoke:200s` — URL reachability
12. `invalid-locale-404` — 404 for invalid locales

## Size Gate Policy
- Current threshold: 61,440 bytes (too low — content pipeline pushes to ~80KB)
- Decision: Baseline confirmed pre-existing (origin/main: 79,696 bytes)
- Recommended threshold: 87,040 bytes (85 * 1024)

## Correct Runner
- Use `bun run test:unit` for tests (vitest, 224/224)
- NOT `bun test` (native runner loads Playwright + content-factory = false failures)
