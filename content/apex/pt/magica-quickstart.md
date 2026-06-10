1|---
2|slug: magica-quickstart
3|lang: pt
4|title: Primeiros Passos com Magica
5|verdict: trusted
6|quality_score: 95
7|subjects:
8|  - magica
9|  - tutorial
10|  - quickstart
11|  - ai-workflows
12|referral_links: []
13|metadata:
14|  created_at: "2026-06-09T04:00:22.795Z"
15|  updated_at: "2026-06-09T04:00:22.795Z"
16|  author: UniTeia System
17|  version: 1
18|canvas:
19|  tone: coral
20|  layout: timeline-spiral
21|  nodes:
22|    - id: hero
23|      section: 0
24|      type: hero
25|    - id: signup
26|      section: 1
27|      type: card
28|    - id: first-query
29|      section: 2
30|      type: card
31|    - id: multi-model
32|      section: 3
33|      type: card
34|    - id: image-gen
35|      section: 4
36|      type: card
37|    - id: workflow
38|      section: 5
39|      type: card
40|    - id: export
41|      section: 6
42|      type: card
43|    - id: next-steps
44|      section: 7
45|      type: card
46|  connectors:
47|    - from: hero
48|      to: signup
49|    - from: signup
50|      to: first-query
51|    - from: first-query
52|      to: multi-model
53|    - from: multi-model
54|      to: image-gen
55|    - from: image-gen
56|      to: workflow
57|    - from: workflow
58|      to: export
59|    - from: export
60|      to: next-steps
61|---
62|# Primeiros Passos com Magica
63|
64|## Crie Sua Conta
65|

> 💡 **Aviso de transparência:** A UniTeia pode receber comissão por inscrições via links nesta página. Isso não afeta nossa avaliação — só recomendamos ferramentas que testamos. Veja nossa [política de ética](/ethics).

66|Visite [try.magica.com/clique-serio](https://try.magica.com/clique-serio) e cadastre-se no nível gratuito — não é necessário cartão de crédito. Use o código promocional **GXZMYCP** na [página de recompensas](https://try.magica.com/redeem) para ganhar **10M de créditos bônus** (perfeito para vídeos, podcasts e voz). O nível gratuito oferece acesso limitado a todos os principais modelos, suficiente para avaliar a plataforma completamente antes de se comprometer.
67|
68|Após o registro, você acessa o espaço de trabalho do Magica. A interface tem três zonas principais: o seletor de modelos (topo), o espaço de conversa (centro) e a gaveta de ferramentas (barra lateral direita com mais de 5.900 ferramentas pré-construídas).
69|
70|## Sua Primeira Consulta Multimodelo
71|
72|Clique no seletor de modelos no topo e habilite 2 a 3 modelos — comece com [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) e Gemini 2.5 Pro. Digite uma pergunta no campo de entrada e clique em enviar. O Magica envia sua consulta para todos os modelos selecionados simultaneamente e exibe as respostas lado a lado.
73|
74|Essa comparação multimodelo é o recurso matador do Magica. Você vê imediatamente como cada modelo aborda o mesmo prompt — Claude tende a uma análise completa, GPT a uma ação prática, Gemini a uma síntese equilibrada. Com o tempo, você aprende em qual modelo confiar para cada tipo de tarefa.
75|
76|## Gere Sua Primeira Imagem
77|
78|Abra a gaveta de ferramentas e mude para a aba Imagem. Selecione FLUX 2 Max no menu suspenso de modelos. Escreva um prompt — seja descritivo, mas sem exageros. Clique em gerar. Em segundos, você terá quatro variações para escolher.
79|
80|Use o painel de edição para refinar: aumente a resolução (upscale) da variante escolhida, remova o fundo ou regenere regiões específicas com inpainting. O Magica reúne essas ferramentas de edição na mesma interface — sem necessidade de abrir o Photoshop ou um editor de IA separado.
81|
82|## Crie um Fluxo de Trabalho Simples
83|
84|Os fluxos de trabalho (workflows) são onde o Magica transcende um chatbot simples. Clique na aba Workflows e selecione Novo Workflow. Você verá um editor visual de nós — arraste um nó de Entrada de Texto, conecte-o a um nó Gerar Imagem (FLUX 2 Max), depois a um nó de Redimensionamento (Upscale) e, finalmente, a um nó de Exportação.
85|
86|Configure a entrada de texto para aceitar uma descrição de produto. O fluxo de trabalho irá: gerar uma imagem do produto a partir da descrição → redimensioná-la 2x → exportar o PNG final. Todo esse pipeline é executado com um clique. Você pode salvá-lo como um aplicativo de fluxo de trabalho reutilizável e compartilhá-lo com sua equipe.
87|
88|## Exporte e Integre
89|
90|Todo fluxo de trabalho pode ser publicado como um aplicativo acessível via API. Vá para seu fluxo de trabalho, clique em Publicar, e o Magica gera um endpoint de API com entradas dinâmicas para os parâmetros do seu fluxo de trabalho. Agora você pode chamá-lo a partir do seu próprio aplicativo:
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## Próximos Passos
100|
101|Assim que estiver confortável com o básico, explore:
102|- **Configuração do servidor MCP** — conecte o Magica às suas próprias ferramentas e fontes de dados
103|- **Memória do agente** — dê aos seus fluxos de trabalho contexto persistente entre sessões
104|- **Espaços de trabalho em equipe** — colabore em fluxos de trabalho com ativos compartilhados e histórico de versões
105|- **Ferramentas personalizadas** — escreva suas próprias ferramentas MCP que os agentes do Magica podem descobrir e usar
106|