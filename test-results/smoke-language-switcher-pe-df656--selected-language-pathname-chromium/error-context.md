# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> language switcher persists cookie and navigates to the selected language pathname
- Location: tests/e2e/smoke.spec.ts:71:1

# Error details

```
Error: Console errors on language switch: Detected Layout Shift during page load 0.09866823289129469

expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Detected Layout Shift during page load 0.09866823289129469"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - link "Skip to main content" [ref=e3] [cursor=pointer]:
      - /url: "#main-content"
    - banner [ref=e4]:
      - navigation [ref=e6]:
        - link "Uni Teia" [ref=e7] [cursor=pointer]:
          - /url: /pt
          - generic [ref=e8]: Uni
          - generic [ref=e9]: Teia
        - generic [ref=e10]:
          - link "Início" [ref=e11] [cursor=pointer]:
            - /url: /pt
          - link "Sobre" [ref=e12] [cursor=pointer]:
            - /url: /pt/about
          - button "Tópicos Toggle topics menu" [ref=e14] [cursor=pointer]:
            - text: Tópicos
            - img "Toggle topics menu" [ref=e15]
          - link "Projetos" [ref=e17] [cursor=pointer]:
            - /url: /pt/projects
          - link "Blog" [ref=e18] [cursor=pointer]:
            - /url: /pt/blog
        - button "Idioma" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
          - generic [ref=e23]: Português
          - img [ref=e24]
    - main [ref=e26]:
      - article [ref=e27]:
        - generic [ref=e28]:
          - heading "Artigo de Teste para Verificação de Integração" [level=1] [ref=e29]
          - paragraph [ref=e30]: testes, integração, verificação
        - generic [ref=e31]:
          - 'status "Veredito: Confiável" [ref=e32]':
            - generic [ref=e34]:
              - generic [ref=e35]: Veredito
              - generic [ref=e36]: Confiável
          - 'img "Pontuação de Qualidade: 92/100 — Qualidade Editorial" [ref=e37]':
            - generic [ref=e38]:
              - img [ref=e39]
              - generic [ref=e42]: "92"
        - generic [ref=e43]:
          - generic "Assuntos" [ref=e44]:
            - generic [ref=e45]: Assuntos
            - generic [ref=e46]: testes
            - generic [ref=e47]: integração
            - generic [ref=e48]: verificação
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: Publicado
              - time [ref=e53]: 2025-01-15T10:00:00Z
            - generic [ref=e54]:
              - generic [ref=e55]: Atualizado
              - time [ref=e56]: 2025-01-20T14:30:00Z
            - generic [ref=e58]: por Sistema UniTeia
            - generic [ref=e60]: v1
          - generic [ref=e61]:
            - generic [ref=e62]: Ler em PT
            - generic [ref=e63]: PT
        - generic [ref=e64]:
          - paragraph [ref=e65]: Este é um artigo de teste criado para verificar o pipeline de renderização de conteúdo do UniTeia v2. Ele serve como um fixture para testes de integração do routeLoader$, validação de schema e renderização de componentes.
          - heading "Propósito" [level=2] [ref=e66]
          - paragraph [ref=e67]: "O propósito principal deste artigo é exercitar o pipeline completo de conteúdo:"
          - list [ref=e68]:
            - listitem [ref=e69]:
              - strong [ref=e70]: Análise de Markdown
              - text: — extração de frontmatter via gray-matter
            - listitem [ref=e71]:
              - strong [ref=e72]: Validação de Schema
              - text: — verificação de conformidade AJV Draft 2020-12
            - listitem [ref=e73]:
              - strong [ref=e74]: Validação de Slug
              - text: — segurança de URL via
              - code [ref=e75]: "`validateSlug()`"
            - listitem [ref=e76]:
              - strong [ref=e77]: Renderização de Componentes
              - text: — ArticleFrame, AdaptiveHeader, FrontmatterSlots e SourceLedger
          - heading "Requisitos de Conteúdo" [level=2] [ref=e78]
          - paragraph [ref=e79]: O schema requer um mínimo de 100 caracteres de conteúdo. Este parágrafo e o texto circundante garantem que excedemos confortavelmente esse limite enquanto fornecemos cobertura de teste significativa para o pipeline de renderização.
          - heading "Detalhes Técnicos" [level=2] [ref=e80]
          - paragraph [ref=e81]:
            - text: O routeLoader$ lê este arquivo do diretório
            - code [ref=e82]: "`/llm-wiki/pt/`"
            - text: ", analisa o frontmatter YAML, valida o objeto resultante contra o schema JSON e injeta conteúdo tipado na rota Qwik-City. Qualquer falha de validação é registrada no console do servidor com o slug e detalhes do erro."
        - navigation "Fontes" [ref=e83]:
          - heading "Fontes" [level=2] [ref=e84]
          - list [ref=e85]:
            - listitem [ref=e86]:
              - link "Referência de Exemplo Um link de referência externa de amostra example.com" [ref=e87] [cursor=pointer]:
                - /url: https://example.com/pt/referencia
                - generic [ref=e88]:
                  - generic [ref=e89]: Referência de Exemplo
                  - generic [ref=e90]: Um link de referência externa de amostra
                - generic [ref=e91]: example.com
            - listitem [ref=e92]:
              - link "Documentação de Exemplo example.com" [ref=e93] [cursor=pointer]:
                - /url: https://example.com/pt/docs
                - generic [ref=e95]: Documentação de Exemplo
                - generic [ref=e96]: example.com
    - contentinfo [ref=e97]:
      - generic [ref=e101]:
        - paragraph [ref=e103]: © 2026 UniTeia. Todos os direitos reservados.
        - paragraph [ref=e105]: Feito com ♥ para IA descentralizada
        - navigation [ref=e106]:
          - link "Política de Privacidade" [ref=e107] [cursor=pointer]:
            - /url: /privacy
          - link "Termos de Serviço" [ref=e108] [cursor=pointer]:
            - /url: /terms
          - link "Código Fonte" [ref=e109] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e110]:
          - generic [ref=e111]: Language
          - generic [ref=e112]: Português
  - generic [ref=e113]: "Click-to-Source: Alt"
```

