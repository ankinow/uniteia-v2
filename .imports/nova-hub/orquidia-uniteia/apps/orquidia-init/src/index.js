#!/usr/bin/env node

/**
 * Orquidia Init - Server Initialization Wizard
 *
 * This wizard guides users through setting up the Orquidia Ops Center
 * on their local machine with proper configuration and validation.
 */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline'

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (num, total, msg) =>
    console.log(
      `\n${colors.cyan}[${num}/${total}]${colors.reset} ${colors.bright}${msg}${colors.reset}`,
    ),
  header: () => {
    console.log(`
${colors.magenta}
 ██████  ██████  ██    ██  ██████  ██ ██████  ███████ 
██    ██ ██   ██ ██    ██ ██    ██ ██ ██   ██ ██      
██    ██ ██████  ██    ██ ██    ██ ██ ██   ██ █████   
██    ██ ██   ██ ██    ██ ██    ██ ██ ██   ██ ██      
 ██████  ██   ██  ██████   ██████  ██ ██████  ███████ 
${colors.reset}
${colors.dim}Orquidia Ops Center - Initialization Wizard v1.0.0${colors.reset}
${colors.dim}SOTA 2026 | Local-Only Minimal Architecture${colors.reset}
`)
  },
}

// Readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()))
  })

// Configuration storage
const config = {
  hyperbrowserKey: '',
  geminiKey: '',
  cfToken: '',
  cfAccountId: '52024f99754ec4d76806e59dbd295098',
  d1DatabaseId: '8396cb37-422a-4ea4-ad16-16372cbc6224',
  memoryLimit: 500,
  installPath: join(homedir(), 'orquidia-ops'),
}

// System checks
async function checkSystem() {
  log.step(1, 5, 'System Verification')

  const checks = []

  // Check Node.js version
  try {
    const nodeVersion = process.version
    const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0])
    if (majorVersion >= 18) {
      log.success(`Node.js ${nodeVersion} (>= 18.0.0)`)
      checks.push(true)
    } else {
      log.error(`Node.js ${nodeVersion} (requires >= 18.0.0)`)
      checks.push(false)
    }
  } catch {
    log.error('Node.js not found')
    checks.push(false)
  }

  // Check memory
  try {
    const totalMem = Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    const freeMem = Math.round(require('node:os').freemem() / 1024 / 1024)
    if (freeMem >= 500) {
      log.success(`Memory: ${freeMem}MB free (>= 500MB required)`)
      checks.push(true)
    } else {
      log.warning(`Memory: ${freeMem}MB free (>= 500MB recommended)`)
      checks.push(true) // Warning only
    }
  } catch {
    log.warning('Could not check memory')
    checks.push(true)
  }

  // Check Git
  try {
    execSync('git --version', { stdio: 'pipe' })
    log.success('Git installed')
    checks.push(true)
  } catch {
    log.error('Git not found (required for cloning)')
    checks.push(false)
  }

  // Check network
  try {
    const response = await fetch('https://cloudflare.com', { method: 'HEAD' })
    if (response.ok) {
      log.success('Internet connectivity OK')
      checks.push(true)
    } else {
      throw new Error('No connectivity')
    }
  } catch {
    log.error('No internet connectivity')
    checks.push(false)
  }

  return checks.every(Boolean)
}

// Collect credentials
async function collectCredentials() {
  log.step(2, 5, 'API Credentials')

  log.info('You can find these credentials in your vault or CF dashboard')
  log.info('Vault location: /media/lermf/C6C05C4AC05C42BB/$VAULT$/secrets.json')

  console.log('')

  // Hyperbrowser
  config.hyperbrowserKey = await question(
    `${colors.dim}Hyperbrowser API Key${colors.reset} (hb_...): `,
  )
  if (!config.hyperbrowserKey) {
    log.warning('No Hyperbrowser key provided - scraping will not work')
  }

  // Gemini
  config.geminiKey = await question(`${colors.dim}Gemini API Key${colors.reset} (AIzaSy...): `)
  if (!config.geminiKey) {
    log.warning('No Gemini key provided - AI generation will not work')
  }

  // Cloudflare
  config.cfToken = await question(`${colors.dim}Cloudflare API Token${colors.reset}: `)
  if (!config.cfToken) {
    log.warning('No CF token provided - publishing will not work')
  }

  // Account ID (with default)
  const accountId = await question(
    `${colors.dim}Cloudflare Account ID${colors.reset} [${config.cfAccountId}]: `,
  )
  if (accountId) config.cfAccountId = accountId

  // Database ID (with default)
  const dbId = await question(
    `${colors.dim}D1 Database ID${colors.reset} [${config.d1DatabaseId}]: `,
  )
  if (dbId) config.d1DatabaseId = dbId
}

