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
      backHome: 'Return to Apex',
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
    frontierStreamsOne: 'Fronteira',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'curated across {count} niches',
    curatedAcrossOne: 'curated across 1 niche',
    noSignals: 'No insights published yet in this locale.',
    browseTopics: 'Browse topics',
    networkState: 'UniTeia Network State',
    signalIntake: 'Insight Intake',
    deliveryLayer: 'Delivery Layer',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
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
      body: `<h2>1. Information We Collect</h2><p>We collect only the minimum data required to operate the UniTeia curation platform. This includes: (a) <strong>Usage data</strong> — page views and navigation patterns via anonymous analytics, (b) <strong>Search queries</strong> — terms you search for to improve results, (c) <strong>Language preferences</strong> — your chosen locale. We do <strong>not</strong> collect personal identifiers, email addresses (unless you subscribe to our newsletter), or payment information.</p><h2>2. How We Use Your Data</h2><p>All collected data serves a single purpose: to deliver and improve the UniTeia editorial curation experience. We use aggregated analytics to understand which topics readers value most, and locale preferences to serve content in your language. We never use your data for automated profiling, behavioral advertising, or any purpose unrelated to content delivery.</p><h2>3. Cookies and Local Storage</h2><p>UniTeia uses a single functional cookie to remember your theme preference (light/dark mode). We do not use tracking cookies, third-party advertising cookies, or fingerprinting techniques. No consent banner is necessary under GDPR Article 6(1)(f) as we process only essential data.</p><h2>4. Third Parties</h2><p>We do not sell, rent, or share your data with third parties. We use Cloudflare for content delivery and DDoS protection — Cloudflare may process your IP address as part of their network operations. We use no external analytics services, no ad networks, and no social media trackers.</p><h2>5. Data Retention and Security</h2><p>Search queries and usage data are retained for 30 days in aggregate form only. We employ TLS encryption for all data in transit and follow Cloudflare's security best practices. You may request deletion of any stored data by contacting us.</p><h2>6. Your Rights</h2><p>Depending on your jurisdiction, you may have rights under GDPR (EU), LGPD (Brazil), CCPA (California), or similar laws. These include the right to access, rectify, delete, and port your data. To exercise any of these rights, contact us at the email listed below.</p><h2>7. Contact</h2><p>For privacy-related inquiries: <a href="mailto:privacy@uniteia.com">privacy@uniteia.com</a>. This policy was last updated on June 8, 2026.</p>`,
    },
    terms: {
      title: 'Terms of Service',
      body: `<h2>1. Acceptance of Terms</h2><p>By accessing or using UniTeia ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately. We reserve the right to update these terms at any time — continued use after changes constitutes acceptance.</p><h2>2. Service Description</h2><p>UniTeia is an editorial curation platform that aggregates, analyzes, and presents information about artificial intelligence, cloud computing, and related technologies. The Service is provided free of charge and without warranty.</p><h2>3. Content Disclaimer</h2><p>All content on UniTeia is for <strong>informational purposes only</strong>. It does not constitute professional advice (legal, financial, technical, or otherwise). We make no representations about the accuracy, completeness, or timeliness of any content. AI-generated content is clearly marked and should be verified independently.</p><h2>4. Intellectual Property</h2><p>The UniTeia platform code is open source under the MIT License. Editorial content (articles, visuals, diagrams) is licensed under Creative Commons Attribution 4.0 (CC BY 4.0) unless otherwise noted. You may share and adapt content with proper attribution. Third-party content and trademarks remain the property of their respective owners.</p><h2>5. User Conduct</h2><p>You agree not to: (a) use the Service for any unlawful purpose, (b) attempt to disrupt or overload our infrastructure, (c) scrape content in violation of rate limits, (d) impersonate UniTeia or its operators.</p><h2>6. Limitation of Liability</h2><p>UniTeia is provided "as is" without warranties of any kind, express or implied. In no event shall UniTeia or its operators be liable for any damages arising from the use or inability to use the Service. This limitation applies to the fullest extent permitted by law.</p><h2>7. Third-Party Links</h2><p>The Service contains links to external websites and resources. We do not endorse and are not responsible for the content, accuracy, or practices of any third-party sites. Access them at your own risk.</p><h2>8. Governing Law</h2><p>These terms are governed by the laws of Brazil. Any disputes shall be resolved in the courts of São Paulo, Brazil. For users in the European Union, mandatory consumer protection laws of your country of residence remain unaffected.</p><h2>9. Termination</h2><p>We reserve the right to terminate or suspend access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users or the Service.</p><h2>10. Contact</h2><p>For questions about these terms: <a href="mailto:legal@uniteia.com">legal@uniteia.com</a>. Last updated: June 8, 2026.</p>`,
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
