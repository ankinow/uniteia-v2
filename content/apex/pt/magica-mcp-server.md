---
slug: magica-mcp-server
lang: pt
title: "Construindo Servidores MCP com Magica"
verdict: trusted
quality_score: 95
subjects:
  - magica
  - mcp
  - api
  - development
referral_links:
  - url: https://docs.magica.com
    title: Magica Documentation
  - url: https://modelcontextprotocol.io
    title: MCP Specification
  - url: https://magica.com
    title: Magica Official Site
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
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
# Building MCP Servers with Magica

## What is MCP?

The Model Context Protocol (MCP) is an open standard that lets AI agents discover and interact with external tools, data sources, and services through a standardized interface. Think of it as a USB-C port for AI — one protocol that any MCP-compatible agent can use to connect to any MCP-compatible server.

Magica adopted MCP as its primary extension mechanism, meaning any MCP server you build automatically works with Magica's agent system.

## Setting Up an MCP Server

Create a new directory and initialize a TypeScript project:

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

The MCP SDK provides the server framework. Your server exposes tools (actions the agent can take), resources (data the agent can read), and prompts (templates for common tasks).

## Defining Tools

Tools are the most common MCP primitive. Here's a weather tool that Magica agents can call:

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

## Connecting to Magica

In your Magica workspace, go to Settings → MCP Servers → Add Server. Provide:

- **Name:** A label for your server
- **Command:** The command to start your server (e.g., `node dist/index.js`)
- **Arguments:** Any CLI flags your server needs
- **Environment variables:** API keys, database URLs, etc.

Once added, Magica agents can discover and call your tools automatically. When an agent determines it needs data or an action your server provides, it makes the MCP call transparently.

## Resources and Context

Beyond tools, MCP servers can expose Resources — data that agents can read. Resources use a URI-based addressing scheme:

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Resources are useful for giving agents access to documentation, schemas, reference data, and configuration files that inform their responses.

## Deployment

For development, run your MCP server locally with stdio transport. For production, deploy as an HTTP server with SSE transport:

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

## Advanced: Building a Composite MCP Server

For complex scenarios, build servers that compose multiple data sources:

- **Database MCP:** Expose SQL queries as tools with schema-aware validation
- **GitHub MCP:** Combine Issues API, PR API, and Actions API into unified tools
- **Multi-step agents:** Chain MCP calls where one tool's output becomes another's input

Magica's agent system handles the orchestration — your MCP server just needs to expose clean, well-documented tools with typed schemas. The platform takes care of retries, error handling, and routing between servers.

<dcp-message-id>m0325</dcp-message-id>