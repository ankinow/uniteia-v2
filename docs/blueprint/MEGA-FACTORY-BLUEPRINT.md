---
title: "UniTeia Mega Factory — Repository Blueprint"
type: "blueprint"
subtype: "repository-snapshot"
lang: "en"
tags:
  - uniteia-mega-factory
  - blueprint
  - llm-context
  - repository-snapshot
  - content-producer
  - agentic-pipeline
  - typescript
  - bun
  - monorepo
version: "1.0"
generated: "2026-05-18"
source: "/home/lermf/uniteia-mega-factory"
role: "content-producer"
feeds_into: ["uniteia-v2 (content-publisher)"]
contract:
  - "@uniteia/content-node-contract (content-graph.v1)"
  - "Content Package Contract v1"
---

# UniTeia Mega Factory — Repository Blueprint (LLM-Optimized)

**Stack:** TypeScript monorepo + Bun workspaces + Drizzle ORM  
**Runtime:** Bun 1.x  
**Test framework:** `bun test` (nativo, 234 tests)  
**Pre-PR gate:** `bun run verify` = typecheck → test → build  
**Role:** Content producer — transforms raw research into structured Content Package Contract v1  
**Architecture:** Agentic pipeline — each stage is an independent agent running in waves

---

## 1. Repository Identity

| Field | Value |
|-------|-------|
| Name | `uniteia-mega-factory` |
| Package type | `"type": "module"` (ESM-only) |
| Monorepo | Workspaces in `apps/*` and `packages/*` |
| Runner | `bun run` for everything |
| Path aliases | `@uniteia/core`, `@uniteia/db`, `@uniteia/asset-template-db`, `@uniteia/provider-config`, `@uniteia/content-node-contract`, `@uniteia/factory-orchestrator` |
| Test count | 234 tests across 59+ test files |
| Build system | Per-workspace `tsc` via `bun run --filter '*' build` |
| Dev server | Web app on port 3000 (`bun run dev`) |

---

## 2. Workspace Map

```
uniteia-mega-factory/
├── apps/
│   ├── factory-cli/       @uniteia/factory-cli — CLI principal (1.8k+ lines, ~50 commands)
│   ├── web/               @uniteia/web — preview server, helper scripts, doctor
│   └── tui/               @uniteia/tui — terminal UI launcher
│
├── packages/
│   ├── core/              @uniteia/core — jobs, runs, pipelines, runners, sentinel, quality, contracts
│   ├── engine/            @uniteia/engine — 44 agent files, G0-G7 gates, registry, ports, schemas
│   ├── factory-orchestrator/ @uniteia/factory-orchestrator — BriefInterviewer, PlanBuilder, RunExecutor
│   ├── provider-config/   @uniteia/provider-config — LLM provider config, YAML loading, secret redaction
│   ├── inference-router/  @uniteia/inference-router — router + fallback chains + budget + adapters
│   ├── content-node-contract/ @uniteia/content-node-contract — BRIDGE: shared ContentNode types + Zod schemas
│   ├── render-worker/     @uniteia/render-worker — HTML/PPTX/MP4/GIF rendering (Playwright + PptxGenJS)
│   ├── asset-template-db/ @uniteia/asset-template-db — asset template store + validation
│   ├── db/                @uniteia/db — Drizzle ORM, SQLite schema
│   └── sentinel/          @uniteia/sentinel — cost/runtime monitoring, AgentAuditor, ACPO optimizer
│
├── src/
│   ├── exporters/uniteia-v2/ — 8 modular writers (manifest, design, tags, quality, sources, blocks, assets)
│   └── shared/              — quality-policy.ts, content-locales.ts
│
├── scripts/               — Roundtrip tests, export scripts
├── exports/               — Generated Content Packages (output for uniteia-v2)
├── docs/                  — ADRs (7), runbooks (10)
├── fixtures/              — Test fixtures
└── .factory/              — Runtime artifacts (config, runs, wiki pages)
```

---

## 3. TypeScript Config

**Base** (`tsconfig.base.json`):
- Target: `ES2022`, Module: `ESNext`, Resolution: `Bundler`
- Strict mode enabled
- Path aliases for all `@uniteia/*` packages

