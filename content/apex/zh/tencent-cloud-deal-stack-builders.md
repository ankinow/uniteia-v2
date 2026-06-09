---
slug: tencent-cloud-deal-stack-builders
lang: zh
title: Tencent Cloud Deal Stack 开发者版
verdict: caution
quality_score: 90
subjects:
  - cloud
  - builders
  - infrastructure
  - tencent-cloud
referral_links:
  - url: /en/signals/apex/magica-mcp-server
    title: magica-mcp-server
  - url: /en/signals/apex/magica-overview
    title: magica-overview
  - url: /en/signals/apex/magica-quickstart
    title: magica-quickstart
metadata:
  created_at: "2026-06-09T04:00:22.795Z"
  updated_at: "2026-06-09T04:00:22.795Z"
  author: UniTeia System
  version: 1
canvas:
  tone: obsidian
  layout: constellation
  nodes:
    - id: what-is-the-tencent-cloud-deal-stack
      section: What is the Tencent Cloud Deal Stack?
      type: hero
    - id: free-products
      section: Free Products
      type: card
---
# Tencent Cloud Deal Stack: 面向构建者的廉价云

## 什么是 Tencent Cloud Deal Stack?

Tencent Cloud 提供一系列适合独立构建者的产品和促销活动。通过 Lighthouse、CVM 和 EdgeOne,您可以托管网站、API、机器人、仪表板和小型应用程序,花费很少 — 在某些情况下甚至免费。

## 免费产品

Tencent Cloud 为选定的产品提供免费层级。免费资源包括:

- **EdgeOne:** 免费计划每月最多100万次请求
- **Lighthouse:** 基础配置的试用期
- **CVM:** 新用户促销优惠

> ⚠️ **注意:** 免费产品可能需要注册信用卡。请查看官方条款。

## Lighthouse — 简单有效

Lighthouse 是简化的 VPS,适合不想管理复杂基础设施的用户。

**何时使用:**
- 静态网站或博客
- 轻量级 API
- 机器人和自动化
- 开发环境
- 个人仪表板

**优势:**
- 固定规格,无意外
- 简化的仪表板
- 包含防火墙和监控
- 比同等 CVM 更便宜
- 按月或按小时计费

## CVM — 完整性能

CVM (Cloud Virtual Machine) 是需要完全控制的用户的完整解决方案。

**何时使用:**
- CPU/RAM 密集型应用程序
- Kubernetes 或高级 Docker
- 自定义内核或网络调优
- 大型数据库
- 需要 VPC 和安全组的环境

**优势:**
- 完全可定制的配置
- 专用、竞价和预留实例
- 额外块存储
- 按秒计费(最少1小时)
- BYOL 支持

## EdgeOne — CDN + 安全

EdgeOne 将 CDN 与 WAF、DDoS 保护和机器人管理结合在一个平台中。

**何时使用:**
- 加速全球内容分发
- 保护网站免受攻击
- 替换独立的 CDN + WAF
- 降低国际用户的延迟

**优势:**
- 慷慨的免费层级(每月100万请求)
- 按使用量付费
- 全球边缘网络
- 与 Lighthouse 和 CVM 原生集成
- 无需复杂许可

## 如何组合产品

| 堆栈 | Lighthouse + EdgeOne | CVM + EdgeOne |
|------|---------------------|---------------|
| 最适合 | 网站、博客、落地页 | 动态应用、API、电商 |
| 性能 | 静态内容极佳 | 最大灵活性 |
| 成本 | 最低 | 中等 |
| 设置 | 分钟级 | 小时级 |

## 付款前检查清单

1. **检查区域:** 并非所有促销在所有区域都可用
2. **资格:** 某些优惠仅限新用户
3. **有效期:** 促销会过期 — 检查日期
4. **续费:** 促销价格可能不适用于续费
5. **优惠券:** 激活前阅读条款 — 某些需要最低消费
6. **免费层级:** 确认是否需要信用卡

## 构建者推荐配置

### 网站/博客
Lighthouse (基础) + EdgeOne (免费层级)

### 轻量级 API
Lighthouse (中级计划) + EdgeOne (免费层级)

### 机器人 / Discord 机器人
Lighthouse (基础) + EdgeOne (免费层级)

### 仪表板 / 分析
Lighthouse (中级计划) + EdgeOne (按使用量付费)

### 完整应用
CVM (竞价实例) + EdgeOne (按使用量付费)

> **免责声明:** 价格和促销可能会发生变化。请始终查看 Tencent Cloud 官方网站获取最新信息。本指南仅供参考,不替代官方条款。
