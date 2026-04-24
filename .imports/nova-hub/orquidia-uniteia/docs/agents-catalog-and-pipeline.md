     1|# Agents Catalog & Pipeline Design — Orquidia-Uniteia 50+ Agent Content Factory
     2|
     3|> **Document Type:** Architecture & Design Specification
     4|> **Version:** 1.2.0
     5|> **Created:** 2026-04-05
     6|> **Status:** Active Research & Design
     7|> **Target:** Production-ready 50+ agent sequential content pipeline for uniteia.com domains
     8|
     9|---\n
    10|\n
   11|## 1. Executive Summary\n
    12|\n
    13|### Vision\n
    14|\n
    15|Orquidia-Uniteia operates as a **private content factory** — an automated, multi-stage pipeline where 50+ specialized AI agents collaborate sequentially to produce publication-ready content for uniteia.com domains. Each agent is a domain expert that receives input from the previous stage, applies its specialized knowledge, corrects and improves, then passes forward with quality gates at every boundary.\n
    16|\n
    17|### Current State vs. Target State\n
    18|\n
    19||| Aspect | Current (4 agents) | Target (50+ agents) |\n
    20|||--------|-------------------|---------------------|\n
    21||| Agent roles | Scout, Analyst, Curator, Sentinel | 9 stages, 50+ specialized agents |\n
    22||| Pipeline | Linear sequential | Sequential with parallel sub‑stages |\n
    23||| Quality gates | Single audit at end | Gate between every stage (9 gates) |\n
    24||| Error recovery | Fallback provider only | 3 correction cycles per stage |\n
    25||| Content types | Basic articles | Articles, landing pages, products, tutorials, FAQs, social |\n
    26||| Languages | pt‑BR | Multilingual (pt‑BR, en, es, fr) |\n
    27||| Image generation | None | Qwen‑image‑2.0‑pro integration |\n
    28||| Observability | Basic logging | Real‑time dashboard with per‑stage metrics |\n
    29|\n
    30|### Key Design Principles\n
    31|\n
    32|1. **Specialization over generalization**: Each agent has one narrow responsibility with deep expertise.\n33|2. **Quality at every gate**: No content advances without passing stage‑specific validation.\n34|3. **Max 3 correction cycles**: Each stage can self‑correct up to 3 times before escalation.\n35|4. **Context preservation**: Full provenance chain from brief to publication.\n36|5. **Cost‑aware model routing**: Expensive models only where needed (creation, validation); cheaper models for routine tasks.\n37|6. **Language‑agnostic pipeline**: Agents work in any target language with locale‑specific adapters.\n38|7. **Idempotent stages**: Each stage can be re‑run independently without corrupting the pipeline.\n39|\n
    40|### Estimated Performance\n
    41|\n
    42||\nMetric | Single Article | Batch (100 articles) |\n
    43||--------|---------------|---------------------|\n
    44|| Total agents invoked | 50‑55 | 5,000‑5,500 |\n
    45|| Estimated time (sequential) | 8‑15 min | ~14 h |\n
    46|| Estimated time (parallelizable) | 5‑8 min | ~8 h |\n
    47|| Token cost (est.) | 150K‑300K | 15M‑30M |\n
    48|| Quality score target | 90+ / 100 | 90+ / 100 average |\n
    49|\n
    50|---\n
    51|\n
    52|## 2. Architecture Overview\n
    53|\n
    54|### 2.1 Pipeline Pattern: Sequential with Parallel Sub‑Stages\n
    55|\n
    56|The Orquidia pipeline uses a **hybrid sequential‑DAG pattern**. There are 9 primary stages (Triage & Planning, Research, Content Creation, Editing & Refinement, SEO & Discoverability, Visual & Media, Validation & Quality, Publishing & Distribution, Feedback & Learning). Within a stage, agents that do not share data may execute in parallel, reducing overall latency by up to 40 %.\n
    57|\n
    58|```\n
    59|┌─────────────────────────────────────────────────────────────────────┐\n
    60|│                     STAGE 1: TRIAGE & PLANNING                      │\n
    61|│  [IntentClassifier] → [NicheDetector] → [ToneAnalyzer]             │\n
    62|│         → [AudienceProfiler] → [ContentTypeSelector]                │\n
    63|│         → [KeywordIntentMapper] → [CompetitorAnalyzer]              │\n
    64|│         → [ContentGapDetector] → [BriefGenerator] → [LanguageDetector]│\n
    65|│                              ↓ QUALITY GATE 1                       │\n
    66|├─────────────────────────────────────────────────────────────────────┤\n
    67|│                       STAGE 2: RESEARCH                             │\n
    68|│  [WebResearcher] → [FactChecker] → [DataSourceValidator]            │\n
    69|│         → [TrendAnalyzer] → [CompetitorContentAnalyzer]             │\n
    70|│         → [StatisticFinder] → [CaseStudyCollector]                  │\n
    71|│         → [ReferenceOrganizer] → [SourceCiter] → [AuthorityScoreCalc]│\n
    72|│                              ↓ QUALITY GATE 2                       │\n
    73|├─────────────────────────────────────────────────────────────────────┤\n
    74|│                     STAGE 3: CONTENT CREATION                       │\n
    75|│  [HeadlineWriter] → [HookWriter] → [IntroSpecialist]                │\n
    76|│         → [BodyWriter] → [Storyteller] → [TechnicalWriter]          │\n
    77|│         → [Copywriter] → [UXWriter] → [MicrocopySpecialist]         │\n
    78|│         → [ExampleGenerator] → [AnalogyCreator]                     │\n
    79|│         → [FAQGenerator] → [CTAOptimizer] → [ConclusionWriter]      │\n
    80|│         → [Transcreator] → [LocalizationAdapter]                    │\n
    81|│                              ↓ QUALITY GATE 3                       │\n
    82|├─────────────────────────────────────────────────────────────────────┤\n
    83|│                   STAGE 4: EDITING & REFINEMENT                     │\n
    84|│  [GrammarChecker] → [StyleEditor] → [ToneConsistencyChecker]        │\n
    85|│         → [ReadabilityOptimizer] → [FlowsAndTransitionsEditor]      │\n
    86|│         → [RedundancyRemover] → [Simplifier] → [VoiceEnhancer]      │\n
    87|│         → [SentenceStructureOptimizer] → [ParagraphBalancer]        │\n
    88|│                              ↓ QUALITY GATE 4                       │\n
    89|├─────────────────────────────────────────────────────────────────────┤\n
    90|│                   STAGE 5: SEO & DISCOVERABILITY                    │\n
    91|│  [MetaTitleOptimizer] → [MetaDescriptionWriter]                     │\n
    92|│         → [KeywordDensityAnalyzer] → [SemanticKeywordInjector]      │\n
    93|│         → [SchemaGenerator] → [InternalLinkPlanner]                 │\n
    94|│         → [URLSlugOptimizer] → [ImageSEOOptimizer]                  │\n
    95|│         → [SERPSnippetPreview] → [E‑E‑ATScorer]                     │\n
    96|│                              ↓ QUALITY GATE 5                       │\n
   100|├─────────────────────────────────────────────────────────────────────┤\n
   101|│                     STAGE 6: VISUAL & MEDIA                         │\n
   102|│  [HeroImagePromptGenerator] → [InlineImageSelector]                 │\n
   103|│         → [ImageAltTextWriter] → [InfographicDesigner]              │\n
   104|│         → [DiagramGenerator] → [IconSelector]                       │\n
   105|│         → [VideoScriptWriter] → [ThumbnailDesigner]                 │\n
   106|│                              ↓ QUALITY GATE 6                       │\n
   107|├─────────────────────────────────────────────────────────────────────┤\n
   108|│                   STAGE 7: VALIDATION & QUALITY                     │\n
   109|│  [ContentConsistencyChecker] → [FactRevalidator] → [BiasDetector]   │\n
   110|│         → [PlagiarismChecker] → [AccessibilityAuditor]              │\n
   111|│         → [LinkValidator] → [FormattingValidator]                   │\n
   112|│         → [BrandComplianceChecker] → [LegalComplianceChecker]       │\n
   113|│         → [QualityScoreCalculator]                                  │\n
   114|│                              ↓ QUALITY GATE 7                       │\n
   115|├─────────────────────────────────────────────────────────────────────┤\n
   116|│                 STAGE 8: PUBLISHING & DISTRIBUTION                  │\n
   117|│  [AstroMDXFormatter] → [WordPressFormatter]                         │\n
   120|│         → [SocialMediaAdaptator] → [EmailNewsletterConverter]       │\n
   121|│         → [RSSFeedUpdater] → [SitemapUpdater]                       │\n
   122|│         → [CDNInvalidator] → [AnalyticsTagger]                      │\n
   123|│                              ↓ QUALITY GATE 8                       │\n
   124|├─────────────────────────────────────────────────────────────────────┤\n
   125|│                    STAGE 9: FEEDBACK & LEARNING                     │\n
   126|│  [PerformanceAnalyzer] → [UserEngagementPredictor]                  │\n
   127|│         → [ContentLifecycleManager] → [KnowledgeBaseUpdater]        │\n
   128|│         → [PatternRecognizer] → [PromptOptimizer]                   │\n
   129|│         → [AgentTuner] → [ABLTestDesigner]                          │\n
   130|│                              ↓ QUALITY GATE 9                       │\n
   131|└─────────────────────────────────────────────────────────────────────┘\n
   132|```\n
   133|\n
   134|### 2.2 Context Passing Architecture\n
   135|\n
   136|The pipeline flows through a structured `PipelineContext` envelope:\n
   137|\n
   138|```typescript\n
   140|interface PipelineContext {\n
   141|  // === METADATA (immutable, accumulates) ===\n
   142|  pipelineId: string;           // UUID for this content run\n
   143|  contentId: string;            // Final content identifier\n
   144|  stage: number;                // Current stage (1‑9)\n
   145|  agentIndex: number;           // Agent position within stage\n
   146|  cycleCount: number;           // Correction cycles used (0‑3)\n
   147|  startTime: number;            // Pipeline start timestamp\n
   148|  language: string;             // Target locale (pt‑BR, en, etc.)\n
   149|\n
   150|  // === CONTENT (mutable, transformed by each agent) ===\n
   151|  brief: ContentBrief;          // From Stage 1, immutable after stage 1\n
   152|  research: ResearchData;       // From Stage 2, immutable after stage 2\n
   153|  draft: ContentDraft;          // From Stage 3, refined in stage 4\n
   154|  seo: SEOData;                 // From Stage 5\n
   155|  media: MediaPlan;             // From Stage 6\n
   156|  quality: QualityReport;       // From Stage 7\n
   157|\n
   158|  // === PROVENANCE (append‑only audit trail) ===\n
   159|  auditTrail: AuditEntry[];     // Every agent’s input/output/timestamp\n
   160|  qualityScores: QualityScore[];// Score after each gate\n
   161|  corrections: Correction[];    // Each correction cycle’s diff\n
   162|\n
   163|  // === ROUTING ===\n
   164|  nextAgent: string;            // Which agent processes next\n
   165|  skipStages: number[];         // Stages to skip (e.g., no images for FAQ)\n
   166|  fallbackChain: string[];      // Model fallback order\n
   167|}\n
   168|```\n
   169|\n
   170|### 2.3 Model Routing Strategy\n
   171|\n
   172||| Stage | Typical Agents | Recommended Model | Temperature | Why |\n
   173|------|----------------|-------------------|-------------|-----|\n
   174| 1 – Triage | IntentClassifier, NicheDetector, … | Claude Sonnet / GPT‑4o‑mini | 0.1‑0.3 | Classification needs low temp, high accuracy |\n
   175| 2 – Research | WebResearcher, FactChecker, … | Claude Opus / GPT‑4o | 0.1‑0.2 | Fact‑finding needs precision, not creativity |\n
   176| 3 – Creation | HeadlineWriter, BodyWriter, … | Claude Sonnet / GPT‑4o | 0.7‑0.9 | Creative writing needs high temperature |\n
   177| 4 – Editing | GrammarChecker, StyleEditor, … | Claude Haiku / GPT‑4o‑mini | 0.1‑0.3 | Editing needs precision, conservative changes |\n
   178| 5 – SEO | MetaTitleOptimizer, KeywordDensityAnalyzer, … | GPT‑4o‑mini / Gemini Flash | 0.2‑0.4 | Structured optimization, medium creativity |\n
   179| 6 – Visual | HeroImagePromptGenerator, … | Qwen‑image‑2.0‑pro + GPT‑4o | 0.7 | Image prompts need creative variety |\n
   180| 7 – Validation | FactRevalidator, BiasDetector, … | Claude Opus / GPT‑4o | 0.1‑0.2 | Validation needs strict, conservative judgment |\n
   181| 8 – Publishing | AstroMDXFormatter, … | GPT‑4o‑mini / Gemini Flash | 0.1 | Formatting is mechanical |\n
   182| 9 – Feedback | PerformanceAnalyzer, … | Claude Sonnet / GPT‑4o | 0.3‑0.5 | Analysis needs balanced reasoning |\n
   183|\n
   184|### 2.4 Existing Architecture Integration\n
   185|\n
   186|The current Orquidia‑Uniteia codebase (in `packages/ai-core/src/agents/`) already defines:\n
   187|- **OrchestratorAgent**: Multi‑provider orchestration with fallback chain (Gemini → OpenRouter)\n
   188|- **TeamOrchestrator**: Sequential 4‑agent pipeline (Scout → Analyst → Curator → Sentinel)\n
   189|- **AGENT_ROLES**: Scout, Analyst, Curator, Sentinel role definitions\n
   190|\n
   191|The 50+ agent pipeline **extends** this architecture by:\n
   192|1. Replacing the 4 fixed roles with a dynamic agent registry\n
   193|2. Adding quality gates between each stage (currently only Sentinel audits at end)\n
   194|3. Adding correction loop support (max 3 cycles per stage)\n
   195|4. Adding context envelope for structured data passing\n
   196|5. Adding model routing per agent type\n
   197|\n
   198|### 2.5 Error Recovery & Retry Patterns\n
   199|\n
   200|```\n
   201|Stage N Agent Processing:\n
   202|┌──────────────────────────────────────────────┐\n
   203|│ 1. Receive context from Stage N‑1            │\n
   204|│ 2. Validate input quality gate               │\n
   205|│    └── If FAIL → Request reprocessing from   │\n
   206|│        Stage N‑1 (max 3 total cycles)         │\n
   207|│ 3. Execute agent's specialized task           │\n
   208|│ 4. Run self‑validation                        │\n
   209|│    └── If FAIL → Self‑correct (max 3 cycles)  │\n
   210|│ 5. Output to Stage N+1 context envelope       │\n
   211|│ 6. Log audit trail entry                      │\n
   212|└──────────────────────────────────────────────┘\n
   213|```\n
   214|\n
   215|Fallback Strategy:\n
   216|- Primary model fails → Try secondary (same stage, same agent)\n
   217|- Secondary fails → Try tertiary with simpler prompt\n
   218|- Tertiary fails → Mark stage as DEGRADED, continue pipeline\n
   219|- If stage output quality < threshold → Full stage retry with different model\n
   220|- If 3 correction cycles exhausted → Escalate to human review queue\n
   221|\n
   222|### 2.6 Monitoring & Observability\n
   223|\n
   224|- Emitted metrics: latency, token usage, correction cycles, quality score.\n
   225|- Sink: Prometheus `/metrics` exposing `pipeline_stage_latency_seconds`, `pipeline_token_count_total`, `pipeline_correction_cycles_total`.\n
   226|- Alerting: If correction cycles > 2 for > 5 % of agents, raise `AgentPerformanceIssue`.\n
   227|\n
   228|### 2.7 Resource Management\n
   229|\n
   230|Expensive models (Claude Opus, GPT‑4o) are reserved for Stages 3, 4, 7, 9. Cheaper models (Claude Haiku, Gemini Flash) serve Stages 1, 2, 5, 6, 8, reducing batch cost by ~30 %.\n
   231|\n
   232|## 3. Detailed Agent Catalog (All 50+ Agents)\n
   233|\n
   234|Below is the canonical catalog. Each entry lists **Name**, **Stage**, **Responsibility**, **Input**, **Output**, **Quality‑Gate Criteria**, **System Prompt Snippet**, **Model / Parameters**, **Est. Time**, **Dependencies**.\n
   235|\n
   236|### Stage 1 – Triage & Planning (10 agents)\n
   237|\n
   238|- **IntentClassifier**\n
   239|  - Responsibility: Map a marketing goal to one of `brand_awareness, lead_generation, sales, education, community_building`.\n
   240|  - Input: `brief` metadata.\n
   241|  - Output: `{ intent: string, confidence: number }`.\n
   242|  - Quality‑Gate: `confidence > 0.9`; deterministic label.\n
   243|  - System Prompt: \"You are IntentClassifier, a precise intent‑detection system...\"\n
   244|  - Model: Claude Sonnet, `temp=0.2`, `max_tokens=512`, est. 0.5 s.\n
   245|  - Dependencies: None.\n
   246|\n
   247|- **NicheDetector**\n
   248|  - Responsibility: Identify content niche and sub‑topic clusters.\n
   249|  - Input: `brief` + `intent`.\n
   250|  - Output: `{ nicheName: string, description: string, keywordSet: string[] }`.\n
   251|  - Quality‑Gate: ≥3 viable niches, each `confidence > 0.8`.\n
   252|  - System Prompt: \"You are NicheDetector, a deep‑topic discovery engine...\"\n
   253|  - Model: GPT‑4o‑mini, `temp=0.3`, `max_tokens=512`, est. 0.7 s.\n
   254|  - Dependencies: IntentClassifier.\n
   255|\n
   256|- **ToneAnalyzer**\n
   257|  - Responsibility: Detect required tone (formal, casual, persuasive, etc.).\n
   258|  - Input: `brief`.\n
   259|  - Output: `{ toneName: string, keyAttributes: string[] }`.\n
   260|  - Quality‑Gate: Tone must align with target persona (validated later by ToneConsistencyChecker).\n
   261|  - System Prompt: \"You are ToneAnalyzer, a tone‑detection specialist...\"\n
   262|  - Model: Claude Haiku, `temp=0.1`, `max_tokens=256`, est. 0.3 s.\n
   263|  - Dependencies: IntentAnalyzer.\n
   264|\n
   265|- **AudienceProfiler**\n
   266|  - Responsibility: Build detailed audience personas.\n
   267|  - Input: `brief` + `tone`.\n
   270|  - Output: `{ demographics: string, motivations: string, painPoints: string[] }`.\n
   271|  - Quality‑Gate: Include ≥3 demographic dimensions, all validated against known persona templates.\n
   272|  - System Prompt: \"You are AudienceProfiler, a persona‑construction engine...\"\n
   273|  - Model: GPT‑4o‑mini, `temp=0.2`, `max_tokens=512`, est. 1 s.\n
   274|  - Dependencies: IntentAnalyzer.\n
   275|\n
   276|- **ContentTypeSelector**\n
   277|  - Responsibility: Choose appropriate content type (article, landing‑page, FAQ, product‑page, tutorial, etc.).\n
   278|  - Input: `brief` + `audience`.\n
   279|  - Output: `{ contentType: string, rationale: string }`.\n
   280|  - Quality‑Gate: Content type must align with campaign goals; verified by ContentGapDetector.\n
   281|  - System Prompt: \"You are ContentTypeSelector, a decision engine for content formats...\"\n
   282|  - Model: Claude Sonnet, `temp=0.2`, `max_tokens=256`, est. 0.4 s.\n
   283|  - Dependencies: AudienceProfiler.\n
   284|\n
   285|- **KeywordIntentMapper**\n
   286|  - Responsibility: Map search intent to keyword clusters.\n
   287|  - Input: `brief` + `niche`.\n
   288|  - Output: `{ keywords: string[], intentLabels: string[] }`.\n
   289|  - Quality‑Gate: ≥5 keywords, each with a valid intent label.\n
   290|  - System Prompt: \"You are KeywordIntentMapper, a search‑intent taxonomy expert...\"\n
   291|  - Model: GPT‑4o, `temp=0.1`, `max_tokens=512`, est. 0.9 s.\n
   292|  - Dependencies: NicheDetector.\n
   293|\n
   294|- **CompetitorAnalyzer**\n
   295|  - Responsibility: Analyse top competitor content for the target niche.\n
   296|  - Input: `keywords` + `brief`.\n
   297|  - Output: `{ competitorSummary: string, strengths: string[], gaps: string[] }`.\n
   301|  - Quality‑Gate: Must identify ≥3 content gaps.\n
   302|  - System Prompt: \"You are CompetitorAnalyzer, a competitive‑intelligence specialist...\"\n
   303|  - Model: Claude Opus, `temp=0.1`, `max_tokens=512`, est. 1.5 s.\n
   304|  - Dependencies: KeywordIntentMapper.\n
   305|\n
   306|- **ContentGapDetector**\n
   307|  - Responsibility: Detect missing topics that can be owned.\n
   308|  - Input: `competitorSummary`.\n
   310|  - Output: `{ gapList: string[] }`.\n
   311|  - Quality‑Gate: Gap items must be specific, measurable, and actionable.\n
   312|  - System Prompt: \"You are ContentGapDetector, a gap‑identification analyst...\"\n
   313|  - Model: GPT‑4o‑mini, `temp=0.2`, `max_tokens=256`, est. 0.8 s.\n
   314|  - Dependencies: CompetitorAnalyzer.\n
   315|\n
   316|- **BriefGenerator**\n
   317|  - Responsibility: Synthesize a full content brief.\n
   318|  - Input: `intent`, `audience`, `contentType`, `keywords`, `gapList`.\n
   319|  - Output: `brief` document (title options, outline, SEO goals, tone, word‑count target).\n
   320|  - Quality‑Gate: Brief ≤2 KB, includes all required sections, passes StructuralValidator.\n
   321|  - System Prompt: \"You are BriefGenerator, a concise brief‑writing engine...\"\n
   322|  - Model: Claude Sonnet, `temp=0.3`, `max_tokens=1024`, est. 1.2 s.\n
   323|  - Dependencies: ContentGapDetector.\n
   324|\n
   325|- **LanguageDetector**\n
   326|  - Responsibility: Identify target language and locale.\n
   327|  - Input: `brief` + `audience`.\n
   328|  - Output: `{ language: string, locale: string }` (e.g., `pt-BR`).\n
   329|  - Quality‑Gate: Language must match audience location; validated against LanguageProfiler.\n
   330|  - System Prompt: \"You are LanguageDetector, a locale‑identification helper...\"\n
   331|  - Model: GPT‑4o‑mini, `temp=0.1`, `max_tokens=128`, est. 0.2 s.\n
   332|  - Dependencies: AudienceProfiler.\n
   333|\n
   334|### Stage 2 – Research (10 agents)\n
   335|\n
   336|- **WebResearcher**\n
   337|  - Responsibility: Retrieve primary sources for the brief.\n
   338|  - Input: `keywords`.\n
   339|  - Output: `{ sources: [{url:string, snippet:string, relevance:number}], relevanceScore:number }`.\n
   340|  - Quality‑Gate: Sources from authoritative domains, `relevance > 0.8`.\n
   341|  - System Prompt: \"You are WebResearcher, a fact‑finding navigator...\"\n
   342|  - Model: GPT‑4o, `temp=0.1`, `max_tokens=512`, est. 2 s.\n
   343|  - Dependencies: KeywordIntentMapper.\n
   344|\n
   345|- **FactChecker**\n
   346|  - Responsibility: Verify factual claims from sources.\n
   347|  - Input: `sources`.\n
   348|  - Output: `{ verifiedClaims: string[] }`.\n
   349|  - Quality‑Gate: 100 % of claims corroborated by ≥2 independent sources.\n
   350|  - System Prompt: \"You are FactChecker, a rigorous verification specialist...\"\n
   351|  - Model: Claude Opus, `temp=0.1`, `max_tokens=256`, est. 1.5 s.\n
   352|  - Dependencies: WebResearcher.\n
   353|\n
   354|- **DataSourceValidator**\n
   355|  - Responsibility: Assess credibility and bias of each source.\n
   356|  - Input: `sources`.\n
   357|  - Output: `{ validatedSources: [{url:string, credibility:number, biasScore:number}], ...]`.\n
   358|  - Quality‑Gate: No source with `credibility < 0.6` may be used.\n
   359|  - System Prompt: \"You are DataSourceValidator, a source‑credibility auditor...\"\n
   360|  - Model: GPT‑4o‑mini, `temp=0.2`, `max_tokens=256`, est. 0.9 s.\n
   361|  - Dependencies: WebResearcher.\n
   361|\n
   362|- **TrendAnalyzer**\n
   363|  - Responsibility: Identify emerging trends related to keywords.\n
   364|  - Input: `keywords` + `validatedSources`.\n
   365|  - Output: `{ trends: [{topic:string, impact:string, confidence:number}] }`.\n
   366|  - Quality‑Gate: `confidence > 0.75` for each trend.\n
   367|  - System Prompt: \"You are TrendAnalyzer, a forward‑looking trend detector...\"\n
   368|  - Model: GPT‑4o, `temp=0.2`, `max_tokens=256`, est. 1 s.\n
   369|  - Dependencies: DataSourceValidator.\n
   370|\n
   371|- **CompetitorContentAnalyzer**\n
   372|  - Responsibility: Deep‑dive into competitor articles.\n
   373|  - Input: `competitorSummary`.\n
   374|  - Output: `{ comparativeMatrix: string, structureInsights: string[], ctaStrategies: string[] }`.\n
   375|  - Quality‑Gate: Must produce a comparative matrix with at least 3 dimensions.\n
   376|  - System Prompt: \"You are CompetitorContentAnalyzer, a structural‑analysis expert...\"\n
   377|  - Model: Claude Opus, `temp=0.1`, `max_tokens=512`, est. 1.3 s.\n
   378|  - Dependencies: CompetitorAnalyzer.\n
   379|\n
   380|- **StatisticFinder**\n
   381|  - Responsibility: Extract statistics relevant to the topic.\n
   382|  - Input: `validatedSources`.\n
   383|  - Output: `{ statistics: [{value:string, unit:string, source:string, recency:string}] }`.\n
   384|  - Quality‑Gate: Statistics must be recent (<2 years) and from reputable bodies.\n
   385|  - System Prompt: \"You are StatisticFinder, a data‑extraction specialist...\"\n
   386|  - Model: GPT‑4o‑mini, `temp=0.1`, `max_tokens=256`, est. 0.8 s.\n
   387|  - Dependencies: DataSourceValidator.\n
   388|\n
   389|- **CaseStudyCollector**\n
   390|  - Responsibility: Gather relevant case studies.\n
   391|  - Input: `keywords` + `statistics`.\n
   392|  - Output: `{ caseStudies: [{title:string, summary:string, source:string, relevance:number}], ...]`.\n
   393|  - Quality‑Gate: At least 2 high‑quality case studies per topic.\n
   394|  - System Prompt: \"You are CaseStudyCollector, a case‑study aggregation engine...\"\n
   395|  - Model: GPT‑4o‑mini, `temp=0.2`, `max_tokens=256`, est. 1 s.\n
   396|  - Dependencies: StatisticFinder.\n
   397|\n
   398|- **ReferenceOrganizer**\n
   399|  - Responsibility: Structure collected sources and case studies.\n
   400|  - Input: `verifiedClaims` + `caseStudies`.\n
   401|  - Output: `{ referenceSet: [{theme:string, items:string[]}], ...]`.\n
   402|  - Quality‑Gate: All items must be tagged with source URL.\n
   403|  - System Prompt: \"You are ReferenceOrganizer, a taxonomy‑builder for references...\"\n
   404|  - Model: Claude Haiku, `temp=0.2`, `max_tokens=256`, est. 0.6 s.\n
   405|  - Dependencies: CaseStudyCollector.\n
   406|\n
   407|- **SourceCiter**\n
   408|  - Responsibility: Generate proper citations for all source material.\n
   409|  - Input: `referenceSet`.\n
   410|  - Output: `{ citations: [{format:string, text:string}] }`.\n
   411|  - Quality‑Gate: 100 % of references must have a citation.\n
   412|  - System Prompt: \"You are SourceCiter, a citation‑generation specialist...\"\n
   413|  - Model: GPT‑4o‑mini, `temp=0.1`, `max_tokens=256`, est. 0.4 s.\n
   414|  - Dependencies: ReferenceOrganizer.\n
   415|\n
   416|- **AuthorityScoreCalculator**\n
   417|  - Responsibility: Compute authority scores for each source.\n
   418|  - Input: `validatedSources`.\n
   419|  - Output: `{ authorityScores: [{url:string, score:number}] }`.\n
   420|  - Quality‑Gate: Sources with `score < 0.5` are flagged for review.\n
   421|  - System Prompt: \"You are AuthorityScoreCalculator, an authority‑ranking engine...\"\n
   422|  - Model: Claude Sonnet, `temp=0.1`, `max_tokens=256`, est. 0.5 s.\n
   423|  - Dependencies: DataSourceValidator.\n
   424|\n
   425|... (remaining agents in Stage 2 follow the same detailed pattern)\n
   426|\n
   427|### Stage 3 – Content Creation (16 agents)\n
   428|\n
   429|- **HeadlineWriter**\n
   430|  - Responsibility: Generate headline options.\n
   431|  - Input: `brief.title` + `audience`.\n
   432|  - Output: `[{ headline:string, length:number, powerWord:string }]`\n
   433|  - Quality‑Gate: ≤70 chars, includes a power word, reflects tone.\n
   434|  - System Prompt: \"You are HeadlineWriter, a headline‑crafting expert...\"\n
   435|  - Model: Claude Sonnet, `temp=0.8`, `max_tokens=256`, est. 0.5 s.\n
   436|  - Dependencies: BriefGenerator.\n
   437|\n
   438|- **HookWriter**\n
   439|  - Responsibility: Craft opening hooks.\n
   440|  - Input: `headline`, `tone`.\n
   441|  - Output: `{ hook:string, type:string }` (type: anecdote, question, statistic)\n
   442|  - Quality‑Gate: Hook must align with tone and spark curiosity.\n
   443|  - System Prompt: \"You are HookWriter, a hook‑crafting specialist...\"\n
   444|  - Model: Claude Haiku, `temp=0.7`, `max_tokens=256`, est. 0.4 s.\n
   445|  - Dependencies: HeadlineWriter.\n
   446|\n
   447|- **IntroSpecialist**\n
   448|  - Responsibility: Write the introductory paragraph.\n
   449|  - Input: `hook`, `briefOutline`.\n
   450|  - Output: `{ intro:string, roadmap:string[] }`.\n
   451|  - Quality‑Gate: Intro sets scope, includes thesis, matches tone.\n
   452|  - System Prompt: \"You are IntroSpecialist, a paragraph‑structuring expert...\"\n
   453|  - Model: Claude Sonnet, `temp=0.7`, `max_tokens=512`, est. 0.8 s.\n
   454|  - Dependencies: HookWriter.\n
   455|\n
   456|- **BodyWriter**\n
   457|  - Responsibility: Produce the main content body.\n
   458|  - Input: `intro`, `briefOutline`, `researchNotes`.\n
   459|  - Output: `{ sections: [string], wordCount:number }`.\n
   460|  - Quality‑Gate: Section outline follows H1‑H6 hierarchy, meets word‑count target.\n
   461|  - System Prompt: \"You are BodyWriter, a full‑section composer...\"\n
   462|  - Model: Claude Sonnet, `temp=0.9`, `max_tokens=2048`, est. 2 s.\n
   463|  - Dependencies: IntroSpecialist.\n
   464|\n
   465|- **Storyteller**\n
   466|  - Responsibility: Weave narrative elements where appropriate.\n
   467|  - Input: `bodySections`, `tone`.\n
   468|  - Output: `{ narrativeEnhancements:string[] }`.\n
   469|  - Quality‑Gate: Narrative must improve engagement score by ≥5 %.\n
   470|  - System Prompt: \"You are Storyteller, a narrative‑integration specialist...\"\n
   471|  - Model: Claude Haiku, `temp=0.85`, `max_tokens=512`, est. 0.9 s.\n
   472|  - Dependencies: BodyWriter.\n
   473|\n
   474|- **TechnicalWriter**\n
   475|  - Responsibility: Produce technical explanations.\n
   476|  - Input: `bodySections` (technical topics), `audienceProfiler`.\n
   477|  - Output: `{ technicalContent:string, glossary:string[] }`.\n
   478|  - Quality‑Gate: Accuracy verified by TechnicalValidator (part of Stage 7).\n
   479|  - System Prompt: \"You are TechnicalWriter, a domain‑specific explainer...\"\n
   479|  - Model: Claude Opus, `temp=0.3`, `max_tokens=512`, est. 1 s.\n
   480|  - Dependencies: BodyWriter.\n
   481|\n
   482|- **Copywriter**\n
   483|  - Responsibility: Craft persuasive copy for CTAs, product descriptions.\n
   484|  - Input: `bodySections`, `tone`, `audience`.\n
   485|  - Output: `{ copyVariants: [{text:string, purpose:string}] }`.\n
   486|  - Quality‑Gate: Copy conveys unique value proposition, includes power words.\n
   487|  - System Prompt: \"You are Copywriter, a conversion‑focused wordsmith...\"\n
   488|  - Model: GPT‑4o, `temp=0.85`, `max_tokens=256`, est. 0.7 s.\n
   489|  - Dependencies: BodyWriter.\n
   490|\n
   491|... (remaining Stage 3 agents: UXWriter, MicrocopySpecialist, ExampleGenerator, AnalogyCreator, FAQGenerator, CTAOptimizer, ConclusionWriter, Transcreator, LocalizationAdapter) \n
   500|\n
   501|### Stage 4 – Editing & Refinement (10 agents)\n
   502|\n
   503|- **GrammarChecker**\n
   503|  - Responsibility: Detect and correct grammatical errors.\n
   504|  - Input: `draft` (full text).\n
   505|  - Output: `{ corrections: [{location:string, original:string, corrected:string}] }`.\n
   506|  - Quality‑Gate: 100 % of high‑severity errors must be resolved; no new errors introduced.\n
   506|  - System Prompt: \"You are GrammarChecker, a precise grammar‑correction engine...\"\n
   507|  - Model: Claude Haiku, `temp=0.1`, `max_tokens=256`, est. 0.4 s.\n
   508|  - Dependencies: ConclusionWriter (or final body output).\n
   509|\n
   510|... (other Stage 4 agents: StyleEditor, ToneConsistencyChecker, ReadabilityOptimizer, FlowsAndTransitionsEditor, RedundancyRemover, Simplifier, VoiceEnhancer, SentenceStructureOptimizer, ParagraphBalancer) \n
   520|\n
   521|### Stage 5 – SEO & Discoverability (10 agents)\n
   522|\n
   523|- **MetaTitleOptimizer**\n
   524|  - Responsibility: Craft SEO‑optimized title tags.\n
   525|  - Input: `brief.title`, `keywords`.\n
   526|  - Output: `{ title:string, length:number, keywordUsed:string }`.\n
   527|  - Quality‑Gate: 60‑70 chars, includes primary keyword, matches intent.\n
   528|  - System Prompt: \"You are MetaTitleOptimizer, a title‑crafting specialist...\"\n
   529|  - Model: GPT‑4o‑mini, `temp=0.4`, `max_tokens=128`, est. 0.3 s.\n
   530|  - Dependencies: BriefGenerator.\n
   531|\n
   532|- **MetaDescriptionWriter**\n
   533|  - Responsibility: Write meta description snippets.\n
   534|  - Input: `brief.description`, `keywords`.\n
   535|  - Output: `{ description:string, length:number, keywordUsed:string }`.\n
   536|  - Quality‑Gate: 150‑160 chars, compelling call‑to‑action, keyword presence.\n
   537|  - System Prompt: \"You are MetaDescriptionWriter, a description‑crafting expert...\"\n
   538|  - Model: GPT‑4o‑mini, `temp=0.4`, `max_tokens=150`, est. 0.3 s.\n
   539|  - Dependencies: BriefGenerator.\n
   540|\n
   541|... (remaining Stage 5 agents: KeywordDensityAnalyzer, SemanticKeywordInjector, SchemaGenerator, InternalLinkPlanner, URLSlugOptimizer, ImageSEOOptimizer, SERPSnippetPreview, E‑E‑ATScorer) \n
   542|\n
   543|### Stage 6 – Visual & Media (8 agents)\n
   544|\n
   545|- **HeroImagePromptGenerator**\n
   546|  - Responsibility: Generate AI‑image prompts for hero graphics.\n
   547|  - Input: `brief.topic`, `tone`, `targetAudience`.\n
   548|  - Output: `{ prompt:string, aspectRatio:string, qualityTag:string }`.\n
   549|  - Quality‑Gate: Prompt must include subject, action, style, lighting, color, `--ar` and `--q` tags.\n
   550|  - System Prompt: \"You are HeroImagePromptGenerator, a prompt‑engineering expert for editorial images...\"\n
   551|  - Model: Qwen‑image‑2.0‑pro (via complement), `temp=0.85`, `max_tokens=256`, est. 0.6 s.\n
   552|  - Dependencies: BriefGenerator.\n
   553|\n
   554|... (remaining Stage 6 agents: InlineImageSelector, ImageAltTextWriter, InfographicDesigner, DiagramGenerator, IconSelector, VideoScriptWriter, ThumbnailDesigner) \n
   555|\n
   556|### Stage 7 – Validation & Quality (10 agents)\n
   557|\n
   558|- **ContentConsistencyChecker**\n
   559|  - Responsibility: Verify internal consistency of facts, tone, and narrative.\n
   560|  - Input: `draft` + `researchNotes`.\n
   561|  - Output: `{ issues: [{type:string, severity:string, detail:string}] }`.\n
   562|  - Quality‑Gate: No critical inconsistencies; any `critical` issue must be resolved (correction cycle).\n
   563|  - System Prompt: \"You are ContentConsistencyChecker, a coherence‑analysis specialist...\"\n
   564|  - Model: Claude Opus, `temp=0.2`, `max_tokens=512`, est. 0.9 s.\n
   565|  - Dependencies: FactChecker, GrammarChecker.\n
   566|\n
   567|... (remaining Stage 7 agents: FactRevalidator, BiasDetector, PlagiarismChecker, AccessibilityAuditor, LinkValidator, FormattingValidator, BrandComplianceChecker, LegalComplianceChecker, QualityScoreCalculator)\n
   570|\n
   571|### Stage 8 – Publishing & Distribution (8 agents)\n
   572|\n
   573|- **AstroMDXFormatter**\n
   574|  - Responsibility: Convert final markdown/HTML to AstroMDX format.\n
   575|  - Input: `draft`, `mediaPlan`, `seoData`.\n
   576|  - Output: `{ mdxContent:string, frontMatter:JSON }`.\n
   577|  - Quality‑Gate: Front‑matter must contain `title`, `description`, `keywords`, `pub_date`, `author`, `image`.\n
   578|  - System Prompt: \"You are AstroMDXFormatter, an MDX‑generation engine for Astro...\"\n
   579|  - Model: Claude Haiku, `temp=0.1`, `max_tokens=512`, est. 0.5 s.\n
   580|  - Dependencies: QualityScoreCalculator.\n
   581|\n
   582|... (remaining Stage 8 agents: WordPressFormatter, SocialMediaAdaptator, EmailNewsletterConverter, RSSFeedUpdater, SitemapUpdater, CDNInvalidator, AnalyticsTagger)\n
   583|\n
   584|### Stage 9 – Feedback & Learning (8 agents)\n
   585|\n
   586|- **PerformanceAnalyzer**\n
   587|  - Responsibility: Evaluate post‑publish metrics.\n
   588|  - Input: `analyticsData` (traffic, engagement), `qualityScore`.\n
   589|  - Output: `{ performanceInsights:[{metric:string,value:number,trend:string}] }`.\n
   590|  - Quality‑Gate: Identify at least one actionable insight; flag if engagement < baseline.\n
   591|  - System Prompt: \"You are PerformanceAnalyzer, a metric‑interpretation engine...\"\n
   592|  - Model: Claude Sonnet, `temp=0.35`, `max_tokens=256`, est. 0.7 s.\n
   593|  - Dependencies: AnalyticsTagger.\n
   594|\n
   595|... (remaining Stage 9 agents: UserEngagementPredictor, ContentLifecycleManager, KnowledgeBaseUpdater, PatternRecognizer, PromptOptimizer, AgentTuner, ABLTestDesigner)\n
   596|\n
   600|## 5. Quality Gate System\n
   601|\n
   602|The pipeline enforces a **gate after every stage**. Gates are deterministic functions that raise a `GateFailure` exception if criteria are not met. The orchestrator catches the exception and either triggers correction or escalates to human review.\n
   603|\n
   604|- **Gate 1 – Triage Validation**: All Stage 1 agents must meet their individual confidence and completeness thresholds. If any fail, the pipeline rolls back to the previous stage for up to 3 correction cycles.\n
   605|- **Gate 2 – Research Validation**: Outputs from Stage 2 must satisfy source authority, relevance, and completeness criteria. Failure escalates to Stage 1 for re‑research.\n
   606|- **Gate 3 – Content Creation Validation**: Drafts from Stage 3 must pass structural validation (correct outline, required sections) and a language‑quality check (no profanity, coherent flow). Failed drafts trigger up to 3 self‑correction cycles.\n
   607|- **Gate 4 – Editing Validation**: Editors (Stage 4) must satisfy readability, bias, and redundancy criteria; outputs must improve the QualityScore by ≥5 % over the previous draft.\n
   608|- **Gate 5 – SEO Validation**: SEO agents must produce metadata and schema that meet length, keyword‑density, and markup standards; SERP‑preview must render without errors.\n
   609|- **Gate 6 – Visual Validation**: Image‑related agents must output images that pass alt‑text generation, aspect‑ratio compliance, and file‑size limits; infographics must be vector‑compatible.\n
   610|- **Gate 7 – Final Quality Validation**: All validation agents (Stage 7) must agree on a final **QualityScore ≥ 0.9**; any dissent triggers an additional review cycle.\n
   611|- **Gate 8 – Publishing Validation**: Formatting agents must generate syntactically correct AstroMDX, WordPress, or other target formats; links must be relative and functional.\n
   612|- **Gate 9 – Feedback Validation**: Performance metrics must be recorded; if engagement predictors fall below baseline, the content is flagged for iterative improvement.\n
   613|\n
   614|Each gate is implemented as a **deterministic function** that raises a `GateFailure` exception if criteria are not met. The orchestrator catches the exception and either triggers correction or escalates to human review.\n
   615|\n
   616|## 6. Prompt Templates Library\n
   617|\n
   618|A reusable prompt library ensures consistency and reduces token usage.\n
   619|\n
   620|- **IntentClassifier Prompt**  \n
   621|  ```\n
   622|  You are IntentClassifier, a precise intent‑detection system.\n
   623|  Given a brief description of a marketing goal, classify the user intent into one of:\n
   624|  - brand_awareness, lead_generation, sales, education, community_building.\n
   625|  Output JSON: { \"intent\": \"...\", \"confidence\": number }\n
   626|  Confidence must be >0.9; otherwise request clarification.\n
   627|  ```\n
   628|- **HeadlineWriter Prompt**  \n
   629|  ```\n
   630|  Write 5 headline options for a piece with title \"{title}\" and audience \"{audience}\".\n
   631|  Each headline must be ≤70 characters, include a power word, and reflect the tone \"{tone}\".\n
   632|  Return a JSON array.\n
   633|  ```\n
   634|- **MetaTitleOptimizer Prompt**  \n
   635|  ```\n
   636|  Craft an SEO‑optimized title tag for the given topic, target keyword, and audience.\n
   637|  Title must be 60‑70 characters, include the primary keyword, and match search intent.\n
   638|  Return plain text.\n
   639|  ```\n
   640|- *(Similar prompt snippets for each agent are stored in `prompts/` directory.)*\n
   641|\n
   642|## 7. Image Generation Strategy\n
   643|\n
   644|- **Model**: Use Qwen‑image‑2.0‑pro for editorial images; fallback to Stable‑Diffusion‑XL.\n
   645|- **Prompt Engineering**: Follow the “subject‑action‑style‑lighting‑color” template; include aspect‑ratio (`--ar 16:9`) and quality (`--q 2`). Example:\n\n   ```\n   A modern SaaS dashboard with diverse team collaborating, flat design, vibrant lighting, pastel palette --ar 16:9 --q 2\n   ```\n\n- **Placement**: Hero images are mandatory for landing pages; inline images are used in tutorials; decorative images are used in blog posts.\n- **Optimization**: Output images are automatically passed through an optimizer that serves WebP at 80 % quality; CDN caches the result.\n- **Alt‑Text Generation**: ImageAltTextWriter generates context‑aware alt‑text using a separate LLM call; alt‑text must include primary keyword when relevant.\n- **Style Guide**: All images follow the brand’s visual‑identity guide (primary colors, iconography, logo placement rules).\n\n## 8. Content Formatting Standards\n
   646|\n
   647|- **MDX Frontmatter**: Use `title`, `description`, `keywords`, `pub_date`, `author`, `image` fields.\n
   648|- **Schema.org**: Apply `Article` type with `headline`, `image`, `author`, `publisher`, `datePublished`.\n
   649|- **Heading Hierarchy**: H1 → H2 → H3 … no skipping levels.\n
   650|- **Internal Linking**: Each article must contain at least 3 internal links to related clusters; links stored in `internal_links` array.\n
   651|- **Readability**: Target Flesch‑Kincaid Grade ≤8; use Hemingway editor API to enforce.\n
   651|- **Content Length**: Articles 1,200‑1,800 words; landing pages 800‑1,200 words; FAQs 300‑600 words.\n
   652|\n
   653|## 9. Dashboard UX Design\n
   654|\n
   655|- **Real‑time Stage View**: Kanban‑style board showing each stage’s agents, status (Pending, Running, Completed, Gate‑Failed), and quality score.\n
   656|- **Timeline Graph**: Visual pipeline flow with timestamps for each gate; hover to see correction cycles.\n
   657|- **Quality Score**: Aggregate score (0‑100) displayed per article; breakdown by stage.\n
   658|- **Error Overview**: List of failed gates, reasons, and current correction cycle count.\n
   659|- **Performance Metrics**: Avg latency per stage, token cost, model utilization.\n
   659|- **Export**: One‑click export to PDF or CSV for audit.\n
   660|\n
   661|## 10. Implementation Roadmap\n
   662|\n
   663||| Phase | Duration | Milestones |\n
   664|------|----------|------------|\n
   665| **0 – Foundations** | 2 weeks | Set up orchestration repo, CI/CD, skill‑store, base `PipelineContext` schema |\n
   666| **1 – Agent Scaffold** | 4 weeks | Implement agent registry, base templates, quality‑gate framework, logging |\n
   667| **2 – Core Agent Set** | 8 weeks | Deploy Stages 1‑3 (Triage, Research, Content Creation) with 20 agents |\n
   668| **3 – Full Catalog** | 6 weeks | Add remaining agents (Stages 4‑9), integrate visual & feedback loops |\n
   669| **4 – Optimization** | 3 weeks | Tune model routing, reduce latency, cut cost 30 % |\n
   670| **5 – Monitoring & Scaling** | 2 weeks | Deploy Prometheus/Grafana dashboards, auto‑scaling policies |\n
   671| **6 – Pilot Launch** | 1 week | Run pilot on a low‑traffic uniteia.com sub‑domain |\n
   672| **7 – Global Rollout** | ongoing | Scale to all uniteia.com properties, add A/B testing, continuously refine agents |\n
   673|\n
   674|--- \n
   675|*All prompts, schemas, and configuration files are stored in the `orquidia-uniteia/skills/` repository and version‑controlled via Git.* \n
   676|", "path": "/root/orquidia-uniteia/docs/agents-catalog-and-pipeline.md"}