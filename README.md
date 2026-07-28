# SIG-SC GitHub Pages

電子情報通信学会 サービスコンピューティング研究会 (IEICE SIG-SC) の公式ウェブサイト。

サイト: https://sig-sc.org

---

## 技術スタック

| 技術 | 詳細 |
|------|------|
| SSG | Hugo (extended) |
| CSS | Tailwind CSS v4 + `@tailwindcss/typography` |
| デプロイ | GitHub Actions → GitHub Pages |
| フォント | Noto Sans JP + JetBrains Mono |

## ローカル開発

```bash
npm install
hugo server
```

Hugo と Node.js のバージョンは `.devcontainer/devcontainer.json` を基準とし、CI もここから読み取ります。バージョンを上げる際は devcontainer.json のみ変更してください。

---

## ページ一覧

| ページ | URL | データソース | レイアウト |
|--------|-----|-------------|-----------|
| ホーム | `/` | `content/_index.md`, `data/news.yaml`, `data/links.yaml`, `data/keywords.yaml`, `data/committee.yaml`, `data/seminars.yaml`, `data/awards.yaml` | `layouts/home.html` |
| 開催履歴 | `/seminars/` | `data/seminars.yaml` | `layouts/seminars/page.html` |
| 開催統計 | `/statistics/` | `data/seminars.yaml` | `layouts/statistics/page.html` |
| 専門委員 | `/committee/` | `data/committee.yaml` | `layouts/committee/page.html` |
| 表彰（受賞者一覧） | `/award/` | `data/awards.yaml` | `layouts/award/page.html` |
| 規程・制度 | `/regulations/` | `content/regulations.md` | `layouts/regulations/page.html` |
| お知らせ | `/news/` | `data/news.yaml`, `data/seminars.yaml`, `data/awards.yaml` | `layouts/news/page.html` |
| 研究会記録 | `/posts/...` | `content/posts/*.md` | `layouts/page.html` |

**お知らせ**ページとホームの「お知らせ」セクションは、`news.yaml`・`seminars.yaml`・`awards.yaml` の3つのデータソースを統合して表示しています。

---

## データファイル（`data/`）

### `data/seminars.yaml` — 研究会開催データ

開催履歴・統計・お知らせの研究会項目に使用されます。

```yaml
- session: 56              # 研究会回数（省略可）
  date: "2025-11-14"       # 開催予定の回も先頭に追加してよい（開催予定バッジ付きで表示される）
  topic: "一般"
  program_url: "https://ken.ieice.org/..."
  prefecture: "東京都"
  venue: "〇〇大学"
  venue_url: "https://..."
  cosponsor: ""            # 共催があれば記載
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
| `content/seminars.md` | 開催履歴（研究会一覧）ページの front matter |
| `content/statistics.md` | 統計ページの front matter |
| `content/committee.md` | 専門委員ページの front matter |
| `content/award.md` | 表彰（受賞者一覧）ページの front matter |
| `content/regulations.md` | 規程・制度ページ（選奨規程の本文を含む） |
| `content/news.md` | お知らせページの front matter |
| `content/posts/*.md` | 研究会記録（ブログ記事） |

---

## レイアウト（`layouts/`）

| ファイル | 対象 |
|----------|------|
| `layouts/home.html` | ホーム |
| `layouts/seminars/page.html` | 開催履歴 |
| `layouts/statistics/page.html` | 開催統計（D3.js 地図） |
| `layouts/committee/page.html` | 専門委員 |
| `layouts/award/page.html` | 表彰（受賞者一覧） |
| `layouts/regulations/page.html` | 規程・制度（選奨規程・推薦論文制度） |
| `layouts/news/page.html` | お知らせ |
| `layouts/page.html` | 研究会記録（各記事） |
| `layouts/section.html` | 記事一覧 |
| `layouts/baseof.html` | ベースレイアウト |
| `layouts/404.html` | 404 ページ |
| `layouts/_partials/header.html` | ヘッダー・ナビゲーション |
| `layouts/_partials/footer.html` | フッター |
| `layouts/_partials/head.html` | `<head>` タグ（canonical・OGP 含む） |
| `layouts/_partials/scripts.html` | JS（ダークモード・モバイルメニュー） |
| `layouts/_partials/news-items.html` | お知らせ項目リストの構築（ホーム・お知らせページ共用） |
| `layouts/_partials/news-badge.html` | お知らせのカテゴリバッジ |
| `layouts/_partials/icon-star.html` | 受賞者の星アイコン |

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
- ナビゲーションのレスポンシブ切り替えは 896px のカスタムメディアクエリで制御しています（`layouts/_partials/header.html` 内の `<style>` タグ）。
