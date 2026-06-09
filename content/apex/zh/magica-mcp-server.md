---
slug: magica-mcp-server
lang: zh
title: 使用 Magica 构建MCP服务器
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
# 使用 Magica 构建 MCP 服务器

## 什么是 MCP？

[模型上下文协议 (MCP)](https://modelcontextprotocol.io) 是一种开放标准，它允许 AI 智能体通过标准化接口发现并与外部工具、数据源和服务进行交互。可以将其视为 AI 领域的 USB-C 接口——一种协议，任何兼容 MCP 的智能体都可以用它来连接到任何兼容 MCP 的服务器。

Magica 采用 MCP 作为其主要扩展机制，这意味着您构建的任何 MCP 服务器都能自动与 Magica 的智能体系统协同工作。

## 搭建 MCP 服务器

创建一个新目录并初始化 TypeScript 项目：

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

MCP SDK 提供了服务器框架。您的服务器可以暴露工具（智能体可执行的操作）、资源（智能体可读取的数据）以及提示词模板（常见任务的模板）。

## 定义工具

工具是 MCP 中最常见的原语。以下是一个可供 Magica 智能体调用的天气工具示例：

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

## 连接到 Magica

在您的 Magica 工作区中，前往 设置 → MCP 服务器 → 添加服务器。提供以下信息：

- **名称：** 为您服务器设置的标签
- **命令：** 用于启动您服务器的命令（例如 `node dist/index.js`）
- **参数：** 您服务器所需的任何 CLI 标志
- **环境变量：** API 密钥、数据库 URL 等。

添加完成后，Magica 智能体可以自动发现并调用您的工具。当智能体判定其需要您服务器提供的数据或操作时，它会透明地发起 MCP 调用。

## 资源和上下文

除工具外，MCP 服务器还可以暴露资源——即智能体可读取的数据。资源采用基于 URI 的寻址方案：

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

资源对于让智能体访问文档、模式、参考数据和配置文件非常有用，这些信息可以为其响应提供依据。

## 部署

在开发环境中，使用 stdio 传输在本地运行您的 MCP 服务器。在生产环境中，则将其部署为使用 SSE 传输的 HTTP 服务器：

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

## 进阶：构建复合型 MCP 服务器

对于复杂场景，可以构建组合了多个数据源的服务器：

- **数据库 MCP：** 将 SQL 查询作为具有模式感知验证功能的工具暴露
- **GitHub MCP：** 将 Issues API、PR API 和 Actions API 整合为统一的工具
- **多步智能体：** 将 MCP 调用串联起来，使一个工具的输出成为另一个工具的输入

Magica 的智能体系统负责编排工作——您的 MCP 服务器只需提供带有类型化模式的、清晰且文档完善的工具即可。该平台会处理重试、错误处理以及服务器之间的路由。
