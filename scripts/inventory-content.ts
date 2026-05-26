#!/usr/bin/env bun
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = '/home/lermf/uniteia-v2/content/apex'
const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']

interface FileInfo {
  locale: string
  slug: string
  bodyLen: number
  isEmpty: boolean
  isEnStub: boolean
  lang: string
}

function extractBody(content: string): string {
  const match = content.match(/^---[\s\S]*?^---\n*/m)
  if (!match) return content.trim()
  return content.slice(match[0].length).trim()
}

function detectLang(text: string): string {
  if (text.length === 0) return 'EMPTY'
  const cjk = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []).length
  if (cjk > text.length * 0.15) return 'CJK'
  const en = (text.match(/\b(the|this|and|for|with|is|are|was)\b/gi) || []).length
  const pt = (text.match(/\b(para|com|por|como|uma|mais|tem|dos)\b/gi) || []).length
  if (pt > 3) return 'pt'
  if (en > 5) return 'en'
  return '?'
}

console.log('\nΣ CONTENT INVENTORY\n')

const files: FileInfo[] = []
for (const locale of LOCALES) {
  const dir = join(BASE, locale)
  const entries = readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
  for (const entry of entries) {
    const content = readFileSync(join(dir, entry), 'utf-8')
    const body = extractBody(content)
    const slug = entry.replace('.md', '')
    const lang = detectLang(body)
    const isEmpty = body.length < 50
    const isEnStub = lang === 'en' && locale !== 'en' && body.length >= 50
    files.push({ locale, slug, bodyLen: body.length, isEmpty, isEnStub, lang })
  }
}

const slugs = [...new Set(files.map(f => f.slug))].sort()

console.log('Slug'.padEnd(45) + LOCALES.map(l => l.padStart(6)).join(' '))
console.log('-'.repeat(45 + LOCALES.length * 7))
for (const slug of slugs) {
  const cells = [slug.slice(0, 42).padEnd(42)]
  for (const locale of LOCALES) {
    const f = files.find(x => x.locale === locale && x.slug === slug)
    if (!f) {
      cells.push('    --')
      continue
    }
    let s = String(f.bodyLen).padStart(5)
    if (f.isEmpty) s += '⚠'
    else if (f.isEnStub) s += '§'
    cells.push(s.padStart(7))
  }
  console.log(cells.join(' '))
}

const emptyFiles = files.filter(f => f.isEmpty)
const enStubs = files.filter(f => f.isEnStub)
const goodFiles = files.filter(f => !f.isEmpty && !f.isEnStub)

console.log(
  `\nTotal: ${files.length}  Good: ${goodFiles.length}  Empty: ${emptyFiles.length}  EN-stubs: ${enStubs.length}`
)
if (emptyFiles.length > 0) {
  console.log('\n⚠ Empty:')
  for (const f of emptyFiles) console.log(`  ${f.locale}/${f.slug}`)
}
if (enStubs.length > 0) {
  console.log('\n§ EN stubs:')
  for (const f of enStubs) console.log(`  ${f.locale}/${f.slug} (${f.bodyLen}ch)`)
}
