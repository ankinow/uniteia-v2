# Tech Stack

## Runtime & Environment
- **Runtime:** Bun 1.3+ (Active active development and local execution)
- **Package Manager:** Bun (Workspaces enabled)
- **Environment:** Cloudflare Pages / Workers (Edge Runtime)

## Build & Monorepo
- **Monorepo Tool:** Turborepo v2.7.5 (`turbo.json`)
- **Structure:** Bun Workspaces
- **Compiler:** TypeScript v5.7.0 (Strict mode enabled)

## Frontend & Fullstack (`apps/orchestrator`)
- **Framework:** TanStack Start (Beta/Bleeding edge)
- **Library:** React 18
- **Server:** Vinxi / Nitro
- **Target:** Cloudflare Pages

## Core Libraries (`packages/`)
- **Database:** Drizzle ORM (D1 SQLite compatible)
- **Validation:** Zod
- **AI Orchestration:** Internal `@orquestra/ai-core` (Rust WASM + Python DSPy integration points)

## Development Tools
- **Linting & Formatting:** Biome v1.9.4
- **Type Checking:** `tsc` (via Turbo)
- **Testing:** `bun test` (inferred from scripts)

## Configuration Files
- `bunfig.toml` - Bun configuration
- `turbo.json` - Build pipeline
- `biome.json` - Linter/Formatter config
- `tsconfig.json` - Base TypeScript config
