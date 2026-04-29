#!/usr/bin/env bun
import fs from 'node:fs/promises'
import path from 'node:path'
import { runLint } from './lint/lint'
import { runBuild } from './phases/build'
import { type Lang, runExport } from './phases/export'
import { runGather } from './phases/gather'
import { type Channel, runRender } from './phases/render'
import { providerToLLMFn, resolveProvider } from './providers/index'
import type { LLMProviderName } from './providers/types'
import { validateCoreFile } from './schema/validate-core'

const HELP = `llm-wiki-uniteia-factory CLI

Commands:
  generate "<entity>" --lang <l> --type <t> [--from prompt|url|notes]
                      [--seed-urls a,b,c] [--channels blog,short,wiki,prompt-seed]
                      [--provider stub|nvidia] [--model <id>] [--audit]
  render <slug>       [--channels blog,short,wiki,prompt-seed]
  export <slug>       --lang <en|pt|es|ja|zh>
  lint <slug>         [--channel blog|short|wiki|prompt-seed|combined|all] [--lang <l>]
  validate <slug>
  build <slug>        --entity "<name>" --lang <l> --type <t>
                      --provider stub|nvidia [--model <id>] [--audit]
  init <slug>         --entity "<name>" [--lang <l>] [--type <t>]
  check <slug>        --lang <en|pt|es|ja|zh>
  doctor
  batch <manifest.yaml> [--dry-run] [--continue-on-error] [--provider stub|nvidia]
  package             --lang <en|pt|es|ja|zh|all> [--slugs a,b,c] [--out dir] [--dry-run]
`

const ROOT = process.cwd()
const ENGINE = path.join(ROOT, '_engine')
const CONTENT = path.join(ROOT, 'content')
const PUBLISH = path.join(ROOT, 'llm-wiki-uniteia')
const TEMPLATES = path.join(ENGINE, 'templates')
const RULES = path.join(ENGINE, 'lint', 'rules.yaml')
const SCHEMA_PATH = path.join(ENGINE, 'schema', 'core.schema.json')

function parseArgs(argv: string[]): {
  cmd: string
  positional: string[]
  flags: Record<string, string | boolean>
} {
  const [cmd, ...rest] = argv
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i] as string
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = rest[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(a)
    }
  }
  return { cmd: cmd ?? '', positional, flags }
}

