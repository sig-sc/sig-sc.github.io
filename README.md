# SIG-SC GitHub Pages

電子情報通信学会 サービスコンピューティング研究会 (IEICE SIG-SC) の公式ウェブサイト。

サイト: https://sig-sc.org

---

## 技術スタック

- **SSG**: Hugo v0.157.0 extended
- **CSS**: Tailwind CSS v4 + `@tailwindcss/typography`
- **デプロイ**: GitHub Actions → GitHub Pages

## ローカル開発

```bash
npm install
hugo server
```

---

## ページ一覧とファイル対応表

各ページの**内容を更新したいとき**にどのファイルを編集するかを示します。

| ページ | URL | 編集するファイル |
|--------|-----|-----------------|
| ホーム | `/` | `layouts/index.html` |
| 開催履歴 | `/history/` | `content/history.md`（設定） / `data/seminars.yaml`（データ） |
| 開催統計 | `/statistics/` | `content/statistics.md`（設定） / `data/seminars.yaml`（データ） |
| 専門委員 | `/committee/` | `data/committee.yaml` |
| 表彰 | `/award/` | `content/award.md` |

---

## データファイル（`data/` ディレクトリ）

サイト内のデータは YAML ファイルで管理しています。

### `data/seminars.yaml` — 研究会開催データ

開催履歴・開催統計ページのデータソースです。

```yaml
seminars:
  - fiscal_year: 2025
    date: "2025-11-07"
    venue: "〇〇大学"
    venue_url: "https://..."
    topic: "第56回 SC研究会"
    cosponsor: ""          # 共催があれば記載
    program_url: "https://ken.ieice.org/..."
    prefecture: "東京都"
    pref_code: 13          # JIS都道府県コード（オンラインはnull）
```

### `data/committee.yaml` — 専門委員データ

専門委員ページ・ホームの委員会構成セクションに反映されます。

```yaml
chair:           # 委員長（1名）
  - name: "氏名"
    affiliation: "所属"
    url: "https://..."   # 省略可

vice_chair:      # 副委員長
secretary:       # 幹事
assistant_secretary:  # 幹事補佐
members:         # 専門委員（五十音順）

history:         # 歴代幹事団
  - year: 2025
    chair: "氏名"
    vice_chair: ["氏名A", "氏名B"]
    secretary: ["氏名A"]
    assistant_secretary: []
```

### `data/awards.yaml` — 受賞者データ

表彰ページの受賞者一覧のデータソースです。

```yaml
annual:          # 年間表彰受賞者
  - year: 2024
    title: "論文タイトル"
    authors: "著者名（所属）"

encouragement:   # 若手奨励賞受賞者
  - session: 56              # 研究会回数
    year_month: "2025年11月"
    entries:
      - title: "論文タイトル"
        winner: "受賞者名"   # [★]が付いた対象者
        authors: "全著者（所属）"
```

### `data/news.yaml` — お知らせ

ホームの「お知らせ・更新履歴」セクションに表示されます（新しい順）。

```yaml
items:
  - date: "2025-04-01"
    content: "お知らせの内容（Markdownリンク使用可）"
```

### `data/keywords.yaml` — 研究分野カテゴリ

ホームの「研究分野」セクションに表示されます。

```yaml
categories:
  - name: "カテゴリ名"
    items:
      - "キーワード1"
      - "キーワード2"
```

---

## コンテンツファイル（`content/` ディレクトリ）

### 表彰ページ（`content/award.md`）

受賞者一覧と選奨規程を1ページにまとめています。
`## 受賞者一覧` > `### 年間表彰受賞者` / `### 若手奨励賞受賞者` の構造で追記してください。

### 研究会記録（`content/posts/YYYY-MM-DD-seminar.md`）

各回の研究会記録ページです。ファイルを追加するとブログ記事として公開されます。

```yaml
---
title: "第〇回 サービスコンピューティング研究会"
date: 2025-11-07
tags: ["サービス指向", "クラウド"]
---

## 概要
...
```

---

## レイアウトファイル（`layouts/` ディレクトリ）

ページの**デザインや構造**を変更したいときに編集します。

| ファイル | 対象ページ |
|----------|-----------|
| `layouts/index.html` | ホーム |
| `layouts/seminar-list/single.html` | 開催履歴 |
| `layouts/data/single.html` | 開催統計 |
| `layouts/committee/single.html` | 専門委員 |
| `layouts/page/single.html` | 表彰（汎用コンテンツページ） |
| `layouts/_default/single.html` | 研究会記録（各記事） |
| `layouts/_default/list.html` | 記事一覧 |
| `layouts/partials/header.html` | ヘッダー・ナビゲーション |
| `layouts/partials/footer.html` | フッター |
| `layouts/partials/head.html` | `<head>` タグ（CSS読み込み等） |

## スタイル（`assets/css/main.css`）

Tailwind CSS v4 のエントリーポイントです。ブランドカラー・共通コンポーネントはここで定義しています。

| クラス | 用途 |
|--------|------|
| `.section-heading` | セクション見出し（アクセントボーダー付き） |
| `.card` | カードコンポーネント |
| `.btn-primary` | プライマリボタン |
| `.btn-outline` | アウトラインボタン |
| `.tag` | タグ・バッジ |
| `.nav-link` | ナビゲーションリンク |

ブランドカラー:

```css
--color-primary: #195892       /* 濃い青 */
--color-primary-light: #27acd9 /* 明るい青 */
--color-accent: #b4e12b        /* 黄緑 */
```
