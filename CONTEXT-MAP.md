# Context Map — UniTeia v2

Multi-context repository: each major area has its own `CONTEXT.md` and `docs/adr/` directory.

## Context Index

| Context | CONTEXT.md | ADR Directory | Description |
|----------|-------------|---------------|-------------|
| **singularity** | `content/singularity/CONTEXT.md` | `content/singularity/docs/adr/` | AI/LLM content niche — articles, comparisons, rankings |
| **hardware** | `content/hardware/CONTEXT.md` | `content/hardware/docs/adr/` | Hardware reviews, benchmarks, guides |
| **dev** | `content/dev/CONTEXT.md` | `content/dev/docs/adr/` | Development tools, practices, tutorials |
| **privacy** | `content/privacy/CONTEXT.md` | `content/privacy/docs/adr/` | Privacy, security, anonymity content |
| **apex** | `CONTEXT.md` (root) | `docs/adr/` | Apex landing page, cross-niche editorial |
| **infrastructure** | `CONTEXT.md` (root) | `docs/adr/` | Qwik-City, Tailwind, Cloudflare, build pipeline |
| **i18n** | `CONTEXT.md` (root) | `docs/adr/` | Internationalization system (en/pt/es/ja/zh) |
| **jrpg-sidebar** | `docs/jrpg-sidebar/CONTEXT.md` | `docs/jrpg-sidebar/docs/adr/` | JRPG-style sidebar, layout redesign, open-design integration |

## How to Use

1. **Identify your context** — which area are you working on?
2. **Read the CONTEXT.md** — understand domain language, conventions, constraints
3. **Read docs/adr/** — review past architectural decisions
4. **Keep contexts isolated** — don't mix decisions between contexts

## Skills Integration

Engineering skills read this map to find the right context:
- `improve-codebase-architecture` → reads relevant CONTEXT.md
- `diagnose` → reads relevant CONTEXT.md + ADRs
- `tdd` → reads relevant CONTEXT.md for domain language
- `to-issues` → uses context to scope issues
- `triage` → uses context to understand impact area

## Adding a New Context

1. Create `content/<new-context>/CONTEXT.md` or `docs/<new-context>/CONTEXT.md`
2. Create `docs/adr/` directory within that context
3. Add entry to this table
4. Run `write-milestone-brief` skill to capture decisions
