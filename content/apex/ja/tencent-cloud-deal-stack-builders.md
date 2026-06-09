---
slug: tencent-cloud-deal-stack-builders
lang: ja
title: 開発者向けTencent Cloud Deal Stack
verdict: caution
quality_score: 65
subjects:
  - cloud
  - builders
  - infrastructure
  - tencent-cloud
referral_links: []
metadata:
  created_at: "2026-06-09T02:27:03.025Z"
  updated_at: "2026-06-09T02:27:03.025Z"
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
# Tencent Cloud Deal Stack: ビルダー向け格安クラウド

## Tencent Cloud Deal Stackとは?

Tencent Cloudは独立系ビルダーに最適な製品とプロモーションを提供しています。Lighthouse、CVM、EdgeOneを使えば、サイト、API、ボット、ダッシュボード、小規模アプリを非常に低コストでホストできます — 場合によっては無料で。

## 無料製品

Tencent Cloudは厳選された製品の無料ティアを提供しています。無料リソースには以下が含まれます:

- **EdgeOne:** 無料プランで月間100万リクエストまで
- **Lighthouse:** 基本構成のトライアル期間
- **CVM:** 新規ユーザー向けプロモーションオファー

> ⚠️ **注意:** 無料製品にはクレジットカード登録が必要な場合があります。公式規約を確認してください。

## Lighthouse — 機能するシンプルさ

Lighthouseは複雑なインフラ管理を望まない人に最適な簡素化されたVPSです。

**使用すべき時:**
- 静的サイトやブログ
- 軽量API
- ボットと自動化
- 開発環境
- 個人用ダッシュボード

**利点:**
- 固定仕様、驚きなし
- 簡素化されたダッシュボード
- ファイアウォールと監視機能付き
- 同等のCVMより安い
- 月額または時間単位の請求

## CVM — 完全なパワー

CVM (Cloud Virtual Machine)は完全な制御が必要な人向けの完全なソリューションです。

**使用すべき時:**
- CPU/RAM集約型アプリケーション
- Kubernetesまたは高度なDocker
- カスタムカーネルまたはネットワークチューニング
- 大規模データベース
- VPCとセキュリティグループが必要な環境

**利点:**
- 完全にカスタマイズ可能な構成
- 専用、スポット、リザーブドインスタンス
- 追加ブロックストレージ
- 秒単位の請求(最低1時間)
- BYOLサポート

## EdgeOne — CDN + セキュリティ

EdgeOneはCDNとWAF、DDoS保護、ボット管理を1つのプラットフォームに組み合わせます。

**使用すべき時:**
- グローバルコンテンツ配信の高速化
- 攻撃からサイトを保護
- 個別のCDN + WAFを置換
- 国際ユーザーのレイテンシ削減

**利点:**
- 寛大な無料ティア(月100万リクエスト)
- 従量課金制
- グローバルエッジネットワーク
- LighthouseとCVMとのネイティブ統合
- 複雑なライセンスなし

## 製品の組み合わせ方

| スタック | Lighthouse + EdgeOne | CVM + EdgeOne |
|---------|---------------------|---------------|
| 最適な用途 | サイト、ブログ、ランディングページ | 動的アプリ、API、Eコマース |
| パフォーマンス | 静的コンテンツに最適 | 最大限の柔軟性 |
| コスト | 最安 | 中程度 |
| セットアップ | 数分 | 数時間 |

## 支払い前のチェックリスト

1. **リージョンを確認:** すべてのプロモーションがすべてのリージョンで利用可能とは限りません
2. **適格性:** 一部のオファーは新規ユーザー限定です
3. **有効期間:** プロモーションは期限切れになります — 日付を確認
4. **更新:** プロモ価格が更新時に適用されない場合があります
5. **クーポン:** 有効化前に規約を読んでください — 最低支出が必要な場合もあります
6. **無料ティア:** クレジットカードが必要かどうかを確認

## ビルダー向け推奨セットアップ

### サイト/ブログ
Lighthouse (ベーシック) + EdgeOne (無料ティア)

### 軽量API
Lighthouse (ミドルプラン) + EdgeOne (無料ティア)

### ボット / Discordボット
Lighthouse (ベーシック) + EdgeOne (無料ティア)

### ダッシュボード / Analytics
Lighthouse (ミドルプラン) + EdgeOne (従量課金)

### フルアプリケーション
CVM (スポットインスタンス) + EdgeOne (従量課金)

> **免責事項:** 価格とプロモーションは変更される場合があります。最新情報については常にTencent Cloud公式ウェブサイトを確認してください。このガイドは教育的目的であり、公式規約に代わるものではありません。
