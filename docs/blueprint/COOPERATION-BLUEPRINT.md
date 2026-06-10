---
title: "UniTeia — Dual-Repo Cooperation Blueprint"
type: "blueprint"
subtype: "cooperation-snapshot"
lang: "en"
tags:
  - uniteia
  - cooperation
  - cross-repo
  - integration
  - content-pipeline
  - independence
  - system-architecture
# ⚠️ STALE COPY — Canonical: ~/Documentos/blueprints/COOPERATION-BLUEPRINT.md (v2.4, 2026-06-09)
# This in-repo copy is stale. See canonical for latest cross-repo contract, git HEADs, and audit.
version: "2.4"
generated: "2026-05-18"
repos:
  - source: "/home/lermf/uniteia-mega-factory"
    role: "content-producer"
    blueprint: "MEGA-FACTORY-BLUEPRINT.md"
  - source: "/home/lermf/uniteia-v2"
    role: "content-publisher"
    blueprint: "REPOSITORY-BLUEPRINT.md"
contract_version: "content-graph.v1"
---

# UniTeia — Dual-Repo Cooperation Blueprint

## Declaracao de Independencia

```
uniteia-mega-factory (producer)    ←→    uniteia-v2 (publisher)
     REPOSITORIOS INDEPENDENTES          REPOSITORIOS INDEPENDENTES
     Sem dependencia de build            Sem dependencia de build
     Sem compartilhamento de runtime     Sem compartilhamento de runtime
     Pode operar offline                 Pode operar sem a factory
     Pipeline propria + CI               Pipeline propria + CI
```

**Cada repositorio e autonomo.** Nenhum depende do outro para buildar, testar ou rodar. A unica conexao e um contrato de dados versionado: o **Content Package Contract v1**.

---

## 2. O Contrato: Content Package Contract v1

### Formato

A factory exporta diretorios com esta estrutura:

```
exports/{contentId}/
├── manifest.json                    ← Schema: uniteia-content-package/v1
├── content-nodes.json               ← L2 bridge: array de ContentNode (opcional)
├── content.en.mdx                   ← Markdown por locale
├── content.pt-BR.mdx
├── content.es.mdx
├── ...
├── quality.json                     ← Qualidade, trust, blockers
├── sources.json                     ← Fontes com trust scores
├── tags.json                        ← Taxonomia
├── design.md                        ← Especificacao de layout
├── blocks/*.json                    ← Blocos de conteudo
├── assets/                          ← Ativos estaticos
└── export-report.json               ← Status da exportacao
```

### O que a factory fornece (nunca impoe)

| Artefato | Factory produz | v2 consome | Se ausente |
|----------|---------------|------------|------------|
| `manifest.json` | Metadata do pacote | Importa metadados | Falha na validacao |
| `content.*.mdx` | Artigo em markdown | Renderiza na rota | Conteudo nao aparece |
| `content-nodes.json` | L2 bridge: quality, visibility etc | Prefere factory; computa propio se ausente | v2 re-deriva do frontmatter |
| `quality.json` | Score, trust level, blockers | Valida canPublish | v2 computa do frontmatter |
| `sources.json` | Fontes citadas | Exibe no source-ledger | Sem sources |

### Dados vs Comportamento

```
Factory produz:     DADOS (ContentNode, manifesto qualidade)
Factory nunca:      IMPOE comportamento, layout, routing

v2 consome:         DADOS da factory como entrada
v2 sempre:          DECIDE routing, layout, visibilidade, caching
```

A factory pode sugerir `qualityScore`, mas **v2 sempre aplica suas proprias regras** (`isPublic()`, `visibility`, 8-locale symmetry). O publisher e soberano sobre o que e publicado.

---

## 3. Fluxo de Cooperacao (Roundtrip)

