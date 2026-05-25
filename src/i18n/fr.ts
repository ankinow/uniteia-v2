import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const fr: TranslationStrings = {
  nav: {
    home: 'Accueil',
    about: 'À propos',
    blog: 'Blog',
    projects: 'Projets',
    contact: 'Contact',
    topics: 'Sujets',
    search: 'Rechercher',
    niches: 'Niches',
  },
  footer: {
    copyright: '© {year} UniTeia. Tous droits réservés.',
    madeWith: "Fait avec ♥ pour l'IA décentralisée",
    links: {
      privacy: 'Politique de Confidentialité',
      terms: "Conditions d'Utilisation",
      source: 'Code Source',
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
    qualityScore: 'Score de Qualité',
    editorialQuality: 'Qualité Éditoriale',
  },
  dopamineCard: {
    readMore: 'Lire la suite',
  },
  signal: {
    qualityLabel: 'Qualité',
    sourceCount: '{count} sources',
    sources: 'sources',
  },
  search: {
    placeholder: 'Rechercher des sujets, articles...',
    resultsFor: 'Résultats pour "{query}"',
    noResults: 'Aucun résultat',
    noResultsHint: 'Essayez différents mots-clés ou parcourez nos sujets',
    resultCount: '{count} résultats',
    searchTitle: 'Rechercher',
    searchDescription: 'Rechercher des articles et sujets sur UniTeia',
  },
  seo: {
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'AI Topics',
    topicsDescription: 'Explore our curated list of Artificial Intelligence topics and niches.',
  },
  onboarding: {
    step1: {
      title: 'Le monde est bruyant.',
      subtitle: 'Nous filtrons le signal.',
      desc: "{siteName} ingère des milliers de sources quotidiennement, extrayant l'essentiel. Pour que vous n'ayez pas à le faire.",
    },
    step2: {
      title: 'Chaque signal traverse 7 barrières de qualité avant de vous atteindre.',
    },
    step3: {
      title: 'Disponible en 8 langues.',
      desc: "Seulement l'essentiel. Dans votre langue, selon vos termes.",
      badge: '8 voix',
    },
  },
  legal: {
    privacy: {
      title: 'Politique de Confidentialité',
      body: 'Politique de Confidentialité. Votre vie privée est importante pour nous. Nous collectons et traitons les données minimales nécessaires pour fournir le service de curation UniTeia. Nous ne vendons pas vos données à des tiers. Cette politique décrit nos pratiques de collecte, de stockage et de traitement des données.',
    },
    terms: {
      title: "Conditions d'Utilisation",
      body: "Conditions d'Utilisation. En utilisant UniTeia, vous acceptez ces conditions. Le contenu fourni est à titre informatif uniquement et ne constitue pas un avis professionnel. Nous nous réservons le droit de modifier ces conditions à tout moment.",
    },
  },
}
