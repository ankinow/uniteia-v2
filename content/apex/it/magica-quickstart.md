---
slug: magica-quickstart
lang: it
title: "Primei Passi con Magica"
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

# Come iniziare con Magica

## Crea il tuo account

Visita try.magica.com e registrati per il livello gratuito — non è richiesta una carta di credito. Il livello gratuito ti dà accesso limitato a tutti i modelli principali, sufficiente per valutare la piattaforma a fondo prima di impegnarti.

Una volta registrato, atterri nello spazio di lavoro di Magica. L'interfaccia ha tre zone principali: il selettore del modello (in alto), lo spazio di lavoro della conversazione (al centro) e il cassetto degli strumenti (barra laterale destra con oltre 5.900 strumenti predefiniti).

## La tua prima interrogazione multi-modello

Fai clic sul selettore del modello in alto e abilita 2-3 modelli — inizia con [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) e Gemini 2.5 Pro. Digita una domanda nel campo di input e premi invio. Magica invia la tua richiesta a tutti i modelli selezionati contemporaneamente e mostra le risposte affiancate.

Questo confronto multi-modello è la caratteristica distintiva di Magica. Vedi immediatamente come ogni modello affronta lo stesso prompt — Claude tende a un'analisi approfondita, GPT all'azione pratica, Gemini a una sintesi equilibrata. Con il tempo, impari a quale modello affidarti per ogni tipo di attività.

## Genera la tua prima immagine

Apri il cassetto degli strumenti e passa alla scheda Immagine. Seleziona FLUX 2 Max dal menu a discesa dei modelli. Scrivi un prompt — sii descrittivo ma non troppo elaborato. Clicca su Genera. In pochi secondi avrai quattro varianti tra cui scegliere.

Usa il pannello di modifica per perfezionare: ingrandisci la variante scelta, rimuovi lo sfondo o rigenera regioni specifiche con l'inpainting. Magica raggruppa questi strumenti di modifica nella stessa interfaccia — non c'è bisogno di aprire Photoshop o un editor AI separato.

## Crea un semplice flusso di lavoro

I flussi di lavoro sono dove Magica supera un semplice chatbot. Fai clic sulla scheda Flussi di lavoro e seleziona Nuovo flusso di lavoro. Vedrai un editor di nodi visivo — trascina un nodo Input di testo, collegalo a un nodo Genera immagine (FLUX 2 Max), poi a un nodo Ingrandisci e infine a un nodo Esporta.

Imposta l'input di testo per accettare una descrizione del prodotto. Il flusso di lavoro: genererà un'immagine del prodotto dalla descrizione → la ingrandirà 2x → esporterà il PNG finale. Questa intera pipeline viene eseguita con un clic. Puoi salvarla come app flusso di lavoro riutilizzabile e condividerla con il tuo team.

## Esporta e integra

Ogni flusso di lavoro può essere pubblicato come un'app accessibile tramite API. Vai al tuo flusso di lavoro, fai clic su Pubblica e Magica genera un endpoint API con input dinamici per i parametri del tuo flusso di lavoro. Ora puoi chiamarlo dalla tua applicazione:

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Prossimi passi

Una volta acquisita familiarità con le basi, esplora:
- **Configurazione del server MCP** — connetti Magica ai tuoi strumenti e fonti di dati
- **Memoria dell'agente** — dai al tuo flusso di lavoro un contesto persistente tra le sessioni
- **Spazi di lavoro di gruppo** — collabora sui flussi di lavoro con risorse condivise e cronologia delle versioni
- **Strumenti personalizzati** — scrivi i tuoi strumenti MCP che gli agenti di Magica possono scoprire e utilizzare
