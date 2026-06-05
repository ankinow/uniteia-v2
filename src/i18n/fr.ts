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
      backHome: "Retour à l'Apex",
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
    frontierStreamsOne: 'Frontière',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'organisés dans {count} niches',
    curatedAcrossOne: 'organisé dans 1 niche',
    noSignals: 'Aucun insight publié dans cette langue.',
    browseTopics: 'Parcourir les sujets',
    networkState: 'État du Réseau UniTeia',
    signalIntake: "Captation d'Insights",
    deliveryLayer: 'Couche de Livraison',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
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
    apexBadge: 'APEX · En Direct',
    headline: 'Signaux frontières de {count} canaux',
    headlineOne: 'Signaux frontières de 1 canal',
    tracksLabel: 'canaux actifs',
    tracksLabelOne: 'canal actif',
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
  sketchnote: {
    template01: {
      title: 'Template 01 — Explicateur Visuel Pratique',
      subtitle: 'Expliquez les concepts vite, avec la logique visuelle',
      postIt: 'Sketchnotes + Code + Clarté = Apprentissage plus rapide',
      mascotBubble: 'Rendez-le visuel.',
      steps: {
        hook: {
          kind: 'Accroche',
          title: 'MCP pour les devs',
          body: 'Connectez des agents IA à n’importe quel outil. Sûr. Fiable. Extensible.',
        },
        mistake: {
          kind: 'Erreur courante',
          title: 'Croire que MCP est juste une autre API.',
          body: 'Les APIs exposent des fonctions. MCP va plus loin.',
          postIt: 'Les APIs exposent des fonctions. MCP orchestre des capacités pour les agents.',
        },
        analogy: {
          kind: 'Analogie visuelle',
          title: 'MCP est le hub qui relie les agents aux outils.',
          body: 'Un protocole. Beaucoup d’outils. L’agent reste focalisé.',
          items: ['Recherche', 'Base de données', 'Fichiers', 'APIs'],
          agentLabel: 'Agent IA',
        },
        diagram: {
          kind: 'Diagramme fonctionnel',
          title: 'Comment MCP fonctionne de bout en bout',
          body: 'Trouve le revenu Q1\nComprend et planifie\nRoute, auth, contexte, sécurité\nExécute le vrai travail\nRéponse structurée',
          flow: ['Utilisateur', 'Agent IA', 'Serveur MCP', 'Outils', 'Réponse'],
        },
        example: {
          kind: 'Exemple pratique',
          title: 'Exemple : appel d’outil via MCP',
          body: 'L’agent demande via MCP. Le serveur trouve le bon outil et exécute.',
          caption: 'Requête JSON-RPC',
        },
        use: {
          kind: 'Quand utiliser',
          title: 'Utilisez MCP quand…',
          useHeader: 'Utilisez MCP quand',
          useItems: [
            'Vous avez plusieurs outils ou sources de données',
            'Vous avez besoin d’un accès sécurisé et gouverné',
            'Vous voulez que les agents agissent avec contexte et sécurité',
            'Vous comptez faire évoluer outils ou équipes',
          ],
          dontHeader: 'N’utilisez pas MCP quand',
          dontItems: [
            'Vous n’appelez qu’une seule API simple',
            'Vous n’avez pas besoin d’orchestration d’agents',
            'Vous voulez une intégration front-end légère',
            'Vous exposez juste un endpoint public',
          ],
        },
        pitfalls: {
          kind: 'Pièges courants',
          title: 'Évitez ces pièges :',
          items: [
            'Exposer des outils sans auth ni garde-fous adaptés',
            'Surcharger l’agent avec trop d’outils.',
            'Ignorer contexte, logs et observabilité.',
          ],
          tipHeader: 'Concevez pour la sécurité, la clarté et l’observabilité.',
          tip: 'Planifiez la surface d’outils avant de câbler quoi que ce soit.',
        },
        nextStep: {
          kind: 'Prochaine étape',
          title: 'Votre prochaine étape :',
          items: [
            'Choisissez un vrai outil à connecter',
            'Concevez le schéma de l’outil',
            'Implémentez l’endpoint MCP',
            'Ajoutez auth et permissions',
            'Testez avec votre agent',
            'Ajoutez logs et monitoring',
            'Documentez pour votre équipe',
          ],
          closingNote: 'Commencez petit. Livrez une capacité. Itérez.',
        },
      },
      tags: {
        visualLogic: 'Logique visuelle',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratique par design',
      },
      level: 'Du débutant à l’intermédiaire',
      footer: 'Pensé pour apprendre. Conçu pour les devs. Par UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Recette de code / Mini Build',
      subtitle: 'Enseignez l’implémentation pratique, vite.',
      postIt: 'Sketchnotes + Code + Clarté + Apprentissage plus rapide',
      mascotBubble: 'Construisons.',
      steps: {
        result: {
          kind: 'Résultat',
          title: 'Résultat final',
          body: 'Dessin en direct avec Canvas',
          caption: 'Encre fluide en temps réel',
        },
        install: {
          kind: 'Installation',
          title: 'Ajoutez le moteur freehand magique.',
          body: 'Un paquet, zéro config.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Code',
          title: 'Code minimal',
          body: 'Capturez les points, obtenez un trait fluide.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Comment ça marche',
          title: 'De l’entrée à la belle encre.',
          body: 'Chaque événement pointer devient un trait.',
          flow: ['Mouse/Touch', 'Points', 'Spline (Lisse)', 'Canvas (Dessin)'],
          caption: 'Chaque événement pointer devient un trait.',
        },
        upgrade: {
          kind: 'Idées d’upgrade',
          title: 'Rendez-le utile. Rendez-le vôtre.',
          body: 'Trois gains rapides pour aller plus loin.',
          items: [
            {
              name: 'Sauvegarder & Rouvrir',
              desc: 'Stockez le dessin en JSON. Rechargez-le à tout moment.',
            },
            {
              name: 'Annuler / Refaire',
              desc: 'Gardez une pile de traits pour un historique sans friction.',
            },
            { name: 'Exporter Image', desc: 'Exportez le canvas en PNG.' },
          ],
          caption: 'Trois gains rapides.',
        },
      },
      cta: 'De l’idée à l’implémentation',
      tags: {
        visualLogic: 'Logique visuelle',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratique par design',
      },
      footer: 'Pensé pour apprendre. Conçu pour les devs. Par UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Carte de décision / Comparatif visuel',
      subtitle: 'Comparez les options et choisissez vite',
      postIt: 'Sketchnotes + Code + Clarté + Apprentissage plus rapide',
      mascotBubble: 'Choisissez le bon outil avec logique.',
      panels: {
        question: {
          kind: 'Question',
          title: 'Quel tableau blanc choisir ?',
          subtitle: '4 très bonnes options. Forces différentes.',
          tipTitle: 'Astuce pro',
          tip: 'Il n’y a pas de « meilleur » — seulement le meilleur pour votre cas.',
        },
        options: {
          kind: 'Options',
          title: 'Carte des options',
          options: [
            { name: 'tldraw desktop', desc: 'App prête. Expérience complète. Intégré.' },
            { name: 'tldraw SDK', desc: 'À embarquer dans votre app. Contrôle total. Votre UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-léger. Excellente perf. Canvas infini.',
            },
            { name: 'Excalidraw', desc: 'Esthétique simple. Open source. Rapide à livrer.' },
          ],
        },
        decision: {
          kind: 'Décision',
          title: 'Logique de décision',
          subtitle: 'Répondez oui/non, suivez le premier match.',
          rules: [
            { question: 'Vous voulez une app prête à l’emploi ?', yesTo: 'tldraw desktop' },
            { question: 'Vous voulez embarquer le tableau dans votre app ?', yesTo: 'tldraw SDK' },
            {
              question: 'Besoin d’ultra-léger avec la meilleure perf ?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Un look simple, propre et open source ?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Répondez de haut en bas. Prenez le premier « Oui ».',
        },
        summary: {
          kind: 'Résumé',
          title: 'Résumé des recommandations',
          options: [
            {
              name: 'tldraw desktop',
              verdict:
                'Le meilleur quand vous voulez un app tableau blanc complet, prêt à l’emploi.',
            },
            {
              name: 'tldraw SDK',
              verdict:
                'Le meilleur quand vous voulez embarquer et personnaliser le tableau dans votre produit.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict:
                'Le meilleur quand vous avez besoin de perf maximale et d’un bundle minimal.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Le meilleur quand vous voulez la simplicité, l’open source et une expérience de dessin épurée.',
            },
          ],
          closingNote:
            'Choisissez l’outil qui colle à vos contraintes, à l’équipe et à vos objectifs UX.',
        },
      },
      cta: 'Comparaison rapide pour builders',
      tags: {
        visualLogic: 'Logique visuelle',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratique par design',
      },
      footer: 'Pensé pour apprendre. Conçu pour les devs. Par UniTeia / ConteiXeia',
    },
  },
  canva: {
    hero: {
      title: 'Le signal sur lequel on peut bâtir',
      subtitle: 'Six scènes, une décision',
      cta: 'Ouvrir le canvas',
    },
    concept: {
      central: 'Pourquoi cela compte maintenant',
      satellite: { '1': 'Décisions plus rapides', '2': 'Signal plus net' },
    },
    code: {
      step: {
        '1': {
          title: 'Connecter la base',
          body: 'Vingt lignes, trois fichiers, un flux qui marche.',
        },
        '2': { title: 'Ajouter la couche suivante' },
      },
    },
    compare: {
      option: { a: 'Construire soi-même', b: 'Utiliser la plateforme' },
      decision: { yes: 'Oui, si cela se rentabilise', no: 'Non, la plateforme est déjà là' },
    },
    timeline: { milestone: { '1': "Aujourd'hui : un shape", '2': 'Six mois : un canvas complet' } },
    summary: {
      takeaway: {
        '1': 'Commencez plus petit que ce qui semble juste',
        '2': 'Réutiliser bat réinventer',
      },
      nextstep: 'Construisez la plus petite chose qui marche',
    },
  },
}
