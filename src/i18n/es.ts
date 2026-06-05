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
    breadcrumb: {
      label: 'Estás aquí:',
      signals: 'Insights',
    },
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
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Constructor de Flujo de Trabajo Magica',
      unifiedPromptEngineering:
        'Ingeniería de prompts, enrutamiento de modelos y evaluación unificados en una interfaz',
      magicaCommandCenter: 'Magica: El Centro de Comando de IA',
      magicaDescription:
        'Magica unifica la ingeniería de prompts, el enrutamiento de modelos y la evaluación en una interfaz',
      aiProcessing: 'Procesamiento de IA',
      nodeBasedPromptChaining: 'Encadenamiento de prompts basado en nodos',
      architecture: 'Arquitectura',
      multiModelFallback: 'Enrutamiento fallback multi-modelo',
      startBuilding: 'Empieza a Construir',
      tryMagicaFree: 'Prueba Magica gratis — sin tarjeta de crédito',
      visitMagica: 'Visitar Magica',
      qualityScore: 'Puntuación de Calidad',
      languages: 'Idiomas',
      workflowVisualization: 'Visualización del Flujo de Trabajo',
      keyMetrics: 'Métricas Clave',
      workflowSteps: 'Pasos del Flujo',
      poweredBy: 'Desarrollado por',
    },
    canvaMagica: {
      workflowTitle: 'Constructor de Flujo de Trabajo Magica',
      inputLabel: 'ENTRADA',
      aiProcessing: {
        title: 'PROCESAMIENTO DE IA',
        subtitle: 'Encadenamiento de prompts basado en nodos',
      },
      qualityScore: '',
      languages: '8 idiomas',
      outputLabel: 'Prompt → Enrutador de Modelos → Salida',
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
    qualityScore: '',
    editorialQuality: 'Calidad Editorial',
  },
  dopamineCard: {
    readMore: 'Leer más',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} fuentes',
    sources: 'fuentes',
    freshnessLabel: '',
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
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'Temas de IA',
    topicsDescription:
      'Explore nuestra lista seleccionada de temas y nichos de Inteligencia Artificial.',
  },
  homepage: {
    featuredSignals: 'Insights Destacados',
    knowledgeClusters: 'Clusters',
    frontierStreams: 'Frontera',
    signalCount: '{count} insights',
    curatedAcross: 'seleccionados en {count} nichos',
    noSignals: 'No hay insights publicados aún en este idioma.',
    browseTopics: 'Explorar temas',
    networkState: 'Estado de la Red UniTeia',
    signalIntake: 'Captación de Insights',
    deliveryLayer: 'Capa de Entrega',
  },
  onboarding: {
    step1: {
      title: 'El mundo es ruidoso.',
      subtitle: 'Nosotros filtramos el insight.',
      desc: '{siteName} ingiere miles de fuentes diariamente, extrayendo lo que importa. Para que tú no tengas que hacerlo.',
    },
    step2: {
      title: 'Cada insight pasa por 7 filtros de calidad antes de llegar a ti.',
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
    curating: '{niche} insights hoy',
    topNiches: 'Principales Nichos',
    apexBadge: 'APEX · En Vivo',
    headline: 'Señales de frontera de {count} canales',
    tracksLabel: 'canales activos',
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
  sketchnote: {
    template01: {
      title: 'Template 01 — Explicador Visual Práctico',
      subtitle: 'Explica conceptos rápido con lógica visual',
      postIt: 'Sketchnotes + Código + Claridad = Aprendizaje más rápido',
      mascotBubble: 'Hagámoslo visual.',
      steps: {
        hook: {
          kind: 'Gancho',
          title: 'MCP para devs',
          body: 'Conecta agentes de IA a cualquier herramienta. Seguro. Confiable. Extensible.',
        },
        mistake: {
          kind: 'Error común',
          title: 'Pensar que MCP es solo otra API.',
          body: 'Las APIs exponen funciones. MCP va más allá.',
          postIt: 'Las APIs exponen funciones. MCP orquesta capacidades para agentes.',
        },
        analogy: {
          kind: 'Analogía visual',
          title: 'MCP es el hub que conecta agentes con herramientas.',
          body: 'Un protocolo. Muchas herramientas. El agente se mantiene enfocado.',
          items: ['Búsqueda', 'Base de datos', 'Archivos', 'APIs'],
          agentLabel: 'Agente de IA',
        },
        diagram: {
          kind: 'Diagrama funcional',
          title: 'Cómo funciona MCP de extremo a extremo',
          body: 'Encuentra ingresos del Q1\nEntiende y planifica\nRutea, autentica, contexto, seguridad\nEjecuta trabajo real\nRespuesta estructurada',
          flow: ['Usuario', 'Agente de IA', 'Servidor MCP', 'Herramientas', 'Respuesta'],
        },
        example: {
          kind: 'Ejemplo práctico',
          title: 'Ejemplo: llamada a herramienta vía MCP',
          body: 'El agente pide vía MCP. El servidor encuentra la herramienta correcta y ejecuta.',
          caption: 'Petición JSON-RPC',
        },
        use: {
          kind: 'Cuándo usar',
          title: 'Usa MCP cuando…',
          useHeader: 'Usa MCP cuando',
          useItems: [
            'Tienes múltiples herramientas o fuentes de datos',
            'Necesitas acceso seguro y gobernado',
            'Quieres que los agentes actúen con contexto y seguridad',
            'Vas a escalar herramientas o equipos',
          ],
          dontHeader: 'No uses MCP cuando',
          dontItems: [
            'Solo llamas a una API simple',
            'No necesitas orquestación de agentes',
            'Quieres una integración ligera en el frontend',
            'Solo estás exponiendo un endpoint público',
          ],
        },
        pitfalls: {
          kind: 'Trampas comunes',
          title: 'Evita estas trampas:',
          items: [
            'Exponer herramientas sin auth y guardrails adecuados',
            'Sobrecargar al agente con demasiadas herramientas.',
            'Ignorar contexto, logs y observabilidad.',
          ],
          tipHeader: 'Diseña para seguridad, claridad y observabilidad.',
          tip: 'Planifica la superficie de herramientas antes de cablear nada.',
        },
        nextStep: {
          kind: 'Siguiente paso',
          title: 'Tu siguiente paso:',
          items: [
            'Elige una herramienta real para conectar',
            'Diseña el schema de la herramienta',
            'Implementa el endpoint MCP',
            'Agrega auth y permisos',
            'Prueba con tu agente',
            'Agrega logs y monitoreo',
            'Documenta para tu equipo',
          ],
          closingNote: 'Empieza pequeño. Entrega una capacidad. Itera.',
        },
      },
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo del dev',
        practicalByDesign: 'Práctico por diseño',
      },
      level: 'De principiante a intermedio',
      footer: 'Hecho para quien aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Receta de Código / Mini Build',
      subtitle: 'Enseña implementación práctica, rápido.',
      postIt: 'Sketchnotes + Código + Claridad + Aprendizaje más rápido',
      mascotBubble: 'Vamos a construirlo.',
      steps: {
        result: {
          kind: 'Resultado',
          title: 'Resultado final',
          body: 'Dibujo en vivo con Canvas',
          caption: 'Tinta suave en tiempo real',
        },
        install: {
          kind: 'Instalación',
          title: 'Añade el motor freehand mágico.',
          body: 'Un paquete, cero configuración.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Código',
          title: 'Código mínimo',
          body: 'Captura puntos, obtén un trazo suave.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Cómo funciona',
          title: 'De la entrada a la tinta bonita.',
          body: 'Cada evento de pointer se vuelve un trazo.',
          flow: ['Mouse/Touch', 'Puntos', 'Spline (Suave)', 'Canvas (Dibujo)'],
          caption: 'Cada evento de pointer se vuelve un trazo.',
        },
        upgrade: {
          kind: 'Ideas de upgrade',
          title: 'Hazlo útil. Hazlo tuyo.',
          body: 'Tres victorias rápidas para ir más lejos.',
          items: [
            {
              name: 'Guardar & Reabrir',
              desc: 'Guarda el dibujo como JSON. Carga de nuevo cuando quieras.',
            },
            {
              name: 'Deshacer / Rehacer',
              desc: 'Mantén una pila de trazos para un historial sin fricción.',
            },
            { name: 'Exportar Imagen', desc: 'Exporta el canvas como PNG.' },
          ],
          caption: 'Tres victorias rápidas.',
        },
      },
      cta: 'De la idea a la implementación',
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo del dev',
        practicalByDesign: 'Práctico por diseño',
      },
      footer: 'Hecho para quien aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Mapa de Decisión / Comparativo Visual',
      subtitle: 'Compara opciones y decide rápido',
      postIt: 'Sketchnotes + Código + Claridad + Aprendizaje más rápido',
      mascotBubble: 'Elige la mejor herramienta con lógica.',
      panels: {
        question: {
          kind: 'Pregunta',
          title: '¿Qué pizarra deberías usar?',
          subtitle: '4 grandes opciones. Distintas fortalezas.',
          tipTitle: 'Consejo pro',
          tip: 'No hay "mejor" — solo la mejor para tu caso.',
        },
        options: {
          kind: 'Opciones',
          title: 'Mapa de opciones',
          options: [
            { name: 'tldraw desktop', desc: 'App lista. Experiencia completa. Integrado.' },
            { name: 'tldraw SDK', desc: 'Incrústalo en tu app. Control total. Tu UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultraligero. Gran rendimiento. Canvas infinito.',
            },
            { name: 'Excalidraw', desc: 'Estética simple. Open source. Rápido de lanzar.' },
          ],
        },
        decision: {
          kind: 'Decisión',
          title: 'Lógica de decisión',
          subtitle: 'Responde sí/no, sigue el primer match.',
          rules: [
            { question: '¿Quieres un app listo para usar?', yesTo: 'tldraw desktop' },
            { question: '¿Quieres incrustar la pizarra en tu propia app?', yesTo: 'tldraw SDK' },
            {
              question: '¿Necesitas lo más ligero con mejor rendimiento?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: '¿Quieres algo simple, limpio y open source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Responde de arriba a abajo. Toma el primer "Sí".',
        },
        summary: {
          kind: 'Resumen',
          title: 'Resumen de recomendación',
          options: [
            {
              name: 'tldraw desktop',
              verdict: 'Mejor cuando quieres un app de pizarra completo y listo para usar.',
            },
            {
              name: 'tldraw SDK',
              verdict: 'Mejor cuando quieres incrustar y personalizar la pizarra en tu producto.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Mejor cuando necesitas máximo rendimiento y bundle mínimo.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Mejor cuando quieres simplicidad, open source y una experiencia de dibujo limpia.',
            },
          ],
          closingNote:
            'Elige la herramienta que encaje con tus restricciones, equipo y objetivos de UX.',
        },
      },
      cta: 'Comparación rápida para builders',
      tags: {
        visualLogic: 'Lógica visual',
        devFriendly: 'Amigo del dev',
        practicalByDesign: 'Práctico por diseño',
      },
      footer: 'Hecho para quien aprende. Pensado para devs. Por UniTeia / ConteiXeia',
    },
  },
  canva: {
    hero: {
      title: 'La señal sobre la que puedes construir',
      subtitle: 'Seis escenas, una decisión',
      cta: 'Abrir el canvas',
    },
    concept: {
      central: 'Por qué esto importa ahora',
      satellite: { '1': 'Decisiones más rápidas', '2': 'Señal más clara' },
    },
    code: {
      step: {
        '1': {
          title: 'Conecta lo básico',
          body: 'Veinte líneas, tres archivos, un flujo que funciona.',
        },
        '2': { title: 'Añade la siguiente capa' },
      },
    },
    compare: {
      option: { a: 'Construirlo tú mismo', b: 'Usar la plataforma' },
      decision: { yes: 'Sí, si se paga solo', no: 'No, la plataforma ya está ahí' },
    },
    timeline: { milestone: { '1': 'Hoy: un shape', '2': 'Seis meses: un canvas completo' } },
    summary: {
      takeaway: {
        '1': 'Empieza más pequeño de lo que parece correcto',
        '2': 'Reutilizar gana a reinventar',
      },
      nextstep: 'Construye lo mínimo que funcione',
    },
  },
}