---

## 4. Provider & Model Configuration

### Providers (`/.factory/config/providers.example.yaml`)

| Provider | Backend | Models |
|----------|---------|--------|
| `mock` | Simulated (default) | No API key required |
| `openai_compatible` | OpenAI API | `gpt-4o`, `gpt-4o-mini` |
| `nvidia_nim` | NVIDIA NIM | `meta/llama3-70b-instruct` |
| `local` | Ollama/Llama.cpp | `llama3.2` |

### Model Roles (`/.factory/config/model-roles.yaml`)

7 roles mapped to provider capabilities: `planner`, `worker`, `writer`, `critic`, `json_enforcer`, `vision`, `asset_designer`

Each role specifies: chat/json_mode/tool_use/reasoning requirements.

---

## 5. Content Package Contract (Bridge)

**Package:** `@uniteia/content-node-contract` at `packages/content-node-contract/src/`

This is the **shared contract** between factory (producer) and uniteia-v2 (consumer).

### ContentNode
```typescript
interface ContentNode {
  id: string                    // "{locale}-{canonicalSlug}"
  locale: ContentLocale         // BCP47: en, pt-BR, es, fr, de, it, ja, zh
  canonicalLocale: ContentLocale
  slug: string
  canonicalSlug: string
  title: string
  summary: string
  niche: string[]
  tags: string[]
  entities: string[]
  qualityScore: number          // 0-100
  trustScore: number            // 0-100
  visibility: 'draft' | 'review' | 'published'
  lifecycle: 'generated' | 'verified' | 'reviewed' | 'published' | 'deprecated'
  verdict: 'safe' | 'caution' | 'unsafe'
  routes: { canonical: string; aliases: string[] }    // v2 populates
  alternates: Partial<Record<ContentLocale, string>>
  related: string[]
  seo: { noindex: boolean; priority: number }
  timestamps: { createdAt: string; updatedAt: string }
  metrics: { edgeRank, semanticDensity, freshnessScore, graphScore }  // v2 recomputes
  visualStyle?: VisualStyle
  sketchnoteSpecId?: string
}
```

### SerializableContentGraph
```typescript
interface SerializableContentGraph {
  version: "content-graph.v1"
  generatedAt: string
  nodes: ContentNode[]
  edges: GraphEdge[]              // from/to/kind/weight/reason
  groups?: ContentGroupCollection  // v2 populates
  indexes: { byId, bySlug, byRoute, byLocale, byNiche, byTag, public, sitemapEligible }
  metadata: { totalNodes, lastGenerated, version, packageSources }
}
```

### Locale Mapping
- Factory uses BCP47 (`pt-BR`, `en`, `es`, ...)
- v2 uses short codes (`pt`, `en`, `es`, ...)
- Bidirectional mapping via `LOCALE_BCP47_TO_V2` and `LOCALE_V2_TO_BCP47`

### Validation
- Full Zod schemas for all types
- Exports `contentNodeSchema`, `serializableContentGraphSchema`, etc.
- Helper functions: `validateContentNode()`, `validateSerializableContentGraph()`, `bcp47ToV2Locale()`, `v2ToBcp47Locale()`

---

## 6. Wiki Pipeline (Primary Pipeline)

**Entry:** `bun run factory:wiki` → `packages/engine/agents/factory-cli.ts`

### Wave Architecture (19 Waves)

The pipeline is organized in waves, each executed by specialized agents:

