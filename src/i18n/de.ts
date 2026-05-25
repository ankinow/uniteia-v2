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
    label: 'Language',
    current: 'Current language: {lang}',
    available: 'Available languages',
  },
  errorPages: {
    '404': {
      title: 'Page Not Found',
      message: "The page you're looking for doesn't exist or has been moved.",
      backHome: 'Back to Home',
    },
    '500': {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      retry: 'Retry',
    },
  },
  fallbackBanner: {
    message: 'This content is not available in your language. Showing in English.',
    dismiss: 'Dismiss',
  },
  article: {
    subjectsLabel: 'Subjects',
    sourcesLabel: 'Sources',
    published: 'Published',
    updated: 'Updated',
    byAuthor: 'by {author}',
    version: 'v{version}',
    readInLang: 'Read in {lang}',
  },
  niche: {
    topicsLabel: 'Topics',
    exploreNiche: 'Explore {niche}',
    articleCount: '{count} articles',
    allNiches: 'All Topics',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Trusted',
    caution: 'Caution',
    flagged: 'Flagged',
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
    topicsTitle: 'AI Topics',
    topicsDescription: 'Explore our curated list of Artificial Intelligence topics and niches.',
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
