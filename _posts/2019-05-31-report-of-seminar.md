---
layout: post
title:  "サービスコンピューティング研究専門委員会 第30回研究会 2019年5月31日(金)-6月1日(土)"
date:   2019-05-31 21:00:00 +0900
categories: seminar report update
---

### サービスコンピューティング研究専門委員会 第30回研究会
- __テーマ:__ 「サイエンス・サービスプラットフォーム/データサービスと機械学習」および一般
- __日程:__ 2019年5月31日 (金)，6月1日 (土)
- __場所:__ 国立研究開発法人物質・材料研究機構 千現地区
- __プログラム:__


<pre>
5月31日(金) 午前 開催挨拶 （10：30～10：45）

−−−　開催挨拶　（ 15分 ）　−−−

5月31日(金) 午前 SC研究会一般公演 （10：45～11：45）
座長: 中村匡秀 (神戸大)

(1) 10:45 - 11:15
Proposal for Automatic Extraction Framework of Superconductors 
Related Information from Scientific Literature
○Luca Foppiano・Thaer M. Dieb・Akira Suzuki・Masashi Ishii（NIMS）

(2) 11:15 - 11:45
高付加価値科学データ創出を指向した研究データ管理プラットフォームのアーキテクチャ
○菊地伸治・門平卓也・鈴木峰晴・内藤裕幸（物質・材料研究機構）

−−−　昼食　（ 95分 ）　−−−

5月31日(金) 午後 招待講演 （13：20～15：45）
座長: 門平卓也 (NIMS)

(3) 13:30 - 14:30
招待講演-1
潜在知識を読み解くデータサイエンス
東京大学 大学院情報理工学系研究科数理情報学専攻 山西健司 教授

(4) 14:30 - 15:30
招待講演-2
実例と現場に学ぶ、ICTソリューションとしての「マテリアルズ・インフォマティクス」
（株）日立製作所 研究開発グループ 淺原 彰規 主任研究員

−−−　休憩　（ 15分 ）　−−−

5月31日(金) 午後 SC研究会一般公演 （15：45～17：45）
座長: 山登庸次 (NTT)

(5) 15:45 - 16:15
Automatic Service Composition based Deep Learning Service Generation
○Incheon Paik・Ryo Ataka・Akila Siriweera（UoA）

(6) 16:15 - 16:45
［ショートペーパー］A LEGO Robot Visual Programming Editor for Model-driven BBCoM Environment
○Takumi Sato・Masayuki Takano・Ruth Cortez・Alexander P. Vazhenin（Univ. of Aizu）

(7) 16:45 - 17:15
デザイン思考に基づいた保育施設業務支援システム構想とファストシステムによる実装
○山田耕嗣・高橋　徹（阪産大）・糟谷咲子（岐阜聖徳短大）

(8) 17:15 - 17:45
複数のコグニティブAPIを活用した宅内コンテキスト認識 ～ 多数決アプローチ ～
○陳　思楠・佐伯幸郎・中村匡秀（神戸大）

6月1日(土) 午前 挨拶、連絡 （09：45～10：00）

−−−　挨拶、連絡　（ 15分 ）　−−−

6月1日(土) 午前 SC研究会一般公演 （10：00～12：00）
座長: 木村功作 (富士通研)

(9) 10:00 - 10:30
サービスドミナントロジックに基づく社会規範の創発過程の分析
○藤田　悟（法政大）

(10) 10:30 - 11:00
サービスロボット・IoTデバイスのセキュリティ課題と対策のケーススタディ
○山崎治郎・辻　秀典・山崎文明（ネットワンシステムズ）

(11) 11:00 - 11:30
［ショートペーパー］NIMS高分子データベースPoLyInfoのRDF化 ～ セマンティックなデータベース統合への試行報告 ～
○石井真史・竹村太郎・谷藤幹子（物質・材料研究機構）

(12) 11:30 - 12:00
知識グラフとベクトル空間の特徴の共同埋め込み
○門木斗夢・黄　潤和・藤田　悟（法政大）

</pre>

### 実施報告

(2019-08-26 中村)

委員長の中村＠神戸大学です．

報告が大変遅くなって，申し訳ありません．第30回研究会の報告をお届けいたします．

