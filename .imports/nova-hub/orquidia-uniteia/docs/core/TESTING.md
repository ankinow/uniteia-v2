# Testing Strategy

## Framework
- **Runner:** Bun Test (`bun:test`)
- **Execution:** `bun run test` (triggers `turbo run test`)

## Structure
- Tests are likely co-located with source files or in `__tests__` directories within each package/app.
- Each workspace (`apps/*`, `packages/*`) has its own test script invoked by Turbo.

## CI/CD
- **Type Checking:** `turbo run typecheck` runs `tsc` across all workspaces.
- **Linting:** `biome check .` ensures code quality before tests.
- **Validation:** `tools/guardian` appears to be a custom pre-flight check tool.

## Coverage
- Turbo is configured to capture coverage outputs (`outputs: ["coverage/**"]`).
