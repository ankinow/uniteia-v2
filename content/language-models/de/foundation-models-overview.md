---
slug: foundation-models-overview
lang: de
title: Übersicht über Foundation Models
verdict: trusted
quality_score: 95
subjects:
  - llm
  - foundation-models
  - transformers
referral_links:
  - url: https://arxiv.org/abs/2005.14165
    title: GPT-3-Papier
    description: Language Models are Few-Shot Learners von Brown et al.
  - url: https://arxiv.org/abs/1706.03762
    title: Attention Is All You Need
    description: Der originale Artikel zur Transformer-Architektur von Vaswani et al.
metadata:
  created_at: "2026-04-26T12:00:00Z"
  updated_at: "2026-05-21T00:00:00Z"
  author: UniTeia System
  version: 1
---
# Übersicht über Foundation Models

Ein prägnanter Leitfaden zum Paradigmenwechsel von aufgabenspezifischen Modellen hin zu universellen Foundation Models — und was das für Entwickler bedeutet, die auf ihnen aufbauen.

## Was Sind Foundation Models?

Foundation Models sind große neuronale Netze, die auf breit gefächerten Daten in großem Maßstab trainiert und dann durch Fine-Tuning, Prompting oder Retrieval an eine Vielzahl nachgelagerter Aufgaben angepasst werden. Der vom HAI Institute der Stanford University im Jahr 2021 geprägte Begriff fasst eine zentrale Erkenntnis zusammen: Eine einzige Modellarchitektur kann als *Grundlage* für viele Anwendungen dienen.

Das grundlegende Rezept:

1. **Pre-Training** — Selbstüberwachtes Lernen auf massiven Korpora (Webtext, Code, Bilder oder multimodale Mischungen)
2. **Alignment** — RLHF, DPO oder konstitutionelle KI, um das Verhalten in Richtung hilfreicher, harmloser und ehrlicher Ausgaben zu lenken
3. **Adaption** — Fine-Tuning, LoRA, Retrieval-Augmented Generation oder In-Context Learning für spezifische Anwendungsfälle

## Das Transformer-Rückgrat

Nahezu jedes moderne Foundation Model basiert auf der von Vaswani et al. 2017 eingeführten Transformer-Architektur. Ihr Self-Attention-Mechanismus ermöglicht es dem Modell, die Relevanz jedes Tokens in einer Sequenz im Verhältnis zu allen anderen Tokens zu gewichten — und ermöglicht so weitreichende Abhängigkeiten ohne Rekurrenz.

Wichtige Varianten:

- **Encoder-only** (BERT-Familie) — Bidirektionaler Kontext, ideal für Klassifikation und Retrieval
- **Decoder-only** (GPT, LLaMA, Mistral) — Autoregressive Generierung, dominant für Chat und Vervollständigung
- **Encoder-decoder** (T5, BART) — Sequenz-zu-Sequenz-Aufgaben wie Übersetzung und Zusammenfassung

## Skalierungsgesetze und Rechenoptimiertes Training

Die **Chinchilla-Skalierungsgesetze** (Hoffmann et al., 2022) zeigten, dass bei einem gegebenen Rechenbudget Modellgröße und Trainingsdaten proportional skaliert werden sollten. Diese Erkenntnis hat das Feld neu geformt: Kleinere Modelle, die mit mehr Daten trainiert wurden, übertreffen oft größere Modelle, die mit weniger Daten trainiert wurden.

**Praktische Auswirkung:** Ein 7B-Parameter-Modell, das mit 2T Tokens trainiert wurde, kann ein 70B-Modell, das mit 200B Tokens trainiert wurde, bei gleichen Rechenkosten erreichen oder übertreffen.

## Kontextfenster und Langstreckenverständnis

Frühe Transformer-Modelle arbeiteten mit Kontexten von 512–2048 Tokens. Moderne Architekturen erweitern diese Grenze:

- **Rotary Position Embeddings (RoPE)** — Ermöglichen Extrapolation über die Trainingslänge hinaus
- **ALiBi** — Linearer Bias in der Aufmerksamkeit zur Längenextrapolation
- **Ring Attention / Block-Sparse** — Verteilte Aufmerksamkeit über Geräte hinweg für Kontexte mit 100K+ Tokens

Diese Techniken erschließen Anwendungsfälle wie die Analyse vollständiger Dokumente, das Reasoning über Codebasen mit mehreren Dateien und erweiterte Gesprächsgedächtnisse.

## Effizienzinnovationen

Das Trainieren und Betreiben von Foundation Models ist teuer. Wichtige Effizienzgewinne:

- **Mixture of Experts (MoE)** — Aktiviert nur eine Teilmenge der Parameter pro Token (z. B. verwendet Mixtral 8×7B 13B aktive Parameter pro Forward Pass)
- **Flash Attention** — E/A-bewusste Attention in Blöcken, die Speicherzugriffe um das 5- bis 10-fache reduziert
- **Quantisierung (GPTQ, AWQ, GGUF)** — 4-Bit- und 8-Bit-Inferenz mit minimalem Qualitätsverlust
- **Speculative Decoding** — Entwurf-und-Prüfung-Muster, das die autoregressive Generierung beschleunigt

## Auswahl eines Foundation Models

Berücksichtigen Sie diese Dimensionen bei der Auswahl eines Modells für ein Projekt:

| Dimension | Abwägung |
|-----------|----------|
| Größe vs Geschwindigkeit | Größere Modelle liefern bessere Ergebnisse, kosten aber mehr pro Token |
| Offen vs Geschlossen | Offene Gewichtungen ermöglichen Fine-Tuning und lokalen Betrieb; geschlossene APIs bieten Komfort |
| Kontextlänge | Längere Fenster ermöglichen reichhaltigere Prompts, erhöhen aber Latenz und Kosten |
| Spezialisierung | Domänenspezifische Fine-Tunings (Code, Medizin, Recht) übertreffen Generalisten oft in ihrer Nische |

## Ausblick

Das Feld konvergiert hin zu **hybriden Architekturen**, die Retrieval, Werkzeugnutzung und Reasoning innerhalb eines einzigen Inferenzpfads vereinen. Die Grenze zwischen «Modell» und «System» löst sich auf — die nächste Generation von Foundation Models wird wahrscheinlich untrennbar mit dem Retrieval-, Verifikations- und Planungsgerüst um sie herum verbunden sein.
