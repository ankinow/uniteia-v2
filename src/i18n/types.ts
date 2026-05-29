/**
 * Translation type contract for UniTeia i18n system
 * All language files must implement this interface
 *
 * Locale codes, defaults, and cookie names are sourced from edge/contract.v1.ts.
 * Re-exported here for backwards compatibility.
 */

export {
  LOCALE_CODES,
  DEFAULT_LOCALE as DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_COOKIE_MAX_AGE,
  type SupportedLocale as SupportedLanguage,
} from '../edge/contract.v1'

import type { SupportedLocale } from '../edge/contract.v1'

// ── Translation Strings Interface ─────────────────────────────────────
export interface TranslationStrings {
  nav: {
    home: string
    about: string
    blog: string
    projects: string
    contact: string
    topics: string
    search: string
    niches: string
  }
  sidebar: {
    interfaceLabel: string
  }
  footer: {
    copyright: string
    madeWith: string
    links: {
      privacy: string
      terms: string
      source: string
    }
  }
  langSwitcher: {
    label: string
    current: string
    available: string
  }
  errorPages: {
    '404': {
      title: string
      message: string
      backHome: string
    }
    '500': {
      title: string
      message: string
      retry: string
    }
  }
  fallbackBanner: {
    message: string
    dismiss: string
  }
  article: {
    subjectsLabel: string
    sourcesLabel: string
    published: string
    updated: string
    byAuthor: string
    version: string
    readInLang: string
  }
  niche: {
    topicsLabel: string
    exploreNiche: string
    articleCount: string
    allNiches: string
  }
  editorial: {
    verdictLabel: string
    trusted: string
    caution: string
    flagged: string
    qualityScore: string
    editorialQuality: string
  }
  dopamineCard: {
    readMore: string
  }
  signal: {
    qualityLabel: string
    sourceCount: string
    sources: string
    freshnessLabel: string
  }
  search: {
    placeholder: string
    resultsFor: string
    noResults: string
    noResultsHint: string
    resultCount: string
    searchTitle: string
    searchDescription: string
  }
  seo: {
    siteName: string
    articleTitleTemplate: string
    topicsTitle: string
    topicsDescription: string
  }
  homepage: {
    featuredSignals: string
    knowledgeClusters: string
    frontierStreams: string
    signalCount: string
    curatedAcross: string
    noSignals: string
    browseTopics: string
    networkState: string
    signalIntake: string
    deliveryLayer: string
  }
  onboarding: {
    step1: {
      title: string
      subtitle: string
      desc: string
    }
    step2: {
      title: string
      cards: Array<{
        label: string
        desc: string
      }>
    }
    step3: {
      title: string
      desc: string
      badge: string
    }
  }
  agent: {
    status: {
      idle: string
      thinking: string
      processing: string
      complete: string
      error: string
    }
    mcpTooltip: string
  }
  legal: {
    privacy: {
      title: string
      body: string
    }
    terms: {
      title: string
      body: string
    }
  }
}

// ── Language Info (UI-facing metadata) ────────────────────────────────

export interface LanguageInfo {
  code: SupportedLocale
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
]
