import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readZip } from './ooxml-package.mjs';
import { zip } from './docx-draft.mjs';

const source = 'docs/期末報告_江戶不打烊_修訂版.docx';
const target = 'docs/期末報告_江戶不打烊_文字精修版.docx';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(readFileSync(source)), 'e799d4e8a07af3b99b0373b0df211ab338ddb00e1f03979572f28b8ff847ca2a', 'Use only the verified original-derived revision');
assert.equal(hash(readFileSync('docs/期末報告_江戶不打烊_修訂版.pdf')), '7fa5f4e141afed1761f79894c6cd0627963715a83c1c9d03b6c4ff4bbeeef60a', 'Matching 26-page PDF');
const entries = readZip(readFileSync(source));
const document = entries.find(([name]) => name === 'word/document.xml');
const before = document[1].toString('utf8');
const decode = text => text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&amp;', '&');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pText = paragraph => [...paragraph.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(m => decode(m[1])).join('');
const note = '沒有可靠依據證明廣重為祈福而畫本作，也不以地震後出版直接推定全系列創作意圖。';
const edits = [
  {page:4,chapter:'2.2 四個閱讀層次／反思',before:'這是策展提問。'+note,after:'',reason:'反思欄保留構圖問題；創作意圖的證據限制移至第八章，並未刪除。'},
  {page:13,chapter:'4.1 網站架構與導覽路線',before:'各頁可以互相返回；本表是建議路線，沒有真人現場導覽紀錄。',after:'各頁可以互相返回。',reason:'前句已標示建議路線；沒有真人導覽並不是此處須防止的誤讀。真人研究未做仍保留於第八章。'},
  {page:13,chapter:'4.2 提燈夜行',before:'這是觀看方式的設計，不是重建某一晚的實際照明；降低動態時仍可直接閱讀完整圖像。',after:'降低動態時仍可直接閱讀完整圖像。',reason:'刪照明重建的預防性反駁，保留低動態功能說明。'},
  {page:13,chapter:'4.2 凝視細節',before:'推鏡不是每件都有，也不保證超出原圖解析度的細節。',after:'細節的清晰程度仍受原圖解析度限制。',reason:'同段已列六件推鏡與五件圖文，不需再次否定；解析度限定保留。'},
  {page:24,chapter:'8.3 未測範圍與資料限制',before:'外部圖像、字體與圖磚仍有服務依賴；B02 原圖受限，部分 Commons 原館藏鏈未確認。',after:'外部圖像、字體與圖磚仍有服務依賴；B02 原圖受限，部分 Commons 原館藏鏈未確認。'+note,reason:'接收第 2.2 節原有研究限制；不刪任何失敗紀錄、測試數字或引註。'},
  {page:25,chapter:'九、結論與後續改善',before:'本輪已核對十一件作品及二十六題，修正鐘點、人物、器物與另印本引用的過度斷言，也讓作品頁、時間軸、互動與報告使用一致表述。對月之岬活動階段保留具名差異；對精確地點與補充作品原印本不確定處，保留限制，不為完成故事而猜測。',after:'《月之岬》的器物與人影、渡船上的乘客，以及吉原夜櫻與黎明的人群，呈現遊賞與勞動的不同經驗。《月之岬》的宴席階段有不同館方解讀，精確地點與補充作品的原印本來源仍待考。',reason:'以既有作品與策展內容收束，刪修改過程自述；解讀分歧和來源限制保留。'},
];

let xml = before;
for (const edit of edits) {
  let count = 0;
  xml = xml.replace(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g, paragraph => {
    const text = pText(paragraph), start = text.indexOf(edit.before);
    if (start < 0) return paragraph;
    count++;
    const end = start + edit.before.length;
    let offset = 0, inserted = false;
    const changed = paragraph.replace(/(<w:t(?:\s[^>]*)?>)([\s\S]*?)(<\/w:t>)/g, (_, open, raw, close) => {
      const content = decode(raw), left = offset, right = offset + content.length;
      offset = right;
      if (right <= start || left >= end) return open + raw + close;
      const prefix = content.slice(0, Math.max(0, start - left));
      const suffix = content.slice(Math.min(content.length, Math.max(0, end - left)));
      const replacement = inserted ? '' : edit.after;
      inserted = true;
      return open + escape(prefix + replacement + suffix) + close;
    });
    assert.equal(pText(changed), text.replace(edit.before, edit.after));
    return changed;
  });
  assert.equal(count, 1, edit.chapter);
}
document[1] = Buffer.from(xml);
writeFileSync(target, zip(entries));
const result = readZip(readFileSync(target));
for (const [name, bytes] of entries) if (name !== 'word/document.xml') assert.ok(bytes.equals(result.find(([n]) => n === name)[1]), name);
const count = (text, pattern) => [...text.matchAll(pattern)].length;
const structure = text => ({tables:count(text,/<w:tbl>/g),paragraphs:count(text,/<w:p(?:\s[^>]*)?>/g),images:count(text,/<w:drawing>/g),hyperlinks:count(text,/<w:hyperlink(?:\s[^>]*)?>/g)});
assert.deepEqual(structure(before), structure(xml));
const record = {date:new Date().toISOString(),source,target,matchingPdf:'docs/期末報告_江戶不打烊_修訂版.pdf',sourceHash:hash(readFileSync(source)),targetHash:hash(readFileSync(target)),edits,structure:structure(xml),allOtherPackagePartsUnchanged:true,scope:'僅六處文字調整；未產生或更改 PDF。保留九章、十表、三原圖、全部引註、來源與真實測試紀錄。未重新逐頁驗收 Word 排版；目錄可在 Word 更新。'};
writeFileSync('docs/evidence/minimal-report-validation.json', JSON.stringify(record,null,2)+'\n');
const md = '# 報告必要修訂對照\n\n使用與既有 26 頁 PDF 雜湊相符的新版 DOCX，另存[文字精修版](./期末報告_江戶不打烊_文字精修版.docx)，未使用舊原稿覆蓋，也未轉 PDF。頁碼為編輯前新版 PDF 的定位，不冒稱精修版仍有相同分頁。\n\n| 原頁碼／段落 | 原文 | 修改後 | 原因 |\n| --- | --- | --- | --- |\n' + edits.map(e=>`| ${e.page}／${e.chapter} | ${e.before} | ${e.after || '（移至第八章）'} | ${e.reason} |`).join('\n') + '\n\n保持章節順序、表格數量、作品編目、測試數字、圖說、引註及書目。三張圖片與所有非正文 XML 部件逐位元不變；未重排報告。教師格式與範例檔、三位空白分工仍須人工確認，不自行補造。第八章的失敗紀錄均保留。\n';
writeFileSync('docs/報告_必要修訂對照.md', md);
console.log(JSON.stringify({target,edits:edits.length,structure:record.structure}));
