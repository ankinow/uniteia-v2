import matter from 'gray-matter'
import { marked } from 'marked'
import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'

// INLINE CONTENT REGISTRY — auto-generated. Run `bun run generate:content-registry`.
export const contentRegistry: Record<string, string> = JSON.parse(
  '{"./content/ai-agents/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"AI Agents\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.891Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.891Z\\"\\n---\\n\\n# AI Agents\\n\\nAutonomous AI agents and frameworks\\nThis is a comprehensive knowledge hub for AI Agents. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/en/llm-aggregators-compared.md":"---\\nslug: llm-aggregators-compared\\nlang: en\\ntitle: LLM Aggregators Compared\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - llm\\n  - aggregators\\n  - ai-agents\\nreferral_links:\\n  - url: https://openrouter.ai/\\n    title: OpenRouter\\n    description: Unified API for top LLMs\\nmetadata:\\n  created_at: \\"2026-04-24T21:15:00Z\\"\\n  updated_at: \\"2026-04-24T21:15:00Z\\"\\n  author: Antigravity\\n  version: 1\\n---\\n\\n# LLM Aggregators Compared\\n\\nA comprehensive look at current LLM aggregators and how they facilitate multi-model workflows.\\n\\n## Overview\\n\\nIn the rapidly evolving AI landscape, aggregators provide a single point of access to multiple large language models. This simplifies development and allows for easier comparison between different providers.\\n\\n## Key Players\\n\\n1. **OpenRouter**: Excellent for API-driven workflows.\\n2. **Poe**: Great for consumer-facing interaction.\\n3. **Vercel AI SDK**: A robust library for integrating diverse models.\\n\\nThis article serves as a foundation for testing the new content pipeline in Milestone M002.\\n","./content/ai-agents/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"Agentes de IA\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# Agentes de IA\\n\\nAgentes de IA autónomos y frameworks\\nThis is a comprehensive knowledge hub for Agentes de IA. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"AIエージェント\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# AIエージェント\\n\\n自律型AIエージェントとフレームワーク\\nThis is a comprehensive knowledge hub for AIエージェント. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"Agentes de IA\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.891Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.891Z\\"\\n---\\n\\n# Agentes de IA\\n\\nAgentes de IA autônomos e frameworks\\nThis is a comprehensive knowledge hub for Agentes de IA. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/pt/em-construcao.md":"---\\nslug: em-construcao\\nlang: pt\\ntitle: Em Construção\\nverdict: trusted\\nquality_score: 0\\nsubjects:\\n  - em-construcao\\nreferral_links: []\\nmetadata:\\n  created_at: \\"2026-04-29T00:00:00Z\\"\\n  updated_at: \\"2026-04-29T00:00:00Z\\"\\n  author: UniTeia\\n  version: 1\\n---\\n\\n# Em Construção\\n\\nEsta página está atualmente em desenvolvimento. Estamos trabalhando para trazer conteúdo de alta qualidade sobre este tópico em português. \\n\\nPor favor, consulte a versão em inglês ou verifique novamente em breve. Nossa equipe está dedicada a fornecer as melhores informações sobre agentes de IA, modelos de linguagem e engenharia de prompts.\\n\\nObrigado pela paciência!\\n","./content/ai-agents/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"AI 代理\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# AI 代理\\n\\n自主 AI 代理和框架\\nThis is a comprehensive knowledge hub for AI 代理. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nUniversal AI Knowledge Network\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/en/test-admin.md":"---\\nslug: test-admin\\nlang: en\\ntitle: Admin Test Article\\nsubjects:\\n  - testing\\nreferral_links: []\\nmetadata:\\n  created_at: \'2025-01-15T10:00:00Z\'\\n  updated_at: \'2025-01-20T14:30:00Z\'\\n  author: Test\\n  version: 1\\nverdict: trusted\\nquality_score: 85\\n---\\nThis is a test article with a banned slug term in the parameter. The content must exceed one hundred\\ncharacters to pass the loader\'s content checks and remain a tracked fixture for the slug-validation\\nnegative test. It gives the suite a real, bundle-visible markdown file to validate against.\\n","./content/apex/en/test-article.md":"---\\nslug: test-article\\nlang: en\\ntitle: Test Article for Integration Verification\\nverdict: trusted\\nquality_score: 92\\nsubjects:\\n  - testing\\n  - integration\\n  - verification\\nreferral_links:\\n  - url: https://example.com/reference\\n    title: Example Reference\\n    description: A sample external reference link\\n  - url: https://example.com/docs\\n    title: Example Documentation\\nmetadata:\\n  created_at: \\"2025-01-15T10:00:00Z\\"\\n  updated_at: \\"2025-01-20T14:30:00Z\\"\\n  author: UniTeia System\\n  version: 1\\n---\\n\\n# Test Article for Integration Verification\\n\\nThis is a test article created to verify the content rendering pipeline of UniTeia v2. It serves as a fixture for integration testing of the routeLoader$, schema validation, and component rendering.\\n\\n## Purpose\\n\\nThe primary purpose of this article is to exercise the full content pipeline:\\n\\n1. **Markdown parsing** — frontmatter extraction via gray-matter\\n2. **Schema validation** — AJV Draft 2020-12 compliance check\\n3. **Slug validation** — URL safety via `validateSlug()`\\n4. **Component rendering** — ArticleFrame, AdaptiveHeader, FrontmatterSlots, and SourceLedger\\n\\n## Content Requirements\\n\\nThe schema requires a minimum of 100 characters of content. This paragraph and the surrounding text ensure we comfortably exceed that threshold while providing meaningful test coverage for the rendering pipeline.\\n\\n## Technical Details\\n\\nThe routeLoader$ reads this file from the `/llm-wiki/en/` directory, parses the YAML frontmatter, validates the resulting object against the JSON schema, and injects typed content into the Qwik-City route. Any validation failure is logged to the server console with the slug and error details.\\n","./content/apex/en/test-invalid-schema.md":"---\\nslug: test-invalid-schema\\nlang: en\\ntitle: Missing Schema Fields Fixture\\n---\\nThis article intentionally omits required frontmatter fields such as subjects and referral_links.\\nRuntime schema validation IS enforced — validateContent() and validateMarkdownFrontmatter() will\\nreject this fixture. It exists solely to verify that the build-time content:check gate and unit\\ntests correctly detect invalid frontmatter schemas. The content:check script intentionally skips\\nthis file (and other test fixtures) so the production gate passes while still allowing the fixture\\nto exist for testing purposes.\\n","./content/apex/en/test-xss.md":"---\\ntitle: Malicious Article\\nslug: test-xss\\nlang: en\\nsubjects: [security]\\nreferral_links: []\\n---\\n\\n# Malicious Content\\n\\n<script>alert(\'xss\')</script>\\n\\nThis is a test article designed to verify that the markdown renderer correctly sanitizes\\nmalicious HTML tags and other potentially dangerous content. We need to ensure that the\\nrendered output does not execute any scripts and instead encodes the tags safely.\\nThis paragraph exists to satisfy the minimum character count requirement of 100 characters\\nfor the content field in our strict schema validation.\\n\\n","./content/apex/en/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: en\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.255Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.255Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cheap Cloud for Builders\\n\\n## What is the Tencent Cloud Deal Stack?\\n\\nTencent Cloud offers a range of products and promotions ideal for independent builders. With Lighthouse, CVM, and EdgeOne, you can host sites, APIs, bots, dashboards, and small apps spending very little — in some cases, nothing.\\n\\n![Visual Brief — Tencent Cloud Deal Stack](/assets/wiki/tencent-cloud-deal-stack-builders/visual-brief.svg)\\n\\n## Free Products\\n\\nTencent Cloud provides a free tier with select products. Free resources include:\\n\\n- **EdgeOne:** Up to 1M requests/month on the free plan\\n- **Lighthouse:** Trial period on basic configurations\\n- **CVM:** Promotional offers for new users\\n\\n> ⚠️ **Note:** Free products may require credit card registration. Check official terms.\\n\\n## Lighthouse — Simplicity That Works\\n\\nLighthouse is a simplified VPS, ideal for those who don\'t want to manage complex infrastructure.\\n\\n**When to use:**\\n- Static sites or blogs\\n- Lightweight APIs\\n- Bots and automation\\n- Dev environments\\n- Personal dashboards\\n\\n**Pros:**\\n- Fixed specs, no surprises\\n- Simplified dashboard\\n- Firewall and monitoring included\\n- Cheaper than equivalent CVM\\n- Monthly or hourly billing\\n\\n## CVM — Full Power\\n\\nCVM (Cloud Virtual Machine) is the complete solution for those needing full control.\\n\\n**When to use:**\\n- CPU/RAM-intensive applications\\n- Kubernetes or advanced Docker\\n- Custom kernel or network tuning\\n- Large databases\\n- Environments needing VPC and security groups\\n\\n**Pros:**\\n- Fully customizable configuration\\n- Dedicated, spot, and reserved instances\\n- Additional block storage\\n- Per-second billing (1-hour minimum)\\n- BYOL support\\n\\n## EdgeOne — CDN + Security\\n\\nEdgeOne combines CDN with WAF, DDoS protection, and bot management in one platform.\\n\\n**When to use:**\\n- Accelerate global content delivery\\n- Protect sites against attacks\\n- Replace separate CDN + WAF\\n- Reduce latency for international users\\n\\n**Pros:**\\n- Generous free tier (1M req/month)\\n- Pay-as-you-go\\n- Global edge network\\n- Native integration with Lighthouse and CVM\\n- No complex licensing\\n\\n## How to Combine Products\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Best for | Sites, blogs, landing pages | Dynamic apps, APIs, e-commerce |\\n| Performance | Great for static content | Maximum flexibility |\\n| Cost | Lowest | Moderate |\\n| Setup | Minutes | Hours |\\n\\n## Before You Pay — Checklist\\n\\n1. **Check region:** Not all promos are available in all regions\\n2. **Eligibility:** Some offers are new users only\\n3. **Validity:** Promotions expire — check the date\\n4. **Renewal:** Promo price may not apply on renewal\\n5. **Coupons:** Read terms before activating — some require minimum spend\\n6. **Free tier:** Confirm whether credit card is required\\n\\n## Recommended Setup for Builders\\n\\n### Site/Blog\\nLighthouse (basic) + EdgeOne (free tier)\\n\\n### Lightweight API\\nLighthouse (mid plan) + EdgeOne (free tier)\\n\\n### Bot / Discord Bot\\nLighthouse (basic) + EdgeOne (free tier)\\n\\n### Dashboard / Analytics\\nLighthouse (mid plan) + EdgeOne (pay-as-you-go)\\n\\n### Full Application\\nCVM (spot instance) + EdgeOne (pay-as-you-go)\\n\\n> **Disclaimer:** Prices and promotions are subject to change. Always check the official Tencent Cloud website for up-to-date information. This guide is educational and does not substitute official terms.\\n","./content/apex/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nRed Universal de Conocimiento en IA\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/es/test-article.md":"---\\nslug: test-article\\nlang: es\\ntitle: Artículo de Prueba para Verificación de Integración\\nverdict: trusted\\nquality_score: 92\\nsubjects:\\n  - pruebas\\n  - integración\\n  - verificación\\nreferral_links:\\n  - url: https://example.com/es/referencia\\n    title: Referencia de Ejemplo\\n    description: Un enlace de referencia externa de muestra\\n  - url: https://example.com/es/docs\\n    title: Documentación de Ejemplo\\nmetadata:\\n  created_at: \\"2025-01-15T10:00:00Z\\"\\n  updated_at: \\"2025-01-20T14:30:00Z\\"\\n  author: Sistema UniTeia\\n  version: 1\\n---\\n\\n# Artículo de Prueba para Verificación de Integración\\n\\nEste es un artículo de prueba creado para verificar el pipeline de renderización de contenido de UniTeia v2. Sirve como fixture para pruebas de integración del routeLoader$, validación de esquema y renderización de componentes.\\n\\n## Propósito\\n\\nEl propósito principal de este artículo es ejercitar el pipeline completo de contenido:\\n\\n1. **Análisis de Markdown** — extracción de frontmatter vía gray-matter\\n2. **Validación de esquema** — verificación de conformidad AJV Draft 2020-12\\n3. **Validación de slug** — seguridad de URL vía `validateSlug()`\\n4. **Renderización de componentes** — ArticleFrame, AdaptiveHeader, FrontmatterSlots y SourceLedger\\n\\n## Requisitos de Contenido\\n\\nEl esquema requiere un mínimo de 100 caracteres de contenido. Este párrafo y el texto circundante garantizan que superamos cómodamente ese umbral mientras proporcionamos cobertura de prueba significativa para el pipeline de renderización.\\n\\n## Detalles Técnicos\\n\\nEl routeLoader$ lee este archivo del directorio `/llm-wiki/es/`, analiza el frontmatter YAML, valida el objeto resultante contra el esquema JSON e inyecta contenido tipado en la ruta Qwik-City. Cualquier fallo de validación se registra en la consola del servidor con el slug y los detalles del error.\\n","./content/apex/es/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: es\\ntitle: \\"Tencent Cloud Deal Stack para Creadores\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.258Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.259Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Barata para Builders\\n\\n## ¿Qué es Tencent Cloud Deal Stack?\\n\\nTencent Cloud ofrece una gama de productos y promociones ideales para builders independientes. Con Lighthouse, CVM y EdgeOne, puedes alojar sitios web, APIs, bots, dashboards y aplicaciones pequeñas gastando muy poco — en algunos casos, nada.\\n\\n## Productos Gratuitos\\n\\nTencent Cloud dispone de un nivel gratuito con productos seleccionados. Los recursos gratuitos incluyen:\\n\\n- **EdgeOne:** Hasta 1M de peticiones/mes en el plan gratuito\\n- **Lighthouse:** Período de prueba en configuraciones básicas\\n- **CVM:** Ofertas promocionales para nuevos usuarios\\n\\n> ⚠️ **Nota:** Los productos gratuitos pueden requerir registro con tarjeta de crédito. Consulta los términos oficiales.\\n\\n## Lighthouse — Simplicidad que Funciona\\n\\nLighthouse es un VPS simplificado, ideal para quienes no quieren gestionar infraestructura compleja.\\n\\n**Cuándo usarlo:**\\n- Sitios estáticos o blogs\\n- APIs ligeras\\n- Bots y automatización\\n- Entornos de desarrollo\\n- Dashboards personales\\n\\n**Ventajas:**\\n- Especificaciones fijas, sin sorpresas\\n- Panel simplificado\\n- Firewall y monitoreo incluidos\\n- Más barato que un CVM equivalente\\n- Facturación mensual o por hora\\n\\n## CVM — Potencia Completa\\n\\nCVM (Cloud Virtual Machine) es la solución completa para quienes necesitan control total.\\n\\n**Cuándo usarlo:**\\n- Aplicaciones con uso intensivo de CPU/RAM\\n- Kubernetes o Docker avanzado\\n- Ajustes personalizados de kernel o red\\n- Bases de datos grandes\\n- Entornos que requieren VPC y grupos de seguridad\\n\\n**Ventajas:**\\n- Configuración totalmente personalizable\\n- Instancias dedicadas, spot y reservadas\\n- Almacenamiento en bloque adicional\\n- Facturación por segundo (mínimo 1 hora)\\n- Soporte BYOL\\n\\n## EdgeOne — CDN + Seguridad\\n\\nEdgeOne combina CDN con WAF, protección DDoS y gestión de bots en una sola plataforma.\\n\\n**Cuándo usarlo:**\\n- Acelerar la entrega de contenido global\\n- Proteger sitios contra ataques\\n- Reemplazar CDN + WAF separados\\n- Reducir latencia para usuarios internacionales\\n\\n**Ventajas:**\\n- Nivel gratuito generoso (1M peticiones/mes)\\n- Pago por uso\\n- Red perimetral global\\n- Integración nativa con Lighthouse y CVM\\n- Sin licencias complejas\\n\\n## Cómo Combinar Productos\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Ideal para | Sitios, blogs, landing pages | Apps dinámicas, APIs, e-commerce |\\n| Rendimiento | Excelente para contenido estático | Máxima flexibilidad |\\n| Costo | Más bajo | Moderado |\\n| Configuración | Minutos | Horas |\\n\\n## Antes de Pagar — Lista de Verificación\\n\\n1. **Verifica la región:** No todas las promos están disponibles en todas las regiones\\n2. **Elegibilidad:** Algunas ofertas son solo para nuevos usuarios\\n3. **Vigencia:** Las promociones caducan — revisa la fecha\\n4. **Renovación:** El precio promocional puede no aplicarse en la renovación\\n5. **Cupones:** Lee los términos antes de activar — algunos requieren un gasto mínimo\\n6. **Nivel gratuito:** Confirma si se requiere tarjeta de crédito\\n\\n## Configuración Recomendada para Creadores\\n\\n### Sitio / Blog\\nLighthouse (básico) + EdgeOne (nivel gratuito)\\n\\n### API Ligera\\nLighthouse (plan medio) + EdgeOne (nivel gratuito)\\n\\n### Bot / Bot de Discord\\nLighthouse (básico) + EdgeOne (nivel gratuito)\\n\\n### Dashboard / Analíticas\\nLighthouse (plan medio) + EdgeOne (pago por uso)\\n\\n### Aplicación Completa\\nCVM (instancia spot) + EdgeOne (pago por uso)\\n\\n> **Aviso:** Los precios y promociones están sujetos a cambios. Verifica siempre el sitio oficial de Tencent Cloud para obtener información actualizada. Esta guía es educativa y no sustituye los términos oficiales.\\n","./content/apex/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nユニバーサルAIナレッジネットワーク\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/ja/test-article.md":"---\\nslug: test-article\\nlang: ja\\ntitle: 統合検証用テスト記事\\nverdict: trusted\\nquality_score: 92\\nsubjects:\\n  - テスト\\n  - 統合\\n  - 検証\\nreferral_links:\\n  - url: https://example.com/ja/reference\\n    title: サンプル参照リンク\\n    description: 外部参照リンクのサンプル\\n  - url: https://example.com/ja/docs\\n    title: サンプルドキュメント\\nmetadata:\\n  created_at: \\"2025-01-15T10:00:00Z\\"\\n  updated_at: \\"2025-01-20T14:30:00Z\\"\\n  author: UniTeiaシステム\\n  version: 1\\n---\\n\\n# 統合検証用テスト記事\\n\\nこれはUniTeia v2のコンテンツレンダリングパイプラインを検証するために作成されたテスト記事です。routeLoader$の統合テスト、スキーマ検証、およびコンポーネントレンダリングのフィクスチャとして機能します。\\n\\n## 目的\\n\\nこの記事の主な目的は、コンテンツパイプライン全体を実行することです：\\n\\n1. **Markdown解析** — gray-matterによるfrontmatter抽出\\n2. **スキーマ検証** — AJV Draft 2020-12準拠チェック\\n3. **スラッグ検証** — `validateSlug()`によるURL安全性の確認\\n4. **コンポーネントレンダリング** — ArticleFrame、AdaptiveHeader、FrontmatterSlots、SourceLedger\\n\\n## コンテンツ要件\\n\\nスキーマは100文字以上のコンテンツを要求します。この段落と周囲のテキストにより、レンダリングパイプラインの有意なテストカバレッジを提供しながら、この閾値を余裕をもって超えることを保証します。\\n\\n## 技術的詳細\\n\\nrouteLoader$は`/llm-wiki/ja/`ディレクトリからこのファイルを読み取り、YAML frontmatterを解析し、結果のオブジェクトをJSONスキーマに対して検証し、型付きコンテンツをQwik-Cityルートに注入します。検証の失敗は、スラッグとエラーの詳細とともにサーバーコンソールに記録されます。\\n","./content/apex/ja/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: ja\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.264Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.264Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack：ビルダーのための格安クラウド\\n\\n## Tencent Cloud Deal Stackとは？\\n\\nTencent Cloudは、独立したビルダーに最適な製品とプロモーションを提供しています。Lighthouse、CVM、EdgeOneを使えば、サイト、API、ボット、ダッシュボード、小規模アプリケーションをわずかなコストで運用できます。場合によっては完全に無料で始められます。\\n\\n## 無料製品\\n\\nTencent Cloudは、厳選された製品の無料ティアを提供しています。無料リソースは以下の通りです：\\n\\n- **EdgeOne：** 無料プランで月間最大100万リクエスト\\n- **Lighthouse：** 基本構成のトライアル期間\\n- **CVM：** 新規ユーザー向けプロモーション\\n\\n> ⚠️ **注意：** 無料製品をご利用いただくには、クレジットカードの登録が必要な場合があります。公式利用規約をご確認ください。\\n\\n## Lighthouse — シンプルさが鍵\\n\\nLighthouseは簡略化されたVPSで、複雑なインフラを管理したくない方に最適です。\\n\\n**使用すべきケース：**\\n- 静的サイトやブログ\\n- 軽量API\\n- ボットと自動化\\n- 開発環境\\n- 個人用ダッシュボード\\n\\n**メリット：**\\n- 仕様固定、驚きなし\\n- 簡略化されたダッシュボード\\n- ファイアウォールとモニタリング付属\\n- 同等のCVMより低コスト\\n- 月額または時間単位の請求\\n\\n## CVM — フルパワー\\n\\nCVM（Cloud Virtual Machine）は、完全な制御を必要とする方のための本格的なソリューションです。\\n\\n**使用すべきケース：**\\n- CPU/RAM集中型アプリケーション\\n- Kubernetesまたは高度なDocker\\n- カスタムカーネルやネットワーク調整\\n- 大規模データベース\\n- VPCとセキュリティグループが必要な環境\\n\\n**メリット：**\\n- 完全にカスタマイズ可能な構成\\n- 専用インスタンス、スポットインスタンス、リザーブドインスタンス\\n- 追加ブロックストレージ\\n- 秒単位の課金（最低1時間）\\n- BYOLサポート\\n\\n## EdgeOne — CDN + セキュリティ\\n\\nEdgeOneは、CDN、WAF、DDoS対策、ボット管理を一つのプラットフォームに統合します。\\n\\n**使用すべきケース：**\\n- グローバルなコンテンツ配信の高速化\\n- 攻撃からサイトを保護\\n- 個別のCDN + WAFを置き換え\\n- 国際ユーザーのレイテンシー低減\\n\\n**メリット：**\\n- 充実した無料ティア（月間100万リクエスト）\\n- 従量課金制\\n- グローバルエッジネットワーク\\n- LighthouseおよびCVMとのネイティブ統合\\n- 複雑なライセンス不要\\n\\n## 製品の組み合わせ方\\n\\n| スタック | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|---------|---------------------|---------------|\\n| 最適な用途 | サイト、ブログ、ランディングページ | 動的アプリ、API、Eコマース |\\n| パフォーマンス | 静的コンテンツに最適 | 最大の柔軟性 |\\n| コスト | 最も低い | 中程度 |\\n| セットアップ | 数分 | 数時間 |\\n\\n## 支払い前のチェックリスト\\n\\n1. **リージョンを確認：** すべてのプロモーションが全リージョンで利用できるわけではありません\\n2. **対象条件：** 一部のオファーは新規ユーザーのみ対象です\\n3. **有効期限：** プロモーションには期限があります — 日付を確認してください\\n4. **更新：** プロモーション価格が更新時に適用されない場合があります\\n5. **クーポン：** 有効化前に利用規約を読んでください — 最低支出額が必要な場合があります\\n6. **無料ティア：** クレジットカードが必要かどうかを確認してください\\n\\n## ビルダーのための推奨構成\\n\\n### サイト／ブログ\\nLighthouse（基本）+ EdgeOne（無料ティア）\\n\\n### 軽量API\\nLighthouse（ミッドプラン）+ EdgeOne（無料ティア）\\n\\n### ボット／Discordボット\\nLighthouse（基本）+ EdgeOne（無料ティア）\\n\\n### ダッシュボード／分析\\nLighthouse（ミッドプラン）+ EdgeOne（従量課金）\\n\\n### 本格的なアプリケーション\\nCVM（スポットインスタンス）+ EdgeOne（従量課金）\\n\\n> **免責事項：** 価格とプロモーションは変更される場合があります。最新情報はTencent Cloud公式サイトをご確認ください。このガイドは教育目的であり、公式利用規約に代わるものではありません。\\n","./content/apex/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nRede Universal de Conhecimento em IA\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/pt/test-article.md":"---\\nslug: test-article\\nlang: pt\\ntitle: Artigo de Teste para Verificação de Integração\\nverdict: trusted\\nquality_score: 92\\nsubjects:\\n  - testes\\n  - integração\\n  - verificação\\nreferral_links:\\n  - url: https://example.com/pt/referencia\\n    title: Referência de Exemplo\\n    description: Um link de referência externa de amostra\\n  - url: https://example.com/pt/docs\\n    title: Documentação de Exemplo\\nmetadata:\\n  created_at: \\"2025-01-15T10:00:00Z\\"\\n  updated_at: \\"2025-01-20T14:30:00Z\\"\\n  author: Sistema UniTeia\\n  version: 1\\n---\\n\\n# Artigo de Teste para Verificação de Integração\\n\\nEste é um artigo de teste criado para verificar o pipeline de renderização de conteúdo do UniTeia v2. Ele serve como um fixture para testes de integração do routeLoader$, validação de schema e renderização de componentes.\\n\\n## Propósito\\n\\nO propósito principal deste artigo é exercitar o pipeline completo de conteúdo:\\n\\n1. **Análise de Markdown** — extração de frontmatter via gray-matter\\n2. **Validação de Schema** — verificação de conformidade AJV Draft 2020-12\\n3. **Validação de Slug** — segurança de URL via `validateSlug()`\\n4. **Renderização de Componentes** — ArticleFrame, AdaptiveHeader, FrontmatterSlots e SourceLedger\\n\\n## Requisitos de Conteúdo\\n\\nO schema requer um mínimo de 100 caracteres de conteúdo. Este parágrafo e o texto circundante garantem que excedemos confortavelmente esse limite enquanto fornecemos cobertura de teste significativa para o pipeline de renderização.\\n\\n## Detalhes Técnicos\\n\\nO routeLoader$ lê este arquivo do diretório `/llm-wiki/pt/`, analisa o frontmatter YAML, valida o objeto resultante contra o schema JSON e injeta conteúdo tipado na rota Qwik-City. Qualquer falha de validação é registrada no console do servidor com o slug e detalhes do erro.\\n","./content/apex/pt/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: pt\\ntitle: \\"Tencent Cloud Deal Stack: Cloud Barata para Builders\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.250Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.250Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Barata para Builders\\n\\n## O que é a Tencent Cloud Deal Stack?\\n\\nA Tencent Cloud oferece um conjunto de produtos e promoções ideais para builders independentes. Com Lighthouse, CVM e EdgeOne, é possível subir sites, APIs, bots, dashboards e pequenos apps gastando muito pouco — e em alguns casos, nada.\\n\\n![Brief Visual — Tencent Cloud Deal Stack](/assets/wiki/tencent-cloud-deal-stack-builders/visual-brief.svg)\\n\\n## Produtos Gratuitos\\n\\nA Tencent Cloud disponibiliza um free-tier com produtos selecionados. Alguns recursos gratuitos incluem:\\n\\n- EdgeOne: até 1M requisições/mês no plano gratuito\\n- Lighthouse: período trial em configurações básicas\\n- CVM: ofertas promocionais para novos usuários\\n\\n> ⚠️ **Atenção:** Produtos gratuitos podem exigir cadastro com cartão de crédito. Verifique os termos no site oficial.\\n\\n## Lighthouse — Simplicidade que Roda\\n\\nO Lighthouse é um VPS simplificado, ideal para quem não quer gerenciar infraestrutura complexa.\\n\\n**Quando usar:**\\n- Sites estáticos ou blogs\\n- APIs leves\\n- Bots e automações\\n- Ambientes de desenvolvimento\\n- Dashboards pessoais\\n\\n**Vantagens:**\\n- Especificações fixas, sem surpresas\\n- Painel simplificado\\n- Firewall e monitoramento inclusos\\n- Mais barato que CVM equivalente\\n- Billing mensal ou por hora\\n\\n## CVM — Poder Total\\n\\nCVM (Cloud Virtual Machine) é a solução completa para quem precisa de controle total.\\n\\n**Quando usar:**\\n- Aplicações que exigem muito CPU/RAM\\n- Kubernetes ou Docker avançado\\n- Kernel customizado ou tuning de rede\\n- Bancos de dados grandes\\n- Ambientes que precisam de VPC e security groups\\n\\n**Vantagens:**\\n- Configuração totalmente customizável\\n- Instâncias dedicadas, spot e reservadas\\n- Discos adicionais (block storage)\\n- Billing por segundo (mínimo 1 hora)\\n- Suporte a BYOL\\n\\n## EdgeOne — CDN + Segurança\\n\\nEdgeOne combina CDN com WAF, proteção DDoS e bot management numa plataforma só.\\n\\n**Quando usar:**\\n- Acelerar conteúdo global\\n- Proteger sites contra ataques\\n- Substituir CDN + WAF separados\\n- Reduzir latência para usuários internacionais\\n\\n**Vantagens:**\\n- Free-tier generoso (1M req/mês)\\n- Pay-as-you-go\\n- Rede global de edge\\n- Integração nativa com Lighthouse e CVM\\n- Sem licenciamento complexo\\n\\n## Como Combinar os Produtos\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Ideal para | Sites, blogs, landing pages | Apps dinâmicos, APIs, e-commerce |\\n| Performance | Ótima para conteúdo estático | Máxima flexibilidade |\\n| Custo | Mais baixo | Moderado |\\n| Setup | Minutos | Horas |\\n\\n## Cuidados Antes de Pagar\\n\\n1. **Verifique a região:** Nem todas as promoções estão disponíveis em todas as regiões\\n2. **Elegibilidade:** Algumas ofertas são apenas para novos usuários\\n3. **Validade:** Promoções expiram — confira a data\\n4. **Renovação:** O preço promocional pode não se aplicar na renovação\\n5. **Cupons:** Leia os termos antes de ativar — alguns exigem mínimo de gasto\\n6. **Free-tier:** Confirme se exige cartão de crédito no cadastro\\n\\n## Setup Recomendado para Builders\\n\\n### Site/Blog\\nLighthouse (plano básico) + EdgeOne (free-tier)\\n\\n### API Leve\\nLighthouse (plano médio) + EdgeOne (free-tier)\\n\\n### Bot/Discord Bot\\nLighthouse (plano básico) + EdgeOne (free-tier)\\n\\n### Dashboard/Analytics\\nLighthouse (plano médio) + EdgeOne (pago conforme uso)\\n\\n### Aplicação Completa\\nCVM (spot instance) + EdgeOne (pago)\\n\\n> **Disclaimer:** Preços e promoções estão sujeitos a alteração. Verifique sempre o site oficial da Tencent Cloud para informações atualizadas. Este guia tem caráter educativo e não substitui a consulta aos termos oficiais.\\n","./content/apex/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\n通用人工智能知识网络\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/zh/test-article.md":"---\\nslug: test-article\\nlang: zh\\ntitle: 集成验证测试文章\\nverdict: trusted\\nquality_score: 92\\nsubjects:\\n  - 测试\\n  - 集成\\n  - 验证\\nreferral_links:\\n  - url: https://example.com/zh/reference\\n    title: 示例参考链接\\n    description: 外部参考链接样本\\n  - url: https://example.com/zh/docs\\n    title: 示例文档\\nmetadata:\\n  created_at: \\"2025-01-15T10:00:00Z\\"\\n  updated_at: \\"2025-01-20T14:30:00Z\\"\\n  author: UniTeia系统\\n  version: 1\\n---\\n\\n# 集成验证测试文章\\n\\n这是一篇为验证UniTeia v2内容渲染管道而创建的测试文章。它作为routeLoader$集成测试、模式验证和组件渲染的固定装置。\\n\\n## 目的\\n\\n本文的主要目的是执行完整的内容管道：\\n\\n1. **Markdown解析** — 通过gray-matter提取frontmatter\\n2. **模式验证** — AJV Draft 2020-12合规性检查\\n3. **Slug验证** — 通过`validateSlug()`确保URL安全性\\n4. **组件渲染** — ArticleFrame、AdaptiveHeader、FrontmatterSlots和SourceLedger\\n\\n## 内容要求\\n\\n模式要求最少100个字符的内容。本段落及周围文本确保我们轻松超过该阈值，同时为渲染管道提供有意义的测试覆盖率。\\n\\n## 技术细节\\n\\nrouteLoader$从`/llm-wiki/zh/`目录读取此文件，解析YAML frontmatter，根据JSON模式验证结果对象，并将类型化内容注入Qwik-City路由。任何验证失败都会连同slug和错误详情一起记录到服务器控制台。\\n","./content/apex/zh/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: zh\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.265Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.265Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack：面向开发者的低价云服务\\n\\n## 什么是Tencent Cloud Deal Stack？\\n\\n腾讯云提供一系列适合独立开发者的产品和促销活动。通过Lighthouse、CVM和EdgeOne，您可以以极低的成本托管网站、API、机器人、仪表盘和小型应用程序——在某些情况下甚至可以完全免费。\\n\\n## 免费产品\\n\\n腾讯云提供精选产品的免费套餐。免费资源包括：\\n\\n- **EdgeOne：** 免费计划每月最多100万次请求\\n- **Lighthouse：** 基础配置的试用期\\n- **CVM：** 新用户促销优惠\\n\\n> ⚠️ **注意：** 免费产品可能需要注册信用卡。请查看官方条款。\\n\\n## Lighthouse — 简便可用的云服务器\\n\\nLighthouse 是一款轻量级云服务器，非常适合不想管理复杂基础设施的用户。\\n\\n**适用场景：**\\n- 静态网站或博客\\n- 轻量级API\\n- 机器人和自动化\\n- 开发环境\\n- 个人仪表盘\\n\\n**优势：**\\n- 配置固定，无意外费用\\n- 简化的管理面板\\n- 内置防火墙和监控\\n- 比同等配置的CVM更便宜\\n- 按月或按小时计费\\n\\n## CVM — 完整性能\\n\\nCVM（云虚拟机）是为需要完全控制的用户提供的完整解决方案。\\n\\n**适用场景：**\\n- CPU/内存密集型应用\\n- Kubernetes或高级Docker\\n- 自定义内核或网络调优\\n- 大型数据库\\n- 需要VPC和安全组的環境\\n\\n**优势：**\\n- 完全可自定义的配置\\n- 专用实例、竞价实例和预留实例\\n- 额外块存储\\n- 按秒计费（最低1小时）\\n- 支持BYOL\\n\\n## EdgeOne — CDN + 安全防护\\n\\nEdgeOne将CDN、WAF、DDoS防护和机器人管理整合到一个平台中。\\n\\n**适用场景：**\\n- 加速全球内容分发\\n- 保护网站免受攻击\\n- 替代独立的CDN + WAF方案\\n- 降低国际用户的延迟\\n\\n**优势：**\\n- 慷慨的免费套餐（每月100万次请求）\\n- 按需付费\\n- 全球边缘网络\\n- 与Lighthouse和CVM原生集成\\n- 无需复杂授权\\n\\n## 如何组合产品\\n\\n| 组合 | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|------|---------------------|---------------|\\n| 最佳用途 | 网站、博客、落地页 | 动态应用、API、电商 |\\n| 性能 | 静态内容表现出色 | 最大灵活性 |\\n| 成本 | 最低 | 适中 |\\n| 部署时间 | 数分钟 | 数小时 |\\n\\n## 付费前检查清单\\n\\n1. **确认区域：** 并非所有促销活动在所有区域都可用\\n2. **资格条件：** 部分优惠仅限新用户\\n3. **有效期：** 促销活动有时效——请检查日期\\n4. **续费：** 促销价格可能不适用于续费\\n5. **优惠券：** 激活前请阅读条款——部分要求最低消费\\n6. **免费套餐：** 确认是否需要信用卡\\n\\n## 为开发者推荐的配置方案\\n\\n### 网站/博客\\nLighthouse（基础版）+ EdgeOne（免费套餐）\\n\\n### 轻量级API\\nLighthouse（中配方案）+ EdgeOne（免费套餐）\\n\\n### 机器人/Discord机器人\\nLighthouse（基础版）+ EdgeOne（免费套餐）\\n\\n### 仪表盘/数据分析\\nLighthouse（中配方案）+ EdgeOne（按需付费）\\n\\n### 完整应用\\nCVM（竞价实例）+ EdgeOne（按需付费）\\n\\n> **免责声明：** 价格和促销活动可能随时变更。请始终查看腾讯云官方网站获取最新信息。本指南仅供参考教育用途，不替代官方条款。\\n","./content/apex/fr/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: fr\\ntitle: \\"Tencent Cloud Deal Stack pour Builders\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.259Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.259Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack : Cloud Abordable pour les Builders\\n\\n## Qu\'est-ce que Tencent Cloud Deal Stack ?\\n\\nTencent Cloud propose une gamme de produits et promotions idéaux pour les builders indépendants. Avec Lighthouse, CVM et EdgeOne, vous pouvez héberger des sites, APIs, bots, tableaux de bord et petites applications en dépensant très peu — voire rien dans certains cas.\\n\\n## Produits Gratuits\\n\\nTencent Cloud dispose d\'un niveau gratuit avec des produits sélectionnés. Les ressources gratuites incluent :\\n\\n- **EdgeOne :** Jusqu\'à 1M de requêtes/mois sur le plan gratuit\\n- **Lighthouse :** Période d\'essai sur les configurations de base\\n- **CVM :** Offres promotionnelles pour les nouveaux utilisateurs\\n\\n> ⚠️ **Remarque :** Les produits gratuits peuvent nécessiter une inscription avec carte de crédit. Vérifiez les conditions officielles.\\n\\n## Lighthouse — La Simplicité qui Marche\\n\\nLighthouse est un VPS simplifié, idéal pour ceux qui ne veulent pas gérer une infrastructure complexe.\\n\\n**Quand l\'utiliser :**\\n- Sites statiques ou blogs\\n- APIs légères\\n- Bots et automatisation\\n- Environnements de développement\\n- Tableaux de bord personnels\\n\\n**Avantages :**\\n- Spécifications fixes, pas de surprises\\n- Tableau de bord simplifié\\n- Pare-feu et surveillance inclus\\n- Moins cher qu\'un CVM équivalent\\n- Facturation mensuelle ou à l\'heure\\n\\n## CVM — Pleine Puissance\\n\\nCVM (Cloud Virtual Machine) est la solution complète pour ceux qui ont besoin d\'un contrôle total.\\n\\n**Quand l\'utiliser :**\\n- Applications intensives en CPU/RAM\\n- Kubernetes ou Docker avancé\\n- Réglages personnalisés du noyau ou du réseau\\n- Grandes bases de données\\n- Environnements nécessitant VPC et groupes de sécurité\\n\\n**Avantages :**\\n- Configuration entièrement personnalisable\\n- Instances dédiées, spot et réservées\\n- Stockage bloc supplémentaire\\n- Facturation à la seconde (minimum 1 heure)\\n- Support BYOL\\n\\n## EdgeOne — CDN + Sécurité\\n\\nEdgeOne combine CDN avec WAF, protection DDoS et gestion des bots en une seule plateforme.\\n\\n**Quand l\'utiliser :**\\n- Accélérer la diffusion de contenu mondial\\n- Protéger les sites contre les attaques\\n- Remplacer CDN + WAF séparés\\n- Réduire la latence pour les utilisateurs internationaux\\n\\n**Avantages :**\\n- Niveau gratuit généreux (1M req/mois)\\n- Paiement à l\'utilisation\\n- Réseau périphérique mondial\\n- Intégration native avec Lighthouse et CVM\\n- Pas de licence complexe\\n\\n## Comment Combiner les Produits\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Idéal pour | Sites, blogs, pages d\'atterrissage | Apps dynamiques, APIs, e-commerce |\\n| Performance | Excellente pour le contenu statique | Flexibilité maximale |\\n| Coût | Le plus bas | Modéré |\\n| Configuration | Minutes | Heures |\\n\\n## Avant de Payer — Liste de Vérification\\n\\n1. **Vérifiez la région :** Toutes les promos ne sont pas disponibles dans toutes les régions\\n2. **Éligibilité :** Certaines offres sont réservées aux nouveaux utilisateurs\\n3. **Validité :** Les promotions expirent — vérifiez la date\\n4. **Renouvellement :** Le prix promo peut ne pas s\'appliquer au renouvellement\\n5. **Coupons :** Lisez les conditions avant d\'activer — certains exigent un minimum de dépenses\\n6. **Niveau gratuit :** Confirmez si une carte de crédit est requise\\n\\n## Configuration Recommandée pour les Builders\\n\\n### Site / Blog\\nLighthouse (de base) + EdgeOne (niveau gratuit)\\n\\n### API Légère\\nLighthouse (plan moyen) + EdgeOne (niveau gratuit)\\n\\n### Bot / Bot Discord\\nLighthouse (de base) + EdgeOne (niveau gratuit)\\n\\n### Tableau de Bord / Analytique\\nLighthouse (plan moyen) + EdgeOne (paiement à l\'utilisation)\\n\\n### Application Complète\\nCVM (instance spot) + EdgeOne (paiement à l\'utilisation)\\n\\n> **Avertissement :** Les prix et promotions sont sujets à modification. Vérifiez toujours le site officiel de Tencent Cloud pour obtenir des informations à jour. Ce guide est éducatif et ne remplace pas les conditions officielles.\\n","./content/apex/de/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: de\\ntitle: \\"Tencent Cloud Deal Stack für Entwickler\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.260Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.260Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Günstige Cloud für Entwickler\\n\\n## Was ist der Tencent Cloud Deal Stack?\\n\\nTencent Cloud bietet eine Reihe von Produkten und Aktionen, die ideal für unabhängige Entwickler sind. Mit Lighthouse, CVM und EdgeOne können Sie Websites, APIs, Bots, Dashboards und kleine Apps zu sehr geringen Kosten betreiben — in manchen Fällen sogar kostenlos.\\n\\n## Kostenlose Produkte\\n\\nTencent Cloud bietet eine kostenlose Stufe mit ausgewählten Produkten. Zu den kostenlosen Ressourcen gehören:\\n\\n- **EdgeOne:** Bis zu 1M Anfragen/Monat im kostenlosen Tarif\\n- **Lighthouse:** Testzeitraum für Basiskonfigurationen\\n- **CVM:** Aktionsangebote für Neukunden\\n\\n> ⚠️ **Hinweis:** Kostenlose Produkte erfordern möglicherweise eine Kreditkartenregistrierung. Bitte prüfen Sie die offiziellen Bedingungen.\\n\\n## Lighthouse — Einfachheit, die Funktioniert\\n\\nLighthouse ist ein vereinfachter VPS, ideal für alle, die keine komplexe Infrastruktur verwalten möchten.\\n\\n**Wann verwenden:**\\n- Statische Seiten oder Blogs\\n- Leichte APIs\\n- Bots und Automatisierung\\n- Entwicklungsumgebungen\\n- Persönliche Dashboards\\n\\n**Vorteile:**\\n- Feste Spezifikationen, keine Überraschungen\\n- Vereinfachtes Dashboard\\n- Firewall und Monitoring inklusive\\n- Günstiger als vergleichbare CVM\\n- Monatliche oder stündliche Abrechnung\\n\\n## CVM — Volle Leistung\\n\\nCVM (Cloud Virtual Machine) ist die Komplettlösung für alle, die volle Kontrolle benötigen.\\n\\n**Wann verwenden:**\\n- CPU-/RAM-intensive Anwendungen\\n- Kubernetes oder fortgeschrittenes Docker\\n- Benutzerdefinierte Kernel- oder Netzwerkkonfiguration\\n- Große Datenbanken\\n- Umgebungen mit VPC und Sicherheitsgruppen\\n\\n**Vorteile:**\\n- Vollständig anpassbare Konfiguration\\n- Dedizierte, Spot- und reservierte Instanzen\\n- Zusätzlicher Blockspeicher\\n- Abrechnung pro Sekunde (mindestens 1 Stunde)\\n- BYOL-Unterstützung\\n\\n## EdgeOne — CDN + Sicherheit\\n\\nEdgeOne vereint CDN mit WAF, DDoS-Schutz und Bot-Management auf einer Plattform.\\n\\n**Wann verwenden:**\\n- Beschleunigung globaler Content-Auslieferung\\n- Schutz von Websites vor Angriffen\\n- Ersatz für separate CDN + WAF\\n- Reduzierung der Latenz für internationale Nutzer\\n\\n**Vorteile:**\\n- Großzügige kostenlose Stufe (1M Anfragen/Monat)\\n- Pay-as-you-go\\n- Globales Edge-Netzwerk\\n- Native Integration mit Lighthouse und CVM\\n- Keine komplexen Lizenzen\\n\\n## Wie man Produkte Kombiniert\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Am besten für | Sites, Blogs, Landing Pages | Dynamische Apps, APIs, E-Commerce |\\n| Leistung | Hervorragend für statische Inhalte | Maximale Flexibilität |\\n| Kosten | Niedrigste | Mittel |\\n| Einrichtung | Minuten | Stunden |\\n\\n## Bevor Sie Bezahlen — Checkliste\\n\\n1. **Region prüfen:** Nicht alle Angebote sind in allen Regionen verfügbar\\n2. **Berechtigung:** Einige Angebote gelten nur für Neukunden\\n3. **Gültigkeit:** Aktionen laufen ab — Datum prüfen\\n4. **Verlängerung:** Der Aktionspreis gilt möglicherweise nicht bei Verlängerung\\n5. **Gutscheine:** Bedingungen vor Aktivierung lesen — manche erfordern Mindestausgaben\\n6. **Kostenlose Stufe:** Bestätigen, ob eine Kreditkarte erforderlich ist\\n\\n## Empfohlene Konfiguration für Entwickler\\n\\n### Website / Blog\\nLighthouse (Basis) + EdgeOne (kostenlose Stufe)\\n\\n### Leichte API\\nLighthouse (mittlerer Tarif) + EdgeOne (kostenlose Stufe)\\n\\n### Bot / Discord-Bot\\nLighthouse (Basis) + EdgeOne (kostenlose Stufe)\\n\\n### Dashboard / Analytik\\nLighthouse (mittlerer Tarif) + EdgeOne (Pay-as-you-go)\\n\\n### Vollständige Anwendung\\nCVM (Spot-Instanz) + EdgeOne (Pay-as-you-go)\\n\\n> **Hinweis:** Preise und Aktionen können sich ändern. Prüfen Sie immer die offizielle Tencent Cloud-Website für aktuelle Informationen. Dieser Leitfaden dient Bildungszwecken und ersetzt nicht die offiziellen Bedingungen.\\n","./content/apex/it/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: it\\ntitle: \\"Tencent Cloud Deal Stack per Creator\\"\\nverdict: caution\\nquality_score: 30\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-11T11:31:49.261Z\\"\\n  updated_at: \\"2026-05-11T11:31:49.261Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Economica per Creator\\n\\n## Cos\'è Tencent Cloud Deal Stack?\\n\\nTencent Cloud offre una gamma di prodotti e promozioni ideali per creator indipendenti. Con Lighthouse, CVM e EdgeOne puoi ospitare siti, API, bot, dashboard e piccole applicazioni spendendo pochissimo — in alcuni casi, nulla.\\n\\n## Prodotti Gratuiti\\n\\nTencent Cloud mette a disposizione un livello gratuito con prodotti selezionati. Le risorse gratuite includono:\\n\\n- **EdgeOne:** Fino a 1M richieste/mese nel piano gratuito\\n- **Lighthouse:** Periodo di prova su configurazioni base\\n- **CVM:** Offerte promozionali per nuovi utenti\\n\\n> ⚠️ **Nota:** I prodotti gratuiti potrebbero richiedere la registrazione con carta di credito. Verifica i termini ufficiali.\\n\\n## Lighthouse — Semplicità che Funziona\\n\\nLighthouse è un VPS semplificato, ideale per chi non vuole gestire infrastrutture complesse.\\n\\n**Quando usarlo:**\\n- Siti statici o blog\\n- API leggere\\n- Bot e automazione\\n- Ambienti di sviluppo\\n- Dashboard personali\\n\\n**Vantaggi:**\\n- Specifiche fisse, nessuna sorpresa\\n- Dashboard semplificata\\n- Firewall e monitoraggio inclusi\\n- Più economico di un CVM equivalente\\n- Fatturazione mensile o oraria\\n\\n## CVM — Potenza Completa\\n\\nCVM (Cloud Virtual Machine) è la soluzione completa per chi necessita di controllo totale.\\n\\n**Quando usarlo:**\\n- Applicazioni ad alto consumo di CPU/RAM\\n- Kubernetes o Docker avanzato\\n- Ottimizzazioni personalizzate di kernel o rete\\n- Database di grandi dimensioni\\n- Ambienti che richiedono VPC e gruppi di sicurezza\\n\\n**Vantaggi:**\\n- Configurazione completamente personalizzabile\\n- Istanze dedicate, spot e riservate\\n- Storage a blocchi aggiuntivo\\n- Fatturazione al secondo (minimo 1 ora)\\n- Supporto BYOL\\n\\n## EdgeOne — CDN + Sicurezza\\n\\nEdgeOne combina CDN con WAF, protezione DDoS e gestione dei bot in un\'unica piattaforma.\\n\\n**Quando usarlo:**\\n- Accelerare la distribuzione di contenuti globali\\n- Proteggere i siti dagli attacchi\\n- Sostituire CDN + WAF separati\\n- Ridurre la latenza per utenti internazionali\\n\\n**Vantaggi:**\\n- Livello gratuito generoso (1M richieste/mese)\\n- Pagamento a consumo\\n- Rete edge globale\\n- Integrazione nativa con Lighthouse e CVM\\n- Nessuna licenza complessa\\n\\n## Come Combinare i Prodotti\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Ideale per | Siti, blog, landing page | App dinamiche, API, e-commerce |\\n| Prestazioni | Ottime per contenuti statici | Massima flessibilità |\\n| Costo | Più basso | Moderato |\\n| Configurazione | Minuti | Ore |\\n\\n## Prima di Pagare — Lista di Controllo\\n\\n1. **Controlla la regione:** Non tutte le promozioni sono disponibili in tutte le regioni\\n2. **Idoneità:** Alcune offerte sono solo per nuovi utenti\\n3. **Validità:** Le promozioni scadono — verifica la data\\n4. **Rinnovo:** Il prezzo promozionale potrebbe non applicarsi al rinnovo\\n5. **Coupon:** Leggi i termini prima di attivare — alcuni richiedono una spesa minima\\n6. **Livello gratuito:** Conferma se è richiesta una carta di credito\\n\\n## Configurazione Consigliata per Creator\\n\\n### Sito / Blog\\nLighthouse (base) + EdgeOne (livello gratuito)\\n\\n### API Leggera\\nLighthouse (piano medio) + EdgeOne (livello gratuito)\\n\\n### Bot / Bot Discord\\nLighthouse (base) + EdgeOne (livello gratuito)\\n\\n### Dashboard / Analisi\\nLighthouse (piano medio) + EdgeOne (pagamento a consumo)\\n\\n### Applicazione Completa\\nCVM (istanza spot) + EdgeOne (pagamento a consumo)\\n\\n> **Avviso:** Prezzi e promozioni sono soggetti a modifiche. Verifica sempre il sito ufficiale di Tencent Cloud per informazioni aggiornate. Questa guida ha scopo educativo e non sostituisce i termini ufficiali.\\n","./content/language-models/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"Language Models\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# Language Models\\n\\nLLMs, Transformers and NLP\\nThis is a comprehensive knowledge hub for Language Models. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/en/foundation-models-overview.md":"---\\nslug: foundation-models-overview\\nlang: en\\ntitle: Foundation Models Overview\\nverdict: trusted\\nquality_score: 88\\nsubjects:\\n  - llm\\n  - foundation-models\\n  - transformers\\nreferral_links:\\n  - url: https://arxiv.org/abs/2005.14165\\n    title: GPT-3 Paper\\n    description: Language Models are Few-Shot Learners by Brown et al.\\n  - url: https://arxiv.org/abs/1706.03762\\n    title: Attention Is All You Need\\n    description: The original Transformer architecture paper by Vaswani et al.\\nmetadata:\\n  created_at: \\"2026-04-26T12:00:00Z\\"\\n  updated_at: \\"2026-04-26T12:00:00Z\\"\\n  author: UniTeia Editorial\\n  version: 1\\n---\\n\\n# Foundation Models Overview\\n\\nA concise guide to the paradigm shift from task-specific models to general-purpose foundation models — and what it means for developers building on top of them.\\n\\n## What Are Foundation Models?\\n\\nFoundation models are large neural networks trained on broad data at scale, then adapted (fine-tuned, prompted, or retrieved) to a wide range of downstream tasks. The term, coined by Stanford\'s HAI Institute in 2021, captures a key insight: a single model architecture can serve as the *foundation* for many applications.\\n\\nThe core recipe:\\n\\n1. **Pre-training** — Self-supervised learning on massive corpora (web text, code, images, or multimodal mixtures)\\n2. **Alignment** — RLHF, DPO, or constitutional AI to steer behaviour toward helpful, harmless, and honest outputs\\n3. **Adaptation** — Fine-tuning, LoRA, retrieval-augmented generation, or in-context learning for specific use-cases\\n\\n## The Transformer Backbone\\n\\nAlmost every modern foundation model is built on the Transformer architecture introduced by Vaswani et al. in 2017. Its self-attention mechanism allows the model to weigh the relevance of every token in a sequence against every other token — enabling long-range dependencies without recurrence.\\n\\nKey variants:\\n\\n- **Encoder-only** (BERT family) — Bidirectional context, ideal for classification and retrieval\\n- **Decoder-only** (GPT, LLaMA, Mistral) — Autoregressive generation, dominant for chat and completion\\n- **Encoder-decoder** (T5, BART) — Sequence-to-sequence tasks like translation and summarisation\\n\\n## Scale Laws and Compute-Optimal Training\\n\\nThe **Chinchilla scaling laws** (Hoffmann et al., 2022) demonstrated that for a given compute budget, model size and training data should scale proportionally. This insight reshaped the field: smaller models trained on more data often outperform larger models trained on less.\\n\\n**Practical implication:** A 7B-parameter model trained on 2T tokens can match or exceed a 70B model trained on 200B tokens at the same compute cost.\\n\\n## Context Windows and Long-Range Understanding\\n\\nEarly Transformer models operated on 512–2048 token contexts. Modern architectures push this boundary:\\n\\n- **Rotary Position Embeddings (RoPE)** — Enable extrapolation beyond training length\\n- **ALiBi** — Linear bias attention for length extrapolation\\n- **Ring Attention / Block-Sparse** — Distributed attention across devices for 100K+ token contexts\\n\\nThese techniques unlock use-cases like full-document analysis, multi-file codebase reasoning, and extended conversational memory.\\n\\n## Efficiency Innovations\\n\\nTraining and serving foundation models is expensive. Key efficiency gains:\\n\\n- **Mixture of Experts (MoE)** — Activate only a subset of parameters per token (e.g., Mixtral 8×7B uses 13B active params per forward pass)\\n- **Flash Attention** — IO-aware tiled attention that reduces memory reads by 5-10×\\n- **Quantisation (GPTQ, AWQ, GGUF)** — 4-bit and 8-bit inference with minimal quality loss\\n- **Speculative Decoding** — Draft-then-verify pattern that speeds up autoregressive generation\\n\\n## Choosing a Foundation Model\\n\\nConsider these dimensions when selecting a model for a project:\\n\\n| Dimension | Trade-off |\\n|-----------|-----------|\\n| Size vs Speed | Larger models perform better but cost more per token |\\n| Open vs Closed | Open weights enable fine-tuning and local deployment; closed APIs offer convenience |\\n| Context Length | Longer windows enable richer prompts but increase latency and cost |\\n| Specialisation | Domain-specific fine-tunes (code, medical, legal) often outperform generalists in their niche |\\n\\n## Looking Ahead\\n\\nThe field is converging on **hybrid architectures** that blend retrieval, tool use, and reasoning within a single inference path. The boundary between \\"model\\" and \\"system\\" is dissolving — the next generation of foundation models will likely be inseparable from the retrieval, verification, and planning scaffolding around them.\\n","./content/language-models/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"Modelos de Lenguaje\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# Modelos de Lenguaje\\n\\nLLMs, Transformers y PLN\\nThis is a comprehensive knowledge hub for Modelos de Lenguaje. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"言語モデル\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# 言語モデル\\n\\nLLM、トランスフォーマー、自然言語処理\\nThis is a comprehensive knowledge hub for 言語モデル. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"Modelos de Linguagem\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# Modelos de Linguagem\\n\\nLLMs, Transformers e PLN\\nThis is a comprehensive knowledge hub for Modelos de Linguagem. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/pt/em-construcao.md":"---\\nslug: em-construcao\\nlang: pt\\ntitle: Em Construção\\nverdict: trusted\\nquality_score: 0\\nsubjects:\\n  - em-construcao\\nreferral_links: []\\nmetadata:\\n  created_at: \\"2026-04-29T00:00:00Z\\"\\n  updated_at: \\"2026-04-29T00:00:00Z\\"\\n  author: UniTeia\\n  version: 1\\n---\\n\\n# Em Construção\\n\\nEsta página está atualmente em desenvolvimento. Estamos trabalhando para trazer conteúdo de alta qualidade sobre este tópico em português. \\n\\nPor favor, consulte a versão em inglês ou verifique novamente em breve. Nossa equipe está dedicada a fornecer as melhores informações sobre agentes de IA, modelos de linguagem e engenharia de prompts.\\n\\nObrigado pela paciência!\\n","./content/language-models/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"语言模型\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# 语言模型\\n\\n大语言模型、Transformer 和自然语言处理\\nThis is a comprehensive knowledge hub for 语言模型. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/prompt-engineering/pt/em-construcao.md":"---\\nslug: em-construcao\\nlang: pt\\ntitle: Em Construção\\nverdict: trusted\\nquality_score: 0\\nsubjects:\\n  - em-construcao\\nreferral_links: []\\nmetadata:\\n  created_at: \\"2026-04-29T00:00:00Z\\"\\n  updated_at: \\"2026-04-29T00:00:00Z\\"\\n  author: UniTeia\\n  version: 1\\n---\\n\\n# Em Construção\\n\\nEsta página está atualmente em desenvolvimento. Estamos trabalhando para trazer conteúdo de alta qualidade sobre este tópico em português. \\n\\nPor favor, consulte a versão em inglês ou verifique novamente em breve. Nossa equipe está dedicada a fornecer as melhores informações sobre agentes de IA, modelos de linguagem e engenharia de prompts.\\n\\nObrigado pela paciência!\\n"}'
)
export const REGISTRY_PATHS = Object.keys(contentRegistry)

