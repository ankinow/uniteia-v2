---
slug: magica-mcp-server
lang: de
title: MCP-Server mit Magica erstellen
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
# MCP-Server mit Magica erstellen

## Was ist MCP?

Das [Model Context Protocol](https://modelcontextprotocol.io) (MCP) ist ein offener Standard, der es KI-Agenten ermöglicht, externe Tools, Datenquellen und Dienste über eine standardisierte Schnittstelle zu entdecken und zu nutzen. Stellen Sie es sich wie einen USB-C-Anschluss für KI vor – ein Protokoll, mit dem jeder MCP-kompatible Agent eine Verbindung zu jedem MCP-kompatiblen Server herstellen kann.

Magica hat MCP, ursprünglich entwickelt von [Anthropic](https://anthropic.com), als seinen primären Erweiterungsmechanismus übernommen, was bedeutet, dass jeder MCP-Server, den Sie erstellen, automatisch mit dem Agentensystem von Magica funktioniert.

## Einrichten eines MCP-Servers

Erstellen Sie ein neues Verzeichnis und initialisieren Sie ein TypeScript-Projekt:

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

Das MCP SDK bietet das Server-Framework. Ihr Server stellt Tools (Aktionen, die der Agent ausführen kann), Ressourcen (Daten, die der Agent lesen kann) und Prompts (Vorlagen für häufige Aufgaben) bereit.

## Definieren von Tools

Tools sind die häufigsten MCP-Primitiven. Hier ist ein Wetter-Tool, das Magica-Agenten aufrufen können:

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

## Verbinden mit Magica

Gehen Sie in Ihrem Magica-Arbeitsbereich zu Einstellungen → MCP-Server → Server hinzufügen. Geben Sie an:

- **Name:** Eine Bezeichnung für Ihren Server
- **Befehl:** Der Befehl zum Starten Ihres Servers (z.B. `node dist/index.js`)
- **Argumente:** Alle CLI-Flags, die Ihr Server benötigt
- **Umgebungsvariablen:** API-Schlüssel, Datenbank-URLs usw.

Nach dem Hinzufügen können Magica-Agenten Ihre Tools automatisch erkennen und aufrufen. Wenn ein Agent feststellt, dass er Daten oder eine Aktion benötigt, die Ihr Server bereitstellt, führt er den MCP-Aufruf transparent durch.

## Ressourcen und Kontext

Über Tools hinaus können MCP-Server Ressourcen bereitstellen – Daten, die Agenten lesen können. Ressourcen verwenden ein URI-basiertes Adressierungsschema:

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Ressourcen sind nützlich, um Agenten Zugriff auf Dokumentationen, Schemata, Referenzdaten und Konfigurationsdateien zu geben, die ihre Antworten beeinflussen.

## Bereitstellung

Für die Entwicklung führen Sie Ihren MCP-Server lokal mit stdio-Transport aus. Für die Produktion stellen Sie ihn als HTTP-Server mit SSE-Transport oder über [Cloudflare Pages](https://pages.cloudflare.com) für einen serverlosen Ansatz bereit:

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

## Fortgeschritten: Erstellen eines zusammengesetzten MCP-Servers

Für komplexe Szenarien erstellen Sie Server, die mehrere Datenquellen zusammenfassen:

- **Datenbank-MCP:** SQL-Abfragen als Tools mit schemabasierter Validierung bereitstellen
- **GitHub-MCP:** Issues-API, PR-API und Actions-API zu einheitlichen Tools kombinieren
- **Mehrschritt-Agenten:** MCP-Aufrufe verketten, bei denen die Ausgabe eines Tools zur Eingabe eines anderen wird

Das Agentensystem von Magica übernimmt die Orchestrierung – Ihr MCP-Server muss lediglich saubere, gut dokumentierte Tools mit typisierten Schemata bereitstellen, den Prinzipien des [PAIR Guidebook](https://pair.withgoogle.com/guidebook) von Google zur Mensch-KI-Zusammenarbeit folgend. Die Plattform kümmert sich um Wiederholungen, Fehlerbehandlung und das Routing zwischen Servern.
