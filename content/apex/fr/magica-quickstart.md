---
slug: magica-quickstart
lang: fr
title: "Premiers Pas avec Magica"
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
# Getting Started with Magica

## Create Your Account

Visit try.magica.com and sign up for the free tier — no credit card required. The free tier gives you limited access to all major models, enough to evaluate the platform thoroughly before committing.

Once registered, you land on the Magica workspace. The interface has three main zones: the model selector (top), the conversation workspace (center), and the tool drawer (right sidebar with 5,900+ pre-built tools).

## Your First Multi-Model Query

Click the model selector at the top and enable 2-3 models — start with GPT-4o, Claude Opus 4, and Gemini 2.5 Pro. Type a question in the input field and hit send. Magica dispatches your query to all selected models simultaneously and displays the responses side-by-side.

This multi-model comparison is Magica's killer feature. You immediately see how each model approaches the same prompt — Claude tends toward thorough analysis, GPT toward practical action, Gemini toward balanced synthesis. Over time, you learn which model to trust for which task type.

## Generate Your First Image

Open the tool drawer and switch to the Image tab. Select FLUX 2 Max from the model dropdown. Write a prompt — be descriptive but not over-engineered. Click generate. Within seconds you have four variations to choose from.

Use the editing panel to refine: upscale your chosen variant, remove the background, or regenerate specific regions with inpainting. Magica bundles these editing tools into the same interface — no need to open Photoshop or a separate AI editor.

## Create a Simple Workflow

Workflows are where Magica transcends a simple chatbot. Click the Workflows tab and select New Workflow. You'll see a visual node editor — drag in a Text Input node, connect it to a Generate Image node (FLUX 2 Max), then to an Upscale node, and finally to an Export node.

Set the text input to accept a product description. The workflow will: generate a product image from the description → upscale it 2x → export the final PNG. This entire pipeline runs with one click. You can save it as a reusable workflow app and share it with your team.

## Export and Integrate

Every workflow can be published as an app accessible via API. Go to your workflow, click Publish, and Magica generates an API endpoint with dynamic inputs for your workflow parameters. You can now call it from your own application:

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Next Steps

Once comfortable with the basics, explore:
- **MCP Server setup** — connect Magica to your own tools and data sources
- **Agent memory** — give your workflows persistent context across sessions
- **Team workspaces** — collaborate on workflows with shared assets and version history
- **Custom tools** — write your own MCP tools that Magica agents can discover and use

