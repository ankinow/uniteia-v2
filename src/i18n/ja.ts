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
  onboarding: {
    step1: {
      title: '世界はノイズにあふれています。',
      subtitle: '私たちはシグナルを濾過します。',
      desc: '{siteName}は毎日何千ものソースを取り込み、重要なものを抽出します。あなたがする必要はありません。',
    },
    step2: {
      title: 'すべてのシグナルは、あなたに届く前に7つの品質ゲートを通過します。',
    },
    step3: {
      title: '8言語で利用可能。',
      desc: '重要なものだけを。あなたの言語で、あなたの条件で。',
      badge: '8つの声',
    },
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
