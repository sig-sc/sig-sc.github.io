(() => {
const STORE_KEY = "suisen-chosho-md-v2";   // ひな形を更新したため保存先を切替（初回は新しいひな形を表示）

const SAMPLE = `---
研究専門委員会: サービスコンピューティング
宛先: 和文
交付通番:
年号: 西暦
注記: 非表示
---

# 論文名
［論文名］

# 著者・所属
［著者名1］，［著者名2］，［著者名3］（［所属］）

# 推薦の経緯
本研究は，［20xx］年［xx］月［xx］日開催の第［xx］回サービスコンピューティング研究会（［会場］）において［発表者名］氏により発表された（［SC20xx-xx］）．当研究専門委員会では毎回の研究会の投稿・発表論文を厳正に審査して推薦論文を選定しており，本研究はその審査を経て選定された．

# 推薦の理由
本研究は，［対象とする課題］に対し，［提案手法の概要］を提案している．［新規性の要点］点に新規性があり，［評価の条件］での評価では［評価結果］を示した．

# 推薦年月日
20xx-xx-xx

# 推薦人
［委員長名］
`;

const BLANK = `---
研究専門委員会:
宛先: 和文
交付通番:
年号: 西暦
注記: 非表示
---

# 論文名


# 著者・所属


# 推薦の経緯


# 推薦の理由


# 推薦年月日


# 推薦人

`;

const SECTION_ALIASES = {
  "論文名": "title",
  "著者・所属": "authors", "著者": "authors", "著者，所属": "authors", "著者、所属": "authors",
  "推薦の経緯": "history", "推薦の理由": "reason",
  "推薦年月日": "date", "推薦人": "signer", "委員長署名": "signer", "署名": "signer"
};

function parse(md) {
  const meta = {};
  let body = md.replace(/\r\n?/g, "\n");
  const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    fm[1].split("\n").forEach(line => {
      const m = line.match(/^\s*([^:：]+)[:：]\s*(.*)$/);
      if (m) meta[m[1].trim()] = m[2].trim();
    });
    body = body.slice(fm[0].length);
  }
  const sections = {}, unknown = [];
  let cur = null;
  body.split("\n").forEach(line => {
    const h = line.match(/^#{1,3}\s+(.+?)\s*$/);
    if (h) {
      const name = h[1].replace(/^[0-9０-９]+[．.、]\s*/, "").trim();
      cur = SECTION_ALIASES[name] || null;
      if (!cur) unknown.push(name); else sections[cur] = "";
      return;
    }
    if (cur) sections[cur] += line + "\n";
  });
  Object.keys(sections).forEach(k => sections[k] = sections[k].trim());
  return { meta, sections, unknown };
}

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/［([^］]*)］/g, '<span class="blank">［$1］</span>');
const paras = (t, indent = true) => t ? t.split(/\n{2,}/).map(p => `<p class="${indent ? "" : "ni"}">${p.split("\n").map(inline).join("<br>")}</p>`).join("") : "";

function toWareki(y) { return y >= 2019 ? "令和" + (y === 2019 ? "元" : y - 2018) : y >= 1989 ? "平成" + (y - 1988) : String(y); }
function dateParts(raw, era) {
  // 「2026-04-01」のほか、ひな形用の「20xx-xx-xx」「2026-xx-xx」も受け付ける（xxの部分は空欄になる）
  const m = (raw || "").match(/^([0-9xX]{4})(?:[-/年.](\d{1,2}|[xX]{1,2}))?(?:[-/月.](\d{1,2}|[xX]{1,2}))?日?$/);
  if (!m) return { y: "", mo: "", d: "", ok: false, tpl: false };
  const num = v => (v && /^\d+$/.test(v)) ? String(+v) : "";
  const yNum = /^\d{4}$/.test(m[1]) ? m[1] : "";
  return { y: yNum ? (era === "令和" ? toWareki(+yNum) : yNum) : "", mo: num(m[2]), d: num(m[3]), ok: !!(yNum && num(m[2]) && num(m[3])), tpl: /x/i.test(raw) };
}
const normName = s => (s || "").replace(/[\s　]/g, "");

/* 原本の座標（pt）。x は枠内本文左端77ptからの相対 */
const X0 = 77;
const rel = x => (x - X0).toFixed(1) + "pt";

function render() {
  const md = document.getElementById("src").value;
  const { meta, sections: s, unknown } = parse(md);
  const era = meta["年号"] === "令和" ? "令和" : "西暦";
  const lang = /英/.test(meta["宛先"] || "") ? "英" : /和/.test(meta["宛先"] || "") ? "和" : "";
  const committee = meta["研究専門委員会"] || "";
  // 様式の記入案内（括弧書き・「著者，所属」）。既定は非表示、「注記: 表示」で原本どおり
  const showGuide = /^表示/.test(meta["注記"] || "");
  const ban = (meta["交付通番"] || "").split(/[-－]/).map(x => esc(x.trim()));
  const dp = dateParts(s.date, era);
  // 署名画像の高さ（pt）。「署名の高さ: 24」のように指定できる
  const signH = Math.max(10, Math.min(60, parseFloat(meta["署名の高さ"]) || 28));

  // 行数の割当て（各項目の前に空行1行を必ず入れる。既定値は、空行を含めて原本の各欄の高さと一致）
  const DEF = { title: 1, authors: 2, history: 3, reason: 3 };
  const GAPS = 3;           // ２・３・４の前の空行
  const CAPACITY = 12;      // １〜４の見出し間（15行）から見出し３行を除いた行数（空行３を含む）
  // 各欄の最小の高さは原本の空き行どおり。記入が増えると２・３が下に動き、それでも入らなければ文字を縮小する
  const alloc = { ...DEF };
  const LN = 16; // pt
  const extra = (alloc.title + alloc.authors + alloc.history + alloc.reason) - 11;
  const tailPt = 89 - LN * extra;
  // 空きを詰めた分（10pt）は、白紙時に見出しが原本の位置に来るよう直前の欄の最小高さに足す
  const GAP_PT = 6;
  // 記入のある欄は内容の高さだけ。空の欄だけ原本の空き行分の高さを保つ（白紙では原本どおりの位置）
  const box = (key, html) => `<div class="box" data-key="${key}" style="min-height:${html ? 0 : alloc[key] * LN + (key === "title" ? 0 : LN - GAP_PT)}pt">${html}</div>`;

  const wa = lang === "和" ? '<span class="circled">和</span>' : "和";
  const ei = lang === "英" ? '<span class="circled">英</span>' : "英";

  // 交付通番の各欄：原本の空白位置（pt, 本文右端からではなく枠内左端77ptからの相対）
  // 記入値は幅に関係なく、原本の空白の中心（年の数字は「年」の直前）に揃える
  const banSlot = (i, x0, x1) => `<span class="slot ban-fixed ban-slot" data-max="${(x1 - x0).toFixed(1)}" style="left:${rel((x0 + x1) / 2)}">${ban[i] || ""}</span>`;
  const numSlot = (v, x0, x1, right) => `<span class="slot${right ? " r" : ""}" style="left:${rel(right ? x1 : (x0 + x1) / 2)}">${esc(v)}</span>`;

  document.getElementById("sheet").innerHTML = `
    <div class="overlay"></div>
    <div class="note">
      <div class="ln"><span class="abs fitw" data-w="63.9" style="left:0">［著者の方へ］</span><span class="abs fitw" data-w="385.4" style="left:80.1pt">本誌へのご投稿を是非ご検討ください．ご投稿の際には，本調書を論文に同封して下さ</span></div>
      <div class="ln"><span class="abs fitw" data-w="465.4" style="left:0">い．なお，ご投稿にあたっては，「投稿のしおり」にある「投稿資格」や「著作権の遵守」「二重投稿の禁止」な</span></div>
      <div class="ln"><span class="abs fitw" data-w="308.1" style="left:0">ど，各種注意事項を遵守いただけますよう，よろしくお願いいたします．</span></div>
    </div>
    <div class="ln"></div>
    <div class="ln">
      <span class="abs fitw" data-w="73.7" style="left:290.4pt">著者投稿年月日</span>
      <span class="abs" style="left:405.9pt">年</span>
      <span class="abs" style="left:430.4pt">月</span>
      <span class="abs" style="left:454.8pt">日</span>
    </div>
    <div class="frame" id="frame">
      <div class="ln">
        <span class="abs fitw ban-fixed" data-w="47.4" style="left:${rel(383.5)}">［交付通番</span>
        ${banSlot(0, 434.1, 458.8)}
        <span class="abs ban-fixed" style="left:${rel(458.8)}">－</span>
        ${banSlot(1, 469.3, 483.1)}
        <span class="abs ban-fixed" style="left:${rel(483.1)}">－</span>
        ${banSlot(2, 493.7, 507.6)}
        <span class="abs ban-flow" style="left:${rel(525.1)}"><span class="fitw" data-w="47.4">［交付通番</span><span>${ban.join("－")}</span></span>
        <span class="abs" style="left:${rel(525.1)}">］</span>
      </div>
      <div class="ln"></div>
      <div class="ln"><span class="abs fitw" data-w="149.9" style="left:0">｛${wa}・${ei}｝文論文誌Ｄ編集委員会殿</span></div>
      <div class="ln"></div>
      <div class="ln"><span class="abs fitw" data-w="136.7" style="left:${rel(235.3)}">研究専門委員会推薦論文調書</span></div>
      <div class="ln"></div>
      <div class="ln">${committee
        ? `<span class="abs" style="left:${rel(294.95)};transform:translateX(-50%)">［<span style="display:inline-block;min-width:48.9pt;text-align:center">${esc(committee)}</span>］</span>`
        : `<span class="abs" style="left:${rel(265.2)}">［</span><span class="abs" style="left:${rel(319.4)}">］</span>`}</div>
      <div class="ln"><span class="abs fitw" data-w="73.8" style="left:${rel(272.1)}">研究専門委員会</span></div>
      <div class="ln"></div>
      <div class="ln"><span class="abs fitw" data-w="231.1" style="left:0">下記の研究を優秀と認め，論文として推薦致します．</span></div>
      <div class="ln"></div>
      <div class="ln"></div>
      <div class="ln"><span class="abs" style="left:${rel(298.3)}">記</span></div>
      <div class="ln"></div>

      <div class="mid" id="mid">
      <div class="item i1">
        <div class="ln"><span class="abs fitw u" data-w="45.8" style="left:0">１．論文名</span>${showGuide ? `<span class="abs fitw" data-w="270.1" style="left:${rel(122.8)}">（実際の投稿論文名と完全に一致している必要はありません）</span>` : ""}</div>
        ${box("title", s.title ? `<div class="fill">${paras(s.title, false)}</div>` : "")}
        ${showGuide ? `<div class="ln"><span class="abs fitw" data-w="49.0" style="left:14pt">著者，所属</span></div>` : ""}
        ${box("authors", s.authors ? `<div class="fill">${paras(s.authors, false)}</div>` : "")}
      </div>

      <div class="ln gap"></div>
      <div class="item i2">
        <div class="ln"><span class="abs fitw u" data-w="66.8" style="left:0">２．推薦の経緯</span>${showGuide ? `<span class="abs fitw" data-w="245.1" style="left:${rel(143.8)}">（研究会などの発表経緯，議論，日時等を記して下さい）</span>` : ""}</div>
        ${box("history", s.history ? `<div class="fill">${paras(s.history)}</div>` : "")}
      </div>

      <div class="ln gap"></div>
      <div class="item i3">
        <div class="ln"><span class="abs fitw u" data-w="66.6" style="left:0">３．推薦の理由</span></div>
        ${box("reason", s.reason ? `<div class="fill">${paras(s.reason)}</div>` : "")}
      </div>

      <div class="ln gap"></div>
      </div>
      <div class="item i4">
        <div class="ln"><span class="abs fitw u" data-w="124.5" style="left:0">４．推薦年月日・委員長署名</span></div>
        <div class="ln"></div>
        <div class="ln">
          ${numSlot(dp.y, 77, 143.4, true)}
          <span class="abs" style="left:${rel(146.6)}">年</span>
          ${numSlot(dp.mo, 157.2, 171.1)}
          <span class="abs" style="left:${rel(171.1)}">月</span>
          ${numSlot(dp.d, 181.7, 195.7)}
          <span class="abs" style="left:${rel(195.7)}">日</span>
          <span class="sign">${signData ? `<img class="sign-img" src="${signData}" alt="委員長署名" style="height:${signH}pt">` : (s.signer ? inline(s.signer) : "")}</span>
        </div>
        <div class="tail"></div>
      </div>
    </div>`;

  // 交付通番：各欄が原本の空白に収まれば原本の位置のまま。「SC-2026-01」のように収まらないときは、
  // 「］」の手前に右寄せでひと続きに並べ、足りない分だけ「［交付通番」を左へ寄せる
  // （原本にある通番の後ろの「（　）」は使わないので出していない）
  const banEl = document.getElementById("sheet");
  const banWide = [...banEl.querySelectorAll(".ban-slot")].some(el => el.offsetWidth > parseFloat(el.dataset.max) * 96 / 72 + 0.5) || ban.length > 3;
  banEl.querySelectorAll(banWide ? ".ban-fixed" : ".ban-flow").forEach(el => el.remove());

  // 原本の文字幅に合わせて字間を調整（環境のフォント差を吸収）
  document.querySelectorAll("#sheet .fitw").forEach(el => {
    el.style.letterSpacing = "0";
    const target = parseFloat(el.dataset.w) * 96 / 72;
    const n = [...el.textContent].length;
    if (n > 1) el.style.letterSpacing = ((target - el.offsetWidth) / n) + "px";
  });

  // チェック
  const warns = [];
  const missing = [["title","論文名"],["authors","著者・所属"],["history","推薦の経緯"],["reason","推薦の理由"],["signer","推薦人"]].filter(([k]) => !s[k] && !(k === "signer" && signData)).map(([, n]) => n);
  if (!committee) missing.unshift("研究専門委員会");
  if (!lang) missing.unshift("宛先（和文／英文）");
  if (!s.date) missing.push("推薦年月日");
  // 未記入はエラーではなく、行数表の下に「未記入」として表示する
  if (s.date && !dp.ok && !dp.tpl) warns.push("推薦年月日は「2026-04-01」の形式で書いてください。");
  const ph = (md.match(/［[^］]*］/g) || []).length;   // ひな形の穴埋め箇所（エラーではなく確認として表示）
  if (unknown.length) warns.push(`原様式にない見出し：${unknown.join("、")}（調書には出力しません）`);
  const signer = normName(s.signer);
  let coi = false;
  if (signer.length >= 2 && s.authors) {
    const authors = s.authors.split(/[、,，・\n]/).map(a => normName(a.replace(/（.*?）|\(.*?\)/g, ""))).filter(Boolean);
    coi = authors.some(a => signer.includes(a));
  }
  // 分量が多いときは、１〜３の記入内容の文字を少しずつ小さくする（見出し・空行はそのまま）
  const sheetEl = document.getElementById("sheet");
  const mid = document.getElementById("mid");
  const BASE_FS = 10.5, MIN_FS = Math.max(6, Math.min(10.5, parseFloat(meta["最小文字"]) || 8));
  const autoShrink = !/しない|なし|非|off|false/i.test(meta["自動縮小"] || "");
  const setFs = v => { sheetEl.style.setProperty("--fs", v + "pt"); sheetEl.style.setProperty("--lh", (v * 16 / BASE_FS).toFixed(3) + "pt"); };
  const overflowing = () => mid.scrollHeight > mid.clientHeight + 0.5;
  let fs = BASE_FS, shrunk = false;
  setFs(fs);
  if (overflowing()) mid.querySelectorAll(".box").forEach(b => b.style.minHeight = "0");
  if (autoShrink && overflowing()) {
    shrunk = true;
    while (fs > MIN_FS && overflowing()) { fs = Math.round((fs - 0.25) * 100) / 100; setFs(fs); }
  }

  // 行数の集計
  const LABEL = { title: "論文名", authors: "著者，所属", history: "推薦の経緯", reason: "推薦の理由" };
  const pxPerLine = LN * 96 / 72;
  const pxPerFillLine = pxPerLine * fs / BASE_FS;
  let rows = "";
  let usedPx = 0;
  const boxesEl = [...mid.querySelectorAll(".box")];
  const savedMin = boxesEl.map(b => b.style.minHeight);
  boxesEl.forEach(b => b.style.minHeight = "0");           // 空き行を除いた実際の記入量で残りを数える
  [...mid.children].forEach(c => { usedPx += c.classList.contains("gap") ? GAP_PT * 96 / 72 : c.offsetHeight; });
  boxesEl.forEach((b, i) => b.style.minHeight = savedMin[i]);
  mid.querySelectorAll(".box").forEach(b => {
    const k = b.dataset.key, f = b.querySelector(".fill");
    const used = f ? Math.round(f.offsetHeight / pxPerFillLine) : 0;
    rows += `<span>${LABEL[k]}</span><span class="ok">${used} 行</span><span></span>`;
  });
  const stillOver = overflowing();
  const freeLines = Math.max(0, Math.floor((mid.clientHeight - usedPx) / pxPerLine + 0.05));
  rows += `<span>文字サイズ</span><span class="${stillOver ? "ng" : "ok"}">${fs}pt</span><span class="${stillOver ? "ng" : "ok"}">${stillOver ? `最小${MIN_FS}ptまで小さくしても収まりません` : (fs < BASE_FS ? `分量が多いため${BASE_FS}ptから縮小しています` : "標準")}</span>`;
  if (!shrunk) rows += `<span>４までの残り</span><span class="ok">${freeLines} 行</span><span class="ok">${freeLines ? "これを超えると文字が小さくなります" : "これ以上書くと文字が小さくなります"}</span>`;
  rows += `<span class="note2">1行は全角約41字（10.5pt時）。１と４の見出しは原本の位置に固定で、２・３は記入量に合わせて動きます。収まらないときは記入内容の文字を${MIN_FS}ptまで自動で小さくします。</span>`;
  const todo = [missing.length ? `${missing.join("、")}` : "", ph ? `［ ］の穴埋め ${ph} か所（プレビューの赤字）` : "", (dp.tpl && !dp.ok) ? "推薦年月日の xx" : ""].filter(Boolean);
  if (todo.length) rows += `<span class="note2">未記入：${todo.join("、")}</span>`;
  if (coi) rows += `<span class="note2">確認：署名者が著者に含まれています。提出前に、委員長代理の署名にするかを幹事団で確認してください。</span>`;
  document.getElementById("counts").innerHTML = rows;
  const midOver = Math.ceil((mid.scrollHeight - mid.clientHeight) / pxPerFillLine - 0.05);
  mid.classList.toggle("overflow", midOver > 0);
  if (midOver > 0) warns.push(`１〜３の記入が４の位置に食い込んでいます。${shrunk ? `文字を${fs}ptまで小さくしても収まらないため、` : ""}あと${midOver}行分削ってください（４は原本の位置に固定）。`);
  const frame = document.getElementById("frame");
  const overPx = frame.scrollHeight - frame.clientHeight;
  const overLines = Math.ceil(overPx / pxPerLine - 0.05);
  frame.classList.toggle("overflow", overLines > 0);
  if (overLines > 0) warns.push(`枠に収まりません。あと${overLines}行分削ってください（枠は原本の位置に固定のため、はみ出した文字は枠の外に出ます）。`);
  document.getElementById("warn").innerHTML = warns.map(w => `<p>${esc(w)}</p>`).join("");
  fit();
}

function fit() {
  const pane = document.getElementById("pane"), stage = document.getElementById("stage"), sheet = document.getElementById("sheet");
  const w = 595.32 * 96 / 72;
  const avail = pane.clientWidth - 40;
  const k = Math.min(1, avail / w);
  sheet.style.transform = k < 1 ? `scale(${k})` : "";
  stage.style.width = (w * k) + "px";
  stage.style.height = (sheet.offsetHeight * k) + "px";
  document.getElementById("pvbar").style.width = (w * k) + "px";
}

function save() { try { localStorage.setItem(STORE_KEY, src.value); } catch (e) { document.getElementById("status").textContent = "このブラウザでは自動保存できません。内容は別途保存してください。"; } }
function load() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }

// ===== 委員長の署名画像（このブラウザ内にだけ保存。サーバには送らない） =====
const SIGN_KEY = "suisen-chosho-sign-v1";
let signData = null;
try { signData = localStorage.getItem(SIGN_KEY) || null; } catch (e) { signData = null; }

// 写真やスキャンから署名の線だけを取り出す：紙の地色を透明にし、余白を切り落とす
function prepareSign(img) {
  const MAX = 1400;
  const k = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);          // 透過PNGは白地に重ねてから処理する
  g.drawImage(img, 0, 0, w, h);
  const im = g.getImageData(0, 0, w, h), d = im.data;
  const lum = i => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  // 紙の明るさ：外周の画素の中央値
  const edge = [];
  const stepX = Math.max(1, Math.floor(w / 200)), stepY = Math.max(1, Math.floor(h / 200));
  for (let x = 0; x < w; x += stepX) { edge.push(lum(x * 4), lum(((h - 1) * w + x) * 4)); }
  for (let y = 0; y < h; y += stepY) { edge.push(lum(y * w * 4), lum((y * w + w - 1) * 4)); }
  edge.sort((a, b) => a - b);
  const bg = edge[Math.floor(edge.length / 2)];
  const margin = 24, span = Math.max(40, bg * 0.35);     // 地色よりこれだけ暗い画素から線として扱う
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const a = Math.max(0, Math.min(1, (bg - lum(i) - margin) / span));
    d[i + 3] = Math.round(a * 255);
    if (a > 0.5) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;                                // 線が見つからない
  g.putImageData(im, 0, 0);
  const pad = 4;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
  const s = Math.min(1, 320 / ch, 1200 / cw);            // 印刷に十分な大きさまで縮めて保存量を抑える
  const o = document.createElement("canvas"); o.width = Math.max(1, Math.round(cw * s)); o.height = Math.max(1, Math.round(ch * s));
  o.getContext("2d").drawImage(c, x0, y0, cw, ch, 0, 0, o.width, o.height);
  return o.toDataURL("image/png");
}
function refreshSign() {
  document.getElementById("sign-state").textContent = signData
    ? "設定済み。調書の署名欄に画像を出します。"
    : "未設定。署名欄には「推薦人」の文字を出します。";
  document.getElementById("btn-sign-del").disabled = !signData;
}
document.getElementById("btn-sign").addEventListener("click", () => document.getElementById("sign-file").click());
document.getElementById("sign-file").addEventListener("change", e => {
  const file = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!file) return;
  const st = document.getElementById("status");
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    let data = null;
    try { data = prepareSign(img); } catch (err) { data = null; }
    if (!data) { st.textContent = "画像から署名の線を見つけられませんでした。白い紙に濃いペンで書いた画像を使ってください。"; return; }
    signData = data;
    let stored = true;
    try { localStorage.setItem(SIGN_KEY, data); } catch (err) { stored = false; }
    refreshSign(); render();
    st.textContent = stored
      ? "署名画像を設定しました。画像はこのブラウザの中にだけ保存されます。"
      : "署名画像を設定しました。このブラウザには保存できなかったため、ページを閉じると消えます。";
  };
  img.onerror = () => { URL.revokeObjectURL(url); st.textContent = "この画像は読み込めませんでした。PNGかJPEGの画像を使ってください。"; };
  img.src = url;
});
document.getElementById("btn-sign-del").addEventListener("click", () => {
  signData = null;
  try { localStorage.removeItem(SIGN_KEY); } catch (err) {}
  refreshSign(); render();
  document.getElementById("status").textContent = "署名画像を外しました。";
});
refreshSign();

