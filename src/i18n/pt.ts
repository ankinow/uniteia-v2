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
      backHome: 'Retornar ao Ápice',
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
    frontierStreamsOne: 'Fronteira',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'curados em {count} nichos',
    curatedAcrossOne: 'curado em 1 nicho',
    noSignals: 'Nenhum insight publicado ainda neste idioma.',
    browseTopics: 'Explorar tópicos',
    networkState: 'Estado da Rede UniTeia',
    signalIntake: 'Captação de Insights',
    deliveryLayer: 'Camada de Entrega',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
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
    headlineOne: 'Sinal de fronteira de 1 canal',
    tracksLabel: 'canais ativos',
    tracksLabelOne: 'canal ativo',
  },
  legal: {
    privacy: {
      title: 'Política de Privacidade',
      body: `<h2>1. Dados que Coletamos</h2><p>Coletamos apenas o mínimo necessário para operar a plataforma UniTeia: (a) <strong>Dados de uso</strong> — visualizações de página e padrões de navegação via análise anônima, (b) <strong>Consultas de busca</strong> — termos pesquisados para melhorar resultados, (c) <strong>Preferência de idioma</strong> — locale escolhido. Não coletamos identificadores pessoais, emails (exceto ao assinar newsletter) ou dados de pagamento.</p><h2>2. Uso dos Dados</h2><p>Todo dado coletado serve exclusivamente para entregar e melhorar a curadoria editorial da UniTeia. Usamos análise agregada para entender quais tópicos os leitores mais valorizam. Nunca usamos dados para perfilamento automatizado, publicidade comportamental ou qualquer finalidade não relacionada ao conteúdo.</p><h2>3. Cookies e Armazenamento Local</h2><p>A UniTeia usa um único cookie funcional para lembrar sua preferência de tema (claro/escuro). Não usamos cookies de rastreamento, cookies de publicidade de terceiros ou técnicas de fingerprinting. Nenhum banner de consentimento é necessário sob a LGPD pois processamos apenas dados essenciais.</p><h2>4. Terceiros</h2><p>Não vendemos, alugamos ou compartilhamos seus dados com terceiros. Usamos Cloudflare para entrega de conteúdo e proteção DDoS — a Cloudflare pode processar seu endereço IP como parte de suas operações de rede. Não usamos serviços externos de analytics, redes de anúncios ou rastreadores de redes sociais.</p><h2>5. Retenção e Segurança</h2><p>Consultas de busca e dados de uso são retidos por 30 dias apenas de forma agregada. Utilizamos criptografia TLS para todos os dados em trânsito e seguimos as melhores práticas de segurança da Cloudflare. Você pode solicitar a exclusão de quaisquer dados armazenados entrando em contato.</p><h2>6. Seus Direitos (LGPD)</h2><p>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acesso, correção, exclusão, portabilidade e oposição ao tratamento dos seus dados. Para exercer qualquer um desses direitos, entre em contato pelo email abaixo.</p><h2>7. Contato</h2><p>Para questões de privacidade: <a href="mailto:privacidade@uniteia.com">privacidade@uniteia.com</a>. Esta política foi atualizada em 8 de junho de 2026.</p>`,
    },
    terms: {
      title: 'Termos de Serviço',
      body: `<h2>1. Aceitação dos Termos</h2><p>Ao acessar ou usar a UniTeia ("o Serviço"), você concorda com estes Termos de Serviço. Se não concordar, interrompa o uso imediatamente. Reservamo-nos o direito de atualizar estes termos a qualquer momento — o uso continuado após alterações constitui aceitação.</p><h2>2. Descrição do Serviço</h2><p>A UniTeia é uma plataforma de curadoria editorial que agrega, analisa e apresenta informações sobre inteligência artificial, computação em nuvem e tecnologias relacionadas. O Serviço é gratuito e oferecido sem garantia.</p><h2>3. Aviso de Conteúdo</h2><p>Todo conteúdo da UniTeia é para <strong>fins exclusivamente informativos</strong>. Não constitui aconselhamento profissional (jurídico, financeiro, técnico ou outro). Não garantimos precisão, integridade ou atualidade de nenhum conteúdo. Conteúdo gerado por IA é claramente identificado e deve ser verificado independentemente.</p><h2>4. Propriedade Intelectual</h2><p>O código da plataforma UniTeia é open source sob a Licença MIT. O conteúdo editorial (artigos, visuais, diagramas) está licenciado sob Creative Commons Attribution 4.0 (CC BY 4.0), salvo indicação contrária. Conteúdo e marcas de terceiros permanecem propriedade de seus respectivos titulares.</p><h2>5. Conduta do Usuário</h2><p>Você concorda em não: (a) usar o Serviço para fins ilícitos, (b) tentar interromper ou sobrecarregar nossa infraestrutura, (c) extrair conteúdo violando limites de taxa, (d) se passar pela UniTeia ou seus operadores.</p><h2>6. Limitação de Responsabilidade</h2><p>A UniTeia é fornecida "como está", sem garantias de qualquer tipo, expressas ou implícitas. Em nenhuma hipótese a UniTeia ou seus operadores serão responsáveis por danos decorrentes do uso ou incapacidade de uso do Serviço.</p><h2>7. Links de Terceiros</h2><p>O Serviço contém links para sites e recursos externos. Não endossamos e não somos responsáveis pelo conteúdo, precisão ou práticas de sites de terceiros. Acesse-os por sua conta e risco.</p><h2>8. Lei Aplicável</h2><p>Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas no foro da comarca de São Paulo, Brasil.</p><h2>9. Encerramento</h2><p>Reservamo-nos o direito de encerrar ou suspender o acesso ao Serviço a nosso exclusivo critério, sem aviso prévio, por conduta que acreditamos violar estes termos ou ser prejudicial.</p><h2>10. Contato</h2><p>Para questões sobre estes termos: <a href="mailto:legal@uniteia.com">legal@uniteia.com</a>. Última atualização: 8 de junho de 2026.</p>`,
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
