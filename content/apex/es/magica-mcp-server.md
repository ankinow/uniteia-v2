---
slug: magica-mcp-server
lang: es
title: Construyendo Servidores MCP con Magica
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
# Construyendo Servidores MCP con Magica

## ¿Qué es MCP?

El [Model Context Protocol](https://modelcontextprotocol.io) (MCP) es un estándar abierto que permite a los agentes de IA descubrir e interactuar con herramientas externas, fuentes de datos y servicios a través de una interfaz estandarizada. Piense en él como un puerto USB-C para IA — un protocolo que cualquier agente compatible con MCP puede usar para conectarse a cualquier servidor compatible con MCP.

Magica adoptó MCP, desarrollado originalmente por [Anthropic](https://anthropic.com), como su mecanismo principal de extensión, lo que significa que cualquier servidor MCP que construyas funciona automáticamente con el sistema de agentes de Magica.

## Configurando un Servidor MCP

Crea un nuevo directorio e inicializa un proyecto TypeScript:

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

El SDK de MCP proporciona el marco del servidor. Tu servidor expone herramientas (acciones que el agente puede realizar), recursos (datos que el agente puede leer) y prompts (plantillas para tareas comunes).

## Definiendo Herramientas

Las herramientas son la primitiva MCP más común. Aquí hay una herramienta meteorológica que los agentes de Magica pueden llamar:

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

## Conectando a Magica

En tu espacio de trabajo de Magica, ve a Configuración → Servidores MCP → Añadir Servidor. Proporciona:

- **Nombre:** Una etiqueta para tu servidor
- **Comando:** El comando para iniciar tu servidor (por ejemplo, `node dist/index.js`)
- **Argumentos:** Cualquier bandera de CLI que tu servidor necesite
- **Variables de entorno:** Claves de API, URLs de base de datos, etc.

Una vez agregado, los agentes de Magica pueden descubrir y llamar a tus herramientas automáticamente. Cuando un agente determina que necesita datos o una acción que tu servidor proporciona, realiza la llamada MCP de manera transparente.

## Recursos y Contexto

Más allá de las herramientas, los servidores MCP pueden exponer Recursos — datos que los agentes pueden leer. Los recursos utilizan un esquema de direccionamiento basado en URI:

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Los recursos son útiles para dar a los agentes acceso a documentación, esquemas, datos de referencia y archivos de configuración que informan sus respuestas.

## Despliegue

Para desarrollo, ejecuta tu servidor MCP localmente con transporte stdio. Para producción, despliega como un servidor HTTP con transporte SSE o mediante [Cloudflare Pages](https://pages.cloudflare.com) para un enfoque serverless:

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

## Avanzado: Construyendo un Servidor MCP Compuesto

Para escenarios complejos, construye servidores que compongan múltiples fuentes de datos:

- **Base de datos MCP:** Expone consultas SQL como herramientas con validación consciente del esquema
- **GitHub MCP:** Combina la API de Issues, la API de PR y la API de Actions en herramientas unificadas
- **Agentes multipaso:** Encadena llamadas MCP donde la salida de una herramienta se convierte en la entrada de otra

El sistema de agentes de Magica maneja la orquestación — tu servidor MCP solo necesita exponer herramientas limpias, bien documentadas con esquemas tipados, siguiendo principios del [PAIR Guidebook](https://pair.withgoogle.com/guidebook) de Google sobre colaboración humano-IA. La plataforma se encarga de reintentos, manejo de errores y enrutamiento entre servidores.