# Test source

```ts
  1   | import { type Page, expect, test } from '@playwright/test'
  2   | 
  3   | const TRACKED_ROUTES = ['/en/test-article', '/en/n', '/en/n/ai-agents'] as const
  4   | 
  5   | function collectConsoleErrors(page: Page): string[] {
  6   |   const errors: string[] = []
  7   |   page.on('console', msg => {
  8   |     if (msg.type() === 'error') {
  9   |       const text = msg.text()
  10  |       errors.push(text)
  11  |     }
  12  |   })
  13  |   return errors
  14  | }
  15  | 
  16  | async function gotoAndAssertNegotiation(page: Page, route: string, expectedLang = 'en') {
  17  |   const response = await page.goto(route)
  18  |   expect(response, `Navigation response missing for ${route}`).not.toBeNull()
  19  | 
  20  |   const headers = response?.headers() ?? {}
  21  |   expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
  22  |   expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')
  23  | 
  24  |   return response
  25  | }
  26  | 
  27  | test('tracked article route renders fixture content and negotiated headers', async ({ page }) => {
  28  |   const errors = collectConsoleErrors(page)
  29  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  30  | 
  31  |   await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
  32  |   await expect(
  33  |     page.getByRole('heading', { name: 'Test Article for Integration Verification' })
  34  |   ).toBeVisible()
  35  | 
  36  |   // Verify only one H1 exists (AdaptiveHeader)
  37  |   const h1Count = await page.locator('h1').count()
  38  |   expect(h1Count, 'Should have exactly one H1').toBe(1)
  39  | 
  40  |   await page.waitForLoadState('networkidle')
  41  |   expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
  42  | })
  43  | 
  44  | test('tracked niche landing renders negotiated headers', async ({ page }) => {
  45  |   const errors = collectConsoleErrors(page)
  46  |   await gotoAndAssertNegotiation(page, '/en/n/ai-agents')
  47  | 
  48  |   await expect(page.getByRole('heading', { name: 'AI Agents' })).toBeVisible()
  49  |   await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()
  50  | 
  51  |   await page.waitForLoadState('networkidle')
  52  |   expect(errors, `Console errors on /en/n/ai-agents: ${errors.join('; ')}`).toHaveLength(0)
  53  | })
  54  | 
  55  | test('tracked niche index renders negotiated headers', async ({ page }) => {
  56  |   const errors = collectConsoleErrors(page)
  57  |   await gotoAndAssertNegotiation(page, '/en/n')
  58  | 
  59  |   await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  60  |   await page.waitForLoadState('networkidle')
  61  |   expect(errors, `Console errors on /en/n: ${errors.join('; ')}`).toHaveLength(0)
  62  | })
  63  | 
  64  | test('404 page renders for invalid route', async ({ page }) => {
  65  |   await page.goto('/en/this-route-does-not-exist-at-all')
  66  | 
  67  |   await expect(page.locator('[data-testid="error-code"]')).toBeVisible()
  68  |   await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
  69  | })
  70  | 
  71  | test('language switcher persists cookie and navigates to the selected language pathname', async ({
  72  |   page,
  73  | }) => {
  74  |   const errors = collectConsoleErrors(page)
  75  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  76  | 
  77  |   const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  78  |   await expect(trigger).toBeVisible()
  79  |   await trigger.click()
  80  | 
  81  |   const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  82  |   await expect(dropdown).toBeVisible()
  83  | 
  84  |   const ptOption = page.locator('[data-testid="lang-option-pt"]')
  85  |   await expect(ptOption).toBeVisible()
  86  | 
  87  |   await ptOption.click()
  88  | 
  89  |   await page.waitForURL(/\/pt\/test-article\/?(?:\?.*)?$/, { timeout: 15000, waitUntil: 'domcontentloaded' })
  90  |   await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  91  |   const cookies = await page.context().cookies()
  92  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  93  | 
  94  |   await page.waitForLoadState('networkidle')
> 95  |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
      |                                                                             ^ Error: Console errors on language switch: Detected Layout Shift during page load 0.09866823289129469
  96  | })
  97  | 
  98  | for (const route of TRACKED_ROUTES) {
  99  |   test(`no console errors on ${route}`, async ({ page }) => {
  100 |     const errors = collectConsoleErrors(page)
  101 |     await gotoAndAssertNegotiation(page, route)
  102 |     await page.waitForLoadState('networkidle')
  103 |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  104 |   })
  105 | }
  106 | 
```