const src = document.getElementById("src");
src.value = load() || SAMPLE;
render();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
window.addEventListener("resize", fit);

let timer;
src.addEventListener("input", () => { render(); clearTimeout(timer); timer = setTimeout(save, 400); });
// 確認ダイアログは公開ページでは表示されないことがあるため使わず、置き換え後に「元に戻す」を出す
let undoValue = null;
function replaceWith(text, label) {
  if (src.value === text) return;
  undoValue = src.value;
  src.value = text; render(); save();
  const st = document.getElementById("status");
  st.innerHTML = `${label}。<button type="button" id="btn-undo">元に戻す</button>`;
  document.getElementById("btn-undo").addEventListener("click", () => {
    if (undoValue === null) return;
    src.value = undoValue; undoValue = null; render(); save();
    st.textContent = "元の内容に戻しました。入力内容はこのブラウザに自動保存されます。";
  });
}
document.getElementById("btn-sample").addEventListener("click", () => replaceWith(SAMPLE, "ひな形を入れました"));
document.getElementById("btn-blank").addEventListener("click", () => replaceWith(BLANK, "白紙にしました"));

// ===== 名前を付けて保存／読み出し（このブラウザ内に保存） =====
const SAVES_KEY = "suisen-chosho-saves-v1";
const statusEl = document.getElementById("status");
function readSaves() { try { return JSON.parse(localStorage.getItem(SAVES_KEY) || "{}") || {}; } catch (e) { return {}; } }
function writeSaves(o) { try { localStorage.setItem(SAVES_KEY, JSON.stringify(o)); return true; } catch (e) { return false; } }
function fmtTime(t) { const d = new Date(t); const p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }
function refreshList(select) {
  const saves = readSaves(), sel = document.getElementById("save-list");
  const names = Object.keys(saves).sort((a, b) => saves[b].t - saves[a].t);
  sel.innerHTML = names.length
    ? names.map(n => `<option value="${esc(n)}">${esc(n)}（${fmtTime(saves[n].t)}）</option>`).join("")
    : '<option value="">（まだありません）</option>';
  if (select && saves[select]) sel.value = select;
  document.getElementById("btn-load").disabled = !names.length;
  document.getElementById("btn-del").disabled = !names.length;
}
function suggestName() {
  const { sections } = parse(src.value);
  const t = (sections.title || "").replace(/［[^］]*］/g, "").trim();
  return t ? t.slice(0, 30) : "";
}
document.getElementById("btn-save").addEventListener("click", () => {
  const input = document.getElementById("save-name");
  const name = input.value.trim() || suggestName() || `無題 ${fmtTime(Date.now())}`;
  const saves = readSaves();
  const existed = !!saves[name];
  saves[name] = { md: src.value, t: Date.now() };
  if (!writeSaves(saves)) { statusEl.textContent = "このブラウザでは保存できませんでした。内容はテキストとして別に控えてください。"; return; }
  input.value = name;
  refreshList(name);
  statusEl.textContent = existed ? `「${name}」を上書き保存しました。` : `「${name}」として保存しました。`;
});
document.getElementById("btn-load").addEventListener("click", () => {
  const name = document.getElementById("save-list").value, saves = readSaves();
  if (!saves[name]) return;
  document.getElementById("save-name").value = name;
  replaceWith(saves[name].md, `「${name}」を読み出しました`);
  if (src.value === saves[name].md) statusEl.firstChild && (statusEl.firstChild.textContent = `「${name}」を読み出しました。`);
});
document.getElementById("btn-del").addEventListener("click", () => {
  const name = document.getElementById("save-list").value, saves = readSaves();
  if (!saves[name]) return;
  const removed = saves[name];
  delete saves[name]; writeSaves(saves); refreshList();
  statusEl.innerHTML = `「${esc(name)}」を削除しました。<button type="button" id="btn-undel">元に戻す</button>`;
  document.getElementById("btn-undel").addEventListener("click", () => {
    const s2 = readSaves(); s2[name] = removed; writeSaves(s2); refreshList(name);
    statusEl.textContent = `「${name}」を元に戻しました。`;
  });
});
refreshList();
document.getElementById("btn-overlay").addEventListener("click", e => {
  const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
  e.currentTarget.setAttribute("aria-pressed", String(on));
  document.getElementById("sheet").classList.toggle("show-overlay", on);
});
document.getElementById("btn-print").addEventListener("click", () => {
  try { window.print(); }
  catch (e) { document.getElementById("status").textContent = "ここから印刷できない場合は、ブラウザの印刷（Ctrl/⌘+P）を使ってください。"; }
});
})();
