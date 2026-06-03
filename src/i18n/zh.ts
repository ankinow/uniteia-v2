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
    breadcrumb: {
      label: '当前位置:',
      signals: '信号',
    },
  },
  sidebar: {
    interfaceLabel: '紧凑界面',
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
    magica: {
      insight: {
        title: 'Magica：AI指挥中心',
        body: 'Magica 将提示工程、模型路由和评估统一在单一界面中。',
      },
      evidence: {
        title: '工作流可视化',
        alt: 'Magica 工作流构建器截图',
      },
      architecture: {
        title: '架构',
        point1: '基于节点的提示链',
        point2: '多模型故障转移路由',
        point3: '实时延迟遥测',
      },
      cta: {
        title: '开始构建',
        body: '免费试用 Magica — 无需信用卡。',
        button: '访问 Magica',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Magica工作流构建器',
      unifiedPromptEngineering: '统一的提示工程、模型路由和评估，集成于单一界面',
      magicaCommandCenter: 'Magica：AI指挥中心',
      magicaDescription: 'Magica将提示工程、模型路由和评估统一于单一界面',
      aiProcessing: 'AI处理',
      nodeBasedPromptChaining: '基于节点的提示链',
      architecture: '架构',
      multiModelFallback: '多模型回退路由',
      startBuilding: '开始构建',
      tryMagicaFree: '免费试用Magica — 无需信用卡',
      visitMagica: '访问Magica',
      qualityScore: '质量评分',
      languages: '语言',
      workflowVisualization: '工作流可视化',
      keyMetrics: '关键指标',
      workflowSteps: '工作流步骤',
      poweredBy: '技术支持',
    },
    canvaMagica: {
      workflowTitle: 'Magica工作流构建器',
      inputLabel: '输入',
      aiProcessing: {
        title: 'AI处理',
        subtitle: '基于节点的提示链',
      },
      qualityScore: '84质量评分',
      languages: '8种语言',
      outputLabel: '提示 → 模型路由器 → 输出',
    },
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
    freshnessLabel: '新鲜度',
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
  homepage: {
    featuredSignals: '精选信号',
    knowledgeClusters: '知识集群',
    frontierStreams: '前沿流',
    signalCount: '{count} 个信号',
    curatedAcross: '从 {count} 个领域精选',
    noSignals: '此语言尚未发布任何信号。',
    browseTopics: '浏览主题',
    networkState: 'UniTeia 网络状态',
    signalIntake: '信号摄入',
    deliveryLayer: '交付层',
  },
  onboarding: {
    step1: {
      title: '世界充满噪音。',
      subtitle: '我们过滤信号。',
      desc: '{siteName} 每天摄入数千个来源，提取重要的信息。让您无需亲力亲为。',
    },
    step2: {
      title: '每个信号在到达你之前都会经过7道质量关卡。',
      cards: [
        { label: '研究', desc: '原始来源被摄取并根据可信度评分。' },
        { label: '验证', desc: '声明与独立来源进行交叉验证。' },
        { label: '结构化', desc: '内容被格式化、本地化并准备好交付。' },
      ],
    },
    step3: {
      title: '支持8种语言。',
      desc: '只有重要的内容。用您的语言，按您的方式。',
      badge: '8种声音',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · 空闲',
      thinking: 'Aether OS · 思考中',
      processing: 'Aether OS · 处理中',
      complete: 'Aether OS · 完成',
      error: 'Aether OS · 错误',
    },
    mcpTooltip: 'MCP服务器已连接 · 7个活跃工具',
  },
  generativeHero: {
    curating: '正在策展 {niche} 信号',
    topNiches: '热门领域',
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
