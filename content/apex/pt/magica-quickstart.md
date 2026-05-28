---
slug: magica-quickstart
lang: pt
title: "Primeiros Passos com Magica"
verdict: trusted
quality_score: 95
subjects:
  - magica
  - tutorial
  - quickstart
  - ai-workflows
referral_links:
  - url: https://magica.com
    title: Magica Official Site
  - url: https://try.magica.com
    title: Magica Free Trial
  - url: https://docs.magica.com
    title: Magica Documentation
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
  author: UniTeia System
  version: 1
canvas:
  tone: obsidian
  layout: timeline-spiral
  nodes:
    - id: hero
      section: 0
      type: hero
    - id: signup
      section: 1
      type: card
    - id: first-query
      section: 2
      type: card
    - id: multi-model
      section: 3
      type: card
    - id: image-gen
      section: 4
      type: card
    - id: workflow
      section: 5
      type: card
    - id: export
      section: 6
      type: card
    - id: next-steps
      section: 7
      type: card
  connectors:
    - from: hero
      to: signup
    - from: signup
      to: first-query
    - from: first-query
      to: multi-model
    - from: multi-model
      to: image-gen
    - from: image-gen
      to: workflow
    - from: workflow
      to: export
    - from: export
      to: next-steps
---

# Primeiros Passos com Magica

## Crie Sua Conta

Visite [try.magica.com/clique-serio](https://try.magica.com/clique-serio) e cadastre-se no nível gratuito — não é necessário cartão de crédito. Use o código promocional **GXZMYCP** na [página de recompensas](https://try.magica.com/redeem) para ganhar **10M de créditos bônus** (perfeito para vídeos, podcasts e voz). O nível gratuito oferece acesso limitado a todos os principais modelos, suficiente para avaliar a plataforma completamente antes de se comprometer.

Após o registro, você acessa o espaço de trabalho do Magica. A interface tem três zonas principais: o seletor de modelos (topo), o espaço de conversa (centro) e a gaveta de ferramentas (barra lateral direita com mais de 5.900 ferramentas pré-construídas).

## Sua Primeira Consulta Multimodelo

Clique no seletor de modelos no topo e habilite 2 a 3 modelos — comece com [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) e Gemini 2.5 Pro. Digite uma pergunta no campo de entrada e clique em enviar. O Magica envia sua consulta para todos os modelos selecionados simultaneamente e exibe as respostas lado a lado.

Essa comparação multimodelo é o recurso matador do Magica. Você vê imediatamente como cada modelo aborda o mesmo prompt — Claude tende a uma análise completa, GPT a uma ação prática, Gemini a uma síntese equilibrada. Com o tempo, você aprende em qual modelo confiar para cada tipo de tarefa.

## Gere Sua Primeira Imagem

Abra a gaveta de ferramentas e mude para a aba Imagem. Selecione FLUX 2 Max no menu suspenso de modelos. Escreva um prompt — seja descritivo, mas sem exageros. Clique em gerar. Em segundos, você terá quatro variações para escolher.

Use o painel de edição para refinar: aumente a resolução (upscale) da variante escolhida, remova o fundo ou regenere regiões específicas com inpainting. O Magica reúne essas ferramentas de edição na mesma interface — sem necessidade de abrir o Photoshop ou um editor de IA separado.

## Crie um Fluxo de Trabalho Simples

Os fluxos de trabalho (workflows) são onde o Magica transcende um chatbot simples. Clique na aba Workflows e selecione Novo Workflow. Você verá um editor visual de nós — arraste um nó de Entrada de Texto, conecte-o a um nó Gerar Imagem (FLUX 2 Max), depois a um nó de Redimensionamento (Upscale) e, finalmente, a um nó de Exportação.

Configure a entrada de texto para aceitar uma descrição de produto. O fluxo de trabalho irá: gerar uma imagem do produto a partir da descrição → redimensioná-la 2x → exportar o PNG final. Todo esse pipeline é executado com um clique. Você pode salvá-lo como um aplicativo de fluxo de trabalho reutilizável e compartilhá-lo com sua equipe.

## Exporte e Integre

Todo fluxo de trabalho pode ser publicado como um aplicativo acessível via API. Vá para seu fluxo de trabalho, clique em Publicar, e o Magica gera um endpoint de API com entradas dinâmicas para os parâmetros do seu fluxo de trabalho. Agora você pode chamá-lo a partir do seu próprio aplicativo:

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Próximos Passos

Assim que estiver confortável com o básico, explore:
- **Configuração do servidor MCP** — conecte o Magica às suas próprias ferramentas e fontes de dados
- **Memória do agente** — dê aos seus fluxos de trabalho contexto persistente entre sessões
- **Espaços de trabalho em equipe** — colabore em fluxos de trabalho com ativos compartilhados e histórico de versões
- **Ferramentas personalizadas** — escreva suas próprias ferramentas MCP que os agentes do Magica podem descobrir e usar
