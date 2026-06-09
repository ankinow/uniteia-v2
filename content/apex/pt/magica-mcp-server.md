---
slug: magica-mcp-server
lang: pt
title: Construindo Servidores MCP com Magica
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
  created_at: "2026-06-09T03:22:19.407Z"
  updated_at: "2026-06-09T03:22:30.413Z"
  author: UniTeia System
  version: 2
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
# Construindo Servidores MCP com Magica

## O que é MCP?

O [Model Context Protocol](https://modelcontextprotocol.io) (MCP) é um padrão aberto que permite que agentes de IA descubram e interajam com ferramentas externas, fontes de dados e serviços através de uma interface padronizada. Pense nisso como uma porta USB-C para IA — um protocolo que qualquer agente compatível com MCP pode usar para se conectar a qualquer servidor compatível com MCP.

Magica adotou o MCP, originalmente desenvolvido pela [Anthropic](https://anthropic.com), como seu principal mecanismo de extensão, significando que qualquer servidor MCP que você construir funciona automaticamente com o sistema de agente da Magica.

## Configurando um Servidor MCP

Crie um novo diretório e inicialize um projeto TypeScript:

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

O SDK MCP fornece a estrutura do servidor. Seu servidor expõe ferramentas (ações que o agente pode tomar), recursos (dados que o agente pode ler) e prompts (modelos para tarefas comuns).

## Definindo Ferramentas

Ferramentas são a primitiva MCP mais comum. Aqui está uma ferramenta de clima que os agentes da Magica podem chamar:

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

## Conectando-se à Magica

No seu workspace Magica, vá em Configurações → Servidores MCP → Adicionar Servidor. Forneça:

- **Nome:** Um rótulo para seu servidor
- **Comando:** O comando para iniciar seu servidor (por exemplo, `node dist/index.js`)
- **Argumentos:** Quaisquer flags de CLI que seu servidor precise
- **Variáveis de ambiente:** Chaves de API, URLs de banco de dados, etc.

Uma vez adicionados, os agentes da Magica podem descobrir e chamar suas ferramentas automaticamente. Quando um agente determina que precisa de dados ou uma ação que seu servidor fornece, ele faz a chamada MCP de forma transparente.

## Recursos e Contexto

Além de ferramentas, os servidores MCP podem expor Recursos — dados que os agentes podem ler. Os Recursos usam um esquema de endereçamento baseado em URI:

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

Recursos são úteis para dar aos agentes acesso a documentação, esquemas, dados de referência e arquivos de configuração que informam suas respostas.

## Implantação

Para desenvolvimento, execute seu servidor MCP localmente com transporte stdio. Para produção, implante como um servidor HTTP com transporte SSE ou via [Cloudflare Pages](https://pages.cloudflare.com) para uma abordagem serverless:

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

## Avançado: Construindo um Servidor MCP Composto

Para cenários complexos, construa servidores que compõem múltiplas fontes de dados:

- **MCP de Banco de Dados:** Exponha consultas SQL como ferramentas com validação ciente de esquema
- **MCP do GitHub:** Combine a API de Issues, API de PRs e API de Actions em ferramentas unificadas
- **Agentes de múltiplas etapas:** Encadeie chamadas MCP onde a saída de uma ferramenta se torna a entrada de outra

O sistema de agente da Magica lida com a orquestração — seu servidor MCP só precisa expor ferramentas limpas e bem documentadas com esquemas tipados, seguindo princípios do [PAIR Guidebook](https://pair.withgoogle.com/guidebook) da Google sobre colaboração humano-IA. A plataforma cuida de repetições, tratamento de erros e roteamento entre servidores.
