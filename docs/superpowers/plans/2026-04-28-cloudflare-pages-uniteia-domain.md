# Cloudflare Pages uniteia.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `uniteia-v2` exclusively as a Cloudflare Pages project and activate/verify the apex domain `uniteia.com`.

**Architecture:** Use Wrangler as the canonical operational interface for Pages build/deploy/verification. Wrangler currently exposes Pages project/deployment commands, but not a custom-domain add command; if a domain attach command remains unavailable after help/version checks, stop and escalate with evidence rather than inventing a command. Secrets must be supplied via environment variables only and never committed, logged, or echoed.

**Tech Stack:** Bun, Qwik City, Cloudflare Pages, Wrangler CLI, Cloudflare DNS/Pages custom domains.

---

## Safety Rules

- Never print or commit `CLOUDFLARE_API_KEY`, global token, `.env`, or `.dev.vars` values.
- Use only redacted presence checks for auth variables.
- Use Wrangler for all supported Cloudflare Pages operations.
- Do not use Dashboard or Terraform.
- Do not delete or replace existing DNS records without explicit operator ACK.
- If Wrangler lacks a custom-domain command, record the blocker and request an explicit API exception or Dashboard action.

---

## File Map

- Modify: `wrangler.toml` — Cloudflare Pages project metadata (`name`, `pages_build_output_dir`, `compatibility_date`, `account_id`).
- Modify: `package.json` — optional Pages deploy/inspect scripts for repeatable Wrangler ops.
- Create: `docs/runbooks/cloudflare-pages-uniteia-domain.md` — durable runbook for Pages deploy, domain activation, and verification.
- No source-code changes expected unless deploy verification exposes an app bug.

---

### Task 1: Normalize Cloudflare Pages Wrangler Config

**Files:**
- Modify: `wrangler.toml`
- Test: `bunx wrangler pages project list`

- [ ] **Step 1: Inspect current config**

Run:
```bash
printf 'wrangler.toml present: '; test -f wrangler.toml && echo yes || echo no
bunx wrangler --version
bunx wrangler pages project list
```
Expected: Wrangler version prints and project list includes `uniteia-v2`.

- [ ] **Step 2: Ensure `wrangler.toml` contains Pages-only config**

Expected `wrangler.toml` shape:
```toml
name = "uniteia-v2"
pages_build_output_dir = "dist"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]
account_id = "52024f99754ec4d76806e59dbd295098"

[pages_build_config]
build_command = "bun run build"
destination_dir = "dist"
```

- [ ] **Step 3: Run syntax/build validation**

Run:
```bash
bun run typecheck
bun run build
```
Expected: both exit 0.

- [ ] **Step 4: Commit config normalization**

Run:
```bash
git add wrangler.toml
git commit -m "chore(cloudflare): normalize Pages Wrangler config"
```
Expected: commit created, or no-op if already committed.

---

### Task 2: Verify Auth Without Secret Leakage

**Files:**
- No file changes
- Test: Wrangler identity and project access

- [ ] **Step 1: Export credentials in shell only**

Run manually in shell; do not paste values into files:
```bash
export CLOUDFLARE_EMAIL="<operator-email>"
export CLOUDFLARE_API_KEY="<global-api-key-or-global-token>"
export CLOUDFLARE_ACCOUNT_ID="52024f99754ec4d76806e59dbd295098"
```
Expected: env vars exist only in the process environment.

- [ ] **Step 2: Verify variable presence redacted**

Run:
```bash
env | grep '^CLOUDFLARE_' | sed 's/=.*/=<redacted>/'
```
Expected: shows names only, no secret values.

- [ ] **Step 3: Verify Wrangler identity**

Run:
```bash
bunx wrangler whoami
```
Expected: account list includes account ID `52024f99754ec4d76806e59dbd295098` and token has Pages write access.

- [ ] **Step 4: Verify Pages project access**

Run:
```bash
bunx wrangler pages project list
```
Expected: `uniteia-v2` appears.

---

### Task 3: Deploy Current Build to Cloudflare Pages

**Files:**
- Uses: `dist/`
- Test: `curl -ILs https://uniteia-v2.pages.dev/en/n/`

- [ ] **Step 1: Run pre-deploy gates**

Run:
```bash
bun run lint
bun run typecheck
bun run test:unit
bun run build
```
Expected: all exit 0.

- [ ] **Step 2: Deploy via Wrangler Pages**

Run:
```bash
bunx wrangler pages deploy dist --project-name uniteia-v2
```
Expected: deployment succeeds and prints a preview URL like `https://<hash>.uniteia-v2.pages.dev`.

- [ ] **Step 3: Verify deployment list**

Run:
```bash
bunx wrangler pages deployment list --project-name uniteia-v2
```
Expected: latest deployment appears.

- [ ] **Step 4: Smoke test Pages domain**

Run:
```bash
curl -ILs https://uniteia-v2.pages.dev/en/n/ | head -20
curl -s https://uniteia-v2.pages.dev/en/n/ | grep -o '<header[^>]*>' | wc -l
```
Expected: HTTP 200 and header count `1`.

---

### Task 4: Prove Custom Domain Support Surface in Wrangler

**Files:**
- Create: `docs/runbooks/cloudflare-pages-uniteia-domain.md`
- Test: Wrangler help output

- [ ] **Step 1: Check installed Wrangler Pages commands**

