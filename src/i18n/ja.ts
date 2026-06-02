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
    canvaMagica: {
      workflowTitle: 'Magicaワークフロービルダー',
      inputLabel: '入力',
      aiProcessing: {
        title: 'AI処理',
        subtitle: 'ノードベースのプロンプトチェーン',
      },
      qualityScore: '84品質スコア',
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
    qualityScore: '品質スコア',
    editorialQuality: '編集品質',
  },
  dopamineCard: {
    readMore: '続きを読む',
  },
  signal: {
    qualityLabel: '品質',
    sourceCount: '{count} ソース',
    sources: 'ソース',
    freshnessLabel: '鮮度',
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
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'AIトピック',
    topicsDescription: '厳選された人工知能のトピックとニッチのリストをご覧ください。',
  },
  homepage: {
    featuredSignals: '注目のシグナル',
    knowledgeClusters: '知識クラスター',
    frontierStreams: 'フロンティアストリーム',
    signalCount: '{count} シグナル',
    curatedAcross: '{count} のニッチからキュレーション',
    noSignals: 'この言語ではまだシグナルは公開されていません。',
    browseTopics: 'トピックを閲覧',
    networkState: 'UniTeia ネットワーク状態',
    signalIntake: 'シグナル摂取',
    deliveryLayer: '配信レイヤー',
  },
  onboarding: {
    step1: {
      title: '世界はノイズにあふれています。',
      subtitle: '私たちはシグナルを濾過します。',
      desc: '{siteName}は毎日何千ものソースを取り込み、重要なものを抽出します。あなたがする必要はありません。',
    },
    step2: {
      title: 'すべてのシグナルは、あなたの元に届く前に7つの品質ゲートを通過します。',
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
    curating: '{niche}のシグナルをキュレーション',
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
}