| Wave | Agent(s) | Description |
|------|----------|-------------|
| W0 | Precheck | Git status, branch, HEAD validation |
| W1 | DocumentProcessorAgent | Document chunking, word count, language detection |
| W1/W3 | SourceIngestorAgent | Source ingestion, SourceLedger with trust scores |
| W4 | ClaimExtractorAgent | Factual claim extraction with sourceRef |
| W5 | GraphBuilderAgent | Knowledge graph (Source/Claim/Entity/Topic nodes) |
| W6 | ResearchGapAuditorAgent | Gap audit: claims without sources, numbers without citations |
| W7 | AudienceIntentAgent | Audience profiling: level, intent, knowledge gaps |
| W7 | DatasetDesignerAgent | Evaluation dataset: questions, QA pairs, synthetic examples |
| W8 | ContentStrategyAgent | Content format, depth, section structure |
| W8 | PersonaDistillationAgent | Teaching personas, heuristics, pedagogical review |
| W11 | WikiComposerAgent | Wiki article draft in markdown |
| W12 | SeoSemanticAgent | Search intent, entities, FAQ schema |
| W13 | TeachingContractAgent | Pedagogical contract: audience, tone, objectives, structure |
| W13 | DataVizAgent | Data visualization recommendations |
| W14 | VisualSpecCompilerAgent | Visual block specification, diagrams, layout |
| W14 | DidacticBlockAgent | Interactive didactic blocks |
| W14 | MermaidDiagramAgent | Mermaid diagrams |
| W14 | AltTextAccessibilityAgent | Alt text and accessibility |
| W16 | QualityAuditorAgent | Final quality audit (10 dimensions) |
| W17 | WikiSaverAgent | Save to `.factory/wiki/pages/{slug}/` |

### Gates (G0-G7)

| Gate | Purpose |
|------|---------|
| G0_intake | Validate input: slug format, budget (<$2), languages |
| G1_groundedness | Minimum 2 sources |
| G2_schema | Schema validation |
| G3_coherence | Content coherence |
| G4_format | Format/relevance |
| G5_i18n | i18n completeness |
| G6_lint | Conciseness/lint |
| G7_export | Export gate |

---

## 7. Factory Orchestrator (High-Level Pipeline)

**Package:** `@uniteia/factory-orchestrator`

```typescript
interface FactoryBrief {
  topic: string
  sources?: string[]
  audience?: string
  language?: string
  styleProfile?: string
  contentType?: string
  depth?: string
  constraints?: string[]
  providerMode?: string
}

interface OrchestratorPlan {
  runId: string
  slug: string
  brief: FactoryBrief
  waves: WaveConfig[]
  selectedStyle: string
  selectedTemplates: string[]
  providerMode: string
  modelRoles: Record<string, string>
}
```

1. **BriefInterviewer** — Collects and refines user brief
2. **PlanBuilder** — Brief → `OrchestratorPlan` with waves and agents
3. **RunExecutor** — Executes the plan (in-process or subprocess)
4. **StyleResolver** — Resolves visual style profiles

---

## 8. Core Engine (`@uniteia/core`)

### Key Modules

| Module | Path | Purpose |
|--------|------|---------|
| `job.ts` | `packages/core/src/job.ts` | Job lifecycle management |
| `run.ts` | `packages/core/src/run.ts` | Run context, ledger, states, fork |
| `runner.ts` | `packages/core/src/runner.ts` | Base runner for execution |
| `pipeline.ts` | `packages/core/src/pipeline.ts` | Pipeline stages and snapshots |
| `sentinel.ts` | `packages/core/src/sentinel.ts` | Sentinel policy: input evaluation |
| `skills.ts` | `packages/core/src/skills.ts` | Skill registry: templates, families |
| `wiki.ts` | `packages/core/src/wiki.ts` | Wiki page CRUD |
| `boundary.ts` | `packages/core/src/boundary.ts` | Web boundary ports: HTTP, WebSocket |
| `logger.ts` | `packages/core/src/logger.ts` | Memory logger |

### Core Contracts

| Contract | File | Scope |
|----------|------|-------|
| Render v1 | `contracts/render-v1.ts` | RenderJob, RenderTarget, RenderFormat, RenderManifest |
| Visual Package v1 | `contracts/visual-package-v1.ts` | VisualPackageSpec, SceneGraph, MotionSpec, NarrationSpec, Critique5D |
| Artifact v1 | `contracts/artifact-contract-v1.ts` | ArtifactContract, formats (html, pptx, pdf, mp4, gif) |
| Capability Provider v1 | `contracts/capability-provider-v1.ts` | ProviderRef, fallback chains, health checks |
| Asset Protocol v1 | `contracts/asset-protocol-v1.ts` | AssetRequirement, MediaAssetRef, MediaAssetManifest |
| Critique v1 | `contracts/critique-v1.ts` | Critique5DReport, DesignDirectionAdvisor, PackageRoundtripResult |

