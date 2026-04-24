# Orquidia-Uniteia — Manifesto do Projeto

**Versao:** 1.0  
**Data:** 2026-04-02  
**Status:** Em construcao

---

## Visao

Orquidia-Uniteia e a **linha de producao de conteudo pessoal e privado** para o ecossistema uniteia.com.

Nao e um gerador de conteudo generico. E uma fabrica de conteudo com alma -- cada pagina, cada artigo, cada secao que passa por aqui carrega a identidade, o tom e a qualidade que definem a marca Uniteia.

Quando criamos um novo site, uma nova landing page, ou expandimos o dominio uniteia.com com novas verticais, Orquidia e o motor que gera o conteudo pronto para producao.

---

## Principio Fundamental: Pipeline Sequencial com Gate de Qualidade

O conteudo NAO e gerado de uma vez. Ele passa por uma **linha de montagem** onde cada agente especialista recebe o trabalho do agente anterior, analisa, corrige, melhora e passa adiante.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE CONTEUDO ORQUIDIA                 │
│                                                                 │
│  User Prompt                                                    │
│      │                                                          │
│      ▼                                                          │
│  ┌──────────────┐                                               │
│  │ TriageAgent  │ Classifica intencao, niche, tom, idioma       │
│  └──────┬───────┘  GATE: categoria identificada?                │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ ResearchAgent│ Pesquisa dados, fontes, referencias, fatos    │
│  └──────┬───────┘  GATE: fontes suficientes?                    │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ WritingAgent │ Redacao inicial -- voz, estrutura, narrativa  │
│  └──────┬───────┘  GATE: conteudo coerente e completo?          │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ EditingAgent │ Revisao -- fluidez, gramatica, estilo, tom    │
│  └──────┬───────┘  GATE: padrao de qualidade atingido?          │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │   SeoAgent   │ Otimizacao -- keywords, meta tags, schema     │
│  └──────┬───────┘  GATE: score SEO minimo atingido?             │
│         │ SIM                                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Validation   │ Validacao final -- consistencia, integridade  │
│  │    Agent     │ GATE: tudo passou? REJEITA volta ao Writing   │
│  └──────┬───────┘                                               │
│         │ APROVADO                                              │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ FeedbackAgent│ Analisa resultado vs expectativa, gera notas  │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ LearningAgent│ Atualiza base de conhecimento, ajusta pesos   │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ╔══════════════╗                                               │
│  ║  CONTEUDO    ║ -> Pronto para publicar no Uniteia.com        │
│  ║  PUBLICADO   ║                                               │
│  ╚══════════════╝                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Regra do Gate de Qualidade

Cada agente responde:
- **APROVADO** -> passa ao proximo agente
- **REJEITADO com correcao** -> o agente corrige automaticamente e passa
- **REJEITADO sem correcao** -> volta ao agente anterior com feedback especifico
- **FALHA CRITICA** -> para o pipeline, reporta erro ao usuario

Maximo de 3 ciclos de correcao por estagio. Se nao atingir qualidade em 3 tentativas, escala para decsao humana via dashboard.

---

## Os 50+ Agentes Especializados (9 estagios)

> Em pesquisa continua via cron job `orquidia-50-agents-research` (roda a cada 4h).
> Catalogo detalhado sendo construido em `docs/agents-catalog-and-pipeline.md`.

### Visao Geral dos 9 Estagios

| Estagio | Agentes | Funcao |
|---------|---------|--------|
| 1. Triage & Planning | 10 | Classificar intencao, niche, audiencia, tipo, idioma |
| 2. Research | 10 | Coletar dados, fatos, fontes, estatisticas, tendencias |
| 3. Content Creation | 16 | Redacao especializada por secao, tom, formato |
| 4. Editing & Refinement | 10 | Gramatica, estilo, fluidez, legibilidade |
| 5. SEO & Discoverability | 10 | Meta tags, keywords, schema, links internos |
| 6. Visual & Media | 8 | Imagens hero, inline, alt text, infograficos |
| 7. Validation & Quality | 10 | Consistencia, fatos, bias, acessibilidade, compliance |
| 8. Publishing & Distribution | 7 | Formatacao Astro/MDX, social, email, sitemap |
| 9. Feedback & Learning | 8 | Analytics, padroes, ajuste de prompts, A/B tests |
| **TOTAL** | **89** | Pipeline completo com gates de qualidade |

