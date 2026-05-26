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
      title: 'Jedes Signal durchläuft 7 Qualitätsprüfungen, bevor es Sie erreicht.',
    },
    step3: {
      title: 'Verfügbar in 8 Sprachen.',
      desc: 'Nur was zählt. In Ihrer Sprache, zu Ihren Bedingungen.',
      badge: '8 Stimmen',
    },
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