### Quality & Roundtrip

- `quality/critique-5d.ts` — 5-dimension critique audit
- `quality/design-direction-advisor.ts` — Design direction consultant
- `quality/visual-quality-gate.ts` — Visual quality gate
- `roundtrip/package-roundtrip.ts` — Package roundtrip test
- `package-orchestrator/package-all.ts` — Full package orchestrator

---

## 9. Engine — Agents & Architecture

### Agent Interface

```typescript
interface Agent<W extends Wave, I extends WaveInputOf<W>, O extends WaveOutputOf<W>> {
  id: string
  wave: W
  description: string
  model_preference: ModelTier        // 'frontier' | 'nim' | 'slm-local'
  budget_usd: number
  inputs: I
  outputs: O
  tools: Tool[]
  verifier: Verifier<O> | null
  run(ctx: RunContext, input: I): Promise<O>
}
```

- **44 agent files** in `packages/engine/agents/`
- Agent registry with ID-based discovery
- Schema validation via AJV against `core.schema.json`
- Infrastructure ports: `LLMPort`, `PersistencePort`, `TracingPort`, `ClockPort`, `ArtifactPort`

---

## 10. Inference Router (`@uniteia/inference-router`)

```typescript
class InferenceRouter {
  registerAdapter(role: ModelRole, adapter: InferenceAdapter): void
  registerFallbackChain(role: ModelRole, chain: FallbackEntry[]): void
  complete(req: InferenceRequest): Promise<InferenceResponse>
  completeJson(req, schema?): Promise<InferenceResponse>
  healthcheckAll(): Promise<Map<string, boolean>>
  resolveHealthyAdapter(role): Promise<string | null>
}
```

- Automatic fallback chains (adapter-1 fails → adapter-2)
- Budget enforcement per request (estimated cost vs maxUsd)
- Adapters: mock, openai-compatible, nvidia-nim, local (Ollama)

---

## 11. Content Export (→ uniteia-v2)

### Two Export Strategies

**Strategy 1 (legacy engine):** `packages/engine/agents/content-package-exporter.ts`
- Reads from `.factory/wiki/pages/{slug}/`
- Exports to `exports/{slug}/content-package-v1/`
- Includes: manifest.json, content.*.mdx, sources.json, quality.json, seo.json, design.md, blocks.json, content-nodes.json (L2 bridge), SHA-256 hashes

**Strategy 2 (current exporters):** `src/exporters/uniteia-v2/`
8 modular writers:

| Writer | Output |
|--------|--------|
| `manifest-writer.ts` | `manifest.json` + `content-nodes.json` |
| `design-md-writer.ts` | `design.md` |
| `tags-writer.ts` | `tags.json` |
| `quality-writer.ts` | `quality.json` |
| `sources-writer.ts` | `sources.json` |
| `blocks-writer.ts` | `blocks/*.json` |
| `assets-writer.ts` | `assets/` |
| `package-writer.ts` | Orchestrator |
| `validate-export.ts` | Post-export validation |

### Manifest Schema (`uniteia-content-package/v1`)
```typescript
interface Manifest {
  schemaVersion: string
  contentId: string
  sourceProject: string
  targetProject: string            // "uniteia-v2"
  status: 'draft' | 'published' | 'archived'
  contentType: string
  canonicalSlug: string
  title: ManifestContentTitle       // Record<locale, string>
  description: ManifestContentDescription
  locales: string[]
  layout: ManifestLayout
  tags: Record<string, string[]>
  quality: ManifestQuality          // { publishable, trustLevel, blockers, warnings }
  sources: Array<{ title, url }>
  hashes: { contentHash, manifestHash }
  provenance: { exportedAt, exportTool }
}
```

