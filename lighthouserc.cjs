/**
 * Lighthouse CI Configuration
 * PLANO-080: Quality gate for UniTeia 83 SSG pages
 *
 * DEV thresholds (preview server): lower due to wrangler dev overhead
 * PRODUCTION thresholds (CF Pages): see below
 *
 * Production target (CF Pages CDN):
 *   performance: ≥0.90, a11y: 1.0, bp: 1.0, seo: 1.0
 *
 * @type {import('@lhci/cli').LighthouseCIOptions}
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8788/en/signals/apex/magica-overview',
        'http://localhost:8788/pt/signals/apex/magica-overview',
        'http://localhost:8788/ja/signals/apex/magica-overview',
        'http://localhost:8788/zh/signals/apex/magica-overview',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 2,
          downloadThroughputKbps: 16000,
          uploadThroughputKbps: 7500,
          rttMs: 40,
        },
      },
    },
    assert: {
      assertions: {
        // Categories (dev thresholds — production targets higher)
        'categories:performance': ['warn', { minScore: 0.50 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1.0 }],

        // Core Web Vitals
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 100 }],
        'total-blocking-time': ['warn', { maxNumericValue: 2000 }],

        // Accessibility — MUST pass
        'color-contrast': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'meta-description': ['error', { minScore: 1 }],

        // SEO — MUST pass
        'hreflang': ['error', { minScore: 1 }],
        'canonical': ['error', { minScore: 1 }],
        'crawlable-links': ['error', { minScore: 1 }],
        'is-crawlable': ['error', { minScore: 1 }],
        'link-text': ['warn', { minScore: 1 }],

        // Resource budgets
        'render-blocking-resources': ['warn', { maxLength: 5 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      command: 'bun run preview:cf',
      port: 8788,
      waitForReady: {
        pattern: 'Local:',
        timeout: 30000,
      },
    },
  },
}
