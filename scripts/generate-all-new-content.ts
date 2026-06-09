import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT_ROOT = 'content'
const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

// Define niches index info
const NICHES_INDEX_DATA: Record<
  string,
  {
    subject: string
    titles: Record<string, string>
    subtitles: Record<string, string>
    bodies: Record<string, string>
  }
> = {
  'ai-agents': {
    subject: 'ai-agents',
    titles: {
      en: 'AI Agents',
      pt: 'Agentes de IA',
      es: 'Agentes de IA',
      fr: "Agents d'IA",
      de: 'KI-Agenten',
      it: 'Agenti AI',
      ja: 'AIエージェント',
      zh: 'AI 代理',
    },
    subtitles: {
      en: 'Autonomous AI systems that perceive, reason, and act to achieve goals',
      pt: 'Sistemas de IA autônomos que percebem, raciocinam e agem para atingir objetivos',
      es: 'Sistemas de IA autónomos que perciben, razonan y actúan para lograr objetivos',
      fr: "Systèmes d'IA autonomes qui perçoivent, raisonnent et agissent pour atteindre des objectifs",
      de: 'Autonome KI-Systeme, die wahrnehmen, schlussfolgern und handeln, um Ziele zu erreichen',
      it: 'Sistemi AI autonomi che percepiscono, ragionano e agiscono per raggiungere obiettivi',
      ja: '目標を達成するために知覚、推論、行動する自律型AIシステム',
      zh: '能够感知、推理和行动以实现目标的自主AI系统',
    },
    bodies: {
      en: 'Welcome to the AI Agents hub. We explore autonomous agent frameworks, tools, and the latest research in setting up goal-oriented AI systems.',
      pt: 'Bem-vindo ao hub de Agentes de IA. Exploramos frameworks de agentes autônomos, ferramentas e as pesquisas mais recentes em sistemas de IA orientados a objetivos.',
      es: 'Bienvenido al centro de Agentes de IA. Exploramos frameworks de agentes autónomos, herramientas y las investigaciones más recientes en sistemas de IA orientados a objetivos.',
      fr: "Bienvenue dans le hub des agents d'IA. Nous explorons les frameworks d'agents autonomes, les outils et les dernières recherches sur la mise en place de systèmes d'IA orientés vers des objectifs.",
      de: 'Willkommen im KI-Agenten-Hub. Wir erforschen autonome Agenten-Frameworks, Tools und die neuesten Erkenntnisse bei der Einrichtung zielorientierter KI-Systeme.',
      it: 'Benvenuto nel hub degli Agenti AI. Esploriamo framework di agenti autonomi, strumenti e le ultime ricerche nella configurazione di sistemi AI orientati agli obiettivi.',
      ja: 'AIエージェントハブへようこそ。目標達成型AIシステムの構築における自律型エージェントフレームワーク、ツール、最新の研究を探求します。本ハブでは、効率的で安定したシステム構築を支援するため、さまざまなツールの使用方法、ベストプラクティス、パフォーマンス最適化について深く掘り下げます。',
      zh: '欢迎来到 AI 代理中心。我们探索自主代理框架、工具以及在建立目标导向的 AI 系统方面的最新研究。我们将深入探讨不同工具的使用方法、最佳实践、性能优化，帮助您构建高效、稳定的系统。',
    },
  },
  'llm-comparison': {
    subject: 'llm-comparison',
    titles: {
      en: 'LLM Comparison',
      pt: 'Comparação de LLMs',
      es: 'Comparación de LLMs',
      fr: 'Comparaison des LLMs',
      de: 'LLM-Vergleich',
      it: 'Confronto LLM',
      ja: 'LLM比較',
      zh: 'LLM 比较',
    },
    subtitles: {
      en: 'Side-by-side benchmarks, capabilities, and pricing for frontier LLMs',
      pt: 'Benchmarks, capacidades e preços lado a lado para LLMs de fronteira',
      es: 'Benchmarks, capacidades y precios lado a lado para LLMs de frontera',
      fr: 'Benchmarks, capacités et prix côte à côte pour les LLMs de pointe',
      de: 'Benchmarks, Fähigkeiten und Preise nebeneinander für Frontier-LLMs',
      it: "Benchmark, capacità e prezzi fianco a fianco per LLM all'avanguardia",
      ja: '最前線LLMのベンチマーク、機能、価格を並べて比較',
      zh: '面向前沿大语言模型的并排基准测试、功能 and 定价',
    },
    bodies: {
      en: "Welcome to the LLM Comparison hub. Analyze the strengths, weaknesses, costs, and architectures of the world's leading language models.",
      pt: 'Bem-vindo ao hub de Comparação de LLMs. Analise os pontos fortes, fracos, custos e arquiteturas dos principais modelos de linguagem do mundo.',
      es: 'Bienvenido al centro de Comparación de LLMs. Analice las fortalezas, debilidades, costos y arquitecturas del mundo.',
      fr: 'Bienvenue dans le hub de comparaison des LLMs. Analysez les forces, les faiblesses, les coûts et les architectures des principaux modèles de langage au monde.',
      de: 'Willkommen im LLM-Vergleichs-Hub. Analysieren Sie die Stärken, Schwächen, Kosten und Architekturen der weltweit führenden Sprachmodelle.',
      it: 'Benvenuto nel hub del Confronto LLM. Analizza punti di forza, debolezze, costi e architetture dei principali modelli linguistici del mondo.',
      ja: 'LLM比較ハブへようこそ。世界をリードする言語モデルの長所、短所、コスト、アーキテクチャを分析します。本ハブでは、効率的で安定したシステム構築を支援するため、さまざまなツールの使用方法、ベストプラクティス、パフォーマンス最適化について深く掘り下げます。',
      zh: '欢迎来到大语言模型比较中心。分析世界领先语言模型的优缺点、成本和架构。我们将深入探讨不同工具的使用方法、最佳实践、性能优化，帮助您构建高效、稳定的系统。',
    },
  },
  'cloud-computing': {
    subject: 'cloud-computing',
    titles: {
      en: 'Cloud Computing',
      pt: 'Computação em Nuvem',
      es: 'Computación en la Nube',
      fr: 'Informatique en Nuage',
      de: 'Cloud Computing',
      it: 'Cloud Computing',
      ja: 'クラウドコンピューティング',
      zh: '云计算',
    },
    subtitles: {
      en: 'Modern cloud platforms, edge networks, and serverless architectures',
      pt: 'Plataformas de nuvem modernas, redes de borda e arquiteturas serverless',
      es: 'Plataformas de nube modernas, redes edge y arquitecturas serverless',
      fr: 'Plateformes de nuage modernes, réseaux edge et architectures serverless',
      de: 'Moderne Cloud-Plattformen, Edge-Netzwerke und serverlose Architekturen',
      it: 'Piattaforme cloud moderne, reti edge e architetture serverless',
      ja: '最新のクラウドプラットフォーム、エッジネットワーク、サーバーレスアーキテクチャ',
      zh: '现代云平台、边缘网络和无服务器架构',
    },
    bodies: {
      en: 'Welcome to the Cloud Computing hub. Learn how to host applications, configure serverless edge workflows, and secure production environments.',
      pt: 'Bem-vindo ao hub de Computação em Nuvem. Aprenda a hospedar aplicações, configurar fluxos serverless de borda e proteger ambientes de produção.',
      es: 'Bienvenido al centro de Computación en la Nube. Aprenda a hospedar aplicaciones, configurar flujos serverless de borde y proteger entornos de producción.',
      fr: "Bienvenue dans le hub de l'informatique en nuage. Apprenez à héberger des applications, à configurer des flux de travail serverless edge et à sécuriser les environnements de production.",
      de: 'Willkommen im Cloud-Computing-Hub. Erfahren Sie, wie Sie Anwendungen hosten, serverlose Edge-Workflows konfigurieren und Produktionsumgebungen sichern.',
      it: 'Benvenuto nel hub del Cloud Computing. Impara come ospitare applicazioni, configurare flussi serverless edge e proteggere gli ambienti di produzione.',
      ja: 'クラウドコンピューティングハブへようこそ。アプリケーションのホスティング、サーバーレスエッジワークフローの設定、本番環境のセキュリティ保護について学びます。本ハブでは、効率的で安定したシステム構築を支援するため、さまざまなツールの使用方法について深く掘り下げます。',
      zh: '欢迎来到云计算中心。了解如何托管应用程序、配置无服务器边缘工作流以及保护生产环境的安全。我们将深入探讨不同工具的使用方法、最佳实践、性能优化，帮助您构建高效、稳定的系统。',
    },
  },
  'virtual-machines': {
    subject: 'virtual-machines',
    titles: {
      en: 'Virtual Machines',
      pt: 'Máquinas Virtuais',
      es: 'Máquinas Virtuales',
      fr: 'Machines Virtuelles',
      de: 'Virtuelle Maschinen',
      it: 'Macchine Virtuali',
      ja: '仮想マシン',
      zh: '虚拟机',
    },
    subtitles: {
      en: 'VM orchestration, containerization, and infrastructure as code',
      pt: 'Orquestração de VMs, conteinerização e infraestrutura como código',
      es: 'Orquestación de VMs, contenerización e infraestructura como código',
      fr: 'Orchestration de machines virtuelles, conteneurisation et infrastructure en tant que code',
      de: 'VM-Orchestrierung, Containerisierung und Infrastructure as Code',
      it: 'Orchestrazione VM, containerizzazione e infrastructure as code',
      ja: 'VMオーケストレーション、コンテナ化、Infrastructure as Code',
      zh: '虚拟机编排、容器化和基础设施即代码',
    },
    bodies: {
      en: 'Welcome to the Virtual Machines hub. Deep dive into hypervisors, container orchestration, VM tuning, and infrastructure automation.',
      pt: 'Bem-vindo ao hub de Máquinas Virtuais. Aprofunde-se em hipervisores, orquestração de contêineres, ajuste de VMs e automação de infraestrutura.',
      es: 'Bienvenido al centro de Máquinas Virtuales. Profundice en hipervisores, orquestación de contenedores, ajuste de VMs y automatización de infraestructura.',
      fr: "Bienvenue dans le hub des machines virtuelles. Plongez dans les hyperviseurs, l'orchestration de conteneurs, le réglage des machines virtuelles et l'automatisation des infrastructures.",
      de: 'Willkommen im virtuelle Maschinen-Hub. Tauchen Sie ein in Hypervisoren, Container-Orchestrierung, VM-Tuning und Infrastruktur-Automatisierung.',
      it: "Benvenuto nel hub delle Macchine Virtuali. Approfondisci hypervisor, orchestrazione dei container, ottimizzazione delle VM e automazione dell'infrastruttura.",
      ja: '仮想マシンハブへようこそ。ハイパーバイザー、コンテナオーケストレーション、VMチューニング、インフラの自動化について深く掘り下げます。本ハブでは、効率的で安定したシステム構築を支援するため、さまざまなツールの使用方法について深く掘り下げます。',
      zh: '欢迎来到虚拟机中心。深入了解虚拟机监视器、容器编排、虚拟机调优和基础设施自动化。我们将深入探讨不同工具的使用方法、最佳实践、性能优化，帮助您构建高效、稳定的系统。',
    },
  },
}

// Define articles content data
interface ArticleData {
  slug: string
  titles: Record<string, string>
  subjects: string[]
  markdowns: Record<string, string>
}

