import type { TranslationStrings } from './types'

export const zh: TranslationStrings = {
  nav: {
    home: '首页',
    about: '关于',
    blog: '博客',
    projects: '项目',
    contact: '联系我们',
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
}
