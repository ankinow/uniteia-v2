# Codebase Structure

## Directory Layout

```
PROJETOS-2026-SOTA/Orquidia-uniteia/
├── apps/                          # Deployable applications
│   └── orchestrator/              # Main TanStack Start application
├── packages/                      # Internal shared libraries
│   ├── ai-core/                   # AI logic and orchestration
│   ├── db/                        # Database schemas and Drizzle config
│   └── shared/                    # Shared Types and Zod schemas
├── tools/                         # Maintenance and verification tools
│   └── guardian/                  # Validation scripts
├── .planning/                     # Project documentation (GSD)
├── biome.json                     # Linter/Formatter configuration
├── bunfig.toml                    # Bun runtime configuration
├── package.json                   # Root workspace configuration
├── turbo.json                     # Turborepo build pipeline
└── tsconfig.json                  # Base TypeScript configuration
```

## Key Locations
- **API/Frontend Entry:** `apps/orchestrator/src/`
- **Database Schema:** `packages/db/src/schema.ts` (Typical Drizzle pattern)
- **Shared Types:** `packages/shared/src/`
- **AI Logic:** `packages/ai-core/src/`

## Naming Conventions
- **Packages:** `@orquestra/*` (scoped)
- **Directories:** kebab-case
- **Workspaces:** Defined in `package.json` under `workspaces`
