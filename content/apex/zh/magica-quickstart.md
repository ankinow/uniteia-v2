---
slug: magica-quickstart
lang: zh
title: "Magica快速入门"
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

# Magica 入门指南

## 创建账号

访问 try.magica.com 并注册免费套餐——无需信用卡。免费套餐让您有限制地使用所有主流模型，足以在正式投入前全面评估该平台。

注册完成后，您将进入 Magica 工作区。界面包含三个主要区域：模型选择器（顶部）、对话工作区（中央）和工具抽屉（右侧边栏，内含 5,900 多个预制工具）。

## 您的首次多模型查询

点击顶部的模型选择器，启用 2-3 个模型——建议选择 GPT-4o、Claude Opus 4 和 Gemini 2.5 Pro。在输入框中输入问题并点击发送。Magica 会同时将您的查询发送给所有选中的模型，并并排显示回复。

这种多模型对比是 Magica 的核心功能。您能立即看到每个模型如何处理同一提示词——Claude 倾向深入分析，GPT 倾向实际可操作，Gemini 倾向平衡综合。随着时间的推移，您会了解针对不同任务类型应该信任哪个模型。

## 生成您的第一张图像

打开工具抽屉，切换到“图像”选项卡。从模型下拉列表中选择 FLUX 2 Max。编写一段提示词——描述清晰但不要过度设计。点击生成。几秒钟内，您将获得四个可选的变体。

使用编辑面板进行优化：放大选中的变体、去除背景，或通过修补功能重新生成特定区域。Magica 将这些编辑工具整合到同一界面中——无需再打开 Photoshop 或其他独立的 AI 编辑器。

## 创建一个简单的工作流

工作流是 Magica 超越简单聊天机器人的功能所在。点击“工作流”选项卡，选择“新建工作流”。您将看到一个可视化节点编辑器——拖入一个“文本输入”节点，将其连接到“生成图像”节点（FLUX 2 Max），然后连接到“放大”节点，最后连接到“导出”节点。

将文本输入设置为接收产品描述。该工作流将：根据描述生成产品图像 → 放大 2 倍 → 导出最终 PNG。整个流程一键运行。您可以将其保存为可重复使用的工作流应用，并与团队分享。

## 导出和集成

每个工作流都可以作为应用发布，并通过 API 访问。进入您的工作流，点击“发布”，Magica 会为您的工作流参数生成一个带有动态输入的 API 端点。现在您可以从自己的应用程序中调用它：

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## 后续步骤

在掌握基本操作后，进一步探索：
- **MCP 服务器设置**——将 Magica 连接到您自己的工具和数据源
- **代理记忆**——为工作流提供跨会话的持久上下文
- **团队工作区**——通过共享资产和版本历史协作工作流
- **自定义工具**——编写您自己的 MCP 工具，供 Magica 代理发现和使用