const ARTICLES: ArticleData[] = [
  {
    slug: 'what-are-ai-agents',
    subjects: ['ai-agents', 'beginners', 'editorial'],
    titles: {
      en: 'What are AI Agents and Why You Should Care',
      pt: 'O que são Agentes de IA e por que você deve se importar',
      es: 'Qué son los Agentes de IA y por que deberian importarte',
      fr: "Que sont les Agents d'IA et pourquoi devriez-vous vous en soucier",
      de: 'Was sind KI-Agenten und warum Sie sich dafür interessieren sollten',
      it: 'Cosa sono gli Agenti AI e perché dovresti occupartene',
      ja: 'AIエージェントとは何か、そしてなぜ注目すべきなのか',
      zh: '什么是 AI 代理以及为什么您应该关注',
    },
    markdowns: {
      en: `
AI agents represent a paradigm shift in how we interact with technology. Unlike simple chatbots that respond to prompts with text, AI agents are designed to observe, plan, make decisions, and act autonomously to achieve complex goals. 

## The Core Components of an Agent

An autonomous AI agent typically consists of four core elements working in harmony:

1. **The Brain (LLM):** The core reasoning engine. It processes context, makes decisions, and determines steps.
2. **Planning:** The ability to break down a large goal into smaller, manageable sub-tasks.
3. **Memory:** Storing short-term execution logs and long-term knowledge to adapt over time.
4. **Tools:** Interfacing with the external world (e.g., executing code, searching the web, calling APIs).

## Why Agents Matter in 2026

In 2026, AI agents have moved from experimental terminal scripts to production-grade systems. They are automating developer pipelines, handling client interactions, and even controlling physical robots in warehouses. 

For builders and creators, agents are the ultimate force multipliers. Instead of manually writing boilerplate, copying files, or running tests, you instruct an agent to build a feature, and it executes the entire loop. Understanding how to collaborate with these systems is no longer a niche skill — it is the new standard of productivity.
`,
      pt: `
Os agentes de IA representam uma mudança de paradigma na forma como interagimos com a tecnologia. Ao contrário de chatbots simples que apenas respondem a prompts com texto, os agentes de IA são projetados para observar, planejar, tomar decisões e agir de forma autônoma para atingir objetivos complexos.

## Os Componentes Centrais de um Agente

Um agente de IA autônomo geralmente consiste em quatro elementos principais trabalhando em harmonia:

1. **O Cérebro (LLM):** O motor de raciocínio principal. Ele processa o contexto, toma decisões e determina as etapas.
2. **Planejamento:** A habilidade de decompor um objetivo maior em subtarefas menores e gerenciáveis.
3. **Memória:** Armazenamento de logs de execução de curto prazo e conhecimento de longo prazo para se adaptar ao longo do tempo.
4. **Ferramentas:** Interface com o mundo externo (ex: executar código, pesquisar na web, chamar APIs).

## Por que os Agentes Importam em 2026

Em 2026, os agentes de IA saíram de scripts de terminal experimentais para sistemas de nível de produção. Eles estão automatizando pipelines de desenvolvimento, gerenciando interações com clientes e até controlando robôs físicos em centros de distribuição.

Para construtores e criadores, os agentes são os maiores multiplicadores de força. Em vez de escrever código repetitivo manualmente, copiar arquivos ou executar testes, você instrui um agente a construir uma funcionalidade e ele executa todo o ciclo. Entender como colaborar com esses sistemas não é mais uma habilidade de nicho — é o novo padrão de produtividade.
`,
      es: `
Los agentes de IA representan un cambio de paradigma en cómo interactuamos con la tecnología. A diferencia de los chatbots simples que responden a instrucciones con texto, los agentes de IA están diseñados para observar, planificar, tomar decisiones y actuar de forma autónoma para lograr objetivos complejos.

## Componentes Clave de un Agente

Un agente de IA autónomo generalmente consta de cuatro elementos principales que trabajan en armonía:

1. **El Cerebro (LLM):** El motor de razonamiento central. Procesa el contexto, toma decisiones y determina los pasos.
2. **Planificación:** La capacidad de dividir un objetivo grande en subtareas más pequeñas y manejables.
3. **Memoria:** Almacenamiento de registros de ejecución a corto plazo y conocimiento a largo plazo para adaptarse con el tiempo.
4. **Herramientas:** Interfaz con el mundo exterior (por ejemplo, ejecutar código, buscar en la web, llamar a APIs).

## Por qué son importantes los Agentes en 2026

En 2026, los agentes de IA han pasado de scripts de terminal experimentales a sistemas listos para producción. Automatizan flujos de trabajo de desarrollo, gestionan interacciones con clientes e incluso controlan robots físicos en almacenes.

Para los creadores, los agentes son multiplicadores de fuerza. En lugar de escribir código repetitivo manualmente, copiar archivos o realizar pruebas, le ordenas a un agente que compile una función y este ejecuta todo el ciclo. Comprender cómo colaborar con estos sistemas ya no es una habilidad de nicho, sino el nuevo estándar de productividad.
`,
      fr: `
Les agents d'IA représentent un changement de paradigme dans notre façon d'interagir avec la technologie. Contrairement aux simples chatbots qui répondent aux requêtes par du texte, les agents d'IA sont conçus pour observer, planifier, prendre des décisions et agir de manière autonome pour atteindre des objectifs complexes.

## Les Composants Clés d'un Agent

Un agent d'IA autonome se compose généralement de quatre éléments clés travaillant en harmonie :

1. **Le Cerveau (LLM) :** Le moteur de raisonnement central. Il traite le contexte, prend des décisions et détermine les étapes.
2. **La Planification :** La capacité de décomposer un objectif important en sous-tâches plus petites et gérables.
3. **La Mémoire :** Stockage des journaux d'exécution à court terme et des connaissances à long terme pour s'adapter au fil du temps.
4. **Les Outils :** Interface avec le monde extérieur (par exemple, exécuter du code, rechercher sur le Web, appeler des API).

## Pourquoi les agents comptent en 2026

En 2026, les agents d'IA sont passés de scripts de terminal expérimentaux à des systèmes de production. Ils automatisent les pipelines de développement, gèrent les interactions avec les clients et contrôlent même des robots physiques dans les entrepôts.

Pour les développeurs et créateurs, les agents sont les ultimes multiplicateurs de force. Au lieu d'écrire manuellement du code répétitif, de copier des fichiers ou de lancer des tests, vous demandez à un agent de créer une fonctionnalité, et il exécute toute la boucle. Comprendre comment collaborer avec ces systèmes n'est plus une compétence de niche — c'est la nouvelle norme de productivité.
`,
      de: `
KI-Agenten stellen einen Paradigmenwechsel in der Art und Weise dar, wie wir mit Technologie interagieren. Im Gegensatz zu einfachen Chatbots, die auf Prompts mit Text antworten, sind KI-Agenten darauf ausgelegt, autonom zu beobachten, zu planen, Entscheidungen zu treffen und zu handeln, um komplexe Ziele zu erreichen.

## Die Kernkomponenten eines Agenten

Ein autonomer KI-Agent besteht typischerweise aus vier Kernelementen, die gemeinsam arbeiten:

1. **Das Gehirn (LLM):** Die zentrale Argumentations-Engine. Sie verarbeitet den Kontext, trifft Entscheidungen und bestimmt die Schritte.
2. **Planung:** Die Fähigkeit, ein großes Ziel in kleinere, überschaubare Teilaufgaben zu zerlegen.
3. **Speicher:** Speichern von kurzfristigen Ausführungsprotokollen und langfristigem Wissen, um sich im Laufe der Zeit anzupassen.
4. **Tools:** Schnittstellen zur Außenwelt (z. B. Ausführen von Code, Durchsuchen des Webs, Aufrufen von APIs).

## Warum Agenten im Jahr 2026 wichtig sind

Im Jahr 2026 haben sich KI-Agenten von experimentellen Terminal-Skripten zu produktionsreifen Systemen entwickelt. Sie automatisieren Entwickler-Pipelines, wickeln Kundeninteraktionen ab und steuern sogar physische Roboter in Lagern.

Für Entwickler und Kreative sind Agenten der ultimative Kraftmultiplikator. Anstatt Boilerplate-Code manuell zu schreiben, Dateien zu kopieren oder Tests auszuführen, weisen Sie einen Agenten an, ein Feature zu erstellen, und er führt die gesamte Schleife aus. Zu verstehen, wie man mit diesen Systemen zusammenarbeitet, ist keine Nischenkompetenz mehr – es ist der neue Produktivitätsstandard.
`,
      it: `
Gli agenti AI rappresentano un cambio di paradigma nel modo in cui interagiamo con la tecnologia. A differenza dei semplici chatbot che rispondono ai prompt con del testo, gli agenti AI sono progettati per osservare, pianificare, prendere decisioni e agire in modo autonomo per raggiungere obiettivi complessi.

## I Componenti Chiave di un Agente

Un agente AI autonomo consiste in genere di quattro elementi principali che lavorano in armonia:

1. **Il Cervello (LLM):** Il motore di ragionamento principale. Elabora il contesto, prende decisioni e stabilisce le fasi.
2. **Pianificazione:** La capacità di suddividere un obiettivo grande in sotto-attività più piccole e gestibili.
3. **Memoria:** Archiviazione di log di esecuzione a breve termine e conoscenza a lungo termine per adattarsi nel tempo.
4. **Strumenti:** Interfaccia con il mondo esterno (es. esecuzione di codice, ricerca sul web, chiamata di API).

## Perché gli agenti sono importanti nel 2026

Nel 2026, gli agenti AI sono passati da script di terminale sperimentali a sistemi di livello di produzione. Stanno automatizzando le pipeline di sviluppo, gestendo le interazioni con i clienti e persino controllando robot fisici nei magazzini.

Per i costruttori e i creatori, gli agenti sono i moltiplicatori di forza definitivi. Invece di scrivere manualmente codice standard, copiare file o eseguire test, istruisci un agente a creare una funzionalità e questo esegue l'intero ciclo. Capire come collaborare con questi sistemi non è più una competenza di nicchia: è il nuovo standard di produttività.
`,
      ja: `
AIエージェントは、私たちがテクノロジーと対話する方法におけるパラダイムシフトを表しています。テキストでプロンプトに応答するだけの単純なチャットボットとは異なり、AIエージェントは自律的に観察、計画、決定を下し、複雑な目標を達成するために行動するように設計されています。

## エージェントのコアコンポーネント

自律型AIエージェントは、通常、調和して機能する4つのコア要素で構成されています。

1. **脳（LLM）：** コアとなる推論エンジン。文脈を処理し、意思決定を行い、ステップを決定します。
2. **計画：** 大きな目標を小さく管理しやすいサブタスクに分解する能力。
3. **メモリ：** 短期的な実行ログと長期的な知識を保存し、時間の経過とともに適応します。
4. **ツール：** 外部世界とのインターフェース（コードの実行、Web検索、APIの呼び出しなど）。

## 2026年にエージェントが重要である理由

2026年、AIエージェントは実験的なターミナルスクリプトから本番グレードのシステムへと移行しました。開発者パイプラインの自動化、クライアントとのやり取りの処理、さらには倉庫での物理的なロボットの制御まで行っています。

ビルダーやクリエイターにとって、エージェントは究極のフォースマルチプライヤーです。定型コードを手動で作成したり、ファイルをコピーしたり、テストを実行したりする代わりに、エージェントに機能を構築するように指示すれば、エージェントがループ全体を実行します。これらのシステムと連携する方法を理解することは、もはやニッチなスキルではなく、生産性の新しい基準となっています。
`,
      zh: `
AI 代理代表了我们与技术交互方式的范式转变。与通过文本响应提示的简单聊天机器人不同，AI 代理旨在自主观察、计划、做出决策并采取行动，以实现复杂的目标。

## 代理的核心组件

自主 AI 代理通常由协调工作的四个核心要素组成：

1. **大脑（LLM）：** 核心推理引擎。它处理上下文、做出决策并确定步骤。
2. **规划：** 将大目标分解为较小、易于管理的子任务的能力。
3. **记忆：** 存储短期执行日志和长期知识，以便随着时间的推移进行适应。
4. **工具：** 与外部世界的接口（例如，执行代码、搜索网络、调用 API）。

## 为什么代理在2026年如此重要

到 2026 年，AI 代理已经从实验性的终端脚本演变为生产级系统。它们正在自动化开发人员管道，处理客户互动，甚至控制仓库中的物理机器人。

对于构建者和创作者来说，代理是终极的力量倍增器。您无需手动编写样板、复制文件或运行测试，只需指示代理构建某项功能，它就会执行整个循环。了解如何与这些系统协作已空间上不再是一项小众技能，而是生产力的新标准。
`,
    },
  },
  {
    slug: 'building-ai-agents',
    subjects: ['ai-agents', 'tutorial', 'development'],
    titles: {
      en: "The Beginner's Guide to Building AI Agents in 2026",
      pt: 'O Guia do Iniciante para Construir Agentes de IA em 2026',
      es: 'La guia para principiantes para construir agentes de IA en 2026',
      fr: "Le guide du debutant pour creer des agents d'IA en 2026",
      de: 'Der Leitfaden fuer Einsteiger zum Erstellen von KI-Agenten im Jahr 2026',
      it: 'La guida per principianti alla creazione di agenti AI nel 2026',
      ja: '2026年におけるAIエージェント構築の初心者向けガイド',
      zh: '2026年构建 AI 代理的初学者指南',
    },
    markdowns: {
      en: `
Ready to build your first AI agent? In 2026, building agents has become extremely accessible thanks to modern high-level frameworks and Model Context Protocol (MCP) integrations. You don't need a PhD in machine learning to construct a capable agentic workflow.

## Step 1: Choosing a Framework

There are several popular choices depending on your language of choice:

- **TypeScript/JavaScript:** Vercel AI SDK or LangChain.js. Highly integrated with serverless functions and frontend applications.
- **Python:** CrewAI or Autogen. Excellent for complex multi-agent architectures and data-heavy workflows.
- **No-Code / Low-Code:** Platforms like OpenCode or Flowise where you construct agent pipelines visually.

## Step 2: Designing the Tools

An agent is only as good as its tools. Using the Model Context Protocol (MCP), you can expose simple APIs to your agent. Let's create a minimal calculator tool in TypeScript:

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Evaluate math expressions",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "The math formula to evaluate" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Step 3: Setting Up the Reasoning Loop

The core loop of an agent is **Observe -> Plan -> Act**. The LLM receives the user request, decides which tool to call, processes the tool output, and iterates until it achieves the final answer. 

By building simple tools and nesting them under a robust orchestration framework, you can construct agents that automate tedious parts of your personal and professional life.
`,
      pt: `
Pronto para construir seu primeiro agente de IA? Em 2026, construir agentes tornou-se extremamente acessível graças a frameworks modernos de alto nível e integrações com o Model Context Protocol (MCP). Você não precisa de um PhD em aprendizado de máquina para construir um fluxo de trabalho agente capaz.

## Passo 1: Escolhendo um Framework

Existem várias opções populares dependendo da sua linguagem de escolha:

- **TypeScript/JavaScript:** Vercel AI SDK ou LangChain.js. Altamente integrado com funções serverless e aplicações frontend.
- **Python:** CrewAI ou Autogen. Excelente para arquiteturas complexas de múltiplos agentes e fluxos com grande volume de dados.
- **Sem Código / Baixo Código:** Plataformas como OpenCode ou Flowise, onde você constrói pipelines de agentes visualmente.

## Passo 2: Projetando as Ferramentas

Um agente é tão bom quanto suas ferramentas. Usando o Model Context Protocol (MCP), você pode expor APIs simples para o seu agente. Vamos criar uma ferramenta básica de calculadora em TypeScript:

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Avaliar expressões matemáticas",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "A fórmula matemática a ser avaliada" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Passo 3: Configurando o Ciclo de Raciocínio

O ciclo central de um agente é **Observar -> Planejar -> Agir**. O LLM recebe a requisição do usuário, decide qual ferramenta chamar, processa a saída da ferramenta e itera até obter a resposta final.

Ao construir ferramentas simples e aninhá-las sob um framework de orquestração robusto, você pode construir agentes que automatizam partes tediosas de sua vida pessoal e profissional.
`,
      es: `
¿Listo para construir tu primer agente de IA? En 2026, construir agentes se ha vuelto extremadamente accesible gracias a los frameworks modernos de alto nivel y las integraciones con el Model Context Protocol (MCP). No necesitas un doctorado en aprendizaje automático para diseñar un flujo de trabajo agéntico.

## Paso 1: Elegir un Framework

Existen varias opciones populares según el lenguaje de tu elección:

- **TypeScript/JavaScript:** Vercel AI SDK o LangChain.js. Altamente integrado con funciones serverless y aplicaciones frontend.
- **Python:** CrewAI o Autogen. Excelente para arquitecturas multiagente complejas y flujos con muchos datos.
- **No-Code / Low-Code:** Plataformas como OpenCode o Flowise donde puedes diseñar flujos de agentes visualmente.

## Paso 2: Diseñar las Herramientas

Un agente es tan útil como sus herramientas. Utilizando el Model Context Protocol (MCP), puedes exponer APIs simples para tu agente. Creemos una herramienta calculadora básica en TypeScript:

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Evaluar expresiones matemáticas",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "La fórmula matemática a evaluar" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Paso 3: Configurar el Ciclo de Razonamiento

El bucle central de un agente es **Observar -> Planificar -> Actuar**. El LLM recibe la solicitud del usuario, decide qué herramienta llamar, procesa el resultado de la herramienta e itera hasta alcanzar la respuesta definitiva.
`,
      fr: `
Prêt à créer votre premier agent d'IA ? En 2026, la création d'agents est devenue extrêmement accessible grâce aux frameworks de haut niveau modernes et aux intégrations du protocole de contexte de modèle (MCP). Pas besoin d'un doctorat en machine learning pour concevoir un flux de travail agentique performant.

## Étape 1 : Choisir un Framework

Il existe plusieurs choix populaires selon votre langage préféré :

- **TypeScript/JavaScript :** Vercel AI SDK ou LangChain.js. Très intégré avec les fonctions serverless et les applications frontend.
- **Python :** CrewAI ou Autogen. Excellent pour les architectures multi-agents complexes et les flux gourmands en données.
- **No-Code / Low-Code :** Des plateformes comme OpenCode ou Flowise où vous construisez visuellement des pipelines d'agents.

## Étape 2 : Concevoir les Outils

Un agent n'est performant que si ses outils le sont. En utilisant le protocole MCP, vous pouvez exposer des API simples à votre agent. Créons un outil de calcul minimal en TypeScript :

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Évaluer des expressions mathématiques",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "La formule mathématique à évaluer" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Étape 3 : Configurer la boucle de raisonnement

La boucle centrale d'un agent est **Observer -> Planifier -> Agir**. Le LLM reçoit la requête de l'utilisateur, décide de l'outil à appeler, traite le résultat et itère jusqu'à obtenir la réponse finale.
`,
      de: `
Bereit, Ihren ersten KI-Agenten zu bauen? Im Jahr 2026 ist das Erstellen von Agenten dank moderner High-Level-Frameworks und der Integration des Model Context Protocol (MCP) extrem zugänglich geworden. Sie benötigen keinen Doktortitel in maschinellem Lernen, um einen fähigen agentenbasierten Workflow aufzubauen.

## Schritt 1: Auswahl eines Frameworks

Je nach bevorzugter Programmiersprache gibt es mehrere beliebte Optionen:

- **TypeScript/JavaScript:** Vercel AI SDK oder LangChain.js. Stark integriert in serverlose Funktionen und Frontend-Anwendungen.
- **Python:** CrewAI oder Autogen. Hervorragend geeignet für komplexe Multi-Agenten-Architekturen und datenintensive Workflows.
- **No-Code / Low-Code:** Plattformen wie OpenCode oder Flowise, auf denen Sie Agenten-Pipelines visuell erstellen.

## Schritt 2: Entwerfen der Tools

Ein Agent ist nur so gut wie seine Werkzeuge. Mit dem Model Context Protocol (MCP) können Sie einfache APIs für Ihren Agenten bereitstellen. Erstellen wir ein Rechner-Tool in TypeScript:

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Mathematische Ausdrücke auswerten",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Die zu berechnende mathematische Formel" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Schritt 3: Einrichten der Argumentationsschleife

Die Kernschleife eines Agenten ist **Beobachten -> Planen -> Handeln**. Das LLM empfängt die Benutzeranfrage, entscheidet, welches Tool aufgerufen werden soll, verarbeitet die Ausgabe des Tools und wiederholt den Vorgang, bis die endgültige Antwort gefunden ist.
`,
      it: `
Pronto a creare il tuo primo agente AI? Nel 2026, la creazione di agenti è diventata estremamente accessibile grazie ai moderni framework di alto livello e alle integrazioni del Model Context Protocol (MCP). Non serve un dottorato in machine learning per progettare un flusso di lavoro agentico.

## Passaggio 1: Scelta di un Framework

Esistono diverse opzioni popolari a seconda del linguaggio preferito:

- **TypeScript/JavaScript:** Vercel AI SDK o LangChain.js. Fortemente integrato con funzioni serverless e applicazioni frontend.
- **Python:** CrewAI o Autogen. Eccellente per complesse architetture multi-agente e flussi di lavoro ricchi di dati.
- **No-Code / Low-Code:** Piattaforme come OpenCode o Flowise in cui crei visivamente pipeline di agenti.

## Passaggio 2: Progettazione degli Strumenti

Un agente è efficiente solo quanto lo sono i suoi strumenti. Utilizzando il Model Context Protocol (MCP), puoi esporre semplici API al tuo agente. Creiamo uno strumento calcolatrice minimo in TypeScript:

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "Valuta espressioni matematiche",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "La formula matematica da valutare" }
    },
    required: ["expression"]
  }
};
\`\`\`

## Passaggio 3: Configurazione del Ciclo di Ragionamento

Il ciclo centrale di un agente è **Osserva -> Pianifica -> Agisci**. L'LLM riceve la richiesta dell'utente, decide quale strumento chiamare, elabora l'output dello strumento e itera fino a raggiungere la risposta finale.
`,
      ja: `
最初のAIエージェントを構築する準備はできましたか？2026年、高レベルのフレームワークとModel Context Protocol (MCP) の統合により、エージェントの構築は非常に身近なものになりました。有能なエージェントワークフローを構築するのに、機械学習の博士号は必要ありません。

## ステップ 1: フレームワークの選択

開発言語に応じていくつかの一般的な選択肢があります。

- **TypeScript/JavaScript:** Vercel AI SDK または LangChain.js。サーバーレス関数やフロントエンドアプリケーションと高度に統合されています。
- **Python:** CrewAI または Autogen。複雑なマルチエージェントアーキテクチャやデータ集約型のワークフローに最適です。
- **ノーコード / ローコード:** OpenCodeやFlowiseのような、エージェントパイプラインを視覚的に構築できるプラットフォーム。

## ステップ 2: ツールの設計

エージェントの性能は、そのツールによって決まります。Model Context Protocol (MCP) を使用すると、シンプルなAPIをエージェントに公開できます。TypeScriptで最小限の電卓ツールを作成してみましょう。

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "数式を評価する",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "評価する数式" }
    },
    required: ["expression"]
  }
};
\`\`\`

## ステップ 3: 推論ループのセットアップ

エージェントのコアとなるループは、**観察 -> 計画 -> 行動**です。LLMはユーザーの要求を受け取り、呼び出すツールを決定し、ツールの出力を処理し、最終的な回答が得られるまで繰り返します。
`,
      zh: `
准备好构建您的第一个 AI 代理了吗？到 2026 年，由于现代高级框架和模型上下文协议 (MCP) 集成，构建代理已变得非常容易。您不需要机器学习博士学位即可构建高效的代理工作流。

## 步骤 1：选择框架

根据您选择的语言，有几种流行的选择：

- **TypeScript/JavaScript：** Vercel AI SDK 或 LangChain.js。与无服务器函数和前端应用程序高度集成。
- **Python：** CrewAI 或 Autogen。非常适合复杂的十多代理架构和数据密集型工作流。
- **无代码/低代码：** 像 OpenCode 或 Flowise 这样的平台，您可以在其中可视化构建代理管道。

## 步骤 2：设计工具

代理的优劣取决于它的工具。使用模型上下文协议 (MCP)，您可以向代理公开简单的 API。让我们用 TypeScript 创建一个最小的计算器工具：

\`\`\`typescript
const calculatorTool = {
  name: "calculate",
  description: "评估数学表达式",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "要评估的数学公式" }
    },
    required: ["expression"]
  }
};
\`\`\`

## 步骤 3：建立推理循环

代理的核心循环是 **观察 -> 计划 -> 行动**。LLM 接收用户请求，决定调用哪个工具，处理工具输出，并进行迭代直到获得最终答案。
`,
    },
  },
  {
    slug: 'llm-comparison-frontier',
    subjects: ['llm-comparison', 'benchmarks', 'models'],
    titles: {
      en: 'Frontier LLM Comparison: GPT-4o, Claude 4, and Gemini 2.5',
      pt: 'Comparação de LLMs de Fronteira: GPT-4o, Claude 4 e Gemini 2.5',
      es: 'Comparación de LLMs de Frontera: GPT-4o, Claude 4 y Gemini 2.5',
      fr: 'Comparaison des LLMs de Pointe : GPT-4o, Claude 4 et Gemini 2.5',
      de: 'Frontier-LLM-Vergleich: GPT-4o, Claude 4 und Gemini 2.5',
      it: "Confronto LLM d'Avanguardia: GPT-4o, Claude 4 e Gemini 2.5",
      ja: '最前線LLM比較: GPT-4o, Claude 4, Gemini 2.5',
      zh: '前沿大语言模型比较：GPT-4o、Claude 4 和 Gemini 2.5',
    },
    markdowns: {
      en: `
The landscape of Large Language Models (LLMs) in 2026 is defined by three main contenders: OpenAI's GPT-4o, Anthropic's Claude 4, and Google's Gemini 2.5. Each model has developed unique characteristics and structural benefits.

## The Side-by-Side Breakdown

### 1. Claude 4 (Anthropic)
- **Strengths:** Code generation, long-form technical analysis, agentic execution. It possesses the most reliable reasoning structure for multi-agent loops.
- **Weaknesses:** Higher latency on complex prompts; slightly higher cost per token.
- **Best for:** Code refactoring, software engineering agents, and deep document analysis.

### 2. GPT-4o (OpenAI)
- **Strengths:** Speed, conversational fluidity, excellent general tool usage. It remains highly optimized for simple, single-turn interactions.
- **Weaknesses:** Can occasionally skip complex reasoning paths in favor of faster outputs.
- **Best for:** Interactive applications, simple customer support bots, and rapid prototyping.

### 3. Gemini 2.5 (Google)
- **Strengths:** Context window (up to 2M tokens), multimodal analysis (handling video and audio natively), and low cost.
- **Weaknesses:** Reasoning can occasionally be less precise than Claude 4 on complex programmatic structures.
- **Best for:** Video analysis, large codebase digestion, and high-volume data extraction.

## Verdict

There is no single "best" model. The choice depends entirely on your workload constraints. For coding and multi-agent coordination, **Claude 4** is the industry consensus. For multimodal and large context projects, **Gemini 2.5** is unmatched. For high-speed conversational interfaces, **GPT-4o** leads the pack.
`,
      pt: `
O cenário dos Grandes Modelos de Linguagem (LLMs) em 2026 é definido por três principais concorrentes: GPT-4o da OpenAI, Claude 4 da Anthropic e Gemini 2.5 do Google. Cada modelo desenvolveu características únicas e benefícios estruturais.

## Análise Lado a Lado

### 1. Claude 4 (Anthropic)
- **Pontos Fortes:** Geração de código, análise técnica detalhada, execução de agentes. Possui a estrutura de raciocínio mais confiável para loops multi-agente.
- **Pontos Fracos:** Maior latência em prompts complexos; custo ligeiramente maior por token.
- **Ideal para:** Refatoração de código, agentes de engenharia de software e análise profunda de documentos.

### 2. GPT-4o (OpenAI)
- **Pontos Fortes:** Velocidade, fluidez conversacional, excelente uso geral de ferramentas. Continua altamente otimizado para interações simples e rápidas.
- **Pontos Fracos:** Ocasionalmente ignora caminhos de raciocínio complexos em favor de respostas mais rápidas.
- **Ideal para:** Aplicações interativas, bots simples de suporte ao cliente e prototipagem rápida.

### 3. Gemini 2.5 (Google)
- **Pontos Fortes:** Janela de contexto (até 2M de tokens), análise multimodal nativa (processa vídeo e áudio) e baixo custo.
- **Pontos Fracos:** O raciocínio pode ser menos preciso que o Claude 4 em estruturas programáticas complexas.
- **Ideal para:** Análise de vídeos, leitura de bases de código inteiras e extração de dados em grande volume.

## Veredicto

Não existe um único modelo "melhor". A escolha depende totalmente das restrições do seu projeto. Para programação e coordenação de múltiplos agentes, o **Claude 4** é o consenso da indústria. Para projetos com grande contexto e multimodais, o **Gemini 2.5** é insuperável. Para interfaces conversacionais rápidas, o **GPT-4o** lidera o mercado.
`,
      es: `
El panorama de los Grandes Modelos de Lenguaje (LLMs) en 2026 está definido por tres competidores principales: GPT-4o de OpenAI, Claude 4 de Anthropic y Gemini 2.5 de Google. Cada modelo ha desarrollado características y beneficios estructurales únicos.

## Comparativa Directa

### 1. Claude 4 (Anthropic)
- **Fortalezas:** Generación de código, análisis técnico de formato largo, ejecución agéntica. Posee la estructura de razonamiento más confiable para bucles multiagente.
- **Debilidades:** Mayor latencia en instrucciones complejas; costo por token ligeramente superior.
- **Ideal para:** Refactorización de código, agentes de ingeniería de software y análisis profundo de documentos.

### 2. GPT-4o (OpenAI)
- **Fortalezas:** Velocidad, fluidez conversacional, excelente uso de herramientas generales. Sigue muy optimizado para interacciones simples de un solo turno.
- **Debilidades:** Ocasionalmente puede omitir rutas de razonamiento complejas en favor de respuestas rápidas.
- **Ideal para:** Aplicaciones interactivas, bots de soporte técnico sencillos y creación rápida de prototipos.

### 3. Gemini 2.5 (Google)
- **Fortalezas:** Ventana de contexto (hasta 2 millones de tokens), análisis multimodal (video y audio de forma nativa) y bajo costo.
- **Debilidades:** El razonamiento puede ser menos preciso que el de Claude 4 en estructuras programáticas complejas.
- **Ideal para:** Análisis de video, procesamiento de bases de código grandes y extracción masiva de datos.

## Veredicto

No existe un modelo "perfecto". La elección depende de las limitaciones de tu proyecto. Para programación y coordinación de agentes, **Claude 4** es el preferido. Para proyectos con grandes volúmenes de contexto o multimodalidad, **Gemini 2.5** es insuperable. Para interfaces conversacionales veloces, **GPT-4o** lleva la delantera.
`,
      fr: `
Le paysage des grands modèles de langage (LLM) en 2026 est défini par trois principaux concurrents : GPT-4o d'OpenAI, Claude 4 d'Anthropic et Gemini 2.5 de Google. Chaque modèle présente des caractéristiques uniques et des avantages structurels.

## Le Comparatif Côte à Côte

### 1. Claude 4 (Anthropic)
- **Forces :** Génération de code, analyse technique approfondie, exécution agentique. Réflectivité et logique fiables pour les boucles multi-agents.
- **Faiblesses :** Latence plus élevée sur les requêtes complexes ; coût par jeton légèrement plus élevé.
- **Idéal pour :** Refactoring de code, agents d'ingénierie logicielle et analyse de documents longs.

### 2. GPT-4o (OpenAI)
- **Forces :** Vitesse, fluidité conversationnelle, intégration d'outils généraux. Reste très optimisé pour les interactions simples à un tour.
- **Faiblesses :** Peut parfois sauter des étapes de raisonnement complexes pour répondre plus vite.
- **Idéal pour :** Applications interactives, chatbots de support client simples et prototypage rapide.

### 3. Gemini 2.5 (Google)
- **Forces :** Fenêtre de contexte immense (jusqu'à 2M de jetons), analyse multimode native (vidéo, audio) et faible coût.
- **Faiblesses :** Le raisonnement peut être moins précis que Claude 4 sur du code complexe.
- **Idéal pour :** Analyse vidéo, digestion de grands dépôts de code et extraction de données en masse.

## Verdict

Il n'y a pas de "meilleur" modèle universel. Le choix dépend de vos cas d'usage. Pour le code et la coordination d'agents, **Claude 4** est recommandé. Pour le traitement de gros volumes de documents et le multimédia, **Gemini 2.5** est imbattable. Pour des réponses rapides, privilégiez **GPT-4o**.
`,
      de: `
Die Landschaft der Large Language Models (LLMs) im Jahr 2026 wird von drei Hauptakteuren bestimmt: OpenAIs GPT-4o, Anthropics Claude 4 und Googles Gemini 2.5. Jedes Modell hat einzigartige Eigenschaften und strukturelle Vorteile entwickelt.

## Der direkte Vergleich

### 1. Claude 4 (Anthropic)
- **Stärken:** Code-Generierung, detaillierte technische Analyse, agentenbasiertes Handeln. Zuverlässigste logische Struktur für Multi-Agenten-Schleifen.
- **Schwächen:** Höhere Latenz bei komplexen Prompts; leicht höhere Kosten pro Token.
- **Optimal für:** Code-Refactoring, Software-Engineering-Agenten und tiefe Dokumentenanalyse.

### 2. GPT-4o (OpenAI)
- **Stärken:** Geschwindigkeit, flüssige Konversation, hervorragende allgemeine Tool-Nutzung. Hochgradig optimiert für einfache Interaktionen.
- **Schwächen:** Überspringt gelegentlich komplexe Argumentationsschritte zugunsten einer schnelleren Antwort.
- **Optimal für:** Das Erstellen interaktiver Anwendungen, einfache Kundensupport-Bots und schnelles Prototyping.

### 3. Gemini 2.5 (Google)
- **Stärken:** Kontextfenster (bis zu 2 Mio. Token), native multimodale Analyse (Video/Audio) und niedrige Kosten.
- **Schwächen:** Argumentation bei komplexen Programmierstrukturen ist manchmal ungenauer als bei Claude 4.
- **Optimal für:** Videoanalyse, Analyse großer Codebasen und Datenextraktion in großen Mengen.

## Fazit

Es gibt nicht das eine „beste“ Modell. Die Wahl hängt ganz von Ihren Projektanforderungen ab. Für Programmierung und die Koordination von Agenten ist **Claude 4** die erste Wahl. Für Projekte mit großem Kontext und Multimodalität ist **Gemini 2.5** unschlagbar. Für schnelle, dialogorientierte Schnittstellen führt **GPT-4o** das Feld an.
`,
      it: `
Il panorama dei Large Language Models (LLM) nel 2026 è definito da tre principali sfidanti: GPT-4o di OpenAI, Claude 4 di Anthropic e Gemini 2.5 di Google. Ciascun modello ha sviluppato caratteristiche uniche e vantaggi strutturali.

## Il Confronto Diretto

### 1. Claude 4 (Anthropic)
- **Punti di Forza:** Generazione di codice, analisi tecnica dettagliata, esecuzione agentica. Possiede la struttura di ragionamento più affidabile per i cicli multi-agente.
- **Debolezze:** Maggiore latenza su prompt complessi; costo per token leggermente superiore.
- **Ideale per:** Refactoring del codice, agenti di ingegneria del software e analisi approfondita di documenti.

### 2. GPT-4o (OpenAI)
- **Punti di Forza:** Velocità, fluidità conversazionale, eccellente utilizzo generale degli strumenti. Rimane ottimizzato per interazioni semplici e veloci.
- **Debolezze:** Occasionalmente può saltare passaggi di ragionamento complessi per fornire risposte più veloci.
- **Ideale per:** Applicazioni interattive, bot di assistenza clienti semplici e prototipazione rapida.

### 3. Gemini 2.5 (Google)
- **Punti di Forza:** Finestra di contesto (fino a 2M di token), tecnologia multimodale nativa (gestisce video e audio) e basso costo.
- **Debolezze:** Il ragionamento pode ser talvolta meno preciso di Claude 4 su strutture programmatiche complesse.
- **Ideale per:** Analisi di video, elaborazione di grandi basi di codice ed estrazione di dati ad alto volume.

## Verdetto

Non esiste un modello "migliore" in assoluto. La scelta dipende interamente dai requisiti del tuo progetto. Per la scrittura di codice e il coordinamento di agenti, **Claude 4** rappresenta il consenso del settore. Per progetti con contesto ampio e multimodali, **Gemini 2.5** non ha rivali. Per interfacce conversazionali veloci, **GPT-4o** è in testa.
`,
      ja: `
2026年における大規模言語モデル（LLM）の展望は、OpenAIのGPT-4o、AnthropicのClaude 4、GoogleのGemini 2.5という3つの主要な競合によって定義されています。各モデルは独自の特性と構造上の利点を発展させてきました。

## 徹底比較

### 1. Claude 4 (Anthropic)
- **長所:** コード生成、長文の技術分析、エージェント実行。マルチエージェントループにおいて最も信頼性の高い推論構造を持ちます。
- **短所:** 複雑なプロンプトでの応答速度の低下、トークンあたりのコストがわずかに高い。
- **最適用途:** コードのリファクタリング、ソフトウェアエンジニアリングエージェント、深いドキュメント分析。

### 2. GPT-4o (OpenAI)
- **長所:** 速度、会話のスムーズさ、優れた一般的なツール使用能力。シンプルな対話型やり取りに高度に最適化されています。
- **短所:** 高速な出力を優先して、複雑な推論プロセスをスキップすることがあります。
- **最適用途:** インタラクティブなアプリケーション、シンプルなカスタマーサポートボット、迅速なプロトタイピング。

### 3. Gemini 2.5 (Google)
- **長所:** コンテキストウィンドウ（最大200万トークン）、ネイティブなマルチモーダル分析（ビデオとオーディオの処理）、低コスト。
- **短所:** 複雑なプログラム構造において、Claude 4ほど推論の精度が高くないことがあります。
- **最適用途:** ビデオ分析、大規模なコードベースの読み込み、大量のデータ抽出。

## 結論

唯一の「最適な」モデルは存在しません。選択はプロジェクトの要件に完全に依存します。コーディングとマルチエージェントの調整には**Claude 4**、大規模なコンテキストやマルチモーダルプロジェクトには**Gemini 2.5**、高速な会話型インターフェースには**GPT-4o**が適しています。
`,
      zh: `
2026 年的大语言模型 (LLM) 格局由三个主要竞争对手定义：OpenAI 的 GPT-4o、Anthropic 的 Claude 4 和 Google 的 Gemini 2.5。每个模型都发展出了独特的特性和结构优势。

## 并排对比分析

### 1. Claude 4 (Anthropic)
- **优势：** 代码生成、长篇技术分析、代理执行。对于多代理循环具有最可靠的推理结构。
- **劣势：** 复杂提示词下的延迟较高；每个 Token 的成本略高。
- **最适用于：** 代码重构、软件工程代理和深度文档分析。

### 2. GPT-4o (OpenAI)
- **优势：** 速度快、对话流畅、优秀的通用工具使用能力。对于简单、单轮交互仍然高度优化。
- **劣势：** 有时为了快速输出而跳过复杂的推理路径。
- **最适用于：** 交互式应用程序、简单的客户服务机器人和快速原型开发。

### 3. Gemini 2.5 (Google)
- **优势：** 上下文窗口巨大（高达 200 万 Token）、原生多模态分析（直接处理视频和音频）以及低成本。
- **劣势：** 在复杂的编程结构上，推理精度偶尔不如 Claude 4。
- **最适用于：** 视频分析、大型代码库理解和高容量数据提取。

## 结论

没有唯一的“最佳”模型。选择完全取决于您的工作负载限制。对于编码和多代理协调，**Claude 4** 是行业共识。对于多模态和大型上下文项目，**Gemini 2.5** 无人能及。对于高速对话接口，**GPT-4o** 领先。
`,
    },
  },
  {
    slug: 'evaluating-llms',
    subjects: ['llm-comparison', 'tutorials', 'benchmarks'],
    titles: {
      en: 'How to Evaluate and Choose the Best LLM for Your Project',
      pt: 'Como Avaliar e Escolher o Melhor LLM para o seu Projeto',
      es: 'Cómo evaluar y elegir el mejor LLM para tu proyecto',
      fr: 'Comment évaluer et choisir le meilleur LLM pour votre projet',
      de: 'So bewerten und wählen Sie das beste LLM für Ihr Projekt aus',
      it: 'Come valutare e scegliere il miglior LLM per il tuo progetto',
      ja: 'プロジェクトに最適なLLMを評価して選択する方法',
      zh: '如何评估并为您的项目选择最佳大语言模型',
    },
    markdowns: {
      en: `
Choosing the right Large Language Model (LLM) is one of the most critical decisions when building AI-powered applications. A wrong choice can lead to excessive API costs, poor output quality, or slow response times. Here is a structured guide to evaluating LLMs.

## 1. Defining Your Requirements

Before running benchmarks, list your constraints:
- **Accuracy vs. Speed:** Do you need highly accurate code generation or instant chat responses?
- **Budget:** What is your target cost per 1,000 queries?
- **Context Size:** How much data does the model need to read at once?
- **Data Privacy:** Can you use external APIs, or do you need to self-host an open-weight model?

## 2. Setting Up an Evaluation Dataset

Generic benchmarks (like MMLU) are useful indicators, but they don't reflect your specific application. Create a custom evaluation set containing:
- 50 to 100 representative user prompts.
- The expected "golden" responses.
- Test cases for edge cases, error handling, and formatting rules (e.g., JSON schemas).

## 3. Running and Scoring Evaluations

Run your dataset against the models you are considering (GPT-4o, Claude 4, Gemini 2.5, or open models like Llama 3.1). Score the outputs based on:
1. **Semantic Similarity:** Does the response convey the correct meaning?
2. **Constraint Adherence:** Did the model follow formatting rules and system prompt restrictions?
3. **Latency and Costs:** Monitor the execution speed and calculate the API pricing.

Using this structured approach ensures you select the model that delivers the best cost-to-performance ratio for your application.
`,
      pt: `
Escolher o Grande Modelo de Linguagem (LLM) correto é uma das decisões mais críticas ao construir aplicações de IA. Uma escolha errada pode levar a custos de API excessivos, baixa qualidade de resposta ou lentidão. Aqui está um guia estruturado para avaliar LLMs.

## 1. Definindo Seus Requisitos

Antes de rodar benchmarks, liste suas restrições:
- **Precisão vs. Velocidade:** Você precisa de geração de código altamente precisa ou respostas de chat instantâneas?
- **Orçamento:** Qual é o custo máximo que você pode pagar por 1.000 requisições?
- **Tamanho do Contexto:** Quanta informação o modelo precisa processar de uma só vez?
- **Privacidade de Dados:** Você pode usar APIs de terceiros ou precisa rodar um modelo local/open-weight?

## 2. Criando um Dataset de Avaliação

Benchmarks genéricos (como MMLU) são bons indicadores, mas não refletem a realidade da sua aplicação. Crie um conjunto de avaliação personalizado contendo:
- 50 a 100 prompts típicos dos usuários.
- As respostas "ideais" esperadas (golden responses).
- Casos de teste para cenários de erro, limites e regras de formatação (ex: JSON schemas).

## 3. Executando e Pontuando as Avaliações

Rode seu dataset nos modelos sob avaliação (GPT-4o, Claude 4, Gemini 2.5, ou modelos abertos como Llama 3.1). Avalie os resultados com base em:
1. **Similaridade Semântica:** A resposta transmite o significado correto?
2. **Adesão a Restrições:** O modelo seguiu as regras de formatação e limitações do prompt do sistema?
3. **Latência e Custo:** Monitore o tempo de resposta e calcule os custos de API consumidos.

Adotar esta abordagem estruturada garante que você escolha o modelo com a melhor relação custo-benefício para a sua aplicação.
`,
      es: `
Elegir el Modelo de Lenguaje (LLM) adecuado es una de las decisiones más críticas al crear aplicaciones de IA. Una elección incorrecta puede traducirse en costos de API excesivos, respuestas deficientes o tiempos de carga lentos. A continuación, te presentamos una guía para evaluar LLMs.

## 1. Definir tus Requisitos

Antes de realizar pruebas de rendimiento, define tus limitaciones:
- **Precisión vs. Velocidad:** ¿Necesitas un código altamente preciso o respuestas de chat instantáneas?
- **Presupuesto:** ¿Cuál es tu costo máximo por cada 1,000 consultas?
- **Tamaño del Contexto:** ¿Cuánta información debe leer el modelo de una sola vez?
- **Privacidad de Datos:** ¿Puedes usar APIs externas o necesitas hospedar un modelo local de código abierto?

## 2. Configurar un Dataset de Evaluación

Los benchmarks genéricos (como MMLU) son útiles, pero no reflejan tu caso de uso particular. Crea un conjunto de evaluación personalizado que incluya:
- Entre 50 y 100 instrucciones representativas del usuario.
- Las respuestas óptimas esperadas.
- Casos de prueba para escenarios atípicos, gestión de errores y esquemas de formato (ej. esquemas JSON).

## 3. Ejecutar y Puntuar las Evaluaciones

Prueba tu dataset en los modelos seleccionados (GPT-4o, Claude 4, Gemini 2.5 o modelos abiertos como Llama 3.1). Evalúa los resultados según:
1. **Similitud Semántica:** ¿La respuesta mantiene el significado deseado?
2. **Cumplimiento de Restricciones:** ¿El modelo siguió las pautas de formato e instrucciones del sistema?
3. **Latencia y Costo:** Monitorea la velocidad de ejecución y calcula las tarifas de la API.
`,
      fr: `
Choisir le bon modèle de langage (LLM) est l'une des décisions les plus critiques lors de la création d'applications d'IA. Un mauvais choix peut entraîner des coûts d'API excessifs, une mauvaise qualité de sortie ou des temps de réponse lents. Voici un guide structuré pour évaluer les LLM.

## 1. Définir vos besoins

Avant de lancer des benchmarks, listez vos contraintes :
- **Précision vs Vitesse :** Avez-vous besoin d'une génération de code ultra-précise ou de réponses de chat instantanées ?
- **Budget :** Quel est votre coût cible pour 1 000 requêtes ?
- **Taille du contexte :** De quelle quantité de données le modèle a-t-il besoin pour lire en une seule fois ?
- **Confidentialité :** Pouvez-vous utiliser des API externes ou devez-vous auto-héberger un modèle open-source ?

## 2. Mettre en place un jeu de données d'évaluation

Les benchmarks génériques (comme MMLU) sont des indicateurs utiles, mais ils ne reflètent pas votre application spécifique. Créez un jeu de données personnalisé contenant :
- 50 à 100 requêtes utilisateurs représentatives.
- Les réponses "dorées" (attendues).
- Des cas de test pour les cas limites, la gestion des erreurs et les formats (ex: schémas JSON).

## 3. Exécuter et noter les évaluations

Testez votre jeu de données sur les modèles visés (GPT-4o, Claude 4, Gemini 2.5, ou Llama 3.1). Notez les résultats selon :
1. **Similarité sémantique :** La réponse a-t-elle le bon sens ?
2. **Respect des contraintes :** Le modèle a-t-il suivi les règles de formatage ?
3. **Latence et coûts :** Suivez la vitesse d'exécution et calculez le coût d'API.
`,
      de: `
Die Wahl des richtigen Large Language Models (LLM) ist eine der kritischsten Entscheidungen beim Erstellen von KI-gestützten Anwendungen. Eine falsche Wahl kann zu übermäßigen API-Kosten, schlechter Ausgabequalität oder langsamen Antwortzeiten führen. Hier ist ein strukturierter Leitfaden zur Bewertung von LLMs.

## 1. Definition Ihrer Anforderungen

Bevor Sie Benchmarks durchführen, listen Sie Ihre Einschränkungen auf:
- **Genauigkeit vs. Geschwindigkeit:** Benötigen Sie hochpräzise Code-Generierung oder sofortige Chat-Antworten?
- **Budget:** Was sind Ihre Zielkosten pro 1.000 Abfragen?
- **Kontextgröße:** Wie viele Daten muss das Modell auf einmal lesen können?
- **Datenschutz:** Können Sie externe APIs nutzen oder müssen Sie ein Open-Weight-Modell selbst hosten?

## 2. Einrichten eines Evaluierungs-Datensatzes

Generische Benchmarks (wie MMLU) sind nützliche Indikatoren, spiegeln aber nicht Ihre spezifische Anwendung wider. Erstellen Sie einen benutzerdefinierten Evaluierungs-Datensatz mit:
- 50 bis 100 repräsentativen Benutzer-Prompts.
- Den erwarteten optimalen Antworten („Golden Responses“).
- Testfällen für Randfälle, Fehlerbehandlung und Formatierungsregeln (z. B. JSON-Schemas).

## 3. Ausführen und Bewerten der Evaluierungen

Führen Sie Ihren Datensatz auf den Modellen aus, die Sie in Betracht ziehen (GPT-4o, Claude 4, Gemini 2.5 oder offene Modelle wie Llama 3.1). Bewerten Sie die Ergebnisse basierend auf:
1. **Semantische Ähnlichkeit:** Vermittelt die Antwort die richtige Bedeutung?
2. **Einhaltung von Einschränkungen:** Hat das Modell Formatierungsregeln und System-Prompt-Einschränkungen befolgt?
3. **Latenz und Kosten:** Überwachen Sie die Ausführungsgeschwindigkeit und berechnen Sie die API-Kosten.
`,
      it: `
La scelta del corretto Large Language Model (LLM) è una delle decisioni più importanti quando si creano applicazioni basate sull'IA. Una scelta errata può comportare costi elevati delle API, scarsa qualità delle risposte o tempi di caricamento lenti. Ecco una guida strutturata per la valutazione dei LLM.

## 1. Definisci i tuoi Requisiti

Prima di eseguire i benchmark, elenca i tuoi vincoli:
- **Precisione vs Velocità:** Hai bisogno di una generazione di codice molto precisa o di risposte in tempo reale?
- **Budget:** Qual è il costo massimo per 1.000 richieste?
- **Ampiezza del Contesto:** Quante informazioni deve elaborare il modello contemporaneamente?
- **Privacy dei Dati:** Puoi utilizzare API esterne o devi ospitare un modello open-source locale?

## 2. Configura un Dataset di Valutazione

I benchmark generici (come MMLU) sono utili indicatori, ma non riflettono la tua specifica applicazione. Crea un set di valutazione personalizzato che includa:
- Da 50 a 100 richieste degli utenti rappresentative.
- Le risposte ideali previste.
- Casi di test per scenari limite, gestione degli errori e schemi di formato (es. schemi JSON).

## 3. Esegui e Valuta i Risultati

Verifica il tuo dataset sui modelli presi in considerazione (GPT-4o, Claude 4, Gemini 2.5 o Llama 3.1). Valuta le risposte in base a:
1. **Somiglianza Semantica:** La risposta esprime il significato corretto?
2. **Rispetto dei Vincoli:** Il modello ha seguito le regole di formattazione e le limitazioni del prompt di sistema?
3. **Latenz e Costi:** Monitora il tempo di risposta e calcola i costi delle API.
`,
      ja: `
AI搭載アプリケーションを構築する際、適切な大規模言語モデル（LLM）を選択することは最も重要な決定の一つです。選択を誤ると、法外なAPIコスト、出力品質の低下、応答時間の遅延につながる可能性があります。ここでは、LLMを評価するための構造化されたガイドを紹介します。

## 1. 要件の定義

ベンチマークを実行する前に、制約をリストアップします。
- **精度 vs 速度:** 高精度なコード生成が必要ですか、それとも即座のチャット応答が必要ですか？
- **予算:** 1,000クエリあたりの目標コストはどのくらいですか？
- **コンテキストサイズ:** モデルは一度にどのくらいのデータを読み込む必要がありますか？
- **データプライバシー:** 外部APIを使用できますか、それともオープンウェイトモデルをセルフホストする必要がありますか？

## 2. 評価データセットのセットアップ

一般的なベンチマーク（MMLUなど）は有用な指標ですが、特定のアプリケーションを反映しているわけではありません。以下を含むカスタム評価セットを作成します。
- 50〜100個の代表的なユーザープロンプト。
- 期待される「ゴールデン」レスポンス（模範解答）。
- エッジケース、エラー処理、フォーマットルール（JSONスキーマなど）のテストケース。

## 3. 評価の実行とスコアリング

検討しているモデル（GPT-4o、Claude 4、Gemini 2.5、Llama 3.1など）に対してデータセットを実行します。以下の点に基づいて出力をスコアリングします。
1. **意味の類似性:** 出力は正しい意味を伝えていますか？
2. **制約の遵守:** モデルはフォーマットルールやシステムプロンプトの制約に従っていますか？
3. **遅延とコスト:** 実行速度を監視し、API価格を計算します。
`,
      zh: `
选择正确的语言模型 (LLM) 是构建 AI 应用程序时最关键的决定之一。错误的选择可能会导致高昂的 API 成本、低劣的响应质量或缓慢的响应速度。以下是评估 LLM 的结构化指南。

## 1. 确定您的需求

在运行基准测试之前，列出您的限制条件：
- **准确度与速度：** 您需要高度准确的代码生成还是即时的聊天回复？
- **预算：** 每 1,000 次查询的目标成本是多少？
- **上下文大小：** 模型一次需要读取多少数据？
- **数据隐私：** 您可以使用外部 API，还是需要自行托管开源模型？

## 2. 建立评估数据集

通用基准测试（如 MMLU）是很有用的指标，但它们不能反映您的具体应用。创建一个自定义评估数据集，其中包含：
- 50 到 100 个具有代表性的用户提示词。
- 期望的“黄金”标准答案。
- 用于边缘情况、错误处理和格式规则（例如 JSON 架构）的测试用例。

## 3. 运行评估并打分

针对您正在考虑的模型（GPT-4o、Claude 4、Gemini 2.5 或开源模型如 Llama 3.1）运行您的数据集。根据以下方面为输出打分：
1. **语义相似度：** 答案是否传达了正确的含义？
2. **限制遵守情况：** 模型是否遵守了格式规则和系统提示词限制？
3. **延迟和成本：** 监控执行速度并计算 API 定价。
`,
    },
  },
  {
    slug: 'cloud-hosting-vibecoders',
    subjects: ['cloud-computing', 'beginners', 'deployment'],
    titles: {
      en: 'Zero-DevOps Cloud Hosting: A Guide for Vibecoders',
      pt: 'Hospedagem em Nuvem Zero-DevOps: Um Guia para Vibecoders',
      es: 'Hospedaje en la nube Zero-DevOps: Una guia para vibecoders',
      fr: 'Hébergement Cloud Zero-DevOps : Un Guide pour les Vibecoders',
      de: 'Zero-DevOps Cloud Hosting: Ein Leitfaden fuer Vibecoder',
      it: 'Hosting Cloud Zero-DevOps: Una Guida per i Vibecoder',
      ja: 'Zero-DevOpsクラウドホスティング：バイブコーダー向けガイド',
      zh: '零运维云托管：Vibecoders 指南',
    },
    markdowns: {
      en: `
As a vibecoder, your main goal is to build, iterate, and vibe. You want to see your ideas become reality instantly. The last thing you want is to spend three days writing Dockerfiles, configuring networking routing, or setting up complex Kubernetes clusters. 

Here is a guide to zero-DevOps cloud hosting.

## The Modern Zero-DevOps Stack

In 2026, hosting your project requires very little effort. Here are the leading choices for serverless execution:

1. **Static Frontends:** **Cloudflare Pages** or Vercel. Connect your Git repository, and every commit is automatically built and deployed to a global CDN.
2. **Serverless APIs:** **Cloudflare Workers**. Write minimal JavaScript or TypeScript functions that execute at the edge, offering zero-cold-start execution and a generous free tier.
3. **Databases:** Serverless options like **Cloudflare D1** (SQL) or Neon (Postgres) scale down to zero when not in use, ensuring you never pay for idle database servers.

## How to Get Started with Cloudflare Pages

Deploying a Qwik or React app is as simple as running:

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`

By outsourcing infrastructure details to edge networks, you can focus on building features, iterating on feedback, and maintaining your flow. Let the platform handle availability, scaling, and DDoS protection while you focus on the vibe.
`,
      pt: `
Como um vibecoder, seu principal objetivo é construir, iterar e manter o fluxo (vibe). Você quer ver suas ideias se tornarem realidade instantaneamente. A última coisa que você quer é passar três dias escrevendo Dockerfiles, configurando rotas de rede ou configurando clusters complexos de Kubernetes.

Aqui está um guia para hospedagem em nuvem zero-DevOps.

## A Pilha Moderna Zero-DevOps

Em 2026, hospedar seu projeto requer pouquíssimo esforço. Aqui estão as principais escolhas para execução serverless:

1. **Frontends Estáticos:** **Cloudflare Pages** ou Vercel. Conecte seu repositório Git e cada commit é automaticamente compilado e implantado em uma CDN global.
2. **APIs Serverless:** **Cloudflare Workers**. Escreva funções mínimas em JavaScript ou TypeScript que rodam na borda (edge), oferecendo tempo de inicialização zero e uma generosa camada gratuita.
3. **Bancos de Dados:** Opções serverless como **Cloudflare D1** (SQL) ou Neon (Postgres) escalam até zero quando não estão em uso, garantindo que você nunca pague por servidores inativos.

## Como Começar com Cloudflare Pages

Implantar um app Qwik ou React é tão simples quanto executar:

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`

Ao terceirizar a infraestrutura para redes de borda, você foca estritamente em construir funcionalidades, iterar sobre feedbacks e manter o seu fluxo. Deixe que a plataforma cuide da escalabilidade e segurança enquanto você foca no código.
`,
      es: `
Como vibecoder, tu objetivo principal es crear, iterar y fluir. Deseas ver tus ideas hechas realidad al instante. Lo último que deseas es pasar tres días escribiendo Dockerfiles, configurando rutas de red o configurando clústeres complejos de Kubernetes.

Aquí tienes una guía para el hospedaje en la nube sin DevOps.

## La infraestructura Zero-DevOps moderna

En 2026, alojar tu proyecto requiere muy poco esfuerzo. Estas son las opciones líderes para la ejecución serverless:

1. **Frontends estáticos:** **Cloudflare Pages** o Vercel. Conecta tu repositorio Git y cada commit se compilará y desplegará automáticamente en una CDN global.
2. **APIs Serverless:** **Cloudflare Workers**. Escribe funciones mínimas en JavaScript o TypeScript que se ejecuten en el borde, con arranque instantáneo y un plan gratuito generoso.
3. **Bases de datos:** Opciones serverless como **Cloudflare D1** (SQL) o Neon (Postgres) se reducen a cero cuando no se usan, garantizando que nunca pagues por bases de datos inactivas.

## Despliegue con Cloudflare Pages

Desplegar una aplicación Qwik o React es tan simple como ejecutar:

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
      fr: `
En tant que vibecoder, votre objectif principal est de créer, d'itérer et de vous amuser. Vous voulez voir vos idées se concrétiser instantanément. La dernière chose que vous voulez est de passer trois jours à écrire des Dockerfiles ou à configurer des clusters Kubernetes complexes.

Voici un guide de l'hébergement cloud zero-DevOps.

## La stack Zero-DevOps moderne

En 2026, héberger votre projet demande très peu d'efforts. Voici les meilleurs choix pour l'exécution serverless :

1. **Frontends Statiques :** **Cloudflare Pages** ou Vercel. Connectez votre dépôt Git, et chaque commit est automatiquement déployé sur un CDN mondial.
2. **API Serverless :** **Cloudflare Workers**. Écrivez des fonctions JavaScript ou TypeScript minimales qui s'exécutent à la périphérie, sans démarrage à froid.
3. **Bases de données :** Des options serverless comme **Cloudflare D1** (SQL) ou Neon (Postgres) qui se mettent à l'échelle zéro lorsqu'elles ne sont pas utilisées.

## Comment démarrer avec Cloudflare Pages

Déployer une application Qwik ou React is simple :

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
      de: `
Als Vibecoder ist Ihr Hauptziel das Erstellen, Iterieren und Viben. Sie möchten, dass Ihre Ideen sofort Realität werden. Das Letzte, was Sie wollen, ist, drei Tage lang Dockerfiles zu schreiben, Netzwerk-Routing zu konfigurieren oder komplexe Kubernetes-Cluster einzurichten.

Hier ist ein Leitfaden für Zero-DevOps-Cloud-Hosting.

## Der moderne Zero-DevOps-Stack

Im Jahr 2026 erfordert das Hosten Ihres Projekts nur minimalen Aufwand. Hier sind die führenden Optionen für die serverlose Ausführung:

1. **Statische Frontends:** **Cloudflare Pages** oder Vercel. Verbinden Sie Ihr Git-Repository, und jeder Commit wird automatisch auf einem globalen CDN bereitgestellt.
2. **Serverlose APIs:** **Cloudflare Workers**. Schreiben Sie minimale JavaScript- oder TypeScript-Funktionen, die an der Edge ausgeführt werden – ohne Kaltstarts und mit einer großzügigen kostenlosen Stufe.
3. **Datenbanken:** Serverlose Optionen wie **Cloudflare D1** (SQL) oder Neon (Postgres) skalieren bei Nichtgebrauch auf null herunter. So zahlen Sie nie für ungenutzte Datenbankserver.

## Erste Schritte mit Cloudflare Pages

Die Bereitstellung einer Qwik- oder React-App ist so einfach wie die Ausführung von:

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
      it: `
Come vibecoder, il tuo obiettivo principale è creare, iterare e mantenere il flusso. Vuoi vedere le tue idee diventare realtà all'istante. L'ultima cosa che desideri è passare tre giorni a scrivere Dockerfile, configurare il routing di rete o impostare complessi cluster Kubernetes.

Ecco una guida all'hosting cloud zero-DevOps.

## Lo Stack Moderno Zero-DevOps

Nel 2026, ospitare il tuo progetto richiede pochissimo sforzo. Ecco le principali opzioni per l'esecuzione serverless:

1. **Frontend Statistici:** **Cloudflare Pages** o Vercel. Collega il tuo repository Git e ogni commit viene automaticamente compilato e distribuito su una CDN globale.
2. **API Serverless:** **Cloudflare Workers**. Scrivi funzioni minime in JavaScript o TypeScript da eseguire all'edge, con avvio istantaneo e un generoso piano gratuito.
3. **Database:** Opzioni serverless como **Cloudflare D1** (SQL) o Neon (Postgres) che si riducono a zero quando non vengono utilizzate, garantendo di non pagare mai per server inattivi.

## Come Iniziare con Cloudflare Pages

Distribuire un'app Qwik o React è semplice come eseguire:

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
      ja: `
バイブコーダーとしてのあなたの主な目標は、構築し、反復し、楽しむ（vibe）ことです。自分のアイデアが即座に現実になるのを見たいはずです。最も避けたいのは、Dockerfileの作成、ネットワークルーティングの設定、複雑なKubernetesクラスターのセットアップに3日間を費やすことです。

ここでは、Zero-DevOpsクラウドホスティングのガイドを紹介します。

## 現代のZero-DevOpsスタック

2026年、プロジェクトのホスティングにはほとんど手間がかかりません。以下は、サーバーレス実行の主な選択肢です。

1. **静的フロントエンド:** **Cloudflare Pages** または Vercel。Gitリポジトリを接続するだけで、コミットごとにグローバルCDNへ自動的にビルドおよびデプロイされます。
2. **サーバーレスAPI:** **Cloudflare Workers**。エッジで実行される最小限 JavaScript または TypeScript 関数を記述し、コールドスタートなしの実行と寛大な無料枠を提供します。
3. **データベース:** **Cloudflare D1** (SQL) や Neon (Postgres) などのサーバーレスオプションは、未使用時にはゼロにスケールダウンするため、アイドル状態のデータベースサーバーに料金を支払う必要はありません。

## Cloudflare Pagesの始め方

QwikまたはReactアプリのデプロイは、以下を実行するだけです。

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
      zh: `
作为一名 Vibecoder，您的主要目标是构建、迭代和保持流畅状态。您希望立即看到自己的想法变成现实。您最不想做的就是花三天时间编写 Dockerfile、配置网络路由或设置复杂的 Kubernetes 集群。

以下是零运维（Zero-DevOps）云托管指南。

## 现代零运维技术栈

在 2026 年，托管您的项目几乎不需要任何努力。以下是无服务器执行的领先选择：

1. **静态前端：** **Cloudflare Pages** 或 Vercel。连接您的 Git 仓库，每次提交都会自动构建并部署到全球 CDN。
2. **无服务器 API：** **Cloudflare Workers**。编写在边缘执行的极简 JavaScript 或 TypeScript 函数，提供零冷启动执行和慷慨的免费额度。
3. **数据库：** 像 **Cloudflare D1** (SQL) 或 Neon (Postgres) 这样的无服务器选项在不使用时会自动缩减为零，确保您绝不会为闲置的 database 服务器付费。

## 如何使用 Cloudflare Pages 入门

部署 Qwik 或 React 应用程序非常简单，只需运行：

\`\`\`bash
npm run build
npx wrangler pages deploy dist
\`\`\`
`,
    },
  },
  {
    slug: 'vm-orchestration-guide',
    subjects: ['virtual-machines', 'advanced', 'infrastructure'],
    titles: {
      en: 'Demystifying Virtual Machines for AI Developers',
      pt: 'Desmistificando Máquinas Virtuais para Desenvolvedores de IA',
      es: 'Desmitificando maquinas virtuales para desarrolladores de IA',
      fr: "Démystifier les Machines Virtuelles pour les Développeurs d'IA",
      de: 'Virtuelle Maschinen für KI-Entwickler entmystifizieren',
      it: 'Demistificare le Macchine Virtuali per gli Sviluppatori AI',
      ja: 'AI開発者のための仮想マシン入門',
      zh: '为 AI 开发者揭秘虚拟机',
    },
    markdowns: {
      en: `
While serverless edge platforms are perfect for lightweight APIs and static frontends, heavy workloads — such as training models, running database servers, or executing complex AI agent loops — require dedicated computation resources. This is where Virtual Machines (VMs) are crucial.

## Why Use VMs Instead of Serverless?

Serverless functions have strict execution limits (often 10-15 minutes max) and resource caps. A Virtual Machine provides:
- **Persistent State:** File systems that persist across restarts.
- **Dedicated Hardware:** Guaranteed CPU cores, large RAM allocations, and GPU attachments.
- **Custom Environments:** Install system-level dependencies, custom kernels, and run background processes indefinitely.

## Key Considerations for AI Workloads

1. **GPU Acceleration:** When running inference (e.g., vLLM or Ollama), verify the VM has attached NVIDIA or similar Tensor-core GPUs.
2. **Spot Instances:** To reduce costs by up to 80%, use spot or preemptible instances for fault-tolerant tasks.
3. **Infrastructure as Code (IaC):** Use tools like Terraform or Ansible to define your VM setups, ensuring you can replicate your inference environments instantly.

Understanding how to size, configure, and automate virtual machines allows AI developers to scale their background computation safely and cost-effectively.
`,
      pt: `
Embora plataformas serverless na borda sejam ideais para APIs leves e frontends estáticos, cargas de trabalho pesadas — como treinamento de modelos, execução de servidores de banco de dados ou execução de loops de agentes de IA complexos — requerem recursos computacionais dedicados. É aqui que as Máquinas Virtuais (VMs) entram em jogo.

## Por que Usar VMs em vez de Serverless?

As funções serverless têm limites estritos de tempo de execução (geralmente 10-15 minutos no máximo) e de recursos. Uma Máquina Virtual oferece:
- **Estado Persistente:** Sistemas de arquivos que persistem entre reinicializações.
- **Hardware Dedicado:** Núcleos de CPU garantidos, grande alocação de RAM e GPUs dedicadas.
- **Ambientes Personalizados:** Instale dependências no nível do sistema, kernels customizados e rode processos em segundo plano por tempo indeterminado.

## Considerações Importantes para IA

1. **Aceleração por GPU:** Ao rodar inferência (como vLLM ou Ollama), certifique-se de que a VM possui GPUs NVIDIA ou equivalentes.
2. **Instâncias Spot:** Para reduzir custos em até 80%, use instâncias spot ou preemptivas para tarefas tolerantes a falhas.
3. **Infraestrutura como Código (IaC):** Use ferramentas como Terraform ou Ansible para definir a configuração da sua VM, permitindo replicar seu ambiente instantaneamente.

Compreender como dimensionar, configure e automatizar máquinas virtuais permite que desenvolvedores de IA escalem seu processamento em segundo plano com segurança e eficiência de custos.
`,
      es: `
Aunque las plataformas serverless son ideales para APIs sencillas y frontends estáticos, las tareas pesadas (como el entrenamiento de modelos, bases de datos o bucles complejos de agentes de IA) requieren recursos informáticos dedicados. Aquí es donde las Máquinas Virtuales (VMs) resultan fundamentales.

## ¿Por qué usar VMs en lugar de Serverless?

Las funciones serverless tienen límites estrictos de ejecución (generalmente un máximo de 10 a 15 minutos) y restricciones de recursos. Una máquina virtual ofrece:
- **Estado persistente:** Sistemas de archivos que persisten tras los reinicios.
- **Hardware dedicado:** Núcleos de CPU garantizados, gran asignación de memoria RAM y GPUs dedicadas.
- **Entornos personalizados:** Permite instalar dependencias a nivel de sistema, kernels personalizados y ejecutar procesos en segundo plano de forma indefinida.

## Consideraciones clave para cargas de trabajo de IA

1. **Aceleración por GPU:** Al realizar inferencia (por ejemplo, con vLLM u Ollama), asegúrate de que la VM tenga GPUs NVIDIA o equivalentes acopladas.
2. **Instancias Spot:** Para reducir costos hasta en un 80%, utiliza instancias spot o interrumpibles para tareas tolerantes a fallos.
3. **Infraestructura como Código (IaC):** Utiliza herramientas como Terraform o Ansible para definir tus entornos de VM, facilitando su replicación al instante.
`,
      fr: `
Si les plateformes serverless edge sont parfaites pour les API légères, les charges de travail lourdes — comme l'entraînement de modèles, le fonctionnement de serveurs de bases de données ou les boucles d'agents complexes — exigent des ressources dédiées. C'est là que les machines virtuelles (VM) interviennent.

## Pourquoi utiliser des VM plutôt que du Serverless ?

Les fonctions serverless ont des limites d'exécution strictes (souvent 10-15 minutes max). Une machine virtuelle offre :
- **État persistant :** Des systèmes de fichiers qui durent après un redémarrage.
- **Matériel dédié :** Cœurs de processeur garantis, mémoire vive conséquente et puces GPU.
- **Environnements sur mesure :** Possibilité d'installer des dépendances système et de lancer des processus en tâche de fond.

## Points clés pour les calculs d'IA

1. **Accélération GPU :** Lors de l'inférence (ex: vLLM ou Ollama), vérifiez que la VM dispose de GPU NVIDIA.
2. **Instances Spot :** Pour réduire les coûts jusqu'à 80 %, utilisez des instances spot pour les tâches tolérantes aux pannes.
3. **Infrastructure as Code (IaC) :** Utilisez Terraform ou Ansible pour automatiser la création de vos VM.
`,
      de: `
Während serverlose Edge-Plattformen perfekt für schlanke APIs und statische Frontends sind, erfordern rechenintensive Workloads – wie das Trainieren von Modellen, das Betreiben von Datenbankservern oder die Ausführung komplexer KI-Agenten-Schleifen – dedizierte Rechenressourcen. Hier sind virtuelle Maschinen (VMs) unverzichtbar.

## Warum VMs statt Serverless verwenden?

Serverlose Funktionen haben strenge Ausführungszeitlimits (oft maximal 10–15 Minuten) und Ressourcenbeschränkungen. Eine virtuelle Maschine bietet:
- **Persistenter Zustand:** Dateisysteme, die über Neustarts hinweg erhalten bleiben.
- **Dedizierte Hardware:** Garantierte CPU-Kerne, große RAM-Zuweisungen und GPU-Erweiterungen.
- **Eigene Umgebungen:** Installieren Sie Abhängigkeiten auf Systemebene, benutzerdefinierte Kernel und führen Sie Hintergrundprozesse unbegrenzt aus.

## Wichtige Aspekte für KI-Workloads

1. **GPU-Beschleunigung:** Stellen Sie bei der Ausführung von Inferenzen (z. B. vLLM oder Ollama) sicher, dass die VM über NVIDIA- oder ähnliche Tensor-Core-GPUs verfügt.
2. **Spot-Instanzen:** Um die Kosten um bis zu 80 % zu senken, nutzen Sie Spot- oder preemptible Instanzen für fehlertolerante Aufgaben.
3. **Infrastructure as Code (IaC):** Verwenden Sie Tools wie Terraform oder Ansible, um Ihre VM-Setups zu definieren und Ihre Inferenzumgebungen sofort zu replizieren.
`,
      it: `
Sebbene le piattaforme serverless all'edge siano ideali per API leggere e frontend statici, i carichi di lavoro intensivi (como l'addestramento di modelli, l'esecuzione di database o cicli di agenti AI complessi) richiedono risorse di calcolo dedicate. È qui che entrano in gioco le Macchine Virtuali (VM).

## Perché usare le VM invece di Serverless?

Le funzioni serverless hanno limiti di tempo di esecuzione molto rigidi (spesso al massimo 10-15 minuti) e vincoli di risorse. Una macchina virtuale offre:
- **Stato Persistente:** File system che permangono anche dopo i riavvii.
- **Hardware Dedicato:** Core CPU garantiti, grandi quantità di RAM e GPU dedicate.
- **Ambienti Personalizzati:** Installa dipendenze a livello di sistema, kernel personalizzati ed esegui processi in background a tempo indeterminato.

## Considerazioni chiave per i carichi di lavoro AI

1. **Accelerazione GPU:** Quando si esegue l'inferenza (ad esempio, con vLLM o Ollama), verifica che la VM abbia GPU NVIDIA o equivalenti integrate.
2. **Istanze Spot:** Per ridurre i costi fino all'80%, utilizza istanze spot o preemptible per attività tolleranti ai guasti.
3. **Infrastructure as Code (IaC):** Utilizza strumenti come Terraform o Ansible per definire le configurazioni delle VM, facilitando la replica degli ambienti.
`,
      ja: `
サーバーレスエッジプラットフォームは軽量なAPIや静的フロントエンドには最適ですが、モデルのトレーニング、データベースサーバーの稼働、複雑なAIエージェントのループ実行などの重いワークロードには、専用の計算リソースが必要です。ここで仮想マシン（VM）が不可欠となります。

## なぜサーバーレスではなくVMを使用するのか？

サーバーレス関数には厳密な実行制限（通常は最大10〜15分）とリソースの上限があります。仮想マシンは以下を提供します。
- **永続的な状態:** 再起動しても維持されるファイルシステム。
- **専用ハードウェア:** 保証されたCPUコア、大容量メモリ、およびGPUの追加。
- **カスタム環境:** システムレベルの依存関係のインストール、カスタムカーネル、およびバックグラウンドプロセスの無期限実行。

## AIワークロードにおける主な考慮事項

1. **GPUアクセラレーション:** 推論を実行する際（vLLMやOllamaなど）、VMにNVIDIAなどのTensorコアGPUが搭載されていることを確認します。
2. **スポットインスタンス:** コストを最大80%削減するために、フォールトトレラントなタスクにはスポットインスタンスやプリエンプティブルインスタンスを使用します。
3. **Infrastructure as Code (IaC):** TerraformやAnsibleなどのツールを使用してVMセットアップを定義し、推論環境を即座に複製できるようにします。
`,
      zh: `
虽然无服务器边缘平台非常适合轻量级 API 和静态前端，但繁重的工作负载（例如训练模型、运行数据库服务器或执行复杂的 AI 代理循环）需要专用的计算资源。这就是虚拟机 (VM) 的关键所在。

## 为什么使用虚拟机而不是无服务器？

无服务器函数具有严格的执行限制（通常最长 10-15 分钟）和资源上限。虚拟机提供：
- **持久状态：** 重启后依然存在的物理文件系统。
- **专用硬件：** 保证的 CPU 核心、大容量内存分配和 GPU 连接。
- **自定义环境：** 安装系统级依赖项、自定义内核并无限期运行后台进程。

## AI 工作负载的关键考虑因素

1. **GPU 加速：** 运行推理（例如 vLLM 或 Ollama）时，验证虚拟机是否连接了 NVIDIA 或类似的 Tensor 核心 GPU。
2. **竞价实例 (Spot Instances)：** 为了降低高达 80% 的成本，对具有容错能力的任务使用竞价实例或抢占式实例。
3. **基础设施即代码 (IaC)：** 使用 Terraform 或 Ansible 等工具定义您的虚拟机设置，确保您可以立即复制推理环境。
`,
    },
  },
]

