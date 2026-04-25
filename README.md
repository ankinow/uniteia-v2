# UniTeia v2

Backend de conteúdo curado para UniTeia v2 (Content Factory).

## Start here

- `docs/agent-fullstack-context.md` - contexto operacional atual para agentes e mantenedores chegando frios

## Scaffold

- `src/` - entrada e utilitários iniciais
- `apps/content-factory/` - gerador de conteúdo isolado
- `content/` - entradas canônicas do pipeline
- `data/` - artefatos intermediários
- `runs/` - logs e auditoria local

## Security & Reliability (High-Rigor)

Este repositório opera sob regras estritas de segurança e resiliência:
- **RCE Mitigation:** A biblioteca `gray-matter` tem a execução de JavaScript (`---js`) estritamente desabilitada em todo o pipeline (`content-loader`, `slug-check`, `schema-validation`) para prevenir ataques de Prompt Injection e execução arbitrária na CI.
- **HTTP Security:** Políticas enforcing HSTS (Strict-Transport-Security), X-Frame-Options (Clickjacking) e proteções de MIME-sniffing via Cloudflare `public/_headers`.
- **Safe Cookies:** O cookie de idioma (`uniteia_lang`) opera em modo `Secure`, `HttpOnly` e `SameSite=Lax` via server actions para mitigar vetores de XSS.
- **Gate Enforcement:** Validações de `ship:check` operam com timeout e graceful termination (`SIGTERM` -> `SIGKILL`).

## Next step

O pipeline determinístico `entidade -> core.yaml -> blog.md + short.json` foi implementado via `apps/content-factory`.
