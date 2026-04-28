#!/usr/bin/env bun
/**
 * Sitemap Generator
 * Generates sitemap.xml with hreflang alternates at build time
 */

import { readFile, readdir } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import matter from 'gray-matter'

const DOMAIN = 'https://uniteia.com'
const CONTENT_DIR = 'content'
const OUTPUT_PATH = 'public/sitemap.xml'

interface SitemapUrl {
  loc: string
  lastmod?: string
  alternates?: { lang: string; href: string }[]
}

interface ContentFile {
  path: string
  niche: string
  lang: string
  slug: string
  frontmatter: {
    title?: string
    updated?: string
    published?: string
  }
}

async function findContentFiles(dir: string): Promise<ContentFile[]> {
  const files: ContentFile[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true })

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fullPath = join(entry.parentPath || dir, entry.name)
        const relativePath = fullPath.replace(`${process.cwd()}/`, '')

        // Parse path: content/{niche}/{lang}/{slug}.md
        const pathParts = relativePath.split('/')
        if (pathParts.length >= 4) {
          const niche = pathParts[1]
          const lang = pathParts[2]
          const slug = basename(entry.name, '.md')

          try {
            const content = await readFile(fullPath, 'utf-8')
            const parsed = matter(content)

            files.push({
              path: relativePath,
              niche,
              lang,
              slug,
              frontmatter: {
                title: parsed.data.title,
                updated: parsed.data.updated,
                published: parsed.data.published,
              },
            })
          } catch {
            // Skip files with invalid frontmatter
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read content directory: ${error}`)
  }

  return files
}

function groupBySlug(files: ContentFile[]): Map<string, ContentFile[]> {
  const groups = new Map<string, ContentFile[]>()

  for (const file of files) {
    const key = `${file.niche}/${file.slug}`
    const existing = groups.get(key) || []
    existing.push(file)
    groups.set(key, existing)
  }

  return groups
}

function formatDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined
  try {
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]
  } catch {
    return undefined
  }
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemap(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => {
    const lastmod = url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''

    const alternates = url.alternates
      ? `${url.alternates
          .map(
            alt =>
              `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXML(alt.href)}" />`
          )
          .join('\n')}\n`
      : ''

    return `  <url>\n    <loc>${escapeXML(url.loc)}</loc>\n${lastmod}${alternates}  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join('\n')}\n</urlset>`
}

async function generateSitemap(): Promise<void> {
  console.log('📍 Generating sitemap...\n')

  const files = await findContentFiles(CONTENT_DIR)
  console.log(`Found ${files.length} content files`)

  const grouped = groupBySlug(files)
  console.log(`Grouped into ${grouped.size} unique articles\n`)

  const urls: SitemapUrl[] = []

  // Generate URLs for each article
  for (const [key, translations] of grouped) {
    if (translations.length === 0) continue
    const primary = translations[0]
    const [niche, slug] = key.split('/')

    // Use the last updated date from any translation
    const lastUpdated = translations
      .map(t => t.frontmatter.updated || t.frontmatter.published)
      .filter(Boolean)
      .sort()
      .pop()

    const _alternates = translations.map(t => ({
      lang: t.lang,
      href: `${DOMAIN}/${niche}.${DOMAIN.replace('https://', '')}/${t.lang}/${t.slug}`.replace(
        DOMAIN,
        DOMAIN
      ),
    }))

    // Actually fix the URL format
    const fixedAlternates = translations.map(t => ({
      lang: t.lang,
      href: `https://${niche}.uniteia.com/${t.lang}/${t.slug}`,
    }))

    // Add x-default
    const enTranslation = translations.find(t => t.lang === 'en')
    const defaultLang = enTranslation || translations[0]
    fixedAlternates.push({
      lang: 'x-default',
      href: `https://${niche}.uniteia.com/${defaultLang.lang}/${defaultLang.slug}`,
    })

    urls.push({
      loc: `https://${niche}.uniteia.com/${primary.lang}/${slug}`,
      lastmod: formatDate(lastUpdated),
      alternates: fixedAlternates,
    })
  }

  // Sort URLs by location
  urls.sort((a, b) => a.loc.localeCompare(b.loc))

  const sitemap = buildSitemap(urls)

  await writeFile(OUTPUT_PATH, sitemap)

  console.log(`✅ Generated sitemap with ${urls.length} URLs`)
  console.log(`📝 Written to ${OUTPUT_PATH}\n`)

  // Summary
  console.log('Sitemap entries:')
  for (const url of urls.slice(0, 5)) {
    console.log(`  - ${url.loc}`)
    if (url.alternates) {
      console.log(`    alternates: ${url.alternates.length} versions`)
    }
  }
  if (urls.length > 5) {
    console.log(`  ... and ${urls.length - 5} more`)
  }
}

await generateSitemap()
