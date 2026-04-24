# LLM-Wiki Content Pipeline

Pipeline standalone para geração de conteúdo estruturado com qualidade máxima.

## Visão

Gera arquivos LLM-Wiki-ready (Markdown estruturado com frontmatter YAML) a partir de uma intenção/tema/produto, usando:

- **Arquitetura de pipeline + quality gates** (inspirado em orquidia-uniteia)
- **Conteúdo/heurísticas/prompts/skills** (do affiliate-skills)
- **Schema canônico versionado** (spec/llm-wiki.schema.json)

## Características

- **Sem UI** — CLI + arquivos + logs
- **Auditável** — artefatos em cada estágio
- **Determinístico** — gates que aprovam/reprovam
- **Reprodutível** — hashes, versionamento, golden tests
- **Max Quality** — evidência obrigatória para claims

## Pipeline Stages

```
┌─────────────────────────────────────────────────────────────────┐
│ PIPELINE LLM-WIKI                                               │
│                                                                 │
│  0. JOB SPEC                                                    │
│     Input: Intenção do usuário                                  │
│     Output: jobs/<slug>.json                                    │
│                                                                 │
│     ▼                                                           │
│  �──────────────┐                                               │
│  │ 1. TRIAGE   │ Classifica tipo, define skill pack, requisitos│
│  └──────┬───────┘ GATE: Info básica presente?                   │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 2. RESEARCH  │ Coleta fontes, extrai evidências              │
│  └──────┬───────┘ GATE: Fontes ≥ mínimo (5-10)?                 │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 3. DRAFT     │ Gera wiki entry no schema canônico            │
│  └──────┬───────┘ GATE: Estrutura + densidade mínima?           │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 4. EDITING   │ Clareza, consistência, anti-alucinação        │
│  └──────┬───────┘ GATE: Sem fluff, claims amarrados?            │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 5. SEO       │ SEO estrutural (não copywriting)              │
│  └──────┬───────┘ GATE: Score mínimo, não-blog?                 │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 6. VALIDATION│ Schema + fact-check + compliance              │
│  └──────┬───────┘ GATE: 100% pass?                              │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ 7. PUBLISH   │ Escreve arquivo final                         │
│  └──────────────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ╔══════════════╗                                               │
│  ║ WIKI ENTRY   ║ -> /root/hub/llm-wiki/<slug>.md               │
│  ╚══════════════╝                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Uso

```bash
# Gerar uma entrada wiki
pipeline run --entity "Galaxy.ai" --intent wiki_entry

# Com opções
pipeline run --entity "Product" --locale pt-BR --depth comprehensive

# Re-build a partir de job existente
pipeline rebuild --job jobs/galaxy-ai.json

# Validar entrada existente
pipeline validate /root/hub/llm-wiki/galaxy-ai.md
```

## Estrutura de Arquivos

```
llm-wiki/
├── spec/
│   ├── llm-wiki.schema.json    # Schema canônico (JSON Schema)
│   └── version.txt             # Versão atual (1.0.0)
├── jobs/                       # Job specs de entrada
│   └── <slug>.json
├── artifacts/                  # Artefatos por execução (audit trail)
│   └── <slug>/
│       ├── triage.json
│       ├── sources.json
│       ├── extracts.json
│       ├── research_brief.md
│       ├── draft_v1.md
│       ├── draft_v2_edited.md
│       ├── draft_v3_seo.md
│       ├── validation_report.json
│       └── publish_manifest.json
├── tests/
│   └── golden/                 # Golden tests (comportamento canônico)
│       └── galaxy-ai.md
├── *.md                        # Entradas wiki publicadas
└── README.md
```

## Schema Canônico

Cada entrada wiki tem frontmatter YAML obrigatório:

```yaml
---
spec: llm-wiki/1.0.0
title: "Galaxy.ai"
type: "plataforma"
value_proposition: "Centralização de ferramentas de IA..."
what_it_offers:
  - "Geração e refinamento de texto"
  - "..."
problems_solved:
  - "..."
target_audience: "..."
when_it_matters: "..."
when_less_matters: "..."
short_formula: "..."
sources:
  - url: "https://..."
    kind: "primary"
    accessed_at: "2026-04-17"
    excerpt_id: "ex_001"
---
```

## Quality Gates

### Gate Rules (hard failures)

1. **Schema validation** — Falhou schema = FAIL
2. **Evidence binding** — Claims sem `excerpt_id` em `sources` = FAIL ou DEGRADED
3. **Minimum sources** — `< 5 sources` = FAIL
4. **Minimum density** — `what_it_offers.length < 3` = FAIL
5. **Prohibited terms** — "revolucionário", "o melhor", "garantido" = FAIL

### Soft Gates (warnings)

- Densidade subótima
- Falta de primária
- Tempos verbais inconsistentes

## Licença

MIT
