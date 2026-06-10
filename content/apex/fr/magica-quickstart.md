1|---
2|slug: magica-quickstart
3|lang: fr
4|title: Premiers Pas avec Magica
5|verdict: trusted
6|quality_score: 95
7|subjects:
8|  - magica
9|  - tutorial
10|  - quickstart
11|  - ai-workflows
12|referral_links: []
13|metadata:
14|  created_at: "2026-06-09T04:00:22.795Z"
15|  updated_at: "2026-06-09T04:00:22.795Z"
16|  author: UniTeia System
17|  version: 1
18|canvas:
19|  tone: coral
20|  layout: timeline-spiral
21|  nodes:
22|    - id: hero
23|      section: 0
24|      type: hero
25|    - id: signup
26|      section: 1
27|      type: card
28|    - id: first-query
29|      section: 2
30|      type: card
31|    - id: multi-model
32|      section: 3
33|      type: card
34|    - id: image-gen
35|      section: 4
36|      type: card
37|    - id: workflow
38|      section: 5
39|      type: card
40|    - id: export
41|      section: 6
42|      type: card
43|    - id: next-steps
44|      section: 7
45|      type: card
46|  connectors:
47|    - from: hero
48|      to: signup
49|    - from: signup
50|      to: first-query
51|    - from: first-query
52|      to: multi-model
53|    - from: multi-model
54|      to: image-gen
55|    - from: image-gen
56|      to: workflow
57|    - from: workflow
58|      to: export
59|    - from: export
60|      to: next-steps
61|---
62|# Débuter avec Magica
63|
64|## Créer votre compte
65|

> 💡 **Transparence :** UniTeia peut percevoir une commission sur les inscriptions via les liens de cette page. Cela n'affecte pas notre évaluation. Voir notre [politique éthique](/ethics).

66|Rendez-vous sur [try.magica.com/clique-serio](https://try.magica.com/clique-serio) et inscrivez-vous pour le niveau gratuit — aucune carte de crédit requise. Utilisez le code promo **GXZMYCP** sur la [page de récompenses](https://try.magica.com/redeem) pour obtenir **10M de crédits bonus** (parfait pour les vidéos, podcasts et la voix). Le niveau gratuit vous donne un accès limité à tous les principaux modèles, suffisant pour évaluer la plateforme en profondeur avant de vous engager.
67|
68|Une fois inscrit, vous atterrissez sur l'espace de travail Magica. L'interface comporte trois zones principales : le sélecteur de modèles (en haut), l'espace de conversation (au centre) et le tiroir d'outils (barre latérale droite avec plus de 5 900 outils préconstruits).
69|
70|## Votre première requête multi-modèle
71|
72|Cliquez sur le sélecteur de modèles en haut et activez 2-3 modèles — commencez avec [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) et Gemini 2.5 Pro. Tapez une question dans le champ de saisie et appuyez sur envoyer. Magica envoie votre requête à tous les modèles sélectionnés simultanément et affiche les réponses côte à côte.
73|
74|Cette comparaison multi-modèle est la fonctionnalité phare de Magica. Vous voyez immédiatement comment chaque modèle aborde la même invite — Claude tend vers une analyse approfondie, GPT vers une action pratique, Gemini vers une synthèse équilibrée. Avec le temps, vous apprenez à quel modèle faire confiance pour quel type de tâche.
75|
76|## Générer votre première image
77|
78|Ouvrez le tiroir d'outils et passez à l'onglet Image. Sélectionnez FLUX 2 Max dans la liste déroulante des modèles. Écrivez une invite — soyez descriptif mais sans trop en faire. Cliquez sur générer. En quelques secondes, vous avez quatre variations parmi lesquelles choisir.
79|
80|Utilisez le panneau d'édition pour affiner : agrandissez la variante choisie, supprimez l'arrière-plan ou régénérez des zones spécifiques avec l'inpainting. Magica regroupe ces outils d'édition dans la même interface — pas besoin d'ouvrir Photoshop ou un éditeur IA séparé.
81|
82|## Créer un workflow simple
83|
84|Les workflows sont l'endroit où Magica transcende un simple chatbot. Cliquez sur l'onglet Workflows et sélectionnez Nouveau workflow. Vous verrez un éditeur de nœuds visuel — faites glisser un nœud d'entrée de texte, connectez-le à un nœud Générer une image (FLUX 2 Max), puis à un nœud d'agrandissement, et enfin à un nœud d'exportation.
85|
86|Définissez l'entrée de texte pour accepter une description de produit. Le workflow va : générer une image du produit à partir de la description → l'agrandir 2x → exporter le PNG final. L'ensemble de ce pipeline s'exécute en un clic. Vous pouvez l'enregistrer en tant qu'application de workflow réutilisable et la partager avec votre équipe.
87|
88|## Exporter et intégrer
89|
90|Chaque workflow peut être publié en tant qu'application accessible via API. Allez dans votre workflow, cliquez sur Publier, et Magica génère un point de terminaison API avec des entrées dynamiques pour les paramètres de votre workflow. Vous pouvez maintenant l'appeler depuis votre propre application :
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## Prochaines étapes
100|
101|Une fois à l'aise avec les bases, explorez :
102|- **Configuration du serveur MCP** — connectez Magica à vos propres outils et sources de données
103|- **Mémoire de l'agent** — donnez à vos workflows un contexte persistant à travers les sessions
104|- **Espaces de travail d'équipe** — collaborez sur des workflows avec des ressources partagées et un historique des versions
105|- **Outils personnalisés** — écrivez vos propres outils MCP que les agents Magica peuvent découvrir et utiliser
106|