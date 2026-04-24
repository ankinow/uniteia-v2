# UniTeia Content Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-fidelity content generation backend in `apps/content-factory/` that derives multi-channel assets (blog, short, wiki, prompt-seed) from a single validated `core.yaml` source of truth.

**Architecture:** 3-phase strict pipeline (Gather → Build → Render) using Dependency Injection for IO/LLM. Uses a Skill Registry for extensible enrichment and validation plugins. Integrated into the main project's `ship:check` quality gate.

**Tech Stack:** Bun, TypeScript, AJV (Schema), Handlebars (Templates), Zod, Vitest.

---

### Task S01: Scaffold Workspace

**Files:**
- Create: `apps/content-factory/package.json`
- Create: `apps/content-factory/tsconfig.json`
- Create: `apps/content-factory/biome.json`
- Create: `apps/content-factory/src/cli.ts`
- Modify: `package.json` (root)

- [ ] **Step 1: Create apps/content-factory directory structure**
Run: `mkdir -p apps/content-factory/src/{phases,schema,skills,templates,lint,io} apps/content-factory/tests/golden`

- [ ] **Step 2: Create apps/content-factory/package.json**
```json
{
  "name": "@uniteia/content-factory",
  "version": "0.1.0",
  "description": "UniTeia content factory — 3-phase pipeline (Gather→Build→Render) + registry plugin system",
  "type": "module",
  "private": true,
  "scripts": {
    "factory:generate": "bun run src/cli.ts generate",
    "factory:render": "bun run src/cli.ts render",
    "factory:lint": "bun run src/cli.ts lint",
    "factory:validate": "bun run src/cli.ts validate",
    "factory:test": "vitest run tests"
  },
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^3.0.1",
    "gray-matter": "^4.0.3",
    "handlebars": "^4.7.8",
    "yaml": "^2.6.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "json-schema-to-typescript": "^15.0.0",
    "vitest": "^4.1.5"
  }
}
```

- [ ] **Step 3: Modify root package.json to enable workspaces**
Add `"workspaces": ["apps/*"]` to the root `package.json`.

- [ ] **Step 4: Run bun install**
Run: `bun install` at the root.

- [ ] **Step 5: Verify scaffold**
Run: `bun run --filter @uniteia/content-factory factory:test`
Expected: 0 tests passed (but command exists).

- [ ] **Step 6: Commit scaffold**
```bash
git add package.json apps/content-factory/
git commit -m "chore: scaffold content-factory workspace"
```

---

### Task S02: Import Digest

**Files:**
- Create: `docs/imports-digest.md`
- Modify: `.gitignore`

- [ ] **Step 1: Create docs/imports-digest.md**
Summarize reusable logic from `.imports/nova-hub/`:
- `affiliate-skills`: registry pattern, prompt seeds.
- `llm-wiki`: CLI structure, JSON schema validation.
- `orquidia-uniteia`: secret management, pipeline docs.

- [ ] **Step 2: Ensure imports are ignored**
Add `.imports/` to the root `.gitignore`.

- [ ] **Step 3: Commit digest**
```bash
git add docs/imports-digest.md .gitignore
git commit -m "docs: add import digest for nova-hub references"
```

---

### Task S03: Core Schema + Golden Fixture

**Files:**
- Create: `apps/content-factory/src/schema/core.schema.json`
- Create: `apps/content-factory/tests/golden/llm-agents-primer/core.yaml`
- Create: `apps/content-factory/tests/schema.test.ts`

- [ ] **Step 1: Implement apps/content-factory/src/schema/core.schema.json**
Use the provided JSON Schema from the spec.

- [ ] **Step 2: Create a manual golden fixture**
Write `tests/golden/llm-agents-primer/core.yaml` with valid data (2 sources, 3 evidence).

- [ ] **Step 3: Write failing schema test**
Create `tests/schema.test.ts` that imports AJV and validates the golden file.

- [ ] **Step 4: Run test and verify pass**
Run: `bun run --filter @uniteia/content-factory factory:test`
Expected: 1 passed.

- [ ] **Step 5: Commit schema**
```bash
git add apps/content-factory/src/schema/ apps/content-factory/tests/
git commit -m "feat: add core content schema and golden fixture"
```

---

### Task S04: Registry + Invariants

**Files:**
- Create: `apps/content-factory/registry.json`
- Create: `apps/content-factory/src/skills/registry.ts`
- Create: `apps/content-factory/tests/registry-invariants.test.ts`

- [ ] **Step 1: Create registry.json seed**
Use the provided registry seed from the spec.

- [ ] **Step 2: Implement registry.ts with Zod validation**
Implement the registry loader as defined in the spec.

- [ ] **Step 3: Write registry invariant tests**
Implement `tests/registry-invariants.test.ts`.

- [ ] **Step 4: Create stubs for referenced skills**
Run: `touch apps/content-factory/src/skills/{fetch-provider-web,fetch-provider-affitor,validator-slug,linter-blog,linter-short}.ts`

- [ ] **Step 5: Run tests**
Expected: 5 passed.

- [ ] **Step 6: Commit registry**
```bash
git add apps/content-factory/registry.json apps/content-factory/src/skills/
git commit -m "feat: add skill registry and invariant tests"
```

---

### Task S05: Gather Phase

**Files:**
- Create: `apps/content-factory/src/phases/gather.ts`
- Create: `apps/content-factory/tests/gather.test.ts`

- [ ] **Step 1: Implement Gather phase signature**
Use the `GatherIn`, `GatherOut`, and `FetcherFn` interfaces.

- [ ] **Step 2: Implement Gather logic**
Iterate sources and use the injected fetcher to build `sources.json`.

- [ ] **Step 3: Write gather tests with mock fetcher**

- [ ] **Step 4: Commit gather phase**
```bash
git add apps/content-factory/src/phases/gather.ts
git commit -m "feat: implement gather phase with DI fetcher"
```

---

### Task S06: Build Phase (Core LLM Loop)

**Files:**
- Create: `apps/content-factory/src/phases/build.ts`
- Create: `apps/content-factory/tests/build.test.ts`

- [ ] **Step 1: Implement Build logic**
Use injected `llmFn` to generate `core.yaml` from gathered sources. Enforce schema validation.

- [ ] **Step 2: Implement evidence-binding enforcer**
Lint numeric claims to ensure they match evidence IDs.

- [ ] **Step 3: Commit build phase**
```bash
git add apps/content-factory/src/phases/build.ts
git commit -m "feat: implement build phase with evidence enforcement"
```

---

### Task S07: Render Phase

**Files:**
- Create: `apps/content-factory/src/phases/render.ts`
- Create: `apps/content-factory/src/templates/blog.md.hbs`
- Create: `apps/content-factory/src/templates/short.json.hbs`

- [ ] **Step 1: Implement pure render.ts**
YAML in -> Multi-channel files out using Handlebars.

- [ ] **Step 2: Verify render against golden**
Golden `core.yaml` should produce bit-identical files to the golden outputs.

- [ ] **Step 3: Commit render phase**

---

### Task S08: Ship-Check Integration

**Files:**
- Modify: `src/utils/ship-check.ts`
- Modify: `src/utils/slug-check.ts`
- Create: `apps/content-factory/src/lint/rules.yaml`

- [ ] **Step 1: Extend ship-check.ts default steps**
Add `factory:validate` and `factory:test` to the main repo's ship-check.

- [ ] **Step 2: Extend slug-check.ts content roots**
Add `llm-wiki` to `CONTENT_ROOTS`.

- [ ] **Step 3: Commit integration**
