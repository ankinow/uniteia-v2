import type { TranslationStrings } from './types'

export const ja: TranslationStrings = {
  nav: {
    home: 'ホーム',
    about: '概要',
    blog: 'ブログ',
    projects: 'プロジェクト',
    contact: 'お問い合わせ',
    topics: 'トピック',
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
  qualityRing: {
    qualityScore: '品質スコア',
    editorialQuality: '編集品質',
  },
  dopamineCard: {
    readMore: '続きを読む',
  },
}
