# Orquidia-uniteia

> Intelligence Layer for UniTeiaAI - AI Content Orchestration Platform

Private monorepo for AI-powered content orchestration powering the UniTeiaAI educational/informational content ecosystem. Focuses on intelligent content generation, management, and distribution workflows.

## Architecture

```
Orquidia-uniteia/
├── apps/
│   └── orchestrator/          # TanStack Start + Cloudflare Pages
├── packages/
│   ├── ai-core/               # AI Agent orchestration logic
│   │   └── legacy_migration/  # Rust + Python cores (neofuse)
│   ├── db/                    # Drizzle ORM schemas (D1-ready)
│   └── shared/                # Zod schemas + TypeScript types
└── tools/                     # Internal tooling (guardian, scripts)
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun 1.3+ |
| Build | Turborepo |
| Lint/Format | Biome |
| Frontend | TanStack Start (React 18) |
| Backend | Vinxi/Nitro → Cloudflare Pages |
| Database | Drizzle ORM (D1 SQLite) |
| Validation | Zod |
| AI Core | Rust (WASM) + Python (DSPy) |

## Quick Start

```bash
# Install dependencies
bun install

# Development
bun run dev

# Build
bun run build

# Lint & Format
bun run lint
bun run format

# Deploy orchestrator
cd apps/orchestrator && bun run deploy
```

## Packages

### @orquestra/orchestrator
Main application - TanStack Start fullstack app deployed to Cloudflare Pages. Provides UI for content management, AI generation workflows, and Uniteia integrations.

### @orquestra/ai-core
AI agent orchestration logic with support for multiple providers (Workers AI, OpenAI, Anthropic, etc). Handles content generation, SEO optimization, and intelligent workflows.

### @orquestra/db
Database schemas using Drizzle ORM, ready for Cloudflare D1 (SQLite edge). Stores content items, user interactions, and generation metadata.

### @orquestra/shared
Shared TypeScript types and Zod validation schemas for content items, API contracts, and cross-package utilities.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
ADMIN_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
```

## Related Projects

- [UniTeiaAI](https://github.com/LERMF/UniTeiaAI) - Main platform (gateway, web, content)

## License

Private - All rights reserved.
