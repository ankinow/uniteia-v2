# llm-wiki-uniteia-factory

Manual-first content factory for UniTeia.
Produces `llm-wiki-uniteia/<lang>/<slug>.md` with high SEO/AEO fidelity.

## CLI Commands

### 1. Diagnostic
    bun _engine/cli.ts doctor

### 2. Initialization
    bun _engine/cli.ts init "my-slug" --entity "My Display Name" --lang en

### 3. Generation (Full Pipeline)
    bun _engine/cli.ts generate "LLM Agents" --lang en --type concept --provider stub

### 4. Build (LLM only)
    bun _engine/cli.ts build "llm-agents-primer" --entity "LLM Agents" --lang en --type concept --provider nvidia --model "deepseek-r1"

### 5. Check (Release Gate)
    bun _engine/cli.ts check "llm-agents-primer" --lang en

### 6. Batch Operations
    bun _engine/cli.ts batch content.plan.yaml --dry-run

### 7. Packaging
    bun _engine/cli.ts package --lang all --out deploy-ready

## Features
- **uniteia-invite-link-core/1**: Advanced schema for invite links and visual content.
- **i18n Headings**: Automatic translation for 5 languages (en, pt, es, ja, zh).
- **SEO Max**: Automatic Hreflang cluster and JSON-LD (Article/Product/Review).
- **Hardened Linter**: Strict evidence requirements for numbers/dates/superlatives.
- **Provider Support**: Stub (offline) and NVIDIA NIM (OpenAI-compatible).

## Setup
1. `cp .env.example .env`
2. Configure `NVIDIA_API_KEY`
3. `bun install`
