// Content decisions for the supplied original DOCX. No changes to the website.
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const original=read('docs/evidence/final-report-original/inventory.json');
const works=read('src/data/artworks.json'),sources=read('docs/evidence/sources.json');
const byId=Object.fromEntries(sources.map(s=>[s.id,s]));
const primary={A01:'bridge',A02:'manpachi',A03:'fireworksImage',A04:'cherryImage',A05:'moonImage',A06:'ferry',A07:'asakusa',A08:'dawnImage',B01:'saruwaka',B02:'embankment',B03:'suruga'};
const paragraphs={},tables={},after={},remove=[6,8,9],review=[];
const p=(text,keys=[],type='策展說明',style)=>({type:'paragraph',text,keys,claimType:type,...(style?{style}:{})});
const h=(text,level=2)=>({type:'heading',level,text});
const table=(headers,rows,widths)=>({type:'table',headers,rows,widths});
const set=(index,text,keys=[],type='策展說明')=>{paragraphs[index]=p(text,keys,type);};
const add=(index,...blocks)=>{after[index]=[...(after[index]??[]),...blocks];};
set(10,'史料與網站核對：2026 年 11 月 18 日｜原稿修訂：11 月 19 日');
set(16,'城市入夜以後，還有哪些活動？Nenzi《Japan After Dark》的出版社摘要指出，公共街燈普及以前，日本已有活躍的夜間生活（Nenzi, n.d.；僅核讀公開摘要）。本展《江戶不打烊》以歌川廣重的城市風景版畫，安排從傍晚六點到隔天清晨五點的導覽。',['nenzi'],'具名研究摘要／策展安排');
set(18,'浮世繪是視覺史料。The Met 亞洲藝術部（2003）說明，木版畫可大量印製，製作涉及畫師、雕版師、摺師與出版者。這種商業媒介適合研究城市如何被觀看，也經過題材與構圖的選擇，不能當作中立的攝影紀錄。',['metEssay'],'媒介背景／策展閱讀');
set(19,'夜晚能組織一條展覽路線。遊船、餐飲、賞月、煙火、祭典與吉原各有脈絡；本展將它們接成導覽，不把不同年代、季節的場景寫成同一個真實夜晚。');
add(21,h('1.1 研究問題與學習目標'),p('我們希望觀眾能回答三個問題：畫面安排我們從哪裡觀看城市？遊賞與工作如何出現在同一個夜間環境？哪些解釋來自畫面，哪些需要文獻，哪些仍是自己的推論？'),table(['學習目標','可觀察的表現','評量方式（尚未進行真人研究）'],[
 ['找出圖像線索','指出至少兩處細節，說明它們如何影響觀看','請觀眾指認位置並說明，不以記住題名或年代為準'],
 ['分辨證據層次','區分可見細節、具名館方解讀與個人推論','以月之岬的不同館方解讀追問，記錄原話'],
 ['比較夜間經驗','比較兩國花火與御廄河岸，各舉一項線索','由圖像與站內介紹說明遊賞和工作，不要求背誦鐘點'],
],[1800,3300,3926]),p('以上是預期學習目標。程式與瀏覽器驗收只能確認功能運作，不能代替觀眾理解或教學成效的研究。'));
tables[30]=table(['層次','以《月之岬》為例'],[
 ['1. 物件知識','歌川廣重作品，1857 年，《名所江戶百景》第 82 景，多色木版畫；本頁印本 The Met JP1185。年代、媒材依本印本編目；系列序號以 APJ 所收東京藝術大學另印本交叉核對。'],
 ['2. 直接觀察','座敷留有器物，左側障子映出人影，人物在畫邊露出局部，窗外可見月亮與海灣。可見線索不直接證明人物身分或活動階段。'],
 ['3. 館方解讀','東京國立博物館／文化遺產線上（n.d.）將同構圖印本讀為月見宴結束後的二樓房間；Zimmerli 的署名文章（Hu、Murray 與 Williams，n.d.）則讀為月見會中的歌舞。本展並列兩說，不把其中一說當作唯一史實。'],
 ['4. 反思','如果把托盤、杯碟、人影或局部樂器拿掉，我們對房間活動的理解會如何改變？這是策展提問。沒有可靠依據證明廣重為祈福而畫本作，也不以地震後出版直接推定全系列創作意圖。'],
],[1800,7226]);
tables[30].keys=['moonImage','api-A05','apj-A05','moonHeritage','moonRutgers'];
tables[33]=table(['策展時間','作品／年代與季節','敘事（與網站摘要一致）'],works.filter(a=>a.group==='core').map(a=>[a.curatorialTime,`${a.title}\n${a.year??'館藏未定年'}${({A04:'；陰曆三月夜櫻背景',A05:'；館方作中秋月見解讀',A07:'；陰曆十一月；畫中黃昏'})[a.id]??''}`,a.summary]),[1050,2650,5326]);
tables[33].keys=['bridge','manpachi','fireworksImage','cherryImage','moonImage','ferry','asakusa','dawnImage','yoshiwara','moonHeritage'];
set(35,'18:00 到 05:00 是本展的策展敘事時間，不是畫中事件的精確鐘點，也不是同一年、同一季節或同一個夜晚。尤其《淺草田甫酉之町詣》畫中是黃昏，00:00 僅是其導覽位置。地點依證據分為確定、大致與推定三級；《月之岬》精確位置仍待確認，沒有保留未獲佐證的座標。',['asakusa','moonHeritage'],'策展安排／館方解讀');
add(35,h('2.4 功能如何支持閱讀'),table(['功能','策展目的','預期學習','如何驗證'],[
 ['提燈首頁','先注意局部，再回看完整圖像','說出局部與全圖的差別','已測低動態；學習差異待真人研究'],
 ['時間軸','組織八件核心的觀看順序','分辨策展時刻與歷史時間','已測一般 GSAP、手機文字、前後站及方向鍵'],
 ['六件推鏡與活動放大','指向可辨認且有意義的細節','由位置與構圖提出解釋','核對原圖焦點；已測切換、鍵盤和模擬觸控'],
 ['古今地圖','比較相關區域與水路','認識配準與定位的限制','五幅 metadata 已核；雙圖同步已測'],
 ['活動一','推薦不同觀展視角','嘗試原本沒注意的觀看位置','已走完四題；不是心理或歷史身分測驗'],
 ['活動二與手帖','接續觀察、背景與反思','分清我看到、我推論與仍有疑問','已測短／完整路線、保存與文字下載；真人理解待測'],
],[1500,2250,2600,2676]));
set(38,'八件核心圖像來自 The Met；已逐件核對館藏頁、API 的登錄號、primaryImage 與 isPublicDomain=true。依其 Open Access 政策，這些公有領域圖像以 CC0 開放使用（The Metropolitan Museum of Art, n.d.）。三件延伸作品的數位檔來自 Wikimedia Commons，來源鏈與權利標示另列，不統稱十一件都出自 The Met。',['metRights',...works.filter(a=>a.id.startsWith('A')).map(a=>'api-'+a.id)],'圖像來源與權利');
set(39,'選件涵蓋橋、河流、料亭、煙火、遊里、祭典與黎明，供觀眾比較娛樂、移動、消費與勞動。例如《御廄河岸》，The Met 將部分乘客解讀為搭渡船前往工作的「夜鷹」（JP1547）。館方同段也談到北齋另一幅渡船圖，兩作不能混用；它沒有說這些人正好在 23:00 或午夜開始工作。',['ferry'],'館方人物解讀／策展安排');
tables[40]=table(['作品 ID／名稱','系列','年代','本頁圖像來源'],works.map(a=>[`${a.id} ${a.title}`,a.series+(a.seriesNo?`・第 ${a.seriesNo} 景`:''),a.year??'館藏未定年',a.id.startsWith('A')?`The Met ${a.image.accession}`:a.id==='B01'?'Commons；原典藏未確認':'Commons 指向 Brooklyn；精確對應尚有限制']),[2350,2400,1120,3156]);
tables[40].keys=works.flatMap(a=>[primary[a.id],...(a.id.startsWith('A')?['api-'+a.id]:['commons-'+a.id])]);
set(42,'十一件作品的四段解說（畫面觀察、城市空間、當時的人們、現代地點對照）均可在網站作品頁閱讀；完整編目與圖像權利另存 artwork-catalog.csv 及 rights-register.csv。下列資料區分本頁印本與同構圖的其他印本，不移用他館的尺寸、收藏號或色彩狀態。');
add(42,h('3.1 編目與圖像來源'));
for(const a of works){
 const api=a.id.startsWith('A')?read(`docs/evidence/met-api-${a.id}.json`):null;
 add(42,h(`${a.id} ${a.title}`,3),p(`作者：${a.artist}。日文題名：${a.titleJa}。英文題名：${a.titleEn}。年代：${a.year??'The Met 未定年'}；系列：${a.series}${a.seriesNo?`，第 ${a.seriesNo} 景`:''}。媒材：${a.medium}。`,[primary[a.id],...(api?['api-'+a.id]:['commons-'+a.id])],'編目'),
 p(api?`本頁印本：The Metropolitan Museum of Art，${a.image.accession}；尺寸：${api.dimensions}。API 圖像與本頁來源一致；公有領域，依 Met Open Access 採 CC0。`:`數位檔：Wikimedia Commons，${a.image.width}×${a.image.height} 像素；檔案頁標示 ${a.image.license}。本頁原印本尺寸及館藏號未獨立核實，不套用另館資料。`,api?['api-'+a.id,'metRights']:['commons-'+a.id],'編目／圖像權利'),
 p(a.id==='A05'?'詮釋限制：品川灣高地為具名館方解說，精確地點待考；宴席階段的兩種讀法見第 2.2 節。':['B01','B02','B03'].includes(a.id)?({B01:'來源限制：Commons 指私人整理站，上傳史記載色彩處理；慶應 200X@5-56 是同構圖另印本，不是本檔原典藏的證明。',B02:'來源限制：Commons 指 Brooklyn 舊物件 121713，但本次原頁不可核讀；已核看同檔正式 500px 縮圖，原圖下載受限，不作微小細節或色彩鑑定。',B03:'來源限制：Commons 指 Brooklyn 舊物件 121623，原館藏全文不可核讀。Brooklyn 在 Google Arts & Culture 的 30.1478.8 可作構圖解說，未將它逕定為本檔館藏號；本件是白晝序章。'})[a.id]:`策展位置：${a.curatorialTime}（敘事安排）。${a.id==='A07'?'畫中黃昏與本展午夜站點分開；髮簪禮物保留館方推測語氣。':a.id==='A04'?'春季夜櫻與暫植櫻樹背景不直接證明每位人物的身分或債務。':a.id==='A08'?'街上幾組人物不直接證明個別去向或服役關係終止。':'作品的觀看與生活脈絡詳見站內介紹。'}`,[primary[a.id],...(a.id.startsWith('B')?['commons-'+a.id]:a.id==='A05'?['moonHeritage','moonRutgers']:[])],'來源限制／策展說明'),p(`圖像來源：${a.image.sourceUrl}`,[a.id.startsWith('A')?'api-'+a.id:'commons-'+a.id],'來源入口'));
}
set(46,'展覽網址：https://richardliang19.github.io/edo-after-dark/ 。建議從時間軸進入，再依興趣閱讀作品、比較地圖或參與活動。各頁可以互相返回；本表是建議路線，沒有真人現場導覽紀錄。');
tables[47]=table(['頁面','內容'],[
 ['首頁','提燈開場、首次看展路線，以及時間、空間、人物三個入口'],['策展理念','主題、設計、選件與學生數位策展的職能範圍'],['夜之時間軸','18:00–05:00 的敘事路線，標示策展時間與年代／季節差別'],['作品','11 件基本資料與圖文解說，其中 6 件有推鏡、5 件為一般圖文'],['時空探索','江戶切繪圖與今日東京同步比較，地點分級並保留未定位作品'],['活動與消息','四題觀展視角、提燈尋跡 6／26 題、消息與友站'],['關於我們／參考資料','CSV 團隊資料；作品、已核讀解說與舊版未核讀線索分列'],
],[2000,7026]);
set(50,'一、提燈夜行（首頁）：用光圈引導觀眾注意浮世繪局部，再回到完整作品。這是觀看方式的設計，不是重建某一晚的實際照明；降低動態時仍可直接閱讀完整圖像。');
set(52,'三、凝視細節（作品頁）：11 件作品均有基本資料與圖文解說，其中 A03–A08 六件有捲動推鏡設定，其餘 A01、A02、B01、B02、B03 五件是一般圖文展示。手機與低動態模式保留直接閱讀；推鏡不是每件都有，也不保證超出原圖解析度的細節。');
set(53,'四、古今對照地圖（時空探索）：左側為經配準的 1850–1853 年五幅江戶切繪圖，右側為今日東京，兩圖可同步移動與縮放。圖幅年份及來源以 CODH／Map Warper metadata 核對；配準有誤差，區域標記不宣稱是畫家站立點。',['codh','map-4908','map-4902','map-4930','map-4931','map-4935'],'圖幅 metadata／策展限制');
set(54,'五、互動活動：活動一「你的江戶夜行，會先看見什麼？」以四個情境推薦觀展視角，不是心理或歷史人物身分測驗。活動二「提燈尋跡」共 11 幅、26 題，預設隨機三幅六題，也可專看一幅或選完整路線。畫面可切換全圖、不同焦點並放大拖曳；每個錯誤選項有提示，反思選填且不計分。手帖可在本機保存、恢復與清除，也能下載含來源網址的純文字；沒有帳號、社群或後端資料庫。');
set(56,'圖 1　首頁提燈效果。保留原報告截圖，作設計示例；不作本輪部署證據。');
set(58,'圖 2　作品頁細節導覽。保留原報告截圖；目前只有六件作品有推鏡設定。');
set(60,'圖 3　古今對照地圖。保留原報告截圖；標記與文字以本輪修訂網站為準。');
set(61,'網站使用 Astro、TypeScript、GSAP 與 Leaflet，保留 GitHub Pages 的 /edo-after-dark/ 子路徑。Git 中有 Pull Request 合併紀錄，可支持曾用版本協作，不能據此推定所有組員工作或會議出席。本輪只修改本地檔案，沒有推送或部署；也沒有成本帳目可證明所有製作均無額外費用。');
set(64,'ICOM（2022）於 8 月 24 日通過的定義包含以下完整要素（此處轉述，原文見第七章連結）：博物館是服務社會的非營利常設機構，研究、蒐藏、保存、詮釋並展示有形與無形遺產；向公眾開放，具可及性與包容性，促進多樣性與永續；以倫理、專業及社群參與運作和溝通，提供教育、欣賞、反思及知識分享的多元經驗。',['icom'],'完整定義轉述');
set(65,'本展是以外部館藏資料為基礎的學生數位策展，已實作研究、詮釋與教育展示。小組沒有取得實體藏品，也不把網站檔案整理當作完成典藏機構的治理、文物保護、長期保存或社群參與研究。我們使用數位媒介，重點在以下幾種閱讀方式：');
set(66,'連結不同館藏：展示八件 Met 圖像與三件 Commons 補充圖像，連到其他機構對同構圖印本的解說；活動可比較作品。放大的清晰程度受圖像解析度限制，不能把他館印本的木紋或色彩當成本頁特徵。');
set(67,'重組時空：以時間軸與古今地圖建立觀看順序，並保留不同年代、季節、圖幅與定位信度的差別。');
set(69,'開放可及：公開網站可免費閱讀，內容可隨研究更新。仍依賴瀏覽器、網路及外部圖像／圖磚服務，是否足夠可及須經人工與使用者驗證，不能只由線上形式推定。');
set(75,'分工表依 contributions.csv，三位空白者維持未提供；沒有由 Git 作者推定個人責任。期中簡報第 7 頁有分頁安排，但不能直接代填期末分工。需本人確認的項目列於內部待辦。');
set(78,'下表以 2026 年可核對的 Git 提交日與本輪驗證紀錄標示節點；深色「●」為有證據的完成節點，淺色「待」為尚未執行。它不是工時表，不表示連續施工或實際起訖日。');
remove.push(79,85);
tables[80]=table(['工作項目','11/9','11/13','11/15','11/18','狀態','可追溯依據'],[
 ['視覺概念與網站骨架','●','','','','已有版本','e633d2d、4271712'],
 ['核心圖像選用與本輪查核','●','','','●','另有待查','0e127f2；證據登錄表（不表示所有史實已確證）'],
 ['古今地圖與互動活動','','●','','●','已驗收','f6f3650／ee5d543；瀏覽器紀錄'],
 ['作品解說與策展內容','','●','','●','已修訂','87db3f0；本輪逐件／逐題審核'],
 ['活動改版與時間軸調整','','','●','●','已驗收','7b4cbe8、b61293f；瀏覽器紀錄'],
 ['期末書面報告','','','','●','原稿修訂 11/19','11/18 分章稿；11/19 原稿修訂與 PDF 驗收；教師格式仍待核'],
 ['團隊名單上線','','','●','','分工未齊','cd3e09b；原 CSV 三欄空白'],
 ['主視覺海報','','','','','待','未取得正式圖檔及來源，不假填完成日期'],
 ['真人研究與課堂簡報','','','','','待','沒有真人研究或最終課堂簡報的實施證據'],
],[2200,520,520,520,520,950,3796]);
set(82,'6.3 可核對的版本節點');
tables[83]=table(['日期（2026）','版本／可核對的內容','證據範圍'],[
 ['11/9','e633d2d：視覺概念；4271712：Astro 骨架；0e127f2：八件核心改用 Met 圖像','支持版本變更，不能證明當日曾開會、出席或一致決議'],
 ['11/13','f6f3650／ee5d543：地圖與活動；87db3f0：作品文案、策展與導覽','以提交內容與主旨為準；不以它補出席名單'],
 ['11/15','cd3e09b／7b4cbe8：活動、時間軸與團隊；b61293f：推鏡與時間軸修正','支持功能版本節點，不能分配三位空白者的責任'],
 ['11/18','本輪來源、網站修訂、分章稿與驗證紀錄','尚未提交或部署；實測與人工待辦分列'],
 ['11/19','依使用者原 DOCX 同步修訂正文／表格並渲染驗收','原稿保持原樣；不以內容核對日代填繳交日'],
],[1050,4700,3276]);
add(83,p('原稿曾將上述日期列為討論紀錄；目前沒有出席或會議證據，因此改列可核對的版本節點。原稿保持原樣，沒有以程式版本冒充會議紀錄。'));
set(87,'七、參考文獻');
set(88,'7.1 展出作品（依實際圖像來源）');
const workRefs=[...works].sort((a,b)=>a.id.localeCompare(b.id));
for(let i=0;i<11;i++){
 const a=workRefs[i];set(89+i,`Utagawa, H. (${a.year??'n.d.'}). ${a.titleJa} [${a.titleEn}] [木版畫]（${a.series}${a.seriesNo?`，第 ${a.seriesNo} 景`:''}；${a.id.startsWith('A')?a.image.accession:'原印本資訊有限制'}）. ${a.id.startsWith('A')?'The Metropolitan Museum of Art.':'Wikimedia Commons；檔案聲明與原館藏獨立核實分開。'} 檢索於 2026 年 11 月 18 日：${a.image.sourceUrl}`,[a.id.startsWith('A')?'api-'+a.id:'commons-'+a.id],'作品書目');
}
set(100,'7.2 研究、館方解說與標準');
set(101,'參考文獻暫採機構／作者、年份、題名、來源與讀取範圍的一致格式。教師引用格式 PDF 尚未取得，不能宣稱完全符合課程規範。未取得的全文與頁碼不自行補寫。');
for(let i=102;i<=109;i++)remove.push(i);
const refKeys=['nenzi','metEssay','moonHeritage','moonRutgers','icom','metRights','yoshiwara','saruwaka','embankment','embankmentRoute','suruga','mitsuiHistory','codh',...works.filter(a=>a.seriesNo&&a.id!=='B02'&&a.id!=='B03'&&a.id!=='A04').map(a=>'apj-'+a.id).filter(id=>byId[id]),'map-4908','map-4902','map-4930','map-4931','map-4935','commons-B01','commons-B02','commons-B03','wcag'];
for(const id of [...new Set(refKeys)]){
 const s=byId[id];if(!s)throw new Error('Missing source '+id);
 const author=id==='nenzi'?'Nenzi, L.':id==='moonRutgers'?'Hu, I., Murray, P., & Williams, M.':s.institution;
 const year=({metEssay:'2003',icom:'2022',yoshiwara:'2024'})[id]??'n.d.';
 add(101,p(`${author}. (${year}). ${s.title}${s.accession?'（'+s.accession+'）':''}. 核對：2026-11-18；${s.scope}。${s.url}`,[id],'來源書目'));
}
add(101,h('7.3 技術與版本依據'),p('Astro 7.4.7、GSAP 3.15.1、Leaflet 1.9.4 的版本依現有鎖定檔，不把專案核對日期當作軟體發行年份。GitHub 提交紀錄見第六章；其他測試命令與限制見第八章。'),p('Astro Technology Company. (n.d.). Astro [軟體；本專案鎖定 7.4.7]. https://astro.build/'),p('GreenSock. (n.d.). GSAP [軟體；本專案鎖定 3.15.1]. https://gsap.com/'),p('Leaflet. (n.d.). Leaflet [軟體；本專案鎖定 1.9.4]. https://leafletjs.com/'),p('OpenStreetMap contributors. (n.d.). Copyright and License [保留原稿技術歸屬入口；未用於新增史實]. https://www.openstreetmap.org/copyright'),p('完整網站解說來源與未核讀舊線索，見 https://richardliang19.github.io/edo-after-dark/references/ 。本輪網站修改尚未部署；驗收對象為本地建置，外部讀者應於正式部署後查看新版。'));
add(109,h('八、驗證與限制',1),h('8.1 程式與建置'),p('本輪環境為 Windows、Node 24.19.0、npm 11.17.0。npm ci 成功；Windows 應用程式控制阻擋 satteri 原生模組，原生 npm run build 失敗，未更改系統政策。改用官方同版本 WASM 後端（NAPI_RS_FORCE_WASI=true）後，建置成功產出 19 個 Astro 頁面與五份概念稿。套件清單、鎖定檔與 GitHub Pages 設定未改。'),p('17 項 Node 測試通過，涵蓋資料關聯、答案索引、來源識別、保存驗證、舊進度遷移、手帖輸出、內部連結與公開草稿提示。TypeScript 模組嚴格檢查通過，但未執行完整 astro check。這些測試驗證程式結構及行為，不會證明歷史內容真實。'),h('8.2 瀏覽器驗收與觀眾研究'),p('隔離 Edge 157.0.4341.60 以原生滑鼠、鍵盤及模擬觸控事件實測：1440×1000 桌面、390×844 手機版面；首頁低動態、一般 GSAP 時間軸、十一件作品、雙圖同步、活動一四題、活動二隨機六題與完整二十六題、個別錯誤回饋、保存、清除、手帖下載及圖片失敗提示。8 組主流程加 3 組補測通過；快速換頁時有些外部圖像尚未載完，不宣稱全部外部影像均可用。'),p('沒有招募真人受測者，因此沒有受測人數、平均耗時、問卷比例、滿意度或觀眾原話。已準備約五位觀眾的自願同意說明、測試腳本及匿名空表，研究仍待實施；自動化瀏覽器操作不能代替學習成效。'),h('8.3 未測範圍與資料限制'),p('手機是瀏覽器模擬，未測實體手機、iOS／Safari／Firefox、螢幕閱讀器、完整 Tab 路徑、所有狀態對比度與 200% 文字放大。WCAG 2.2 AA 為設計目標，沒有符合性認證（W3C, n.d.）。外部圖像、字體與圖磚仍有服務依賴；B02 原圖受限，部分 Commons 原館藏鏈未確認。',['wcag'],'技術限制／來源範圍'),p('npm audit 回報既有鎖定相依圖有 9 項 high；本輪未自動升降主要版本，需另評估公告適用性與相容修正。本地建置成功不等於 GitHub Actions 已執行，也不表示網站已部署。'),p('本報告修訂自提供的原 DOCX，保留三張原截圖、原章節主題及七個原有表格的位置和用途，新增學習／功能對照與第八、九章。原截圖是舊版設計示例，不冒稱本輪部署畫面。文件的實際渲染器、逐頁驗收及尚待修正事項另記於 report-revision.md，沒有以網頁 HTML 預覽代替 DOCX 渲染。'),h('九、結論與後續改善',1),p('本展以橋架、窗框、河道、街道與畫邊細節，實作了由觀看位置理解城市的閱讀路線；館方解說與跨作品比較，則把夜間娛樂接到服務、交通與勞動。這些是已完成的策展安排，觀眾是否能辨別證據層次與比較不同經驗，仍須真人研究。'),p('本輪已核對十一件作品及二十六題，修正鐘點、人物、器物與另印本引用的過度斷言，也讓作品頁、時間軸、互動與報告使用一致表述。對月之岬活動階段保留具名差異；對精確地點與補充作品原印本不確定處，保留限制，不為完成故事而猜測。'),p('後續先取得教師引用規範，確認空白分工與真實會議紀錄；再追查補充作品的原館藏鏈、完成無障礙人工審查與觀眾研究。夜景的美感是觀看入口，仍須回到具體問題：誰在遊賞、誰在工作，哪些人的經驗沒有被圖像充分呈現？'),h('附錄：內部待辦（非已完成資料）',1),table(['待確認項目','目前證據／處理','下一步'],[
 ['封面組別、學號、繳交日期','原稿僅空白線，沒有正式資料；封面先不列','由組員提供，不以內容核對日代填繳交日'],
 ['三位分工','劉彥廷、王怡婷、郭濬瑀的 CSV 欄位仍空白','本人確認；期中分頁不能代填期末工作'],
 ['會議出席與期中前工作','沒有可核對會議證據；第六章僅列版本節點','提供真實會議紀錄，勿由提交日猜出席'],
 ['教師格式與範例','尚未取得','取得後再核引註、書目與封面格式'],
 ['來源與觀眾研究','原館藏／地點待考；真人研究未實施','依 unresolved-issues 與匿名空表續作'],
],[2300,3400,3326]));
// Move the technical preservation note into the internal appendix, avoiding
// a nearly empty continuation page in the main validation chapter.
const preservation=after[109].find(b=>b.type==='paragraph'&&b.text.startsWith('本報告修訂自'));
after[109]=after[109].filter(b=>b!==preservation);
after[109].filter(b=>b.type==='table').at(-1).rows.push(['文件與圖像驗收',preservation.text,'詳見 report-revision.md 與原圖雜湊；不同文書軟體可能重新分頁']);
// Original team table remains a table; fill no responsibility that lacks evidence.
tables[74]=table(['組員','負責項目（依 contributions.csv）'],readFileSync('contributions.csv','utf8').trim().split(/\r?\n/).map(line=>{const [name,...role]=line.split(',');return [name,role.join(',')||'未提供；待本人確認'];}),[2200,6826]);

