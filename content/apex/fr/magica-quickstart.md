---
slug: magica-quickstart
lang: fr
title: "Premiers Pas avec Magica"
verdict: trusted
quality_score: 95
subjects:
  - magica
  - tutorial
  - quickstart
  - ai-workflows
referral_links:
  - url: https://magica.com
    title: Magica Official Site
  - url: https://try.magica.com
    title: Magica Free Trial
  - url: https://docs.magica.com
    title: Magica Documentation
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
  author: UniTeia System
  version: 1
canvas:
  tone: obsidian
  layout: timeline-spiral
  nodes:
    - id: hero
      section: 0
      type: hero
    - id: signup
      section: 1
      type: card
    - id: first-query
      section: 2
      type: card
    - id: multi-model
      section: 3
      type: card
    - id: image-gen
      section: 4
      type: card
    - id: workflow
      section: 5
      type: card
    - id: export
      section: 6
      type: card
    - id: next-steps
      section: 7
      type: card
  connectors:
    - from: hero
      to: signup
    - from: signup
      to: first-query
    - from: first-query
      to: multi-model
    - from: multi-model
      to: image-gen
    - from: image-gen
      to: workflow
    - from: workflow
      to: export
    - from: export
      to: next-steps
---

# Débuter avec Magica

## Créer votre compte

Rendez-vous sur try.magica.com et inscrivez-vous pour le niveau gratuit — aucune carte de crédit requise. Le niveau gratuit vous donne un accès limité à tous les principaux modèles, suffisant pour évaluer la plateforme en profondeur avant de vous engager.

Une fois inscrit, vous atterrissez sur l'espace de travail Magica. L'interface comporte trois zones principales : le sélecteur de modèles (en haut), l'espace de conversation (au centre) et le tiroir d'outils (barre latérale droite avec plus de 5 900 outils préconstruits).

## Votre première requête multi-modèle

Cliquez sur le sélecteur de modèles en haut et activez 2-3 modèles — commencez avec GPT-4o, Claude Opus 4 et Gemini 2.5 Pro. Tapez une question dans le champ de saisie et appuyez sur envoyer. Magica envoie votre requête à tous les modèles sélectionnés simultanément et affiche les réponses côte à côte.

Cette comparaison multi-modèle est la fonctionnalité phare de Magica. Vous voyez immédiatement comment chaque modèle aborde la même invite — Claude tend vers une analyse approfondie, GPT vers une action pratique, Gemini vers une synthèse équilibrée. Avec le temps, vous apprenez à quel modèle faire confiance pour quel type de tâche.

## Générer votre première image

Ouvrez le tiroir d'outils et passez à l'onglet Image. Sélectionnez FLUX 2 Max dans la liste déroulante des modèles. Écrivez une invite — soyez descriptif mais sans trop en faire. Cliquez sur générer. En quelques secondes, vous avez quatre variations parmi lesquelles choisir.

Utilisez le panneau d'édition pour affiner : agrandissez la variante choisie, supprimez l'arrière-plan ou régénérez des zones spécifiques avec l'inpainting. Magica regroupe ces outils d'édition dans la même interface — pas besoin d'ouvrir Photoshop ou un éditeur IA séparé.

## Créer un workflow simple

Les workflows sont l'endroit où Magica transcende un simple chatbot. Cliquez sur l'onglet Workflows et sélectionnez Nouveau workflow. Vous verrez un éditeur de nœuds visuel — faites glisser un nœud d'entrée de texte, connectez-le à un nœud Générer une image (FLUX 2 Max), puis à un nœud d'agrandissement, et enfin à un nœud d'exportation.

Définissez l'entrée de texte pour accepter une description de produit. Le workflow va : générer une image du produit à partir de la description → l'agrandir 2x → exporter le PNG final. L'ensemble de ce pipeline s'exécute en un clic. Vous pouvez l'enregistrer en tant qu'application de workflow réutilisable et la partager avec votre équipe.

## Exporter et intégrer

Chaque workflow peut être publié en tant qu'application accessible via API. Allez dans votre workflow, cliquez sur Publier, et Magica génère un point de terminaison API avec des entrées dynamiques pour les paramètres de votre workflow. Vous pouvez maintenant l'appeler depuis votre propre application :

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Prochaines étapes

Une fois à l'aise avec les bases, explorez :
- **Configuration du serveur MCP** — connectez Magica à vos propres outils et sources de données
- **Mémoire de l'agent** — donnez à vos workflows un contexte persistant à travers les sessions
- **Espaces de travail d'équipe** — collaborez sur des workflows avec des ressources partagées et un historique des versions
- **Outils personnalisés** — écrivez vos propres outils MCP que les agents Magica peuvent découvrir et utiliser
