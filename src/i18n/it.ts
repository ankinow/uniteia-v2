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
      signals: 'Insights',
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
      qualityScore: '',
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
    qualityScore: '',
    editorialQuality: 'Qualità Editoriale',
  },
  dopamineCard: {
    readMore: 'Leggi di più',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} fonti',
    sources: 'fonti',
    freshnessLabel: '',
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
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'Argomenti IA',
    topicsDescription:
      'Esplora la nostra lista curata di argomenti e nicchie di Intelligenza Artificiale.',
  },
  homepage: {
    featuredSignals: 'Insights in Evidenza',
    knowledgeClusters: 'Cluster',
    frontierStreams: 'Frontiera',
    frontierStreamsOne: 'Frontiera',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'curati in {count} nicchie',
    curatedAcrossOne: 'curato in 1 nicchia',
    noSignals: 'Nessun insight pubblicato',
    browseTopics: 'Sfoglia argomenti',
    networkState: 'Stato della Rete UniTeia',
    signalIntake: 'Assunzione Insights',
    deliveryLayer: 'Livello di Consegna',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
  },
  onboarding: {
    step1: {
      title: 'Il mondo è rumoroso.',
      subtitle: "Noi filtriamo l'insight.",
      desc: '{siteName} assimila migliaia di fonti ogni giorno, estraendo ciò che conta. Così tu non devi farlo.',
    },
    step2: {
      title: 'Ogni insight passa attraverso 7 filtri di qualità prima di raggiungerti.',
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
    curating: '{niche} insights oggi',
    topNiches: 'Principali Nicchie',
    apexBadge: 'APEX · Live',
    headline: 'Segnali di frontiera da {count} canali',
    headlineOne: 'Segnale di frontiera da 1 canale',
    tracksLabel: 'canali attivi',
    tracksLabelOne: 'canale attivo',
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
  sketchnote: {
    template01: {
      title: 'Template 01 — Visual Explainer Pratico',
      subtitle: 'Spiega i concetti in fretta con la logica visuale',
      postIt: 'Sketchnotes + Codice + Chiarezza = Apprendimento più veloce',
      mascotBubble: 'Rendiamolo visuale.',
      steps: {
        hook: {
          kind: 'Hook',
          title: 'MCP per i dev',
          body: 'Collega agenti IA a qualsiasi tool. Sicuro. Affidabile. Estensibile.',
        },
        mistake: {
          kind: 'Errore comune',
          title: 'Pensare che MCP sia solo un’altra API.',
          body: 'Le API espongono funzioni. MCP fa di più.',
          postIt: 'Le API espongono funzioni. MCP orchestra capacità per gli agenti.',
        },
        analogy: {
          kind: 'Analogia visuale',
          title: 'MCP è l’hub che collega gli agenti ai tool.',
          body: 'Un protocollo. Molti tool. L’agente resta focalizzato.',
          items: ['Ricerca', 'Database', 'File', 'API'],
          agentLabel: 'Agente IA',
        },
        diagram: {
          kind: 'Diagramma di funzionamento',
          title: 'Come funziona MCP end-to-end',
          body: 'Trova i ricavi del Q1\nCapisce e pianifica\nInstrada, auth, contesto, sicurezza\nEsegue il lavoro vero\nRisposta strutturata',
          flow: ['Utente', 'Agente IA', 'Server MCP', 'Tool', 'Risposta'],
        },
        example: {
          kind: 'Esempio pratico',
          title: 'Esempio: chiamata a un tool via MCP',
          body: 'L’agente chiede via MCP. Il server trova il tool giusto ed esegue.',
          caption: 'Richiesta JSON-RPC',
        },
        use: {
          kind: 'Quando usarlo',
          title: 'Usa MCP quando…',
          useHeader: 'Usa MCP quando',
          useItems: [
            'Hai più tool o fonti di dati',
            'Ti serve accesso sicuro e governato',
            'Vuoi agenti che agiscono con contesto e sicurezza',
            'Prevedi di scalare tool o team',
          ],
          dontHeader: 'Non usare MCP quando',
          dontItems: [
            'Chiami solo un’API semplice',
            'Non ti serve orchestrazione di agenti',
            'Vuoi un’integrazione frontend leggera',
            'Stai solo esponendo un endpoint pubblico',
          ],
        },
        pitfalls: {
          kind: 'Trappole comuni',
          title: 'Evita queste trappole:',
          items: [
            'Esporre tool senza auth e guardrails adeguati',
            'Sovraccaricare l’agente con troppi tool.',
            'Ignorare contesto, log e osservabilità.',
          ],
          tipHeader: 'Progetta per sicurezza, chiarezza e osservabilità.',
          tip: 'Pianifica la superficie dei tool prima di cablare qualsiasi cosa.',
        },
        nextStep: {
          kind: 'Prossimo passo',
          title: 'Il tuo prossimo passo:',
          items: [
            'Scegli un tool reale da collegare',
            'Disegna lo schema del tool',
            'Implementa l’endpoint MCP',
            'Aggiungi auth e permessi',
            'Testa con il tuo agente',
            'Aggiungi log e monitoraggio',
            'Documenta per il team',
          ],
          closingNote: 'Parti piccolo. Rilascia una capacità. Itera.',
        },
      },
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      level: 'Da principiante a intermedio',
      footer: 'Fatto per chi impara. Pensato per i dev. Da UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Ricetta di codice / Mini Build',
      subtitle: 'Insegna l’implementazione pratica, in fretta.',
      postIt: 'Sketchnotes + Codice + Chiarezza + Apprendimento più veloce',
      mascotBubble: 'Costruiamolo.',
      steps: {
        result: {
          kind: 'Risultato',
          title: 'Risultato finale',
          body: 'Disegno live con Canvas',
          caption: 'Inchiostro fluido in tempo reale',
        },
        install: {
          kind: 'Installazione',
          title: 'Aggiungi il magico motore freehand.',
          body: 'Un pacchetto, zero config.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Codice',
          title: 'Codice minimo',
          body: 'Cattura i punti, ottieni un tratto fluido.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Come funziona',
          title: 'Dall’input all’inchiostro bello.',
          body: 'Ogni evento pointer diventa un tratto.',
          flow: ['Mouse/Touch', 'Punti', 'Spline (Fluida)', 'Canvas (Disegno)'],
          caption: 'Ogni evento pointer diventa un tratto.',
        },
        upgrade: {
          kind: 'Idee di upgrade',
          title: 'Rendilo utile. Rendilo tuo.',
          body: 'Tre quick win per andare oltre.',
          items: [
            { name: 'Salva & Riapri', desc: 'Salva il disegno come JSON. Ricaricalo quando vuoi.' },
            {
              name: 'Annulla / Ripeti',
              desc: 'Tieni uno stack di tratti per uno storico senza frizioni.',
            },
            { name: 'Esporta immagine', desc: 'Esporta il canvas come PNG.' },
          ],
          caption: 'Tre quick win.',
        },
      },
      cta: 'Dall’idea all’implementazione',
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      footer: 'Fatto per chi impara. Pensato per i dev. Da UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Mappa decisionale / Confronto visuale',
      subtitle: 'Confronta le opzioni e scegli in fretta',
      postIt: 'Sketchnotes + Codice + Chiarezza + Apprendimento più veloce',
      mascotBubble: 'Scegli il tool migliore con logica.',
      panels: {
        question: {
          kind: 'Domanda',
          title: 'Quale lavagna scegliere?',
          subtitle: '4 ottime opzioni. Punti di forza diversi.',
          tipTitle: 'Tip pro',
          tip: 'Non esiste il “migliore” — solo il migliore per il tuo caso.',
        },
        options: {
          kind: 'Opzioni',
          title: 'Mappa delle opzioni',
          options: [
            { name: 'tldraw desktop', desc: 'App pronta. Esperienza completa. Integrata.' },
            { name: 'tldraw SDK', desc: 'Embed nella tua app. Controllo totale. La tua UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-leggera. Ottime performance. Canvas infinito.',
            },
            { name: 'Excalidraw', desc: 'Estetica semplice. Open source. Veloce da spedire.' },
          ],
        },
        decision: {
          kind: 'Decisione',
          title: 'Logica decisionale',
          subtitle: 'Rispondi sì/no, segui il primo match.',
          rules: [
            { question: 'Vuoi un’app pronta all’uso?', yesTo: 'tldraw desktop' },
            { question: 'Vuoi embed della lavagna nella tua app?', yesTo: 'tldraw SDK' },
            {
              question: 'Ti serve ultra-leggera con le migliori performance?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Vuoi un look semplice, pulito e open source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Rispondi dall’alto in basso. Prendi il primo "Sì".',
        },
        summary: {
          kind: 'Riepilogo',
          title: 'Riepilogo delle raccomandazioni',
          options: [
            {
              name: 'tldraw desktop',
              verdict: 'Meglio quando vuoi un’app lavagna completa, pronta all’uso.',
            },
            {
              name: 'tldraw SDK',
              verdict: 'Meglio quando vuoi embed e personalizzare la lavagna nel tuo prodotto.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Meglio quando ti servono performance massime e bundle minimo.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Meglio quando vuoi semplicità, open source e un’esperienza di disegno pulita.',
            },
          ],
          closingNote:
            'Scegli il tool che si adatta ai tuoi vincoli, al team e agli obiettivi di UX.',
        },
      },
      cta: 'Confronto rapido per builder',
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      footer: 'Fatto per chi impara. Pensato per i dev. Da UniTeia / ConteiXeia',
    },
  },
  canva: {
    hero: {
      title: 'Il segnale su cui puoi costruire',
      subtitle: 'Sei scene, una decisione',
      cta: 'Apri il canvas',
    },
    concept: {
      central: 'Perché questo conta ora',
      satellite: { '1': 'Decisioni più rapide', '2': 'Segnale più nitido' },
    },
    code: {
      step: {
        '1': { title: 'Collega le basi', body: 'Venti righe, tre file, un flusso che funziona.' },
        '2': { title: 'Aggiungi il livello successivo' },
      },
    },
    compare: {
      option: { a: 'Costruirlo da soli', b: 'Usare la piattaforma' },
      decision: { yes: 'Sì, se si ripaga', no: 'No, la piattaforma è già lì' },
    },
    timeline: { milestone: { '1': 'Oggi: uno shape', '2': 'Sei mesi: un canvas completo' } },
    summary: {
      takeaway: {
        '1': 'Inizia più piccolo di quanto sembri giusto',
        '2': 'Riusare vince su reinventare',
      },
      nextstep: 'Costruisci la cosa minima che funziona',
    },
  },
}
