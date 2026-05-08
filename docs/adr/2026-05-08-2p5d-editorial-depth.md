# 2.5D Editorial Depth ADR

## Context

UniTeia v2 already has a distinct editorial/brutalist visual language, but the current niche landing page was still flat: section hierarchy was conveyed mostly by spacing and card repetition.

The codebase also has only 3 niches in `config/niches.yaml`, so virtualization, height caching, and scroll observers would be premature.

## Decision

- Add a lightweight, CSS-first depth system with two reusable Qwik wrappers:
  - `DepthSection` for plane-level sections.
  - `DepthCard` for inner editorial surfaces.
- Define shared `DepthPlane` types in `src/components/depth/types.ts`.
- Add plane-aware surface utilities in `src/global.css`.
- Pilot the system only on `src/components/niche-landing/index.tsx` (`/[lang]/n/[niche]`).
- Keep the niche index page as a simple grid.
- Do not add virtualization, infinite scroll, or height measurement hooks for niches.

## Consequences

- The editorial depth language is now available for future content surfaces without adding heavy runtime cost.
- The pilot surface gains hierarchy with no new dependencies.
- The implementation stays easy to remove or extend because the wrappers are focused and the CSS is global.

## Verification

- `bun run typecheck`
- `bun run lint`
- `bun run test:e2e -- tests/e2e/s08-editorial-depth.spec.ts`
- `bun run size:check`
