---
name: global-curation-flywheel
description: >
  Execute o flywheel completo de dominacao para sites de curadoria global. Captura dados oficiais, extrai proposta de valor, coleta assets visuais, gera benchmark, monta paginas brutalista/JRPG, localiza, distribui e monitora. Use quando quiser criar ou atualizar um site de curadoria completo, dominar um nicho global, ou lancar um projeto de reviews/comparativos em escala. Triggers: "flywheel de curadoria", "dominar nicho global", "criar site de curadoria", "pipeline completo de reviews", "automatizar reviews", "curadoria global", "lancar comparativo", "montar catalogo de produtos".
license: MIT
version: "1.0.0"
tags: ["affiliate-marketing", "curation", "automation", "landing-pages", "seo", "visual-design", "brutalist", "jrpg", "global", "flywheel"]
compatibility: "Claude Code, ChatGPT, Gemini CLI, Cursor, Windsurf, OpenClaw, any AI agent"
metadata:
  author: affitor
  version: "1.0"
  stage: S8-Meta
---

# Global Curation Flywheel

Execute o pipeline completo de dominacao para sites de curadoria global. Esta skill orquestra todas as etapas do flywheel, desde captura de dados oficiais ate monitoramento e reciclagem, com foco em consistencia visual brutalista/JRPG limpo.

## Stage

S8: Meta — Orquestracao cross-stage. Esta skill e o ponto de entrada para projetos de curadoria em escala. Ela coordena S1 (Research), S2 (Content), S3 (Blog), S4 (Landing), S5 (Distribution), S6 (Analytics) e S7 (Automation) em um fluxo unificado.

## Quando Usar

- Usuario quer criar um site de curadoria completo para um nicho
- Usuario quer dominar um nicho global com reviews/comparativos
- Usuario quer automatizar a criacao de paginas de produto em escala
- Usuario menciona "flywheel completo", "pipeline de curadoria", "dominar nicho"
- Usuario quer lancar um catalogo de reviews/comparativos
- Usuario quer consistencia visual em todas as paginas

## Input Schema

```yaml
project:
  name: string              # Nome do projeto/site (e.g., "AI Video Tools Hub")
  domain: string            # Dominio alvo (e.g., "aivideohub.com")
  niche: string             # Nicho/categoria (e.g., "AI video generation")
  description: string       # Descricao curta do projeto

scope:
  products: string[]        # Lista de produtos para curar (e.g., ["HeyGen", "Synthesia", "ElevenLabs"])
  categories: string[]      # Categorias para organizar (e.g., ["video-generation", "voice-cloning", "editing"])
  languages: string[]       # Idiomas para localizar (e.g., ["en", "pt-BR", "es"])
  
visual_style:
  theme: string             # "brutalist-jrpg" (default) | "minimal" | "dark-terminal"
  primary_color: string     # Hex ou nome (default: "#1a1a2e")
  accent_color: string      # Hex ou nome (default: "#e94560")
  font_combo: string        # "space-grotesk-inter" (default) | "ibm-plex" | "sora-inter"

automation:
  refresh_interval: string  # "weekly" (default) | "monthly" | "quarterly"
  asset_update: boolean     # true (default) - atualizar assets automaticamente
  benchmark_refresh: boolean # true (default) - recalcular benchmarks

output_format:
  pages: string[]           # ["review", "comparison", "category", "hub"] (default: all)
  deploy_target: string     # "github-pages" (default) | "netlify" | "vercel" | "custom"
```

## Workflow

### Step 1: Capturar Dados Oficiais

Para cada produto em `scope.products`:

1. **Identificar URL oficial**
   - Usar `web_search "[product name] official website"`
   - Validar com `web_fetch` para confirmar autenticidade
   - Registrar URL canônica

2. **Extrair dados estruturados**
   - Nome oficial do produto
   - Descricao/tagline
   - Fundadores/empresa
   - Data de lancamento
   - Categoria(s) primaria(s)
   - Tags secundarias

3. **Armazenar em `project_asset_profile`**
   ```yaml
   project_asset_profile:
     id: [product-slug]
     official_url: [URL]
     captured_at: [ISO timestamp]
     data_source: "official"
   ```

### Step 2: Extrair Proposta de Valor

1. **Analise de homepage**
   - `web_fetch` homepage principal
   - Identificar hero section: headline + subheadline
   - Extrair 3-5 beneficios principais
   - Identificar CTA principal

2. **Decodificar proposta unica**
   - O que torna este produto diferente?
   - Qual problema resolve?
   - Para quem e feito? (persona alvo)
   - Por que escolher este vs alternativas?

