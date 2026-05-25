---
slug: foundation-models-overview
lang: it
title: Panoramica dei Modelli Fondazionali
verdict: trusted
quality_score: 95
subjects:
  - llm
  - foundation-models
  - transformers
referral_links:
  - url: https://arxiv.org/abs/2005.14165
    title: Articolo GPT-3
    description: Language Models are Few-Shot Learners di Brown et al.
  - url: https://arxiv.org/abs/1706.03762
    title: Attention Is All You Need
    description: L'articolo originale sull'architettura Transformer di Vaswani et al.
metadata:
  created_at: "2026-04-26T12:00:00Z"
  updated_at: "2026-05-21T00:00:00Z"
  author: UniTeia System
  version: 1
---
# Panoramica dei Modelli Fondazionali

Una guida concisa al cambio di paradigma dai modelli specifici per compito ai modelli fondazionali di uso generale — e cosa significa per gli sviluppatori che ci costruiscono sopra.

## Cosa Sono i Modelli Fondazionali?

I modelli fondazionali sono grandi reti neurali addestrate su dati estesi su larga scala, poi adattate (fine-tuning, prompting o retrieval) a un'ampia gamma di compiti downstream. Il termine, coniato dall'HAI Institute di Stanford nel 2021, cattura un'intuizione chiave: una singola architettura di modello può fungere da *fondazione* per molte applicazioni.

La ricetta principale:

1. **Pre-training** — Apprendimento auto-supervisionato su corpora massicci (testo web, codice, immagini o miscele multimodali)
2. **Allineamento** — RLHF, DPO o IA costituzionale per indirizzare il comportamento verso output utili, innocui e onesti
3. **Adattamento** — Fine-tuning, LoRA, generazione aumentata da retrieval o apprendimento in contesto per casi d'uso specifici

## La Spina Dorsale Transformer

Quasi tutti i modelli fondazionali moderni sono costruiti sull'architettura Transformer introdotta da Vaswani et al. nel 2017. Il suo meccanismo di self-attention permette al modello di pesare la rilevanza di ogni token in una sequenza rispetto a tutti gli altri token — consentendo dipendenze a lungo raggio senza ricorrenza.

Varianti principali:

- **Encoder-only** (famiglia BERT) — Contesto bidirezionale, ideale per classificazione e retrieval
- **Decoder-only** (GPT, LLaMA, Mistral) — Generazione autoregressiva, dominante per chat e completamento
- **Encoder-decoder** (T5, BART) — Compiti sequenza-a-sequenza come traduzione e riassunto

## Leggi di Scala e Addestramento Ottimale in Termini di Calcolo

Le **leggi di scala Chinchilla** (Hoffmann et al., 2022) hanno dimostrato che, per un dato budget computazionale, la dimensione del modello e i dati di addestramento dovrebbero scalare proporzionalmente. Questa intuizione ha ridefinito il campo: modelli più piccoli addestrati con più dati spesso superano modelli più grandi addestrati con meno dati.

**Implicazione pratica:** Un modello da 7B parametri addestrato su 2T token può eguagliare o superare un modello da 70B addestrato su 200B token allo stesso costo computazionale.

## Finestre di Contesto e Comprensione a Lungo Raggio

I primi modelli Transformer operavano con contesti di 512–2048 token. Le architetture moderne spingono oltre questo limite:

- **Rotary Position Embeddings (RoPE)** — Consentono l'estrapolazione oltre la lunghezza di addestramento
- **ALiBi** — Attenzione con bias lineare per l'estrapolazione di lunghezza
- **Ring Attention / Block-Sparse** — Attenzione distribuita tra dispositivi per contesti di 100K+ token

Queste tecniche abilitano casi d'uso come l'analisi di documenti completi, il ragionamento su basi di codice multi-file e la memoria conversazionale estesa.

## Innovazioni in Efficienza

Addestrare e servire modelli fondazionali è costoso. Principali guadagni in efficienza:

- **Mixture of Experts (MoE)** — Attiva solo un sottoinsieme di parametri per token (es.: Mixtral 8×7B usa 13B parametri attivi per forward pass)
- **Flash Attention** — Attenzione a blocchi consapevole delle I/O che riduce le letture in memoria di 5–10×
- **Quantizzazione (GPTQ, AWQ, GGUF)** — Inferenza a 4 e 8 bit con perdita di qualità minima
- **Speculative Decoding** — Schema bozza-verifica che accelera la generazione autoregressiva

## Scegliere un Modello Fondazionale

Considera queste dimensioni nella scelta di un modello per un progetto:

| Dimensione | Compromesso |
|-----------|-----------|
| Dimensione vs Velocità | I modelli più grandi performano meglio ma costano di più per token |
| Aperto vs Chiuso | I pesi aperti consentono fine-tuning e deployment locale; le API chiuse offrono praticità |
| Lunghezza del Contesto | Finestre più lunghe consentono prompt più ricchi ma aumentano latenza e costo |
| Specializzazione | I fine-tuning specifici di dominio (codice, medicina, legale) spesso superano i generalisti nella loro nicchia |

## Prospettive Future

Il campo sta convergendo verso **architetture ibride** che fondono recupero, uso di strumenti e ragionamento in un unico percorso di inferenza. Il confine tra "modello" e "sistema" si sta dissolvendo — la prossima generazione di modelli fondazionali sarà probabilmente inseparabile dall'impalcatura di recupero, verifica e pianificazione che li circonda.
