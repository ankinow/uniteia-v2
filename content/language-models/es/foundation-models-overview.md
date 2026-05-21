---
slug: foundation-models-overview
lang: es
title: Visión General de los Modelos Fundacionales
verdict: trusted
quality_score: 95
subjects:
  - llm
  - foundation-models
  - transformers
referral_links:
  - url: https://arxiv.org/abs/2005.14165
    title: Artículo GPT-3
    description: Language Models are Few-Shot Learners por Brown et al.
  - url: https://arxiv.org/abs/1706.03762
    title: Attention Is All You Need
    description: El artículo original sobre la arquitectura Transformer por Vaswani et al.
metadata:
  created_at: "2026-04-26T12:00:00Z"
  updated_at: "2026-05-21T00:00:00Z"
  author: UniTeia System
  version: 1
---
# Foundation Models Overview

A concise guide to the paradigm shift from task-specific models to general-purpose foundation models — and what it means for developers building on top of them.

## What Are Foundation Models?

Foundation models are large neural networks trained on broad data at scale, then adapted (fine-tuned, prompted, or retrieved) to a wide range of downstream tasks. The term, coined by Stanford's HAI Institute in 2021, captures a key insight: a single model architecture can serve as the *foundation* for many applications.

The core recipe:

1. **Pre-training** — Self-supervised learning on massive corpora (web text, code, images, or multimodal mixtures)
2. **Alignment** — RLHF, DPO, or constitutional AI to steer behaviour toward helpful, harmless, and honest outputs
3. **Adaptation** — Fine-tuning, LoRA, retrieval-augmented generation, or in-context learning for specific use-cases

## The Transformer Backbone

Almost every modern foundation model is built on the Transformer architecture introduced by Vaswani et al. in 2017. Its self-attention mechanism allows the model to weigh the relevance of every token in a sequence against every other token — enabling long-range dependencies without recurrence.

Key variants:

- **Encoder-only** (BERT family) — Bidirectional context, ideal for classification and retrieval
- **Decoder-only** (GPT, LLaMA, Mistral) — Autoregressive generation, dominant for chat and completion
- **Encoder-decoder** (T5, BART) — Sequence-to-sequence tasks like translation and summarisation

## Scale Laws and Compute-Optimal Training

The **Chinchilla scaling laws** (Hoffmann et al., 2022) demonstrated that for a given compute budget, model size and training data should scale proportionally. This insight reshaped the field: smaller models trained on more data often outperform larger models trained on less.

**Practical implication:** A 7B-parameter model trained on 2T tokens can match or exceed a 70B model trained on 200B tokens at the same compute cost.

## Context Windows and Long-Range Understanding

Early Transformer models operated on 512–2048 token contexts. Modern architectures push this boundary:

- **Rotary Position Embeddings (RoPE)** — Enable extrapolation beyond training length
- **ALiBi** — Linear bias attention for length extrapolation
- **Ring Attention / Block-Sparse** — Distributed attention across devices for 100K+ token contexts

These techniques unlock use-cases like full-document analysis, multi-file codebase reasoning, and extended conversational memory.

## Efficiency Innovations

Training and serving foundation models is expensive. Key efficiency gains:

- **Mixture of Experts (MoE)** — Activate only a subset of parameters per token (e.g., Mixtral 8×7B uses 13B active params per forward pass)
- **Flash Attention** — IO-aware tiled attention that reduces memory reads by 5-10×
- **Quantisation (GPTQ, AWQ, GGUF)** — 4-bit and 8-bit inference with minimal quality loss
- **Speculative Decoding** — Draft-then-verify pattern that speeds up autoregressive generation

## Choosing a Foundation Model

Consider these dimensions when selecting a model for a project:

| Dimension | Trade-off |
|-----------|-----------|
| Size vs Speed | Larger models perform better but cost more per token |
| Open vs Closed | Open weights enable fine-tuning and local deployment; closed APIs offer convenience |
| Context Length | Longer windows enable richer prompts but increase latency and cost |
| Specialisation | Domain-specific fine-tunes (code, medical, legal) often outperform generalists in their niche |

## Looking Ahead

The field is converging on **hybrid architectures** that blend retrieval, tool use, and reasoning within a single inference path. The boundary between "model" and "system" is dissolving — the next generation of foundation models will likely be inseparable from the retrieval, verification, and planning scaffolding around them.
