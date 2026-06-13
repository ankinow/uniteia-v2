/**
 * i18n Visual Test — Phase 3 (M014)
 *
 * Renders DepthCardThumbnail + ArticleHero in all 8 locales
 * to test RTL, CJK fonts, and culture gradients from visual-i18n.css.
 *
 * DRAFT-ONLY: Not indexed, not canonical, not production content.
 */

import { component$, useStylesScoped$ } from '@builder.io/qwik'
import { ArticleHero } from '~/components/article-hero'
import { type DepthCardGradient, DepthCardThumbnail } from '~/components/depth-card-thumbnail'

// ─── Locale definitions ─────────────────────────────────────────────────────

interface LocaleCard {
  code: string
  name: string
  nativeName: string
  gradient: DepthCardGradient
  icon: 'bot' | 'code' | 'cpu' | 'zap' | 'pen-tool' | 'layers' | 'cloud' | 'search'
  category: string
  accentLabel: string
}

const LOCALES: LocaleCard[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    gradient: 'cyan-to-void',
    icon: 'bot',
    category: 'Intelligence',
    accentLabel: 'cyan (#00d4aa)',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    gradient: 'vine-to-void',
    icon: 'code',
    category: 'Código',
    accentLabel: 'cyan (#00d4aa)',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    gradient: 'coral-to-void',
    icon: 'zap',
    category: 'Innovación',
    accentLabel: 'cyan (#00d4aa)',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    gradient: 'cyan-to-void',
    icon: 'pen-tool',
    category: 'Rédaction',
    accentLabel: 'cyan (#00d4aa)',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    gradient: 'bronze-to-void',
    icon: 'cpu',
    category: 'Technik',
    accentLabel: 'cyan (#00d4aa)',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    gradient: 'bronze-to-void',
    icon: 'layers',
    category: 'Architettura',
    accentLabel: 'bronze (#cd7f32)',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    gradient: 'vine-to-void',
    icon: 'cloud',
    category: 'テクノロジー',
    accentLabel: 'jade (#00c896) — CJK',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    gradient: 'coral-to-void',
    icon: 'search',
    category: '搜索技术',
    accentLabel: 'jade (#00c896) — CJK',
  },
]

// ─── Scoped styles — injects visual-i18n + CJK fonts + RTL test overrides ───

const scopedI18nStyles = `
  /* ── CJK font imports (Google Fonts) ── */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

  /* ── Culture-specific gradient accents (mirrors visual-i18n.css) ── */
  /* Western Romance + Germanic: cyan accent */
  [lang="en"] .test-card-accent,
  [lang="pt"] .test-card-accent,
  [lang="es"] .test-card-accent,
  [lang="fr"] .test-card-accent,
  [lang="de"] .test-card-accent {
    --gradient-accent: #00d4aa;
  }

  /* East Asian: jade accent */
  [lang="ja"] .test-card-accent,
  [lang="zh"] .test-card-accent {
    --gradient-accent: #00c896;
  }

  /* Italian: bronze accent */
  [lang="it"] .test-card-accent {
    --gradient-accent: #cd7f32;
  }

  /* ── RTL logical properties mirroring ── */
  [dir="rtl"] .test-card-accent {
    direction: rtl;
  }

  /* ── Icon flip for RTL arrows ── */
  [dir="rtl"] .icon-arrow-right,
  [dir="rtl"] .icon-chevron-right,
  [dir="rtl"] .icon-arrow-left {
    transform: scaleX(-1);
  }

  @media (prefers-reduced-motion: reduce) {
    [dir="rtl"] .icon-arrow-right,
    [dir="rtl"] .icon-chevron-right,
    [dir="rtl"] .icon-arrow-left {
      transform: none;
    }
  }

  /* ── CJK font stack ── */
  [lang="ja"], [lang="zh"] {
    --font-cjk: 'Noto Sans JP', 'Noto Sans SC', 'Zen Maru Gothic', sans-serif;
  }

  [lang="ja"] .cjk-text,
  [lang="zh"] .cjk-text {
    font-family: var(--font-cjk);
  }

  /* ── Test grid layout ── */
  .i18n-visual-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  .i18n-test-card {
    background: var(--color-deep, #0D0F1A);
    border: 1px solid var(--color-raised, rgba(255,255,255,0.06));
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: border-color 200ms ease;
  }

  .i18n-test-card:hover {
    border-color: var(--gradient-accent, var(--color-accent, #00d4aa));
  }

  /* ── RTL preview card (Arabic) ── */
  [dir="rtl"] .i18n-test-card {
    text-align: right;
  }

  /* ── Gradient accent bar ── */
  .accent-bar {
    height: 3px;
    border-radius: 2px;
    background: var(--gradient-accent, #00d4aa);
    transition: background 300ms ease;
  }

  /* ── Font demo for CJK ── */
  .font-demo-cjk {
    font-family: var(--font-cjk, 'Zen Maru Gothic', sans-serif);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-bone);
  }

  .font-demo-latin {
    font-family: var(--font-family-sans, 'Inter Variable', sans-serif);
    font-size: 1rem;
    color: var(--color-bone-muted);
  }

  /* ── ArticleHero thumbnail wrapper ── */
  .hero-thumb-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  /* ── RTL arrow demo ── */
  .rtl-arrow-demo {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--gradient-accent, #00d4aa);
  }
`

