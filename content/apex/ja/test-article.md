---
slug: test-article
lang: ja
title: 統合検証用テスト記事
verdict: trusted
quality_score: 95
subjects:
  - テスト
  - 統合
  - 検証
referral_links:
  - url: https://example.com/ja/reference
    title: サンプル参照リンク
    description: 外部参照リンクのサンプル
  - url: https://example.com/ja/docs
    title: サンプルドキュメント
metadata:
  created_at: "2025-01-15T10:00:00Z"
  updated_at: "2025-01-20T14:30:00Z"
  author: UniTeiaシステム
  version: 1
---

# 統合検証用テスト記事

これはUniTeia v2のコンテンツレンダリングパイプラインを検証するために作成されたテスト記事です。routeLoader$の統合テスト、スキーマ検証、およびコンポーネントレンダリングのフィクスチャとして機能します。

## 目的

この記事の主な目的は、コンテンツパイプライン全体を実行することです：

1. **Markdown解析** — gray-matterによるfrontmatter抽出
2. **スキーマ検証** — AJV Draft 2020-12準拠チェック
3. **スラッグ検証** — `validateSlug()`によるURL安全性の確認
4. **コンポーネントレンダリング** — ArticleFrame、AdaptiveHeader、FrontmatterSlots、SourceLedger

## コンテンツ要件

スキーマは100文字以上のコンテンツを要求します。この段落と周囲のテキストにより、レンダリングパイプラインの有意なテストカバレッジを提供しながら、この閾値を余裕をもって超えることを保証します。

## 技術的詳細

routeLoader$は`/llm-wiki/ja/`ディレクトリからこのファイルを読み取り、YAML frontmatterを解析し、結果のオブジェクトをJSONスキーマに対して検証し、型付きコンテンツをQwik-Cityルートに注入します。検証の失敗は、スラッグとエラーの詳細とともにサーバーコンソールに記録されます。
