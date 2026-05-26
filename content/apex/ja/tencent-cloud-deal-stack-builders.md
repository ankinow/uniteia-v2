---
slug: tencent-cloud-deal-stack-builders
lang: ja
title: "Tencent Cloud Deal Stack for Builders"
verdict: trusted
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
  created_at: "2026-05-15T15:41:13.228Z"
  updated_at: "2026-05-15T15:41:13.228Z"
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
# Tencent Cloud Deal Stack: ビルダーのための格安クラウド

## Tencent Cloud Deal Stackとは？

Tencent Cloudは、独立したビルダーに最適な製品とプロモーションを提供しています。Lighthouse、CVM、EdgeOneを使えば、サイト、API、ボット、ダッシュボード、小規模アプリをわずかなコストで運用できます。場合によっては無料で利用することも可能です。

## 無料製品

Tencent Cloudは、厳選された製品で無料ティアを提供しています。無料リソースは以下のとおりです：

- **EdgeOne:** 無料プランで月間最大100万リクエスト
- **Lighthouse:** 基本構成でのトライアル期間
- **CVM:** 新規ユーザー向けプロモーション提供

> ⚠️ **注記:** 無料製品にはクレジットカードの登録が必要な場合があります。公式利用規約をご確認ください。

## Lighthouse — シンプルさで実現

Lighthouseは簡易VPSで、複雑なインフラを管理したくない方に最適です。

**使用するケース：**
- 静的サイトまたはブログ
- 軽量API
- ボットと自動化
- 開発環境
- 個人用ダッシュボード

**メリット：**
- 仕様固定、予想外のコストなし
- 簡素化されたダッシュボード
- ファイアウォールとモニタリング内蔵
- 同等のCVMよりも低コスト
- 月額または時間単位の請求

## CVM — フルパワー

CVM（Cloud Virtual Machine）は、完全な制御が必要な方向けの総合ソリューションです。

**使用するケース：**
- CPU/RAMを大量に使用するアプリケーション
- Kubernetesまたは高度なDocker
- カスタムカーネルまたはネットワークチューニング
- 大規模データベース
- VPCとセキュリティグループが必要な環境

**メリット：**
- 完全にカスタマイズ可能な構成
- 専有インスタンス、スポットインスタンス、リザーブドインスタンス
- 追加ブロックストレージ
- 秒単位の請求（最低1時間）
- BYOLサポート

## EdgeOne — CDN＋セキュリティ

EdgeOneは、CDNにWAF、DDoS対策、ボット管理を組み合わせた統合プラットフォームです。

**使用するケース：**
- グローバルなコンテンツ配信の高速化
- 攻撃からサイトを保護
- 個別のCDN＋WAFを置き換え
- 国際ユーザーのレイテンシー削減

**メリット：**
-  generousな無料ティア（月間100万リクエスト）
- 従量課金制
- グローバルエッジネットワーク
- LighthouseおよびCVMとのネイティブ統合
- 複雑なライセンス不要

## 製品の組み合わせ方

| スタック | Lighthouse + EdgeOne | CVM + EdgeOne |
|---------|---------------------|---------------|
| 最適な用途 | サイト、ブログ、ランディングページ | 動的アプリ、API、Eコマース |
| パフォーマンス | 静的コンテンツに最適 | 最大の柔軟性 |
| コスト | 最低 | 中程度 |
| セットアップ | 数分 | 数時間 |

## 支払い前のチェックリスト

1. **リージョンを確認:** すべてのプロモーションが全リージョンで利用できるとは限りません
2. **対象条件:** 一部のオファーは新規ユーザーのみ対象です
3. **有効期限:** プロモーションには期限があります — 日付を確認してください
4. **更新時:** プロモーション価格が更新時に適用されない場合があります
5. **クーポン:** 有効化前に利用規約を読んでください — 最低利用額が必要な場合があります
6. **無料ティア:** クレジットカードが必要かどうか確認してください

## ビルダー向け推奨セットアップ

### サイト/ブログ
Lighthouse（基本）＋ EdgeOne（無料ティア）

### 軽量API
Lighthouse（ミッドプラン）＋ EdgeOne（無料ティア）

### ボット/Discordボット
Lighthouse（基本）＋ EdgeOne（無料ティア）

### ダッシュボード/分析
Lighthouse（ミッドプラン）＋ EdgeOne（従量課金）

### 本格的なアプリケーション
CVM（スポットインスタンス）＋ EdgeOne（従量課金）

> **免責事項:** 価格とプロモーションは変更される場合があります。最新情報については、必ずTencent Cloud公式ウェブサイトをご確認ください。このガイドは教育目的であり、公式利用規約に代わるものではありません。
