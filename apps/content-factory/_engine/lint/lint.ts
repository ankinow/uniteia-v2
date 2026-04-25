import fs from "node:fs/promises"
import path from "node:path"
import yaml from "yaml"

export type Channel = "blog" | "short" | "wiki" | "prompt-seed" | "combined"

export interface LintIn {
  workdir: string
  rulesPath: string
  channel: Channel | "all"
  combinedPath?: string
}

export interface LintResult {
  status: "ok" | "fail"
  failures: Array<{ channel: string; rule: string; detail?: string }>
}

export async function runLint(input: LintIn): Promise<LintResult> {
  const rules = yaml.parse(await fs.readFile(input.rulesPath, "utf8"))
  const channels: Channel[] =
    input.channel === "all"
      ? ["blog", "short", "wiki", "prompt-seed", "combined"]
      : [input.channel]
  const failures: LintResult["failures"] = []
  for (const ch of channels) {
    const channelRules = mergeRules(rules.shared, rules[ch] ?? {})
    const text = await readChannel(ch, input)
    if (text === null) {
      failures.push({ channel: ch, rule: "missing_artifact" })
      continue
    }
    failures.push(...runRules(text, channelRules, ch))
  }
  return { status: failures.length === 0 ? "ok" : "fail", failures }
}

function mergeRules(
  shared: Record<string, unknown> = {},
  channel: Record<string, unknown> = {},
): Record<string, unknown> {
  return { ...shared, ...channel }
}

async function readChannel(ch: Channel, input: LintIn): Promise<string | null> {
  const map: Record<Channel, string> = {
    blog: path.join(input.workdir, "blog.md"),
    short: path.join(input.workdir, "short.json"),
    wiki: path.join(input.workdir, "wiki.md"),
    "prompt-seed": path.join(input.workdir, "prompt-seed.md"),
    combined: input.combinedPath ?? "",
  }
  const p = map[ch]
  if (!p) return null
  try { return await fs.readFile(p, "utf8") } catch { return null }
}

function runRules(
  text: string,
  rules: Record<string, unknown>,
  channel: string,
): LintResult["failures"] {
  const out: LintResult["failures"] = []

  const wc = rules.word_count as { min?: number; max?: number } | undefined
  if (wc) {
    const n = text.trim().split(/\s+/).filter(Boolean).length
    if (wc.min !== undefined && n < wc.min)
      out.push({ channel, rule: "word_count:min", detail: `${n}<${wc.min}` })
    if (wc.max !== undefined && n > wc.max)
      out.push({ channel, rule: "word_count:max", detail: `${n}>${wc.max}` })
  }

  const banned = (rules.banned_terms ?? []) as string[]
  for (const t of banned) {
    if (new RegExp(`\\b${esc(t)}\\b`, "i").test(text))
      out.push({ channel, rule: "banned_term", detail: t })
  }

  if (rules.forbid_h1 === true && /^#\s/m.test(text))
    out.push({ channel, rule: "forbid_h1" })

  if (rules.forbid_cta === true &&
      /\b(buy now|sign up|click here|subscribe|comprar agora|inscreva-se)\b/i.test(text))
    out.push({ channel, rule: "forbid_cta" })

  const required = (rules.required_sections ?? []) as string[]
  for (const sec of required) {
    if (!new RegExp(`^##+\\s+${esc(sec)}\\b`, "im").test(text))
      out.push({ channel, rule: "required_section", detail: sec })
  }

  const srcMin = ((rules.sources ?? {}) as { min?: number }).min
  if (srcMin !== undefined) {
    const m = text.match(/^- \[/gm) ?? []
    if (m.length < srcMin)
      out.push({ channel, rule: "sources:min", detail: `${m.length}<${srcMin}` })
  }
  const evMin = ((rules.evidence ?? {}) as { min?: number }).min
  if (evMin !== undefined) {
    const m = text.match(/\bex_\d{3,}\b/g) ?? []
    if (m.length < evMin)
      out.push({ channel, rule: "evidence:min", detail: `${m.length}<${evMin}` })
  }

  return out
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
