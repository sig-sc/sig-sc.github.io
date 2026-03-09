# SIG-SC GitHub Pages

電子情報通信学会 サービスコンピューティング研究会 (IEICE SIG-SC) の公式ウェブサイト。

サイト: https://sig-sc.org

---

## 技術スタック

| 技術 | 詳細 |
|------|------|
| SSG | Hugo (extended) |
| CSS | Tailwind CSS v4 + `@tailwindcss/typography` |
| CMS | Decap CMS (`static/admin/`) |
| デプロイ | GitHub Actions → GitHub Pages |
| フォント | Noto Sans JP + JetBrains Mono |

## ローカル開発

```bash
npm install
hugo server
```

---

## ページ一覧

| ページ | URL | データソース | レイアウト |
|--------|-----|-------------|-----------|
| ホーム | `/` | `content/_index.md`, `data/news.yaml`, `data/links.yaml`, `data/keywords.yaml`, `data/committee.yaml`, `data/history.yaml`, `data/awards.yaml` | `layouts/index.html` |
| 開催履歴 | `/history/` | `data/history.yaml` | `layouts/history/single.html` |
| 開催統計 | `/statistics/` | `data/history.yaml` | `layouts/statistics/single.html` |
| 専門委員 | `/committee/` | `data/committee.yaml` | `layouts/committee/single.html` |
| 表彰 | `/award/` | `data/awards.yaml` | `layouts/award/single.html` |
| お知らせ | `/news/` | `data/news.yaml`, `data/history.yaml`, `data/awards.yaml` | `layouts/news/single.html` |
| 研究会記録 | `/posts/...` | `content/posts/*.md` | `layouts/_default/single.html` |

**お知らせ**ページとホームの「お知らせ」セクションは、`news.yaml`・`history.yaml`・`awards.yaml` の3つのデータソースを統合して表示しています。

---

## データファイル（`data/`）

### `data/history.yaml` — 研究会開催データ

開催履歴・統計・お知らせの研究会項目に使用されます。

```yaml
history:
  - session: 56            # 研究会回数（省略可）
    date: "2025-11-14"
    topic: "一般"
    program_url: "https://ken.ieice.org/..."
    prefecture: "東京都"
    venue: "〇〇大学"
    venue_url: "https://..."
    cosponsor: ""          # 共催があれば記載
```

### `data/awards.yaml` — 受賞者データ

表彰ページ・お知らせの表彰項目に使用されます。

```yaml
annual:                    # 年間表彰受賞者
  - year: 2024
    date: "2025-03"        # 表彰年月（省略時は {year}-04-01 扱い）
    entries:
      - title: "論文タイトル"
        authors: "著者名（所属）"

encouragement:             # 若手奨励賞受賞者
  - session: 56            # 研究会回数
    date: "2025-11"        # 開催年月
    entries:
      - title: "論文タイトル"
        winner: "受賞者名"
        authors: "全著者（所属）"
```

### `data/news.yaml` — お知らせ

ホーム・お知らせページに「その他」カテゴリとして表示されます。

```yaml
pinned:                    # 固定表示のお知らせ（ホーム上部に表示）
  - title: "タイトル"
    content: "内容（Markdown使用可）"

items:                     # 通常のお知らせ
  - date: "2025-11"        # yyyy-mm 形式
    content: "お知らせの内容（Markdown使用可）"
```

### `data/committee.yaml` — 専門委員データ

```yaml
chair:                     # 委員長
  - name: "氏名"
    affiliation: "所属"
    url: "https://..."     # 省略可
vice_chair:                # 副委員長
secretary:                 # 幹事
assistant_secretary:       # 幹事補佐
members:                   # 専門委員（五十音順）
history:                   # 歴代幹事団
  - year: 2025
    chair: "氏名"
    vice_chair: ["氏名A", "氏名B"]
    secretary: ["氏名A"]
    assistant_secretary: []
```

### `data/keywords.yaml` — 研究分野カテゴリ

```yaml
categories:
  - name: "カテゴリ名"
    items:
      - "キーワード1"
      - "キーワード2"
```

### `data/links.yaml` — 関連リンク

```yaml
categories:
  - name: "ジャーナル"
    items:
      - title: "IEEE Transactions on Services Computing"
        url: "https://..."
```

---

## コンテンツファイル（`content/`）

| ファイル | 役割 |
|----------|------|
| `content/_index.md` | ホームの「研究会の目的」本文（Markdown） |
| `content/history.md` | 開催履歴ページの front matter |
| `content/statistics.md` | 統計ページの front matter |
| `content/committee.md` | 専門委員ページの front matter |
| `content/award.md` | 表彰ページの front matter |
| `content/news.md` | お知らせページの front matter |
| `content/posts/*.md` | 研究会記録（ブログ記事） |

---

## レイアウト（`layouts/`）

| ファイル | 対象 |
|----------|------|
| `layouts/index.html` | ホーム |
| `layouts/history/single.html` | 開催履歴 |
| `layouts/statistics/single.html` | 開催統計（D3.js 地図） |
| `layouts/committee/single.html` | 専門委員 |
| `layouts/award/single.html` | 表彰 |
| `layouts/news/single.html` | お知らせ |
| `layouts/_default/single.html` | 研究会記録（各記事） |
| `layouts/_default/list.html` | 記事一覧 |
| `layouts/_default/baseof.html` | ベースレイアウト |
| `layouts/partials/header.html` | ヘッダー・ナビゲーション |
| `layouts/partials/footer.html` | フッター |
| `layouts/partials/head.html` | `<head>` タグ |
| `layouts/partials/scripts.html` | JS（ダークモード・モバイルメニュー） |

---

## スタイル（`assets/css/main.css`）

Tailwind CSS v4 のエントリーポイント。Hugo の `css.TailwindCSS` パイプラインでビルドされます。

### ブランドカラー

```css
--color-primary: #195892       /* 濃い青 */
--color-primary-light: #27acd9 /* 明るい青 */
--color-accent: #b4e12b        /* 黄緑 */
```

### コンポーネントクラス

| クラス | 用途 |
|--------|------|
| `.section-heading` | セクション見出し（アクセントボーダー付き） |
| `.card` | カードコンポーネント |
| `.btn-primary` | プライマリボタン |
| `.btn-outline` | アウトラインボタン |
| `.tag` | タグ・バッジ |
| `.nav-link` | ナビゲーションリンク |

### ダークモード

クラスベース（`dark` クラス）で制御。Tailwind v4 のカスタム variant で定義:

```css
@variant dark (&:where(.dark, .dark *));
```

ヘッダー・ヒーローセクションはダークモード時にブランドカラーの濃い青（`#0f2d4a`）を使用し、ページ背景（`slate-900`）と区別しています。

### 注意事項

- Tailwind v4 の任意値クラス（`bg-[#hex]`）は Hugo パイプライン経由だと検出されないことがあります。動的な色指定にはインラインスタイルまたは JS を使用してください。
- ナビゲーションのレスポンシブ切り替えは 896px のカスタムメディアクエリで制御しています（`layouts/partials/header.html` 内の `<style>` タグ）。