function getCanvasYamlForSlug(slug: string): string {
  switch (slug) {
    case 'what-are-ai-agents':
      return `canvas:
  tone: warm-gray
  layout: neural-branch
  nodes:
    - id: hero
      section: Overview
      type: hero
    - id: brain
      section: The Brain
      type: card
    - id: planning
      section: Planning
      type: card
    - id: memory
      section: Memory
      type: card
    - id: tools
      section: Tools
      type: card
    - id: impact
      section: 2026 Impact
      type: card
    - id: conclusion
      section: Conclusion
      type: card
  connectors:
    - from: hero
      to: brain
    - from: brain
      to: planning
    - from: brain
      to: memory
    - from: brain
      to: tools
    - from: tools
      to: impact
    - from: impact
      to: conclusion`
    case 'building-ai-agents':
      return `canvas:
  tone: warm-gray
  layout: timeline-spiral
  nodes:
    - id: hero
      section: Tutorial
      type: hero
    - id: setup
      section: Project Setup
      type: card
    - id: agent-logic
      section: Agent Logic
      type: card
    - id: run
      section: Running Agent
      type: grid
    - id: production
      section: Production
      type: card
    - id: next-steps
      section: Next Steps
      type: card
  connectors:
    - from: hero
      to: setup
    - from: setup
      to: agent-logic
    - from: agent-logic
      to: run
    - from: run
      to: production
    - from: production
      to: next-steps`
    case 'llm-comparison-frontier':
      return `canvas:
  tone: parchment
  layout: editorial-collage
  nodes:
    - id: hero
      section: Comparison
      type: hero
    - id: benchmark
      section: Benchmarks
      type: grid
    - id: gpt4o
      section: GPT-4o
      type: card
    - id: claude4
      section: Claude 4
      type: card
    - id: gemini25
      section: Gemini 2.5
      type: card
    - id: verdict
      section: The Verdict
      type: card
  connectors:
    - from: hero
      to: benchmark
    - from: benchmark
      to: gpt4o
    - from: benchmark
      to: claude4
    - from: benchmark
      to: gemini25
    - from: gpt4o
      to: verdict
    - from: claude4
      to: verdict
    - from: gemini25
      to: verdict`
    case 'evaluating-llms':
      return `canvas:
  tone: parchment
  layout: constellation
  nodes:
    - id: hero
      section: Evaluation
      type: hero
    - id: benchmarks
      section: Benchmarks
      type: card
    - id: human-eval
      section: Human Feedback
      type: card
    - id: automated
      section: Auto Tests
      type: grid
    - id: framework
      section: Framework
      type: card
    - id: conclusion
      section: Conclusion
      type: card
  connectors:
    - from: hero
      to: benchmarks
    - from: benchmarks
      to: human-eval
    - from: benchmarks
      to: automated
    - from: human-eval
      to: framework
    - from: automated
      to: framework
    - from: framework
      to: conclusion`
    case 'cloud-hosting-vibecoders':
      return `canvas:
  tone: warm-gray
  layout: editorial-collage
  nodes:
    - id: hero
      section: Cloud Hosting
      type: hero
    - id: zero-devops
      section: Zero DevOps
      type: card
    - id: providers
      section: Providers
      type: grid
    - id: scaling
      section: Auto Scaling
      type: card
    - id: pricing
      section: Pricing
      type: card
    - id: conclusion
      section: Conclusion
      type: card
  connectors:
    - from: hero
      to: zero-devops
    - from: zero-devops
      to: providers
    - from: providers
      to: scaling
    - from: providers
      to: pricing
    - from: scaling
      to: conclusion
    - from: pricing
      to: conclusion`
    case 'vm-orchestration-guide':
      return `canvas:
  tone: obsidian
  layout: neural-branch
  nodes:
    - id: hero
      section: VM Guide
      type: hero
    - id: hypervisor
      section: Hypervisor
      type: card
    - id: orchestrator
      section: Orchestration
      type: grid
    - id: storage
      section: Storage
      type: card
    - id: network
      section: Network
      type: card
    - id: monitoring
      section: Monitoring
      type: card
    - id: conclusion
      section: Conclusion
      type: card
  connectors:
    - from: hero
      to: hypervisor
    - from: hypervisor
      to: orchestrator
    - from: orchestrator
      to: storage
    - from: orchestrator
      to: network
    - from: orchestrator
      to: monitoring
    - from: storage
      to: conclusion
    - from: network
      to: conclusion
    - from: monitoring
      to: conclusion`
    default:
      return ''
  }
}

