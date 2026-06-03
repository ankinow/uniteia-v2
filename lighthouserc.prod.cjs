/**
 * Lighthouse CI — Production Config (Cloudflare Pages)
 * PLANO-080-R9: Stricter thresholds for CDN-deployed assets
 *
 * Run against live URL after CI deploy:
 *   lhci autorun --config=lighthouserc.prod.cjs
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'https://uniteia.com/en/signals/apex/magica-overview',
        'https://uniteia.com/pt/signals/apex/magica-overview',
        'https://uniteia.com/ja/signals/apex/magica-overview',
        'https://uniteia.com/zh/signals/apex/magica-overview',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
          downloadThroughputKbps: 16000,
          uploadThroughputKbps: 7500,
          rttMs: 20,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 50 }],
        'total-blocking-time': ['warn', { maxNumericValue: 150 }],
        'color-contrast': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'meta-description': ['error', { minScore: 1 }],
        'hreflang': ['error', { minScore: 1 }],
        'canonical': ['error', { minScore: 1 }],
        'crawlable-links': ['error', { minScore: 1 }],
        'is-crawlable': ['error', { minScore: 1 }],
        'render-blocking-resources': ['warn', { maxLength: 1 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
