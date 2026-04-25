import fs from 'node:fs/promises'
import path from 'node:path'

export type FetchResult = {
  url: string
  status: number
  kind: 'primary' | 'secondary'
  text: string
  fetched_at: string
}

export type FetcherFn = (url: string) => Promise<FetchResult>
export interface GatherDeps {
  fetcherFn: FetcherFn
}

export interface GatherIn {
  entity: string
  seed_urls: string[]
  min_sources: number
  required_primary: number
  workdir: string
  mode: 'prompt' | 'url' | 'notes'
}

export interface GatherOk {
  status: 'ok'
  sources_path: string
  extracts_path: string
  count: { total: number; primary: number; secondary: number }
}
export interface GatherFail {
  status: 'fail'
  failed_rules: string[]
  partial?: { count: { total: number; primary: number; secondary: number } }
}
export type GatherOut = GatherOk | GatherFail

export async function runGather(input: GatherIn, deps: GatherDeps): Promise<GatherOut> {
  await fs.mkdir(input.workdir, { recursive: true })
  if (input.mode !== 'url' && input.seed_urls.length === 0) {
    return { status: 'fail', failed_rules: [`gather:no_sources_for_mode_${input.mode}`] }
  }
  const fetched: FetchResult[] = []
  for (const url of input.seed_urls) {
    try {
      fetched.push(await deps.fetcherFn(url))
    } catch {
      /* gate decides */
    }
  }
  const primary = fetched.filter(f => f.kind === 'primary').length
  const total = fetched.length
  const failed_rules: string[] = []
  if (primary < input.required_primary) failed_rules.push('gather:min_primary')
  if (total < input.min_sources) failed_rules.push('gather:min_total')

  const sourcesPath = path.join(input.workdir, 'sources.json')
  const extractsPath = path.join(input.workdir, 'extracts.json')
  await fs.writeFile(
    sourcesPath,
    JSON.stringify(
      fetched.map((f, i) => ({
        excerpt_id: `ex_${String(i + 1).padStart(3, '0')}`,
        url: f.url,
        kind: f.kind,
        accessed_at: f.fetched_at,
        status: f.status,
      })),
      null,
      2
    )
  )
  await fs.writeFile(
    extractsPath,
    JSON.stringify(
      fetched.map((f, i) => ({
        excerpt_id: `ex_${String(i + 1).padStart(3, '0')}`,
        url: f.url,
        text: f.text.slice(0, 12000),
      })),
      null,
      2
    )
  )

  if (failed_rules.length > 0) {
    return {
      status: 'fail',
      failed_rules,
      partial: { count: { total, primary, secondary: total - primary } },
    }
  }
  return {
    status: 'ok',
    sources_path: sourcesPath,
    extracts_path: extractsPath,
    count: { total, primary, secondary: total - primary },
  }
}
