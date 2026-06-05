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
    signalCountOne: '1 insight',
    curatedAcross: 'curated across {count} niches',
    curatedAcrossOne: 'curated across 1 niche',
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
    apexBadge: 'APEX · Live',
    headline: 'Frontier signals from {count} tracks',
    headlineOne: 'Frontier signals from 1 track',
    tracksLabel: 'active tracks',
    tracksLabelOne: 'active track',
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
  sketchnote: {
    template01: {
      title: 'Template 01 — Practical Visual Explainer',
      subtitle: 'Explain concepts fast with visual logic',
      postIt: 'Sketchnotes + Code + Clarity = Faster Learning',
      mascotBubble: 'Let’s make it visual.',
      steps: {
        hook: {
          kind: 'Hook',
          title: 'MCP for devs',
          body: 'Connect AI agents to any tool. Safely. Reliably. Extensibly.',
        },
        mistake: {
          kind: 'Common mistake',
          title: 'Thinking MCP is just another API.',
          body: 'APIs expose functions. MCP goes further.',
          postIt: 'APIs expose functions. MCP orchestrates capabilities for agents.',
        },
        analogy: {
          kind: 'Visual analogy',
          title: 'MCP is the hub that connects agents to tools.',
          body: 'One protocol. Many tools. Agents stay focused.',
          items: ['Search', 'Database', 'Files', 'APIs'],
          agentLabel: 'AI Agent',
        },
        diagram: {
          kind: 'Working diagram',
          title: 'How MCP works end to end',
          body: 'Find Q1 revenue\nUnderstands and plans\nRoutes, auth, context, safety\nExecutes real work\nStructured response',
          flow: ['User', 'AI Agent', 'MCP Server', 'Tools', 'Answer'],
        },
        example: {
          kind: 'Practical example',
          title: 'Example: Tool call via MCP',
          body: 'Agent asks via MCP. Server finds the right tool and executes.',
          caption: 'JSON-RPC request',
        },
        use: {
          kind: 'When to use',
          title: 'Use MCP when…',
          useHeader: 'Use MCP when',
          useItems: [
            'You have multiple tools or data sources',
            'You need secure, governed access',
            'You want agents to act with context & safety',
            'You expect to scale tools or teams',
          ],
          dontHeader: 'Don’t use MCP when',
          dontItems: [
            'You only call one simple API',
            'You don’t need agent orchestration',
            'You want a lightweight frontend integration',
            'You’re just exposing a public endpoint',
          ],
        },
        pitfalls: {
          kind: 'Common pitfalls',
          title: 'Avoid these pitfalls:',
          items: [
            'Exposing tools without proper auth & guardrails',
            'Overloading the agent with too many tools.',
            'Ignoring context, logging, and observability.',
          ],
          tipHeader: 'Design for safety, clarity, and observability.',
          tip: 'Plan the tool surface before you wire anything.',
        },
        nextStep: {
          kind: 'Next step',
          title: 'Your next step:',
          items: [
            'Pick one real tool to connect',
            'Design the tool schema',
            'Implement the MCP endpoint',
            'Add auth & permissions',
            'Test with your agent',
            'Add logging & monitoring',
            'Document for your team',
          ],
          closingNote: 'Start small. Ship one capability. Iterate.',
        },
      },
      tags: {
        visualLogic: 'Visual logic',
        devFriendly: 'Developer friendly',
        practicalByDesign: 'Practical by design',
      },
      level: 'For beginners → intermediate',
      footer: 'Built for learners. Designed for devs. Made by UniTeia / ConteiXeia',
    },
    template02: {
      title: 'Template 02 — Code Recipe / Mini Build',
      subtitle: 'Teach practical implementation fast.',
      postIt: 'Sketchnotes + Code + Clarity + Faster Learning',
      mascotBubble: 'Let’s build it.',
      steps: {
        result: {
          kind: 'Result',
          title: 'Final, result',
          body: 'Live drawing with Canvas',
          caption: 'Smooth real-time ink',
        },
        install: {
          kind: 'Install',
          title: 'Add the magic freehand engine.',
          body: 'One package, zero config.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Code',
          title: 'Minimal code',
          body: 'Capture points, get a smooth stroke.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'How it works',
          title: 'From input to beautiful ink.',
          body: 'Each pointer event becomes a stroke.',
          flow: ['Mouse/Touch', 'Points', 'Spline (Smooth)', 'Canvas (Draw)'],
          caption: 'Each pointer event becomes a stroke.',
        },
        upgrade: {
          kind: 'Upgrade ideas',
          title: 'Make it useful. Make it yours.',
          body: 'Three quick wins to take it further.',
          items: [
            { name: 'Save & Reopen', desc: 'Store drawing as JSON. Load it back anytime.' },
            { name: 'Undo / Redo', desc: 'Keep a stack of strokes for seamless history.' },
            { name: 'Export Image', desc: 'Export the canvas as PNG.' },
          ],
          caption: 'Three quick wins.',
        },
      },
      cta: 'From idea to implementation',
      tags: {
        visualLogic: 'Visual logic',
        devFriendly: 'Developer friendly',
        practicalByDesign: 'Practical by design',
      },
      footer: 'Built for learners. Designed for devs. Made by UniTeia / ConteiXeia',
    },
    template03: {
      title: 'Template 03 — Decision Map / Comparativo Visual',
      subtitle: 'Compare options and choose fast',
      postIt: 'Sketchnotes + Code + Clarity + Faster Learning',
      mascotBubble: 'Pick the best tool with logic.',
      panels: {
        question: {
          kind: 'Question',
          title: 'Which whiteboard should you use?',
          subtitle: '4 great options. Different strengths.',
          tipTitle: 'Pro tip',
          tip: 'There’s no “best” — only best for your use case.',
        },
        options: {
          kind: 'Options',
          title: 'Option map',
          options: [
            { name: 'tldraw desktop', desc: 'App ready. Full experience. Built-in.' },
            { name: 'tldraw SDK', desc: 'Embed in your app. Full control. Your UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-lightweight. Great performance. Infinite canvas.',
            },
            { name: 'Excalidraw', desc: 'Simple aesthetic. Open source. Quick to ship.' },
          ],
        },
        decision: {
          kind: 'Decision',
          title: 'Decision logic',
          subtitle: 'Answer yes/no, follow the first match.',
          rules: [
            { question: 'Want app ready out of the box?', yesTo: 'tldraw desktop' },
            { question: 'Want to embed the whiteboard in your own app?', yesTo: 'tldraw SDK' },
            {
              question: 'Need ultra-lightweight with best performance?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Want a simple, clean look and open source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Answer top to bottom. Take the first “Yes”.',
        },
        summary: {
          kind: 'Summary',
          title: 'Recommendation summary',
          options: [
            {
              name: 'tldraw desktop',
              verdict: 'Best when you want a complete whiteboard app ready to use.',
            },
            {
              name: 'tldraw SDK',
              verdict: 'Best when you want to embed and customize the whiteboard in your product.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Best when you need maximum performance and minimal bundle size.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Best when you want simplicity, open source, and a clean drawing experience.',
            },
          ],
          closingNote: 'Pick the tool that fits your constraints, team, and user experience goals.',
        },
      },
      cta: 'Fast comparison for builders',
      tags: {
        visualLogic: 'Visual logic',
        devFriendly: 'Developer friendly',
        practicalByDesign: 'Practical by design',
      },
      footer: 'Built for learners. Designed for devs. Made by UniTeia / ConteiXeia',
    },
  },
  canva: {
    hero: {
      title: 'The signal you can build on',
      subtitle: 'Six scenes, one decision',
      cta: 'Open the canvas',
    },
    concept: {
      central: 'Why this matters now',
      satellite: { '1': 'Faster decisions', '2': 'Sharper signal' },
    },
    code: {
      step: {
        '1': { title: 'Wire the basics', body: 'Twenty lines, three files, one working flow.' },
        '2': { title: 'Add the next layer' },
      },
    },
    compare: {
      option: { a: 'Build it yourself', b: 'Use the platform' },
      decision: { yes: 'Yes, if it pays for itself', no: 'No, the platform is already there' },
    },
    timeline: { milestone: { '1': 'Today: one shape', '2': 'Six months: a full canvas' } },
    summary: {
      takeaway: { '1': 'Start smaller than feels right', '2': 'Reuse beats reinvention' },
      nextstep: 'Build the smallest thing that works',
    },
  },
}