/**
 * Article metadata structure for navigation
 * Lightweight version of LlmWikiContent with only navigation-relevant fields
 */
export interface ArticleMeta {
  slug: string
  lang: SupportedLanguage
  title: string
  type: 'article' | 'index'
  subjects: string[]
}

/**
 * Navigation data structure keyed by niche
 * Build-time derived from content scans
 */
export interface NavigationData {
  niches: {
    [niche: string]: {
      langs: SupportedLanguage[]
      articles: ArticleMeta[]
    }
  }
}

/**
 * Load and validate wiki content from a markdown file.
 *
 * Encapsulates the full pipeline: read .md file → parse with gray-matter →
 * transform Markdown to HTML with marked → validate slug → return typed
 * LlmWikiContent or throw ContentLoaderError.
 *
 * Uses Vite's import.meta.glob to bundle all markdown files.
 * This ensures content is available in Cloudflare Workers where node:fs is unavailable.
 */
export async function loadContent(
  niche: string,
  slug: string,
  lang: SupportedLanguage
): Promise<LlmWikiContent> {
  const { validateSlug } = await import('~/utils/url-validation')
  const { validateContent } = await import('~/utils/schema-validation')

  const contentKey = REGISTRY_PATHS.find(k => k.endsWith(`/content/${niche}/${lang}/${slug}.md`))
  const rawContent = contentKey ? contentRegistry[contentKey] : undefined

  if (!rawContent) {
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'read',
      errors: ['Content not found'],
    })
  }

  // ---- Phase: parse ----
  let frontmatter: Record<string, unknown>
  let markdownBody: string
  try {
    const parsed = matter(rawContent, {
      engines: {
        js: () => {
          throw new Error('JS eval disabled')
        },
      },
    })
    frontmatter = parsed.data as Record<string, unknown>
    markdownBody = parsed.content
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[content-loader] Parse failed for ${niche}/${lang}/${slug}: ${message}`)
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'parse',
      errors: [message],
    })
  }

  // ---- Phase: transform ----
  let htmlContent: string
  try {
    marked.use({
      async: false,
      breaks: false,
      gfm: true,
      renderer: {
        heading({ tokens, depth }) {
          if (depth === 1) return ''
          return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`
        },
      },
    })

    // marked.parse is async or sync based on options; we await it for safety
    // No DOMPurify here to avoid SSR transformation issues.
    // Content is pre-validated during generation.
    htmlContent = (await marked.parse(markdownBody.trim())) as string
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(
      `[content-loader] Markdown transformation failed for ${niche}/${lang}/${slug}: ${message}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'parse', // Reuse parse phase for transformation errors
      errors: [`Markdown transformation failed: ${message}`],
    })
  }

  // ---- Phase: schema ----
  const contentObject = {
    ...frontmatter,
    slug,
    lang,
    content: htmlContent,
  }

  const validation = validateContent(contentObject, contentKey, { skipSlugValidation: true })
  if (!validation.valid) {
    const errorMessages = validation.errors.map(e => `[${e.field}] ${e.message}`)
    console.error(
      `[content-loader] Schema validation failed for ${niche}/${lang}/${slug}: ${errorMessages.join('; ')}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'schema',
      errors: errorMessages,
    })
  }

  // ---- Phase: slug ----
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    console.error(
      `[content-loader] Slug validation failed for ${niche}/${lang}/${slug}: ${slugValidation.error}`
    )
    throw new ContentLoaderError({
      niche,
      slug,
      lang,
      phase: 'slug',
      errors: [slugValidation.error ?? 'Slug validation failed'],
    })
  }

  const translations = await getAvailableLanguages(niche, slug)

  return {
    ...contentObject,
    translations,
  } as LlmWikiContent
}

