import type { TranslationStrings } from './types'

export const es: TranslationStrings = {
  nav: {
    home: 'Inicio',
    about: 'Acerca de',
    blog: 'Blog',
    projects: 'Proyectos',
    contact: 'Contacto',
  },
  footer: {
    copyright: '© {year} UniTeia. Todos los derechos reservados.',
    madeWith: 'Hecho con ♥ para IA descentralizada',
    links: {
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      source: 'Código Fuente',
    },
  },
  langSwitcher: {
    label: 'Idioma',
    current: 'Idioma actual: {lang}',
    available: 'Idiomas disponibles',
  },
  errorPages: {
    '404': {
      title: 'Página No Encontrada',
      message: 'La página que buscas no existe o ha sido movida.',
      backHome: 'Volver al Inicio',
    },
    '500': {
      title: 'Error del Servidor',
      message: 'Algo salió mal de nuestro lado. Por favor, intenta de nuevo más tarde.',
      retry: 'Reintentar',
    },
  },
  fallbackBanner: {
    message: 'Este contenido no está disponible en tu idioma. Mostrando en inglés.',
    dismiss: 'Descartar',
  },
  article: {
    subjectsLabel: 'Temas',
    sourcesLabel: 'Fuentes',
    published: 'Publicado',
    updated: 'Actualizado',
    byAuthor: 'por {author}',
    version: 'v{version}',
    readInLang: 'Leer en {lang}',
  },
  niche: {
    topicsLabel: 'Temas',
    exploreNiche: 'Explorar {niche}',
    articleCount: '{count} artículos',
    allNiches: 'Todos los Temas',
  },
}