### Agentes Originais (8) — Agora expandidos

O catalogo inicial de 8 agentes foi expandido para 50+ com especializacao granular.
Cada estagio tem seu proprio gate de qualidade. Rejeicao volta ao estagio anterior (max 3 ciclos).

---

## Os 8 Agentes Especializados (catalogo base)

### 1. TriageAgent
**Responsabilidade:** Primeiro contato com o prompt do usuario. Classifica e prepara o terreno.
- Identifica intencao (artigo, landing page, produto, tutorial, etc.)
- Detecta niche e segmento Uniteia relevante
- Define tom de voz (formal, conversacional, tecnico, inspiracional)
- Seleciona idioma e variante regional
- Extrai requisitos implicitos do prompt

**Gate de qualidade:** Categoria e niche identificadas com confianca > 80%

### 2. ResearchAgent
**Responsabilidade:** Coleta dados, fatos, referencias e contexto para o conteudo.
- Pesquisa referencias e fontes confiaveis
- Identifica dados estatisticos relevantes
- Coleta exemplos, casos de uso, analogias
- Verifica fatos e atualidade das informacoes
- Gera brief estruturado para o WritingAgent

**Gate de qualidade:** Minimo de 3 fontes/referencias por secao do conteudo

### 3. WritingAgent
**Responsabilidade:** Redacao inicial -- transforma brief em conteudo estruturado.
- Escreve primeira versao completa do conteudo
- Segue estrutura definida pelo TriageAgent
- Incorpora dados e referencias do ResearchAgent
- Mantem tom de voz e estilo definidos
- Gera estrutura HTML/MDX pronta

**Gate de qualidade:** Conteudo coerente, completo, sem secoes vazias ou placeholders

### 4. EditingAgent
**Responsabilidade:** Revisao e refinamento -- eleva a qualidade do texto.
- Corrige gramatica, ortografia, pontuacao
- Melhora fluidez e ritmo da leitura
- Ajusta tom para padrao Uniteia
- Remove repeticoes e redundancias
- Otimiza paragrafos para leitura digital (escaneabilidade)
- Adiciona transicoes entre secoes

**Gate de qualidade:** Score de legibilidade >= 60, zero erros gramaticais, tom consistente

### 5. SeoAgent
**Responsabilidade:** Otimizacao para mecanismos de busca e discoverability.
- Otimiza titulo H1 e meta title
- Gera meta description otimizada
- Define keywords primarias e secundarias
- Cria slug URL amigavel
- Adiciona schema.org JSON-LD estruturado
- Otimiza heading hierarchy (H1->H2->H3)
- Sugere imagens e alt texts
- Verifica keyword density natural

**Gate de qualidade:** Score SEO >= 80/100, schema.org valido, heading hierarchy correta

### 6. ValidationAgent
**Responsabilidade:** Gate final -- valida integridade e consistencia do conteudo completo.
- Verifica se todas as secoes estao presentes e preenchidas
- Valida links internos e externos
- Confirma consistencia de fatos ao longo do texto
- Verifica formacao MDX/HTML valida
- Checa conformidade com guidelines Uniteia
- Valida acessibilidade (alt texts, contraste, semantica)

**Gate de qualidade:** ZERO erros criticos, ZERO warnings de acessibilidade, 100% secoes preenchidas
**Acao se rejeitar:** Retorna ao WritingAgent com relatorio detalhado do que falhou

### 7. FeedbackAgent
**Responsabilidade:** Analisa o resultado final vs expectativa inicial.
- Compara output final com prompt original
- Identifica gaps entre intencao e resultado
- Gera notas por dimensao (qualidade, relevancia, tom, SEO)
- Registra padroes de sucesso e falha
- Sugere melhorias para o proximo ciclo

### 8. LearningAgent
**Responsabilidade:** Aprende com cada execucao para melhorar o sistema.
- Atualiza embeddings de conteudo bem-sucedido
- Ajusta pesos e criterios dos gates
- Expande base de conhecimento por niche
- Identifica padroes recorrentes de alta qualidade
- Gera insights para evolucao dos outros agentes

---

## Dashboard (Interface Primaria)

Orquidia e UI-PRIME. O dashboard web e a interface principal. CLI e apenas para setup.

### Paginas do Dashboard

