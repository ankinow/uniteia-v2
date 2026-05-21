import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const it: TranslationStrings = {
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    projects: 'Projects',
    contact: 'Contact',
    topics: 'Topics',
  },
  footer: {
    copyright: '© {year} UniTeia. All rights reserved.',
    madeWith: 'Made with ♥ for decentralized AI',
    links: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      source: 'Source Code',
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
    topicsTitle: 'AI Topics',
    topicsDescription: 'Explore our curated list of Artificial Intelligence topics and niches.',
  },
  onboarding: {
    step1: {
      title: 'Il mondo è rumoroso.',
      subtitle: 'Noi filtriamo il segnale.',
      desc: '{siteName} assimila migliaia di fonti ogni giorno, estraendo ciò che conta. Così tu non devi farlo.',
    },
    step2: {
      title: 'Ogni segnale attraversa 7 filtri di qualità prima di raggiungerti.',
    },
    step3: {
      title: 'Disponibile in 8 lingue.',
      desc: 'Solo ciò che conta. Nella tua lingua, alle tue condizioni.',
      badge: '8 voci',
    },
  },
}
