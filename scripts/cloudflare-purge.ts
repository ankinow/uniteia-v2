#!/usr/bin/env bun
/**
 * Cloudflare Purge API Script
 *
 * Automates Cloudflare cache purging after deploys by calling the Cloudflare
 * API. Combined with SWR headers (T02) and the service worker chunk guard
 * (T01), this is the third layer of the four-layer deploy-transition defense.
 *
 * Usage:
 *   bun run scripts/cloudflare-purge.ts --dry-run       # validate config
 *   bun run scripts/cloudflare-purge.ts                  # purge all /build/* URLs
 *   bun run scripts/cloudflare-purge.ts --all            # explicit alias for default
 *   bun run scripts/cloudflare-purge.ts --files /build/q-core.js,/build/q-BD-hIznX.js
 *
 * Env vars required:
 *   CLOUDFLARE_API_TOKEN   — Cloudflare API token with cache:purge permission
 *   CLOUDFLARE_ACCOUNT_ID  — Cloudflare account ID (24 hex chars)
 *
 * Exit codes: 0 on success, 1 on failure after all retries.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// ── Types ───────────────────────────────────────────────────────────────

interface PurgeOptions {
  /** List of URL paths to purge (e.g. /build/q-core.js). Default: all /build/* from manifest. */
  files?: string[]
  /** When true, validate config without purging. */
  dryRun: boolean
}

interface CloudflareApiResponse {
  success: boolean
  errors: Array<{ code: number; message: string }>
  messages: string[]
  result: unknown
}

// ── Constants ───────────────────────────────────────────────────────────

const CF_API_BASE = 'https://api.cloudflare.com/client/v4'
const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000
const MANIFEST_PATH = join(import.meta.dirname, '..', 'dist', 'q-manifest.json')

// ── CLI argument parsing ────────────────────────────────────────────────

interface CliArgs {
  dryRun: boolean
  files: string[] | null
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { dryRun: false, files: null }

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--dry-run') {
      args.dryRun = true
    } else if (arg === '--all') {
      args.files = null // default: all from manifest
    } else if (arg === '--files') {
      const value = argv[++i]
      if (!value) {
        throw new Error('Missing value for --files. Usage: --files /build/file1.js,/build/file2.js')
      }
      args.files = value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    } else if (arg === '--help' || arg === '-h') {
      console.log(
        [
          'Cloudflare Purge API Script',
          '',
          'Usage:',
          '  bun run scripts/cloudflare-purge.ts --dry-run',
          '  bun run scripts/cloudflare-purge.ts',
          '  bun run scripts/cloudflare-purge.ts --files /build/file1.js,/build/file2.js',
          '',
          'Options:',
          '  --dry-run   Validate config and API reachability without purging',
          '  --all       Purge all /build/* URLs from dist/q-manifest.json (default)',
          '  --files     Comma-separated list of URL paths to purge',
          '  --help, -h  Show this help message',
          '',
          'Env vars:',
          '  CLOUDFLARE_API_TOKEN   Required. Cloudflare API token (cache:purge permission)',
          '  CLOUDFLARE_ACCOUNT_ID  Required. Cloudflare account ID',
        ].join('\n')
      )
      process.exit(0)
    } else {
      throw new Error(`Unknown argument: ${arg}. Use --help for usage.`)
    }
  }

  return args
}

// ── Configuration validation ───────────────────────────────────────────

function validateConfig(): { apiToken: string; accountId: string } {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID

  if (!apiToken) {
    console.error('❌ CLOUDFLARE_API_TOKEN is not set. Export it or add to .env.')
    process.exit(1)
  }

  if (!accountId) {
    console.error('❌ CLOUDFLARE_ACCOUNT_ID is not set. Export it or add to .env.')
    process.exit(1)
  }

  // Basic format validation for account ID (24 hex chars)
  if (!/^[0-9a-f]{32}$/i.test(accountId) && accountId.length !== 32) {
    console.warn(
      '⚠️  CLOUDFLARE_ACCOUNT_ID does not look like a standard 32-char hex ID. Proceeding anyway.'
    )
  }

  return { apiToken, accountId }
}

// ── File list resolution ───────────────────────────────────────────────

/**
 * Read dist/q-manifest.json and extract all unique /build/* filenames.
 * Includes mapping values, core, and preloader.
 */
function readBuildFilesFromManifest(): string[] {
  let manifest: Record<string, unknown>
  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf-8')
    manifest = JSON.parse(raw)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`❌ Failed to read dist/q-manifest.json: ${message}`)
    console.error('   Run `bun run build` first to generate the manifest.')
    process.exit(1)
  }

  const files = new Set<string>()

  // Collect from mapping (symbol → filename)
  const mapping = manifest.mapping as Record<string, string> | undefined
  if (mapping) {
    for (const filename of Object.values(mapping)) {
      files.add(`/build/${filename}`)
    }
  }

  // Add core chunk
  const core = manifest.core as string | undefined
  if (core) {
    files.add(`/build/${core}`)
  }

  // Add preloader chunk
  const preloader = manifest.preloader as string | undefined
  if (preloader) {
    files.add(`/build/${preloader}`)
  }

  // Also read actual files from dist/build/ directory as a fallback
  try {
    const distBuildDir = join(import.meta.dirname, '..', 'dist', 'build')
    const actualFiles = readdirSync(distBuildDir)
    for (const f of actualFiles) {
      if (f.endsWith('.js') || f.endsWith('.mjs')) {
        files.add(`/build/${f}`)
      }
    }
  } catch {
    // dist/build/ may not exist — that's fine, rely on manifest
  }

  return [...files].sort()
}