| Rota | Funcao |
|------|--------|
| `/` | Status do sistema, agentes ativos, ultimos conteudos |
| `/dashboard` | Lista de conteudos gerados, filtros, status |
| `/dashboard/content/generate` | **PRIMARIA** -- Criacao de conteudo com pipeline visual |
| `/dashboard/ai` | Studio de IA -- prompt avancado, templates, ajustes finos |
| `/dashboard/analytics` | Metricas de qualidade, performance dos agentes, tendencias |
| `/dashboard/settings` | Configuracoes do sistema, modelos, thresholds de gate |

### Generate.tsx — A Pagina Central

O gerador de conteudo deve mostrar:
1. **Formulario de entrada rico:**
   - Prompt/descricao do conteudo desejado
   - Tipo (artigo, landing page, produto, tutorial, FAQ)
   - Niche/segmento Uniteia
   - Tom de voz
   - Idioma
   - Alvo (qual site/subdominio uniteia.com)
   - Referencias opcionais (URLs, notas)

2. **Pipeline em tempo real:**
   - Visualizacao dos 8 agentes como estagios
   - Status de cada agente (aguardando, processando, aprovado, rejeitado, correcao)
   - Tempo por estagio
   - Log do que cada agente alterou

3. **Preview e diff:**
   - Conteudo final renderizado
   - Diff por estagio (o que cada agente mudou)
   - Score de qualidade final
   - Score SEO
   - Checklist de validacao

4. **Acoes finais:**
   - Publicar diretamente no Uniteia.com
   - Exportar como MDX/HTML
   - Salvar como rascunho
   - Re-rodar pipeline com ajustes

---

## Integracao com Uniteia

Conteudo aprovado deve ser publicavel diretamente no ecossistema Uniteia:

1. **Gerar arquivos Astro/MDX** no padrao do Uniteia (frontmatter, layouts, components)
2. **Publicar via API** no repositorio `uniteia/`
3. **Manter versionamento** -- cada publicacao e um commit com hash
4. **Multi-site aware** -- conteudo pode ir para diferentes subdominios/verticais

---

## Principios de Design

### Privacidade Primeiro
- Todo conteudo gerado e privado por padrao
- Nenhum dado e enviado para servicos externos sem consentimento
- Historico de geracao fica local no sistema

### Qualidade sobre Velocidade
- Cada gate de qualidade e obrigatorio
- Nao pular estagios para acelerar
- Melhor demorar 2 minutos e entregar qualidade do que 10 segundos com lixo

### Transparencia Total
- Usuario ve exatamente o que cada agente fez
- Diff por estagio e obrigatorio
- Logs estruturados de cada decisao do pipeline

### Aprendizado Continuo
- Cada execucao melhora a proxima
- LearningAgent ajusta criterios baseado em feedback
- Sistema fica mais inteligente com o uso

### Uniteia Brand
- Vermelho Uniteia em toda interface
- Estetica premium, minimalista, cinematografica
- NUNCA usar azul como cor primaria

---

## Estado Atual (2026-04-02)

- [x] Estrutura de projetos configurada (Turborepo + Bun)
- [x] 8 stubs de agentes em `packages/agents/` com tipos definidos
- [x] Routes do dashboard existentes (7 rotas, compilam)
- [x] Cron de validacao basico funcionando
- [ ] ContentPipelineOrchestrator implementado
- [ ] Agentes com logica real (hoje sao stubs vazios)
- [ ] Gates de qualidade funcionais
- [ ] Dashboard generate.tsx com UX premium
- [ ] Visualizacao do pipeline em tempo real
- [ ] Integracao de publicacao com Uniteia
- [ ] LearningAgent com base de conhecimento ativa
- [ ] 252 inline styles -> migrar para design system Uniteia

---

## Proximos Passos (Prioridade)

1. **ContentPipelineOrchestrator** -- Execucao sequencial com gates
2. **Implementar agentes um a um** — Triage -> Research -> Writing -> Editing -> SEO -> Validation -> Feedback -> Learning
3. **Generate.tsx premium** — A pagina central merece UX de primeira
4. **Design system Uniteia** — Remover inline styles, aplicar identidade visual
5. **Integracao Uniteia** — Publicacao automatica de conteudo aprovado

---

> *"Conteudo de qualidade nao se gera, se fabrica — com precisao, revisao e alma."*