3. **Gerar value proposition statement**
   ```yaml
   value_proposition:
     headline: "[produto] permite [persona] fazer [acao] [diferenciador]"
     key_benefits: [lista de 3-5]
     target_persona: [descricao]
     differentiation: "[como e diferente dos concorrentes]"
   ```

### Step 3: Extrair Pricing, Features e Categorias

1. **Pricing extraction**
   - `web_search "[product] pricing"` + `web_fetch` pricing page
   - Extrair: planos, precos, limites, trial, garantia
   - Identificar plano mais popular
   - Calcular valor real (features/preco)

2. **Feature matrix**
   - Listar todas as features visiveis
   - Categorizar: core, advanced, enterprise, experimental
   - Identificar features unicas/exclusivas
   - Marcar limitacoes conhecidas

3. **Categoria taxonomica**
   - Atribuir categorias primarias de `scope.categories`
   - Adicionar tags cruzadas relevantes
   - Mapear hierarquia: categoria > subcategoria > produto

4. **Output estruturado**
   ```yaml
   pricing_tiers:
     - name: "Free"
       price: 0
       features: [lista]
       limits: [lista]
     - name: "Pro"
       price: [valor]
       features: [lista]
       limits: [lista]
   
   feature_matrix:
     core: [features essenciais]
     advanced: [features premium]
     unique: [features exclusivas deste produto]
   
   categorization:
     primary: [categoria principal]
     secondary: [categorias cruzadas]
     tags: [lista de tags]
   ```

### Step 4: Coletar Assets do Proprio Site

1. **Assets prioritarios**
   - Logo oficial (SVG preferido, PNG fallback)
   - Favicon (ICO, PNG, SVG)
   - Screenshot da homepage (1280x800, mobile 375x800)
   - Hero image / ilustracao principal
   - Screenshots do produto (interface, features)
   - Thumbnails de demo/video

2. **Metodo de coleta**
   - Inspecionar homepage com `web_fetch`
   - Buscar `<img>`, `<svg>`, `<link rel="icon">`
   - Validar URLs absolutas
   - Baixar e verificar integridade

3. **Paleta de cores**
   - Extrair cores dominantes da homepage
   - Usar gerador de paleta ou analise manual
   - Identificar: primary, secondary, accent, background

4. **Output: project_asset_profile completo**
   ```yaml
   project_asset_profile:
     id: [product-slug]
     official_url: [URL]
     
     logo_url: [URL]
     favicon_url: [URL]
     
     screenshots:
       - type: "homepage-desktop"
         url: [URL]
         dimensions: "1280x800"
       - type: "homepage-mobile"
         url: [URL]
         dimensions: "375x800"
       - type: "product-interface"
         url: [URL]
         dimensions: [variavel]
     
     palette:
       primary: "#[hex]"
       secondary: "#[hex]"
       accent: "#[hex]"
       background: "#[hex]"
       text: "#[hex]"
     
     visual_style:
       density: "medium" | "high" | "minimal"
       tone: "clean-tech" | "playful" | "enterprise" | "creative"
       frame: "brutalist-jrpg"
     
     derived_assets:
       card_thumb: "/assets/[slug]-card.png"
       hero_crop: "/assets/[slug]-hero.png"
       og_image: "/assets/[slug]-og.png"
   ```

### Step 5: Gerar Benchmark Simples

1. **Benchmark template**
   - Usar `references/benchmark-template.yaml`
   - Preencher com dados coletados
   - Calcular scores em 5 dimensoes

2. **Dimensoes de avaliacao**
   | Dimensao | Peso | Metricas |
   |----------|------|----------|
   | Valor | 25% | Features/preco, trial, garantia |
   | Facilidade | 20% | Onboarding, UX, docs |
   | Performance | 20% | Velocidade, uptime, escalabilidade |
   | Suporte | 15% | Chat, docs, comunidade |
   | Integracoes | 20% | APIs, plugins, workflows |

3. **Comparativo automatico**
   - Se `scope.products` tiver 2+ itens
   - Gerar matriz de comparacao
   - Identificar vencedor por categoria
   - Destaque de "melhor para [persona]"

4. **Output benchmark**
   ```yaml
   benchmark:
     product: [slug]
     scores:
       valor: [1-10]
       facilidade: [1-10]
       performance: [1-10]
       suporte: [1-10]
       integracoes: [1-10]
       overall: [weighted average]
     
     verdict: "[Strong Pick | Worth Testing | Skip]"
     best_for: "[persona especifica]"
     
     comparison:
       vs_[competitor]: "[2-3 frases comparando]"
   ```

### Step 6: Decidir Templates

1. **Template matching**
   - Review page: produto unico com depth
   - Comparison page: 2-3 produtos head-to-head
   - Category hub: lista de N produtos com filtros
   - Landing page: foco em conversao para 1 produto

