import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const it: TranslationStrings = {
  nav: {
    home: 'Home',
    about: 'Chi siamo',
    blog: 'Blog',
    projects: 'Progetti',
    contact: 'Contatto',
    topics: 'Argomenti',
    search: 'Cerca',
    niches: 'Nicchie',
    breadcrumb: {
      label: 'Sei qui:',
      signals: 'Segnali',
    },
  },
  sidebar: {
    interfaceLabel: 'Interfaccia Compatta',
  },
  footer: {
    copyright: '© {year} UniTeia. Tutti i diritti riservati.',
    madeWith: "Fatto con ♥ per l'IA decentralizzata",
    links: {
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini di Servizio',
      source: 'Codice Sorgente',
    },
  },
  langSwitcher: {
    label: 'Lingua',
    current: 'Lingua attuale: {lang}',
    available: 'Lingue disponibili',
  },
  errorPages: {
    '404': {
      title: 'Pagina non trovata',
      message: 'La pagina che stai cercando non esiste o è stata spostata.',
      backHome: 'Torna alla home',
    },
    '500': {
      title: 'Errore del server',
      message: 'Qualcosa è andato storto dalla nostra parte. Riprova più tardi.',
      retry: 'Riprova',
    },
  },
  fallbackBanner: {
    message: 'Questo contenuto non è disponibile nella tua lingua. Viene mostrato in inglese.',
    dismiss: 'Chiudi',
  },
  article: {
    subjectsLabel: 'Argomenti',
    sourcesLabel: 'Fonti',
    published: 'Pubblicato',
    updated: 'Aggiornato',
    byAuthor: 'di {author}',
    version: 'v{version}',
    readInLang: 'Leggi in {lang}',
    magica: {
      insight: {
        title: 'Magica: Il Centro di Comando AI',
        body: "Magica unifica ingegneria dei prompt, routing dei modelli e valutazione in un'unica interfaccia.",
      },
      evidence: {
        title: 'Visualizzazione del Flusso di Lavoro',
        alt: 'Schermata del costruttore di flussi di lavoro Magica',
      },
      architecture: {
        title: 'Architettura',
        point1: 'Concatenamento di prompt basato su nodi',
        point2: 'Routing di fallback multi-modello',
        point3: 'Telemetria di latenza in tempo reale',
      },
      cta: {
        title: 'Inizia a Costruire',
        body: 'Prova Magica gratuitamente — senza carta di credito.',
        button: 'Visita Magica',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Costruttore di Flusso di Lavoro Magica',
      unifiedPromptEngineering:
        "Ingegneria dei prompt, routing dei modelli e valutazione unificati in un'interfaccia",
      magicaCommandCenter: 'Magica: Il Centro di Comando AI',
      magicaDescription:
        "Magica unifica l'ingegneria dei prompt, il routing dei modelli e la valutazione in un'interfaccia",
      aiProcessing: 'Elaborazione AI',
      nodeBasedPromptChaining: 'Concatenamento di prompt basato su nodi',
      architecture: 'Architettura',
      multiModelFallback: 'Routing fallback multi-modello',
      startBuilding: 'Inizia a Costruire',
      tryMagicaFree: 'Prova Magica gratuitamente — senza carta di credito',
      visitMagica: 'Visita Magica',
      qualityScore: 'Punteggio di Qualità',
      languages: 'Lingue',
      workflowVisualization: 'Visualizzazione del Flusso di Lavoro',
      keyMetrics: 'Metriche Chiave',
      workflowSteps: 'Passaggi del Flusso',
      poweredBy: 'Offerto da',
    },
    canvaMagica: {
      workflowTitle: 'Costruttore di Flussi di Lavoro Magica',
      inputLabel: 'INPUT',
      aiProcessing: {
        title: 'ELABORAZIONE AI',
        subtitle: 'Concatenamento di prompt basato su nodi',
      },
      qualityScore: '84 punteggio di qualità',
      languages: '8 lingue',
      outputLabel: 'Prompt → Router di Modelli → Output',
    },
  },
  niche: {
    topicsLabel: 'Argomenti',
    exploreNiche: 'Esplora {niche}',
    articleCount: '{count} articoli',
    allNiches: 'Tutti gli argomenti',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Affidabile',
    caution: 'Attenzione',
    flagged: 'Segnalato',
    qualityScore: 'Punteggio di Qualità',
    editorialQuality: 'Qualità Editoriale',
  },
  dopamineCard: {
    readMore: 'Leggi di più',
  },
  signal: {
    qualityLabel: 'Qualità',
    sourceCount: '{count} fonti',
    sources: 'fonti',
    freshnessLabel: 'Attualità',
  },
  search: {
    placeholder: 'Cerca argomenti, articoli...',
    resultsFor: 'Risultati per "{query}"',
    noResults: 'Nessun risultato',
    noResultsHint: 'Prova con parole chiave diverse o sfoglia i nostri argomenti',
    resultCount: '{count} risultati',
    searchTitle: 'Cerca',
    searchDescription: 'Cerca articoli e argomenti su UniTeia',
  },
  seo: {
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'Argomenti IA',
    topicsDescription:
      'Esplora la nostra lista curata di argomenti e nicchie di Intelligenza Artificiale.',
  },
  homepage: {
    featuredSignals: 'Segnali in Evidenza',
    knowledgeClusters: 'Cluster di Conoscenza',
    frontierStreams: 'Correnti di Frontiera',
    signalCount: '{count} segnali',
    curatedAcross: 'curati in {count} nicchie',
    noSignals: 'Nessun segnale pubblicato ancora in questa lingua.',
    browseTopics: 'Sfoglia argomenti',
    networkState: 'Stato della Rete UniTeia',
    signalIntake: 'Captazione Segnali',
    deliveryLayer: 'Livello di Consegna',
  },
  onboarding: {
    step1: {
      title: 'Il mondo è rumoroso.',
      subtitle: 'Noi filtriamo il segnale.',
      desc: '{siteName} assimila migliaia di fonti ogni giorno, estraendo ciò che conta. Così tu non devi farlo.',
    },
    step2: {
      title: 'Ogni segnale passa attraverso 7 gate di qualità prima di raggiungerti.',
      cards: [
        {
          label: 'Ricerca',
          desc: "Le fonti grezze vengono ingerite e valutate per l'affidabilità.",
        },
        {
          label: 'Verifica',
          desc: 'Le affermazioni vengono verificate incrociando fonti indipendenti.',
        },
        {
          label: 'Strutturazione',
          desc: 'Il contenuto viene formattato, localizzato e reso pronto per la consegna.',
        },
      ],
    },
    step3: {
      title: 'Disponibile in 8 lingue.',
      desc: 'Solo ciò che conta. Nella tua lingua, alle tue condizioni.',
      badge: '8 voci',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Inattivo',
      thinking: 'Aether OS · Pensando',
      processing: 'Aether OS · Elaborazione',
      complete: 'Aether OS · Completato',
      error: 'Aether OS · Errore',
    },
    mcpTooltip: 'Server MCP Connesso · 7 strumenti attivi',
  },
  generativeHero: {
    curating: 'Curando {niche} oggi',
    topNiches: 'Principali Nicchie',
  },
  legal: {
    privacy: {
      title: 'Informativa sulla Privacy',
      body: 'Informativa sulla Privacy. La tua privacy è importante per noi. Raccogliamo ed elaboriamo solo i dati minimi necessari per fornire il servizio di curatione UniTeia. Non vendiamo i tuoi dati a terze parti. Questa informativa descrive le nostre pratiche di raccolta, archiviazione e elaborazione dei dati.',
    },
    terms: {
      title: 'Termini di Servizio',
      body: 'Termini di Servizio. Utilizzando UniTeia, accetti questi termini. Il contenuto fornito è solo a scopo informativo e non costituisce consulenza professionale. Ci riserviamo il diritto di modificare questi termini in qualsiasi momento.',
    },
  },
}
