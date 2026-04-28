import fs from 'node:fs/promises'
import path from 'node:path'
import yaml from 'yaml'
import { type SupportedLang, getRequiredCombinedSections } from '../i18n/headings'

export type Channel = 'blog' | 'short' | 'wiki' | 'prompt-seed' | 'combined'

export interface LintIn {
  workdir: string
  rulesPath: string
  channel: Channel | 'all'
  lang?: string
  combinedPath?: string
}

export interface LintResult {
  status: 'ok' | 'fail'
  failures: Array<{ channel: string; rule: string; detail?: string }>
}

const EV_REF_RE = /\[\^ex_\d{3,}\]|\bex_\d{3,}\b|\bref:\s*ex_\d{3,}\b/i
const EV_REF_RE_G = /\[\^ex_\d{3,}\]|\bex_\d{3,}\b|\bref:\s*ex_\d{3,}\b/gi
const NUM_RE = /\b\d+(?:[.,]\d+)?%?\b|\b\d{4}\b/i
const NUM_RE_G = /\b\d+(?:[.,]\d+)?%?\b|\b\d{4}\b/gi
const SUPER_RE =
  /\b(best|most|leading|fastest|largest|strongest|top|state-of-the-art|cutting-edge|melhor|maior|menor|mais rápido|mais avançado|líder|principal|estado da arte|revolucionário)\b/i
const SUPER_RE_G =
  /\b(best|most|leading|fastest|largest|strongest|top|state-of-the-art|cutting-edge|melhor|maior|menor|mais rápido|mais avançado|líder|principal|estado da arte|revolucionário)\b/gi
const DATE_RE =
  /\b(202[0-9]|203[0-9]|recent|recently|latest|current|today|now|recente|recentemente|atual|hoje|agora|mais recente)\b/i
const DATE_RE_G =
  /\b(202[0-9]|203[0-9]|recent|recently|latest|current|today|now|recente|recentemente|atual|hoje|agora|mais recente)\b/gi

export async function runLint(input: LintIn): Promise<LintResult> {
  const rules = yaml.parse(await fs.readFile(input.rulesPath, 'utf8'))
  const channels: Channel[] =
    input.channel === 'all' ? ['blog', 'short', 'wiki', 'prompt-seed', 'combined'] : [input.channel]

  const lang = (input.lang as SupportedLang) || 'en'
  const failures: LintResult['failures'] = []

  for (const ch of channels) {
    const channelRules = { ...rules.shared, ...(rules[ch] ?? {}) }
    const text = await readChannel(ch, input)
    if (text === null) {
      failures.push({ channel: ch, rule: 'missing_artifact' })
      continue
    }

    if (ch === 'short') {
      failures.push(...lintShortJson(text, channelRules))
    } else {
      failures.push(...runTextRules(text, channelRules, ch, lang))
    }
  }

  return { status: failures.length === 0 ? 'ok' : 'fail', failures }
}

async function readChannel(ch: Channel, input: LintIn): Promise<string | null> {
  const map: Record<Channel, string> = {
    blog: path.join(input.workdir, 'blog.md'),
    short: path.join(input.workdir, 'short.json'),
    wiki: path.join(input.workdir, 'wiki.md'),
    'prompt-seed': path.join(input.workdir, 'prompt-seed.md'),
    combined: input.combinedPath ?? '',
  }
  const p = map[ch]
  if (!p) return null
  try {
    return await fs.readFile(p, 'utf8')
  } catch {
    return null
  }
}

function lintShortJson(text: string, rules: any): LintResult['failures'] {
  const out: LintResult['failures'] = []
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    return [{ channel: 'short', rule: 'invalid_json' }]
  }

  if (typeof data.hook !== 'string') out.push({ channel: 'short', rule: 'missing_hook' })
  if (!Array.isArray(data.beats)) out.push({ channel: 'short', rule: 'missing_beats' })
  if (typeof data.payoff !== 'string') out.push({ channel: 'short', rule: 'missing_payoff' })

  if (data.hook) {
    const words = data.hook.trim().split(/\s+/).length
    if (words > (rules.hook_max_words || 14)) {
      out.push({
        channel: 'short',
        rule: 'hook_max_words',
        detail: `${words}>${rules.hook_max_words}`,
      })
    }
    const bannedOpeners = rules.banned_openers || []
    for (const b of bannedOpeners) {
      if (data.hook.toLowerCase().startsWith(b.toLowerCase())) {
        out.push({ channel: 'short', rule: 'banned_opener', detail: b })
      }
    }
  }

  if (data.beats) {
    if (data.beats.length < rules.beats.min)
      out.push({
        channel: 'short',
        rule: 'beats:min',
        detail: `${data.beats.length}<${rules.beats.min}`,
      })
    if (data.beats.length > rules.beats.max)
      out.push({
        channel: 'short',
        rule: 'beats:max',
        detail: `${data.beats.length}>${rules.beats.max}`,
      })

    if (rules.beats_with_ref) {
      const refCount = data.beats.filter((b: any) => EV_REF_RE.test(JSON.stringify(b))).length
      if (refCount < rules.beats_with_ref.min) {
        out.push({
          channel: 'short',
          rule: 'beats_with_ref:min',
          detail: `${refCount}<${rules.beats_with_ref.min}`,
        })
      }
    }
  }

  return out
}

