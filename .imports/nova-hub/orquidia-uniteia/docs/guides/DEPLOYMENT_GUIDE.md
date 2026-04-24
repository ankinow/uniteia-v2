# =============================================================================
# ORQUIDIA-DEPLOYMENT-GUIDE.md
# SOTA 2026: Deployment para ambientes com recursos limitados
# =============================================================================
#
# ⚠️ AVISO: Builds locais podem travar o sistema!
# Este guia fornece alternativas para deployment em hardware limitado.
#
# =============================================================================
# ESTRATÉGIAS PARA RECURSOS LIMITADOS
# =============================================================================
#
# 1. USE CLOUDFLARE PAGES BUILD (RECOMENDADO)
#    ----------------------------------------
# O Cloudflare Pages tembuild unlimited - não usa seus recursos locais!
#
# Passo a passo:
# 1. Push código para GitHub
# 2. Conecte repo ao Cloudflare Pages
# 3. Configure build command: `bun run build`
# 4. Configure output directory: `dist`
# 5. Deployment automático em push!
#
# 2. BUILD REMOTO VIA CI/CD
#    ----------------------
# GitHub Actions faz build em servidores remotos:
#
# .github/workflows/deploy.yml:
# ```yaml
# name: Deploy
# on: [push]
# jobs:
#   deploy:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: oven-sh/setup-bun@v1
#       - run: bun install
#       - run: bun run build
#       - uses: cloudflare/pages-action@v1
#         with:
#           apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
#           projectName: orquidia-orchestrator
#           directory: dist
# ```
#
# 3. BUILD PARCIAL LOCAL (SE NECESSÁRIO)
#    ------------------------------------
# Se absolutamente precisar build local:
#
# # Build apenas frontend (mais leve):
# cd apps/orchestrator && vite build
#
# # Ou build incremental:
# bun run vite build --mode production
#
# =============================================================================
# DEPLOYMENT RÁPIDO (SEM BUILD LOCAL)
# =============================================================================
#
# Opção A: Cloudflare Pages (Gratuito, ilimitado)
# ------------------------------------------------
# 1. Push para GitHub:
#    git add .
#    git commit -m "feat: prepare for cloudflare deploy"
#    git push origin main
#
# 2. O build acontece automaticamente no Cloudflare!
#
# Opção B: Wrangler Deploy (Build local leve)
# --------------------------------------------
# 1. Configure secrets:
#    npx wrangler secret put GEMINI_API_KEY
#
# 2. Deploy apenas worker (mais rápido que build completo):
#    npx wrangler deploy --env production --no-bundle
#
# =============================================================================
# VERIFICAÇÃO PRÉ-DEPLOY
# =============================================================================
#
# Antes de fazer deployment, verifique:
#
# 1. ✅ Secrets configurados:
#    npx wrangler secret list
#
# 2. ✅ Database schema aplicado:
#    # Via Cloudflare Dashboard > D1 > uniteia-db
#    # Ou: wrangler d1 execute uniteia-db --file=./apps/orchestrator/src/db/schema.sql
#
# 3. ✅ Variáveis de ambiente:
#    # .env.production não deve ter chaves reais!
#    # Usar secrets do Cloudflare apenas
#
# =============================================================================
# ROLLBACK PROCEDURE
# =============================================================================
#
# Se algo der errado:
#
# 1. Reverter via Git:
#    git revert HEAD
#    git push origin main
#
# 2. Ou via Cloudflare Dashboard:
#    # Pages > orquidia-orchestrator > Deployments
#    # Clique em "Rollback" no deployment anterior
#
# =============================================================================
# MONITORAMENTO PÓS-DEPLOY
# =============================================================================
#
# Verificar health:
# curl https://orchestrator.yourname.workers.dev/api/health
#
# Verificar logs:
# npx wrangler deploy --env production --test
#
# =============================================================================
# COMANDOS ÚTEIS
# =============================================================================
#
# # Setup inicial
# chmod +x scripts/setup-secrets.sh
# ./scripts/setup-secrets.sh production
#
# # Deploy (após CI/CD)
# npx wrangler pages deploy dist --project-name=orquidia-orchestrator
#
# # Verificar status
# npx wrangler pages deployment list --project-name=orquidia-orchestrator
#
# # Logs em tempo real
# npx wrangler deploy --env production --test
#
# =============================================================================