2. **Criterios de decisao**
   ```yaml
   template_decision:
     has_comparison_data: true -> "comparison"
     products_in_category >= 5: -> "category-hub"
     deep_features_available: true -> "review"
     affiliate_link_ready: true -> "landing"
   ```

3. **Personalizacao por produto**
   - Avaliar densidade de features
   - Ajustar para "light" | "standard" | "deep"
   - Definir secoes prioritarias

### Step 7: Montar Paginas

1. **Ler templates**
   - `templates/review-brutalist-jrpg.html`
   - `templates/comparison-brutalist-jrpg.html`
   - `templates/category-hub-brutalist-jrpg.html`
   - `templates/landing-brutalist-jrpg.html`

2. **Aplicar estilo visual**
   - CSS custom properties do `visual_style`
   - Tipografia do `font_combo`
   - Paleta extraida do produto
   - Componentes JRPG: status-card, stats-box, terminal

3. **Preencher conteudo**
   - Dados oficiais (Step 1-3)
   - Assets locais (Step 4)
   - Benchmark scores (Step 5)
   - Proposta de valor (Step 2)

4. **Componentes obrigatorios**
   ```
   - hero-panel (logo + screenshot + headline)
   - product-status-card (stats + badges)
   - benchmark-stats-box (scores visuais)
   - comparison-grid (se aplicavel)
   - official-link-panel (CTA + disclaimer)
   - pros-cons-terminal (lista estilo terminal)
   - faq-command-list (FAQs como comandos)
   - category-map-panel (navegacao)
   ```

5. **Output HTML**
   - Arquivo unico self-contained
   - CSS inline (sem externos)
   - Mobile-first responsivo
   - FTC disclosure visivel

### Step 8: Localizar

1. **Para cada idioma em `scope.languages`**
   - Traduzir headline e subheadline
   - Adaptar terminologia tecnica
   - Ajustar formato de precos (moeda)
   - Revisar expressoes idiomáticas

2. **Estrutura de diretórios**
   ```
   /en/[slug]-review.html
   /pt-BR/[slug]-review.html
   /es/[slug]-review.html
   ```

3. **Metadados i18n**
   ```html
   <html lang="pt-BR">
   <link rel="alternate" hreflang="en" href="/en/[slug]-review.html">
   <link rel="alternate" hreflang="pt-BR" href="/pt-BR/[slug]-review.html">
   ```

### Step 9: Distribuir

1. **Deploy options**
   - GitHub Pages: `git push` + Pages config
   - Netlify: drag-drop ou CLI
   - Vercel: `npx vercel deploy`
   - Custom: SFTP ou API

2. **Link structure**
   - Gerar sitemap.xml
   - Criar redirects amigáveis
   - Configurar canonical URLs

3. **Distribuicao adicional**
   - Bio link hub: adicionar links
   - Social snippets: OG tags completas
   - Email notification: avisar lista

### Step 10: Monitorar e Reciclar

1. **Tracking setup**
   - UTM parameters por fonte
   - Conversion pixels
   - Analytics baseline

2. **Refresh triggers**
   - Agendamento: `refresh_interval`
   - Mudanca de pricing detectada
   - Nova feature lancada
   - Queda de performance

3. **Reciclagem automatica**
   - Re-executar Steps 1-7 para produtos stale
   - Atualizar benchmarks com novos dados
   - Re-gerar assets se mudou visual

4. **Feedback loop**
   - S6 Analytics → S1 Research
   - Winning niches → mais produtos na categoria
   - Underperformers → re-avaliar ou remover

## Output Schema

```yaml
output_schema_version: "1.0.0"

flywheel_execution:
  project_name: string
  started_at: ISO timestamp
  completed_at: ISO timestamp
  
  products_processed: number
  pages_generated: number
  languages_deployed: string[]
  
  execution_log:
    - step: number
      name: string
      status: "completed" | "partial" | "failed"
      duration_seconds: number
      notes: string
  
  outputs:
    - type: "review" | "comparison" | "category" | "landing"
      product: string
      language: string
      path: string
      url: string
  
  assets_created:
    - type: string
      source: string
      derived: string[]
  
  benchmarks_generated: number
  deploy_location: string

chain_metadata:
  skill_slug: "global-curation-flywheel"
  stage: "meta"
  timestamp: ISO string
  suggested_next:
    - "conversion-tracker"
    - "performance-report"
    - "self-improver"
```

## Output Format

