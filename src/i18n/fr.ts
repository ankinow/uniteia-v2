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
    breadcrumb: {
      label: 'Vous êtes ici:',
      signals: 'Insights',
    },
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
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Constructeur de Flux de Travail Magica',
      unifiedPromptEngineering:
        'Ingénierie de prompts, routage de modèles et évaluation unifiés dans une interface',
      magicaCommandCenter: 'Magica : Le Centre de Commande IA',
      magicaDescription:
        "Magica unifie l'ingénierie de prompts, le routage de modèles et l'évaluation dans une interface",
      aiProcessing: 'Traitement IA',
      nodeBasedPromptChaining: 'Chaînage de prompts par nœuds',
      architecture: 'Architecture',
      multiModelFallback: 'Routage fallback multi-modèle',
      startBuilding: 'Commencez à Construire',
      tryMagicaFree: 'Essayez Magica gratuitement — sans carte de crédit',
      visitMagica: 'Visiter Magica',
      qualityScore: 'Score de Qualité',
      languages: 'Langues',
      workflowVisualization: 'Visualisation du Flux de Travail',
      keyMetrics: 'Métriques Clés',
      workflowSteps: 'Étapes du Flux',
      poweredBy: 'Propulsé par',
    },
    canvaMagica: {
      workflowTitle: 'Constructeur de Flux de Travail Magica',
      inputLabel: 'ENTRÉE',
      aiProcessing: {
        title: 'TRAITEMENT IA',
        subtitle: 'Enchaînement de prompts par nœuds',
      },
      languages: '8 langues',
      qualityScore: '',
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
    qualityScore: '',
    editorialQuality: 'Qualité Éditoriale',
  },
  dopamineCard: {
    readMore: 'Lire la suite',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} sources',
    sources: 'sources',
    freshnessLabel: '',
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
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'Sujets IA',
    topicsDescription:
      'Explorez notre liste sélectionnée de sujets et de niches en Intelligence Artificielle.',
  },
  homepage: {
    featuredSignals: 'Insights à la Une',
    knowledgeClusters: 'Clusters',
    frontierStreams: 'Frontière',
    signalCount: '{count} insights',
    curatedAcross: 'organisés dans {count} niches',
    noSignals: 'Aucun insight publié dans cette langue.',
    browseTopics: 'Parcourir les sujets',
    networkState: 'État du Réseau UniTeia',
    signalIntake: "Captation d'Insights",
    deliveryLayer: 'Couche de Livraison',
  },
  onboarding: {
    step1: {
      title: 'Le monde est bruyant.',
      subtitle: "Nous filtrons l'insight.",
      desc: "{siteName} ingère des milliers de sources quotidiennement, extrayant l'essentiel. Pour que vous n'ayez pas à le faire.",
    },
    step2: {
      title: 'Chaque insight traverse 7 filtres avant de vous atteindre.',
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
    curating: "{niche} insights aujourd'hui",
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
  canva: {
    hero: {
      title: 'Concevez à la vitesse de la pensée',
      subtitle: 'Un canevas visuel pour les flux éditoriaux avec IA',
      cta: "Commencer l'exploration",
    },
    concept: {
      central: 'Un canevas, plusieurs formes — composable par intention',
      satellite: {
        1: 'Glissez, déposez et recâblez les nœuds sans quitter la page',
        2: 'Chaque modification se reflète dans 8 langues simultanément',
      },
    },
    code: {
      step: {
        1: {
          title: 'Définir le prompt',
          body: 'Commencez par une intention en langage naturel. Le canevas la transforme en nœuds structurés.',
        },
        2: {
          title: 'Connecter le routeur de modèles',
        },
      },
    },
    compare: {
      option: {
        a: 'Outil de design statique',
        b: 'UniTeia Canva',
      },
      decision: {
        yes: 'Adapté à notre pipeline éditorial',
        no: 'Mauvais outil pour les flux IA multilingues',
      },
    },
    timeline: {
      milestone: {
        1: '2026 T1 — Canva Magica alpha privé',
        2: '2026 T3 — Lancement public avec parité en 8 langues',
      },
    },
    summary: {
      takeaway: {
        1: 'Un seul canevas qui parle toutes les langues dans lesquelles vous publiez',
        2: 'Composition visuelle sans renoncer aux données structurées',
      },
      nextstep: 'Ouvrez le canevas, déposez votre première forme et publiez en 8 langues',
    },
  },
}
