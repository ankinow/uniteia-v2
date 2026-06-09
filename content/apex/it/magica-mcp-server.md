---
slug: magica-mcp-server
lang: it
title: Costruire Server MCP con Magica
verdict: trusted
quality_score: 95
subjects:
  - magica
  - mcp
  - api
  - development
referral_links:
  - url: /en/signals/apex/magica-overview
    title: magica-overview
  - url: /en/signals/apex/magica-quickstart
    title: magica-quickstart
  - url: /en/signals/apex/multi-agent-vibecoding
    title: multi-agent-vibecoding
metadata:
  created_at: "2026-06-09T04:00:22.795Z"
  updated_at: "2026-06-09T04:00:22.795Z"
  author: UniTeia System
  version: 1
canvas:
  tone: coral
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
# Costruire Server MCP con Magica

## Cos'è MCP?

Il [Model Context Protocol](https://modelcontextprotocol.io) (MCP) è uno standard aperto che consente agli agenti AI di scoprire e interagire con strumenti esterni, fonti di dati e servizi attraverso un'interfaccia standardizzata. Pensalo come una porta USB-C per l'IA — un protocollo che qualsiasi agente compatibile con MCP può usare per connettersi a qualsiasi server compatibile con MCP.

Magica ha adottato MCP, originariamente sviluppato da [Anthropic](https://anthropic.com), come meccanismo di estensione principale, il che significa che qualsiasi server MCP che costruisci funziona automaticamente con il sistema agente di Magica.

## Impostazione di un server MCP

Crea una nuova directory e inizializza un progetto TypeScript:

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

L'SDK MCP fornisce il framework del server. Il tuo server espone strumenti (azioni che l'agente può eseguire), risorse (dati che l'agente può leggere) e prompt (modelli per attività comuni).

## Definizione degli strumenti

Gli strumenti sono le primitive MCP più comuni. Ecco uno strumento meteo che gli agenti Magica possono chiamare:

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

## Connessione a Magica

Nel tuo workspace Magica, vai su Impostazioni → Server MCP → Aggiungi server. Fornisci:

- **Nome:** Un'etichetta per il tuo server
- **Comando:** Il comando per avviare il tuo server (es. `node dist/index.js`)
- **Argomenti:** Qualsiasi flag CLI di cui il tuo server ha bisogno
- **Variabili d'ambiente:** Chiavi API, URL di database, ecc.

Una volta aggiunto, gli agenti Magica possono scoprire e chiamare automaticamente i tuoi strumenti. Quando un agente determina di aver bisogno di dati o di un'azione fornita dal tuo server, effettua la chiamata MCP in modo trasparente.

## Risorse e contesto

Oltre agli strumenti, i server MCP possono esporre Risorse — dati che gli agenti possono leggere. Le risorse utilizzano uno schema di indirizzamento basato su URI:

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Le risorse sono utili per dare agli agenti accesso a documentazione, schemi, dati di riferimento e file di configurazione che informano le loro risposte.

## Distribuzione

Per lo sviluppo, esegui il tuo server MCP localmente con trasporto stdio. Per la produzione, distribuiscilo come server HTTP con trasporto SSE o tramite [Cloudflare Pages](https://pages.cloudflare.com) per un approccio serverless:

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

## Avanzato: Creazione di un server MCP composito

Per scenari complessi, costruisci server che compongono più fonti di dati:

- **Database MCP:** Esponi query SQL come strumenti con validazione basata su schema
- **GitHub MCP:** Combina Issues API, PR API e Actions API in strumenti unificati
- **Agenti multi-passaggio:** Collega chiamate MCP dove l'output di uno strumento diventa l'input di un altro

Il sistema agente di Magica gestisce l'orchestrazione — il tuo server MCP deve solo esporre strumenti puliti, ben documentati con schemi tipizzati, seguendo i principi del [PAIR Guidebook](https://pair.withgoogle.com/guidebook) di Google sulla collaborazione uomo-IA. La piattaforma si occupa di tentativi, gestione degli errori e instradamento tra server.
