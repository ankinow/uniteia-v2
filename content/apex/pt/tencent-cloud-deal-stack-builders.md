---
slug: tencent-cloud-deal-stack-builders
lang: pt
title: "Tencent Cloud Deal Stack: Cloud Barata para Builders"
verdict: trusted
quality_score: 95
subjects:
  - cloud
  - builders
  - infrastructure
  - tencent-cloud
referral_links:
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Promotions
  - url: https://www.tencentcloud.com/products/lighthouse
    title: Lighthouse Overview
  - url: https://www.tencentcloud.com/products/cvm
    title: CVM Overview
  - url: https://www.tencentcloud.com/products/teo
    title: EdgeOne Overview
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Free Tier
metadata:
  created_at: "2026-05-15T15:41:13.221Z"
  updated_at: "2026-05-15T15:41:13.221Z"
  author: UniTeia System
  version: 1
  sourceCount: 8
  trustLevel: low
  importedFrom: uniteia-mega-factory
  contentPackage: uniteia-content-package/v1
canvas:
  tone: obsidian
  layout: constellation
  nodes:
    - id: intro
      section: 0
      type: hero
    - id: free-products
      section: 1
      type: card
    - id: lighthouse
      section: 2
      type: card
    - id: cvm
      section: 3
      type: card
    - id: edgeone
      section: 4
      type: card
    - id: stack-comparison
      section: 5
      type: table
    - id: checklist
      section: 6
      type: list
    - id: recommended-setup
      section: 7
      type: grid
  connectors:
    - from: intro
      to: free-products
    - from: intro
      to: lighthouse
    - from: intro
      to: cvm
    - from: intro
      to: edgeone
    - from: lighthouse
      to: stack-comparison
    - from: cvm
      to: stack-comparison
    - from: edgeone
      to: stack-comparison
    - from: stack-comparison
      to: checklist
    - from: checklist
      to: recommended-setup
---
# Tencent Cloud Deal Stack: Cloud Barata para Builders

## O que é a Tencent Cloud Deal Stack?

A [Tencent Cloud](https://tencentcloud.com) oferece um conjunto de produtos e promoções ideais para builders independentes. Com Lighthouse, CVM e EdgeOne, é possível subir sites, APIs, bots, dashboards e pequenos apps gastando muito pouco — e em alguns casos, nada.

## Produtos Gratuitos

A Tencent Cloud disponibiliza um free-tier com produtos selecionados. Alguns recursos gratuitos incluem:

- EdgeOne: até 1M requisições/mês no plano gratuito
- Lighthouse: período trial em configurações básicas
- CVM: ofertas promocionais para novos usuários

> ⚠️ **Atenção:** Produtos gratuitos podem exigir cadastro com cartão de crédito. Verifique os termos no site oficial.

## Lighthouse — Simplicidade que Roda

O Lighthouse é um VPS simplificado, ideal para quem não quer gerenciar infraestrutura complexa.

**Quando usar:**
- Sites estáticos ou blogs
- APIs leves
- Bots e automações
- Ambientes de desenvolvimento
- Dashboards pessoais

**Vantagens:**
- Especificações fixas, sem surpresas
- Painel simplificado
- Firewall e monitoramento inclusos
- Mais barato que CVM equivalente
- Billing mensal ou por hora

## CVM — Poder Total

CVM (Cloud Virtual Machine) é a solução completa para quem precisa de controle total.

**Quando usar:**
- Aplicações que exigem muito CPU/RAM
- Kubernetes ou Docker avançado
- Kernel customizado ou tuning de rede
- Bancos de dados grandes
- Ambientes que precisam de VPC e security groups

**Vantagens:**
- Configuração totalmente customizável
- Instâncias dedicadas, spot e reservadas
- Discos adicionais (block storage)
- Billing por segundo (mínimo 1 hora)
- Suporte a BYOL

## EdgeOne — CDN + Segurança

EdgeOne combina CDN com WAF, proteção DDoS e bot management numa plataforma só.

**Quando usar:**
- Acelerar conteúdo global
- Proteger sites contra ataques
- Substituir CDN + WAF separados
- Reduzir latência para usuários internacionais

**Vantagens:**
- Free-tier generoso (1M req/mês)
- Pay-as-you-go
- Rede global de edge
- Integração nativa com Lighthouse e CVM
- Sem licenciamento complexo

## Como Combinar os Produtos

| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |
|-------|---------------------|---------------|
| Ideal para | Sites, blogs, landing pages | Apps dinâmicos, APIs, e-commerce |
| Performance | Ótima para conteúdo estático | Máxima flexibilidade |
| Custo | Mais baixo | Moderado |
| Setup | Minutos | Horas |

## Cuidados Antes de Pagar

1. **Verifique a região:** Nem todas as promoções estão disponíveis em todas as regiões
2. **Elegibilidade:** Algumas ofertas são apenas para novos usuários
3. **Validade:** Promoções expiram — confira a data
4. **Renovação:** O preço promocional pode não se aplicar na renovação
5. **Cupons:** Leia os termos antes de ativar — alguns exigem mínimo de gasto
6. **Free-tier:** Confirme se exige cartão de crédito no cadastro

## Setup Recomendado para Builders

### Site/Blog
Lighthouse (plano básico) + EdgeOne (free-tier)

### API Leve
Lighthouse (plano médio) + EdgeOne (free-tier)

### Bot/Discord Bot
Lighthouse (plano básico) + EdgeOne (free-tier)

### Dashboard/Analytics
Lighthouse (plano médio) + EdgeOne (pago conforme uso)

### Aplicação Completa
CVM (spot instance) + EdgeOne (pago)

> **Disclaimer:** Preços e promoções estão sujeitos a alteração. Verifique sempre o site oficial da Tencent Cloud para informações atualizadas. Este guia tem caráter educativo e não substitui a consulta aos termos oficiais.
