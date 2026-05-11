---
name: demo-api-fixture-ingestion
description: Create safe demo-only API fixtures for testing UniTeia-v2 ingestion, validation, static artifacts, visual blocks, MDX drafts, cache and error fallbacks
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
---

# Demo API Fixture Ingestion

Safe patterns for integrating external APIs as demo-only fixtures in UniTeia-v2. Use for testing ingestion pipelines, Zod validation, static artifact generation, and visual preview blocks without polluting production content.

## Trigger

Activate this skill when a task touches:

- External API adapters
- Source registry entries
- Fetch/cache logic
- External images or media
- Zod schemas for external data
- Static artifact envelopes
- MDX generation or draft preview
- Fallback states and error handling
- i18n validation for external content

## Safety Contract

All demo API fixtures MUST enforce:

```yaml
draft_only: true
production_publish: false
trust_level: low_demo
search_index: false
canonical_content: false
```

Demo fixtures are NEVER:
- Indexed by search engines
- Published as canonical wiki content
- Treated as verified sources
- Cached permanently without TTL
- Used as primary content

## Pipeline

```
External API
    ↓
fetch with timeout (5s default)
    ↓
Zod validation (strict)
    ↓
normalized snapshot
    ↓
static artifact envelope
    ↓
MDX draft/demo route
    ↓
visual preview
    ↓
quality gates
```

## Adapter Pattern

All demo adapters follow this structure:

```ts
// src/adapters/demo/{name}.ts
import { z } from "zod";

// 1. Schema definition
export const {Name}Schema = z.object({
  // strict validation
});

export type {Name}Data = z.infer<typeof {Name}Schema>;

// 2. Fetch function with DI
export async function fetch{Name}(
  fetcher: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<{Name}Data> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  
  try {
    const res = await fetcher(API_URL, {
      signal: signal ?? controller.signal,
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`{Name} API failed: ${res.status}`);
    }

    const json = await res.json();
    return {Name}Schema.parse(json);
  } finally {
    clearTimeout(timeout);
  }
}

// 3. Local fixture fallback
export function get{Name}Fallback(): {Name}Data {
  return FALLBACK_FIXTURE;
}

// 4. Safe wrapper with fallback
export async function fetch{Name}Safe(
  fetcher: typeof fetch = fetch,
): Promise<{ data: {Name}Data; fromCache: boolean }> {
  try {
    const data = await fetch{Name}(fetcher);
    return { data, fromCache: false };
  } catch {
    return { data: get{Name}Fallback(), fromCache: true };
  }
}
```

## Directory Structure

```
src/
├── adapters/
│   └── demo/
│       ├── {name}.ts           # Adapter + schema
│       └── {name}.fixture.json # Local fallback data
├── routes/
│   └── ops-lab/
│       └── api-fixtures/
│           └── {name}/
│               └── index.tsx   # Demo preview route
```

## Fixture File Format

```json
{
  "$meta": {
    "source": "https://api.example.com/endpoint",
    "captured_at": "2026-05-11T00:00:00Z",
    "purpose": "local fallback for offline/timeout",
    "draft_only": true
  },
  "data": {
    // ... actual fixture data matching schema
  }
}
```

## Registry Entry Pattern

```yaml
# config/demo-sources.yaml
sources:
  - id: {name}-api
    name: "{Name} API"
    kind: demo_api
    url: https://api.example.com
    trust_level: low_demo
    purpose:
      - test_external_api_ingestion
      - test_image_pipeline
      - test_schema_validation
      - test_static_artifact_generation
    policy:
      publish: draft_only
      production_index: false
      canonical_content: false
      search_index: false
    cache:
      ttl_seconds: 86400
    output:
      artifact_type: demo_api_snapshot
```

## Quality Gates

Every demo fixture integration MUST pass:

| Gate | Description | Required |
|------|-------------|----------|
| `schema:valid` | Zod schema validates response | Yes |
| `timeout:handled` | 5s timeout with graceful fallback | Yes |
| `fallback:works` | Local fixture loads when API fails | Yes |
| `cache:bounded` | TTL is set (max 24h for demos) | Yes |
| `image:validated` | Image URLs return valid responses | If applicable |
| `alt:exists` | Images have meaningful alt text | If applicable |
| `draft:enforced` | `draft_only: true` in all outputs | Yes |
| `index:blocked` | No production search indexing | Yes |
| `mdx:renders` | Preview route renders without error | Yes |
| `mobile:works` | Preview is responsive | Yes |

## Test Pattern

```ts
// src/adapters/demo/{name}.test.ts
import { describe, expect, it, vi } from 'vitest'
import {
  {Name}Schema,
  fetch{Name},
  fetch{Name}Safe,
  get{Name}Fallback,
} from './{name}'

describe('{name} adapter', () => {
  it('schema validates correct response', () => {
    const valid = { /* valid data */ }
    expect(() => {Name}Schema.parse(valid)).not.toThrow()
  })

  it('schema rejects invalid response', () => {
    const invalid = { /* invalid data */ }
    expect(() => {Name}Schema.parse(invalid)).toThrow()
  })

  it('fallback returns valid fixture', () => {
    const fallback = get{Name}Fallback()
    expect(() => {Name}Schema.parse(fallback)).not.toThrow()
  })

  it('safe wrapper returns fallback on timeout', async () => {
    const slowFetch = vi.fn().mockImplementation(
      () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 100)
      )
    )
    const result = await fetch{Name}Safe(slowFetch as any)
    expect(result.fromCache).toBe(true)
  })
})
```

## Output Contract

When integrating a demo API fixture, return:

```txt
Fixture Integration Report
──────────────────────────
Source: {API name and URL}
Adapter: src/adapters/demo/{name}.ts
Schema: {Name}Schema (Zod)
Fixture: src/adapters/demo/{name}.fixture.json
Demo Route: /ops-lab/api-fixtures/{name}/

Cache Behavior:
- TTL: {seconds}
- Fallback: local fixture

Fallback Behavior:
- Timeout: 5000ms
- On error: returns local fixture
- fromCache flag: true when using fallback

Draft-Only Guarantee:
- production_publish: false
- search_index: false
- trust_level: low_demo

Tests:
- [ ] schema:valid
- [ ] timeout:handled
- [ ] fallback:works
- [ ] cache:bounded
- [ ] draft:enforced

Risks:
- {List any concerns}
```

## Rules

1. **Never publish as production** — Demo fixtures are for internal testing only
2. **Always include fallback** — External APIs are unreliable
3. **Always validate with Zod** — Never trust external data
4. **Always set timeouts** — 5s default, configurable
5. **Always add alt text** — For any images from external APIs
6. **Keep dependency footprint near zero** — Use native fetch, no HTTP libraries
7. **Bound cache TTL** — Max 24h for demo fixtures
8. **Dependency inject fetch** — Enable testing without network

## Integration with Other Skills

This skill complements:

- `qwik-tailwind-discipline` — Component patterns
- `output-enforcement` — Complete implementations
- `solarlanso-tokens` — Visual styling for previews
- `web-platform-design-review` — UI review for demo routes
