# Architecture

## System Design
The system follows a modern edge-native monorepo architecture designed for high-performance AI orchestration.

### Layers

1.  **Presentation & API Layer (`apps/orchestrator`)**
    *   **Tech:** TanStack Start, React, Hono/Nitro (implied by Vinxi).
    *   **Role:** Serves the UI and exposes API endpoints for orchestration control.
    *   **Deployment:** Cloudflare Pages (Edge).

2.  **Logic Layer (`packages/ai-core`)**
    *   **Role:** Encapsulates the core intelligence and agent orchestration logic.
    *   **Features:** Multi-provider support, legacy migration bridges (Rust/Python).

3.  **Data Layer (`packages/db`)**
    *   **Tech:** Drizzle ORM.
    *   **Role:** Defines database schemas and data access patterns.
    *   **Storage:** Cloudflare D1 (SQLite).

4.  **Contract Layer (`packages/shared`)**
    *   **Role:** Shared types, interfaces, and Zod validation schemas to ensure type safety across the full stack.

### Data Flow
1.  Requests hit `apps/orchestrator`.
2.  Input validation using Zod schemas from `packages/shared`.
3.  Orchestrator invokes agents via `packages/ai-core`.
4.  State and results are persisted using `packages/db`.

### Key Abstractions
- **Workspaces:** Strict separation between apps and packages.
- **Edge Native:** Architecture is optimized for Cloudflare's edge runtime (minimal cold starts, D1 access).
