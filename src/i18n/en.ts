import type { TranslationStrings } from './types'

export const en: TranslationStrings = {
  nav: {
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    projects: 'Projects',
    contact: 'Contact',
    topics: 'Topics',
    search: 'Search',
    niches: 'Niches',
    breadcrumb: {
      label: 'You are here:',
      signals: 'Insights',
    },
  },
  sidebar: {
    interfaceLabel: 'Compact Interface',
  },
  footer: {
    copyright: '© {year} UniTeia. All rights reserved.',
    madeWith: 'Made with ♥ for decentralized AI',
    links: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      source: 'Source Code',
    },
  },
  langSwitcher: {
    label: 'Language',
    current: 'Current language: {lang}',
    available: 'Available languages',
  },
  errorPages: {
    '404': {
      title: 'Page Not Found',
      message: "The page you're looking for doesn't exist or has been moved.",
      backHome: 'Back to Home',
    },
    '500': {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      retry: 'Retry',
    },
  },
  fallbackBanner: {
    message: 'This content is not available in your language. Showing in English.',
    dismiss: 'Dismiss',
  },
  article: {
    subjectsLabel: 'Subjects',
    sourcesLabel: 'Sources',
    published: 'Published',
    updated: 'Updated',
    byAuthor: 'by {author}',
    version: 'v{version}',
    readInLang: 'Read in {lang}',
    magica: {
      insight: {
        title: 'Magica: The AI Command Center',
        body: 'Magica unifies prompt engineering, model routing, and evaluation in a single interface.',
      },
      evidence: {
        title: 'Workflow Visualization',
        alt: 'Screenshot of Magica workflow builder',
      },
      architecture: {
        title: 'Architecture',
        point1: 'Node-based prompt chaining',
        point2: 'Multi-model fallback routing',
        point3: 'Real-time latency telemetry',
      },
      cta: {
        title: 'Start Building',
        body: 'Try Magica free — no credit card required.',
        button: 'Visit Magica',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Magica Workflow Builder',
      unifiedPromptEngineering:
        'Unified prompt engineering, model routing, and evaluation in a single interface',
      magicaCommandCenter: 'Magica: The AI Command Center',
      magicaDescription:
        'Magica unifies prompt engineering, model routing, and evaluation in a single interface',
      aiProcessing: 'AI Processing',
      nodeBasedPromptChaining: 'Node-based prompt chaining',
      architecture: 'Architecture',
      multiModelFallback: 'Multi-model fallback routing',
      startBuilding: 'Start Building',
      tryMagicaFree: 'Try Magica free — no credit card required',
      visitMagica: 'Visit Magica',
      qualityScore: 'Quality Score',
      languages: 'Languages',
      workflowVisualization: 'Workflow Visualization',
      keyMetrics: 'Key Metrics',
      workflowSteps: 'Workflow Steps',
      poweredBy: 'Powered by',
    },
    canvaMagica: {
      workflowTitle: 'Magica Workflow Builder',
      inputLabel: 'INPUT',
      aiProcessing: {
        title: 'AI PROCESSING',
        subtitle: 'Node-based prompt chaining',
      },
      qualityScore: '',
      languages: '8 languages',
      outputLabel: 'Prompt → Model Router → Output',
    },
  },
  niche: {
    topicsLabel: 'Topics',
    exploreNiche: 'Explore {niche}',
    articleCount: '{count} articles',
    allNiches: 'All Topics',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Trusted',
    caution: 'Caution',
    flagged: 'Flagged',
    qualityScore: '',
    editorialQuality: 'Editorial Quality',
  },
  dopamineCard: {
    readMore: 'Read more',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} sources',
    sources: 'sources',
    freshnessLabel: '',
  },
  search: {
    placeholder: 'Search topics, articles...',
    resultsFor: 'Results for "{query}"',
    noResults: 'No results found',
    noResultsHint: 'Try different keywords or browse our topics',
    resultCount: '{count} results',
    searchTitle: 'Search',
    searchDescription: 'Search UniTeia topics and articles',
  },
  seo: {
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'AI Topics',
    topicsDescription: 'Explore our curated list of Artificial Intelligence topics and niches.',
  },
  homepage: {
    featuredSignals: 'Featured Insights',
    knowledgeClusters: 'Clusters',
    frontierStreams: 'Fronteira',
    signalCount: '{count} insights',
    curatedAcross: 'curated across {count} niches',
    noSignals: 'No insights published yet in this locale.',
    browseTopics: 'Browse topics',
    networkState: 'UniTeia Network State',
    signalIntake: 'Insight Intake',
    deliveryLayer: 'Delivery Layer',
  },
  onboarding: {
    step1: {
      title: 'The world is noisy.',
      subtitle: 'We filter the signal.',
      desc: "{siteName} ingests thousands of sources daily, extracting what matters. So you don't have to.",
    },
    step2: {
      title: 'Every insight passes 7 filters before reaching you.',
      cards: [
        { label: 'Research', desc: 'Raw sources are ingested and scored for trust.' },
        { label: 'Verify', desc: 'Claims are cross-checked against independent sources.' },
        { label: 'Structure', desc: 'Content is formatted, localized, and readied for delivery.' },
      ],
    },
    step3: {
      title: 'Available in 8 languages.',
      desc: 'Only what matters. Delivered in your language, on your terms.',
      badge: '8 voices',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Idle',
      thinking: 'Aether OS · Thinking',
      processing: 'Aether OS · Processing',
      complete: 'Aether OS · Complete',
      error: 'Aether OS · Error',
    },
    mcpTooltip: 'MCP Server Connected · 7 tools active',
  },
  generativeHero: {
    curating: '{niche} insights today',
    topNiches: 'Top Niches',
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      body: 'Privacy Policy. Your privacy is important to us. We collect and process minimal data necessary to provide the UniTeia curation service. We do not sell your data to third parties. This policy outlines our data collection, storage, and processing practices.',
    },
    terms: {
      title: 'Terms of Service',
      body: 'Terms of Service. By using UniTeia, you agree to these terms. The content provided is for informational purposes only and does not constitute professional advice. We reserve the right to modify these terms at any time.',
    },
  },
  canva: {
    hero: {
      title: 'Design at the speed of thought',
      subtitle: 'A visual canvas for AI-driven editorial workflows',
      cta: 'Start exploring',
    },
    concept: {
      central: 'One canvas, many shapes — composable by intent',
      satellite: {
        1: 'Drag, drop and rewire nodes without leaving the page',
        2: 'Every change reflects in 8 languages simultaneously',
      },
    },
    code: {
      step: {
        1: {
          title: 'Define the prompt',
          body: 'Start with a natural-language intent. The canvas turns it into structured nodes.',
        },
        2: {
          title: 'Wire the model router',
        },
      },
    },
    compare: {
      option: {
        a: 'Static design tool',
        b: 'UniTeia Canva',
      },
      decision: {
        yes: 'Fits our editorial pipeline',
        no: 'Wrong tool for multilingual AI workflows',
      },
    },
    timeline: {
      milestone: {
        1: '2026 Q1 — Canva Magica private alpha',
        2: '2026 Q3 — Public launch with 8-language parity',
      },
    },
    summary: {
      takeaway: {
        1: 'One canvas that speaks every language you publish in',
        2: 'Visual composition without giving up structured data',
      },
      nextstep: 'Open the canvas, drop your first shape, and publish in 8 languages',
    },
  },
}