```
┌─────────────────────────────────────────────────────────────────┐
│                    uniteia-mega-factory                          │
│                                                                  │
│  [Agentic Pipeline]                                              │
│    Input → W1..W17 → Quality Audit → Export                     │
│       ↓                                                         │
│    exports/{contentId}/manifest.json                             │
│    exports/{contentId}/content.*.mdx                             │
│    exports/{contentId}/content-nodes.json (L2 bridge)            │
│       ↓                                                         │
└─────────────────────────────────────────────────────────────────┘
         │
         │  SCP / cp / git / manual copy
         │  (sem protocolo de rede — arquivos)
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      uniteia-v2                                  │
│                                                                  │
│  bun run import:package → content/{niche}/{lang}/{slug}.md       │
│       ↓                                                         │
│  bun run generate:content                                        │
│    ├── content-registry.generated.ts                             │
│    ├── content-graph.generated.ts (compila L2 bridge)            │
│    ├── verify:content-graph                                      │
│    └── search-index.generated.ts                                 │
│       ↓                                                         │
│  bun run build → Qwik SSG → dist/ → Cloudflare Pages            │
│       ↓                                                         │
│  Runtime: StaticJsonContentGraphProvider queries compiled graph  │
└─────────────────────────────────────────────────────────────────┘
```

### Pontos de Integracao

| Ponto | Factory | v2 | Acoplamento |
|-------|---------|----|-------------|
| ContentNode shape | Define tipos (Zod) | Consome (Zod schemas via local dep) | Baixo — contrato com versao |
| content-nodes.json | Exporta L2 bridge | Merge durante compilacao | Opcional — v2 re-deriva |
| Route computation | Nao participa | AppRoutes + ContentGraph | Zero — v2 decide |
| Visibilidade | Sugere qualityScore | isPublic() decide | Zero — v2 decide |
| Layout | Sugere layoutId | Layout registry resolve | Opcional — fallback default |
| i18n | Escreve por locale | Verifica simetria 8-locales | Zero — v2 gateia |

---

## 4. Declaracao de Independencia (Detalhada)

### Independencia Operacional

| Aspecto | Factory | v2 |
|---------|---------|----|
| Build | `bun run build` (per-workspace tsc) | `bun run build` (generate:content → qwik) |
| Test | `bun test` (234 tests) | `bun run test:unit` (224 tests, Vitest) |
| CI | `.github/workflows/ci.yml` | `.github/workflows/quality-gates.yml` |
| Deploy | N/A (gera artefatos) | Cloudflare Pages |
| Dev server | `bun run dev` (porta 3000) | `bun run dev` (porta 3000) |
| Pre-PR gate | `bun run verify` (typecheck+test+build) | `bun run ship:check` (14 steps) |

### Independencia Tecnologica

| Aspecto | Factory | v2 |
|---------|---------|----|
| Framework | TypeScript monorepo (Bun) | Qwik City 1.19 |
| ORM | Drizzle (SQLite) | Nenhum |
| Test | `bun test` (nativo) | Vitest + Playwright |
| Deploy | N/A | Cloudflare Pages |
| Renderizacao | Playwright + PptxGenJS | Qwik SSG |
| LLM integracao | Pesada (agentic pipeline) | Nenhuma |
| Bundle optimization | N/A | 87KB gzip gate |

### Dependencia Unilateral (Factory → v2)

Factory depende de v2 **apenas para validacao de roundtrip**:
```bash
bun run package:roundtrip:contract
  → factory exporta pacote
  → simula import no v2 (usa schemas do content-node-contract)
  → verifica integridade do contrato
```

Nenhum runtime depende do outro. Nenhum CI depende do outro. Nenhum deploy depende do outro.

---

## 5. L2 Bridge Contract (Opcional)

### Como funciona

```
Factory:
  qualityScore: 92, trustScore: 88, visibility: "published"
  ↓ content-nodes.json
v2 compileContentGraph():
  IF content-nodes.json exists AND node found:
    USE factory's qualityScore, trustScore, visibility, lifecycle, verdict
  ELSE:
    COMPUTE from frontmatter (fallback)
```

### Campos preferidos da factory

| Campo | Factory priority | v2 fallback |
|-------|-----------------|-------------|
| `qualityScore` | Factory | Auto-computado |
| `trustScore` | Factory | Auto-computado |
| `visibility` | Factory | `draft` |
| `lifecycle` | Factory | `generated` |
| `verdict` | Factory | `safe` |
| `routes` | Factory (defaults) | v2 computa |
| `metrics` | Factory (defaults) | v2 computa |

---

## 6. Qualidade & Gates

