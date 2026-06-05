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
    breadcrumb: {
      label: string
      signals: string
    }
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
    magica: {
      insight: { title: string; body: string }
      evidence: { title: string; alt: string }
      architecture: { title: string; point1: string; point2: string; point3: string }
      cta: { title: string; body: string; button: string }
    }
    canvaMagica: {
      workflowTitle: string
      inputLabel: string
      aiProcessing: {
        title: string
        subtitle: string
      }
      qualityScore: string
      languages: string
      outputLabel: string
    }
    canvaMagicaProduction: {
      magicaWorkflowBuilder: string
      unifiedPromptEngineering: string
      magicaCommandCenter: string
      magicaDescription: string
      aiProcessing: string
      nodeBasedPromptChaining: string
      architecture: string
      multiModelFallback: string
      startBuilding: string
      tryMagicaFree: string
      visitMagica: string
      qualityScore: string
      languages: string
      workflowVisualization: string
      keyMetrics: string
      workflowSteps: string
      poweredBy: string
    }
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
    frontierStreamsOne: string
    signalCount: string
    signalCountOne: string
    curatedAcross: string
    curatedAcrossOne: string
    noSignals: string
    browseTopics: string
    networkState: string
    signalIntake: string
    deliveryLayer: string
    bentoTagline: string
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
  generativeHero: {
    curating: string
    topNiches: string
    apexBadge: string
    headline: string
    headlineOne: string
    tracksLabel: string
    tracksLabelOne: string
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
  sketchnote: {
    template01: {
      title: string
      subtitle: string
      postIt: string
      mascotBubble: string
      steps: {
        hook: { kind: string; title: string; body: string }
        mistake: { kind: string; title: string; body: string; postIt: string }
        analogy: {
          kind: string
          title: string
          body: string
          items: string[]
          agentLabel: string
        }
        diagram: { kind: string; title: string; body: string; flow: string[] }
        example: { kind: string; title: string; body: string; caption: string }
        use: {
          kind: string
          title: string
          useHeader: string
          useItems: string[]
          dontHeader: string
          dontItems: string[]
        }
        pitfalls: {
          kind: string
          title: string
          items: string[]
          tipHeader: string
          tip: string
        }
        nextStep: {
          kind: string
          title: string
          items: string[]
          closingNote: string
        }
      }
      tags: { visualLogic: string; devFriendly: string; practicalByDesign: string }
      level: string
      footer: string
    }
    template02: {
      title: string
      subtitle: string
      postIt: string
      mascotBubble: string
      steps: {
        result: { kind: string; title: string; body: string; caption: string }
        install: {
          kind: string
          title: string
          body: string
          command: string
          output: string
        }
        code: { kind: string; title: string; body: string; caption: string }
        howItWorks: {
          kind: string
          title: string
          body: string
          flow: string[]
          caption: string
        }
        upgrade: {
          kind: string
          title: string
          body: string
          items: { name: string; desc: string }[]
          caption: string
        }
      }
      cta: string
      tags: { visualLogic: string; devFriendly: string; practicalByDesign: string }
      footer: string
    }
    template03: {
      title: string
      subtitle: string
      postIt: string
      mascotBubble: string
      panels: {
        question: {
          kind: string
          title: string
          subtitle: string
          tipTitle: string
          tip: string
        }
        options: {
          kind: string
          title: string
          options: { name: string; desc: string }[]
        }
        decision: {
          kind: string
          title: string
          subtitle: string
          rules: { question: string; yesTo: string }[]
          bottomNote: string
        }
        summary: {
          kind: string
          title: string
          options: { name: string; verdict: string }[]
          closingNote: string
        }
      }
      cta: string
      tags: { visualLogic: string; devFriendly: string; practicalByDesign: string }
      footer: string
    }
  }
  /**
   * 18 i18n keys consumed by `useCanvaI18n` and `CanvaComposition` (canva pipeline).
   * Flat dotted-path shape — `useCanvaI18n` reads via `getTranslation(lang)`
   * directly (Qwik SSR-safe, NOT via useI18n() closure which can't resolve
   * nested proxy paths).
   */
  canva: {
    hero: { title: string; subtitle: string; cta: string }
    concept: { central: string; satellite: { '1': string; '2': string } }
    code: {
      step: {
        '1': { title: string; body: string }
        '2': { title: string }
      }
    }
    compare: {
      option: { a: string; b: string }
      decision: { yes: string; no: string }
    }
    timeline: { milestone: { '1': string; '2': string } }
    summary: { takeaway: { '1': string; '2': string }; nextstep: string }
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
