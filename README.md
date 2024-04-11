# サービスコンピューティング研究会 GitHub Pages
2018-06-11 中村匡秀

## 概要

サービスコンピューティング研究会の(静的)ウェブページを管理します．

[GitHub Pages](https://pages.github.com/) によって，運営管理されています．

## コンテンツの形式
コンテンツはマークダウン形式(md)で書いてコミットすることで，自動的にhtmlに変換されます．
- hoge.md --> https://sig-sc.github.io/hoge.html

また，通常のhtml形式もコミットできます．
- fuga.html --> https://sig-sc.github.io/fuga.html

## ファイル・ディレクトリ構成
- index.md  --トップページです．
- seminar_list.md  --過去の研究会ページへのインデクスです．
- sandbox.md -- テスト用のファイルです．テスト用に自由に編集してください．
- _posts -- 過去の研究会のページを入れるディレクトリです．
  - ファイル名 (yyyy-mm-dd-file-name.md)を作成し，プリアンブルを書いておくと，seminar_list.mdに自動的にリンクされます．
  - 他のファイルをコピーして作ると楽です．
- assets -- スライドや写真を保存するディレクトリです．
  file/yyyymmddの下に適宜保存して，他のページからリンクしてください．
- scripts -- 以前のページからコンテンツをマイグレーションするためのスクリプトが入っています．
  - とりあえず使う必要はありません．

## テーマ
- [Jekyll](https://jekyllrb.com/)というフレームワークで，マークダウンからhtmlを自動生成しています．
- JekyllはGitHub Pagesの標準サービスで，Settingsからいろんなテーマを適用できるようです．
  - 現在は，[cayman](https://github.com/pages-themes/cayman) というテーマにしています

## ToDo
- 継続的な運用．

## 更新の方法
- git clone して，適宜branchを切って，そのbranch名でpushしてください．

```
$ git clone https://github.com/sig-sc/sig-sc.github.io.git
$ cd sig-sc.github.io.git
$ git branch my-branch
$ git checkout my-branch
// 適宜編集
$ git add .
$ git commit -m 'コミットメッセージ'
$ git push origin my-branch
// GitHubのサイト上でpull-request 
```

- こちらでレビュー後，マージします．