function runTextRules(
  text: string,
  rules: any,
  channel: string,
  lang: SupportedLang
): LintResult['failures'] {
  const out: LintResult['failures'] = []
  const lines = text.split('\n')

  // If combined, skip frontmatter for claim/evidence rules
  let scanLines = lines
  if (channel === 'combined' || text.startsWith('---')) {
    let secondDash = -1
    if (lines[0] === '---') {
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '---') {
          secondDash = i
          break
        }
      }
    }
    if (secondDash !== -1) {
      scanLines = lines.slice(secondDash + 1)
    }
  }

  // Word count (use full text)
  if (rules.word_count) {
    const n = text.trim().split(/\s+/).filter(Boolean).length
    if (rules.word_count.min && n < rules.word_count.min)
      out.push({ channel, rule: 'word_count:min', detail: `${n}<${rules.word_count.min}` })
    if (rules.word_count.max && n > rules.word_count.max)
      out.push({ channel, rule: 'word_count:max', detail: `${n}>${rules.word_count.max}` })
  }

  // Banned terms
  for (const t of rules.banned_terms || []) {
    if (new RegExp(`\\b${esc(t)}\\b`, 'i').test(text))
      out.push({ channel, rule: 'banned_term', detail: t })
  }

  // Evidence requirements
  if (rules.require_evidence_for) {
    const reqs = rules.require_evidence_for as string[]
    let inTag = false
    for (let i = 0; i < scanLines.length; i++) {
      const line = scanLines[i].trim()
      if (line.startsWith('<') && !line.includes('>')) {
        inTag = true
        continue
      }
      if (inTag && (line.endsWith('>') || line.endsWith('/>'))) {
        inTag = false
        continue
      }
      if (inTag) continue
      if (line.startsWith('<') && line.endsWith('>')) continue // Single line tag
      if (line.startsWith('|')) continue // Table marker
      if (line.startsWith('- [') || line.startsWith('- **ex_')) continue // Source/Evidence list item

      const types: Array<{ key: string; re: RegExp; label: string }> = [
        { key: 'dated_claims', re: DATE_RE, label: 'date' },
        { key: 'superlatives', re: SUPER_RE, label: 'superlative' },
        { key: 'numbers', re: NUM_RE, label: 'number' },
      ]

      for (const t of types) {
        if (reqs.includes(t.key) && t.re.test(line)) {
          const prev = (scanLines[i - 1] || '').trim()
          const next = (scanLines[i + 1] || '').trim()
          const hasRef = EV_REF_RE.test(line) || EV_REF_RE.test(prev) || EV_REF_RE.test(next)
          if (!hasRef) {
            out.push({
              channel,
              rule: `require_evidence:${t.label}`,
              detail: line.slice(0, 50),
            })
          }
        }
      }
    }
  }

  // Min density
  if (rules.min_density) {
    const refMatches = text.match(EV_REF_RE_G) || []
    const refCount = refMatches.length
    let claimCount = 0
    let inTag = false
    for (const lineRaw of scanLines) {
      const line = lineRaw.trim()
      if (line.startsWith('<') && !line.includes('>')) {
        inTag = true
        continue
      }
      if (inTag && (line.endsWith('>') || line.endsWith('/>'))) {
        inTag = false
        continue
      }
      if (inTag) continue
      if (line.startsWith('<') && line.endsWith('>')) continue
      if (line.startsWith('|')) continue
      if (line.startsWith('- [') || line.startsWith('- **ex_')) continue

      if (NUM_RE.test(line) || SUPER_RE.test(line) || DATE_RE.test(line)) claimCount++
    }
    const density = claimCount === 0 ? 1 : refCount / claimCount
    if (density < rules.min_density) {
      out.push({
        channel,
        rule: 'min_density',
        detail: `${density.toFixed(2)}<${rules.min_density}`,
      })
    }
  }

  // Required sections (i18n)
  if (channel === 'combined') {
    const sections = getRequiredCombinedSections(lang)
    for (const sec of sections) {
      if (!new RegExp(`^##+\\s+${esc(sec)}\\b`, 'im').test(text)) {
        out.push({ channel, rule: 'required_section', detail: sec })
      }
    }
  }

  return out
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
