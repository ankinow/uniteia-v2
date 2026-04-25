import fs from 'node:fs/promises'
import path from 'node:path'
import Handlebars from 'handlebars'
import yaml from 'yaml'
import { validateCoreObject, validateEvidenceBinding } from '../schema/validate-core'

export type LLMFn = (prompt: string, opts?: { temperature?: number }) => Promise<string>
export interface BuildDeps {
  llmFn: LLMFn
}

export interface BuildIn {
  workdir: string
  id: string
  entity: string
  type?: string
  lang: 'en' | 'pt' | 'es' | 'ja' | 'zh'
  promptTemplatePath: string
}

export interface BuildOk {
  status: 'ok'
  core_path: string
  retries: number
}
export interface BuildFail {
  status: 'fail'
  failed_rules: string[]
  retries: number
  last_yaml?: string
}
export type BuildOut = BuildOk | BuildFail

const MAX_RETRIES = 1

export async function runBuild(input: BuildIn, deps: BuildDeps): Promise<BuildOut> {
  const extracts = JSON.parse(await fs.readFile(path.join(input.workdir, 'extracts.json'), 'utf8'))
  const tplRaw = await fs.readFile(input.promptTemplatePath, 'utf8')
  const tpl = Handlebars.compile(tplRaw, { noEscape: true })
  const basePrompt = tpl({
    id: input.id,
    entity: input.entity,
    type: input.type ?? 'concept',
    lang: input.lang,
    extracts,
  })

  let attempt = 0
  let lastYaml = ''
  let lastErrors: Array<{ rule: string; message: string }> = []

  while (attempt <= MAX_RETRIES) {
    const retryHint =
      attempt > 0
        ? `\n\nRetry: previous output failed with rules: ${lastErrors.map(e => e.rule).join(', ')}\n`
        : ''
    const llmOut = await deps.llmFn(basePrompt + retryHint, { temperature: 0.2 })
    lastYaml = llmOut
    let parsed: unknown
    try {
      parsed = yaml.parse(stripFences(llmOut))
    } catch (e) {
      lastErrors = [{ rule: 'yaml:parse', message: (e as Error).message }]
      attempt++
      continue
    }

    const schemaRes = validateCoreObject(parsed)
    if (!schemaRes.ok) {
      lastErrors = schemaRes.errors
      attempt++
      continue
    }

    const corePath = path.join(input.workdir, 'core.yaml')
    await fs.writeFile(corePath, yaml.stringify(schemaRes.data))
    const evRes = await validateEvidenceBinding(schemaRes.data, input.workdir)
    if (!evRes.ok) {
      lastErrors = evRes.errors
      attempt++
      continue
    }
    return { status: 'ok', core_path: corePath, retries: attempt }
  }
  return {
    status: 'fail',
    failed_rules: lastErrors.map(e => e.rule),
    retries: attempt,
    last_yaml: lastYaml,
  }
}

function stripFences(s: string): string {
  const m = s.match(/```(?:yaml)?\n([\s\S]*?)\n```/)
  return m?.[1] ? m[1] : s
}
