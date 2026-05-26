---
slug: tencent-cloud-deal-stack-builders
lang: zh
title: "Tencent Cloud Deal Stack for Builders"
verdict: trusted
visibility: published
quality_score: 95
subjects:
  - cloud
  - builders
  - infrastructure
  - tencent-cloud
referral_links:
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Promotions
  - url: https://www.tencentcloud.com/products/lighthouse
    title: Lighthouse Overview
  - url: https://www.tencentcloud.com/products/cvm
    title: CVM Overview
  - url: https://www.tencentcloud.com/products/teo
    title: EdgeOne Overview
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Free Tier
metadata:
  created_at: "2026-05-15T15:41:13.229Z"
  updated_at: "2026-05-15T15:41:13.229Z"
  author: UniTeia System
  version: 1
  sourceCount: 8
  trustLevel: low
  importedFrom: uniteia-mega-factory
  contentPackage: uniteia-content-package/v1
canvas:
  tone: obsidian
  layout: constellation
  nodes:
    - id: intro
      section: 0
      type: hero
    - id: free-products
      section: 1
      type: card
    - id: lighthouse
      section: 2
      type: card
    - id: cvm
      section: 3
      type: card
    - id: edgeone
      section: 4
      type: card
    - id: stack-comparison
      section: 5
      type: table
    - id: checklist
      section: 6
      type: list
    - id: recommended-setup
      section: 7
      type: grid
  connectors:
    - from: intro
      to: free-products
    - from: intro
      to: lighthouse
    - from: intro
      to: cvm
    - from: intro
      to: edgeone
    - from: lighthouse
      to: stack-comparison
    - from: cvm
      to: stack-comparison
    - from: edgeone
      to: stack-comparison
    - from: stack-comparison
      to: checklist
    - from: checklist
      to: recommended-setup
---
# Tencent Cloud Deal Stack：面向开发者的低价云服务

## 什么是Tencent Cloud Deal Stack？

腾讯云提供一系列适合独立开发者的产品和促销活动。通过Lighthouse、CVM和EdgeOne，您可以以极低的成本托管网站、API、机器人、仪表盘和小型应用——在某些情况下甚至可以免费使用。

## 免费产品

腾讯云提供精选产品的免费套餐。免费资源包括：

- **EdgeOne：** 免费计划每月最多100万次请求
- **Lighthouse：** 基本配置的试用期
- **CVM：** 新用户促销优惠

> ⚠️ **注意：** 免费产品可能需要注册信用卡。请查看官方条款。

## Lighthouse — 简单实用的方案

Lighthouse 是一款简化的VPS，适合不想管理复杂基础设施的用户。

**适用场景：**
- 静态网站或博客
- 轻量级API
- 机器人和自动化
- 开发环境
- 个人仪表盘

**优点：**
- 固定配置，无隐藏费用
- 简化的控制面板
- 内置防火墙和监控
- 比同等CVM更便宜
- 按月或按小时计费

## CVM — 强大性能

CVM（云虚拟机）是为需要完全控制权的用户提供的完整解决方案。

**适用场景：**
- CPU/RAM密集型应用
- Kubernetes或高级Docker
- 自定义内核或网络调优
- 大型数据库
- 需要VPC和安全组的環境

**优点：**
- 完全可定制的配置
- 专用实例、竞价实例和预留实例
- 额外的块存储
- 按秒计费（最低1小时）
- 支持BYOL

## EdgeOne — CDN + 安全

EdgeOne将CDN与WAF、DDoS防护和机器人管理整合到一个平台中。

**适用场景：**
- 加速全球内容分发
- 保护网站免受攻击
- 替代单独的CDN + WAF
- 降低国际用户的延迟

**优点：**
- 慷慨的免费套餐（每月100万次请求）
- 按需付费
- 全球边缘网络
- 与Lighthouse和CVM原生集成
- 无需复杂授权

## 如何组合产品

| 方案 | Lighthouse + EdgeOne | CVM + EdgeOne |
|------|---------------------|---------------|
| 最适合 | 网站、博客、落地页 | 动态应用、API、电子商务 |
| 性能 | 静态内容表现出色 | 最大灵活性 |
| 成本 | 最低 | 中等 |
| 部署时间 | 几分钟 | 几小时 |

## 付款前检查清单

1. **检查区域：** 并非所有促销活动在所有区域都可用
2. **资格条件：** 部分优惠仅限新用户
3. **有效期：** 促销活动有时限——请查看日期
4. **续费：** 促销价可能不适用于续费
5. **优惠券：** 激活前请阅读条款——部分优惠券有最低消费要求
6. **免费套餐：** 确认是否需要信用卡

## 推荐给开发者的配置方案

### 网站/博客
Lighthouse（基础版）+ EdgeOne（免费套餐）

### 轻量级API
Lighthouse（中级方案）+ EdgeOne（免费套餐）

### 机器人/Discord机器人
Lighthouse（基础版）+ EdgeOne（免费套餐）

### 仪表盘/分析
Lighthouse（中级方案）+ EdgeOne（按需付费）

### 完整应用
CVM（竞价实例）+ EdgeOne（按需付费）

> **免责声明：** 价格和促销活动可能随时变更。请始终查看腾讯云官方网站获取最新信息。本指南仅供参考，不替代官方条款。