第30回研究会は，副委員長の菊地先生のご尽力のもと，つくばにある物質・材料研究機構(NIMS)
において開催されました．SC研究会と物質・材料コミュニティの方々とのネットワーキングを
行うという目的のもと，NIMSが行う
[第43回MaDIS研究交流会](https://www.nims.go.jp/research/MaDIS/events/hdfqf100000dr91d.html)
との共催として行われました．

研究会は，2件の招待講演を交え合計12件の発表が，2日にわたって行われました．

1件目の招待講演は，東京大学の山西健司先生に「潜在知識を読み解くデータサイエンス」
という題目でご講演いただきました．大規模な時系列データにおけるパターンを読み解き，
漸進的変化検知，潜在構造変化検知を通して，将来起こりうる変化を予兆する技術について，
実例を交えながら解説いただきました．山西先生は時系列データの変化点検知で著名な
ChangeFinderアルゴリズムを開発された方です．中村の研究グループで開発している
[在宅高齢者の見守りシステム](http://www27.cs.kobe-u.ac.jp/achieve/pman.cgi?MODE=list;LANG=ja;PTYPE=;SORT=t_decend;FILTERFROM=;LOGIC=and;FILTER=Tamamizu;FFDETAIL=;FLDETAIL=)
においても実装され実運用されています．今回その理論を開発された先生と
SC研究会でお会いする機会ができて，感慨もひとしおでした．

2件目の招待講演は，日立製作所の淺原彰規様に，
「実例と現場に学ぶ、ICTソリューションとしてのマテリアルズ・インフォマティクス」
という題目でお話しいただきました．
実験や文献の膨大なデータを，新材料の発見・開発に生かすMI(マテリアルズ・インフォマティクス)について，
企業の研究，ソリューションサービス開発の観点から解説いただきました．
新材料の開発にも機械学習やデータマイニングを使う必要性があること，それをいかに
現場に受け入れてもらい，利点と限界を理解してもらったうえで運用していくかが
ポイントであることをわかりやすく説明されました．現場でよくある質問等も紹介いただき，
現場での苦労や今後の展望などもお話しいただきました．

一般公演においては，NIMSとSCコミュニティの双方の研究者から発表がありました．
一見異分野に見えますが，目指している問題，悩んでいる問題は非常に共通点が多いように感じました．
具体的には，様々な場所に点在しているデータやシステムを統合して，価値を出すサービスを生み出していかないと
いけないということです．物質科学における材料や実験のデータは，年々蓄積されているものの
サイロ型に独立して蓄積が積みあがっており，これらをどう連携して有効活用するかが喫緊の課題ということです．
これはサービスコンピューティングが得意とする大規模異種分散システムの連携であり，各システムのサービス化，
APIの整備が急がれるということでした．

各発表について，盛んなディスカッションが行われました．
中村研究室からは今回3件，学生が発表させていただきました．
有用な質問，コメントをいただき，これからの研究に大いに役立てることが出来そうです．

1日目のプログラムの後，NIMSの食堂にて懇親会がとり行われました．
我々SCのコミュニティは基本的に「情報屋」の集まりであり，
NIMSの方々が属する「材料屋」の方々とはほとんど顔を合わせる機会がありません．
しかし，今回の共催を通して互いの研究や苦労話を話していくうちに，
自分たちの研究が相手方のソリューションになる，あるいは，相手方の研究が自分たちの
困りごとを解決するかもしれないという気づきがありました．
こうした異分野の交流からイノベーティブなアイデアが生まれるのだと再確認できました．
NIMSとの連携は，今後もぜひ続けていければと考えています．

開催に当たりご尽力いただきました，菊地先生，NIMS関係者の皆様，MaDIS研究会の皆様，
SC幹事団の皆様，また，発表・ご参加いただいたすべての皆様に感謝いたします．


### 研究会1日目の写真

NIMS材料データプラットフォームセンター・谷藤センター長よりごあいさつ．

<img src="/assets/file/20190531/00_opening_tanifuji.jpg">


NIMSのDr. Luca Foppianoから，超電導文献の自動抽出のこころみに関する発表．

<img src="/assets/file/20190531/01_presen_luca.jpg">

NIMSの菊地先生から，研究データ管理プラットフォームのアーキテクチャに関する提案．

<img src="/assets/file/20190531/02_presen_kikuchi.jpg">

東大・宮西先生の招待講演．
<img src="/assets/file/20190531/03_presen_miyanishi.jpg">

続いて，日立・淺原様の招待講演から．
<img src="/assets/file/20190531/05_presen_asahara.jpg">

大阪産業大学・山田先生のご発表．デザイン思考に基づく保育施設業務支援システムの構想．
<img src="/assets/file/20190531/07_presen_yamada.jpg">

わが神戸大学からは，陳君がコグニティブAPIを用いた宅内コンテキスト認識に関する研究発表をしました．
<img src="/assets/file/20190531/08_presen_chen.jpg">

会場の様子
<img src="/assets/file/20190531/90_kaijou.jpg">

懇親会の様子．和気あいあいとした雰囲気で話が弾みました．

<img src="/assets/file/20190531/91_konshinkai.jpg">


### 研究会2日目の写真
法政大・藤田先生のご発表．サービスドミナントロジックに基づく社会規範の創発過程の分析．
<img src="/assets/file/20190531/09_presen_fujita.jpg">


NIMS石井様のご発表．NIMS高分子データベースPoLyInfoのRDF化．パブリックな材料ベースに
NIMSのデータベースをRDFで連結しようという取り組みでした．

<img src="/assets/file/20190531/11_presen_ishii.jpg">


### 次回の予定

次回のSC研究会は8月23日，大阪産業大学・梅田キャンバスで実施されます．

申込みの締切りは2019年6月21日です．

みなさん，ふるってご応募ください！！



