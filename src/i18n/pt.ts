import type { TranslationStrings } from './types'

export const pt: TranslationStrings = {
  nav: {
    home: 'Início',
    about: 'Sobre',
    blog: 'Blog',
    projects: 'Projetos',
    contact: 'Contato',
    topics: 'Tópicos',
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
  qualityRing: {
    qualityScore: 'Pontuação de Qualidade',
    editorialQuality: 'Qualidade Editorial',
  },
  dopamineCard: {
    readMore: 'Leia mais',
  },
}
