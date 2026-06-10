1|---
2|slug: magica-quickstart
3|lang: it
4|title: Primi Passi con Magica
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
62|# Come iniziare con Magica
63|
64|## Crea il tuo account
65|

> 💡 **Nota di trasparenza:** UniTeia potrebbe ricevere una commissione per iscrizioni tramite link in questa pagina. Ciò non influenza la nostra valutazione. Vedi la nostra [politica etica](/ethics).

66|Visita [try.magica.com/clique-serio](https://try.magica.com/clique-serio) e registrati per il livello gratuito — non è richiesta una carta di credito. Usa il codice promozionale **GXZMYCP** sulla [pagina dei premi](https://try.magica.com/redeem) per ottenere **10M di crediti bonus** (perfetto per video, podcast e voce). Il livello gratuito ti dà accesso limitato a tutti i modelli principali, sufficiente per valutare la piattaforma a fondo prima di impegnarti.
67|
68|Una volta registrato, atterri nello spazio di lavoro di Magica. L'interfaccia ha tre zone principali: il selettore del modello (in alto), lo spazio di lavoro della conversazione (al centro) e il cassetto degli strumenti (barra laterale destra con oltre 5.900 strumenti predefiniti).
69|
70|## La tua prima interrogazione multi-modello
71|
72|Fai clic sul selettore del modello in alto e abilita 2-3 modelli — inizia con [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) e Gemini 2.5 Pro. Digita una domanda nel campo di input e premi invio. Magica invia la tua richiesta a tutti i modelli selezionati contemporaneamente e mostra le risposte affiancate.
73|
74|Questo confronto multi-modello è la caratteristica distintiva di Magica. Vedi immediatamente come ogni modello affronta lo stesso prompt — Claude tende a un'analisi approfondita, GPT all'azione pratica, Gemini a una sintesi equilibrata. Con il tempo, impari a quale modello affidarti per ogni tipo di attività.
75|
76|## Genera la tua prima immagine
77|
78|Apri il cassetto degli strumenti e passa alla scheda Immagine. Seleziona FLUX 2 Max dal menu a discesa dei modelli. Scrivi un prompt — sii descrittivo ma non troppo elaborato. Clicca su Genera. In pochi secondi avrai quattro varianti tra cui scegliere.
79|
80|Usa il pannello di modifica per perfezionare: ingrandisci la variante scelta, rimuovi lo sfondo o rigenera regioni specifiche con l'inpainting. Magica raggruppa questi strumenti di modifica nella stessa interfaccia — non c'è bisogno di aprire Photoshop o un editor AI separato.
81|
82|## Crea un semplice flusso di lavoro
83|
84|I flussi di lavoro sono dove Magica supera un semplice chatbot. Fai clic sulla scheda Flussi di lavoro e seleziona Nuovo flusso di lavoro. Vedrai un editor di nodi visivo — trascina un nodo Input di testo, collegalo a un nodo Genera immagine (FLUX 2 Max), poi a un nodo Ingrandisci e infine a un nodo Esporta.
85|
86|Imposta l'input di testo per accettare una descrizione del prodotto. Il flusso di lavoro: genererà un'immagine del prodotto dalla descrizione → la ingrandirà 2x → esporterà il PNG finale. Questa intera pipeline viene eseguita con un clic. Puoi salvarla come app flusso di lavoro riutilizzabile e condividerla con il tuo team.
87|
88|## Esporta e integra
89|
90|Ogni flusso di lavoro può essere pubblicato come un'app accessibile tramite API. Vai al tuo flusso di lavoro, fai clic su Pubblica e Magica genera un endpoint API con input dinamici per i parametri del tuo flusso di lavoro. Ora puoi chiamarlo dalla tua applicazione:
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## Prossimi passi
100|
101|Una volta acquisita familiarità con le basi, esplora:
102|- **Configurazione del server MCP** — connetti Magica ai tuoi strumenti e fonti di dati
103|- **Memoria dell'agente** — dai al tuo flusso di lavoro un contesto persistente tra le sessioni
104|- **Spazi di lavoro di gruppo** — collabora sui flussi di lavoro con risorse condivise e cronologia delle versioni
105|- **Strumenti personalizzati** — scrivi i tuoi strumenti MCP che gli agenti di Magica possono scoprire e utilizzare
106|