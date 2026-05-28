---
slug: magica-quickstart
lang: ja
title: "Magica入門"
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

# Magica はじめよう

## アカウント作成

[try.magica.com](http://try.magica.com) にアクセスし、無料プランにサインアップしてください。クレジットカードは不要です。無料プランでは、主要な全モデルを制限付きで利用でき、本格導入前にプラットフォームを十分に評価できます。

登録が完了すると、Magica ワークスペースが表示されます。インターフェースは、モデルセレクター（上部）、会話ワークスペース（中央）、ツールドロワー（右サイドバー、5,900 以上のビルド済みツール）の 3 つの主要エリアで構成されています。

## 初めてのマルチモデルクエリ

上部のモデルセレクターをクリックし、2～3 個のモデル（まずは [GPT-4o](https://openai.com)、[Claude Opus 4](https://anthropic.com)、Gemini 2.5 Pro）を有効にします。入力フィールドに質問を入力し、送信ボタンを押します。Magica は選択されたすべてのモデルに同時にクエリを送信し、応答を横並びで表示します。

このマルチモデル比較機能こそが Magica のキラーフィーチャーです。各モデルが同じプロンプトにどのようにアプローチするか（Claude は徹底的な分析、GPT は実用的なアクション、Gemini はバランスの取れた統合を重視）を即座に確認できます。使い込むうちに、どのタスクタイプにどのモデルを信頼すべきかがわかるようになります。

## 初めての画像生成

ツールドロワーを開き、Image タブに切り替えます。モデルドロップダウンから FLUX 2 Max を選択します。プロンプトを記述します。詳細に、しかし過度に作り込まないようにします。「Generate」をクリックします。数秒以内に 4 つのバリエーションが表示され、選択できるようになります。

編集パネルを使用して調整します。選択したバリアントのアップスケール、背景の削除、またはインペインティングによる特定領域の再生成が可能です。Magica はこれらの編集ツールを同一インターフェースにバンドルしているため、Photoshop や別の AI エディターを開く必要はありません。

## シンプルなワークフローを作成する

ワークフローこそ、Magica が単なるチャットボットを超える所以です。「Workflows」タブをクリックし、「New Workflow」を選択します。ビジュアルノードエディターが表示されます。Text Input ノードをドラッグし、Generate Image ノード（FLUX 2 Max）に接続、次に Upscale ノード、最後に Export ノードへと接続します。

テキスト入力を製品説明を受け付けるように設定します。ワークフローは以下の処理を実行します。説明文から製品画像を生成 → 2 倍にアップスケール → 最終的な PNG をエクスポート。この一連のパイプラインが 1 クリックで実行されます。再利用可能なワークフローアプリとして保存し、チームと共有することもできます。

## エクスポートと統合

すべてのワークフローは、API 経由でアクセス可能なアプリとして公開できます。ワークフローに移動して「Publish」をクリックすると、Magica がワークフローパラメータに対応する動的入力を持つ API エンドポイントを生成します。これで、独自のアプリケーションから呼び出せるようになります：

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## 次のステップ

基本に慣れてきたら、以下を試してみてください：
- **MCP Server のセットアップ** — Magica を独自のツールやデータソースに接続
- **エージェントメモリ** — ワークフローにセッションを超えた永続的なコンテキストを付与
- **チームワークスペース** — 共有アセットとバージョン履歴を使用してワークフローを共同編集
- **カスタムツール** — Magica エージェントが検出・利用できる独自の MCP ツールを作成