/**
 * Discover all available languages for a specific article slug within a niche.
 *
 * Scans the virtual filesystem (import.meta.glob) for matches following the
 * pattern: content/{niche}/{lang}/{slug}.md
 */
export async function getAvailableLanguages(
  niche: string,
  slug: string
): Promise<SupportedLanguage[]> {
  const suffix = `/${niche}/`
  const fileSuffix = `/${slug}.md`

  return REGISTRY_PATHS.filter(key => key.includes(suffix) && key.endsWith(fileSuffix)).map(key => {
    // Extract lang from .../content/{niche}/{lang}/{slug}.md
    const segments = key.split('/')
    const langIndex = segments.indexOf(niche) + 1
    return segments[langIndex] as SupportedLanguage
  })
}

/**
 * Lightweight sitemap discovery helper that returns all valid article files
 * for a niche without parsing markdown bodies.
 *
 * Invalid slugs are skipped so editorial fixtures used for validation do not
 * leak into the public sitemap.
 */
export interface NicheArticleEntry {
  slug: string
  lang: SupportedLanguage
  updatedAt: string | undefined
  title: string
  summary: string | undefined
}

const nicheArticlesCache = new Map<string, NicheArticleEntry[]>()

export function clearNicheArticlesCache(): void {
  nicheArticlesCache.clear()
}

