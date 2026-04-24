# =============================================================================
# ORQUIDIA SECRET STORES CONFIGURATION
# =============================================================================
# SOTA 2026: Cloudflare Workers Secrets for secure API management
#
# IMPORTANT: API keys should NEVER be in source control!
# Use Cloudflare Secrets for production, .env for development only.
#
# =============================================================================
# SETUP INSTRUCTIONS
# =============================================================================
#
# Method 1: Interactive Setup (Recommended)
# ------------------------------------------
# Run the setup script:
#   chmod +x scripts/setup-secrets.sh
#   ./scripts/setup-secrets.sh
#
# Method 2: Manual Secret Setting
# -------------------------------
#   npx wrangler secret put GEMINI_API_KEY
#   npx wrangler secret put WORKERS_AI_TOKEN
#   npx wrangler secret put OPENROUTER_API_KEY
#   npx wrangler secret put CLOUDFLARE_API_TOKEN
#
# Method 3: CI/CD Pipeline
# ------------------------
# Set secrets in GitHub Actions or other CI:
#   echo "$API_KEY" | npx wrangler secret put API_KEY_NAME
#
# =============================================================================
# INSPECTING SECRETS
# =============================================================================
#
# List all current secrets:
#   chmod +x scripts/inspect-secrets.sh
#   ./scripts/inspect-secrets.sh
#
# Or directly:
#   npx wrangler secret list
#
# Note: wrangler secret list shows metadata only, NOT the actual values.
# This is a security feature - secrets are never exposed.
#
# =============================================================================
# CLEANING UP SECRETS
# =============================================================================
#
# Cloudflare Workers secrets cannot be directly deleted. To clean up:
#
# Option A: Recreate with new values
# ----------------------------------
#   chmod +x scripts/cleanup-secrets.sh
#   ./scripts/cleanup-secrets.sh
#
# Option B: Manual recreation
# ---------------------------
#   # Delete by overwriting with empty (if needed)
#   # Then set new value:
#   npx wrangler secret put GEMINI_API_KEY
#
# Option C: Deploy new version
# ----------------------------
#   # Secrets are per-version in some configurations
#   # Deploy a new version to "remove" old secrets
#
# =============================================================================
# AVAILABLE SECRETS
# =============================================================================
#
# Required for AI Content Generation:
#   GEMINI_API_KEY      - Google Gemini API (primary, free tier)
#   WORKERS_AI_TOKEN    - Cloudflare Workers AI (free tier)
#   OPENROUTER_API_KEY  - OpenRouter fallback (free models)
#
# Required for Deployment:
#   CLOUDFLARE_API_TOKEN - Cloudflare API token with Workers permissions
#
# Optional:
#   D1_DATABASE_ID      - D1 Database ID (if different from linked binding)
#
# =============================================================================
# ACCESSING SECRETS IN CODE
# =============================================================================
#
# In Cloudflare Workers, secrets are available via env:
#
#   import { getSecrets } from '@/lib/secrets'
#
#   export default {
#     async fetch(request, env, ctx) {
#       const secrets = getSecrets(env)
#       const geminiKey = secrets.GEMINI_API_KEY
#       // ...
#     }
#   }
#
# =============================================================================
# ENVIRONMENT-SPECIFIC SECRETS
# =============================================================================
#
# Set secrets for specific environments:
#
#   # Production
#   npx wrangler secret put GEMINI_API_KEY --env production
#
#   # Staging
#   npx wrangler secret put GEMINI_API_KEY --env staging
#
# View all secrets:
#   npx wrangler secret list
#
# =============================================================================
# VERIFICATION
# =============================================================================
#
# To verify secrets are set correctly:
#
#   1. List all secrets:
#      npx wrangler secret list
#
#   2. Check worker logs:
#      npx wrangler deploy --dry-run
#
#   3. Test in production:
#      curl https://your-worker.yourname.workers.dev/api/health
#
# =============================================================================
# SECURITY BEST PRACTICES
# =============================================================================
#
# 1. Never commit API keys to git
# 2. Rotate secrets regularly (every 30-90 days)
# 3. Use minimal permissions for API tokens
# 4. Monitor usage for anomalies
# 5. Use different keys for dev/staging/prod
# 6. Audit secrets quarterly with inspect-secrets.sh
#
# =============================================================================
# PROVIDER PRIORITY (Fallback Chain)
# =============================================================================
#
# The orchestrator tries providers in this order:
#
#   1. Gemini API (gemini-2.0-flash) - Best quality, free tier
#      → Requires: GEMINI_API_KEY
#
#   2. Workers AI (@cf/meta/llama-3-8b-instruct) - Fast, free tier
#      → Requires: WORKERS_AI_TOKEN, CLOUDFLARE_API_TOKEN
#
#   3. OpenRouter (free models) - Fallback
#      → Requires: OPENROUTER_API_KEY
#
# =============================================================================
# TROUBLESHOOTING
# =============================================================================
#
# Secret not found error:
#   → Verify with: npx wrangler secret list
#   → Recreate with: npx wrangler secret put SECRET_NAME
#
# Secret value is wrong:
#   → Secrets cannot be read, only overwritten
#   → Use cleanup-secrets.sh to replace
#
# Deployment fails with secret error:
#   → Check environment: npx wrangler deploy --env production
#   → Ensure secret is set for correct environment
#
# =============================================================================
