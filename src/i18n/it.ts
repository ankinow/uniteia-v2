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