export async function listNicheArticles(niche: string): Promise<NicheArticleEntry[]> {
  const cachedArticles = nicheArticlesCache.get(niche)
  if (cachedArticles) {
    return cachedArticles
  }

  const { validateSlug } = await import('~/utils/url-validation')

  const isApex = niche === 'apex'
  const targetPrefix = isApex ? '/content/apex/' : `/content/${niche}/`

  const articles = REGISTRY_PATHS.filter(key => {
    const normalizedKey = key.replace(/^(\.\.\/\.\.\/|\.\/)/, '/')
    return normalizedKey.startsWith(targetPrefix)
  })
    .flatMap(key => {
      const rawContent = contentRegistry[key]
      const normalizedKey = key.replace(/^(\.\.\/\.\.\/|\.\/)/, '/')
      const relativePath = normalizedKey.slice(targetPrefix.length)
      const segments = relativePath.split('/')

      if (segments.length !== 2 || !segments[0] || !segments[1]?.endsWith('.md')) {
        return []
      }

      const lang = segments[0] as SupportedLanguage
      const slug = segments[1].replace(/\.md$/, '')
      const slugValidation = validateSlug(slug)

      if (!slugValidation.valid) {
        return []
      }

      // Parse frontmatter for updatedAt
      let updatedAt: string | undefined
      let title = slug
      let summary: string | undefined
      try {
        if (rawContent) {
          const parsed = matter(rawContent, {
            engines: {
              js: () => {
                throw new Error('JS eval disabled')
              },
            },
          })
          updatedAt = (parsed.data.metadata?.updated_at ||
            parsed.data.metadata?.created_at) as string
          title = parsed.data.title || title
          summary = parsed.data.summary || parsed.data.description
        }
      } catch {}

      return [{ slug, lang, updatedAt, title, summary }]
    })
    .sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang))

  nicheArticlesCache.set(niche, articles)
  return articles
}

