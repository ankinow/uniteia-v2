import matter from 'gray-matter'
import { marked } from 'marked'
import type { SupportedLanguage } from '~/i18n/types'
import type { LlmWikiContent } from '~/types/content'
import { ContentLoaderError } from '~/types/content'

// INLINE CONTENT REGISTRY — auto-generated. Run `bun run generate:content-registry`.
export const contentRegistry: Record<string, string> = JSON.parse(
  '{"./content/ai-agents/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"AI Agents\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.891Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.891Z\\"\\n---\\n\\n# AI Agents\\n\\nAutonomous AI agents and frameworks\\nThis is a comprehensive knowledge hub for AI Agents. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/en/llm-aggregators-compared.md":"---\\nslug: llm-aggregators-compared\\nlang: en\\ntitle: LLM Aggregators Compared\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - llm\\n  - aggregators\\n  - ai-agents\\nreferral_links:\\n  - url: https://openrouter.ai/\\n    title: OpenRouter\\n    description: Unified API for top LLMs\\nmetadata:\\n  created_at: \\"2026-04-24T21:15:00Z\\"\\n  updated_at: \\"2026-04-24T21:15:00Z\\"\\n  author: Antigravity\\n  version: 1\\n---\\n\\n# LLM Aggregators Compared\\n\\nA comprehensive look at current LLM aggregators and how they facilitate multi-model workflows.\\n\\n## Overview\\n\\nIn the rapidly evolving AI landscape, aggregators provide a single point of access to multiple large language models. This simplifies development and allows for easier comparison between different providers.\\n\\n## Key Players\\n\\n1. **OpenRouter**: Excellent for API-driven workflows.\\n2. **Poe**: Great for consumer-facing interaction.\\n3. **Vercel AI SDK**: A robust library for integrating diverse models.\\n\\nThis article serves as a foundation for testing the new content pipeline in Milestone M002.\\n","./content/ai-agents/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"Agentes de IA\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# Agentes de IA\\n\\nAgentes de IA autónomos y frameworks\\nThis is a comprehensive knowledge hub for Agentes de IA. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"AIエージェント\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# AIエージェント\\n\\n自律型AIエージェントとフレームワーク\\nThis is a comprehensive knowledge hub for AIエージェント. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"Agentes de IA\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.891Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.891Z\\"\\n---\\n\\n# Agentes de IA\\n\\nAgentes de IA autônomos e frameworks\\nThis is a comprehensive knowledge hub for Agentes de IA. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/ai-agents/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"AI 代理\\"\\nsubjects: [\\"ai-agents\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# AI 代理\\n\\n自主 AI 代理和框架\\nThis is a comprehensive knowledge hub for AI 代理. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/de/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: de\\ntitle: \\"Tencent Cloud Deal Stack für Entwickler\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.225Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.225Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Günstige Cloud für Builder\\n\\n## Was ist Tencent Cloud Deal Stack?\\n\\nTencent Cloud bietet eine Reihe von Produkten und Aktionen, die ideal für unabhängige Builder sind. Mit Lighthouse, CVM und EdgeOne können Sie Websites, APIs, Bots, Dashboards und kleine Apps zu sehr geringen Kosten betreiben.\\n\\n> **Hinweis:** Preise und Aktionen können sich ändern. Prüfen Sie immer die offizielle Tencent Cloud-Website.\\n","./content/apex/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nUniversal AI Knowledge Network\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/en/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: en\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.222Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.222Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cheap Cloud for Builders\\n\\n## What is the Tencent Cloud Deal Stack?\\n\\nTencent Cloud offers a range of products and promotions ideal for independent builders. With Lighthouse, CVM, and EdgeOne, you can host sites, APIs, bots, dashboards, and small apps spending very little — in some cases, nothing.\\n\\n## Free Products\\n\\nTencent Cloud provides a free tier with select products. Free resources include:\\n\\n- **EdgeOne:** Up to 1M requests/month on the free plan\\n- **Lighthouse:** Trial period on basic configurations\\n- **CVM:** Promotional offers for new users\\n\\n> ⚠️ **Note:** Free products may require credit card registration. Check official terms.\\n\\n## Lighthouse — Simplicity That Works\\n\\nLighthouse is a simplified VPS, ideal for those who don\'t want to manage complex infrastructure.\\n\\n**When to use:**\\n- Static sites or blogs\\n- Lightweight APIs\\n- Bots and automation\\n- Dev environments\\n- Personal dashboards\\n\\n**Pros:**\\n- Fixed specs, no surprises\\n- Simplified dashboard\\n- Firewall and monitoring included\\n- Cheaper than equivalent CVM\\n- Monthly or hourly billing\\n\\n## CVM — Full Power\\n\\nCVM (Cloud Virtual Machine) is the complete solution for those needing full control.\\n\\n**When to use:**\\n- CPU/RAM-intensive applications\\n- Kubernetes or advanced Docker\\n- Custom kernel or network tuning\\n- Large databases\\n- Environments needing VPC and security groups\\n\\n**Pros:**\\n- Fully customizable configuration\\n- Dedicated, spot, and reserved instances\\n- Additional block storage\\n- Per-second billing (1-hour minimum)\\n- BYOL support\\n\\n## EdgeOne — CDN + Security\\n\\nEdgeOne combines CDN with WAF, DDoS protection, and bot management in one platform.\\n\\n**When to use:**\\n- Accelerate global content delivery\\n- Protect sites against attacks\\n- Replace separate CDN + WAF\\n- Reduce latency for international users\\n\\n**Pros:**\\n- Generous free tier (1M req/month)\\n- Pay-as-you-go\\n- Global edge network\\n- Native integration with Lighthouse and CVM\\n- No complex licensing\\n\\n## How to Combine Products\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Best for | Sites, blogs, landing pages | Dynamic apps, APIs, e-commerce |\\n| Performance | Great for static content | Maximum flexibility |\\n| Cost | Lowest | Moderate |\\n| Setup | Minutes | Hours |\\n\\n## Before You Pay — Checklist\\n\\n1. **Check region:** Not all promos are available in all regions\\n2. **Eligibility:** Some offers are new users only\\n3. **Validity:** Promotions expire — check the date\\n4. **Renewal:** Promo price may not apply on renewal\\n5. **Coupons:** Read terms before activating — some require minimum spend\\n6. **Free tier:** Confirm whether credit card is required\\n\\n## Recommended Setup for Builders\\n\\n### Site/Blog\\nLighthouse (basic) + EdgeOne (free tier)\\n\\n### Lightweight API\\nLighthouse (mid plan) + EdgeOne (free tier)\\n\\n### Bot / Discord Bot\\nLighthouse (basic) + EdgeOne (free tier)\\n\\n### Dashboard / Analytics\\nLighthouse (mid plan) + EdgeOne (pay-as-you-go)\\n\\n### Full Application\\nCVM (spot instance) + EdgeOne (pay-as-you-go)\\n\\n> **Disclaimer:** Prices and promotions are subject to change. Always check the official Tencent Cloud website for up-to-date information. This guide is educational and does not substitute official terms.\\n","./content/apex/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nRed Universal de Conocimiento en IA\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/es/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: es\\ntitle: \\"Tencent Cloud Deal Stack para Creadores\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.224Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.224Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Barata para Builders\\n\\n## ¿Qué es Tencent Cloud Deal Stack?\\n\\nTencent Cloud ofrece un conjunto de productos y promociones ideales para builders independientes. Con Lighthouse, CVM y EdgeOne, es posible alojar sitios web, APIs, bots, dashboards y pequeñas aplicaciones gastando muy poco.\\n\\n## Productos Gratuitos\\n\\nTencent Cloud dispone de un free-tier con productos seleccionados:\\n- EdgeOne: hasta 1M peticiones/mes en plan gratuito\\n- Lighthouse: periodo trial en configuraciones básicas\\n- CVM: ofertas promocionales para nuevos usuarios\\n\\n> ⚠️ **Atención:** Los productos gratuitos pueden requerir tarjeta de crédito. Verifica los términos.\\n\\n## Guía de Productos\\n\\n(Lighthouse para simplicidad, CVM para control total, EdgeOne para CDN+seguridad — mismo contenido descriptivo que la versión en inglés, adaptado al público hispanohablante.)\\n\\n> **Aviso:** Los precios y promociones están sujetos a cambios. Verifica siempre el sitio oficial de Tencent Cloud.\\n","./content/apex/fr/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: fr\\ntitle: \\"Tencent Cloud Deal Stack pour Builders\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.224Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.224Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Abordable pour les Builders\\n\\n## Qu\'est-ce que Tencent Cloud Deal Stack ?\\n\\nTencent Cloud propose une gamme de produits et promotions idéaux pour les builders indépendants. Avec Lighthouse, CVM et EdgeOne, vous pouvez héberger des sites, APIs, bots, tableaux de bord et petites applications à moindre coût.\\n\\n> **Avertissement :** Les prix et promotions sont sujets à modification. Vérifiez toujours le site officiel de Tencent Cloud.\\n","./content/apex/it/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: it\\ntitle: \\"Tencent Cloud Deal Stack per Creator\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.227Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.227Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Economica per Builder\\n\\n## Cos\'è Tencent Cloud Deal Stack?\\n\\nTencent Cloud offre una gamma di prodotti e promozioni ideali per builder indipendenti. Con Lighthouse, CVM e EdgeOne è possibile ospitare siti, API, bot, dashboard e piccole app spendendo pochissimo.\\n\\n> **Avviso:** Prezzi e promozioni sono soggetti a modifiche. Verificare sempre il sito ufficiale di Tencent Cloud.\\n","./content/apex/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nユニバーサルAIナレッジネットワーク\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/ja/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: ja\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.228Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.228Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: ビルダーのための格安クラウド\\n\\n## Tencent Cloud Deal Stackとは？\\n\\nTencent Cloudは、独立したビルダーに最適な製品とプロモーションを提供しています。Lighthouse、CVM、EdgeOneを使えば、サイト、API、ボット、ダッシュボード、小規模アプリをわずかなコストで運用できます。\\n\\n> **免責事項:** 価格とプロモーションは変更される場合があります。最新情報はTencent Cloud公式サイトをご確認ください。\\n","./content/apex/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\nRede Universal de Conhecimento em IA\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/pt/creator-ai-tools.md":"---\\nslug: creator-ai-tools\\nlang: pt\\ntitle: \\"Galaxy — Exploração de Conteúdo e Fontes\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - galaxy\\n  - inteligência artificial\\n  - conteúdo\\n  - fontes\\nreferral_links: []\\nmetadata:\\n  created_at: \\"2026-05-15T15:40:45.065Z\\"\\n  updated_at: \\"2026-05-15T15:40:45.065Z\\"\\n  author: UniTeia System\\n  version: 1\\n  importedFrom: uniteia-mega-factory\\n  sourceRunId: \\"73fd971e-d2bd-40eb-8b01-28ef398aff49\\"\\n---\\n\\n# Galaxy — Exploração de Conteúdo e Fontes\\n\\nEste artigo foi gerado automaticamente a partir de múltiplas fontes, explorando tópicos relacionados a galaxy, IA, conteúdo e estratégia para criadores.\\n\\n## Fontes Utilizadas\\n\\nO conteúdo foi compilado a partir de 8 fontes, incluindo referências a Galaxy, AI, Conteúdo, Estratégia e Criadores. Cada fonte contribuiu com perspectivas sobre o ecossistema de criação de conteúdo com suporte de inteligência artificial.\\n\\n## Visão Geral\\n\\nEste material sintetiza informações sobre o universo de criação de conteúdo digital, abordando:\\n\\n- A interseção entre tecnologia Galaxy e plataformas de IA\\n- Estratégias de conteúdo para criadores\\n- Abordagens modernas para produção de conhecimento\\n\\n## Nota Técnica\\n\\nArtigo gerado pelo pipeline UniTeia Mega Factory (run `73fd971e`). Qualidade: rascunho. Pendente de revisão editorial para publicação completa.\\n\\n---\\n*Gerado por UniTeia Mega Factory · Pipeline W0-W17*\\n","./content/apex/pt/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: pt\\ntitle: \\"Tencent Cloud Deal Stack: Cloud Barata para Builders\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.221Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.221Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack: Cloud Barata para Builders\\n\\n## O que é a Tencent Cloud Deal Stack?\\n\\nA Tencent Cloud oferece um conjunto de produtos e promoções ideais para builders independentes. Com Lighthouse, CVM e EdgeOne, é possível subir sites, APIs, bots, dashboards e pequenos apps gastando muito pouco — e em alguns casos, nada.\\n\\n## Produtos Gratuitos\\n\\nA Tencent Cloud disponibiliza um free-tier com produtos selecionados. Alguns recursos gratuitos incluem:\\n\\n- EdgeOne: até 1M requisições/mês no plano gratuito\\n- Lighthouse: período trial em configurações básicas\\n- CVM: ofertas promocionais para novos usuários\\n\\n> ⚠️ **Atenção:** Produtos gratuitos podem exigir cadastro com cartão de crédito. Verifique os termos no site oficial.\\n\\n## Lighthouse — Simplicidade que Roda\\n\\nO Lighthouse é um VPS simplificado, ideal para quem não quer gerenciar infraestrutura complexa.\\n\\n**Quando usar:**\\n- Sites estáticos ou blogs\\n- APIs leves\\n- Bots e automações\\n- Ambientes de desenvolvimento\\n- Dashboards pessoais\\n\\n**Vantagens:**\\n- Especificações fixas, sem surpresas\\n- Painel simplificado\\n- Firewall e monitoramento inclusos\\n- Mais barato que CVM equivalente\\n- Billing mensal ou por hora\\n\\n## CVM — Poder Total\\n\\nCVM (Cloud Virtual Machine) é a solução completa para quem precisa de controle total.\\n\\n**Quando usar:**\\n- Aplicações que exigem muito CPU/RAM\\n- Kubernetes ou Docker avançado\\n- Kernel customizado ou tuning de rede\\n- Bancos de dados grandes\\n- Ambientes que precisam de VPC e security groups\\n\\n**Vantagens:**\\n- Configuração totalmente customizável\\n- Instâncias dedicadas, spot e reservadas\\n- Discos adicionais (block storage)\\n- Billing por segundo (mínimo 1 hora)\\n- Suporte a BYOL\\n\\n## EdgeOne — CDN + Segurança\\n\\nEdgeOne combina CDN com WAF, proteção DDoS e bot management numa plataforma só.\\n\\n**Quando usar:**\\n- Acelerar conteúdo global\\n- Proteger sites contra ataques\\n- Substituir CDN + WAF separados\\n- Reduzir latência para usuários internacionais\\n\\n**Vantagens:**\\n- Free-tier generoso (1M req/mês)\\n- Pay-as-you-go\\n- Rede global de edge\\n- Integração nativa com Lighthouse e CVM\\n- Sem licenciamento complexo\\n\\n## Como Combinar os Produtos\\n\\n| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |\\n|-------|---------------------|---------------|\\n| Ideal para | Sites, blogs, landing pages | Apps dinâmicos, APIs, e-commerce |\\n| Performance | Ótima para conteúdo estático | Máxima flexibilidade |\\n| Custo | Mais baixo | Moderado |\\n| Setup | Minutos | Horas |\\n\\n## Cuidados Antes de Pagar\\n\\n1. **Verifique a região:** Nem todas as promoções estão disponíveis em todas as regiões\\n2. **Elegibilidade:** Algumas ofertas são apenas para novos usuários\\n3. **Validade:** Promoções expiram — confira a data\\n4. **Renovação:** O preço promocional pode não se aplicar na renovação\\n5. **Cupons:** Leia os termos antes de ativar — alguns exigem mínimo de gasto\\n6. **Free-tier:** Confirme se exige cartão de crédito no cadastro\\n\\n## Setup Recomendado para Builders\\n\\n### Site/Blog\\nLighthouse (plano básico) + EdgeOne (free-tier)\\n\\n### API Leve\\nLighthouse (plano médio) + EdgeOne (free-tier)\\n\\n### Bot/Discord Bot\\nLighthouse (plano básico) + EdgeOne (free-tier)\\n\\n### Dashboard/Analytics\\nLighthouse (plano médio) + EdgeOne (pago conforme uso)\\n\\n### Aplicação Completa\\nCVM (spot instance) + EdgeOne (pago)\\n\\n> **Disclaimer:** Preços e promoções estão sujeitos a alteração. Verifique sempre o site oficial da Tencent Cloud para informações atualizadas. Este guia tem caráter educativo e não substitui a consulta aos termos oficiais.\\n","./content/apex/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"UniTeia Apex\\"\\nsubjects: [\\"apex\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# UniTeia Apex\\n\\n通用人工智能知识网络\\nThis is a comprehensive knowledge hub for UniTeia Apex. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/apex/zh/tencent-cloud-deal-stack-builders.md":"---\\nslug: tencent-cloud-deal-stack-builders\\nlang: zh\\ntitle: \\"Tencent Cloud Deal Stack for Builders\\"\\nverdict: trusted\\nquality_score: 95\\nsubjects:\\n  - cloud\\n  - builders\\n  - infrastructure\\n  - tencent-cloud\\nreferral_links:\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Promotions\\n  - url: https://www.tencentcloud.com/products/lighthouse\\n    title: Lighthouse Overview\\n  - url: https://www.tencentcloud.com/products/cvm\\n    title: CVM Overview\\n  - url: https://www.tencentcloud.com/products/teo\\n    title: EdgeOne Overview\\n  - url: https://www.tencentcloud.com/act/pro/promo\\n    title: Tencent Cloud Free Tier\\nmetadata:\\n  created_at: \\"2026-05-15T15:41:13.229Z\\"\\n  updated_at: \\"2026-05-15T15:41:13.229Z\\"\\n  author: UniTeia System\\n  version: 1\\n  sourceCount: 8\\n  trustLevel: low\\n  importedFrom: uniteia-mega-factory\\n  contentPackage: uniteia-content-package/v1\\n---\\n# Tencent Cloud Deal Stack：面向开发者的低价云服务\\n\\n## 什么是Tencent Cloud Deal Stack？\\n\\n腾讯云提供一系列适合独立开发者的产品和促销活动。通过Lighthouse、CVM和EdgeOne，您可以以极低的成本托管网站、API、机器人、仪表盘和小型应用。\\n\\n> **免责声明：** 价格和促销活动可能随时变更。请始终查看腾讯云官方网站获取最新信息。\\n","./content/language-models/en/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"en\\"\\ntitle: \\"Language Models\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.892Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.892Z\\"\\n---\\n\\n# Language Models\\n\\nLLMs, Transformers and NLP\\nThis is a comprehensive knowledge hub for Language Models. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/en/foundation-models-overview.md":"---\\nslug: foundation-models-overview\\nlang: en\\ntitle: Foundation Models Overview\\nverdict: trusted\\nquality_score: 88\\nsubjects:\\n  - llm\\n  - foundation-models\\n  - transformers\\nreferral_links:\\n  - url: https://arxiv.org/abs/2005.14165\\n    title: GPT-3 Paper\\n    description: Language Models are Few-Shot Learners by Brown et al.\\n  - url: https://arxiv.org/abs/1706.03762\\n    title: Attention Is All You Need\\n    description: The original Transformer architecture paper by Vaswani et al.\\nmetadata:\\n  created_at: \\"2026-04-26T12:00:00Z\\"\\n  updated_at: \\"2026-04-26T12:00:00Z\\"\\n  author: UniTeia Editorial\\n  version: 1\\n---\\n\\n# Foundation Models Overview\\n\\nA concise guide to the paradigm shift from task-specific models to general-purpose foundation models — and what it means for developers building on top of them.\\n\\n## What Are Foundation Models?\\n\\nFoundation models are large neural networks trained on broad data at scale, then adapted (fine-tuned, prompted, or retrieved) to a wide range of downstream tasks. The term, coined by Stanford\'s HAI Institute in 2021, captures a key insight: a single model architecture can serve as the *foundation* for many applications.\\n\\nThe core recipe:\\n\\n1. **Pre-training** — Self-supervised learning on massive corpora (web text, code, images, or multimodal mixtures)\\n2. **Alignment** — RLHF, DPO, or constitutional AI to steer behaviour toward helpful, harmless, and honest outputs\\n3. **Adaptation** — Fine-tuning, LoRA, retrieval-augmented generation, or in-context learning for specific use-cases\\n\\n## The Transformer Backbone\\n\\nAlmost every modern foundation model is built on the Transformer architecture introduced by Vaswani et al. in 2017. Its self-attention mechanism allows the model to weigh the relevance of every token in a sequence against every other token — enabling long-range dependencies without recurrence.\\n\\nKey variants:\\n\\n- **Encoder-only** (BERT family) — Bidirectional context, ideal for classification and retrieval\\n- **Decoder-only** (GPT, LLaMA, Mistral) — Autoregressive generation, dominant for chat and completion\\n- **Encoder-decoder** (T5, BART) — Sequence-to-sequence tasks like translation and summarisation\\n\\n## Scale Laws and Compute-Optimal Training\\n\\nThe **Chinchilla scaling laws** (Hoffmann et al., 2022) demonstrated that for a given compute budget, model size and training data should scale proportionally. This insight reshaped the field: smaller models trained on more data often outperform larger models trained on less.\\n\\n**Practical implication:** A 7B-parameter model trained on 2T tokens can match or exceed a 70B model trained on 200B tokens at the same compute cost.\\n\\n## Context Windows and Long-Range Understanding\\n\\nEarly Transformer models operated on 512–2048 token contexts. Modern architectures push this boundary:\\n\\n- **Rotary Position Embeddings (RoPE)** — Enable extrapolation beyond training length\\n- **ALiBi** — Linear bias attention for length extrapolation\\n- **Ring Attention / Block-Sparse** — Distributed attention across devices for 100K+ token contexts\\n\\nThese techniques unlock use-cases like full-document analysis, multi-file codebase reasoning, and extended conversational memory.\\n\\n## Efficiency Innovations\\n\\nTraining and serving foundation models is expensive. Key efficiency gains:\\n\\n- **Mixture of Experts (MoE)** — Activate only a subset of parameters per token (e.g., Mixtral 8×7B uses 13B active params per forward pass)\\n- **Flash Attention** — IO-aware tiled attention that reduces memory reads by 5-10×\\n- **Quantisation (GPTQ, AWQ, GGUF)** — 4-bit and 8-bit inference with minimal quality loss\\n- **Speculative Decoding** — Draft-then-verify pattern that speeds up autoregressive generation\\n\\n## Choosing a Foundation Model\\n\\nConsider these dimensions when selecting a model for a project:\\n\\n| Dimension | Trade-off |\\n|-----------|-----------|\\n| Size vs Speed | Larger models perform better but cost more per token |\\n| Open vs Closed | Open weights enable fine-tuning and local deployment; closed APIs offer convenience |\\n| Context Length | Longer windows enable richer prompts but increase latency and cost |\\n| Specialisation | Domain-specific fine-tunes (code, medical, legal) often outperform generalists in their niche |\\n\\n## Looking Ahead\\n\\nThe field is converging on **hybrid architectures** that blend retrieval, tool use, and reasoning within a single inference path. The boundary between \\"model\\" and \\"system\\" is dissolving — the next generation of foundation models will likely be inseparable from the retrieval, verification, and planning scaffolding around them.\\n","./content/language-models/es/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"es\\"\\ntitle: \\"Modelos de Lenguaje\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# Modelos de Lenguaje\\n\\nLLMs, Transformers y PLN\\nThis is a comprehensive knowledge hub for Modelos de Lenguaje. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/ja/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"ja\\"\\ntitle: \\"言語モデル\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# 言語モデル\\n\\nLLM、トランスフォーマー、自然言語処理\\nThis is a comprehensive knowledge hub for 言語モデル. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/pt/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"pt\\"\\ntitle: \\"Modelos de Linguagem\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# Modelos de Linguagem\\n\\nLLMs, Transformers e PLN\\nThis is a comprehensive knowledge hub for Modelos de Linguagem. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n","./content/language-models/zh/_index.md":"---\\ntype: \\"index\\"\\nslug: \\"_index\\"\\nlang: \\"zh\\"\\ntitle: \\"语言模型\\"\\nsubjects: [\\"language-models\\"]\\nreferral_links: []\\nverdict: \\"trusted\\"\\nquality_score: 100\\nmetadata:\\n  created_at: \\"2026-04-28T08:59:36.893Z\\"\\n  updated_at: \\"2026-04-28T08:59:36.893Z\\"\\n---\\n\\n# 语言模型\\n\\n大语言模型、Transformer 和自然语言处理\\nThis is a comprehensive knowledge hub for 语言模型. We explore autonomous frameworks, tools, and the latest research in this exciting field of artificial intelligence. Our goal is to provide a central repository of information that is easily accessible and always up-to-date for researchers and developers alike.\\n"}'
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

  const contentKey = REGISTRY_PATHS.find(
    k =>
      k.endsWith(`/content/${niche}/${lang}/${slug}.md`) ||
      k.endsWith(`content/${niche}/${lang}/${slug}.md`)
  )
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
  qualityScore?: number
  verdict?: string
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
