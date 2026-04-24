# AGENTS.md — Orquidia Uniteia Development Guide

Owner: `lermf` | Stack: Bun/TypeScript + Cloudflare Workers/Pages + Rust/WASM

AI-powered content orchestration for Uniteia platform - content generation, management, and distribution workflow automation.

## Build / Lint / Test Commands

### Root Commands (Turbo Monorepo)
| Action | Command |
|--------|---------|
| Install | `bun install` |
| Dev | `bun run dev` or `bun run dev --filter @orquestra/orchestrator` |
| Build | `bun run build` or `bun run build --filter @orquestra/ai-core` |
| Type Check | `bun run typecheck` |
| Test All | `bun run test` |
| Lint | `bun run check` (Biome lint + organize imports) |
| Format | `bun run format` (Biome auto-format) |
| Clean | `bun run clean` |

### Single Test Commands
```bash
# Test specific file
bun test packages/ai-core/scripts/test.ts

# Test specific package
bun test --cwd packages/shared

# Test with pattern
bun test --grep "ContentGenerator"
```

### App/Package Commands
```bash
cd apps/orchestrator && bun run dev          # Vite dev server
cd apps/orchestrator && bun run deploy       # Deploy to Cloudflare Pages
cd packages/ai-core && bun run build:rust    # Build WASM module
cd packages/ai-core && bun run start:a2a     # Start A2A server
```

## Code Style Guidelines

### TypeScript (Bun Runtime)
```typescript
// 2 spaces, no semicolons, single quotes, ESM only
import { z } from 'zod'                     // 1. External deps
import { utils } from '@orquestra/shared'    // 2. Workspace packages
import { helper } from './lib/helper'        // 3. Relative imports

// Use interfaces for shapes, explicit return types
interface Result {
  success: boolean
  data?: unknown
  error?: string
}

export async function process(input: Input): Promise<Result> {
  try {
    return { success: true, data: result }
  } catch (error) {
    console.error('[MODULE] Failed:', error)
    return { success: false, error: error.message }
  }
}
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `content-pipeline.ts` |
| Components | PascalCase | `ProductCard.tsx` |
| Functions | camelCase | `createWorkflow()` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGES` |
| Types | PascalCase | `WorkflowConfig` |
| Database | snake_case | `content_item` |

### Biome Config (biome.json)
- **Indent**: 2 spaces, **Line width**: 100, **Quotes**: single
- **Trailing commas**: all, **Semicolons**: asNeeded, **Line endings**: LF

### Error Handling Pattern
```typescript
try {
  // Validate with Zod first
  const data = Schema.parse(input)
  return { success: true, data: result }
} catch (error) {
  console.error('[MODULE] Action failed:', error)
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  }
}
```

### Server Actions (TanStack Start)
```typescript
export const actionName = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }: { data: InputType }) => {
    // Implementation with try/catch
  })
```

### Rust/WASM (Edge)
```rust
// Cargo.toml: edition 2024, lto, panic = abort
use wasm_bindgen::prelude::*;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum InferenceError {
  #[error("model error: {0}")]
  ModelError(String),
}
```

## Monorepo Structure
```
├── apps/
│   └── orchestrator/          # Cloudflare Pages app
├── packages/
│   ├── ai-core/               # AI providers, agents, WASM
│   ├── shared/                # Types, constants, utils
│   └── db/                    # Database schema, queries
└── tools/
    └── guardian/              # Validation scripts
```

## Path Aliases (tsconfig.json)
```typescript
import { types } from '@orquestra/shared'
import { ai } from '@orquestra/ai-core'
import { db } from '@orquestra/db'
```

## Environment Variables
- Copy `.env.example` → `.env` for local dev
- Never commit `.env` files
- Use `wrangler secret put` for production secrets

## CI/CD Pipeline

### GitHub Actions (auto-deploy on push to main)
| Workflow | Trigger | Actions |
|----------|---------|---------|
| `.github/workflows/ci.yml` | push PR | Lint → Typecheck → Build → Guardian |
| `.github/workflows/deploy.yml` | push main | Lint → Build → Deploy to Cloudflare Pages |

### Secrets Required (GitHub)
```
CLOUDFLARE_API_KEY      # For wrangler deploy
CLOUDFLARE_ACCOUNT_ID   # For wrangler deploy
CLOUDFLARE_EMAIL        # For wrangler deploy
GEMINI_API_KEY          # For AI content generation
```

### Manual Deploy
```bash
cd apps/orchestrator
bun run deploy
```

## Dual Content Creation Workflow

### Method 1: Codespace Aurora (LOCAL)
- **Access**: `gh codespace ssh -c sota-aurora-test-69r9p59949x9c45pr`
- **Path**: `/workspaces/projects/uniteia/`
- **Workflow**: Edit content locally → Push to GitHub → CI deploys
- **Best for**: Manual content editing, bulk content generation

### Method 2: Orquidia Orchestrator (CLOUD)
- **URL**: `https://d7c42058.orquidia-orchestrator.pages.dev`
- **Workflow**: Use AI agents pipeline via orchestrator UI
- **Best for**: AI-powered content generation, automated pipeline

### Both publish to:
- **D1 Database**: `uniteia-db` (ID: `8396cb37-422a-4ea4-ad16-16372cbc6224`)
- **KV Cache**: `uniteia-static-html` (ID: `a0ef60b33d3641799c7b608a82a2444e`)

## Definition of Done
- [ ] Tests pass (`bun test`)
- [ ] Lint clean (`bun run check`)
- [ ] Format OK (`bun run format`)
- [ ] Type check passes (`bun run typecheck`)
- [ ] No secrets leaked

---

## Deployment Status (2026-02-13)

### Orquidia Admin Dashboard
- **URL**: https://orquidia.lermf.org
- **Deployed**: Cloudflare Pages (orquidia-orchestrator)
- **Auth**: Cloudflare Access (gersonvida12@gmail.com)
- **AUD**: be0046ed41579fdff4a3d6a019721901597a633e11d3422f85fa7af7914f8aec

### D1 Database
- **Database**: uniteia-db
- **ID**: 8396cb37-422a-4ea4-ad16-16372cbc6224
- **Published Content**: 18 items

### Cloudflare Resources
- **Account ID**: 52024f99754ec4d76806e59dbd295098
- **Workers**: orquidia-production, uniteia-edge-gateway
- **Zones**: lermf.org, uniteia.com

### Git Repos (Aurora codespace)
-  - UniTeiaAI content portal
-  - Orquidia orchestrator

### MCP Servers (Local Machine)
| Server | Prefix | Purpose |
|--------|--------|---------|
| vault | vault_* | Bitwarden secrets |
| relace | relace_* | Code merge/analyze |
| qdrant-cold-storage | qdrant-cold-storage_* | Vector memory |
| context7 | context7_* | Documentation lookup |
| sequential-thinking | sequential-thinking_* | Reasoning chains |
| elenhub | elenhub_* | Gateway tools |
| agent-tools-mcp | agent-tools-mcp_* | Browser/fs/screenshot |
| sota-hub | sota-hub_* | Task coordination |

## Deployment Status (2026-02-13)

### Orquidia Admin Dashboard
- URL: https://orquidia.lermf.org
- Deployed: Cloudflare Pages
- Auth: Cloudflare Access
