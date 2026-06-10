1|---
2|slug: magica-quickstart
3|lang: zh
4|title: Magica 快速入门
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
62|# Magica 入门指南
63|
64|## 创建账号
65|

> 💡 **透明度通知:** UniTeia可能通过本页链接获得佣金。这不影响我们的评估。请参阅我们的[道德政策](/ethics)。

66|访问 [try.magica.com/clique-serio](https://try.magica.com/clique-serio) 并注册免费套餐——无需信用卡。在[奖励页面](https://try.magica.com/redeem) 使用促销代码 **GXZMYCP**，即可获得 **10M奖励积分**（非常适合视频、播客和语音内容）。免费套餐让您有限制地使用所有主流模型，足以在正式投入前全面评估该平台。
67|
68|注册完成后，您将进入 Magica 工作区。界面包含三个主要区域：模型选择器（顶部）、对话工作区（中央）和工具抽屉（右侧边栏，内含 5,900 多个预制工具）。
69|
70|## 您的首次多模型查询
71|
72|点击顶部的模型选择器，启用 2-3 个模型——建议选择 [GPT-4o](https://openai.com)、[Claude Opus 4](https://anthropic.com) 和 Gemini 2.5 Pro。在输入框中输入问题并点击发送。Magica 会同时将您的查询发送给所有选中的模型，并并排显示回复。
73|
74|这种多模型对比是 Magica 的核心功能。您能立即看到每个模型如何处理同一提示词——Claude 倾向深入分析，GPT 倾向实际可操作，Gemini 倾向平衡综合。随着时间的推移，您会了解针对不同任务类型应该信任哪个模型。
75|
76|## 生成您的第一张图像
77|
78|打开工具抽屉，切换到“图像”选项卡。从模型下拉列表中选择 FLUX 2 Max。编写一段提示词——描述清晰但不要过度设计。点击生成。几秒钟内，您将获得四个可选的变体。
79|
80|使用编辑面板进行优化：放大选中的变体、去除背景，或通过修补功能重新生成特定区域。Magica 将这些编辑工具整合到同一界面中——无需再打开 Photoshop 或其他独立的 AI 编辑器。
81|
82|## 创建一个简单的工作流
83|
84|工作流是 Magica 超越简单聊天机器人的功能所在。点击“工作流”选项卡，选择“新建工作流”。您将看到一个可视化节点编辑器——拖入一个“文本输入”节点，将其连接到“生成图像”节点（FLUX 2 Max），然后连接到“放大”节点，最后连接到“导出”节点。
85|
86|将文本输入设置为接收产品描述。该工作流将：根据描述生成产品图像 → 放大 2 倍 → 导出最终 PNG。整个流程一键运行。您可以将其保存为可重复使用的工作流应用，并与团队分享。
87|
88|## 导出和集成
89|
90|每个工作流都可以作为应用发布，并通过 API 访问。进入您的工作流，点击“发布”，Magica 会为您的工作流参数生成一个带有动态输入的 API 端点。现在您可以从自己的应用程序中调用它：
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## 后续步骤
100|
101|在掌握基本操作后，进一步探索：
102|- **MCP 服务器设置**——将 Magica 连接到您自己的工具和数据源
103|- **代理记忆**——为工作流提供跨会话的持久上下文
104|- **团队工作区**——通过共享资产和版本历史协作工作流
105|- **自定义工具**——编写您自己的 MCP 工具，供 Magica 代理发现和使用
106|