### Real Example
`exports/cnt_tecent_vm_benefits_2026_05/manifest.json`:
- 3 locales: pt-BR, en, es
- Layout: `opportunity-map-v1`
- quality.publishable: false, trustLevel: medium
- 2 blocks: benefit-grid.json, decision-map.json

---

## 12. Testing

### Framework: `bun test` (native, 234 tests)

| Package | Test count | Location |
|---------|-----------|----------|
| `@uniteia/core` | 15+ | `packages/core/test/*.test.ts` |
| `@uniteia/engine` | 15+ agents + gates + registry | `packages/engine/agents/*.test.ts` |
| `@uniteia/content-node-contract` | 2 | `packages/content-node-contract/__tests__/` |
| `@uniteia/provider-config` | 1 | `packages/provider-config/__tests__/` |
| `@uniteia/inference-router` | 1 | `packages/inference-router/__tests__/` |
| `@uniteia/asset-template-db` | 1 | `packages/asset-template-db/__tests__/` |
| `@uniteia/render-worker` | 1+ | `packages/render-worker/src/*.test.ts` |
| `@uniteia/factory-orchestrator` | 1+ | `packages/factory-orchestrator/src/*.test.ts` |
| `@uniteia/sentinel` | 3 | `packages/sentinel/**/*.test.ts` |
| `@uniteia/db` | — | (Drizzle schema tests) |
| `apps/web` | 4 | `apps/web/test/*.test.ts` |
| `apps/tui` | 2 | `apps/tui/test/*.test.ts` |
| `src/exporters` | 1 | `src/exporters/uniteia-v2/export.test.ts` |
| `src/shared` | 2 | `src/shared/*.test.ts` |
| Scripts | 3 | `scripts/roundtrip-*.test.ts` |

### Roundtrip Tests
- `scripts/roundtrip-contract-test.ts` — Full orchestration: export + verify + `docs/BRIDGE-STATUS.md`
- `scripts/roundtrip-contract-export.ts` — Export roundtrip fixture
- `scripts/roundtrip-contract-verify.test.ts` — Verify exported package against contract

---

## 13. Render Worker

**Package:** `@uniteia/render-worker`

Supported output formats:
- **HTML** (`render-html.ts`) — Static rendering
- **PPTX** (`render-pptx.ts`) — Via PptxGenJS
- **MP4/GIF** (`render-frames.ts`) — Via Playwright frame capture → video

Contract: `packages/core/src/contracts/render-v1.ts`

---

## 14. Key Scripts

| Command | Purpose |
|---------|---------|
| `factory:wiki` | Full wiki pipeline (19 waves) |
| `factory:wiki:dry-run` | Wiki pipeline without saving |
| `factory:ask` | Interactive brief collection |
| `factory:plan` | Generate execution plan |
| `factory:run` | Execute full pipeline |
| `factory:preview` | Preview generated wiki package |
| `factory:report` | Run report |
| `factory:validate` | Validate package |
| `package:export` | Export Content Package v1 |
| `package:roundtrip` | Export + revalidate |
| `package:roundtrip:contract` | Full contract roundtrip test |
| `provider:healthcheck` | Check all configured providers |
| `doctor:providers` | Provider diagnostics |
| `smoke:real-pipeline` | Smoke test with real providers |
| `export:wiki:package` | Export wiki page to v2 package |

---

## 15. ADRs

| ADR | Decision |
|-----|----------|
| 0001 | Foundation tracer pattern |
| 0001 (alt) | Run-first design |
| 0002 | Run-first canonical model |
| 0003 | Web boundary ports & adapters |
| 0004 | Run port frontend streaming |
| 0004 (alt) | CLI + TUI agentic orchestrator |
| 0005 | HTTP API conventions |
| 0006 | WebSocket protocol conventions |
| 0007 | Agentic content factory architecture |

---

## 16. Security

- `--dry-run` is default for write commands; `--save` or `--live` for real execution
- Secrets are never printed: `redactSecrets()` filters `api_key`, `token`, `secret`, `password`, `private_key`, `bearer`
- `provider:redact-check` scans configs for leaked secrets
- Mock provider is default; real providers require explicit configuration
- TUI never executes real providers, git commits, pushes, deploys, or deletes