function slugify(entity: string): string {
  return entity
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function die(msg: string): never {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

async function loadFetcher() {
  return async (url: string) => {
    const r = await fetch(url)
    return {
      url,
      status: r.status,
      kind: 'primary' as const,
      text: await r.text(),
      fetched_at: new Date().toISOString(),
    }
  }
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdDoctor() {
  const schemaExists = await fs
    .access(SCHEMA_PATH)
    .then(() => true)
    .catch(() => false)
  const templateFiles = [
    'blog.md.hbs',
    'wiki.md.hbs',
    'short.json.hbs',
    'prompt-seed.md.hbs',
    'llm-wiki-page.md.hbs',
    'build-core.prompt.hbs',
  ]
  const templateStatus: Record<string, boolean> = {}
  for (const t of templateFiles) {
    templateStatus[t] = await fs
      .access(path.join(TEMPLATES, t))
      .then(() => true)
      .catch(() => false)
  }

  console.log('┌─ llm-wiki-uniteia-factory doctor ─────────────────────┐')
  console.log(`│ app_root:      ${ROOT}`)
  console.log(`│ content_dir:   ${CONTENT}`)
  console.log(`│ templates_dir: ${TEMPLATES}`)
  console.log(`│ schema:        ${schemaExists ? '✓ found' : '✗ missing'} (${SCHEMA_PATH})`)
  console.log('│ schema_version: core/1')
  console.log('│')
  console.log('│ providers:')
  console.log('│   stub:   always available')
  console.log(`│   nvidia: NVIDIA_API_KEY=${process.env.NVIDIA_API_KEY ? 'SET' : 'NOT SET'}`)
  console.log(
    `│           NVIDIA_BASE_URL=${process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1 (default)'}`
  )
  console.log(`│           NVIDIA_MODEL=${process.env.NVIDIA_MODEL ?? 'NOT SET (use --model)'}`)
  console.log('│')
  console.log('│ templates:')
  for (const [name, ok] of Object.entries(templateStatus)) {
    console.log(`│   ${ok ? '✓' : '✗'} ${name}`)
  }
  console.log('└───────────────────────────────────────────────────────┘')
}

async function cmdInit(slug: string, flags: Record<string, string | boolean>) {
  const entity = (flags.entity as string) ?? die('init: --entity required')
  const lang = (flags.lang as string) ?? 'en'
  const _type = (flags.type as string) ?? 'concept'
  const workdir = path.join(CONTENT, slug)
  const corePath = path.join(workdir, 'core.yaml')

  const exists = await fs
    .access(corePath)
    .then(() => true)
    .catch(() => false)
  if (exists && !flags.force) {
    die(`init: ${corePath} already exists. Use --force to overwrite.`)
  }

  await fs.mkdir(workdir, { recursive: true })
  const skeleton = `spec: uniteia-invite-link-core/1
id: ${slug}
entity: "${entity}"
type: concept
lang: ${lang}
locale_targets: ["en-US"]
official_url: "https://example.com"
invite_link:
  enabled: false
  url: null
  program: null
  merchant_type: unknown
  tracking_id: null
  rel: "sponsored nofollow"
  label_i18n:
    en: "Official site"
    pt: "Site oficial"
    es: "Sitio oficial"
    ja: "公式サイト"
    zh: "官方网站"
  link_status: "candidate"
  last_checked_at: "${new Date().toISOString()}"
disclosure:
  position: ["top", "near_cta"]
  text_i18n:
    en: "Some links may be invite links. If you buy through them, UniTeia may earn a commission at no extra cost to you."
    pt: "Alguns links podem ser links de convite. Ao comprar por eles, você apoia o UniTeia sem custo extra."
    es: "Algunos enlaces pueden ser de invitación. Si compras a través de ellos, UniTeia puede recibir una comisión sin costo adicional para ti."
    ja: "一部のリンクは招待リンクです。リンク経由で購入すると、追加費用なしでUniTeiaを支援できます。"
    zh: "部分链接可能是邀请链接。通过这些链接购买时，UniTeia 可能获得佣金，且不会增加你的费用。"
seo:
  title_tag:
    max_chars: 60
    localized: true
  meta_description:
    max_chars: 155
    localized: true
  canonical_url: "https://uniteia.com/${lang}/${slug}"
  hreflang_cluster:
    self_reference: true
    x_default: true
    bidirectional: true
  jsonld:
    types: ["Article"]
    visible_match: true
  ai_retrieval:
    llms_txt_ready: true
    answer_blocks: true
    entity_disambiguation: true
    concise_claims: true
    source_ledger: true
  freshness_policy:
    last_reviewed_at: "${new Date().toISOString()}"
    review_interval_days: 90
    price_availability_check_required: false
visual_blocks:
  required: ["hero_verdict_card", "tldr_callout", "pros_cons_table"]
  min_tables: 1
  min_checklists: 1
  min_cta_blocks: 2
summaries:
  summary_one_liner: "TODO: 20-140 char one-liner"
  summary_short: "TODO: 80-400 char short summary"
  decision_summary: "TODO: 80-600 char decision summary"
verdict:
  score: 8.5
  label: recommended
  who_should_buy: ["Profile 1", "Profile 2", "Profile 3"]
  who_should_skip: ["Skip profile 1", "Skip profile 2"]
  main_tradeoff: "Tradeoff explanation"
  pros: ["Pro 1", "Pro 2"]
  cons: ["Con 1", "Con 2"]
  checklist: ["Check 1", "Check 2"]
sources:
  - url: https://example.com/source-1
    kind: primary
    title: "Source 1"
    accessed_at: "${new Date().toISOString()}"
    excerpt_id: ex_001
  - url: https://example.com/source-2
    kind: secondary
    title: "Source 2"
    accessed_at: "${new Date().toISOString()}"
    excerpt_id: ex_002
evidence:
  - id: ex_001
    text: "Example evidence text at least 20 chars."
    url: https://example.com/source-1
    supports: ["claim_id"]
  - id: ex_002
    text: "Second example evidence text."
    url: https://example.com/source-2
    supports: ["claim_id"]
  - id: ex_003
    text: "Third example evidence text."
    url: https://example.com/source-3
    supports: ["claim_id"]
`
  await fs.writeFile(corePath, skeleton)
  console.log(`✓ init ${slug}`)
  console.log(`  workdir: ${workdir}`)
  console.log(`  core.yaml: ${corePath}`)
  console.log(`  next: edit core.yaml, then: bun _engine/cli.ts validate ${slug}`)
}

async function cmdCheck(slug: string, flags: Record<string, string | boolean>) {
  const lang = (flags.lang as Lang) ?? die('check: --lang required')
  const workdir = path.join(CONTENT, slug)
  const steps: Array<{ step: string; ok: boolean; detail?: string }> = []

  // 1. validate
  const v = await validateCoreFile(path.join(workdir, 'core.yaml'))
  steps.push({ step: 'validate', ok: v.ok, ...(v.ok ? {} : { detail: JSON.stringify(v.errors) }) })
  if (!v.ok) {
    console.log(JSON.stringify({ status: 'fail', steps }, null, 2))
    process.exit(1)
  }

  // 2. render
  const rr = await runRender({
    corePath: path.join(workdir, 'core.yaml'),
    channels: ['blog', 'short', 'wiki', 'prompt-seed'] as Channel[],
    outDir: workdir,
    templatesDir: TEMPLATES,
  })
  steps.push({
    step: 'render',
    ok: rr.status === 'ok',
    ...(rr.status === 'fail' ? { detail: JSON.stringify(rr.failed_rules) } : {}),
  })
  if (rr.status === 'fail') {
    console.log(JSON.stringify({ status: 'fail', steps }, null, 2))
    process.exit(1)
  }

  // 3. export (first pass)
  const _e1 = await runExport({ slug, lang, workdir, publishDir: PUBLISH, templatesDir: TEMPLATES })
  steps.push({
    step: 'export',
    ok: _e1.status === 'ok',
    ...( _e1.status === 'fail' ? { detail: JSON.stringify(_e1.failed_rules) } : {}),
  })
  if (_e1.status === 'fail') {
    console.log(JSON.stringify({ status: 'fail', steps }, null, 2))
    process.exit(1)
  }

  // 4. lint combined
  const exportedPath = path.join(PUBLISH, lang, `${slug}.md`)
  const l = await runLint({ workdir, rulesPath: RULES, channel: 'all', combinedPath: exportedPath })
  steps.push({
    step: 'lint',
    ok: l.status === 'ok',
    ...(l.status === 'fail' ? { detail: JSON.stringify(l.failures) } : {}),
  })

  // 5. idempotence: export again, compare
  const hash1 = await fileHash(exportedPath)
  const e2 = await runExport({ slug, lang, workdir, publishDir: PUBLISH, templatesDir: TEMPLATES })
  const hash2 = await fileHash(exportedPath)
  const idempotent = hash1 === hash2
  steps.push({
    step: 'idempotence',
    ok: idempotent,
    ...(!idempotent ? { detail: `hash1=${hash1} hash2=${hash2}` } : {}),
  })

  const allOk = steps.every(s => s.ok)
  console.log(JSON.stringify({ status: allOk ? 'ok' : 'fail', steps }, null, 2))
  process.exit(allOk ? 0 : 1)
}

async function fileHash(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath)
  const hash = new Bun.CryptoHasher('sha256')
  hash.update(data)
  return hash.digest('hex')
}

async function cmdBatch(manifestPath: string, flags: Record<string, string | boolean>) {
  const yaml = await import('yaml')
  const raw = await fs.readFile(manifestPath, 'utf8')
  const manifest = yaml.parse(raw) as {
    spec?: string
    defaults?: { lang?: string; type?: string; channels?: string[]; provider?: string }
    items: Array<{
      id: string
      entity: string
      type?: string
      lang?: string
      from?: string
      seed_urls?: string[]
      channels?: string[]
    }>
  }

  if (!manifest.items || !Array.isArray(manifest.items)) {
    die('batch: manifest must have items[]')
  }

  const dryRun = flags['dry-run'] === true
  const continueOnError =
    flags['continue-on-error'] === true || flags['continue-on-error'] === 'true'
  const providerName =
    (flags.provider as LLMProviderName) ??
    (manifest.defaults?.provider as LLMProviderName) ??
    'stub'
  const defaults = manifest.defaults ?? {}
  const results: Array<{ id: string; status: string; error?: string }> = []

  for (const item of manifest.items) {
    const lang = (item.lang ?? defaults.lang ?? 'en') as Lang
    const type = item.type ?? defaults.type ?? 'concept'
    const channels = (item.channels ??
      defaults.channels ?? ['blog', 'short', 'wiki', 'prompt-seed']) as Channel[]
    const workdir = path.join(CONTENT, item.id)

    if (dryRun) {
      console.log(
        `[dry-run] ${item.id}: init → gather(${item.from ?? 'prompt'}) → build(${providerName}) → render → export(${lang}) → lint → check`
      )
      results.push({ id: item.id, status: 'dry-run' })
      continue
    }

    try {
      // init
      await fs.mkdir(workdir, { recursive: true })

      // gather
      if (item.from === 'url' && item.seed_urls?.length) {
        const fetcherFn = await loadFetcher()
        const g = await runGather(
          {
            entity: item.entity,
            seed_urls: item.seed_urls,
            min_sources: 2,
            required_primary: 1,
            workdir,
            mode: 'url',
          },
          { fetcherFn }
        )
        if (g.status === 'fail') throw new Error(`gather: ${g.failed_rules.join(', ')}`)
      }

      // build
      const provider = resolveProvider({ provider: providerName, model: flags.model as string })
      const llmFn = providerToLLMFn(provider)
      const b = await runBuild(
        {
          workdir,
          id: item.id,
          entity: item.entity,
          type,
          lang,
          promptTemplatePath: path.join(TEMPLATES, 'build-core.prompt.hbs'),
        },
        { llmFn }
      )
      if (b.status === 'fail') throw new Error(`build: ${b.failed_rules.join(', ')}`)

      // render
      const rr = await runRender({
        corePath: path.join(workdir, 'core.yaml'),
        channels,
        outDir: workdir,
        templatesDir: TEMPLATES,
      })
      if (rr.status === 'fail') throw new Error(`render: ${rr.failed_rules.join(', ')}`)

      // export
      const e = await runExport({
        slug: item.id,
        lang,
        workdir,
        publishDir: PUBLISH,
        templatesDir: TEMPLATES,
      })
      if (e.status === 'fail') throw new Error(`export: ${e.failed_rules.join(', ')}`)

      results.push({ id: item.id, status: 'ok' })
    } catch (err) {
      results.push({ id: item.id, status: 'fail', error: (err as Error).message })
      if (!continueOnError) break
    }
  }

  console.log(
    JSON.stringify(
      { status: results.every(r => r.status !== 'fail') ? 'ok' : 'fail', results },
      null,
      2
    )
  )
  process.exit(results.some(r => r.status === 'fail') ? 1 : 0)
}

async function cmdPackage(flags: Record<string, string | boolean>) {
  const lang = (flags.lang as string) ?? die('package: --lang required')
  const slugsRaw = flags.slugs as string | undefined
  const outDir = path.join(ROOT, (flags.out as string) ?? 'deploy-ready')
  const dryRun = flags['dry-run'] === true

  const langs = lang === 'all' ? ['en', 'pt', 'es', 'ja', 'zh'] : [lang]
  const files: Array<{ lang: string; slug: string; src: string; dest: string; sha256?: string }> =
    []

  for (const l of langs) {
    const langDir = path.join(PUBLISH, l)
    let entries: string[]
    try {
      entries = await fs.readdir(langDir)
    } catch {
      continue
    }
    const slugFilter = slugsRaw ? new Set(slugsRaw.split(',')) : null
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue
      const slug = entry.replace(/\.md$/, '')
      if (slugFilter && !slugFilter.has(slug)) continue
      const src = path.join(langDir, entry)
      const dest = path.join(outDir, 'files', 'llm-wiki-uniteia', l, entry)
      files.push({ lang: l, slug, src, dest })
    }
  }

  if (files.length === 0) {
    die('package: no exported files found. Run export first.')
  }

  if (dryRun) {
    console.log(`[dry-run] Would package ${files.length} files to ${outDir}:`)
    for (const f of files) console.log(`  ${f.src} → ${f.dest}`)
    process.exit(0)
  }

  await fs.mkdir(path.join(outDir, 'files'), { recursive: true })
  for (const f of files) {
    await fs.mkdir(path.dirname(f.dest), { recursive: true })
    await fs.copyFile(f.src, f.dest)
    const data = await fs.readFile(f.src)
    const h = new Bun.CryptoHasher('sha256')
    h.update(data)
    f.sha256 = h.digest('hex')
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    file_count: files.length,
    langs: [...new Set(files.map(f => f.lang))],
    slugs: [...new Set(files.map(f => f.slug))],
    files: files.map(f => ({
      lang: f.lang,
      slug: f.slug,
      path: `files/llm-wiki-uniteia/${f.lang}/${f.slug}.md`,
      sha256: f.sha256,
    })),
  }
  await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

  const checklist = `# Deploy Checklist

- [ ] Verify file count: ${files.length}
- [ ] Verify SHA-256 hashes in manifest.json
- [ ] Copy files/ contents to site content directory
- [ ] Run site build and verify pages render
- [ ] Verify hreflang tags on published pages
- [ ] Verify schema.org/Article structured data
`
  await fs.writeFile(path.join(outDir, 'CHECKLIST.md'), checklist)

  const manualDeploy = `# Manual Deploy Instructions

## Files
Copy the contents of \`files/\` to your site's content directory.

## Verification
After deploying, verify:
1. Each page renders at the expected URL
2. Language switcher works between available translations
3. Evidence links are clickable and valid
4. No broken source links

## Rollback
Keep the previous version of deployed files before overwriting.
`
  await fs.writeFile(path.join(outDir, 'MANUAL_DEPLOY.md'), manualDeploy)

  console.log(`✓ packaged ${files.length} files to ${outDir}`)
  console.log(`  manifest: ${path.join(outDir, 'manifest.json')}`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    console.log(HELP)
    process.exit(0)
  }
  const { cmd, positional, flags } = parseArgs(argv)

  if (cmd === 'doctor') {
    await cmdDoctor()
    return
  }

  if (cmd === 'init') {
    const slug = positional[0] ?? die('init: missing slug')
    await cmdInit(slug, flags)
    return
  }

  if (cmd === 'generate') {
    const entity = positional[0] ?? die('generate: missing entity')
    const slug = slugify(entity)
    const workdir = path.join(CONTENT, slug)
    const seedUrls = String(flags['seed-urls'] ?? '')
      .split(',')
      .filter(Boolean)
    const mode = (flags.from as 'prompt' | 'url' | 'notes') ?? (seedUrls.length ? 'url' : 'prompt')
    const lang = (flags.lang as Lang) ?? 'en'
    const type = (flags.type as string) ?? 'concept'
    const channels = String(flags.channels ?? 'blog,short,wiki,prompt-seed').split(',') as Channel[]
    const providerName = (flags.provider as LLMProviderName) ?? 'stub'

    if (mode === 'url') {
      const fetcherFn = await loadFetcher()
      const g = await runGather(
        { entity, seed_urls: seedUrls, min_sources: 2, required_primary: 1, workdir, mode },
        { fetcherFn }
      )
      if (g.status === 'fail') die(`gather failed: ${g.failed_rules.join(', ')}`)
    }

    const provider = resolveProvider({ provider: providerName, model: flags.model as string })
    const llmFn = providerToLLMFn(provider)
    const b = await runBuild(
      {
        workdir,
        id: slug,
        entity,
        type,
        lang,
        promptTemplatePath: path.join(TEMPLATES, 'build-core.prompt.hbs'),
      },
      { llmFn }
    )
    if (b.status === 'fail') die(`build failed: ${b.failed_rules.join(', ')}`)

    const r = await runRender({
      corePath: path.join(workdir, 'core.yaml'),
      channels,
      outDir: workdir,
      templatesDir: TEMPLATES,
    })
    if (r.status === 'fail') die(`render failed: ${r.failed_rules.join(', ')}`)

    console.log(`✓ generated ${slug} (lang=${lang}, provider=${providerName})`)
    console.log(`  workdir: ${workdir}`)
    console.log(`  next: bun _engine/cli.ts lint ${slug} --channel all`)
    return
  }

  if (cmd === 'build') {
    const slug = positional[0] ?? die('build: missing slug')
    const entity = (flags.entity as string) ?? die('build: --entity required')
    const lang = (flags.lang as Lang) ?? die('build: --lang required')
    const type = (flags.type as string) ?? 'concept'
    const providerName =
      (flags.provider as LLMProviderName) ?? die('build: --provider required (stub|nvidia)')
    const workdir = path.join(CONTENT, slug)

    const provider = resolveProvider({ provider: providerName, model: flags.model as string })
    const llmFn = providerToLLMFn(provider)
    const b = await runBuild(
      {
        workdir,
        id: slug,
        entity,
        type,
        lang,
        promptTemplatePath: path.join(TEMPLATES, 'build-core.prompt.hbs'),
      },
      { llmFn }
    )
    console.log(JSON.stringify(b, null, 2))
    process.exit(b.status === 'ok' ? 0 : 1)
  }

  if (cmd === 'render') {
    const slug = positional[0] ?? die('render: missing slug')
    const workdir = path.join(CONTENT, slug)
    const channels = String(flags.channels ?? 'blog,short,wiki,prompt-seed').split(',') as Channel[]
    const r = await runRender({
      corePath: path.join(workdir, 'core.yaml'),
      channels,
      outDir: workdir,
      templatesDir: TEMPLATES,
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === 'ok' ? 0 : 1)
  }

  if (cmd === 'export') {
    const slug = positional[0] ?? die('export: missing slug')
    const lang = (flags.lang as Lang) ?? die('export: --lang required')
    const r = await runExport({
      slug,
      lang,
      workdir: path.join(CONTENT, slug),
      publishDir: PUBLISH,
      templatesDir: TEMPLATES,
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === 'ok' ? 0 : 1)
  }

  if (cmd === 'lint') {
    const slug = positional[0] ?? die('lint: missing slug')
    const channel = (flags.channel as string) ?? 'all'
    const lang = (flags.lang as string) ?? 'en'
    const workdir = path.join(CONTENT, slug)
    const r = await runLint({
      workdir,
      rulesPath: RULES,
      channel: channel as Channel | 'all',
      combinedPath: path.join(PUBLISH, lang, `${slug}.md`),
    })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.status === 'ok' ? 0 : 1)
  }

  if (cmd === 'validate') {
    const slug = positional[0] ?? die('validate: missing slug')
    const r = await validateCoreFile(path.join(CONTENT, slug, 'core.yaml'))
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.ok ? 0 : 1)
  }

  if (cmd === 'check') {
    const slug = positional[0] ?? die('check: missing slug')
    await cmdCheck(slug, flags)
    return
  }

  if (cmd === 'batch') {
    const manifestPath = positional[0] ?? die('batch: missing manifest path')
    await cmdBatch(path.resolve(manifestPath), flags)
    return
  }

  if (cmd === 'package') {
    await cmdPackage(flags)
    return
  }

  console.error(`unknown command: ${cmd}`)
  console.log(HELP)
  process.exit(1)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
