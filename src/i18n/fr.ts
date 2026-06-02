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
  sidebar: {
    interfaceLabel: 'Interface Compacte',
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
    label: 'Langue',
    current: 'Langue actuelle : {lang}',
    available: 'Langues disponibles',
  },
  errorPages: {
    '404': {
      title: 'Page non trouvée',
      message: "La page que vous recherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil",
    },
    '500': {
      title: 'Erreur serveur',
      message: 'Un problème est survenu de notre côté. Veuillez réessayer plus tard.',
      retry: 'Réessayer',
    },
  },
  fallbackBanner: {
    message: "Ce contenu n'est pas disponible dans votre langue. Affichage en anglais.",
    dismiss: 'Fermer',
  },
  article: {
    subjectsLabel: 'Sujets',
    sourcesLabel: 'Sources',
    published: 'Publié',
    updated: 'Mis à jour',
    byAuthor: 'par {author}',
    version: 'v{version}',
    readInLang: 'Lire en {lang}',
    magica: {
      insight: {
        title: 'Magica : Le Centre de Commandement IA',
        body: "Magica unifie l'ingénierie de prompts, le routage de modèles et l'évaluation dans une seule interface.",
      },
      evidence: {
        title: 'Visualisation de Flux de Travail',
        alt: "Capture d'écran du constructeur de flux de travail Magica",
      },
      architecture: {
        title: 'Architecture',
        point1: 'Enchaînement de prompts par nœuds',
        point2: 'Routage de secours multi-modèle',
        point3: 'Télémétrie de latence en temps réel',
      },
      cta: {
        title: 'Commencer à Construire',
        body: 'Essayez Magica gratuitement — aucune carte de crédit requise.',
        button: 'Visiter Magica',
      },
    },
    canvaMagica: {
      workflowTitle: 'Constructeur de Flux de Travail Magica',
      inputLabel: 'ENTRÉE',
      aiProcessing: {
        title: 'TRAITEMENT IA',
        subtitle: "Enchaînement de prompts par nœuds",
      },
      qualityScore: '84 score de qualité',
      languages: '8 langues',
      outputLabel: 'Prompt → Routeur de Modèles → Sortie',
    },
  },
  niche: {
    topicsLabel: 'Sujets',
    exploreNiche: 'Explorer {niche}',
    articleCount: '{count} articles',
    allNiches: 'Tous les sujets',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Fiable',
    caution: 'Attention',
    flagged: 'Signalé',
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
    freshnessLabel: 'Fraîcheur',
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
    topicsTitle: 'Sujets IA',
    topicsDescription:
      'Explorez notre liste sélectionnée de sujets et de niches en Intelligence Artificielle.',
  },
  homepage: {
    featuredSignals: 'Signaux en Vedette',
    knowledgeClusters: 'Grappes de Connaissances',
    frontierStreams: 'Courants de Frontière',
    signalCount: '{count} signaux',
    curatedAcross: 'organisés dans {count} niches',
    noSignals: 'Aucun signal publié dans cette langue.',
    browseTopics: 'Parcourir les sujets',
    networkState: 'État du Réseau UniTeia',
    signalIntake: 'Captation de Signaux',
    deliveryLayer: 'Couche de Livraison',
  },
  onboarding: {
    step1: {
      title: 'Le monde est bruyant.',
      subtitle: 'Nous filtrons le signal.',
      desc: "{siteName} ingère des milliers de sources quotidiennement, extrayant l'essentiel. Pour que vous n'ayez pas à le faire.",
    },
    step2: {
      title: 'Chaque signal traverse 7 barrières de qualité avant de vous atteindre.',
      cards: [
        {
          label: 'Recherche',
          desc: 'Les sources brutes sont ingérées et notées selon leur fiabilité.',
        },
        {
          label: 'Vérification',
          desc: 'Les affirmations sont recoupées avec des sources indépendantes.',
        },
        {
          label: 'Structuration',
          desc: 'Le contenu est formaté, localisé et préparé pour la livraison.',
        },
      ],
    },
    step3: {
      title: 'Disponible en 8 langues.',
      desc: "Seulement l'essentiel. Dans votre langue, selon vos termes.",
      badge: '8 voix',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Inactif',
      thinking: 'Aether OS · Réflexion',
      processing: 'Aether OS · Traitement',
      complete: 'Aether OS · Terminé',
      error: 'Aether OS · Erreur',
    },
    mcpTooltip: 'Serveur MCP Connecté · 7 outils actifs',
  },
  generativeHero: {
    curating: "Curation {niche} aujourd'hui",
    topNiches: 'Principaux Sujets',
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
