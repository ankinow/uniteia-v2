import type { TranslationStrings } from './types'

export const ja: TranslationStrings = {
  nav: {
    home: 'ホーム',
    about: '概要',
    blog: 'ブログ',
    projects: 'プロジェクト',
    contact: 'お問い合わせ',
    topics: 'トピック',
    search: '検索',
    niches: 'ニッチ',
    breadcrumb: {
      label: '現在位置:',
      signals: 'Insights',
    },
  },
  sidebar: {
    interfaceLabel: 'コンパクトインターフェース',
  },
  footer: {
    copyright: '© {year} UniTeia. 全著作権所有。',
    madeWith: '分散型AIのために♥を込めて作成',
    links: {
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      source: 'ソースコード',
    },
  },
  langSwitcher: {
    label: '言語',
    current: '現在の言語: {lang}',
    available: '利用可能な言語',
  },
  errorPages: {
    '404': {
      title: 'ページが見つかりません',
      message: 'お探しのページは存在しないか、移動しました。',
      backHome: 'ホームに戻る',
    },
    '500': {
      title: 'サーバーエラー',
      message: 'サーバーでエラーが発生しました。後でもう一度お試しください。',
      retry: '再試行',
    },
  },
  fallbackBanner: {
    message: 'このコンテンツは選択した言語で利用できません。英語で表示しています。',
    dismiss: '閉じる',
  },
  article: {
    subjectsLabel: 'テーマ',
    sourcesLabel: '出典',
    published: '公開',
    updated: '更新',
    byAuthor: '{author} 著',
    version: 'v{version}',
    readInLang: '{lang}で読む',
    magica: {
      insight: {
        title: 'Magica: AIコマンドセンター',
        body: 'Magicaは、プロンプトエンジニアリング、モデルルーティング、評価を単一のインターフェースに統合します。',
      },
      evidence: {
        title: 'ワークフロー可視化',
        alt: 'Magicaワークフロービルダーのスクリーンショット',
      },
      architecture: {
        title: 'アーキテクチャ',
        point1: 'ノードベースのプロンプトチェーン',
        point2: 'マルチモデルフォールバックルーティング',
        point3: 'リアルタイムレイテンシーテレメトリー',
      },
      cta: {
        title: '構築を始める',
        body: 'Magicaを無料でお試しください — クレジットカードは不要です。',
        button: 'Magicaを見る',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Magicaワークフロービルダー',
      unifiedPromptEngineering:
        '統合プロンプトエンジニアリング、モデルルーティング、評価を単一インターフェースで',
      magicaCommandCenter: 'Magica：AIコマンドセンター',
      magicaDescription:
        'Magicaはプロンプトエンジニアリング、モデルルーティング、評価を単一インターフェースで統合',
      aiProcessing: 'AI処理',
      nodeBasedPromptChaining: 'ノードベースのプロンプトチェイニング',
      architecture: 'アーキテクチャ',
      multiModelFallback: 'マルチモデルフォールバックルーティング',
      startBuilding: '構築を開始',
      tryMagicaFree: 'Magicaを無料でお試しください — クレジットカード不要',
      visitMagica: 'Magicaを訪問',
      qualityScore: '品質スコア',
      languages: '言語',
      workflowVisualization: 'ワークフロー可視化',
      keyMetrics: '主要指標',
      workflowSteps: 'ワークフローステップ',
      poweredBy: '提供',
    },
    canvaMagica: {
      workflowTitle: 'Magicaワークフロービルダー',
      inputLabel: '入力',
      aiProcessing: {
        title: 'AI処理',
        subtitle: 'ノードベースのプロンプトチェーン',
      },
      qualityScore: '',
      languages: '8言語',
      outputLabel: 'プロンプト → モデルルーター → 出力',
    },
  },
  niche: {
    topicsLabel: 'トピック',
    exploreNiche: '{niche}を探索',
    articleCount: '{count}記事',
    allNiches: 'すべてのトピック',
  },
  editorial: {
    verdictLabel: '判定',
    trusted: '信頼済み',
    caution: '注意',
    flagged: '要注意',
    qualityScore: '',
    editorialQuality: '編集品質',
  },
  dopamineCard: {
    readMore: '続きを読む',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} ソース',
    sources: 'ソース',
    freshnessLabel: '',
  },
  search: {
    placeholder: 'トピック、記事を検索...',
    resultsFor: '"{query}" の検索結果',
    noResults: '結果が見つかりませんでした',
    noResultsHint: '別のキーワードをお試しいただくか、トピックをご覧ください',
    resultCount: '{count} 件の結果',
    searchTitle: '検索',
    searchDescription: 'UniTeiaの記事やトピックを検索',
  },
  seo: {
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'AIトピック',
    topicsDescription: '厳選された人工知能のトピックとニッチのリストをご覧ください。',
  },
  homepage: {
    featuredSignals: '注目のInsights',
    knowledgeClusters: 'クラスター',
    frontierStreams: 'フロンティア',
    signalCount: '{count} insights',
    curatedAcross: '{count} のニッチからキュレーション',
    noSignals: 'Insightsはまだ公開されていません',
    browseTopics: 'トピックを閲覧',
    networkState: 'UniTeia ネットワーク状態',
    signalIntake: 'Insights収集',
    deliveryLayer: '配信レイヤー',
  },
  onboarding: {
    step1: {
      title: '世界はノイズにあふれています。',
      subtitle: '私たちはインサイトを濾過します。',
      desc: '{siteName}は毎日何千ものソースを取り込み、重要なものを抽出します。あなたがする必要はありません。',
    },
    step2: {
      title: '7フィルター',
      cards: [
        { label: 'リサーチ', desc: '生のソースが取り込まれ、信頼性がスコアリングされます。' },
        { label: '検証', desc: '主張が独立したソースと照合されます。' },
        {
          label: '構造化',
          desc: 'コンテンツがフォーマット、ローカライズされ、配信準備が整えられます。',
        },
      ],
    },
    step3: {
      title: '8言語で利用可能。',
      desc: '重要なものだけを。あなたの言語で、あなたの条件で。',
      badge: '8つの声',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · 待機中',
      thinking: 'Aether OS · 思考中',
      processing: 'Aether OS · 処理中',
      complete: 'Aether OS · 完了',
      error: 'Aether OS · エラー',
    },
    mcpTooltip: 'MCPサーバー接続済み · 7つのツールがアクティブ',
  },
  generativeHero: {
    curating: '{niche} insights',
    topNiches: 'トップニッチ',
  },
  legal: {
    privacy: {
      title: 'プライバシーポリシー',
      body: 'プライバシーポリシー。お客様のプライバシーは当社にとって重要です。当社は、UniTeiaのキュレーションサービスを提供するために必要な最小限のデータのみを収集および処理します。お客様のデータを第三者に販売することはありません。このポリシーは、当社のデータ収集、保存、および処理方法を説明しています。',
    },
    terms: {
      title: '利用規約',
      body: '利用規約。UniTeiaを使用することにより、これらの規約に同意したものとみなされます。提供されるコンテンツは情報提供のみを目的としており、専門的なアドバイスを構成するものではありません。当社はいつでもこれらの規約を変更する権利を留保します。',
    },
  },
  canva: {
    hero: {
      title: '思考のスピードでデザインする',
      subtitle: 'AI駆動の編集ワークフローのためのビジュアルキャンバス',
      cta: '探索を始める',
    },
    concept: {
      central: '一つのキャンバスに多くの形 — 意図で組み合わせ可能',
      satellite: {
        1: 'ページを離れずにノードをドラッグ、ドロップ、再接続',
        2: 'すべての変更が8言語に同時に反映される',
      },
    },
    code: {
      step: {
        1: {
          title: 'プロンプトを定義する',
          body: '自然言語の意図から始めます。キャンバスがそれを構造化されたノードに変換します。',
        },
        2: {
          title: 'モデルルーターを接続する',
        },
      },
    },
    compare: {
      option: {
        a: '静的なデザインツール',
        b: 'UniTeia Canva',
      },
      decision: {
        yes: '編集パイプラインに適している',
        no: '多言語AIワークフローには不向き',
      },
    },
    timeline: {
      milestone: {
        1: '2026年Q1 — Canva Magica プライベートアルファ',
        2: '2026年Q3 — 8言語対応のパブリックローンチ',
      },
    },
    summary: {
      takeaway: {
        1: '公開するすべての言語を話す単一のキャンバス',
        2: '構造化データを犠牲にしないビジュアル構成',
      },
      nextstep: 'キャンバスを開き、最初の形を置いて、8言語で公開しましょう',
    },
  },
}
