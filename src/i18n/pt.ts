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
    flagged: 'Sinalizado',
    editorialQuality: 'Qualidade Editorial',
  },
  dopamineCard: {
    readMore: 'Leia mais',
  },
  signal: {
    sourceCount: '{count} fontes',
    sources: 'fontes',
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
    curatedAcross: 'curados em {count} nichos',
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
}