// ── API helpers ─────────────────────────────────────────────────────────

function buildHeaders(apiToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Verify API token reachability by calling GET /user/tokens/verify.
 * Returns true when the token is valid.
 */
async function verifyToken(apiToken: string): Promise<boolean> {
  const url = `${CF_API_BASE}/user/tokens/verify`
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(apiToken),
  })

  if (!response.ok) {
    console.error(`   Token verification failed: HTTP ${response.status} ${response.statusText}`)
    return false
  }

  const data = (await response.json()) as CloudflareApiResponse
  return data.success === true
}

/**
 * Purge specific files from the Cloudflare cache.
 * Uses POST /accounts/{account_id}/purge_cache with { files: [...] }.
 */
async function purgeFiles(
  apiToken: string,
  accountId: string,
  files: string[]
): Promise<CloudflareApiResponse> {
  const url = `${CF_API_BASE}/accounts/${accountId}/purge_cache`
  const body = { files }

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(apiToken),
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as CloudflareApiResponse

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data.errors?.[0]?.message ?? response.statusText}`)
  }

  return data
}

/**
 * Execute an async operation with retry and exponential backoff.
 * Retries on network errors and non-2xx responses.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { label: string; maxRetries: number; baseDelayMs: number }
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      console.log(`   [${options.label}] Attempt ${attempt}/${options.maxRetries}...`)
      const result = await fn()
      console.log(`   [${options.label}] Attempt ${attempt} succeeded.`)
      return result
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.error(`   [${options.label}] Attempt ${attempt} failed: ${lastError.message}`)

      if (attempt < options.maxRetries) {
        const delay = options.baseDelayMs * 2 ** (attempt - 1)
        console.log(`   [${options.label}] Retrying in ${delay}ms...`)
        await sleep(delay)
      }
    }
  }

  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Main logic (exported for testing) ───────────────────────────────────

/**
 * Resolve the list of files to purge based on CLI options.
 * Default: read all /build/* files from q-manifest.json + actual dist/build/ contents.
 */
export function resolveFiles(files: string[] | null): string[] {
  if (files && files.length > 0) {
    return files
  }
  return readBuildFilesFromManifest()
}

/**
 * Validate the purge configuration: env vars, manifest reachability,
 * and API token validity. Returns true when dry-run can proceed.
 */
export async function validatePurgeConfig(apiToken: string, _accountId: string): Promise<boolean> {
  console.log('   ✓ CLOUDFLARE_API_TOKEN is set')
  console.log('   ✓ CLOUDFLARE_ACCOUNT_ID is set')

  // Verify token with CF API
  console.log('   Checking API token reachability...')
  const tokenValid = await verifyToken(apiToken)
  if (!tokenValid) {
    console.error('   ❌ API token is invalid or lacks required permissions.')
    console.error('      Ensure the token has cache:purge permission for the account.')
    return false
  }
  console.log('   ✓ API token is valid')
  return true
}

/**
 * Run the full purge: resolve files, validate, and execute purge with retry.
 */
export async function runPurge(options: PurgeOptions): Promise<void> {
  const { apiToken, accountId } = validateConfig()

  // Resolve file list
  const files = resolveFiles(options.files)
  console.log(`   Resolved ${files.length} files to purge:`)
  for (const f of files) {
    console.log(`     - ${f}`)
  }

  // Validate configuration
  const configOk = await validatePurgeConfig(apiToken, accountId)
  if (!configOk) {
    process.exit(1)
  }

  if (options.dryRun) {
    console.log('\n✅ Dry-run completed. All checks passed. No cache was purged.')
    return
  }

  // Execute purge with retry
  console.log('\n   Purging cache...')
  try {
    const result = await withRetry(() => purgeFiles(apiToken, accountId, files), {
      label: 'cache-purge',
      maxRetries: MAX_RETRIES,
      baseDelayMs: BASE_DELAY_MS,
    })
    console.log('\n✅ Cache purge completed successfully.')
    console.log(`   API response: ${result.messages?.join(', ') ?? 'OK'}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ Cache purge failed after ${MAX_RETRIES} attempts: ${message}`)
    process.exit(1)
  }
}

// ── Entry point ─────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== Cloudflare Cache Purge ===\n')

  const args = parseArgs(process.argv)
  const files: string[] | null = args.files

  await runPurge({ files, dryRun: args.dryRun })
}

// Guarded main: only run when this module is the entry point
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('scripts/cloudflare-purge.ts') ||
    process.argv[1].endsWith('cloudflare-purge.ts'))

if (isMain) {
  await main().catch(err => {
    console.error('Script failed:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  })
}