```
Factory (producer)                          v2 (publisher)
─────────────────                          ─────────────
G0: Intake                                  import:package (validate)
G1: Groundedness (≥2 sources)              content:check (AJV schema)
G2: Schema validation                       verify:content-graph
G3: Coherence                               slug:check
G4: Format/relevance                        size:check (87KB)
G5: i18n completeness                       8-locale symmetry gate
G6: Lint                                    ship:check (14 steps)
G7: Export gate                             lighthouse + smoke + visual QA
    │                                           │
    └─────────────── AMBOS GATEIAM ─────────────┘
                    Qualidade minima: 95
```

**Propriedade chave:** Nenhum repositorio precisa confiar no outro para qualidade. Ambos tem seus proprios gates. Se a factory exporta algo com `qualityScore: 50`, o v2 vai rejeitar na `isPublic()`.

---

## 7. Arquivos de Referencia

| Funcao | Factory | v2 |
|--------|---------|----|
| **L2 bridge types** | `packages/content-node-contract/src/types.ts` | `src/content-graph/contracts/node.ts` |
| **L2 bridge schemas** | `packages/content-node-contract/src/schemas.ts` | (via local dep) |
| **Locale mapping** | `packages/content-node-contract/src/locales.ts` | `src/i18n/types.ts` |
| **Import bridge** | `src/exporters/uniteia-v2/package-writer.ts` | `src/content-import/import-package.ts` |
| **Manifest schema** | `src/exporters/uniteia-v2/types.ts` | `src/content-contracts/manifest.schema.ts` |
| **Factory node merge** | (exporta content-nodes.json) | `src/content-graph/compiler/compile-content-graph.ts` |
| **Quality policy** | `src/shared/quality-policy.ts` (MIN: 95) | `src/content-graph/policies/visibility-policy.ts` |
| **Roundtrip test** | `scripts/roundtrip-contract-test.ts` | `scripts/roundtrip-contract-verify.ts` |

---

## 8. Resumo: O Que Cada Repo Sabe e Nao Sabe

```
uniteia-mega-factory SABE:
  ● Como transformar briefing em artigo
  ● Como extrair claims, construir grafos, auditar qualidade
  ● Como agregar fontes com trust scores
  ● Como gerar 8 locales de conteudo
  ● Como exportar Content Package Contract v1
  ✗ NAO SABE como as paginas sao renderizadas
  ✗ NAO SABE o layout final do site
  ✗ NAO SABE as regras de routing do v2
  ✗ NAO SABE o bundle size budget
  ✗ NAO SABE as configuracoes de CDN/edge

uniteia-v2 SABE:
  ● Como importar e validar um Content Package
  ● Como compilar grafo de conteudo estatico
  ● Como renderizar Qwik components com resumability
  ● Como aplicar 8-locale symmetry gate
  ● Como gerar sitemap, JSON-LD, SEO tags
  ● Como gerenciar bundle size em 87KB
  ✗ NAO SABE como o conteudo foi gerado
  ✗ NAO SABE quais LLMs foram usados
  ✗ NAO SABE o pipeline de extracao de claims
  ✗ NAO SABE como os grafos de conhecimento foram construidos
  ✗ NAO SABE os prompts ou modelos usados

INTERFACE PUBLICA (o que ambos sabem):
  ● ContentNode shape (via content-node-contract)
  ● Manifest schema (uniteia-content-package/v1)
  ● qualityScore (0-100)
  ● Locale mapping (BCP47 ↔ v2)
  ● Nada mais
```

---

## 9. Diagrama de Fronteira

```
                    Fronteira do Contrato
                    ────────────────────
                          │
    Factory                │                 v2
    ┌────────────┐        │        ┌──────────────────┐
    │ Briefing   │        │        │ Content Graph    │
    │ Agents     │        │        │ Static Provider  │
    │ LLM Router │        │        │ Qwik Components  │
    │ Knowledge  │        │        │ Edge Middleware  │
    │ Graph      │        │        │ i18n Router      │
    │ Quality    │        │        │ Quality Gates    │
    │ Export     │──manifest.json─→│ Import Bridge    │
    └────────────┘        │        └──────────────────┘
                          │
    Nunca atravessam:     │
      prompts LLM         │
      API keys            │
      chaves de CDN       │
      deploy config       │
      runtime state       │
      build pipelines     │
