# Linkgraph Report

**Generated:** 2026-06-09T01:58:55.505Z
**Source:** content-graph.generated (2026-06-09T01:48:29.153Z)
**Nodes:** 96
**Edges:** 1453

## Edge Kind Distribution

| Edge Kind | Count |
|-----------|-------|
| translated-as | 672 |
| belongs-to-niche | 480 |
| related-to | 301 |

## Edge Reciprocity

Reciprocity measures how often edges of a given kind are bidirectional (A→B and B→A both exist).
Kinds marked as *expected asymmetric* are designed to be one-directional; low reciprocity there is normal.

| Edge Kind | Total | Reciprocal | % Reciprocal |
|-----------|-------|------------|--------------|
| translated-as | 672 | 672 | 100% |
| belongs-to-niche | 480 | 150 | 31% (expected) |
| related-to | 301 | 196 | 65% (expected) |

## Top Linked Nodes (by degree centrality)

Nodes with the highest total degree (inbound + outbound connections):

| Title | Slug | Inbound | Outbound | Total |
|-------|------|---------|----------|-------|
| OpenCode: Build Software Without Knowing How to Code | `opencode-vibecoders` | 61 | 16 | 77 |
| Getting Started with Magica | `magica-quickstart` | 60 | 16 | 76 |
| Building MCP Servers with Magica | `magica-mcp-server` | 60 | 16 | 76 |
| Tencent Cloud Deal Stack for Builders | `tencent-cloud-deal-stack-builders` | 60 | 16 | 76 |
| Magica: The AI Command Center | `magica-overview` | 59 | 16 | 75 |

> Full node list with individual degree scores: see appendix below.

## Niche Connectivity

For each niche, this section reports how many internal edges exist (edges where both endpoints share at least one niche) and which other niches it connects to.

### apex

- Nodes: 48
- Internal edges: 768
- Connected to: `ai-agents`, `cloud-computing`, `virtual-machines`

### ai-agents

- Nodes: 16
- Internal edges: 202
- Connected to: `apex`, `cloud-computing`

### llm-comparison

- Nodes: 16
- Internal edges: 208
- Connected to: *none*

### cloud-computing

- Nodes: 8
- Internal edges: 96
- Connected to: `ai-agents`, `apex`

### virtual-machines

- Nodes: 8
- Internal edges: 96
- Connected to: `apex`

## Appendix: Full Node List

