import fs from 'node:fs/promises'
import path from 'node:path'
import Handlebars from 'handlebars'
import yaml from 'yaml'

export type Channel = 'blog' | 'short' | 'wiki' | 'prompt-seed'

export interface RenderIn {
  corePath: string
  channels: Channel[]
  outDir: string
  templatesDir: string
}

export interface RenderOk {
  status: 'ok'
  written: string[]
}
export interface RenderFail {
  status: 'fail'
  failed_rules: string[]
}
export type RenderOut = RenderOk | RenderFail

const FILE_FOR: Record<Channel, string> = {
  blog: 'blog.md',
  short: 'short.json',
  wiki: 'wiki.md',
  'prompt-seed': 'prompt-seed.md',
}
const TPL_FOR: Record<Channel, string> = {
  blog: 'blog.md.hbs',
  short: 'short.json.hbs',
  wiki: 'wiki.md.hbs',
  'prompt-seed': 'prompt-seed.md.hbs',
}

Handlebars.registerHelper('json', v => JSON.stringify(v))

export async function runRender(input: RenderIn): Promise<RenderOut> {
  let core: Record<string, unknown>
  try {
    core = yaml.parse(await fs.readFile(input.corePath, 'utf8'))
  } catch {
    return { status: 'fail', failed_rules: ['render:core_missing_or_invalid'] }
  }
  await fs.mkdir(input.outDir, { recursive: true })
  const written: string[] = []
  for (const ch of input.channels) {
    const tplRaw = await fs.readFile(path.join(input.templatesDir, TPL_FOR[ch]), 'utf8')
    const tpl = Handlebars.compile(tplRaw, { noEscape: true })
    const out = tpl(core)
    const outPath = path.join(input.outDir, FILE_FOR[ch])
    await fs.writeFile(outPath, out)
    written.push(outPath)
  }
  return { status: 'ok', written }
}
