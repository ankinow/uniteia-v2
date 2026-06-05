import type { TranslationStrings } from './types'

export const pt: TranslationStrings = {
  nav: {
    home: 'Início',
    about: 'Sobre',
    blog: 'Blog',
    projects: 'Projetos',
    contact: 'Contato',
    topics: 'Tópicos',
    search: 'Buscar',
    niches: 'Nichos',
    breadcrumb: {
      label: 'Você está aqui:',
      signals: 'Insights',
    },
  },
  sidebar: {
    interfaceLabel: 'Interface Compacta',
  },
  footer: {
    copyright: '© {year} UniTeia. Todos os direitos reservados.',
    madeWith: 'Feito com ♥ para IA descentralizada',
    links: {
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      source: 'Código Fonte',
    },
  },
  langSwitcher: {
    label: 'Idioma',
    current: 'Idioma atual: {lang}',
    available: 'Idiomas disponíveis',
  },
  errorPages: {
    '404': {
      title: 'Página Não Encontrada',
      message: 'A página que você está procurando não existe ou foi movida.',
      backHome: 'Voltar ao Início',
    },
    '500': {
      title: 'Erro do Servidor',
      message: 'Algo deu errado do nosso lado. Por favor, tente novamente mais tarde.',
      retry: 'Tentar Novamente',
    },
  },
  fallbackBanner: {
    message: 'Este conteúdo não está disponível no seu idioma. Exibindo em inglês.',
    dismiss: 'Dispensar',
  },
  article: {
    subjectsLabel: 'Assuntos',
    sourcesLabel: 'Fontes',
    published: 'Publicado',
    updated: 'Atualizado',
    byAuthor: 'por {author}',
    version: 'v{version}',
    readInLang: 'Ler em {lang}',
    magica: {
      insight: {
        title: 'Magica: O Centro de Comando de IA',
        body: 'Magica unifica engenharia de prompt, roteamento de modelos e avaliação em uma única interface.',
      },
      evidence: {
        title: 'Visualização de Fluxo de Trabalho',
        alt: 'Captura de tela do construtor de fluxo de trabalho da Magica',
      },
      architecture: {
        title: 'Arquitetura',
        point1: 'Encadeamento de prompts baseado em nós',
        point2: 'Roteamento de fallback multi-modelo',
        point3: 'Telemetria de latência em tempo real',
      },
      cta: {
        title: 'Comece a Construir',
        body: 'Experimente Magica gratuitamente — sem cartão de crédito.',
        button: 'Visitar Magica',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Construtor de Fluxo de Trabalho Magica',
      unifiedPromptEngineering:
        'Engenharia de prompts, roteamento de modelos e avaliação unificados em uma interface',
      magicaCommandCenter: 'Magica: O Centro de Comando de IA',
      magicaDescription:
        'Magica unifica engenharia de prompts, roteamento de modelos e avaliação em uma interface',
      aiProcessing: 'Processamento de IA',
      nodeBasedPromptChaining: 'Encadeamento de prompts baseado em nós',
      architecture: 'Arquitetura',
      multiModelFallback: 'Roteamento fallback multi-modelo',
      startBuilding: 'Comece a Construir',
      tryMagicaFree: 'Experimente Magica gratuitamente — sem cartão de crédito',
      visitMagica: 'Visitar Magica',
      qualityScore: 'Pontuação de Qualidade',
      languages: 'Idiomas',
      workflowVisualization: 'Visualização do Fluxo de Trabalho',
      keyMetrics: 'Métricas Principais',
      workflowSteps: 'Etapas do Fluxo',
      poweredBy: 'Desenvolvido por',
    },
    canvaMagica: {
      workflowTitle: 'Construtor de Fluxo de Trabalho Magica',
      inputLabel: 'ENTRADA',
      aiProcessing: {
        title: 'PROCESSAMENTO DE IA',
        subtitle: 'Encadeamento de prompts baseado em nós',
      },
      qualityScore: '84 de pontuação de qualidade',
      languages: '8 idiomas',
      outputLabel: 'Prompt → Roteador de Modelos → Saída',
    },
  },
  niche: {
    topicsLabel: 'Tópicos',
    exploreNiche: 'Explorar {niche}',
    articleCount: '{count} artigos',
    allNiches: 'Todos os Tópicos',
  },
  editorial: {
    verdictLabel: 'Veredito',
    trusted: 'Confiável',
    caution: 'Cautela',
    qualityScore: 'Pontuação de Qualidade',
    flagged: 'Sinalizado',
    editorialQuality: 'Qualidade Editorial',
  },
  dopamineCard: {
    readMore: 'Leia mais',
  },
  signal: {
    qualityLabel: 'Qualidade',
    sourceCount: '{count} fontes',
    sources: 'fontes',
    freshnessLabel: 'Atualizado',
  },
  search: {
    placeholder: 'Buscar temas, artigos...',
    resultsFor: 'Resultados para "{query}"',
    noResults: 'Nenhum resultado encontrado',
    noResultsHint: 'Tente palavras-chave diferentes ou navegue pelos temas',
    resultCount: '{count} resultados',
    searchTitle: 'Buscar',
    searchDescription: 'Buscar artigos e temas na UniTeia',
  },
  seo: {
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'Tópicos de IA',
    topicsDescription: 'Explore nossa curadoria de tópicos e nichos de Inteligência Artificial.',
  },
  homepage: {
    featuredSignals: 'Insights em Destaque',
    knowledgeClusters: 'Clusters',
    frontierStreams: 'Fronteira',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'curados em {count} nichos',
    curatedAcrossOne: 'curado em 1 nicho',
    noSignals: 'Nenhum insight publicado ainda neste idioma.',
    browseTopics: 'Explorar tópicos',
    networkState: 'Estado da Rede UniTeia',
    signalIntake: 'Captação de Insights',
    deliveryLayer: 'Camada de Entrega',
  },
  onboarding: {
    step1: {
      title: 'O mundo é barulhento.',
      subtitle: 'Nós filtramos o insight.',
      desc: '{siteName} ingere milhares de fontes diariamente, extraindo o que importa. Para que você não precise.',
    },
    step2: {
      title: 'Cada insight passa por 7 filtros de qualidade antes de chegar até você.',
      cards: [
        { label: 'Pesquisa', desc: 'Fontes brutas são ingeridas e pontuadas quanto à confiança.' },
        {
          label: 'Verificação',
          desc: 'Alegações são verificadas cruzadamente contra fontes independentes.',
        },
        {
          label: 'Estruturação',
          desc: 'Conteúdo é formatado, localizado e preparado para entrega.',
        },
      ],
    },
    step3: {
      title: 'Disponível em 8 idiomas.',
      desc: 'Apenas o que importa. Entregue no seu idioma, nos seus termos.',
      badge: '8 vozes',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Ocioso',
      thinking: 'Aether OS · Pensando',
      processing: 'Aether OS · Processando',
      complete: 'Aether OS · Concluído',
      error: 'Aether OS · Erro',
    },
    mcpTooltip: 'Servidor MCP Conectado · 7 ferramentas ativas',
  },
  generativeHero: {
    curating: '{niche} hoje',
    topNiches: 'Principais Nichos',
    apexBadge: 'APEX · Ao Vivo',
    headline: 'Sinais de fronteira de {count} canais',
    tracksLabel: 'canais ativos',
    tracksLabelOne: 'canal ativo',
  },
  legal: {
    privacy: {
      title: 'Política de Privacidade',
      body: 'Política de Privacidade. Sua privacidade é importante para nós. Coletamos e processamos apenas os dados mínimos necessários para fornecer o serviço de curadoria UniTeia. Não vendemos seus dados a terceiros. Esta política descreve nossas práticas de coleta, armazenamento e processamento de dados.',
    },
    terms: {
      title: 'Termos de Serviço',
      body: 'Termos de Serviço. Ao usar UniTeia, você concorda com estes termos. O conteúdo fornecido é apenas para fins informativos e não constitui aconselhamento profissional. Reservamo-nos o direito de modificar estes termos a qualquer momento.',
    },
  },
  sketchnote: {
    template01: {
      title: 'Template 01 — Explicador Visual Prático',
      subtitle: 'Explique conceitos rápido com lógica visual',
      postIt: 'Sketchnotes + Código + Clareza = Aprendizado mais rápido',
      mascotBubble: 'Vamos tornar isso visual.',
      steps: {
        hook: {
          kind: 'Gancho',
          title: 'MCP para devs',
          body: 'Conecte agentes de IA a qualquer ferramenta. Com segurança. Confiável. Extensível.',
        },
        mistake: {
          kind: 'Erro comum',
          title: 'Achar que MCP é só mais uma API.',
          body: 'APIs expõem funções. MCP vai além.',
          postIt: 'APIs expõem funções. MCP orquestra capacidades para agentes.',
        },
        analogy: {
          kind: 'Analogia visual',
          title: 'MCP é o hub que conecta agentes a ferramentas.',
          body: 'Um protocolo. Muitas ferramentas. O agente segue focado.',
          items: ['Busca', 'Banco de dados', 'Arquivos', 'APIs'],
          agentLabel: 'Agente de IA',
        },
        diagram: {
          kind: 'Diagrama funcional',
          title: 'Como o MCP funciona de ponta a ponta',
          body: 'Encontra receita do Q1\nEntende e planeja\nRoteia, autentica, contexto, segurança\nExecuta o trabalho real\nResposta estruturada',
          flow: ['Usuário', 'Agente de IA', 'Servidor MCP', 'Ferramentas', 'Resposta'],
        },
        example: {
          kind: 'Exemplo prático',
          title: 'Exemplo: chamada de ferramenta via MCP',
          body: 'O agente pede via MCP. O servidor encontra a ferramenta certa e executa.',
          caption: 'Requisição JSON-RPC',
        },
        use: {
          kind: 'Quando usar',
          title: 'Use MCP quando…',
          useHeader: 'Use MCP quando',
          useItems: [
            'Você tem várias ferramentas ou fontes de dados',
            'Precisa de acesso seguro e governado',
            'Quer agentes agindo com contexto e segurança',
            'Vai escalar ferramentas ou times',
          ],
          dontHeader: 'Não use MCP quando',
          dontItems: [
            'Você só chama uma API simples',
            'Não precisa de orquestração de agentes',
            'Quer uma integração leve no front-end',
            'Está só expondo um endpoint público',
          ],
        },
        pitfalls: {
          kind: 'Armadilhas comuns',
          title: 'Evite estas armadilhas:',
          items: [
            'Expor ferramentas sem autenticação e guardrails adequados',
            'Sobrecarregar o agente com ferramentas demais.',
            'Ignorar contexto, logs e observabilidade.',
          ],
          tipHeader: 'Pense em segurança, clareza e observabilidade.',
          tip: 'Planeje a superfície de ferramentas antes de conectar qualquer coisa.',
        },
        nextStep: {
          kind: 'Próximo passo',
          title: 'Seu próximo passo:',
          items: [
            'Escolha uma ferramenta real para conectar',
            'Desenhe o schema da ferramenta',
            'Implemente o endpoint MCP',
            'Adicione autenticação e permissões',
            'Teste com seu agente',
            'Adicione logs e monitoramento',
            'Documente para o time',
          ],
          closingNote: 'Comece pequeno. Entregue uma capacidade. Itere.',
        },
      },
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo do dev',
        practicalByDesign: 'Prático por design',
      },
      level: 'Do iniciante ao intermediário',
      footer: 'Feito para quem aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Receita de Código / Mini Build',
      subtitle: 'Ensine implementação prática, rápido.',
      postIt: 'Sketchnotes + Código + Clareza + Aprendizado mais rápido',
      mascotBubble: 'Vamos construir.',
      steps: {
        result: {
          kind: 'Resultado',
          title: 'Resultado final',
          body: 'Desenho ao vivo com Canvas',
          caption: 'Tinta suave em tempo real',
        },
        install: {
          kind: 'Instalação',
          title: 'Adicione o motor freehand mágico.',
          body: 'Um pacote, zero configuração.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Código',
          title: 'Código mínimo',
          body: 'Capture pontos, gere um traço suave.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Como funciona',
          title: 'Da entrada à tinta bonita.',
          body: 'Cada evento de pointer vira um traço.',
          flow: ['Mouse/Touch', 'Pontos', 'Spline (Suave)', 'Canvas (Desenho)'],
          caption: 'Cada evento de pointer vira um traço.',
        },
        upgrade: {
          kind: 'Ideias de upgrade',
          title: 'Torne útil. Torne seu.',
          body: 'Três vitórias rápidas para ir além.',
          items: [
            {
              name: 'Salvar & Reabrir',
              desc: 'Guarde o desenho como JSON. Carregue de volta quando quiser.',
            },
            {
              name: 'Desfazer / Refazer',
              desc: 'Mantenha uma pilha de traços para histórico sem fricção.',
            },
            { name: 'Exportar Imagem', desc: 'Exporte o canvas como PNG.' },
          ],
          caption: 'Três vitórias rápidas.',
        },
      },
      cta: 'Da ideia à implementação',
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo do dev',
        practicalByDesign: 'Prático por design',
      },
      footer: 'Feito para quem aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Mapa de Decisão / Comparativo Visual',
      subtitle: 'Compare opções e decida rápido',
      postIt: 'Sketchnotes + Código + Clareza + Aprendizado mais rápido',
      mascotBubble: 'Escolha a melhor ferramenta com lógica.',
      panels: {
        question: {
          kind: 'Pergunta',
          title: 'Qual quadro branco você deve usar?',
          subtitle: '4 ótimas opções. Forças diferentes.',
          tipTitle: 'Dica pro',
          tip: 'Não existe "melhor" — existe o melhor para o seu caso.',
        },
        options: {
          kind: 'Opções',
          title: 'Mapa de opções',
          options: [
            { name: 'tldraw desktop', desc: 'App pronto. Experiência completa. Integrado.' },
            { name: 'tldraw SDK', desc: 'Embarque no seu app. Controle total. Sua UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-leve. Ótima performance. Canvas infinito.',
            },
            { name: 'Excalidraw', desc: 'Estética simples. Open source. Rápido de entregar.' },
          ],
        },
        decision: {
          kind: 'Decisão',
          title: 'Lógica de decisão',
          subtitle: 'Responda sim/não, siga o primeiro match.',
          rules: [
            { question: 'Quer um app pronto para usar?', yesTo: 'tldraw desktop' },
            { question: 'Quer embarcar o quadro no seu próprio app?', yesTo: 'tldraw SDK' },
            {
              question: 'Precisa do mais leve com melhor performance?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Quer visual simples, limpo e open source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Responda de cima para baixo. Pegue o primeiro "Sim".',
        },
        summary: {
          kind: 'Resumo',
          title: 'Resumo de recomendação',
          options: [
            {
              name: 'tldraw desktop',
              verdict:
                'Melhor quando você quer um app de quadro branco completo, pronto para usar.',
            },
            {
              name: 'tldraw SDK',
              verdict: 'Melhor quando você quer embarcar e customizar o quadro no seu produto.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Melhor quando você precisa de máxima performance e bundle mínimo.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Melhor quando você quer simplicidade, open source e uma experiência de desenho limpa.',
            },
          ],
          closingNote: 'Escolha a ferramenta que cabe nas suas restrições, time e metas de UX.',
        },
      },
      cta: 'Comparação rápida para builders',
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo do dev',
        practicalByDesign: 'Prático por design',
      },
      footer: 'Feito para quem aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
  },
  canva: {
    hero: {
      title: 'O sinal em que dá pra construir',
      subtitle: 'Seis cenas, uma decisão',
      cta: 'Abrir o canvas',
    },
    concept: {
      central: 'Por que isso importa agora',
      satellite: { '1': 'Decisões mais rápidas', '2': 'Sinal mais nítido' },
    },
    code: {
      step: {
        '1': {
          title: 'Conecte o básico',
          body: 'Vinte linhas, três arquivos, um fluxo funcionando.',
        },
        '2': { title: 'Adicione a próxima camada' },
      },
    },
    compare: {
      option: { a: 'Construir do zero', b: 'Usar a plataforma' },
      decision: { yes: 'Sim, se vale o investimento', no: 'Não, a plataforma já existe' },
    },
    timeline: { milestone: { '1': 'Hoje: um shape', '2': 'Seis meses: um canvas completo' } },
    summary: {
      takeaway: { '1': 'Comece menor do que parece certo', '2': 'Reutilizar vence reinventar' },
      nextstep: 'Construa a menor coisa que funcione',
    },
  },
}
