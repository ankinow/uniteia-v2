---
slug: magica-mcp-server
lang: ja
title: MagicaでMCPサーバーを構築する
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
# Magica で MCP サーバーを構築する

## MCP とは

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) は、AI エージェントが標準化されたインターフェースを通じて外部のツール、データソース、サービスを発見し操作できるようにするオープンスタンダードです。これは AI における USB-C ポートのようなもので、MCP 互換のエージェントならどのエージェントでも、このプロトコルを使って MCP 互換のサーバーに接続できます。

Magica は MCP を、もともと [Anthropic](https://anthropic.com) によって開発された主要な拡張メカニズムとして採用しており、あなたが構築する MCP サーバーは自動的に Magica のエージェントシステムで動作します。

## MCP サーバーのセットアップ

新しいディレクトリを作成し、TypeScript プロジェクトを初期化します。

```bash
mkdir magica-weather-mcp && cd magica-weather-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

MCP SDK はサーバーフレームワークを提供します。サーバーは、ツール（エージェントが実行できるアクション）、リソース（エージェントが読み取れるデータ）、プロンプト（共通タスク用のテンプレート）を公開します。

## ツールの定義

ツールは最も一般的な MCP プリミティブです。以下は Magica エージェントが呼び出せる天気ツールの例です。

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

## Magica への接続

Magica ワークスペースで、設定 → MCP サーバー → サーバー追加 に進みます。以下の情報を入力します。

- **名前:** サーバーのラベル
- **コマンド:** サーバーを起動するコマンド（例：`node dist/index.js`）
- **引数:** サーバーが必要とする CLI フラグ
- **環境変数:** API キー、データベース URL など

追加後、Magica エージェントは自動的にツールを発見し呼び出せるようになります。エージェントがサーバーの提供するデータやアクションを必要と判断した場合、透過的に MCP 呼び出しが行われます。

## リソースとコンテキスト

ツール以外にも、MCP サーバーはエージェントが読み取れるデータであるリソースを公開できます。リソースは URI ベースのアドレス指定方式を使用します。

```typescript
server.setRequestHandler('resources/list', async () => ({
  resources: [{
    uri: 'docs://magica/workflows',
    name: 'Workflow Documentation',
    mimeType: 'text/markdown'
  }]
}))
```

リソースは、エージェントにドキュメント、スキーマ、参照データ、設定ファイルなどを提供して応答を補助するのに便利です。

## デプロイ

開発時は stdio トランスポートを使用してローカルで MCP サーバーを実行します。本番環境では、SSE トランスポートを使用して HTTP サーバーとして、または [Cloudflare Pages](https://pages.cloudflare.com) を使用したサーバーレスアプローチでデプロイします。

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

## 応用：複合 MCP サーバーの構築

複雑なシナリオでは、複数のデータソースを合成するサーバーを構築します。

- **データベース MCP:** SQL クエリをスキーマ認識検証付きのツールとして公開
- **GitHub MCP:** Issues API、PR API、Actions API を統合ツールに結合
- **マルチステップエージェント:** あるツールの出力を別のツールの入力として連鎖させる MCP 呼び出し

Magica のエージェントシステムがオーケストレーションを処理します。MCP サーバーは、型付けされたスキーマを持つ、明確で適切に文書化されたツールを公開するだけで十分です。Google の [PAIR Guidebook](https://pair.withgoogle.com/guidebook) にある人間とAIの協働原則に従います。リトライ、エラーハンドリング、サーバー間のルーティングはプラットフォームが行います。
