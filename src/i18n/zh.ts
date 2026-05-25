import type { TranslationStrings } from './types'

export const zh: TranslationStrings = {
  nav: {
    home: '首页',
    about: '关于',
    blog: '博客',
    projects: '项目',
    contact: '联系我们',
    topics: '主题',
    search: '搜索',
    niches: '细分领域',
  },
  footer: {
    copyright: '© {year} UniTeia. 保留所有权利。',
    madeWith: '为去中心化AI用心打造',
    links: {
      privacy: '隐私政策',
      terms: '服务条款',
      source: '源代码',
    },
  },
  langSwitcher: {
    label: '语言',
    current: '当前语言: {lang}',
    available: '可用语言',
  },
  errorPages: {
    '404': {
      title: '页面未找到',
      message: '您访问的页面不存在或已被移动。',
      backHome: '返回首页',
    },
    '500': {
      title: '服务器错误',
      message: '服务器出现问题，请稍后重试。',
      retry: '重试',
    },
  },
  fallbackBanner: {
    message: '此内容在您的语言中不可用。正在以英语显示。',
    dismiss: '关闭',
  },
  article: {
    subjectsLabel: '主题',
    sourcesLabel: '来源',
    published: '发布',
    updated: '更新',
    byAuthor: '作者：{author}',
    version: 'v{version}',
    readInLang: '以{lang}阅读',
  },
  niche: {
    topicsLabel: '主题',
    exploreNiche: '探索{niche}',
    articleCount: '{count}篇文章',
    allNiches: '所有主题',
  },
  editorial: {
    verdictLabel: '判定',
    trusted: '可信',
    caution: '注意',
    flagged: '已标记',
    qualityScore: '质量评分',
    editorialQuality: '编辑质量',
  },
  dopamineCard: {
    readMore: '阅读更多',
  },
  signal: {
    qualityLabel: '质量',
    sourceCount: '{count} 来源',
    sources: '来源',
  },
  search: {
    placeholder: '搜索主题、文章...',
    resultsFor: '"{query}" 的结果',
    noResults: '未找到结果',
    noResultsHint: '尝试不同的关键词或浏览我们的主题',
    resultCount: '{count} 条结果',
    searchTitle: '搜索',
    searchDescription: '搜索 UniTeia 的文章和主题',
  },
  seo: {
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'AI 主题',
    topicsDescription: '探索我们精选的人工智能主题和领域列表。',
  },
  onboarding: {
    step1: {
      title: '世界充满噪音。',
      subtitle: '我们过滤信号。',
      desc: '{siteName} 每天摄入数千个来源，提取重要的信息。让您无需亲力亲为。',
    },
    step2: {
      title: '每个信号在到达您之前都经过7道质量关卡。',
    },
    step3: {
      title: '支持8种语言。',
      desc: '只有重要的内容。用您的语言，按您的方式。',
      badge: '8种声音',
    },
  },
  legal: {
    privacy: {
      title: '隐私政策',
      body: '隐私政策。您的隐私对我们很重要。我们收集和处理为您提供UniTeia内容筛选服务所需的最少数据。我们不会将您的数据出售给第三方。本政策概述了我们的数据收集、存储和处理实践。',
    },
    terms: {
      title: '服务条款',
      body: '服务条款。使用UniTeia即表示您同意这些条款。所提供的内容仅供参考，不构成专业建议。我们保留随时修改这些条款的权利。',
    },
  },
}
