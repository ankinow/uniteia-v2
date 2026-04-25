#!/usr/bin/env bun
import path from "node:path"
import { runGather } from "./phases/gather"
import { runBuild } from "./phases/build"
import { runRender, type Channel } from "./phases/render"
import { runExport, type Lang } from "./phases/export"
import { runLint } from "./lint/lint"
import { validateCoreFile } from "./schema/validate-core"

const HELP = `llm-wiki-uniteia-factory CLI

Commands:
  generate "<entity>" --lang <l> --type <t> [--from prompt|url|notes]
                      [--seed-urls a,b,c] [--channels blog,short,wiki,prompt-seed]
                      [--audit]
  render <slug> [--channels blog,short,wiki,prompt-seed]
  export <slug> --lang <en|pt|es|ja|zh>
  lint <slug> [--channel blog|short|wiki|prompt-seed|combined|all]
  validate <slug>
`

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, "_engine")
const CONTENT = path.join(ROOT, "content")
const PUBLISH = path.join(ROOT, "llm-wiki-uniteia")
const TEMPLATES = path.join(ENGINE, "templates")
const RULES = path.join(ENGINE, "lint", "rules.yaml")

function parseArgs(argv: string[]): {
  cmd: string; positional: string[]; flags: Record<string, string | boolean>
} {
  const [cmd, ...rest] = argv
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!
    if (a.startsWith("--")) {
      const key = a.slice(2)
      const next = rest[i + 1]
      if (next && !next.startsWith("--")) { flags[key] = next; i++ }
      else { flags[key] = true }
    } else { positional.push(a) }
  }
  return { cmd: cmd ?? "", positional, flags }
}

function slugify(entity: string): string {
  return entity.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

function die(msg: string): never { console.error(`✗ ${msg}`); process.exit(1) }

async function loadFetcher() {
  return async (url: string) => {
    const r = await fetch(url)
    return {
      url, status: r.status, kind: "primary" as const,
      text: await r.text(), fetched_at: new Date().toISOString(),
    }
  }
}

async function loadLLM() {
  return async (_prompt: string) => {
    throw new Error("llmFn not configured. Wire your provider in _engine/cli.ts loadLLM().")
  }
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    console.log(HELP); process.exit(0)
  }
  const { cmd, positional, flags } = parseArgs(argv)

  if (cmd === "generate") {
    const entity = positional[0] ?? die("generate: missing entity")
    const slug = slugify(entity)
    const workdir = path.join(CONTENT, slug)
    const seedUrls = String(flags["seed-urls"] ?? "").split(",").filter(Boolean)
    const mode = (flags.from as "prompt" | "url" | "notes")
      ?? (seedUrls.length ? "url" : "prompt")
    const lang = (flags.lang as Lang) ?? "en"
    const type = (flags.type as string) ?? "concept"
    const channels = String(flags.channels ?? "blog,short,wiki,prompt-seed")
      .split(",") as Channel[]

    if (mode === "url") {
      const fetcherFn = await loadFetcher()
      const g = await runGather(
        { entity, seed_urls: seedUrls, min_sources: 2, required_primary: 1, workdir, mode },
        { fetcherFn },
      )
      if (g.status === "fail") die(`gather failed: ${g.failed_rules.join(", ")}`)
    }

    const llmFn = await loadLLM()
    const b = await runBuild(
      {
        workdir, id: slug, entity, type, lang,
        promptTemplatePath: path.join(TEMPLATES, "build-core.prompt.hbs"),
      },
      { llmFn },
    )
    if (b.status === "fail") die(`build failed: ${b.failed_rules.join(", ")}`)

    const r = await runRender({
      corePath: path.join(workdir, "core.yaml"),
      channels, outDir: workdir, templatesDir: TEMPLATES,
    })
    if (r.status === "fail") die(`render failed: ${r.failed_rules.join(", ")}`)

    console.log(`✓ generated ${slug} (lang=${lang})`)
    console.log(`  workdir: ${workdir}`)
    console.log(`  next: bun _engine/cli.ts lint ${slug} --channel all`)
    return
  }

  if (cmd === "render") {
    const slug = positional[0] ?? die("render: missing slug")
    const workdir = path.join(CONTENT, slug)
    const channels = String(flags.channels ?? "blog,short,wiki,prompt-seed")
      .split(",") as Channel[]
    const r = await runRender({
      corePath: path.join(workdir, "core.yaml"),
      channels, outDir: workdir, templatesDir: TEMPLATES,
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === "ok" ? 0 : 1)
  }

  if (cmd === "export") {
    const slug = positional[0] ?? die("export: missing slug")
    const lang = (flags.lang as Lang) ?? die("export: --lang required")
    const r = await runExport({
      slug, lang,
      workdir: path.join(CONTENT, slug),
      publishDir: PUBLISH, templatesDir: TEMPLATES,
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === "ok" ? 0 : 1)
  }

  if (cmd === "lint") {
    const slug = positional[0] ?? die("lint: missing slug")
    const channel = (flags.channel as string) ?? "all"
    const workdir = path.join(CONTENT, slug)
    const r = await runLint({
      workdir, rulesPath: RULES,
      channel: channel as any,
      combinedPath: path.join(PUBLISH, "en", `${slug}.md`),
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === "ok" ? 0 : 1)
  }

  if (cmd === "validate") {
    const slug = positional[0] ?? die("validate: missing slug")
    const r = await validateCoreFile(path.join(CONTENT, slug, "core.yaml"))
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.ok ? 0 : 1)
  }

  console.error(`unknown command: ${cmd}`)
  console.log(HELP)
  process.exit(1)
}

main().catch((e) => { console.error(e); process.exit(1) })
