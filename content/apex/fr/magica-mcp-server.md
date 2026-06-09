---
slug: magica-mcp-server
lang: fr
title: Construire des Serveurs MCP avec Magica
verdict: trusted
quality_score: 95
subjects:
  - magica
  - mcp
  - api
  - development
referral_links: []
metadata:
  created_at: "2026-06-09T02:27:03.025Z"
  updated_at: "2026-06-09T02:27:03.025Z"
  author: UniTeia System
  version: 1
canvas:
  tone: obsidian
  layout: neural-branch
  nodes:
    - id: hero
      section: 0
      type: hero
    - id: what-is-mcp
      section: 1
      type: card
    - id: setup
      section: 2
      type: card
    - id: tools
      section: 3
      type: card
    - id: resources
      section: 4
      type: card
    - id: deploy
      section: 5
      type: card
    - id: magica-integration
      section: 6
      type: card
    - id: advanced
      section: 7
      type: card
  connectors:
    - from: hero
      to: what-is-mcp
    - from: what-is-mcp
      to: setup
    - from: setup
      to: tools
    - from: setup
      to: resources
    - from: tools
      to: deploy
    - from: resources
      to: deploy
    - from: deploy
      to: magica-integration
    - from: magica-integration
      to: advanced
---
# Construire des serveurs MCP avec Magica

## Qu'est-ce que MCP ?

Le [Model Context Protocol](https://modelcontextprotocol.io) (MCP) est un standard ouvert qui permet aux agents IA de découvrir et d'interagir avec des outils externes, des sources de données et des services via une interface standardisée. Considérez-le comme un port USB-C pour l'IA — un protocole que tout agent compatible MCP peut utiliser pour se connecter à n'importe quel serveur compatible MCP.

Magica a adopté MCP, initialement développé par [Anthropic](https://anthropic.com), comme mécanisme d'extension principal, ce qui signifie que tout serveur MCP que vous construisez fonctionne automatiquement avec le système d'agents de Magica.

## Configuration d'un serveur MCP

Créez un nouveau répertoire et initialisez un projet TypeScript :

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

Le SDK MCP fournit le cadre du serveur. Votre serveur expose des outils (actions que l'agent peut entreprendre), des ressources (données que l'agent peut lire) et des invites (modèles pour des tâches courantes).

## Définition des outils

Les outils sont la primitive MCP la plus courante. Voici un outil météo que les agents Magica peuvent appeler :

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new Server({ name: 'weather-mcp', version: '1.0.0' }, {
  capabilities: { tools: {} }
})

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'get_weather',
    description: 'Get current weather for a city',
    inputSchema: {
      type: 'object',
      properties: { city: { type: 'string' } },
      required: ['city']
    }
  }]
}))

server.setRequestHandler('tools/call', async request => {
  if (request.params.name === 'get_weather') {
    const city = request.params.arguments?.city
    const weather = await fetchWeather(city)
    return { content: [{ type: 'text', text: JSON.stringify(weather) }] }
  }
  throw new Error('Tool not found')
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

## Connexion à Magica

Dans votre espace de travail Magica, allez dans Paramètres → Serveurs MCP → Ajouter un serveur. Fournissez :

- **Nom :** Un libellé pour votre serveur
- **Commande :** La commande pour démarrer votre serveur (par exemple, `node dist/index.js`)
- **Arguments :** Tous les indicateurs CLI dont votre serveur a besoin
- **Variables d'environnement :** Clés API, URL de base de données, etc.

Une fois ajouté, les agents Magica peuvent découvrir et appeler vos outils automatiquement. Lorsqu'un agent détermine qu'il a besoin de données ou d'une action que votre serveur fournit, il effectue l'appel MCP de manière transparente.

## Ressources et contexte

Au-delà des outils, les serveurs MCP peuvent exposer des ressources — des données que les agents peuvent lire. Les ressources utilisent un schéma d'adressage basé sur les URI :

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Les ressources sont utiles pour donner aux agents un accès à la documentation, aux schémas, aux données de référence et aux fichiers de configuration qui informent leurs réponses.

## Déploiement

Pour le développement, exécutez votre serveur MCP localement avec le transport stdio. Pour la production, déployez-le en tant que serveur HTTP avec le transport SSE ou via [Cloudflare Pages](https://pages.cloudflare.com) pour une approche serverless :

```typescript
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import express from 'express'

const app = express()
app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res)
  await server.connect(transport)
})
app.post('/messages', (req, res) => {
  transport.handlePostMessage(req, res)
})
app.listen(3000)
```

## Avancé : Construction d'un serveur MCP composite

Pour des scénarios complexes, construisez des serveurs qui composent plusieurs sources de données :

- **Base de données MCP :** Exposez des requêtes SQL en tant qu'outils avec validation consciente du schéma
- **GitHub MCP :** Combinez l'API Issues, l'API PR et l'API Actions en outils unifiés
- **Agents multi-étapes :** Enchaînez les appels MCP où la sortie d'un outil devient l'entrée d'un autre

Le système d'agents de Magica gère l'orchestration — votre serveur MCP a juste besoin d'exposer des outils propres et bien documentés avec des schémas typés, en suivant les principes du [PAIR Guidebook](https://pair.withgoogle.com/guidebook) de Google sur la collaboration humain-IA. La plateforme s'occupe des tentatives, de la gestion des erreurs et du routage entre les serveurs.
