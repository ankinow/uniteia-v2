# llm-wiki-uniteia-factory

Manual-first content factory for `llm-wiki-uniteia/<lang>/<slug>.md`.
Lives at `apps/content-factory/` inside the `uniteia-v2` monorepo, **isolated** from the Qwik app.

## Quickstart

    cd apps/content-factory
    bun install
    bun _engine/cli.ts --help

## Three recipes

### 1. From a URL

    bun _engine/cli.ts generate "OpenRouter" \
      --lang en --type platform \
      --from url --seed-urls https://openrouter.ai,https://openrouter.ai/docs
    bun _engine/cli.ts lint llm-aggregators-compared --channel all
    bun _engine/cli.ts export llm-aggregators-compared --lang en

### 2. From a prompt (vibe coding)

    bun _engine/cli.ts generate "LLM Agents" --lang en --from prompt

*(Wire your `llmFn` first — the v0 stub fails loudly; OpenRouter / Anthropic / Ollama all work.)*

### 3. From notes

    # place your notes in content/<slug>/extracts.json by hand, then:
    bun _engine/cli.ts generate "MyTopic" --lang pt --from notes

## Pipeline

    gather (fetcherFn DI)  → sources.json + extracts.json
    build  (llmFn DI)      → core.yaml + evidence binding check
    render (pure)          → blog.md + short.json + wiki.md + prompt-seed.md
    export (pure)          → llm-wiki-uniteia/<lang>/<slug>.md

## Isolation contract (critical)

- **Zero import** between `apps/content-factory/**` and `src/**` (Qwik app)
- **Not run** by the root CI of `uniteia-v2`
- The output `apps/content-factory/llm-wiki-uniteia/` is exclusive to this app
- See `DECISIONS.md` for the full ruleset and future debates

## Lint and validate

    bun _engine/cli.ts validate llm-agents-primer
    bun _engine/cli.ts lint llm-agents-primer --channel all

## Tests

    bun run factory:test