export default component$(() => {
  useStylesScoped$(scopedI18nStyles)

  return (
    <main class="min-h-screen bg-[var(--color-void,#0B0C15)] p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <header class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-[var(--color-bone,#E8E6DD)]">
              i18n Visual Test
            </h1>
            <span class="px-2 py-0.5 text-xs font-mono bg-[var(--color-bronze,#cd7f32)]/20 text-[var(--color-bronze,#cd7f32)] border border-[var(--color-bronze,#cd7f32)]/30 rounded">
              DRAFT-ONLY
            </span>
          </div>
          <p class="text-[var(--color-bone-muted,#a09b8c)] max-w-3xl">
            Verifies DepthCardThumbnail + ArticleHero rendering across all 8 locales. Tests CJK
            fonts (ja/zh), RTL logical properties, culture-specific gradients, and icon flipping for
            RTL arrows.
          </p>
        </header>

        {/* Verification checklist */}
        <section class="mb-8 p-4 bg-[var(--color-deep,#0D0F1A)] rounded-lg border border-[var(--color-raised,rgba(255,255,255,0.06))]">
          <h2 class="text-lg font-bold text-[var(--color-bone,#E8E6DD)] mb-3">
            Verification Points
          </h2>
          <ul class="space-y-1.5">
            <li class="flex items-center gap-2 text-sm">
              <span class="text-[var(--color-vine,#00c896)]">□</span>
              <span class="text-[var(--color-bone-muted,#a09b8c)]">
                <strong class="text-[var(--color-bone,#E8E6DD)]">CJK Fonts:</strong> ja/zh cards
                should render with Noto Sans JP/SC (compare Latin text vs CJK text)
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <span class="text-[var(--color-vine,#00c896)]">□</span>
              <span class="text-[var(--color-bone-muted,#a09b8c)]">
                <strong class="text-[var(--color-bone,#E8E6DD)]">RTL Logical Properties:</strong>{' '}
                RTL preview card should mirror layout (text-align: right, direction: rtl)
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <span class="text-[var(--color-vine,#00c896)]">□</span>
              <span class="text-[var(--color-bone-muted,#a09b8c)]">
                <strong class="text-[var(--color-bone,#E8E6DD)]">Culture Gradients:</strong> Each
                card's accent bar matches locale: cyan (Western), jade (CJK), bronze (Italian)
              </span>
            </li>
            <li class="flex items-center gap-2 text-sm">
              <span class="text-[var(--color-vine,#00c896)]">□</span>
              <span class="text-[var(--color-bone-muted,#a09b8c)]">
                <strong class="text-[var(--color-bone,#E8E6DD)]">Icon Flip:</strong> Arrow icons in
                RTL preview should be mirrored (scaleX(-1))
              </span>
            </li>
          </ul>
        </section>

        {/* DepthCardThumbnail Grid — 8 locales */}
        <section class="mb-10">
          <h2 class="text-xl font-bold text-[var(--color-bone,#E8E6DD)] mb-4 flex items-center gap-2">
            <span
              class="icon-[lucide--layout-grid] text-[var(--color-cyan,#00d4aa)]"
              style={{ width: '20px', height: '20px' }}
              aria-hidden="true"
            />
            DepthCardThumbnail — All Locales
          </h2>
          <div class="i18n-visual-grid">
            {LOCALES.map(locale => (
              <div key={`dct-${locale.code}`} lang={locale.code} class="test-card-accent">
                <div class="i18n-test-card">
                  {/* Accent bar */}
                  <div class="accent-bar mb-3" />

                  {/* Locale header */}
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <span class="text-sm font-bold text-[var(--color-bone,#E8E6DD)]">
                        {locale.nativeName}
                      </span>
                      <span class="ml-2 text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                        ({locale.code})
                      </span>
                    </div>
                    <span class="text-[10px] font-mono text-[var(--gradient-accent,#00d4aa)] bg-[var(--color-raised,rgba(255,255,255,0.04))] px-1.5 py-0.5 rounded">
                      {locale.accentLabel}
                    </span>
                  </div>

                  {/* DepthCardThumbnail */}
                  <div class="mb-3">
                    <DepthCardThumbnail
                      icon={locale.icon}
                      gradient={locale.gradient}
                      stepNumber={LOCALES.indexOf(locale) + 1}
                      category={locale.category}
                    />
                  </div>

                  {/* CJK font demo */}
                  {locale.code === 'ja' || locale.code === 'zh' ? (
                    <div class="mt-3 pt-3 border-t border-[var(--color-raised,rgba(255,255,255,0.06))]">
                      <p class="text-[10px] uppercase tracking-widest text-[var(--color-bone-muted,#a09b8c)] mb-1">
                        CJK Font Test
                      </p>
                      <p class="font-demo-cjk cjk-text">
                        {locale.code === 'ja' ? '技術と革新の融合' : '技术与创新的融合'}
                      </p>
                      <p class="font-demo-latin mt-0.5">Technology & Innovation — Latin baseline</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ArticleHero Grid — 8 locales (compact thumbnails) */}
        <section class="mb-10">
          <h2 class="text-xl font-bold text-[var(--color-bone,#E8E6DD)] mb-4 flex items-center gap-2">
            <span
              class="icon-[lucide--image] text-[var(--color-cyan,#00d4aa)]"
              style={{ width: '20px', height: '20px' }}
              aria-hidden="true"
            />
            ArticleHero — All Locales
          </h2>
          <div class="i18n-visual-grid">
            {LOCALES.map(locale => (
              <div key={`ah-${locale.code}`} lang={locale.code} class="test-card-accent">
                <div class="i18n-test-card">
                  {/* Accent bar */}
                  <div class="accent-bar mb-3" />

                  {/* Locale header */}
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <span class="text-sm font-bold text-[var(--color-bone,#E8E6DD)]">
                        {locale.nativeName}
                      </span>
                      <span class="ml-2 text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                        ({locale.code})
                      </span>
                    </div>
                  </div>

                  {/* ArticleHero thumbnail */}
                  <div class="hero-thumb-wrapper mb-3">
                    <ArticleHero
                      src="test-hero-placeholder.jpg"
                      alt={
                        locale.code === 'ja'
                          ? 'テストイメージ'
                          : locale.code === 'zh'
                            ? '测试图像'
                            : `Test hero image — ${locale.name}`
                      }
                      width={800}
                      height={450}
                      priority={false}
                      lazyLoad={false}
                    />
                  </div>

                  {/* Alt text display */}
                  <p class="text-xs text-[var(--color-bone-muted,#a09b8c)] truncate mt-2 cjk-text">
                    alt:{' '}
                    {locale.code === 'ja'
                      ? 'テストイメージ'
                      : locale.code === 'zh'
                        ? '测试图像'
                        : `Test hero image — ${locale.name}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RTL Preview (Arabic — not a supported locale, for testing only) */}
        <section class="mb-10">
          <h2 class="text-xl font-bold text-[var(--color-bone,#E8E6DD)] mb-4 flex items-center gap-2">
            <span
              class="icon-[lucide--arrow-right-left] text-[var(--color-bronze,#cd7f32)]"
              style={{ width: '20px', height: '20px' }}
              aria-hidden="true"
            />
            RTL Preview (Arabic — test only)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RTL DepthCardThumbnail */}
            <div dir="rtl" lang="ar" class="test-card-accent">
              <div class="i18n-test-card">
                <div class="accent-bar mb-3" style={{ background: '#cd7f32' }} />
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <span class="text-sm font-bold text-[var(--color-bone,#E8E6DD)]">العربية</span>
                    <span class="ml-2 text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                      (ar — RTL test)
                    </span>
                  </div>
                  <span class="text-[10px] font-mono text-[var(--color-bronze,#cd7f32)] bg-[var(--color-raised,rgba(255,255,255,0.04))] px-1.5 py-0.5 rounded">
                    bronze (#cd7f32)
                  </span>
                </div>

                <div class="mb-3">
                  <DepthCardThumbnail
                    icon="bot"
                    gradient="bronze-to-void"
                    stepNumber={99}
                    category="اختبار"
                  />
                </div>

                {/* RTL text demo */}
                <div class="mt-3 pt-3 border-t border-[var(--color-raised,rgba(255,255,255,0.06))]">
                  <p class="text-[10px] uppercase tracking-widest text-[var(--color-bone-muted,#a09b8c)] mb-1">
                    RTL Text Direction
                  </p>
                  <p
                    class="font-demo-cjk"
                    style={{ fontFamily: 'var(--font-family-sans)', direction: 'rtl' }}
                  >
                    مرحباً بك في اختبار RTL — النص العربي هنا
                  </p>
                  <p class="font-demo-latin mt-0.5" style={{ direction: 'ltr' }}>
                    Latin baseline — LTR for comparison
                  </p>
                </div>

                {/* Icon flip demo */}
                <div class="mt-3 pt-3 border-t border-[var(--color-raised,rgba(255,255,255,0.06))]">
                  <p class="text-[10px] uppercase tracking-widest text-[var(--color-bone-muted,#a09b8c)] mb-2">
                    RTL Arrow Flip Test
                  </p>
                  <div class="flex items-center gap-4">
                    <span class="rtl-arrow-demo icon-arrow-right">
                      <span
                        class="icon-[lucide--arrow-right]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Arrow Right (should flip)
                    </span>
                    <span class="rtl-arrow-demo icon-chevron-right">
                      <span
                        class="icon-[lucide--chevron-right]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Chevron (should flip)
                    </span>
                    <span class="rtl-arrow-demo icon-arrow-left">
                      <span
                        class="icon-[lucide--arrow-left]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Arrow Left (should flip)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LTR comparison (English) */}
            <div lang="en" class="test-card-accent">
              <div class="i18n-test-card">
                <div class="accent-bar mb-3" />
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <span class="text-sm font-bold text-[var(--color-bone,#E8E6DD)]">
                      English — LTR Reference
                    </span>
                    <span class="ml-2 text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                      (en)
                    </span>
                  </div>
                  <span class="text-[10px] font-mono text-[var(--color-cyan,#00d4aa)] bg-[var(--color-raised,rgba(255,255,255,0.04))] px-1.5 py-0.5 rounded">
                    cyan (#00d4aa)
                  </span>
                </div>

                <div class="mb-3">
                  <DepthCardThumbnail
                    icon="bot"
                    gradient="cyan-to-void"
                    stepNumber={99}
                    category="Testing"
                  />
                </div>

                <div class="mt-3 pt-3 border-t border-[var(--color-raised,rgba(255,255,255,0.06))]">
                  <p class="text-[10px] uppercase tracking-widest text-[var(--color-bone-muted,#a09b8c)] mb-1">
                    LTR Reference Arrows
                  </p>
                  <div class="flex items-center gap-4">
                    <span class="rtl-arrow-demo icon-arrow-right">
                      <span
                        class="icon-[lucide--arrow-right]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Arrow Right (normal)
                    </span>
                    <span class="rtl-arrow-demo icon-chevron-right">
                      <span
                        class="icon-[lucide--chevron-right]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Chevron (normal)
                    </span>
                    <span class="rtl-arrow-demo icon-arrow-left">
                      <span
                        class="icon-[lucide--arrow-left]"
                        style={{ width: '16px', height: '16px' }}
                        aria-hidden="true"
                      />
                      Arrow Left (normal)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture Gradient Reference */}
        <section class="mb-10">
          <h2 class="text-xl font-bold text-[var(--color-bone,#E8E6DD)] mb-4 flex items-center gap-2">
            <span
              class="icon-[lucide--palette] text-[var(--color-vine,#00c896)]"
              style={{ width: '20px', height: '20px' }}
              aria-hidden="true"
            />
            Culture Gradient Reference
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div class="p-4 bg-[var(--color-deep,#0D0F1A)] rounded-lg border border-[var(--color-raised,rgba(255,255,255,0.06))]">
              <div class="w-full h-8 rounded mb-2" style="background: #00d4aa;" />
              <p class="text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                Cyan <code class="text-[var(--color-cyan,#00d4aa)]">#00d4aa</code>
              </p>
              <p class="text-xs text-[var(--color-bone-muted,#a09b8c)]">
                Western (en, pt, es, fr, de)
              </p>
            </div>
            <div class="p-4 bg-[var(--color-deep,#0D0F1A)] rounded-lg border border-[var(--color-raised,rgba(255,255,255,0.06))]">
              <div class="w-full h-8 rounded mb-2" style="background: #00c896;" />
              <p class="text-xs font-mono text-[var(--color-bone-muted,#a09b8c)]">
                Jade <code class="text-[var(--color-vine,#00c896)]">#00c896</code>
              </p>
              <p class="text-xs text-[var(--color-bone-muted,#a09b8c)]">CJK (ja, zh)</p>
            </div>
            <div class="p-4 bg-[var(--color-deep,#0D0F1A)] rounded-lg border border-[var(--color-raised,rgba(255,255,255,0.06))]">
              <div class="w-full h-8 rounded mb-2" style="background: #cd7f32;" />
              <p class="text-xs font-mono text-[var(--color-bronze,#cd7f32)]">
                Bronze <code class="text-[var(--color-bronze,#cd7f32)]">#cd7f32</code>
              </p>
              <p class="text-xs text-[var(--color-bone-muted,#a09b8c)]">Italian (it)</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="mt-12 pt-6 border-t border-[var(--color-raised,rgba(255,255,255,0.06))]">
          <p class="text-xs text-[var(--color-bone-muted,#a09b8c)]">
            UniTeia v2 — M014 Phase 3: i18n Visual Test Page — DRAFT-ONLY — Not indexed
          </p>
        </footer>
      </div>
    </main>
  )
})