Run:
```bash
bunx wrangler pages --help
bunx wrangler pages project --help
bunx wrangler pages deployment --help
```
Expected: command list is captured; as of Wrangler 4.84/4.86, no `pages domain add` command is exposed.

- [ ] **Step 2: Try non-mutating domain command discovery only**

Run:
```bash
bunx wrangler pages domain --help || true
bunx wrangler pages domains --help || true
```
Expected: commands are unknown if unsupported.

- [ ] **Step 3: Record blocker if unsupported**

Create `docs/runbooks/cloudflare-pages-uniteia-domain.md` with:
```markdown
# Cloudflare Pages Domain Runbook — uniteia.com

## Current state
- Pages project: `uniteia-v2`
- Canonical Pages URL: `https://uniteia-v2.pages.dev`
- Target apex: `https://uniteia.com`

## Wrangler evidence
- `wrangler pages project list` works.
- `wrangler pages deploy dist --project-name uniteia-v2` works.
- `wrangler pages domain/domains` is not available in current Wrangler CLI.

## Required manual/API action
Attach `uniteia.com` as a custom domain to Pages project `uniteia-v2` using Cloudflare's supported custom-domain path. No Terraform. No dashboard drift unless explicitly chosen by operator.

## DNS target
- Apex `uniteia.com` should resolve through Cloudflare Pages custom domain setup.
- `www.uniteia.com` may be CNAME to `uniteia-v2.pages.dev` if desired.
```

- [ ] **Step 4: Commit runbook**

Run:
```bash
git add docs/runbooks/cloudflare-pages-uniteia-domain.md
git commit -m "docs(cloudflare): add Pages domain runbook for uniteia.com"
```
Expected: commit created.

---

### Task 5: Activate `uniteia.com` Domain (Only If Supported by Wrangler)

**Files:**
- No repo changes expected
- Test: DNS and HTTPS smoke

- [ ] **Step 1: Re-check latest Wrangler before mutation**

Run:
```bash
bunx wrangler@latest pages --help
bunx wrangler@latest pages project --help
```
Expected: if a custom-domain command exists, continue; otherwise stop with blocker.

- [ ] **Step 2: If Wrangler exposes a Pages domain command, attach domain**

Use the documented command from `--help` only. Example placeholder if supported:
```bash
bunx wrangler@latest pages <domain-command> <add-subcommand> uniteia.com --project-name uniteia-v2
```
Expected: Cloudflare returns success or pending DNS validation.

- [ ] **Step 3: If command is unsupported, stop**

Do not fake success. Report:
```text
BLOCKED: current Wrangler has no Pages custom-domain mutation command. Need explicit operator approval for Cloudflare API fallback or Dashboard custom-domain attach.
```

---

### Task 6: Verify DNS and Production URL

**Files:**
- No repo changes expected
- Test: `dig`, `curl`, headers, sitemap

- [ ] **Step 1: Check current DNS**

Run:
```bash
dig uniteia.com +short
dig www.uniteia.com +short
```
Expected: after activation, DNS should point to Cloudflare/Pages-managed targets, not the previous non-Pages host.

- [ ] **Step 2: Verify HTTPS response**

Run:
```bash
curl -ILs https://uniteia.com/en/n/ | head -30
```
Expected: HTTP 200 and Cloudflare response headers.

- [ ] **Step 3: Verify security headers**

Run:
```bash
curl -ILs https://uniteia.com/en/n/ | grep -Ei 'content-security-policy|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy'
```
Expected: CSP has no `unsafe-eval`; HSTS and frame/content headers present.

- [ ] **Step 4: Verify sitemap**

Run:
```bash
curl -fsSL https://uniteia.com/sitemap.xml | head -20
```
Expected: XML sitemap with `urlset` and `hreflang` entries.

- [ ] **Step 5: Verify invalid locale**

Run:
```bash
curl -ILs https://uniteia.com/xx | head -20
```
Expected: 404 after canonical trailing-slash handling.

---

### Task 7: Final Commit and Push

**Files:**
- Modify: `wrangler.toml` if not already committed
- Create/Modify: `docs/runbooks/cloudflare-pages-uniteia-domain.md`

- [ ] **Step 1: Check working tree**

Run:
```bash
git status --short
```
Expected: only intended config/runbook changes.

- [ ] **Step 2: Commit any remaining changes**

Run:
```bash
git add wrangler.toml docs/runbooks/cloudflare-pages-uniteia-domain.md
 git commit -m "chore(cloudflare): document uniteia.com Pages activation"
```
Expected: commit created, or no-op if already committed.

- [ ] **Step 3: Push**

Run:
```bash
git push origin main
```
Expected: push succeeds.

---

## Completion Criteria

- `bunx wrangler pages project list` shows `uniteia-v2`.
- `bunx wrangler pages deployment list --project-name uniteia-v2` shows a fresh deployment.
- `https://uniteia-v2.pages.dev/en/n/` returns HTTP 200.
- `https://uniteia.com/en/n/` returns HTTP 200 after custom domain activation.
- Security headers are present on `https://uniteia.com/en/n/`.
- CSP does not include `unsafe-eval`.
- No secrets are printed, committed, or added to docs.

## Known Blocker

Wrangler 4.84/4.86 exposes Pages project/deployment/secret/dev commands but does not expose a custom-domain attach command. If this remains true at execution time, `uniteia.com` cannot be fully attached using Wrangler alone. The operator must either approve Cloudflare API fallback for Pages custom-domain attach or perform the custom-domain attach outside Wrangler and record the drift.