function textOf(block){return block.type==='table'?[block.headers,...block.rows].map(r=>r.join('｜')).join('\n'):block.text;}
const oldByIndex=Object.fromEntries(original.blocks.map(b=>[b.index,b]));
const oldText=i=>oldByIndex[i]?.type==='table'?oldByIndex[i].rows.map(r=>r.join('｜')).join('\n'):oldByIndex[i]?.text??'';
for(const [index,b] of Object.entries({...paragraphs,...tables}))review.push({id:`DOCX-P${index}`,original:oldText(index),updated:textOf(b),keys:b.keys??[],claimType:b.claimType??'表格修訂',support:b.keys?.length?'依具體來源分讀；館方解讀不等於唯一史實':'策展／專案說明，非新增歷史斷言',location:`原 body 節點 ${index}`});
for(const [index,blocks] of Object.entries(after))for(const [i,b] of blocks.entries())if(b.type!=='heading')review.push({id:`DOCX-A${index}-${i+1}`,original:'新增',updated:textOf(b),keys:b.keys??[],claimType:b.claimType??'新增教學／驗證內容',support:b.keys?.length?'依具體來源分讀；保留引用範圍':'策展／專案說明；不冒認真人研究或出席',location:`原 body 節點 ${index} 後，第 ${i+1} 區塊`});
for(const index of remove)review.push({id:`DOCX-REMOVE${index}`,original:oldText(index),updated:'從正文移出或以新節取代；待確認資訊見內部待辦',keys:[],claimType:'草稿提示／未證實資料',support:'未提供；不補造',location:`原 body 節點 ${index}`});
writeFileSync('docs/evidence/final-report-edits.json',JSON.stringify({date:'2026-11-19',historicalAuditDate:'2026-11-18',source:original.source,sourceSha256:original.sha256,paragraphs,tables,after,remove,review},null,2)+'\n');
console.log(JSON.stringify({paragraphEdits:Object.keys(paragraphs).length,tableEdits:Object.keys(tables).length,addedBlocks:Object.values(after).flat().length,reviewRecords:review.length,sourceHash:original.sha256}));
