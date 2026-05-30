/**
 * north-star-data.ts — UniTeia North Star architecture data
 *
 * 6 layers (L0-L5) mapping infrastructure → user experience
 * 6 agents orchestrating the ecosystem
 *
 * Used by VisualExplainer for live-drawn diagram on homepage.
 * Source: UniTeia mega-factory architecture + entity-graph P0 output.
 */

import type { NorthStarData } from './types'

export const NORTH_STAR_DATA: NorthStarData = {
  layers: [
    {
      id: 'L5',
      label: 'User Experience',
      level: 0.92,
      description:
        '8-locale editorial pages, Living Brief 2-col layout, GenerativeHero, Aether design system — where signals become stories',
      icon: '✦',
      color: 'oklch(75% 0.18 200)',
      agents: ['curator', 'moderator'],
      details: 'SSG via Qwik City · Tailwind v4 · Cloudflare Pages · WCAG AA · 87KB gzip cap',
    },
    {
      id: 'L4',
      label: 'Frontend Engine',
      level: 0.74,
      description:
        'Component hub: 52+ Qwik components, Canvas2D textures, OKLCH token system, depth/tilt/reveal effects',
      icon: '◆',
      color: 'oklch(72% 0.165 80)',
      agents: ['curator'],
      details:
        'Qwik City 1.19 · component$() · $() handlers · useVisibleTask$ · IntersectionObserver',
    },
    {
      id: 'L3',
      label: 'Edge Runtime',
      level: 0.56,
      description:
        'Cloudflare Pages SSG + Worker, search index, sitemap, _routes.json, entity-graph.json endpoint',
      icon: '⬡',
      color: 'oklch(65% 0.14 140)',
      agents: ['analyzer'],
      details: 'CF Workers · wrangler · 100-rule _routes.json limit · no node:fs on edge',
    },
    {
      id: 'L2',
      label: 'Knowledge Graph',
      level: 0.38,
      description:
        'Entity graph (64 entities, 602 edges), P0.2 Query Engine, embeddings (1024d), cosine similarity + graph expansion',
      icon: '◈',
      color: 'oklch(60% 0.2 265)',
      agents: ['analyzer', 'orchestrator'],
      details: 'entity-graph.v1 · perfect-freehand? no — LocalEmbedding · NvidiaNim · GraphRAG',
    },
    {
      id: 'L1',
      label: 'Content Pipeline',
      level: 0.2,
      description:
        '44-agent mega-factory: researcher→writer→translator, LLM providers (9), NeMo DataDesigner, quality gates',
      icon: '▣',
      color: 'oklch(68% 0.18 22)',
      agents: ['researcher', 'writer', 'orchestrator'],
      details: 'Provider Router · fallback chain · SOTA eval · 234 tests · batch-localize',
    },
    {
      id: 'L0',
      label: 'Data Sources',
      level: 0.04,
      description:
        'arXiv papers, blog feeds, web research, entity extraction from markdown frontmatter, trending fetcher',
      icon: '⠿',
      color: 'oklch(60% 0.12 300)',
      agents: ['researcher'],
      details: 'web_search · auto-research · GitHub ingestion · RSS/Atom blogwatcher',
    },
  ],

  agents: [
    {
      id: 'researcher',
      label: 'Researcher',
      icon: '🔬',
      description:
        'Discovers signals from arXiv, blogs, web — Karpathy loop: hypothesize → experiment → log',
      color: 'oklch(60% 0.12 300)',
      output: 'Raw articles · 8-locale stubs · trending data',
    },
    {
      id: 'writer',
      label: 'Writer',
      icon: '✍️',
      description:
        'Generates article bodies, LLM translates across 8 locales, adds hyperlinks + affiliate codes',
      color: 'oklch(68% 0.18 22)',
      output: 'Markdown articles · localized content · entity frontmatter',
    },
    {
      id: 'curator',
      label: 'Curator',
      icon: '🎯',
      description:
        'Scores quality, selects featured signals, organizes niches, maintains editorial standards',
      color: 'oklch(75% 0.18 200)',
      output: 'Quality scores · SignalChip metrics · GenerativeHero clusters',
    },
    {
      id: 'analyzer',
      label: 'Analyzer',
      icon: '📊',
      description:
        'Builds entity graph, runs query engine, computes graph scores, maintains search index',
      color: 'oklch(65% 0.14 140)',
      output: 'Entity graph · embeddings · search index · trending signals',
    },
    {
      id: 'moderator',
      label: 'Moderator',
      icon: '⚖️',
      description:
        'Enforces quality gates (lint/typecheck/test/build), editorial verdicts, bias detection',
      color: 'oklch(72% 0.165 80)',
      output: 'EditorialVerdict · ship:check · WCAG validation · CodeQL',
    },
    {
      id: 'orchestrator',
      label: 'Orchestrator',
      icon: '🧠',
      description:
        'Coordinates all agents, manages pipeline state, schedules cron jobs, delegates work',
      color: 'oklch(60% 0.2 265)',
      output: 'Pipeline runs · state files · deploy artifacts · cron schedules',
    },
  ],

  theme: {
    background: 'oklch(12% 0.02 270)',
    stroke: 'oklch(78% 0.12 195)',
    text: 'oklch(92% 0.03 75)',
    accent: 'oklch(72% 0.165 80)',
  },
}
