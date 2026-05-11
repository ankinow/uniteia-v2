import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import matter from 'gray-matter'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../src/i18n/types'
import { buildRobotsTxt, formatSitemapDate } from '../src/utils/sitemap-builder'
import { validateSlug } from '../src/utils/url-validation'

interface Article {
  niche: string
  slug: string
  lang: SupportedLanguage
  updatedAt: string | undefined
}

/**
 * Static Sitemap & Robots Generator
 * Runs post-build to ensure dist/ has correct SEO files.
 * Re-implements filesystem scanning to avoid Vite-only import.meta.glob.
 */
async function generate() {
  const origin = process.env.DOMAIN || 'https://uniteia.com'
  const distDir = join(process.cwd(), 'dist')
  const contentDir = join(process.cwd(), 'content')

  console.log(`📍 Generating SEO files for ${origin}...`)

  try {
    // 1. Find all content files manually
    const articles: Article[] = []
    const niches = await readdir(contentDir, { withFileTypes: true })

    for (const nicheEntry of niches) {
      if (!nicheEntry.isDirectory()) continue
      const niche = nicheEntry.name
      const nichePath = join(contentDir, niche)
      const langs = await readdir(nichePath, { withFileTypes: true })

      for (const langEntry of langs) {
        if (!langEntry.isDirectory()) continue
        const lang = langEntry.name as SupportedLanguage
        const langPath = join(nichePath, lang)

        let files: string[] = []
        try {
          files = await readdir(langPath)
        } catch {
          continue
        }

        for (const file of files) {
          if (!file.endsWith('.md')) continue
          const slug = basename(file, '.md')
          const slugValidation = validateSlug(slug)
          if (!slugValidation.valid) {
            continue
          }

          const fullPath = join(langPath, file)
          const content = await readFile(fullPath, 'utf-8')
          const parsed = matter(content)

          const verdict = parsed.data.verdict as string | undefined
          const qualityScore = parsed.data.quality_score as number | undefined
          if (verdict === 'caution' || verdict === 'draft' || (qualityScore ?? 50) < 50) {
            continue
          }

          const updatedAt = (parsed.data.metadata?.updated_at ||
            parsed.data.metadata?.created_at) as string | undefined

          articles.push({ niche, slug, lang, updatedAt })
        }
      }
    }

    // 2. Build XML
    const articlesBySlug = articles.reduce(
      (acc, article) => {
        const key = `${article.niche}/${article.slug}`
        if (!acc[key]) acc[key] = []
        acc[key]?.push(article)
        return acc
      },
      {} as Record<string, Article[]>
    )

    const entries: string[] = []
    entries.push(
      `  <url>\n    <loc>${origin}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`
    )

    for (const l of SUPPORTED_LANGUAGES) {
      entries.push(
        `  <url>\n    <loc>${origin}/${l.code}/n</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
    }

    for (const article of articles) {
      const loc = `${origin}/${article.lang}/${article.slug}`
      const lastmodDate = formatSitemapDate(article.updatedAt)
      const lastmod = lastmodDate ? `    <lastmod>${lastmodDate}</lastmod>\n` : ''

      const alts = articlesBySlug[`${article.niche}/${article.slug}`] || []
      const hreflangLines = alts.map(
        a =>
          `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${origin}/${a.lang}/${a.slug}" />`
      )

      const hasEn = alts.some(a => a.lang === 'en')
      if (hasEn) {
        hreflangLines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en/${article.slug}" />`
        )
      }

      entries.push(
        `  <url>\n    <loc>${loc}</loc>\n${lastmod}    <changefreq>weekly</changefreq>\n    <priority>${article.slug === '_index' ? '0.9' : '0.7'}</priority>\n${hreflangLines.join('\n')}\n  </url>`
      )
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>`

    await writeFile(join(distDir, 'sitemap.xml'), sitemap)
    console.log('✅ dist/sitemap.xml generated')

    const robots = buildRobotsTxt(origin)
    await writeFile(join(distDir, 'robots.txt'), robots)
    console.log('✅ dist/robots.txt generated')
  } catch (err) {
    console.error('❌ Failed to generate SEO files:', err)
    process.exit(1)
  }
}

generate()
