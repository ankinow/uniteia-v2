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
    qualityScore: 'Quality Score',
    editorialQuality: 'Editorial Quality',
  },
  dopamineCard: {
    readMore: 'Read more',
  },
  signal: {
    qualityLabel: 'Quality',
    sourceCount: '{count} sources',
    sources: 'sources',
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
    siteName: 'UniTeia',
    articleTitleTemplate: '{title} | UniTeia',
    topicsTitle: 'AI Topics',
    topicsDescription: 'Explore our curated list of Artificial Intelligence topics and niches.',
  },
  onboarding: {
    step1: {
      title: 'The world is noisy.',
      subtitle: 'We filter the signal.',
      desc: "{siteName} ingests thousands of sources daily, extracting what matters. So you don't have to.",
    },
    step2: {
      title: 'Every signal passes 7 quality gates before reaching you.',
    },
    step3: {
      title: 'Available in 8 languages.',
      desc: 'Only what matters. Delivered in your language, on your terms.',
      badge: '8 voices',
    },
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
}
