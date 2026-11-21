import { writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { evidenceRows, catalog, registry, audits } from './build-audit-records.mjs';
import { writeDraftDocx } from './docx-draft.mjs';
const artworks=JSON.parse(readFileSync('src/data/artworks.json','utf8'));
const md=[],html=[],blocks=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function heading(level,text){blocks.push({type:'heading',level,text});md.push('#'.repeat(level)+' '+text+'\n');html.push(`<h${level}>${esc(text)}</h${level}>`);}
function paragraph(text){blocks.push({type:'paragraph',text});md.push(text+'\n');html.push(`<p>${esc(text).replaceAll('\n','<br>')}</p>`);}
function link(text,url){blocks.push({type:'link',text,url});md.push(`[${text}](${url})\n`);html.push(`<p><a href="${esc(url)}">${esc(text)}</a></p>`);}
function table(headers,rows){blocks.push({type:'table',headers,rows});md.push('| '+headers.join(' | ')+' |','| '+headers.map(()=> '---').join(' | ')+' |',...rows.map(r=>'| '+r.map(x=>String(x).replaceAll('|','／').replaceAll('\n','<br>')).join(' | ')+' |'),'');html.push('<table><thead><tr>'+headers.map(h=>`<th>${esc(h)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>`<td>${esc(c).replaceAll('\n','<br>')}</td>`).join('')+'</tr>').join('')+'</tbody></table>');}
const claim=(id,field)=>evidenceRows.find(r=>r['artwork_id/page']===id&&r.修改檔案.endsWith(`:: ${field}`)&&r.主張類型!=='修訂前主張')?.claim_id??'見證據登錄表';
heading(1,'江戶不打烊：從黃昏到黎明的城市夜生活');
paragraph('期末報告分章修訂稿｜內容核對日期：2026 年 11 月 18 日');
paragraph('文件狀態：尚未取得原期末報告 DOCX。本稿以目前可讀取的網站、館藏資料、Git 紀錄與 contributions.csv 編成，供合併回原稿使用；不冒稱已修訂原 DOCX，也不代填組別、學號、繳交日期、會議出席或觀眾測試結果。');
paragraph('原始基線：feature/update；b61293fab0cdc4de8564d71c2e91016b21ffa53d。下列章節中的「已實作」「程式測試」「瀏覽器實測」「待執行」各有不同意義。');
paragraph('前期底稿：已從 Git f6f3650 找回本組七頁期中簡報 PDF 與講稿 DOCX，逐頁及逐段核讀；原件保存在 evidence/recovered/。它們不是原期末報告，也不是教師的期中範例。本稿保留前期的八件核心順序與觀察方法，修正其中缺乏來源的物件鑑定、創作動機及鐘點推定。');
heading(1,'第一章　研究問題與策展方法');
paragraph('本展以歌川廣重的十一件城市風景版畫，組織八件核心與三件延伸作品。問題不只是江戶夜裡有哪些娛樂，也包括遊賞、移動與待客如何相連，以及哪些工作不容易被風景畫的美感注意到。');
paragraph('研究問題一：畫面如何利用橋架、窗框、街道與留空，安排觀眾的位置？研究問題二：加入館方解說與制度背景後，遊客和工作者的經驗有什麼差別？研究問題三：數位展示如何協助觀眾分辨看見的線索、來源提供的解釋與自己的推論？');
paragraph('The Met 亞洲藝術部（2003）說明木版畫的複數印製與出版者參與。這種媒介適合研究城市如何被觀看與介紹，卻不能當成沒有選擇和設計的攝影紀錄。Cambridge University Press（n.d.）的 Nenzi《Japan After Dark》公開摘要，提供公共照明普及以前已有活躍夜生活的研究入口。本次沒有取得全書，不列出未讀頁碼，也不將摘要延伸成個別人物的作息。證據索引：'+claim('CUR-01','正文／相同說法全站同步')+'、'+claim('CUR-02','正文／相同說法全站同步')+'。');
table(['預期學習目標','可觀察的表現','如何評量'],[
 ['找出圖像線索','在一幅畫指出至少兩處位置，說明它們如何影響觀看','訪談／手帖記錄觀眾指出的位置與說法；尚未實施真人研究'],
 ['分辨證據層次','就一段解說分別指出圖像所見、具名來源與策展推論','以《月之岬》的差異解讀追問；不將開放反思計分'],
 ['比較夜間經驗','比較《兩國花火》與《御廄河岸》，各舉一項遊賞與工作線索','由圖像與站內介紹說明，不要求背誦人物姓名或鐘點'],
]);
paragraph('這些是設計目標，不是已證明達成的學習成效。沒有真人受測者資料，不能寫出通過比例、滿意度或觀眾引言。');
heading(1,'第二章　展覽路線與數位設計');
paragraph('18:00 至隔日 05:00 是策展敘事安排，並非事件的精確時間，也不是同一歷史夜晚。春季夜櫻、陰曆十一月的酉祭與不同出版年代，各自保留原有脈絡。《淺草田甫酉之町詣》畫中為黃昏，放在 00:00 站用來接續室內與祭典的討論。');
table(['策展站點','作品','網站目前摘要'],artworks.filter(a=>a.group==='core').map(a=>[a.curatorialTime+'（敘事）',a.title,a.summary]));
paragraph('21:00 後的過場由人群、宴席痕跡轉向渡船上的工作者；午夜到黎明之間，只轉換觀看與提問，不補寫圖像沒有記錄的事件。《廓中東雲》以較疏落的街景回看整場展覽，不將散場等同於遊女服役關係終止。');
table(['功能','策展目的','預期學習','驗證方法與狀態'],[
 ['提燈首頁','讓觀眾先分區注意畫面','指出亮區與全圖中的細節差別','已檢降低動態模式；真人學習差異待測'],
 ['橫向時間軸','把不同作品組成一條導覽','區分策展時刻、作品年代與季節','已檢手機文字顯示與前後站／鍵盤；不當作歷史時間重建'],
 ['六件作品推鏡','指向有助閱讀的細節','由局部回到全圖','六件資料設定已查；新焦點與原圖核對，部分外圖載入仍受服務限制'],
 ['古今雙地圖','比較相關區域與水路','理解配準與定位的限制','五幅 metadata 已核；兩圖同步縮放與鍵盤移動已測'],
 ['活動一四個情境','整理觀展視角','嘗試另一種閱讀位置','四題與結果推薦連結已測；不是人格或歷史身分測驗'],
 ['活動二 6／26 題','由觀察接到背景與反思','以站內介紹和圖像判讀','隨機與全展路線、回饋、來源與手帖已以 Edge 走完'],
 ['本機手帖保存與下載','保留觀眾思考及來源','區分我看到／我推論／我仍有疑問','localStorage、舊版本遷移與文字下載已測；不需要帳號或後端'],
]);
paragraph('《月之岬》的資料處理示範：東京國立博物館透過文化遺產線上將房間讀為月見宴結束後；Zimmerli 的署名文章則讀為月見會中的歌舞。本展並列差異，不將任一階段當成唯一史實，也不宣稱廣重為地震後祈福而創作本圖。精確現代地點未獲足夠證據，原有座標暫予撤除。');
paragraph('期中簡報第 4 頁曾將鮪魚生魚片、煙草盆、煙管袋、手巾等逐一列為直接觀察，並以全民月見文化與災後復興意圖解釋本作。本次沒有取得支持這整套鑑定和主觀意圖的可靠研究，不承接進新稿。這不表示已證明各物件或所有背景年代錯誤，而是它們尚未達到本次引用標準。對照索引：MIDTERM-objects、MIDTERM-universal、MIDTERM-intention（見證據登錄表 artwork_id/page 欄）。');
heading(1,'第三章　十一件作品的編目、詮釋與權利');
paragraph('八件核心展示圖像對應 The Met 的 JP1312、JP1158、JP642、JP608、JP1185、JP1547、JP60、JP1024；各件 API 的 primaryImage 與本頁檔案一致，且 isPublicDomain 為 true。三件補充圖像來自 Commons，不能統稱十一件全來自 The Met。尺寸、序號與其他印本的來源範圍另見 artwork-catalog.csv 及 rights-register.csv。');
for(const a of artworks){
 const c=catalog.find(c=>c.artwork_id===a.id);
 heading(2,`${a.id}　${a.title}`);
 paragraph(`作者：${a.artist}。日文題名：${a.titleJa}。英文：${a.titleEn}。系列：${a.series}${a.seriesNo?'，第 '+a.seriesNo+' 景':''}。年代：${a.year??'The Met 未定年'}。媒材：${a.medium}。`);
 paragraph(`目前圖像：${c.collection}；館藏號：${c.accession}。本頁印本尺寸：${c.dimensions}。策展位置：${a.curatorialTime??'白晝序章'}，${a.timeLabel}。${c.remaining?'保留限制：'+c.remaining+'。':''}`);
 paragraph(a.summary);
 if(a.id==='A06')paragraph('The Met 同一段先談北齋另一幅渡船，再談廣重圖中的夜鷹。本展只將後者用於本作人物解讀，不添入 23:00 或午夜上工的鐘點。');
 if(a.id==='A07')paragraph('髮簪禮物是館方推測，不能改寫為已發生的送禮事件；觀看位置在新吉原一帶，祭典目的地在畫外，兩者不混用。');
 if(a.id==='A04')paragraph('陰曆三月暫植櫻樹、七月玉菊燈籠、八月俄祭典，是 Geidai 的一般背景；不能據此認定每位畫中人物的身分、債務或自由程度。');
 if(a.id==='B01')paragraph('Commons 上傳史記錄色彩處理。原典藏未確認，慶應 200X@5-56 只能作同構圖解說來源，不能填成此數位圖像的館藏號。');
 if(a.id==='B02')paragraph('本次取得並核看的為本檔正式 500px 縮圖；原始 789×1200 檔案受到限流。月亮可見，但月亮與黃昏並不矛盾，也不直接證明整幅畫由月光照明或已到深夜。');
 paragraph('證據索引：'+claim(a.id,'year')+'、'+claim(a.id,'summary')+'、'+claim(a.id,'location')+'。');
 link('圖像來源（本頁目前使用的資料鏈）',a.image.sourceUrl);
}
heading(1,'第四章　網站實作與互動內容');
paragraph('網站以 Astro 7.4.7、TypeScript 模組、GSAP 3.15.1 與 Leaflet 1.9.4 組成，保留 GitHub Pages 的 /edo-after-dark/ 子路徑。11 件均有基本資料及四段介紹；A03–A08 六件有推鏡設定，A01、A02、B01、B02、B03 五件為一般圖文展示，不能將八件核心全稱為已製作推鏡。');
paragraph('活動一保留四個情境與四種觀展視角，同分並列，背景各有具名機構來源。活動二保留全部 26 個題目 ID、11 件作品及原選題路線；預設三幅六題，另有專看一幅與完整模式。選填反思不計分，可略過；手帖將展覽解說與觀眾文字分開，下載純文字時保留來源網址。');
paragraph('月之岬修正了影子與三味線的焦點；萬八補上地方史來源；廓中東雲改用已核讀的題名與人物疏密；駿河町延伸題不再先假定建築或富士山視野已完成現代對照。其餘題目若原有邏輯與來源可支持即保留，逐欄結果見 question-audit.csv。');
paragraph('本次沒有更換主站圖像或擴增推鏡作品數量。Commons 卡片縮圖改用其正式縮圖主機；同檔影像、原圖來源與權利標示保持可追查。其他印本的尺寸、色彩及木紋不轉移到本頁印本。');
heading(1,'第五章　學生數位策展與博物館職能');
paragraph('ICOM 於 2022 年 8 月 24 日通過的定義包含以下完整要素（此處轉述，完整原文見官方連結）：博物館是服務社會的非營利常設機構，研究、蒐藏、保存、詮釋並展示有形與無形遺產；向公眾開放，具可及性與包容性，促進多樣性與永續；以倫理、專業及社群參與運作與溝通，提供教育、欣賞、反思及知識分享的多元經驗。');
link('ICOM 完整定義原文',registry.find(s=>s.id==='icom').url);
paragraph('本展以外部館藏的數位資料進行研究、詮釋與教育展示。標示來源和保存程式碼，是資料管理的一部分；本小組沒有取得實體藏品，也沒有完成機構治理、文物保護、長期保存或社群參與研究。網站名稱使用線上博物館，不等於已具備所有正式機構職能。');
paragraph('因此，本展的教育責任首先是說明我們看到了什麼、依誰的研究作解釋，以及哪些推論還有疑點。美感與互動應協助觀眾閱讀，不能使不確定的身分、時間或制度看起來像確定事實。');
heading(1,'第六章　實際分工、版本與進度');
const team=readFileSync('contributions.csv','utf8').trim().split(/\r?\n/).map(line=>{const [name,...rest]=line.split(',');return [name.trim(),rest.join(',').trim()||'未提供；待本人確認'];});
table(['姓名（依原 CSV）','原檔提供的分工'],team);
paragraph('上表不因 Git 作者姓名、活動內容或本次代理修改而替組員推定新的責任。沒有取得會議證據，不填寫出席者、開會日期、討論決議或同儕回饋。');
paragraph('找回的期中簡報第 7 頁另有分頁安排：梁棨理 P5、王鴻翰 P3、劉彥廷 P4、黃子懿 P1／P2、曾祥恩 P6／P7，另兩位未填頁碼。這只能證明期中簡報的頁面安排，不能直接當作期末專案分工；三位原 CSV 空白者仍需本人確認。姓名沿用目前 CSV，不由低解析表格改寫人名或學號。');
const commits=execFileSync('git',['log','-5','--format=%h|%aI|%s'],{encoding:'utf8'}).trim().split('\n').map(l=>{const [hash,time,...subject]=l.split('|');return [hash,time,subject.join('|')];});
table(['版本','Git 記錄時間','提交主旨（只作版本證據）'],commits);
table(['進度項目','可證日期／狀態','依據／下一步'],[
 ['網站與作品文案基線','2026-11-13、11-15 已有提交','只按 Git 主旨與現存程式記錄，不推定會議時間'],
 ['本次來源、程式與題庫審核','2026-11-18 已執行','evidence-register、question-audit、差異檔及測試紀錄'],
 ['原 DOCX 的分章合併與排版','待執行，未排定日期','需原始 DOCX 與老師引用格式 PDF'],
 ['三位組員分工確認','待本人提供，未排定日期','劉彥廷、王怡婷、郭濬瑀原欄位空白'],
 ['約五位真人觀眾研究','尚未實施，未排定日期','已備腳本與同意／匿名紀錄空表'],
 ['圖像原館藏與爭議複核','待人工／機構資料','B01 原典藏、B02/B03 原頁、月之岬地點與活動階段'],
]);
heading(1,'第七章　資料來源與引用方法');
paragraph('尚未取得老師的引用格式 PDF，以下以一致的「機構／作者、年份或 n.d.、題名、館藏號、URL、本次讀取範圍」暫編。沒有讀到全文的書籍及頁面不假造頁碼或引文。引用格式待取得課程規範後再核對，不宣稱已完全符合該規範。');
for(const source of registry.filter(s=>!s.id.startsWith('api-'))){
 paragraph(`${source.institution}. (${source.id==='icom'?'2022':source.id==='metEssay'?'2003':source.id==='yoshiwara'?'2024':'n.d.'}). ${source.title}${source.accession?'（'+source.accession+'）':''}。核對日期：2026-11-18。讀取狀態：${source.read}。${source.scope}`);
 link('來源網址',source.url);
}
heading(1,'第八章　驗證與限制');
paragraph('乾淨安裝 npm ci 成功。Windows 應用程式控制阻擋 satteri 原生模組，原生 npm run build 失敗；未更動安全政策。以鎖定版本補上官方同版本 WASM 後端後，npm run build 成功產出 19 個 Astro 頁面。package.json、package-lock.json 與部署子路徑未改動。這是本機替代後端的驗證，不冒稱原生後端已解除問題。');
paragraph('Node 24.19.0／npm 11.17.0 下，17 項測試涵蓋原有九項、編目／來源／遷移／匯出五項，以及建置連結／錨點／草稿提示三項。這些只驗證程式、資料關聯與輸出，歷史內容另由逐條來源審查支撐。');
paragraph('隔離 Edge 157.0.4341.60 以實際滑鼠與鍵盤事件檢查：1440×1000 桌面、390×844 手機版面；首頁低動態、11 件作品基本頁、活動一四題、隨機六題與完整二十六題、答錯回饋、保存、下載、雙圖同步與手機時間軸。沒有真人觀眾。這是自動化瀏覽器驗收，不是觀眾研究。詳細通過／失敗與後續重跑結果以 docs/test-report.md 及 browser-tests.json 為準。');
paragraph('限制包括外部圖像、字體及地圖圖磚的網路依賴；本次原圖下載與瀏覽器顯示不等於未來服務可用性的保證。未做實體手機、iOS／Safari、螢幕閱讀器、全站所有狀態對比度與 200% 文字放大的完整人工審查。WCAG 2.2 AA 是設計目標，沒有符合性認證。');
paragraph('本稿由缺少原 DOCX 的情況產生，不能證明已保留原封面、目錄、表格、圖說或教師規範。DOCX 與 PDF 若能產生，只是本分章稿的輸出；不得誤當已驗收原稿。');
heading(1,'第九章　結論與後續改善');
paragraph('本次已把十一件作品與二十六題放回各自可核讀的來源，讓時間軸、作品頁與互動對同一內容使用一致的表述。娛樂與工作可以從橋、遊船、室內器物、渡河人物及街道疏密一起討論；這個策展框架已實作，但觀眾是否學會區分證據，仍須真人研究。');
paragraph('後續先取得原期末報告與課程格式，核實三人的分工及真正的會議證據，再完成文件合併；史料方面優先追查補充作品原印本來源與月之岬地點，不為補齊文案而猜測。介面方面則以圖片依賴、無障礙人工測試與學習成效為優先，不增加與閱讀無關的互動。');
heading(1,'附錄　內部待辦與人工確認');
table(['項目','目前狀態','所需資料'],[
 ['原期末報告 DOCX','未取得；未修訂原檔','提供原檔路徑或原檔'],
 ['教師引用格式／期中範例 PDF','未取得；已找回的是本組期中簡報與講稿，不能混同','老師提供的兩份規範資料'],
 ['組別、學號、正式繳交日','不填假資料','組員確認；只放內部待辦'],
 ['劉彥廷、王怡婷、郭濬瑀的分工','原 CSV 空白','本人提供實際負責事項'],
 ['會議紀錄與出席','未取得','真實紀錄，不以版本提交替代出席證據'],
 ['觀眾測試','未實施','同意後招募，依空白紀錄表記錄'],
 ['DOCX 原版格式與逐頁合併','未完成','原稿取得後另存修訂版並重新渲染'],
]);
const body=html.join('\n');
writeFileSync('docs/期末報告_江戶不打烊_分章修訂稿.md',md.join('\n')+'\n');
writeFileSync('docs/report-draft.html','<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>江戶不打烊｜分章修訂稿（非原 DOCX 修訂版）</title><style>@page{size:A4;margin:20mm}body{font:11pt/1.6 "Microsoft JhengHei",sans-serif;color:#181818}h1{font-size:19pt;page-break-before:always;page-break-after:avoid}h1:first-child{page-break-before:auto}h2{font-size:14pt;page-break-after:avoid}p{margin:8pt 0;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;font-size:9pt;table-layout:fixed;margin:10pt 0}th,td{border:1px solid #aaa;padding:6pt;vertical-align:top;overflow-wrap:anywhere}th{background:#eee}tr{page-break-inside:avoid}thead{display:table-header-group}a{color:#17345c;word-break:break-all}</style></head><body>'+body+'</body></html>');
console.log('Nine-chapter draft generated; original DOCX remains unavailable.');
writeDraftDocx('docs/期末報告_江戶不打烊_分章修訂稿.docx',blocks);
