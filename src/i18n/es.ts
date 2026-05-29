import type { TranslationStrings } from './types'

export const es: TranslationStrings = {
  nav: {
    home: 'Inicio',
    about: 'Acerca de',
    blog: 'Blog',
    projects: 'Proyectos',
    contact: 'Contacto',
    topics: 'Temas',
    search: 'Buscar',
    niches: 'Nichos',
  },
  sidebar: {
    interfaceLabel: 'Interfaz Compacta',
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
    magica: {
      insight: {
        title: 'Magica: El Centro de Comando de IA',
        body: 'Magica unifica la ingeniería de prompts, el enrutamiento de modelos y la evaluación en una sola interfaz.',
      },
      evidence: {
        title: 'Visualización de Flujo de Trabajo',
        alt: 'Captura de pantalla del constructor de flujo de trabajo de Magica',
      },
      architecture: {
        title: 'Arquitectura',
        point1: 'Encadenamiento de prompts basado en nodos',
        point2: 'Enrutamiento de respaldo multi-modelo',
        point3: 'Telemetría de latencia en tiempo real',
      },
      cta: {
        title: 'Empezar a Construir',
        body: 'Prueba Magica gratis — sin necesidad de tarjeta de crédito.',
        button: 'Visitar Magica',
      },
    },
  },
  niche: {
    topicsLabel: 'Temas',
    exploreNiche: 'Explorar {niche}',
    articleCount: '{count} artículos',
    allNiches: 'Todos los Temas',
  },
  editorial: {
    verdictLabel: 'Veredicto',
    trusted: 'Confiable',
    caution: 'Precaución',
    flagged: 'Señalado',
    qualityScore: 'Puntuación de Calidad',
    editorialQuality: 'Calidad Editorial',
  },
  dopamineCard: {
    readMore: 'Leer más',
  },
  signal: {
    qualityLabel: 'Calidad',
    sourceCount: '{count} fuentes',
    sources: 'fuentes',
    freshnessLabel: 'Actualidad',
  },
  search: {
    placeholder: 'Buscar temas, artículos...',
    resultsFor: 'Resultados para "{query}"',
    noResults: 'Sin resultados',
    noResultsHint: 'Prueba con otras palabras clave o explora nuestros temas',
    resultCount: '{count} resultados',
    searchTitle: 'Buscar',
    searchDescription: 'Buscar artículos y temas en UniTeia',
  },
  seo: {
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'Temas de IA',
    topicsDescription:
      'Explore nuestra lista seleccionada de temas y nichos de Inteligencia Artificial.',
  },
  homepage: {
    featuredSignals: 'Señales Destacadas',
    knowledgeClusters: 'Clústeres de Conocimiento',
    frontierStreams: 'Corrientes de Frontera',
    signalCount: '{count} señales',
    curatedAcross: 'seleccionados en {count} nichos',
    noSignals: 'No hay señales publicadas aún en este idioma.',
    browseTopics: 'Explorar temas',
    networkState: 'Estado de la Red UniTeia',
    signalIntake: 'Captación de Señales',
    deliveryLayer: 'Capa de Entrega',
  },
  onboarding: {
    step1: {
      title: 'El mundo es ruidoso.',
      subtitle: 'Nosotros filtramos la señal.',
      desc: '{siteName} ingiere miles de fuentes diariamente, extrayendo lo que importa. Para que tú no tengas que hacerlo.',
    },
    step2: {
      title: 'Cada señal pasa por 7 gates de calidad antes de llegar a ti.',
      cards: [
        {
          label: 'Investigación',
          desc: 'Las fuentes brutas se ingieren y puntúan según su confianza.',
        },
        { label: 'Verificación', desc: 'Las afirmaciones se cotejan con fuentes independientes.' },
        {
          label: 'Estructuración',
          desc: 'El contenido se formatea, localiza y prepara para su entrega.',
        },
      ],
    },
    step3: {
      title: 'Disponible en 8 idiomas.',
      desc: 'Solo lo que importa. Entregado en tu idioma, en tus términos.',
      badge: '8 voces',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Inactivo',
      thinking: 'Aether OS · Pensando',
      processing: 'Aether OS · Procesando',
      complete: 'Aether OS · Completo',
      error: 'Aether OS · Error',
    },
    mcpTooltip: 'Servidor MCP Conectado · 7 herramientas activas',
  },
  generativeHero: {
    curating: 'Curando {niche} hoy',
    topNiches: 'Principales Nichos',
  },
  legal: {
    privacy: {
      title: 'Política de Privacidad',
      body: 'Política de Privacidad. Su privacidad es importante para nosotros. Recopilamos y procesamos los datos mínimos necesarios para proporcionar el servicio de curación UniTeia. No vendemos sus datos a terceros. Esta política describe nuestras prácticas de recopilación, almacenamiento y procesamiento de datos.',
    },
    terms: {
      title: 'Términos de Servicio',
      body: 'Términos de Servicio. Al usar UniTeia, usted acepta estos términos. El contenido proporcionado es solo para fines informativos y no constituye asesoramiento profesional. Nos reservamos el derecho de modificar estos términos en cualquier momento.',
    },
  },
}
