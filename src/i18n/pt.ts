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
    qualityScore: 'Pontuação de Qualidade',
    editorialQuality: 'Qualidade Editorial',
  },
  dopamineCard: {
    readMore: 'Leia mais',
  },
  signal: {
    qualityLabel: 'Qualidade',
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
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'Tópicos de IA',
    topicsDescription: 'Explore nossa curadoria de tópicos e nichos de Inteligência Artificial.',
  },
  onboarding: {
    step1: {
      title: 'O mundo é barulhento.',
      subtitle: 'Nós filtramos o sinal.',
      desc: '{siteName} ingere milhares de fontes diariamente, extraindo o que importa. Para que você não precise.',
    },
    step2: {
      title: 'Cada sinal passa por 7 gates de qualidade antes de chegar até você.',
    },
    step3: {
      title: 'Disponível em 8 idiomas.',
      desc: 'Apenas o que importa. Entregue no seu idioma, nos seus termos.',
      badge: '8 vozes',
    },
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
