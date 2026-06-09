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
      body: `<h2>1. Collecte des Données</h2>
<p>UniTeia collecte uniquement les données strictement nécessaires à la fourniture de son service de curation éditoriale. Les informations que nous pouvons collecter incluent : les données de navigation anonymisées (pages visitées, durée de session, préférences linguistiques), les journaux techniques standards (adresse IP, type de navigateur, système d'exploitation) conservés de manière agrégée, ainsi que les données de contact lorsque vous utilisez volontairement notre formulaire de contact (nom, adresse email, message). Aucune collecte de données personnelles sensibles au sens du RGPD (données de santé, opinions politiques, données biométriques) n'est effectuée à quelque moment que ce soit. Nous ne procédons à aucune collecte passive via des mécanismes de pistage invisibles ou des empreintes numériques de navigateur. Toute collecte est fondée sur une base légale claire : votre consentement explicite, l'exécution du service que vous avez demandé, ou notre intérêt légitime à améliorer la plateforme.</p>

<h2>2. Utilisation des Données</h2>
<p>Les données collectées sont utilisées exclusivement aux fins suivantes : fournir, maintenir et améliorer le service de curation UniTeia et ses performances techniques ; personnaliser votre expérience de navigation, notamment la sélection de la langue d'affichage et la sauvegarde de vos préférences de lecture ; analyser de manière agrégée et anonymisée les tendances d'utilisation pour orienter le développement de nouvelles fonctionnalités éditoriales ; communiquer avec vous en réponse à vos demandes envoyées via le formulaire de contact ; garantir la sécurité et la stabilité de notre infrastructure technique. Nous ne traitons jamais vos données à des fins de profilage automatisé, de scoring, de publicité comportementale ou de segmentation marketing. Aucune décision entièrement automatisée produisant des effets juridiques vous concernant n'est prise sur la base des données collectées. Chaque traitement est documenté, limité dans le temps et proportionné à sa finalité.</p>

<h2>3. Cookies et Technologies Similaires</h2>
<p>UniTeia utilise exclusivement des cookies techniques strictement nécessaires au fonctionnement du site. Ces cookies sont exemptés de consentement selon l'article 82 de la Loi Informatique et Libertés et la directive ePrivacy. Ils incluent : un cookie de session pour maintenir votre navigation active (durée de vie : la session de navigation), un cookie de préférence linguistique pour mémoriser votre choix de langue parmi les huit langues disponibles (durée de vie : 12 mois), et un cookie technique de répartition de charge pour assurer la distribution équilibrée du trafic sur nos serveurs (durée de vie : la session). Nous n'utilisons aucun cookie de pistage, cookie publicitaire, cookie de réseau social, cookie analytique tiers, pixel espion, balise web, stockage local HTML5 à des fins de traçage, ou toute autre technologie de suivi. Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies ; les cookies strictement nécessaires étant exemptés, le service reste pleinement fonctionnel même avec des paramètres de blocage stricts.</p>

<h2>4. Partage avec les Tiers</h2>
<p>UniTeia s'engage à ne jamais vendre, louer, échanger ou monétiser vos données personnelles auprès de tiers. Les seuls transferts de données techniques vers des tiers sont : notre fournisseur d'hébergement Cloudflare Pages, qui traite les journaux techniques dans le cadre de la fourniture de l'infrastructure réseau, et notre service de déploiement continu, qui accède aux métadonnées anonymisées de build. Ces sous-traitants agissent uniquement sur instruction documentée d'UniTeia et sont liés par des clauses contractuelles de confidentialité et de sécurité conformes au RGPD. Les données restent hébergées au sein de l'Union Européenne ou dans des pays bénéficiant d'une décision d'adéquation de la Commission Européenne. En cas de transfert hors UE, des clauses contractuelles types et des garanties complémentaires sont systématiquement mises en place. Aucune donnée n'est communiquée aux autorités sans une base légale claire et une procédure de vérification rigoureuse. Nous ne participons à aucun réseau publicitaire, place de marché de données, ou programme de partage de données entre entreprises.</p>

<h2>5. Conservation et Sécurité des Données</h2>
<p>Nous appliquons une politique de minimisation temporelle : les journaux techniques bruts (adresses IP, logs serveur) sont automatiquement supprimés ou anonymisés après 30 jours ; les données de contact (formulaire de contact) sont conservées pendant 12 mois à compter du dernier échange, puis définitivement effacées ; les préférences de langue et les cookies techniques suivent les durées indiquées dans la section Cookies. Les mesures de sécurité techniques et organisationnelles mises en œuvre incluent : chiffrement TLS 1.3 de toutes les communications entre votre navigateur et nos serveurs ; isolation réseau et segmentation stricte de nos infrastructures via les politiques de sécurité Cloudflare ; accès restreint aux données selon le principe du moindre privilège, avec authentification multifacteur obligatoire pour tout accès administratif ; audits de sécurité réguliers et mises à jour automatisées des dépendances logicielles via notre chaîne d'intégration continue ; surveillance continue des tentatives d'intrusion et politique de divulgation responsable des vulnérabilités. En cas de violation de données à caractère personnel, nous nous engageons à notifier la CNIL dans les 72 heures et les personnes concernées dans les meilleurs délais, conformément aux articles 33 et 34 du RGPD.</p>

<h2>6. Vos Droits</h2>
<p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la Loi Informatique et Libertés, vous disposez des droits suivants sur vos données personnelles : droit d'accès (article 15) — obtenir la confirmation que vos données sont traitées et en recevoir une copie ; droit de rectification (article 16) — corriger des données inexactes ou incomplètes ; droit à l'effacement ou « droit à l'oubli » (article 17) — obtenir la suppression de vos données dans les conditions prévues par la loi ; droit à la limitation du traitement (article 18) — geler temporairement l'utilisation de vos données ; droit à la portabilité (article 20) — recevoir vos données dans un format structuré et couramment utilisé ; droit d'opposition (article 21) — vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière ; droit de définir des directives post-mortem — déterminer le sort de vos données après votre décès. Pour exercer ces droits, contactez-nous à l'adresse indiquée dans la section Contact. Nous répondrons dans un délai maximal d'un mois, prolongeable de deux mois en cas de demande complexe. Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL), 3 Place de Fontenoy, 75007 Paris, ou via www.cnil.fr, si vous estimez que le traitement de vos données n'est pas conforme à la réglementation.</p>

<h2>7. Contact et Délégué à la Protection des Données</h2>
<p>Pour toute question relative à cette politique de confidentialité, pour exercer vos droits RGPD, ou pour signaler un problème de sécurité, vous pouvez nous contacter par email à privacy@uniteia.org. Notre responsable de traitement et notre délégué à la protection des données s'engagent à traiter chaque demande avec diligence et confidentialité. Vous pouvez également nous écrire à l'adresse postale suivante : UniTeia — Service Protection des Données, 7 Rue de l'Innovation, 75000 Paris, France. Nous nous réservons le droit de modifier cette politique de confidentialité pour refléter les évolutions légales, techniques ou fonctionnelles du service. Toute modification substantielle fera l'objet d'une notification visible sur la plateforme au moins 15 jours avant son entrée en vigueur. La version en vigueur est toujours consultable sur cette page. Dernière mise à jour : juin 2026.</p>`,
    },
    terms: {
      title: "Conditions d'Utilisation",
      body: `<h2>1. Acceptation des Conditions</h2>
<p>En accédant au site UniTeia (uniteia.org) et en utilisant ses services, vous reconnaissez avoir lu, compris et accepté sans réserve les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement toute utilisation de la plateforme. Ces conditions constituent un contrat légalement contraignant entre vous (l'Utilisateur) et UniTeia, exploitante du service. Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs enregistrés seront notifiés par email des modifications substantielles au moins 15 jours avant leur entrée en vigueur. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions. Il vous incombe de consulter régulièrement cette page pour prendre connaissance des éventuelles mises à jour.</p>

<h2>2. Description du Service</h2>
<p>UniTeia est une plateforme éditoriale multilingue de curation de contenus relatifs à l'intelligence artificielle, aux technologies émergentes et aux sciences connexes. Le service propose la collecte, la synthèse, la traduction en huit langues (français, anglais, portugais, espagnol, allemand, italien, japonais, chinois) et la diffusion de signaux informationnels issus de sources publiquement accessibles. Le contenu est généré et traité par un système automatisé de curation assisté par intelligence artificielle, supervisé par des processus de contrôle qualité éditorial. UniTeia ne garantit pas la disponibilité ininterrompue du service et se réserve le droit d'interrompre temporairement l'accès pour des raisons de maintenance, de sécurité ou de force majeure. Nous nous efforçons de maintenir une disponibilité optimale et de notifier à l'avance les interruptions programmées.</p>

<h2>3. Avertissement sur le Contenu</h2>
<p>Le contenu fourni sur UniTeia est exclusivement à titre informatif et ne constitue en aucun cas un avis professionnel, juridique, financier, médical, fiscal, ou de toute autre nature réglementée. Bien que nous mettions en œuvre des processus rigoureux de vérification et de contrôle qualité éditorial, UniTeia ne garantit pas l'exactitude, l'exhaustivité, l'actualité ou la pertinence des informations diffusées. Les signaux et articles publiés reflètent une synthèse automatisée de sources publiques et ne représentent pas nécessairement la position officielle d'UniTeia. Toute décision prise sur la base des informations obtenues via la plateforme relève de votre seule responsabilité. Nous vous recommandons vivement de vérifier toute information critique auprès de sources primaires et de consulter des professionnels qualifiés pour toute décision importante.</p>

<h2>4. Propriété Intellectuelle</h2>
<p>L'ensemble des éléments constituant la plateforme UniTeia — notamment le code source, les algorithmes de curation, la structure de la base de données, le design graphique, les interfaces utilisateur, les marques, les logos et le contenu éditorial original — sont la propriété exclusive d'UniTeia ou de ses concédants de licence et sont protégés par les lois françaises et internationales sur la propriété intellectuelle. Le code source est disponible sous licence open source (AGPL v3) conformément aux conditions publiées dans notre dépôt public. Les résumés et synthèses générés par notre système de curation sont distribués sous licence Creative Commons Attribution 4.0 International (CC BY 4.0), sauf mention contraire. Toute reproduction, représentation, modification, adaptation, traduction ou exploitation non autorisée de la plateforme ou de son contenu est strictement interdite et peut faire l'objet de poursuites judiciaires.</p>

<h2>5. Conduite des Utilisateurs</h2>
<p>En utilisant UniTeia, vous vous engagez à respecter les règles de conduite suivantes : ne pas utiliser la plateforme à des fins illégales, frauduleuses ou non autorisées ; ne pas perturber le fonctionnement normal du service, notamment par l'envoi de requêtes automatisées abusives, l'exploitation de vulnérabilités ou toute forme d'attaque par déni de service ; ne pas tenter d'accéder sans autorisation à nos systèmes, serveurs ou bases de données ; ne pas collecter ou extraire des données de la plateforme par des moyens automatisés sans notre consentement écrit préalable (web scraping, harvesting) ; ne pas publier, transmettre ou partager via nos formulaires de contact tout contenu illégal, diffamatoire, injurieux, obscène, menaçant ou portant atteinte aux droits des tiers. Nous nous réservons le droit de suspendre ou de bloquer l'accès à tout utilisateur qui enfreindrait ces règles, sans préjudice de toute action en justice.</p>

<h2>6. Limitation de Responsabilité</h2>
<p>Dans toute la mesure permise par la loi applicable, UniTeia décline toute responsabilité pour : les dommages directs ou indirects, y compris la perte de données, de revenus, de clientèle, de bénéfices ou d'opportunités, résultant de l'utilisation ou de l'impossibilité d'utiliser le service ; l'inexactitude, l'incomplétude ou l'obsolescence des informations diffusées ; les décisions prises sur la base du contenu de la plateforme ; les interruptions de service, les erreurs techniques, les virus ou tout autre élément nuisible pouvant affecter votre équipement informatique ; le contenu des sites tiers accessibles via des liens hypertextes présents sur la plateforme. Notre responsabilité totale, quelle qu'en soit la cause, est limitée au montant le plus faible entre les dommages directs prouvés et la somme de 100 euros. Cette limitation ne s'applique pas en cas de fraude, de faute intentionnelle, de dommages corporels ou de violation d'une obligation essentielle, ni lorsque la loi applicable ne permet pas une telle limitation.</p>

<h2>7. Liens vers des Sites Tiers</h2>
<p>La plateforme UniTeia peut contenir des liens hypertextes pointant vers des sites web tiers, notamment les sources originales des articles et signaux que nous curatons. Ces liens sont fournis uniquement à titre de commodité et de transparence éditoriale. UniTeia n'exerce aucun contrôle sur le contenu, les politiques de confidentialité, les pratiques de sécurité ou les conditions d'utilisation de ces sites tiers. L'inclusion d'un lien ne constitue ni une approbation, ni une validation, ni une recommandation du contenu du site lié. Nous déclinons toute responsabilité quant aux informations, produits, services ou pratiques de ces tiers. Il vous appartient de prendre connaissance des conditions d'utilisation et des politiques de confidentialité de chaque site que vous visitez. Tout échange ou transaction entre vous et un site tiers relève exclusivement de votre relation avec ce tiers.</p>

<h2>8. Droit Applicable et Juridiction</h2>
<p>Les présentes Conditions Générales d'Utilisation sont régies et interprétées conformément au droit français. En cas de litige relatif à leur interprétation, leur exécution ou leur validité, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut d'accord amiable dans un délai de 60 jours à compter de la notification du litige par lettre recommandée avec accusé de réception, le litige sera soumis aux tribunaux compétents du ressort de la Cour d'Appel de Paris, nonobstant pluralité de défendeurs ou appel en garantie. Les utilisateurs consommateurs résidant dans l'Union Européenne bénéficient des dispositions protectrices impératives de leur droit national et peuvent saisir les juridictions de leur État membre de résidence. La Commission Européenne met à disposition une plateforme de règlement en ligne des litiges accessible à l'adresse https://ec.europa.eu/consumers/odr/.</p>

<h2>9. Résiliation</h2>
<p>UniTeia se réserve le droit de résilier ou de suspendre votre accès à la plateforme, avec ou sans préavis, en cas de violation des présentes conditions ou de tout comportement que nous jugeons, à notre discrétion raisonnable, nuisible à la plateforme, à ses utilisateurs ou à des tiers. Les motifs de résiliation incluent notamment : la violation répétée des règles de conduite, l'utilisation frauduleuse du service, les atteintes à la sécurité de l'infrastructure, ou toute action susceptible d'engager la responsabilité civile ou pénale d'UniTeia. En cas de résiliation, les dispositions des présentes conditions qui, par leur nature, sont destinées à survivre à la résiliation (notamment les sections relatives à la Propriété Intellectuelle, à la Limitation de Responsabilité et au Droit Applicable) resteront en vigueur. Vous pouvez à tout moment cesser d'utiliser le service sans formalité particulière.</p>

<h2>10. Contact et Informations Légales</h2>
<p>Pour toute question relative aux présentes Conditions Générales d'Utilisation, pour signaler un contenu que vous estimez inapproprié, ou pour toute demande d'information légale, vous pouvez nous contacter par email à legal@uniteia.org. Nous nous efforçons de répondre à toute demande dans un délai de 5 jours ouvrés. UniTeia est exploitée par l'association UniTeia, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro SIRET à venir, dont le siège social est situé 7 Rue de l'Innovation, 75000 Paris, France. Directeur de la publication : le président de l'association. Hébergeur : Cloudflare Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis. Dernière mise à jour : juin 2026.</p>`,
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
