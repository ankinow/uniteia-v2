# QA_LINK_PATH_AGENT.md

## Rules for Link/Path Audits

1. Every URL in production code must be reachable:
   - GitHub URLs must use correct owner/repo
   - Tencent Cloud promo URLs must resolve to active campaigns
   - Internal paths must match route structure

2. Check these patterns:
   - `github.com/uniteia/uniteia-v2` → `github.com/ankinow/uniteia-v2`
   - `tencentcloud.com/free` → `tencentcloud.com/act/pro/promo` (verified working)
   - `/{lang}` → `/{lang}/n` (redirect target)

3. Validation tools:
   - `scripts/p0-smoke-test.mjs` — HTML audit + source audit
   - `bun run slug:check` — slug validation
   - `bun run content:check` — content schema validation