/**
 * Memoization cache for navigation data (dev builds only).
 * Build-time operation - persists across calls within the same build process.
 */
let navigationCache: NavigationData | null = null

/**
 * Derives complete navigation structure from content files.
 *
 * Scans content/{niche}/{lang}/{slug}.md using import.meta.glob,
 * extracts frontmatter (slug, lang, title, type, subjects),
 * and structures as { niches: { [niche]: { langs: [], articles: [] } } }.
 *
 * Identifies _index.md files as landing pages (type: 'index').
 * Results are memoized for dev builds to avoid repeated glob scans.
 *
 * Build-time only - runs during Vite build, not at runtime in Workers.
 */
export async function deriveNavigation(): Promise<NavigationData> {
  // Return cached result if available (dev builds)
  if (navigationCache) {
    return navigationCache
  }

  const { validateSlug } = await import('~/utils/url-validation')

  const niches: NavigationData['niches'] = {}

  for (const key of REGISTRY_PATHS) {
    const rawContent = contentRegistry[key]
    if (!rawContent) continue
    // Parse path: .../content/{niche}/{lang}/{slug}.md
    const match = key.match(/\/content\/([^/]+)\/([^/]+)\/(.+)\.md$/)
    if (!match) continue

    const [, niche, lang, slug] = match
    // Validate capture groups exist before using as index
    if (!niche || !lang || !slug) continue

    // Skip invalid slugs
    const slugValidation = validateSlug(slug)
    if (!slugValidation.valid) {
      continue
    }

    // Parse frontmatter
    try {
      const parsed = matter(rawContent, {
        engines: {
          js: () => {
            throw new Error('JS eval disabled')
          },
        },
      })

      const frontmatter = parsed.data as Record<string, unknown>

      // Extract required fields
      const title = typeof frontmatter.title === 'string' ? frontmatter.title : slug
      const subjects = Array.isArray(frontmatter.subjects)
        ? frontmatter.subjects.filter((s): s is string => typeof s === 'string')
        : []

      // Determine type: index for _index.md, article otherwise
      const type: ArticleMeta['type'] = slug === '_index' ? 'index' : 'article'

      // Initialize niche structure if needed
      if (!niches[niche]) {
        niches[niche] = {
          langs: [],
          articles: [],
        }
      }

      // Add language if not already present
      const langSupported = lang as SupportedLanguage
      if (!niches[niche].langs.includes(langSupported)) {
        niches[niche].langs.push(langSupported)
      }

      // Add article metadata
      niches[niche].articles.push({
        slug,
        lang: langSupported,
        title,
        type,
        subjects,
      })
    } catch {}
  }

  const result: NavigationData = { niches }

  // Memoize for dev builds
  navigationCache = result

  return result
}

/**
 * Clears the navigation memoization cache.
 * Useful for test isolation or when content changes in dev mode.
 */
export function clearNavigationCache(): void {
  navigationCache = null
}