```markdown
## 🎮 Global Curation Flywheel Complete

**Project**: [project_name]
**Duration**: [X] minutes
**Products**: [N] processed

### 📊 Execution Summary

| Step | Status | Duration | Notes |
|------|--------|----------|-------|
| 1. Captura de Dados | ✅ | 2m | All products validated |
| 2. Proposta de Valor | ✅ | 3m | 5 value props extracted |
| ... | ... | ... | ... |

### 📄 Pages Generated

| Type | Product | Language | URL |
|------|---------|----------|-----|
| Review | HeyGen | en | /en/heygen-review.html |
| Review | HeyGen | pt-BR | /pt-BR/heygen-review.html |
| Comparison | HeyGen vs Synthesia | en | /en/heygen-vs-synthesia.html |

### 🎨 Assets Created

- `heygen-card.png` (derived from logo)
- `heygen-hero.png` (cropped screenshot)
- `heygen-og.png` (social share)

### 📈 Benchmarks

| Product | Overall | Best For |
|---------|---------|----------|
| HeyGen | 8.2/10 | Content creators |
| Synthesia | 7.8/10 | Enterprise teams |

### 🚀 Deployed

- **Location**: [deploy_target]
- **URL**: [live URL]
- **Status**: Live

### 🔄 Next Steps

1. Run `conversion-tracker` to set up tracking
2. Run `performance-report` in 7 days to measure results
3. Run `self-improver` to optimize based on data
```

## Error Handling

| Error | Recovery |
|-------|----------|
| Produto sem URL oficial | `web_search` para encontrar, se nao encontrar: skip com warning |
| Homepage nao acessivel | Fallback para dados secundarios (APIs, reviews) |
| Assets protegidos | Usar placeholder com URL oficial, nao hackear |
| Pricing nao disponivel | Marcar como "Contact Sales", continuar |
| Traducao falhou | Usar ingles como fallback, marcar para revisao manual |
| Deploy falhou | Tentar 2x, se falhar: instrucoes manuais |

## Examples

### Example 1: Full Flywheel

**User**: "Run the full flywheel for a site dominating AI video tools"

**Action**:
1. Scope: AI video generation niche, 10 products, 3 languages
2. Execute Steps 1-10 para cada produto
3. Generate: 10 reviews x 3 langs = 30 pages + comparisons + category hub
4. Deploy to GitHub Pages
5. Set up tracking and refresh cycle

### Example 2: Single Product

**User**: "Add HeyGen to my curation site with brutalist style"

**Action**:
1. Scope: HeyGen only, existing site
2. Execute Steps 1-7 for HeyGen
3. Generate: review page + comparison with existing products
4. Integrate with existing site structure
5. Deploy incrementally

### Example 3: Refresh Existing

**User**: "Refresh my site for pricing changes this month"

**Action**:
1. Detect stale data (>30 days)
2. Re-run Steps 1-5 for affected products
3. Update benchmarks with new data
4. Regenerate pages with changes highlighted
5. Deploy with version history

## References

- `references/benchmark-template.yaml` — Template de benchmark
- `references/visual-system.yaml` — Sistema visual brutalista/JRPG
- `references/asset-pipeline.yaml` — Pipeline de assets
- `references/localization-rules.md` — Regras de localizacao
- `templates/review-brutalist-jrpg.html` — Template de review
- `templates/comparison-brutalist-jrpg.html` — Template de comparacao
- `templates/category-hub-brutalist-jrpg.html` — Template de categoria
- `templates/landing-brutalist-jrpg.html` — Template de landing

## Flywheel Connections

### Feeds Into

- `conversion-tracker` (S6) — set up tracking for all generated pages
- `performance-report` (S6) — measure results after deployment
- `self-improver` (S8) — optimize based on performance data
- `content-decay-detector` (S3) — monitor for stale content
- `seo-audit` (S6) — audit generated pages for SEO

### Fed By

- `affiliate-program-search` (S1) — product list from research
- `trending-content-scout` (S1) — trending products to add
- `competitor-spy` (S1) — competitor products to compare
- `list-affitor-program` (S1) — programs to feature

### Feedback Loop

- Performance data reveals which product pages convert best
- Winning products → prioritize for refresh
- Underperformers → re-evaluate or replace
- New products in winning categories → add to scope

## Quality Gate

Before delivering output, verify:

- [ ] All products have official URLs validated
- [ ] Assets are from official sources (no copyright violations)
- [ ] Benchmarks have numerical scores with reasoning
- [ ] HTML pages are self-contained (no external dependencies)
- [ ] FTC disclosure is visible on all pages
- [ ] Localization is complete for all specified languages
- [ ] Deploy was successful or manual instructions provided
- [ ] Tracking is set up or instructions provided

If any check fails, fix before delivering. Do not flag to user.

---

**Last Updated**: 2026-04-15
**Version**: 1.0.0
**Author**: Affitor