// Test connections
async function testConnections() {
  log.step(3, 5, 'Testing Connections')

  const tests = []

  // Test Hyperbrowser
  if (config.hyperbrowserKey) {
    try {
      const response = await fetch('https://api.hyperbrowser.com/v1/health', {
        headers: { Authorization: `Bearer ${config.hyperbrowserKey}` },
      })
      if (response.ok) {
        log.success('Hyperbrowser API: Connected')
        tests.push(true)
      } else {
        log.error('Hyperbrowser API: Invalid key')
        tests.push(false)
      }
    } catch {
      log.error('Hyperbrowser API: Connection failed')
      tests.push(false)
    }
  }

  // Test Gemini
  if (config.geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] }),
        },
      )
      if (response.ok) {
        log.success('Gemini API: Connected')
        tests.push(true)
      } else {
        log.error('Gemini API: Invalid key')
        tests.push(false)
      }
    } catch {
      log.error('Gemini API: Connection failed')
      tests.push(false)
    }
  }

  // Test Cloudflare
  if (config.cfToken) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${config.cfAccountId}/d1/database`,
        {
          headers: {
            Authorization: `Bearer ${config.cfToken}`,
            'Content-Type': 'application/json',
          },
        },
      )
      const data = await response.json()
      if (data.success) {
        log.success(`Cloudflare D1: Connected (${data.result?.length || 0} databases)`)
        tests.push(true)
      } else {
        log.error('Cloudflare D1: Invalid token')
        tests.push(false)
      }
    } catch {
      log.error('Cloudflare D1: Connection failed')
      tests.push(false)
    }
  }

  return tests.length === 0 || tests.some(Boolean)
}

// Create environment file
async function createEnvironment() {
  log.step(4, 5, 'Creating Environment')

  const envContent = `# Orquidia Ops Center - Environment Configuration
# Generated by Orquidia Init v1.0.0
# Date: ${new Date().toISOString()}

# API Keys
HYPERBROWSER_API_KEY=${config.hyperbrowserKey}
GEMINI_API_KEY=${config.geminiKey}
CF_API_TOKEN=${config.cfToken}
CF_ACCOUNT_ID=${config.cfAccountId}

# Database
D1_DATABASE_ID=${config.d1DatabaseId}
D1_DATABASE_NAME=uniteia-db

# System Settings
MEMORY_LIMIT_MB=${config.memoryLimit}
MAX_CONCURRENT_OPS=2
CONTENT_TONE=professional
AUTO_PUBLISH=false

# Paths
ORQUIDIA_PATH=${config.installPath}

# Feature Flags
ENABLE_SCRAPING=${config.hyperbrowserKey ? 'true' : 'false'}
ENABLE_AI=${config.geminiKey ? 'true' : 'false'}
ENABLE_PUBLISH=${config.cfToken ? 'true' : 'false'}
`

  // Create install directory
  if (!existsSync(config.installPath)) {
    mkdirSync(config.installPath, { recursive: true })
  }

  // Write .env file
  const envPath = join(config.installPath, '.env')
  writeFileSync(envPath, envContent)
  log.success(`Environment file created: ${envPath}`)

  // Also write to current directory for immediate use
  writeFileSync('.env', envContent)
  log.success('Local .env file created')
}

// Install Orquidia
async function installOrquidia() {
  log.step(5, 5, 'Installing Orquidia')

  log.info('Cloning repository...')

  try {
    // Clone the repository
    execSync('git clone https://github.com/LERMF/orquidia-uniteia.git .', {
      cwd: config.installPath,
      stdio: 'pipe',
    })
    log.success('Repository cloned')
  } catch {
    log.warning('Repository clone failed or already exists')
    log.info('Using local files instead')
  }

  log.info('')
  log.info(`${colors.bright}Installation Complete!${colors.reset}`)
  log.info('')
  log.info('Next steps:')
  log.info(`  cd ${config.installPath}`)
  log.info('  bun install')
  log.info('  bun run dev')
  log.info('')
  log.info(`Then open: ${colors.cyan}http://127.0.0.1:5173/dashboard${colors.reset}`)
}

// Main wizard flow
async function main() {
  log.header()

  log.info('This wizard will set up Orquidia Ops Center on your machine.')
  log.info('Press Ctrl+C at any time to cancel.')

  // Step 1: System checks
  const systemOk = await checkSystem()
  if (!systemOk) {
    log.error('System checks failed. Please fix the issues above.')
    const proceed = await question('\nContinue anyway? (y/N): ')
    if (proceed.toLowerCase() !== 'y') {
      process.exit(1)
    }
  }

  // Step 2: Collect credentials
  await collectCredentials()

  // Step 3: Test connections
  const testsOk = await testConnections()
  if (!testsOk) {
    log.warning('Some connection tests failed.')
    const proceed = await question('\nContinue with setup? (y/N): ')
    if (proceed.toLowerCase() !== 'y') {
      process.exit(1)
    }
  }

  // Step 4: Create environment
  await createEnvironment()

  // Step 5: Install
  await installOrquidia()

  // Done
  console.log('')
  console.log(`${colors.green}${colors.bright}✓ Setup complete!${colors.reset}`)
  console.log('')
  console.log('Your Orquidia Ops Center is ready to use.')
  console.log('Run the following to start:')
  console.log('')
  console.log(`  ${colors.cyan}cd ${config.installPath}${colors.reset}`)
  console.log(`  ${colors.cyan}bun run dev${colors.reset}`)
  console.log('')

  rl.close()
}

// Run wizard
main().catch((error) => {
  log.error(`Wizard failed: ${error.message}`)
  process.exit(1)
})
