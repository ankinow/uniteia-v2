# UniTeia v2 — Agent Fullstack Context

**Reader:** internal engineer or coding agent landing cold.

**Post-read action:** start the next unit of work without re-reading chat history, while preserving the real stack, the real gates, and the real blockers.

## What this project is

UniTeia v2 is a multilingual editorial platform built on Qwik City and Cloudflare Pages. It has two coupled layers:

1. A Qwik frontend that serves canonical, language-aware pages.
2. A deterministic content-factory direction that will turn one canonical content contract into blog, short-form, wiki, and prompt-seed outputs.

The project is optimized for edge delivery, resumability, strict release gates, and a distinctive brutalist/editorial visual language.

## Current stack truth

- Runtime and bundling: Bun + Vite
- Frontend framework: Qwik + Qwik City
- Styling engine: **TailwindCSS + PostCSS**
- Deployment target: Cloudflare Pages worker output
- Unit tests: Vitest
- Browser verification: Playwright
- Quality gates: lint, typecheck, unit tests, build, size gate, Lighthouse gate, browser verification, slug check, ship-check

### Styling status

The active app runs on **Tailwind**. 

Evidence in the repo today:
- Tailwind is wired into the Vite plugin chain.
- The styling config is driven by an active Tailwind config with presets and shortcuts.
- The package manifest depends on Tailwind presets.
- Project guidance declares Tailwind as the canonical styling engine.

## Verified state in this session

These statements were verified directly in this session:

- `bun run typecheck` passed.
- The earlier `playwright.config.ts` RegExp/string typecheck issue is fixed in v1.1 (2026-04-24) and is no longer an active red bar.
- The ship-check timeout hardening was implemented.
- Unit tests covering ship-check passed.
- A real timeout probe returned exit code `124` with `timedOut: true` and `SIGTERM`.
- The milestone database still shows M001 active, with all listed slices complete, while the overall milestone remains blocked by a remediation verdict.

## Not verified in this session

These statements were **not** re-measured in this session:

- Current Lighthouse score
- Current route-size gate output
- Current browser verification output
- Current end-to-end Playwright status

Some existing artifacts disagree on Lighthouse status. Treat Lighthouse as **baseline pending fresh measurement** until rerun.

## Gate truth model

This repository treats gates as the source of truth.

### If a gate is red

Do not claim the feature is done.

### If a gate is green but suspicious

Fix the gate before trusting the result.

### If a gate has not been run

Say it plainly: it was not run.

## What changed recently

The release gate was hardened so ship-check can now fail distinctly on timeout instead of hanging silently. That removes one false-confidence path from local and CI verification.

## Known live concerns

1. **Core Web Vitals is the next execution step.**
   - Do not start by guessing fixes.
   - Start by re-measuring the current baseline.
2. **The current milestone record is blocked by remediation state, not by missing slice rows.**
3. **Some project artifacts are stale.**
   - Any claim about Lighthouse being already fixed must be verified again before reuse.
4. **Styling strategy remains Tailwind-first.**
   - Do not plan work around UnoCSS.

## Content-factory direction

The content-factory is implemented as a manual-first app in `apps/content-factory/`. It follows a deterministic pipeline (Gather → Build → Render → Export) to turn one canonical content contract into wiki, blog, short-form script, and prompt-seed outputs.

The current state of the content-factory is:
- **Scaffold + Schema + Golden fixture** (v0) complete.
- **Engine (Gather, Build, Render, Export phases)** implemented and verified with Vitest.
- **CLI** fully functional.
- **Isolamento estrito** maintained (own Bun workspace).

## Next-step checklist: Real-content E2E (M004)

Before operationally validating M003, the factory must produce real artifacts end-to-end:

- [ ] Choose real entities (e.g., qwik-framework, bun-runtime).
- [ ] author sources.json for each.
- [ ] run generate, validate, lint, render, and export.
- [ ] Verify idempotence on export.
- [ ] Export 5 languages for at least one entity.

## Next-step checklist: Qwik audit remediation (M005)

Remediate existing RED gates in the Qwik app:

- [ ] Verify typecheck and build exit 0.
- [ ] Implement content loader schema validation.
- [ ] Configure marked with XSS sanitization.
- [ ] Fix E2E failures (duplicate H1, CLS issues in lang switcher).
- [ ] Improve lang cookie security (HttpOnly + Secure via server$).

## Release checklist for any next PR

- [ ] typecheck green
- [ ] lint green
- [ ] unit tests green
- [ ] browser verification green when relevant
- [ ] ship-check green
- [ ] Lighthouse rerun with recorded before/after numbers when performance is claimed
- [ ] no unresolved gate suspicion left behind
- [ ] content-factory tests green (cd apps/content-factory && bun run factory:test)

## Reader warnings

- Do not assume the docs are fresher than the repo. Verify live gates.
- UnoCSS is eliminated. The app is 100% Tailwind.
- Do not treat historical Lighthouse claims as current until rerun.
- Do not mark milestone closure from slice completion alone; remediation state still matters.

## Recommended next action

Execute M005 (Qwik audit remediation) to clean up red gates before proceeding to real-content production (M004) and performance optimization (M006).
