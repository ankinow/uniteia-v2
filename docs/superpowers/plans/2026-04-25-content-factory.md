# Content Factory Build Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Content Factory backend using the "Build Pack v0" specifications, starting with a strict sanitation of the Tailwind vs UnoCSS stack drift.

**Architecture:** 
1. Sanitation (S0): Consolidate Tailwind as the single CSS framework, eliminate UnoCSS, fix build errors.
2. Build Pack (S1-S8): Create isolated `apps/content-factory` with a 4-phase pipeline (Gather, Build, Render, Export), schema validations, and CLI tools without coupling to the main Qwik app.

**Tech Stack:** Bun, TypeScript, TailwindCSS, AJV (Schema), Handlebars, Vitest.

---

### Task S0: Sanitation (Tailwind consolidation & Bugfixes)

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/agent-fullstack-context.md`
- Modify: `tsconfig.json`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Patch AGENTS.md**
Update CSS stack to Tailwind + PostCSS, ban UnoCSS.

- [ ] **Step 2: Patch docs/agent-fullstack-context.md**
Replace UnoCSS references with Tailwind.

- [ ] **Step 3: Patch tsconfig.json**
Remove `"uno.config.ts"` from `include` array.

- [ ] **Step 4: Patch README.md**
Align tech stack block to Tailwind.

- [ ] **Step 5: Clean up package.json**
Remove `unocss`, `@unocss/preset-uno`, `@unocss/transformer-variant-group`, `unplugin-icons` if present.
Add `ignore` as a devDependency to fix the Qwik CLI build error.
Run: `bun install --frozen-lockfile`

- [ ] **Step 6: Verify S0 Gates**
Run: `bun run typecheck`
Run: `bun run build`

- [ ] **Step 7: Commit**
```bash
git add AGENTS.md docs/agent-fullstack-context.md tsconfig.json README.md package.json bun.lock
git commit -m "chore: execute S0 sanitation, consolidate Tailwind and fix build"
```

### Task S1-S2: Scaffold + Schema + Golden fixture

**Files:**
- Create: `apps/content-factory/package.json`
- Create: `apps/content-factory/tsconfig.json`
- Create: `apps/content-factory/biome.json`
- Create: `apps/content-factory/_engine/schema/core.schema.json`
- Create: `apps/content-factory/_engine/schema/validate-core.ts`
- Create: `apps/content-factory/_engine/tests/golden/llm-agents-primer/core.yaml`

- [ ] **Step 1: Copy Scaffold Files**
Copy `package.json`, `tsconfig.json`, `biome.json` from the ZIP export to `apps/content-factory/`.

- [ ] **Step 2: Copy Schema Files**
Copy `core.schema.json` and `validate-core.ts` to `apps/content-factory/_engine/schema/`.

- [ ] **Step 3: Copy Golden Fixture**
Copy `core.yaml` to `apps/content-factory/_engine/tests/golden/llm-agents-primer/`.

- [ ] **Step 4: Commit**
```bash
git add apps/content-factory/
git commit -m "feat: add content-factory scaffold, schema, and golden fixture"
```

### Task S3-S6: Phases (Gather, Build, Render, Export) + Templates

**Files:**
- Create: `apps/content-factory/_engine/phases/gather.ts`
- Create: `apps/content-factory/_engine/phases/build.ts`
- Create: `apps/content-factory/_engine/phases/render.ts`
- Create: `apps/content-factory/_engine/phases/export.ts`
- Create: `apps/content-factory/_engine/templates/blog.md.hbs`
- Create: `apps/content-factory/_engine/templates/short.json.hbs`
- Create: `apps/content-factory/_engine/templates/wiki.md.hbs`
- Create: `apps/content-factory/_engine/templates/prompt-seed.md.hbs`
- Create: `apps/content-factory/_engine/templates/combined.md.hbs`

- [ ] **Step 1: Copy Phase Scripts**
Copy all TypeScript phase scripts from the ZIP to `apps/content-factory/_engine/phases/`.

- [ ] **Step 2: Copy and Format Templates**
Copy all `.hbs` files to `apps/content-factory/_engine/templates/`.
Replace all `⟦` with `{{` and `⟧` with `}}` in the copied templates.

- [ ] **Step 3: Commit**
```bash
git add apps/content-factory/_engine/phases/ apps/content-factory/_engine/templates/
git commit -m "feat: implement content-factory phases and Handlebars templates"
```

### Task S7: Lint rules + lint.ts + cli.ts

**Files:**
- Create: `apps/content-factory/_engine/lint/rules.yaml`
- Create: `apps/content-factory/_engine/lint/lint.ts`
- Create: `apps/content-factory/_engine/cli.ts`

- [ ] **Step 1: Copy Lint configuration and logic**
Copy `rules.yaml` and `lint.ts` from the ZIP to `apps/content-factory/_engine/lint/`.

- [ ] **Step 2: Copy CLI**
Copy `cli.ts` from the ZIP to `apps/content-factory/_engine/`.

- [ ] **Step 3: Commit**
```bash
git add apps/content-factory/_engine/lint/ apps/content-factory/_engine/cli.ts
git commit -m "feat: add content-factory linting and CLI"
```

### Task S8: Tests, README, SKILL, DECISIONS

**Files:**
- Create: `apps/content-factory/_engine/tests/schema.test.ts`
- Create: `apps/content-factory/_engine/tests/render.test.ts`
- Create: `apps/content-factory/_engine/tests/export.test.ts`
- Create: `apps/content-factory/README.md`
- Create: `apps/content-factory/SKILL.md`
- Create: `apps/content-factory/DECISIONS.md`

- [ ] **Step 1: Copy Tests**
Copy the Vitest spec files from the ZIP to `apps/content-factory/_engine/tests/`.

- [ ] **Step 2: Copy Docs**
Copy `README.md`, `SKILL.md`, and `DECISIONS.md` from the ZIP to `apps/content-factory/`.

- [ ] **Step 3: Verify MVP Gates**
Run: `cd apps/content-factory && bun install`
Run: `cd apps/content-factory && bun run factory:test`

- [ ] **Step 4: Commit**
```bash
git add apps/content-factory/
git commit -m "test: add content-factory tests and documentation"
```
