import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const de: TranslationStrings = {
  nav: {
    home: 'Startseite',
    about: 'Über',
    blog: 'Blog',
    projects: 'Projekte',
    contact: 'Kontakt',
    topics: 'Themen',
    search: 'Suche',
    niches: 'Nischen',
    breadcrumb: {
      label: 'Sie sind hier:',
      signals: 'Signale',
    },
  },
  sidebar: {
    interfaceLabel: 'Kompakte Oberfläche',
  },
  footer: {
    copyright: '© {year} UniTeia. Alle Rechte vorbehalten.',
    madeWith: 'Mit ♥ für dezentrale KI gemacht',
    links: {
      privacy: 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen',
      source: 'Quellcode',
    },
  },
  langSwitcher: {
    label: 'Sprache',
    current: 'Aktuelle Sprache: {lang}',
    available: 'Verfügbare Sprachen',
  },
  errorPages: {
    '404': {
      title: 'Seite nicht gefunden',
      message: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
      backHome: 'Zurück zur Startseite',
    },
    '500': {
      title: 'Serverfehler',
      message: 'Auf unserer Seite ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.',
      retry: 'Erneut versuchen',
    },
  },
  fallbackBanner: {
    message: 'Dieser Inhalt ist in Ihrer Sprache nicht verfügbar. Wir zeigen ihn auf Englisch.',
    dismiss: 'Schließen',
  },
  article: {
    subjectsLabel: 'Themen',
    sourcesLabel: 'Quellen',
    published: 'Veröffentlicht',
    updated: 'Aktualisiert',
    byAuthor: 'von {author}',
    version: 'v{version}',
    readInLang: 'Auf {lang} lesen',
    magica: {
      insight: {
        title: 'Magica: Das KI-Kommandozentrum',
        body: 'Magica vereint Prompt-Engineering, Modell-Routing und Evaluierung in einer einzigen Oberfläche.',
      },
      evidence: {
        title: 'Workflow-Visualisierung',
        alt: 'Screenshot des Magica-Workflow-Builders',
      },
      architecture: {
        title: 'Architektur',
        point1: 'Knotenbasiertes Prompt-Chaining',
        point2: 'Multi-Modell-Fallback-Routing',
        point3: 'Echtzeit-Latenz-Telemetrie',
      },
      cta: {
        title: 'Loslegen',
        body: 'Testen Sie Magica kostenlos — keine Kreditkarte erforderlich.',
        button: 'Magica besuchen',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Magica-Workflow-Builder',
      unifiedPromptEngineering:
        'Vereinheitlichtes Prompt-Engineering, Modell-Routing und Evaluierung in einer Oberfläche',
      magicaCommandCenter: 'Magica: Das KI-Befehlszentrum',
      magicaDescription:
        'Magica vereinheitlicht Prompt-Engineering, Modell-Routing und Evaluierung in einer Oberfläche',
      aiProcessing: 'KI-Verarbeitung',
      nodeBasedPromptChaining: 'Knotenbasiertes Prompt-Chaining',
      architecture: 'Architektur',
      multiModelFallback: 'Multi-Modell-Fallback-Routing',
      startBuilding: 'Mit dem Bauen beginnen',
      tryMagicaFree: 'Magica kostenlos testen — ohne Kreditkarte',
      visitMagica: 'Magica besuchen',
      qualityScore: 'Qualitätsbewertung',
      languages: 'Sprachen',
      workflowVisualization: 'Workflow-Visualisierung',
      keyMetrics: 'Kernmetriken',
      workflowSteps: 'Workflow-Schritte',
      poweredBy: 'Bereitgestellt von',
    },
    canvaMagica: {
      workflowTitle: 'Magica-Workflow-Builder',
      inputLabel: 'EINGABE',
      aiProcessing: {
        title: 'KI-VERARBEITUNG',
        subtitle: 'Knotenbasiertes Prompt-Chaining',
      },
      qualityScore: '84 Qualitätsbewertung',
      languages: '8 Sprachen',
      outputLabel: 'Prompt → Modell-Router → Ausgabe',
    },
  },
  niche: {
    topicsLabel: 'Themen',
    exploreNiche: '{niche} erkunden',
    articleCount: '{count} Artikel',
    allNiches: 'Alle Themen',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Vertrauenswürdig',
    caution: 'Vorsicht',
    flagged: 'Markiert',
    qualityScore: 'Qualitätsbewertung',
    editorialQuality: 'Redaktionelle Qualität',
  },
  dopamineCard: {
    readMore: 'Weiterlesen',
  },
  signal: {
    qualityLabel: 'Qualität',
    sourceCount: '{count} Quellen',
    sources: 'Quellen',
    freshnessLabel: 'Aktualität',
  },
  search: {
    placeholder: 'Themen, Artikel suchen...',
    resultsFor: 'Ergebnisse für "{query}"',
    noResults: 'Keine Ergebnisse',
    noResultsHint: 'Versuchen Sie andere Suchbegriffe oder durchstöbern Sie unsere Themen',
    resultCount: '{count} Ergebnisse',
    searchTitle: 'Suche',
    searchDescription: 'Artikel und Themen auf UniTeia durchsuchen',
  },
  seo: {
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'KI-Themen',
    topicsDescription: 'Erkunden Sie unsere kuratierte Liste von KI-Themen und Nischen.',
  },
  homepage: {
    featuredSignals: 'Ausgewählte Signale',
    knowledgeClusters: 'Wissenscluster',
    frontierStreams: 'Grenzströme',
    signalCount: '{count} Signale',
    curatedAcross: 'kuratiert in {count} Nischen',
    noSignals: 'Noch keine Signale in dieser Sprache veröffentlicht.',
    browseTopics: 'Themen durchsuchen',
    networkState: 'UniTeia Netzwerkstatus',
    signalIntake: 'Signalaufnahme',
    deliveryLayer: 'Zustellungsebene',
  },
  onboarding: {
    step1: {
      title: 'Die Welt ist laut.',
      subtitle: 'Wir filtern das Signal.',
      desc: '{siteName} nimmt täglich Tausende von Quellen auf und extrahiert, was zählt. Damit Sie es nicht tun müssen.',
    },
    step2: {
      title: 'Jedes Signal durchläuft 7 Qualitätsgates, bevor es dich erreicht.',
      cards: [
        {
          label: 'Recherche',
          desc: 'Rohquellen werden aufgenommen und nach Vertrauenswürdigkeit bewertet.',
        },
        {
          label: 'Verifikation',
          desc: 'Behauptungen werden anhand unabhängiger Quellen überprüft.',
        },
        {
          label: 'Strukturierung',
          desc: 'Inhalte werden formatiert, lokalisiert und für die Auslieferung vorbereitet.',
        },
      ],
    },
    step3: {
      title: 'Verfügbar in 8 Sprachen.',
      desc: 'Nur was zählt. In Ihrer Sprache, zu Ihren Bedingungen.',
      badge: '8 Stimmen',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Leerlauf',
      thinking: 'Aether OS · Denken',
      processing: 'Aether OS · Verarbeitung',
      complete: 'Aether OS · Abgeschlossen',
      error: 'Aether OS · Fehler',
    },
    mcpTooltip: 'MCP-Server verbunden · 7 aktive Werkzeuge',
  },
  generativeHero: {
    curating: 'Kuration {niche} heute',
    topNiches: 'Top-Nischen',
  },
  legal: {
    privacy: {
      title: 'Datenschutzerklärung',
      body: 'Datenschutzerklärung. Ihre Privatsphäre ist uns wichtig. Wir erfassen und verarbeiten nur die minimal notwendigen Daten, um den UniTeia-Kurationsdienst bereitzustellen. Wir verkaufen Ihre Daten nicht an Dritte. Diese Richtlinie beschreibt unsere Datenerfassungs-, Speicher- und Verarbeitungspraktiken.',
    },
    terms: {
      title: 'Nutzungsbedingungen',
      body: 'Nutzungsbedingungen. Durch die Nutzung von UniTeia stimmen Sie diesen Bedingungen zu. Die bereitgestellten Inhalte dienen ausschließlich zu Informationszwecken und stellen keine professionelle Beratung dar. Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern.',
    },
  },
}
