/**
 * @orquestra/ai-core - Cloudflare Secrets Manager
 * SOTA 2026: Secure API key management using Cloudflare Workers Secrets
 *
 * Features:
 * - Type-safe secret access
 * - Fallback to environment variables in development
 * - Provider priority: Gemini > Workers AI > OpenRouter
 *
 * Usage in Cloudflare Workers:
 *   npx wrangler secret put GEMINI_API_KEY
 *   npx wrangler secret put WORKERS_AI_TOKEN
 *   npx wrangler secret put OPENROUTER_API_KEY
 *
 * Access in code:
 *   const secrets = getSecrets(env)
 *   const geminiKey = secrets.GEMINI_API_KEY
 */

import { getEvent } from 'vinxi/http'

// =============================================================================
// TYPES
// =============================================================================

export interface OrquidiaSecrets {
  // AI Providers
  GEMINI_API_KEY?: string
  WORKERS_AI_TOKEN?: string
  OPENROUTER_API_KEY?: string

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_API_TOKEN?: string

  // Database
  D1_DATABASE_ID?: string
  D1_DATABASE_NAME?: string

  // Access Control
  CF_ACCESS_TEAM_NAME?: string
  CF_ACCESS_AUD?: string
}

export interface ProviderCredentials {
  gemini?: { apiKey: string }
  workersAI?: { accountId: string; token: string }
  openrouter?: { apiKey: string }
}

export interface SecretsStatus {
  gemini: boolean
  workersAI: boolean
  openrouter: boolean
  primaryProvider: 'gemini' | 'workers-ai' | 'openrouter' | 'none'
}

// =============================================================================
// SECRET ACCESS
// =============================================================================

/**
 * Get secrets from Cloudflare Workers environment
 * Falls back to process.env in development
 */
export function getSecrets(): OrquidiaSecrets {
  const event = getEvent()
  const env = (event.context as { cloudflare?: { env?: OrquidiaSecrets } }).cloudflare?.env

  if (env) {
    return {
      GEMINI_API_KEY: env.GEMINI_API_KEY,
      WORKERS_AI_TOKEN: env.WORKERS_AI_TOKEN,
      OPENROUTER_API_KEY: env.OPENROUTER_API_KEY,
      CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN,
      D1_DATABASE_ID: env.D1_DATABASE_ID,
      D1_DATABASE_NAME: env.D1_DATABASE_NAME,
      CF_ACCESS_TEAM_NAME: env.CF_ACCESS_TEAM_NAME,
      CF_ACCESS_AUD: env.CF_ACCESS_AUD,
    }
  }

  // Development fallback - only non-secret vars
  return {
    D1_DATABASE_ID: process.env.D1_DATABASE_ID,
    D1_DATABASE_NAME: process.env.D1_DATABASE_NAME,
    CF_ACCESS_TEAM_NAME: process.env.CF_ACCESS_TEAM_NAME,
    CF_ACCESS_AUD: process.env.CF_ACCESS_AUD,
  }
}

/**
 * Get provider credentials from secrets
 * Returns the best available provider configuration
 */
export function getProviderCredentials(secrets: OrquidiaSecrets): ProviderCredentials {
  const credentials: ProviderCredentials = {}

  // Gemini (primary - best quality/free tier)
  if (secrets.GEMINI_API_KEY) {
    credentials.gemini = { apiKey: secrets.GEMINI_API_KEY }
  }

  // Workers AI (free tier via Cloudflare)
  if (secrets.WORKERS_AI_TOKEN && secrets.CLOUDFLARE_API_TOKEN) {
    credentials.workersAI = {
      token: secrets.WORKERS_AI_TOKEN,
      accountId: secrets.CLOUDFLARE_ACCOUNT_ID || '',
    }
  }

  // OpenRouter (fallback)
  if (secrets.OPENROUTER_API_KEY) {
    credentials.openrouter = { apiKey: secrets.OPENROUTER_API_KEY }
  }

  return credentials
}

/**
 * Check which providers are available
 */
export function getSecretsStatus(secrets: OrquidiaSecrets): SecretsStatus {
  return {
    gemini: !!secrets.GEMINI_API_KEY,
    workersAI: !!secrets.WORKERS_AI_TOKEN,
    openrouter: !!secrets.OPENROUTER_API_KEY,
    primaryProvider: secrets.GEMINI_API_KEY
      ? 'gemini'
      : secrets.WORKERS_AI_TOKEN
        ? 'workers-ai'
        : secrets.OPENROUTER_API_KEY
          ? 'openrouter'
          : 'none',
  }
}

/**
 * Get the best available provider
 * Priority: Gemini > Workers AI > OpenRouter
 */
export function getBestProvider(
  credentials: ProviderCredentials,
): 'gemini' | 'workers-ai' | 'openrouter' | null {
  if (credentials.gemini) return 'gemini'
  if (credentials.workersAI) return 'workers-ai'
  if (credentials.openrouter) return 'openrouter'
  return null
}

// =============================================================================
// WRANGLER SECRETS SETUP
// =============================================================================

/**
 * Generate wrangler commands to set up secrets
 */
export function getSecretSetupCommands(): string {
  return `# =============================================================================
# CLOUDFLARE SECRETS SETUP
# =============================================================================
# Run these commands in your terminal to configure production secrets:

# AI Providers (Priority: Gemini > Workers AI > OpenRouter)
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put WORKERS_AI_TOKEN
npx wrangler secret put OPENROUTER_API_KEY

# Cloudflare
npx wrangler secret put CLOUDFLARE_API_TOKEN

# For specific environment:
npx wrangler secret put GEMINI_API_KEY --env production

# Verify secrets are set:
npx wrangler secret list

# =============================================================================`
}

/**
 * Development environment template
 */
export function getDevEnvTemplate(): string {
  return `# =============================================================================
# ORQUIDIA DEVELOPMENT .env
# =============================================================================
# Copy to .env for local development
# DO NOT commit this file with real API keys!

# Database (D1)
D1_DATABASE_ID=your-dev-db-id
D1_DATABASE_NAME=uniteia-db

# Cloudflare Access (optional)
CF_ACCESS_TEAM_NAME=your-team.cloudflareaccess.com
CF_ACCESS_AUD=your-audience-tag

# Note: AI Provider API keys should NOT be in .env for production!
# Use 'npx wrangler secret put' instead.
# For local testing without real API keys, you can add:
# GEMINI_API_KEY=your-test-key
`
}
