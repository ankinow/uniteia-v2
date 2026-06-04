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
      signals: 'Insights',
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
      qualityScore: '',
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
    qualityScore: '',
    editorialQuality: 'Redaktionelle Qualität',
  },
  dopamineCard: {
    readMore: 'Weiterlesen',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} Quellen',
    sources: 'Quellen',
    freshnessLabel: '',
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
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'KI-Themen',
    topicsDescription: 'Erkunden Sie unsere kuratierte Liste von KI-Themen und Nischen.',
  },
  homepage: {
    featuredSignals: 'Ausgewählte Insights',
    knowledgeClusters: 'Cluster',
    frontierStreams: 'Frontier',
    signalCount: '{count} insights',
    curatedAcross: 'kuratiert in {count} Nischen',
    noSignals: 'Keine Insights',
    browseTopics: 'Themen durchsuchen',
    networkState: 'UniTeia Netzwerkstatus',
    signalIntake: 'Insight-Aufnahme',
    deliveryLayer: 'Zustellungsebene',
  },
  onboarding: {
    step1: {
      title: 'Die Welt ist laut.',
      subtitle: 'Wir filtern das Insight.',
      desc: '{siteName} nimmt täglich Tausende von Quellen auf und extrahiert, was zählt. Damit Sie es nicht tun müssen.',
    },
    step2: {
      title: 'Jedes Insight durchläuft 7 Filter, bevor es dich erreicht.',
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
    curating: '{niche} Insights heute',
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
  sketchnote: {
    template01: {
      title: 'Template 01 — Praktischer Visual-Explainer',
      subtitle: 'Erkläre Konzepte schnell mit visueller Logik',
      postIt: 'Sketchnotes + Code + Klarheit = Schneller lernen',
      mascotBubble: 'Machen wir es visuell.',
      steps: {
        hook: {
          kind: 'Hook',
          title: 'MCP für Devs',
          body: 'Verbinde KI-Agenten mit jedem Tool. Sicher. Zuverlässig. Erweiterbar.',
        },
        mistake: {
          kind: 'Häufiger Fehler',
          title: 'Zu glauben, MCP ist einfach eine weitere API.',
          body: 'APIs stellen Funktionen bereit. MCP geht weiter.',
          postIt: 'APIs stellen Funktionen bereit. MCP orchestriert Fähigkeiten für Agenten.',
        },
        analogy: {
          kind: 'Visuelle Analogie',
          title: 'MCP ist der Hub, der Agenten mit Tools verbindet.',
          body: 'Ein Protokoll. Viele Tools. Der Agent bleibt fokussiert.',
          items: ['Suche', 'Datenbank', 'Dateien', 'APIs'],
          agentLabel: 'KI-Agent',
        },
        diagram: {
          kind: 'Arbeitsdiagramm',
          title: 'So funktioniert MCP Ende zu Ende',
          body: 'Findet Q1-Umsatz\nVersteht und plant\nRouting, Auth, Kontext, Sicherheit\nFührt echte Arbeit aus\nStrukturierte Antwort',
          flow: ['Nutzer', 'KI-Agent', 'MCP-Server', 'Tools', 'Antwort'],
        },
        example: {
          kind: 'Praktisches Beispiel',
          title: 'Beispiel: Tool-Aufruf via MCP',
          body: 'Der Agent fragt via MCP. Der Server findet das passende Tool und führt aus.',
          caption: 'JSON-RPC-Anfrage',
        },
        use: {
          kind: 'Wann nutzen',
          title: 'Nutze MCP, wenn…',
          useHeader: 'Nutze MCP, wenn',
          useItems: [
            'Du mehrere Tools oder Datenquellen hast',
            'Du sicheren, kontrollierten Zugriff brauchst',
            'Du Agenten mit Kontext & Sicherheit handeln lassen willst',
            'Du Tools oder Teams skalieren willst',
          ],
          dontHeader: 'Nutze MCP nicht, wenn',
          dontItems: [
            'Du nur eine einfache API aufrufst',
            'Du keine Agent-Orchestrierung brauchst',
            'Du eine leichte Frontend-Integration willst',
            'Du nur einen öffentlichen Endpunkt freigibst',
          ],
        },
        pitfalls: {
          kind: 'Häufige Fallstricke',
          title: 'Vermeide diese Fallstricke:',
          items: [
            'Tools ohne Auth & Guardrails freigeben',
            'Den Agenten mit zu vielen Tools überladen.',
            'Kontext, Logging und Observability ignorieren.',
          ],
          tipHeader: 'Design für Sicherheit, Klarheit und Observability.',
          tip: 'Plane die Tool-Oberfläche, bevor du irgendetwas verdrahtest.',
        },
        nextStep: {
          kind: 'Nächster Schritt',
          title: 'Dein nächster Schritt:',
          items: [
            'Wähle ein echtes Tool zum Verbinden',
            'Designe das Tool-Schema',
            'Implementiere den MCP-Endpoint',
            'Füge Auth & Berechtigungen hinzu',
            'Teste mit deinem Agenten',
            'Füge Logging & Monitoring hinzu',
            'Dokumentiere für dein Team',
          ],
          closingNote: 'Starte klein. Liefere eine Fähigkeit. Iteriere.',
        },
      },
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      level: 'Für Einsteiger → Fortgeschrittene',
      footer: 'Für Lernende gebaut. Für Devs gedacht. Von UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Code-Rezept / Mini Build',
      subtitle: 'Lehre praktische Implementation, schnell.',
      postIt: 'Sketchnotes + Code + Klarheit + Schneller lernen',
      mascotBubble: 'Los, bauen wir.',
      steps: {
        result: {
          kind: 'Ergebnis',
          title: 'Endergebnis',
          body: 'Live-Zeichnen mit Canvas',
          caption: 'Sanfte Echtzeit-Tinte',
        },
        install: {
          kind: 'Installation',
          title: 'Füge die magische Freehand-Engine hinzu.',
          body: 'Ein Paket, null Konfig.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Code',
          title: 'Minimaler Code',
          body: 'Erfasse Punkte, erhalte einen sanften Strich.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Wie es funktioniert',
          title: 'Vom Input zur schönen Tinte.',
          body: 'Jedes Pointer-Event wird ein Strich.',
          flow: ['Mouse/Touch', 'Punkte', 'Spline (Glatt)', 'Canvas (Zeichnen)'],
          caption: 'Jedes Pointer-Event wird ein Strich.',
        },
        upgrade: {
          kind: 'Upgrade-Ideen',
          title: 'Mach es nützlich. Mach es deins.',
          body: 'Drei schnelle Wins, um weiterzukommen.',
          items: [
            { name: 'Speichern & Wiederöffnen', desc: 'Zeichnung als JSON speichern. Jederzeit wieder laden.' },
            { name: 'Undo / Redo', desc: 'Stack aus Strichen für reibungslose History halten.' },
            { name: 'Bild exportieren', desc: 'Canvas als PNG exportieren.' },
          ],
          caption: 'Drei schnelle Wins.',
        },
      },
      cta: 'Von der Idee zur Implementation',
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      footer: 'Für Lernende gebaut. Für Devs gedacht. Von UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Entscheidungs-Map / Visueller Vergleich',
      subtitle: 'Optionen vergleichen und schnell entscheiden',
      postIt: 'Sketchnotes + Code + Klarheit + Schneller lernen',
      mascotBubble: 'Wähle das beste Tool mit Logik.',
      panels: {
        question: {
          kind: 'Frage',
          title: 'Welches Whiteboard solltest du nutzen?',
          subtitle: '4 starke Optionen. Unterschiedliche Stärken.',
          tipTitle: 'Pro-Tipp',
          tip: 'Es gibt kein „Bestes“ — nur das Beste für deinen Use Case.',
        },
        options: {
          kind: 'Optionen',
          title: 'Options-Map',
          options: [
            { name: 'tldraw desktop', desc: 'App-ready. Volle Erfahrung. Integriert.' },
            { name: 'tldraw SDK', desc: 'In deiner App einbetten. Volle Kontrolle. Deine UI.' },
            { name: 'perfect-freehand + canvas', desc: 'Ultra-leicht. Top-Performance. Unendlicher Canvas.' },
            { name: 'Excalidraw', desc: 'Einfache Optik. Open Source. Schnell zu shippen.' },
          ],
        },
        decision: {
          kind: 'Entscheidung',
          title: 'Entscheidungslogik',
          subtitle: 'Ja/Nein beantworten, erstes Match nehmen.',
          rules: [
            { question: 'Willst du eine direkt nutzbare App?', yesTo: 'tldraw desktop' },
            { question: 'Willst du das Whiteboard in deiner App einbetten?', yesTo: 'tldraw SDK' },
            { question: 'Brauchst du ultraleicht + beste Performance?', yesTo: 'perfect-freehand + canvas' },
            { question: 'Willst du schlichten Look und Open Source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Von oben nach unten antworten. Nimm das erste „Ja“.',
        },
        summary: {
          kind: 'Zusammenfassung',
          title: 'Empfehlungen im Überblick',
          options: [
            { name: 'tldraw desktop', verdict: 'Am besten, wenn du eine komplette Whiteboard-App sofort nutzen willst.' },
            { name: 'tldraw SDK', verdict: 'Am besten, wenn du das Whiteboard in deinem Produkt einbetten und anpassen willst.' },
            { name: 'perfect-freehand + canvas', verdict: 'Am besten, wenn du maximale Performance und minimales Bundle brauchst.' },
            { name: 'Excalidraw', verdict: 'Am besten, wenn du Einfachheit, Open Source und eine saubere Zeichen-Experience willst.' },
          ],
          closingNote: 'Wähle das Tool, das zu deinen Constraints, Team und UX-Zielen passt.',
        },
      },
      cta: 'Schneller Vergleich für Builder',
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      footer: 'Für Lernende gebaut. Für Devs gedacht. Von UniTeia / ConteiXeia',
    },
  },
}
