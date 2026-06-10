1|---
2|slug: magica-quickstart
3|lang: ja
4|title: Magica 入門
5|verdict: trusted
6|quality_score: 95
7|subjects:
8|  - magica
9|  - tutorial
10|  - quickstart
11|  - ai-workflows
12|referral_links: []
13|metadata:
14|  created_at: "2026-06-09T04:00:22.795Z"
15|  updated_at: "2026-06-09T04:00:22.795Z"
16|  author: UniTeia System
17|  version: 1
18|canvas:
19|  tone: coral
20|  layout: timeline-spiral
21|  nodes:
22|    - id: hero
23|      section: 0
24|      type: hero
25|    - id: signup
26|      section: 1
27|      type: card
28|    - id: first-query
29|      section: 2
30|      type: card
31|    - id: multi-model
32|      section: 3
33|      type: card
34|    - id: image-gen
35|      section: 4
36|      type: card
37|    - id: workflow
38|      section: 5
39|      type: card
40|    - id: export
41|      section: 6
42|      type: card
43|    - id: next-steps
44|      section: 7
45|      type: card
46|  connectors:
47|    - from: hero
48|      to: signup
49|    - from: signup
50|      to: first-query
51|    - from: first-query
52|      to: multi-model
53|    - from: multi-model
54|      to: image-gen
55|    - from: image-gen
56|      to: workflow
57|    - from: workflow
58|      to: export
59|    - from: export
60|      to: next-steps
61|---
62|# Magica はじめよう
63|
64|## アカウント作成
65|

> 💡 **透明性の通知:** UniTeiaはこのページのリンク経由の登録でコミッションを受け取る場合があります。これは評価に影響しません。[倫理ポリシー](/ethics)をご覧ください。

66|[try.magica.com/clique-serio](https://try.magica.com/clique-serio) にアクセスし、無料プランにサインアップしてください。クレジットカードは不要です。[特典ページ](https://try.magica.com/redeem) でプロモコード **GXZMYCP** を使用すると、**10Mのボーナスクレジット** を獲得できます（動画、ポッドキャスト、音声制作に最適）。無料プランでは、主要な全モデルを制限付きで利用でき、本格導入前にプラットフォームを十分に評価できます。
67|
68|登録が完了すると、Magica ワークスペースが表示されます。インターフェースは、モデルセレクター（上部）、会話ワークスペース（中央）、ツールドロワー（右サイドバー、5,900 以上のビルド済みツール）の 3 つの主要エリアで構成されています。
69|
70|## 初めてのマルチモデルクエリ
71|
72|上部のモデルセレクターをクリックし、2～3 個のモデル（まずは [GPT-4o](https://openai.com)、[Claude Opus 4](https://anthropic.com)、Gemini 2.5 Pro）を有効にします。入力フィールドに質問を入力し、送信ボタンを押します。Magica は選択されたすべてのモデルに同時にクエリを送信し、応答を横並びで表示します。
73|
74|このマルチモデル比較機能こそが Magica のキラーフィーチャーです。各モデルが同じプロンプトにどのようにアプローチするか（Claude は徹底的な分析、GPT は実用的なアクション、Gemini はバランスの取れた統合を重視）を即座に確認できます。使い込むうちに、どのタスクタイプにどのモデルを信頼すべきかがわかるようになります。
75|
76|## 初めての画像生成
77|
78|ツールドロワーを開き、Image タブに切り替えます。モデルドロップダウンから FLUX 2 Max を選択します。プロンプトを記述します。詳細に、しかし過度に作り込まないようにします。「Generate」をクリックします。数秒以内に 4 つのバリエーションが表示され、選択できるようになります。
79|
80|編集パネルを使用して調整します。選択したバリアントのアップスケール、背景の削除、またはインペインティングによる特定領域の再生成が可能です。Magica はこれらの編集ツールを同一インターフェースにバンドルしているため、Photoshop や別の AI エディターを開く必要はありません。
81|
82|## シンプルなワークフローを作成する
83|
84|ワークフローこそ、Magica が単なるチャットボットを超える所以です。「Workflows」タブをクリックし、「New Workflow」を選択します。ビジュアルノードエディターが表示されます。Text Input ノードをドラッグし、Generate Image ノード（FLUX 2 Max）に接続、次に Upscale ノード、最後に Export ノードへと接続します。
85|
86|テキスト入力を製品説明を受け付けるように設定します。ワークフローは以下の処理を実行します。説明文から製品画像を生成 → 2 倍にアップスケール → 最終的な PNG をエクスポート。この一連のパイプラインが 1 クリックで実行されます。再利用可能なワークフローアプリとして保存し、チームと共有することもできます。
87|
88|## エクスポートと統合
89|
90|すべてのワークフローは、API 経由でアクセス可能なアプリとして公開できます。ワークフローに移動して「Publish」をクリックすると、Magica がワークフローパラメータに対応する動的入力を持つ API エンドポイントを生成します。これで、独自のアプリケーションから呼び出せるようになります：
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## 次のステップ
100|
101|基本に慣れてきたら、以下を試してみてください：
102|- **MCP Server のセットアップ** — Magica を独自のツールやデータソースに接続
103|- **エージェントメモリ** — ワークフローにセッションを超えた永続的なコンテキストを付与
104|- **チームワークスペース** — 共有アセットとバージョン履歴を使用してワークフローを共同編集
105|- **カスタムツール** — Magica エージェントが検出・利用できる独自の MCP ツールを作成
106|