async function runShell(cmd: string, args: string[], cwd?: string): Promise<void> {
  const label = `${cmd} ${args.join(' ')}`
  console.log(`\n🔧 Running: ${label}`)
  const proc = Bun.spawn([cmd, ...args], {
    cwd: cwd || process.cwd(),
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const exitCode = await proc.exited
  if (exitCode !== 0) {
    throw new Error(`Command failed (exit ${exitCode}): ${label}`)
  }
}

async function run() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  📝 Phase 1/5: Generating index and article stubs')
  console.log('═══════════════════════════════════════════════════════')

  // 1. Create _index.md files for all niches and locales
  for (const [niche, data] of Object.entries(NICHES_INDEX_DATA)) {
    for (const lang of LOCALES) {
      const dir = join(CONTENT_ROOT, niche, lang)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const filePath = join(dir, '_index.md')
      const title = data.titles[lang] || data.titles.en
      const subtitle = data.subtitles[lang] || data.subtitles.en
      const body = data.bodies[lang] || data.bodies.en

      const content = `---
type: "index"
slug: "_index"
lang: "${lang}"
title: "${title}"
subjects: ["${data.subject}"]
referral_links: []
verdict: "trusted"
quality_score: 100
metadata:
  created_at: "2026-06-08T23:55:00.000Z"
  updated_at: "2026-06-08T23:55:00.000Z"
---

# ${title}

${subtitle}

${body}
`

      writeFileSync(filePath, content, 'utf-8')
      console.log(`  ✅ ${filePath}`)
    }
  }

  // 2. Create article files for all niches and locales
  for (const article of ARTICLES) {
    const parentNiche = article.subjects[0] // e.g. ai-agents, llm-comparison
    if (!parentNiche) continue

    for (const lang of LOCALES) {
      const dir = join(CONTENT_ROOT, parentNiche, lang)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const filePath = join(dir, `${article.slug}.md`)
      const title = article.titles[lang] || article.titles.en
      const body = article.markdowns[lang] || article.markdowns.en
      const canvasBlock = getCanvasYamlForSlug(article.slug)

      const content = `---
slug: ${article.slug}
lang: ${lang}
title: "${title}"
verdict: trusted
quality_score: 95
subjects:
${article.subjects.map(s => `  - ${s}`).join('\n')}
referral_links: []
metadata:
  created_at: "2026-06-08T23:55:00.000Z"
  updated_at: "2026-06-08T23:55:00.000Z"
  author: UniTeia System
  version: 1
${canvasBlock ? `${canvasBlock.trim()}\n` : ''}---
# ${title}

${body.trim()}
`

      writeFileSync(filePath, content, 'utf-8')
      console.log(`  ✅ ${filePath}`)
    }
  }

  console.log('\n✅ Phase 1 complete: All markdown files generated.')

  // ─── Phase 2: Collage generation via mega-factory ─────────────
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  🎨 Phase 2/5: Generating collage assets (mega-factory)')
  console.log('═══════════════════════════════════════════════════════')

  const megaFactoryRoot = join(process.cwd(), '..', 'uniteia-mega-factory')
  if (existsSync(megaFactoryRoot)) {
    try {
      await runShell('bun', ['run', 'scripts/generate-all-collages.ts'], megaFactoryRoot)
      console.log('\n✅ Phase 2 complete: Collage assets generated.')
    } catch (err) {
      console.error(`\n❌ Phase 2 FAILED: ${err instanceof Error ? err.message : err}`)
      console.error('   Continuing with remaining phases — review collage artifacts.')
    }
  } else {
    console.warn('⚠️  uniteia-mega-factory not found — skipping collage generation.')
  }

  // ─── Phase 3: Content registry + graph compilation ────────────
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  🧠 Phase 3/5: Compiling content registry & graph')
  console.log('═══════════════════════════════════════════════════════')

  await runShell('bun', ['run', 'scripts/generate-content-registry.ts'])
  await runShell('bun', ['run', 'scripts/generate-content-graph.ts'])

  console.log('\n✅ Phase 3 complete: Content graph compiled.')

  // ─── Phase 4: Verification ────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  🔍 Phase 4/5: Verifying content graph')
  console.log('═══════════════════════════════════════════════════════')

  await runShell('bun', ['run', 'scripts/verify-content-graph.ts'])

  console.log('\n✅ Phase 4 complete: Content graph verified.')

  // ─── Phase 5: Git tracking ────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  📦 Phase 5/5: Tracking generated files in git')
  console.log('═══════════════════════════════════════════════════════')

  try {
    await runShell('git', ['add', 'content/'])
    await runShell('git', ['add', 'src/content-registry.generated.ts'])
    await runShell('git', ['add', 'src/content-graph.generated.ts'])
    console.log('\n✅ Phase 5 complete: All generated files tracked.')
  } catch {
    console.warn('⚠️  Git add failed (non-critical) — files may already be tracked.')
  }

  // ─── Summary ──────────────────────────────────────────────────
  console.log('\n╔═══════════════════════════════════════════════════════╗')
  console.log('║  🚀 PIPELINE COMPLETE — All content generated!       ║')
  console.log('║                                                       ║')
  console.log(
    `║  📄 Niches: ${Object.keys(NICHES_INDEX_DATA).length}                                         ║`
  )
  console.log(
    `║  📝 Articles: ${ARTICLES.length} × ${LOCALES.length} locales = ${ARTICLES.length * LOCALES.length} files             ║`
  )
  console.log(`║  🌐 Locales: ${LOCALES.join(', ')}  ║`)
  console.log('╚═══════════════════════════════════════════════════════╝')
}

run().catch(err => {
  console.error('\n❌ Pipeline failed:', err.message)
  process.exit(1)
})