| ID | Title | Slug | Locale | Niches |
|----|-------|------|--------|--------|
| `en-magica-overview` | Magica: The AI Command Center | `magica-overview` | en | `apex` |
| `en-magica-quickstart` | Getting Started with Magica | `magica-quickstart` | en | `apex` |
| `en-magica-mcp-server` | Building MCP Servers with Magica | `magica-mcp-server` | en | `apex` |
| `en-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack for Builders | `tencent-cloud-deal-stack-builders` | en | `apex` |
| `en-opencode-vibecoders` | OpenCode: Build Software Without Knowing How to Code | `opencode-vibecoders` | en | `apex` |
| `en-multi-agent-vibecoding` | Multi-Agent Vibecoding: Let AI Agents Work Together For You | `multi-agent-vibecoding` | en | `apex` |
| `es-magica-overview` | Magica: El Centro de Comando de IA | `magica-overview` | es | `apex` |
| `es-magica-quickstart` | Primeros Pasos con Magica | `magica-quickstart` | es | `apex` |
| `es-magica-mcp-server` | Construyendo Servidores MCP con Magica | `magica-mcp-server` | es | `apex` |
| `es-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack para Creadores | `tencent-cloud-deal-stack-builders` | es | `apex` |
| `es-opencode-vibecoders` | OpenCode: Crea Software Sin Saber Programar | `opencode-vibecoders` | es | `apex` |
| `es-multi-agent-vibecoding` | Multi-Agent Vibecoding: Deja Que Varios Agentes Trabajen Para Ti | `multi-agent-vibecoding` | es | `apex` |
| `ja-magica-overview` | Magica: AIコマンドセンター | `magica-overview` | ja | `apex` |
| `ja-magica-quickstart` | Magica 入門 | `magica-quickstart` | ja | `apex` |
| `ja-magica-mcp-server` | MagicaでMCPサーバーを構築する | `magica-mcp-server` | ja | `apex` |
| `ja-tencent-cloud-deal-stack-builders` | 開発者向けTencent Cloud Deal Stack | `tencent-cloud-deal-stack-builders` | ja | `apex` |
| `ja-opencode-vibecoders` | OpenCode: プログラミングなしでソフトウェアを作ろう | `opencode-vibecoders` | ja | `apex` |
| `ja-multi-agent-vibecoding` | マルチエージェントVibecoding: 複数のAIエージェントに働いてもらおう | `multi-agent-vibecoding` | ja | `apex` |
| `pt-magica-overview` | Magica: O Centro de Comando de IA | `magica-overview` | pt | `apex` |
| `pt-magica-quickstart` | Primeiros Passos com Magica | `magica-quickstart` | pt | `apex` |
| `pt-magica-mcp-server` | Construindo Servidores MCP com Magica | `magica-mcp-server` | pt | `apex` |
| `pt-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack: Cloud Barata para Builders | `tencent-cloud-deal-stack-builders` | pt | `apex` |
| `pt-opencode-vibecoders` | OpenCode: Crie Software Sem Saber Programar | `opencode-vibecoders` | pt | `apex` |
| `pt-multi-agent-vibecoding` | Multi-Agent Vibecoding: Deixe Vários Agentes de IA Trabalharem Juntos pra Você | `multi-agent-vibecoding` | pt | `apex` |
| `zh-magica-overview` | Magica：AI指挥中心 | `magica-overview` | zh | `apex` |
| `zh-magica-quickstart` | Magica 快速入门 | `magica-quickstart` | zh | `apex` |
| `zh-magica-mcp-server` | 使用 Magica 构建MCP服务器 | `magica-mcp-server` | zh | `apex` |
| `zh-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack 开发者版 | `tencent-cloud-deal-stack-builders` | zh | `apex` |
| `zh-opencode-vibecoders` | OpenCode: 不会编程也能创建软件 | `opencode-vibecoders` | zh | `apex` |
| `zh-multi-agent-vibecoding` | 多代理Vibecoding: 让多个AI代理一起为你工作 | `multi-agent-vibecoding` | zh | `apex` |
| `de-magica-overview` | Magica: Das KI-Kommandozentrum | `magica-overview` | de | `apex` |
| `de-magica-quickstart` | Erste Schritte mit Magica | `magica-quickstart` | de | `apex` |
| `de-magica-mcp-server` | MCP-Server mit Magica erstellen | `magica-mcp-server` | de | `apex` |
| `de-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack für Entwickler | `tencent-cloud-deal-stack-builders` | de | `apex` |
| `de-opencode-vibecoders` | OpenCode: Erstelle Software Ohne Programmieren zu Können | `opencode-vibecoders` | de | `apex` |
| `de-multi-agent-vibecoding` | Multi-Agent Vibecoding: Lass Mehrere Agenten Zusammenarbeiten | `multi-agent-vibecoding` | de | `apex` |
| `fr-magica-overview` | Magica: Le Centre de Commandement IA | `magica-overview` | fr | `apex` |
| `fr-magica-quickstart` | Premiers Pas avec Magica | `magica-quickstart` | fr | `apex` |
| `fr-magica-mcp-server` | Construire des Serveurs MCP avec Magica | `magica-mcp-server` | fr | `apex` |
| `fr-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack pour les Créateurs | `tencent-cloud-deal-stack-builders` | fr | `apex` |
| `fr-opencode-vibecoders` | OpenCode: Créez des Logiciels Sans Savoir Coder | `opencode-vibecoders` | fr | `apex` |
| `fr-multi-agent-vibecoding` | Multi-Agent Vibecoding: Laissez Plusieurs Agents Travailler Ensemble | `multi-agent-vibecoding` | fr | `apex` |
| `it-magica-overview` | Magica: Il Centro di Comando AI | `magica-overview` | it | `apex` |
| `it-magica-quickstart` | Primi Passi con Magica | `magica-quickstart` | it | `apex` |
| `it-magica-mcp-server` | Costruire Server MCP con Magica | `magica-mcp-server` | it | `apex` |
| `it-tencent-cloud-deal-stack-builders` | Tencent Cloud Deal Stack per Sviluppatori | `tencent-cloud-deal-stack-builders` | it | `apex` |
| `it-opencode-vibecoders` | OpenCode: Crea Software Senza Saper Programmare | `opencode-vibecoders` | it | `apex` |
| `it-multi-agent-vibecoding` | Multi-Agent Vibecoding: Lascia Che Più Agenti Lavorino Per Te | `multi-agent-vibecoding` | it | `apex` |
| `en-what-are-ai-agents` | What are AI Agents and Why You Should Care | `what-are-ai-agents` | en | `ai-agents` |
| `en-building-ai-agents` | The Beginner's Guide to Building AI Agents in 2026 | `building-ai-agents` | en | `ai-agents` |
| `pt-what-are-ai-agents` | O que são Agentes de IA e por que você deve se importar | `what-are-ai-agents` | pt | `ai-agents` |
| `pt-building-ai-agents` | O Guia do Iniciante para Construir Agentes de IA em 2026 | `building-ai-agents` | pt | `ai-agents` |
| `es-what-are-ai-agents` | Qué son los Agentes de IA y por que deberian importarte | `what-are-ai-agents` | es | `ai-agents` |
| `es-building-ai-agents` | La guia para principiantes para construir agentes de IA en 2026 | `building-ai-agents` | es | `ai-agents` |
| `fr-what-are-ai-agents` | Que sont les Agents d'IA et pourquoi devriez-vous vous en soucier | `what-are-ai-agents` | fr | `ai-agents` |
| `fr-building-ai-agents` | Le guide du debutant pour creer des agents d'IA en 2026 | `building-ai-agents` | fr | `ai-agents` |
| `de-what-are-ai-agents` | Was sind KI-Agenten und warum Sie sich dafür interessieren sollten | `what-are-ai-agents` | de | `ai-agents` |
| `de-building-ai-agents` | Der Leitfaden fuer Einsteiger zum Erstellen von KI-Agenten im Jahr 2026 | `building-ai-agents` | de | `ai-agents` |
| `it-what-are-ai-agents` | Cosa sono gli Agenti AI e perché dovresti occupartene | `what-are-ai-agents` | it | `ai-agents` |
| `it-building-ai-agents` | La guida per principianti alla creazione di agenti AI nel 2026 | `building-ai-agents` | it | `ai-agents` |
| `ja-what-are-ai-agents` | AIエージェントとは何か、そしてなぜ注目すべきなのか | `what-are-ai-agents` | ja | `ai-agents` |
| `ja-building-ai-agents` | 2026年におけるAIエージェント構築の初心者向けガイド | `building-ai-agents` | ja | `ai-agents` |
| `zh-what-are-ai-agents` | 什么是 AI 代理以及为什么您应该关注 | `what-are-ai-agents` | zh | `ai-agents` |
| `zh-building-ai-agents` | 2026年构建 AI 代理的初学者指南 | `building-ai-agents` | zh | `ai-agents` |
| `en-evaluating-llms` | How to Evaluate and Choose the Best LLM for Your Project | `evaluating-llms` | en | `llm-comparison` |
| `en-llm-comparison-frontier` | Frontier LLM Comparison: GPT-4o, Claude 4, and Gemini 2.5 | `llm-comparison-frontier` | en | `llm-comparison` |
| `pt-evaluating-llms` | Como Avaliar e Escolher o Melhor LLM para o seu Projeto | `evaluating-llms` | pt | `llm-comparison` |
| `pt-llm-comparison-frontier` | Comparação de LLMs de Fronteira: GPT-4o, Claude 4 e Gemini 2.5 | `llm-comparison-frontier` | pt | `llm-comparison` |
| `es-evaluating-llms` | Cómo evaluar y elegir el mejor LLM para tu proyecto | `evaluating-llms` | es | `llm-comparison` |
| `es-llm-comparison-frontier` | Comparación de LLMs de Frontera: GPT-4o, Claude 4 y Gemini 2.5 | `llm-comparison-frontier` | es | `llm-comparison` |
| `fr-evaluating-llms` | Comment évaluer et choisir le meilleur LLM pour votre projet | `evaluating-llms` | fr | `llm-comparison` |
| `fr-llm-comparison-frontier` | Comparaison des LLMs de Pointe : GPT-4o, Claude 4 et Gemini 2.5 | `llm-comparison-frontier` | fr | `llm-comparison` |
| `de-evaluating-llms` | So bewerten und wählen Sie das beste LLM für Ihr Projekt aus | `evaluating-llms` | de | `llm-comparison` |
| `de-llm-comparison-frontier` | Frontier-LLM-Vergleich: GPT-4o, Claude 4 und Gemini 2.5 | `llm-comparison-frontier` | de | `llm-comparison` |
| `it-evaluating-llms` | Come valutare e scegliere il miglior LLM per il tuo progetto | `evaluating-llms` | it | `llm-comparison` |
| `it-llm-comparison-frontier` | Confronto LLM d'Avanguardia: GPT-4o, Claude 4 e Gemini 2.5 | `llm-comparison-frontier` | it | `llm-comparison` |
| `ja-evaluating-llms` | プロジェクトに最適なLLMを評価して選択する方法 | `evaluating-llms` | ja | `llm-comparison` |
| `ja-llm-comparison-frontier` | 最前線LLM比較: GPT-4o, Claude 4, Gemini 2.5 | `llm-comparison-frontier` | ja | `llm-comparison` |
| `zh-evaluating-llms` | 如何评估并为您的项目选择最佳大语言模型 | `evaluating-llms` | zh | `llm-comparison` |
| `zh-llm-comparison-frontier` | 前沿大语言模型比较：GPT-4o、Claude 4 和 Gemini 2.5 | `llm-comparison-frontier` | zh | `llm-comparison` |
| `en-cloud-hosting-vibecoders` | Zero-DevOps Cloud Hosting: A Guide for Vibecoders | `cloud-hosting-vibecoders` | en | `cloud-computing` |
| `pt-cloud-hosting-vibecoders` | Hospedagem em Nuvem Zero-DevOps: Um Guia para Vibecoders | `cloud-hosting-vibecoders` | pt | `cloud-computing` |
| `es-cloud-hosting-vibecoders` | Hospedaje en la nube Zero-DevOps: Una guia para vibecoders | `cloud-hosting-vibecoders` | es | `cloud-computing` |
| `fr-cloud-hosting-vibecoders` | Hébergement Cloud Zero-DevOps : Un Guide pour les Vibecoders | `cloud-hosting-vibecoders` | fr | `cloud-computing` |
| `de-cloud-hosting-vibecoders` | Zero-DevOps Cloud Hosting: Ein Leitfaden fuer Vibecoder | `cloud-hosting-vibecoders` | de | `cloud-computing` |
| `it-cloud-hosting-vibecoders` | Hosting Cloud Zero-DevOps: Una Guida per i Vibecoder | `cloud-hosting-vibecoders` | it | `cloud-computing` |
| `ja-cloud-hosting-vibecoders` | Zero-DevOpsクラウドホスティング：バイブコーダー向けガイド | `cloud-hosting-vibecoders` | ja | `cloud-computing` |
| `zh-cloud-hosting-vibecoders` | 零运维云托管：Vibecoders 指南 | `cloud-hosting-vibecoders` | zh | `cloud-computing` |
| `en-vm-orchestration-guide` | Demystifying Virtual Machines for AI Developers | `vm-orchestration-guide` | en | `virtual-machines` |
| `pt-vm-orchestration-guide` | Desmistificando Máquinas Virtuais para Desenvolvedores de IA | `vm-orchestration-guide` | pt | `virtual-machines` |
| `es-vm-orchestration-guide` | Desmitificando maquinas virtuales para desarrolladores de IA | `vm-orchestration-guide` | es | `virtual-machines` |
| `fr-vm-orchestration-guide` | Démystifier les Machines Virtuelles pour les Développeurs d'IA | `vm-orchestration-guide` | fr | `virtual-machines` |
| `de-vm-orchestration-guide` | Virtuelle Maschinen für KI-Entwickler entmystifizieren | `vm-orchestration-guide` | de | `virtual-machines` |
| `it-vm-orchestration-guide` | Demistificare le Macchine Virtuali per gli Sviluppatori AI | `vm-orchestration-guide` | it | `virtual-machines` |
| `ja-vm-orchestration-guide` | AI開発者のための仮想マシン入門 | `vm-orchestration-guide` | ja | `virtual-machines` |
| `zh-vm-orchestration-guide` | 为 AI 开发者揭秘虚拟机 | `vm-orchestration-guide` | zh | `virtual-machines` |

---

*Report generated by scripts/generate-linkgraph-report.ts at 2026-06-09T01:58:55.506Z*
