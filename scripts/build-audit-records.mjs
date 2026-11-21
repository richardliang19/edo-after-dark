// Reproducible registers. The source mappings below are editorial audit judgments,
// not an automated fact checker. HTTP status and test success never prove history.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { observationQuestions as questions, observationSources as sources } from '../src/data/observation.ts';
import { observationQuestions as oldQuestions } from '../docs/evidence/baseline-observation.ts';
import { activityRoles } from '../src/data/activities.ts';
const date='2026-11-18', path='src/data/artworks.json';
const current=JSON.parse(readFileSync(path,'utf8'));
const old=JSON.parse(execFileSync('git',['show','b61293f:src/data/artworks.json'],{encoding:'utf8'}));
const csv=(file,headers,rows)=>writeFileSync(file,'\uFEFF'+[headers,...rows.map(r=>headers.map(h=>r[h]??''))].map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n');
const primary={A01:'bridge',A02:'manpachi',A03:'fireworksImage',A04:'cherryImage',A05:'moonImage',A06:'ferry',A07:'asakusa',A08:'dawnImage',B01:'saruwaka',B02:'embankment',B03:'suruga'};
const contextual={A01:['bridge','ryogokuLocal','bridgesLocal'],A02:['manpachi','yanagibashiLocal'],A03:['fireworksImage','fireworks','ryogokuLocal','fireworksModern'],A04:['cherryImage','yoshiwara','yoshiwaraLocal'],A05:['moonImage','moonHeritage','moonRutgers'],A06:['ferry','bridgesLocal'],A07:['asakusa','festivalLocal'],A08:['dawnImage','yoshiwara','embankmentRoute'],B01:['saruwaka'],B02:['embankment','embankmentRoute'],B03:['suruga','mitsuiHistory']};
const locators={
 bridge:'Description：橋下 X 形橋基、滿月、曲折雲帶、屋形船、中產階層、Ichiyūsai；Artwork Details：JP1312',
 manpachi:'Description 首段：餐飲場所系列、扇形題籤雙關短詩；Artwork Details：ca. 1835–42、JP1158',
 fireworks:'Description：1850 年代商家贊助、四類觀看位置、近半夜空；1940.986 是另一印本',
 fireworksImage:'Artwork Details：1858、JP642；原圖 DP121524.jpg',cherryImage:'Artwork Details：ca. 1841、JP608；原圖 DP123286.jpg',
 yoshiwara:'Exhibition Outline 前三段：債務服役、陰曆三月櫻、七月玉菊燈籠、八月俄；2024 年展覽背景',
 moon:'只讀到驗證頁，未完成全文核對',moonSpace:'403／頁面無法核讀，未完成全文核對',dawn:'500／頁面無法核讀，未完成全文核對',
 moonImage:'Artwork Details：1857、JP1185；原圖 DP121535.jpg',
 moonHeritage:'「解説」：品川灣、高地、中秋、月見宴結束、未收拾的二樓房間、障子人影；並連到 ColBase A-10569-7372',
 moonRutgers:'Moon-Viewing Point 段落：月見、歌舞、三味線；文末署名 Hu／Murray／Williams。與東京國立博物館對階段的解讀不同',
 ferry:'Description 同一段分兩作：先 Hokusai，再 Hiroshige；後者提及 yotaka 前往工作。Artwork Details：JP1547、ca.1857',
 asakusa:'Description 三段：二樓室內、暮色富士、酉祭、熊手、髮簪 likely／we may imagine、祭典開放；JP60',
 dawnImage:'Artwork Details 與英文題名：The Entrance to the Yoshiwara at Dawn、1857、JP1024；沒有逐一指定人物身分',
 saruwaka:'日野原健司署名解說：天保改革、三座集中、遠近法、滿月、看戲歸客、刻意保留木紋；200X@5-56，非本頁原圖',
 embankment:'「解題・解説」：黃昏、繁忙堤道、田野對比；提供機構台東區立中央圖書館，非本頁印本',
 embankmentRoute:'Nihon Embankment 段落：No.100、04/1857、步行、乘轎、引手茶屋預約、入口與見返柳；P.3577-R 為另一印本',
 suruga:'館方供稿正文：對稱、傳統分景雲帶、圈三井越後屋；Details：30.1478.8、1856 年九月、第 8 景。Commons 原圖是否同號仍待確認',
 yanagibashiLocal:'17. 柳橋：河口、江戶橋畔船宿、幕末明治以後花柳界、1929 年現橋',
 bridgesLocal:'「隅田川に架かる今の橋」之廄橋與兩國橋：1929、1932，御廄地名、渡船',
 ryogokuLocal:'両国橋頁首沿革段：1659 年、初建較下游、兩國地名、兩岸廣小路與川開き',
 fireworksModern:'「隅田川花火大会の歴史と復活について」與「その由来」：中斷、1978 復辦、上游雙會場；1733 僅按官方敘事記錄',
 festivalLocal:'酉の市正文及開催場所：今日每年國曆十一月酉日、鷲神社與長國寺；2026-09-24 更新',
 mitsuiHistory:'創業沿革段（「江戸本町一丁目」）：1673 開店、1683 駿河町遷移',
 yoshiwaraLocal:'PDF 印刷頁碼第 1 頁，「よしわら」條目轉引《角川日本地名大辞典》；2024.07 改訂四版',
};
const extra=[
 {id:'metEssay',institution:'The Metropolitan Museum of Art, Department of Asian Art',title:'Woodblock Prints in the Ukiyo-e Style',url:'https://www.metmuseum.org/essays/woodblock-prints-in-the-ukiyo-e-style',locator:'正文：可大量印製，畫師、雕版師、摺師、出版者合作，商業出版。2003-10',scope:'媒介的一般背景，不是某張畫的個別動機',level:'B',read:'已核讀正文'},
 {id:'nenzi',institution:'Cambridge University Press / Laura Nenzi',title:'Japan After Dark — Book description',url:'https://www.cambridge.org/core/books/japan-after-dark/3149361D47CB1F1D331909733A694D0E',locator:'Book description 兩段；目錄',scope:'僅公開摘要，未讀全書，不引用章節頁碼',level:'B',read:'已核讀公開摘要；全書未讀'},
 {id:'stanley',institution:'University of California Press',title:'Selling Women — source entrance',url:'https://www.ucpress.edu/book/9780520270909/selling-women',locator:'回傳網站導覽與 Loading，未取得書籍正文',scope:'只列後續研究入口，未支持本次具體歷史論述',level:'B',read:'未完成全文核對'},
 {id:'icom',institution:'International Council of Museums',title:'Museum Definition (2022)',url:'https://icom.museum/en/resources/standards-guidelines/museum-definition/',locator:'Museum Definition：2022-08-24 通過與三句完整定義',scope:'完整要素轉述；不表示學生網站已具備所有機構職能',level:'A',read:'已核讀定義全文'},
 {id:'metRights',institution:'The Metropolitan Museum of Art',title:'Open Access at The Met',url:'https://www.metmuseum.org/hubs/open-access',locator:'Open Access 前兩段：公有領域圖像與基本資料 CC0',scope:'八件核心需另核對各件 API isPublicDomain 與 primaryImage',level:'A',read:'瀏覽工具已核讀政策；直接批次請求另遇 429，兩者分記'},
 {id:'wcag',institution:'W3C',title:'WCAG 2.2',url:'https://www.w3.org/TR/WCAG22/',locator:'2024-12-12 Recommendation；2.1 鍵盤、1.4 可辨識、2.4 導覽等成功準則',scope:'設計參照，非符合性審定',level:'A',read:'已核讀標準入口及相關準則'},
 {id:'codh',institution:'ROIS-DS CODH',title:'江戸マップ',url:'https://codh.rois.ac.jp/edo-maps/',locator:'尾張屋版圖幅表：03／05／16／17／21；georef 的配準誤差警語',scope:'圖幅出版年與地理配準，非畫家站立點',level:'A',read:'已核讀圖幅表；五幅 metadata 另存'},
];
const registry=[...Object.entries(sources).map(([id,s])=>({id,institution:s.institution,title:s.title,url:s.url,accession:s.record,locator:locators[id],scope:s.scope,level:['yanagibashiLocal','bridgesLocal','ryogokuLocal','fireworksModern','festivalLocal','yoshiwaraLocal'].includes(id)?'C':['yoshiwara','moonRutgers','saruwaka','embankmentRoute'].includes(id)?'B':'A',read:'unverified' in s?'未完成全文核對':'已核讀所列段落',date})),...extra.map(s=>({...s,date}))];
for(const a of current.filter(a=>a.id.startsWith('B')))registry.push({id:`commons-${a.id}`,institution:'Wikimedia Commons／原上傳者',title:a.image.sourceUrl.split('/').pop(),url:a.image.sourceUrl,locator:'Summary 的 Source、Permission 與 File history；本次來源鏈另存 commons-source-links.json／provenance-check 紀錄',scope:'只證明數位檔案頁所聲明的來源與權利；不視為獨立確認原館藏、印次或法律結論',level:'C',read:'已核讀檔案說明及上傳史；原典藏仍有限制',date});
registry.push({id:'midterm',institution:'本組期中報告／Git f6f3650',title:'江戶不打烊期中簡報及講稿（前期底稿）',url:'https://github.com/richardliang19/edo-after-dark/tree/f6f3650/class_materials',locator:'PDF 第 4、7 頁及講稿 P4／P6；原二進位檔、抽文及逐頁影像存 evidence/recovered/',scope:'只證明前期曾寫過哪些內容及期中分頁安排，不證明歷史主張、會議出席或期末分工',level:'C',read:'已讀講稿全文、PDF 七頁抽文與逐頁圖像',date});
const seriesIds={A03:'apj-A03',A05:'apj-A05',A06:'apj-A06',A07:'apj-A07',A08:'apj-A08',B01:'apj-B01'};
for(const a of current){
 if(a.id.startsWith('A')) registry.push({id:`api-${a.id}`,institution:'The Metropolitan Museum of Art',title:`Collection API object ${a.image.sourceUrl.split('/').pop()}`,url:`https://collectionapi.metmuseum.org/public/collection/v1/objects/${a.image.sourceUrl.split('/').pop()}`,accession:a.image.accession,locator:'title、artistDisplayName、objectDate、medium、dimensions、accessionNumber、primaryImage、isPublicDomain；JSON 另存 evidence/',scope:'目前展示的 Met 印本之機器可讀編目與圖像連結，非他館印本',level:'A',read:'已核讀完整 JSON',date});
 if(seriesIds[a.id]){const entry=JSON.parse(readFileSync(`docs/evidence/${seriesIds[a.id]}.json`,'utf8'));registry.push({id:seriesIds[a.id],institution:'東京藝術大學美術館作成資料／國立藝術研究中心 APJ',title:a.title+'（同構圖另一印本編目）',url:entry.url,accession:'PR645',locator:`備考 第${a.seriesNo}図；作品名、作者、制作年；已保存可讀正文`,scope:'只交叉核對構圖、系列序號與年代；不移用其尺寸與館藏號',level:'A',read:'已核讀編目與備考',date});}
}
for(const mapId of [4908,4902,4930,4931,4935]){
 const item=JSON.parse(readFileSync(`docs/evidence/map-${mapId}.json`,'utf8')).items;
 registry.push({id:`map-${mapId}`,institution:'日本版 Map Warper／Kitamoto',title:item.title,url:`https://mapwarper.h-gis.jp/maps/${mapId}.json`,accession:item.unique_id,locator:'items.issue_year、bbox、source_uri、publisher、owner_id、description；原 JSON 已保存',scope:'配準後影像外框與圖幅 metadata，不代表測量誤差半徑或歷史街區界線',level:'A',read:'已核讀完整 JSON',date});
}
const sourceById=Object.fromEntries(registry.map(s=>[s.id,s]));
writeFileSync('docs/evidence/sources.json',JSON.stringify(registry,null,2)+'\n');
const rows=[];let sequence=0;
function add({id,field,original,updated=original,keys=[],support,type='歷史／圖像主張',limit='',conclusion,file=path,checkedDate=date}){
 const ss=keys.map(k=>sourceById[k]).filter(Boolean);
 const claim_id=`C${String(++sequence).padStart(4,'0')}`;
 rows.push({claim_id,'artwork_id/page':id,原文:original,主張類型:type,source_title:ss.map(s=>s.title).join(' | '),'institution/author':ss.map(s=>s.institution).join(' | '),'accession/DOI':ss.map(s=>s.accession??'').filter(Boolean).join(' | '),source_url:ss.map(s=>s.url).join(' | '),'來源具體段落或可定位位置':ss.map(s=>s.locator).join(' | ')||field,核對日期:checkedDate,支持程度:support,'來源限制/歧義':limit||'館方解讀不是圖像所能獨立證明的所有歷史細節；同構圖異印本不轉移色彩或材質狀態。',修改後文字:updated,修改檔案:`${file} :: ${field}`,結論:conclusion??(original===updated?'保留並說明引用層次':'修訂；保留來源範圍與不確定性')});return claim_id;
}
const visual='直接觀察（須核對實際圖像）', institutional='館藏／一手資料直接支持', inference='策展推論（非歷史事實）';
const split=s=>String(s).split(/(?<=[。；])/u).map(s=>s.trim()).filter(Boolean);
const oldIssues={
 A01:{summary:['bridge','待查證','高解析原圖已核看，無法辨認原文所稱橋上行人；不能由此斷言絕對無人。'],urban:['ryogokuLocal','待查證','原文 1659／1661 並列中的 1661 未找到可核讀的同等來源；改明確歸屬 NDL 的記年，不裁定異說。']},
 A02:{summary:['manpachi','不受支持','可見前景提燈，不足以證明料亭剛點燈或宴席正開始。'],people:['manpachi','待查證','館方未逐一指定料理人、女中、藝者、船宿職業；改觀察室內外往來。'],modern:['yanagibashiLocal','待查證','1929 有官方支持；二十世紀末消失與今日船宿業務未取得本次可定位證據，收斂。']},
 A03:{modern:['fireworksModern','待查證','不把維基對 1733 的爭議轉述當已讀研究；官方仍沿用 1733。保留差異，不裁定起源。']},
 A04:{summary:['cherryImage','不受支持','最熱鬧的時刻無量化或比較資料；刪除最高級。'],urban:['yoshiwara','不受支持','暫植不等於非原生；陰曆七、八月不能直接套用今日國曆季節。']},
 A05:{observe:['moonHeritage','待查證','原文右側三味線焦點對到衣裾與腳部；實際前景另見局部樂器。Cornell 本次不可核讀。'],urban:['moonHeritage','待查證','七崎及東海道第一宿資訊未取得本次可核讀的直接支持，收斂到館方品川灣高地。'],people:['moonHeritage','相互矛盾','Cornell／Seattle 無法核讀；東京國立博物館宴後與 Rutgers 歌舞中的解讀分列，不合成確定階段。'],modern:['moonHeritage','待查證','舊座標偏品川但文字稱三田；未有精確定位證據。撤除數值，不另猜座標。']},
 A06:{urban:['ferry','不受支持','原文將同一館藏段落中北齋另一幅渡船的遊賞脈絡套到廣重圖；改分開。'],modern:['bridgesLocal','待查證','1929 年現橋有官方支持；三途之渡、1874 等敘述本次未核讀到直接依據，收斂。']},
 A07:{'details.0.text':['asakusa','待查證','畫面沒有證明每件物品都屬於同一名女性；不指定所有權。']},
 A08:{observe:['dawnImage','待查證','Ashmolean 全文不可讀；不以此指定太夫身分或所有人的移動方向。'],urban:['embankmentRoute','待查證','改用已讀跨作品交通背景；不將清晨離去當所有客人的固定作息。'],modern:['embankmentRoute','待查證','本次只核讀見返柳命名故事，沒有今日柳樹連續性證據。']},
 B01:{urban:['saruwaka','待查證','慶應支持改革與集中，原文具體火災、改名年份及三座細目不全部由該段支持。'],modern:['saruwaka','待查證','1872 守田座遷移與今日僅剩碑未完成地方史核對；保留區域與原典藏未確認。']},
 B02:{summary:['embankment','待查證','已檢 Commons 正式 500px 縮圖，可見月亮；月亮和黃昏並不矛盾。收斂的是月光照明推定，不判定無月。'],urban:['embankmentRoute','待查證','六町、八丁、防洪、遷移方位未取得本次充分直接證據。'],people:['embankmentRoute','待查證','步行乘轎與茶屋有來源，靠夜客維生是未證實的個別收入推定。'],modern:['codh','待查證','700 公尺、填平與今日公園路線未完成官方對照；保留區域定位限制。']},
 B03:{urban:['mitsuiHistory','待查證','1673、1683 已從三井沿革核讀；街名由來未獲同等支持，不合併為確證。'],modern:['suruga','待查證','越後屋／三越關係有館方解說；道路名稱、現今視野與建築對應收斂，未假裝實地測量。']},
};
for(const artwork of current){
 const before=old.find(a=>a.id===artwork.id),id=artwork.id,key=primary[id];
 for(const field of ['title','titleJa','titleEn','artist','series','seriesNo','year','medium']){
  let keys=id.startsWith('A')?[key,`api-${id}`]:[key,`commons-${id}`],support=institutional,limit=id.startsWith('B')?'補充作品的構圖資料與本頁實際印本來源分開；不能把其他館藏號移作本圖號。':'';
  if(field==='seriesNo' && seriesIds[id])keys.push(seriesIds[id]);
  if(field==='title') {support=inference;limit='保留展覽繁中題名，日文與英文館藏題名另列，不視為館方官方中文譯名。';}
  if(field==='year' && id==='A01'){support='待查證';limit='The Met API objectDate 為空；保留 null，不補造精確年。';}
  add({id,field,original:String(before[field]??'未定'),updated:String(artwork[field]??'未定'),keys,support,type:'編目欄位',limit});
 }
 for(const field of ['collection','accession','sourceUrl','src','license']){
  const original=before.image[field]??'未提供', updated=artwork.image[field]??'未提供';
  add({id,field:`image.${field}`,original,updated,keys:id.startsWith('A')?[`api-${id}`,'metRights']:[`commons-${id}`],support:id.startsWith('A')?institutional:(['src','sourceUrl','license'].includes(field)?'來源頁聲明（原館藏未獨立核實）':'待查證'),type:'圖像來源／權利',limit:id.startsWith('A')?'各件 Met API 已核對 isPublicDomain=true、primaryImage、accessionNumber；政策另見 metRights。':'Commons 檔案及上傳史可讀；其 PD-Art 是檔案的權利標示，不等於獨立核實原印本的收藏與印次。B01 原典藏未確認，B02/B03 原館藏頁本次不可核讀。'});
 }
 add({id,field:'curatorialTime/timeLabel',original:`${before.curatorialTime??'白晝序章'} ${before.timeLabel}`,updated:`${artwork.curatorialTime??'白晝序章'} ${artwork.timeLabel}`,keys:[],support:inference,type:'策展安排',limit:'非畫中精確鐘點，不代表同一季節、同一年或同一夜。'});
 add({id,field:'location',original:JSON.stringify(before.location),updated:JSON.stringify(artwork.location),keys:contextual[id],support:id==='A05'?'待查證':inference,type:'歷史地理／區域定位',limit:'區域參考來自既有專案；本次未獨立測繪或重建視點。A05 原數值未經佐證已撤除；其他近似座標不宣稱測量精度。'});
 const fields=['summary',...Object.keys(artwork.sections).map(k=>'sections.'+k),...artwork.details.flatMap((d,i)=>['text','note'].filter(k=>d[k]).map(k=>`details.${i}.${k}`))];
 const get=(obj,field)=>field.split('.').reduce((x,k)=>x?.[k],obj)??'';
 for(const field of fields){
  const original=get(before,field),updated=get(artwork,field),short=field.replace('sections.','');
  if(original!==updated && original){
   const issue=oldIssues[id]?.[short];
   for(const sentence of split(original))add({id,field,original:sentence,updated,keys:issue?[issue[0]]:contextual[id],support:issue?.[1]??'待查證',limit:issue?.[2]??'逐句比對後局部修順、補來源歸屬或限制；不能把整段改文視為原文每個細節皆錯。',type:'修訂前主張',conclusion:issue?'刪減／改歸屬，原文與新版完整欄位可回查':'小幅修訂；現版各句另列'});
  }
  for(const sentence of split(updated)){
   let support=visual,limit=id==='B02'?'本次核看的是本檔 Commons 正式 500px 縮圖；原始 789×1200 下載遭限流，未作像素級檢查。':'';
   if(/The Met|館方|博物館|圖書館|Cleveland|慶應|Zimmerli|Rutgers|解說|解讀|品川灣|三井廣報|酉日|債務|陰曆|最早|[12][0-9]{3}/.test(sentence))support=institutional;
   if(/本展|不能|不代表|不等|並非|可以比較|提問|如何|尚未|待考|未取得|未確認|未完成/.test(sentence))support=inference;
   if(/尚未核實|仍待確認|未提供|確切.*未|尚未確認|尚未逐一核實/.test(sentence))support='待查證';
   if(id==='A05' && /Rutgers|分歧|差異|歌舞/.test(sentence)){support='相互矛盾';limit='對活動階段的解讀不同；沒有把任一機構的解讀宣稱為唯一歷史事實。';}
   add({id,field,original:sentence,keys:contextual[id],support,limit,type:'現版逐句主張'});
  }
 }
}
// An individual row for every question field; distractors are not exhibition assertions.
for(const q of questions){
 const before=oldQuestions.find(x=>x.id===q.id),keys=[...new Set(q.evidence.flatMap(e=>e.sources))];
 for(const [field,text] of [['prompt',q.prompt],['observation',q.observation],['takeaway',q.takeaway],['reflection',q.reflection],['hint',q.hint]])
  add({id:q.id,field,original:before[field],updated:text,keys,support:field==='observation'?visual:inference,type:field==='reflection'?'開放提問（不計分）':'互動題目／策展閱讀',limit:q.artworkId==='B02'?'圖像布局核看 Commons 正式縮圖；制度說明用其他印本來源。':'作答所需背景可由同題連結的站內作品頁讀取；提問、裁圖假設與閱讀判斷不是新增史實。',file:'src/data/observation.ts'});
 for(const [i,choice] of q.choices.entries()) add({id:q.id,field:`choices.${i}/answer=${q.answer}`,original:before.choices[i],updated:choice,keys,support:i===q.answer?inference:'不受支持',type:i===q.answer?'本題選定的閱讀答案':'刻意設置的錯誤選項（非展覽主張）',limit:i===q.answer?'答案是本題的觀察／指定館方解讀／策展比較；並非宣稱其他歷史情境絕不可能。':'錯誤選項不得當成網站主張引用；逐項檢查回饋，不以荒謬的歷史斷言充當證據。',file:'src/data/observation.ts'});
 for(const [i,e] of q.evidence.entries()) for(const sentence of split(e.text))add({id:q.id,field:`evidence.${i}.text`,original:sentence,keys:e.sources,support:e.kind==='策展說明'||/本展|裁圖|比較|不必|不等於|據此觀察/.test(sentence)?inference:(q.id==='moon-objects'&&/差異|不同|兩者/.test(sentence)?'相互矛盾':institutional),type:e.kind,limit:'機構解讀與策展比較依句中歸屬閱讀；來源不能反證所有錯誤選項在任何歷史情境都不可能。',file:'src/data/observation.ts'});
 for(const [i,feedback] of q.feedback.entries()) if(feedback)add({id:q.id,field:`feedback.${i}`,original:before.feedback[i],updated:feedback,keys,support:inference,type:'教學回饋',file:'src/data/observation.ts'});
}
const pageClaims=[
 ['HOME-01','src/pages/index.astro','原文連寫日落後煙火、吉原燈籠與淺草人潮','改為不同城市片刻，說明非同一年／季節／夜晚',['bridge','cherryImage','asakusa'],inference],
 ['CUR-01','src/pages/curation/index.astro','木版畫可大量印製、出版者參與','保留，新增 The Met 2003 文章與不推定單件動機的限制',['metEssay'],institutional],
 ['CUR-02','src/pages/curation/index.astro','未署名學者與無公共路燈的概括','具名 Nenzi，限於出版社公開摘要，不冒稱讀過全書',['nenzi'],'學術研究支持'],
 ['CUR-03','src/pages/curation/index.astro','直接觀察稱宴席後與女性身分','直接觀察改為器物、人影與局部，館方解讀另列',['moonHeritage','moonRutgers'],inference],
 ['CUR-04','src/pages/curation/index.astro','午夜是工作的開始','刪去精確鐘點，保留館方所說的前往工作',['ferry'],institutional],
 ['ICOM-01','src/pages/curation/index.astro','2022 定義只摘部分職能','完整要素轉述並連完整原文，標明學生策展不等同機構治理與保存',['icom'],institutional],
 ['CUR-05','src/pages/curation/index.astro','分藏四地的版畫可在同頁並列，木紋均可放大','改為八件 Met、三件 Commons 與其他館解說連結；不誇大跨館印本展示或影像解析度',['metRights'],inference],
 ['TIME-01','src/pages/timeline/index.astro','18:00–05:00 策展時間聲明','保留；新增實際年代與可支持的季節背景',['yoshiwara','asakusa','moonHeritage'],inference],
 ['TIME-02','src/pages/timeline/index.astro','黎明圖人物離去','改以街道疏密比較收束，不指定每位人物行程',['dawnImage','cherryImage'],inference],
 ['ABOUT-01','src/pages/about/index.astro','七位姓名與四位已有分工','保留 contributions.csv 的原始資料；三人的分工仍空白',[],inference],
 ['ACT1-01','src/data/activities.ts','四個觀展情境與結果','核對四段歷史背景後保留；Cleveland 為另一印本',['fireworks','manpachi','ferry','asakusa'],inference],
 ['REF-01','src/pages/references/index.astro','舊版均聲稱資料核對完成','重新標日期與各來源狀態；不可讀來源改列舊版未核讀',['moonHeritage'],inference],
 ['MAP-01','src/components/MapComparison.astro','五幅 1850–1853 古圖、配準誤差','保留；新增圖幅 ID 連結，年份、bbox、NDL DOI 與 owner_id 逐幅查 metadata',['codh'],institutional],
 ['PROTO-01','public/concepts/','概念稿仍有橋上行人、午夜祭典、髮簪暗示剛返回、送客走出大門','同步修正；概念稿的其他 Commons 原圖來源未逐件完成，清楚標示限制',['bridge','asakusa','dawnImage'],inference],
];
for(const [id,file,original,updated,keys,support] of pageClaims)add({id,field:'正文／相同說法全站同步',original,updated,keys,support,file,type:'頁面衍生文案'});
for(const [index,original,updated,support,keys] of [
 ['objects','鮪魚生魚片、酒器、煙草盆、煙管袋、扇子與手巾均列為直接觀察','新稿只保留可辨器物與局部樂器；未取得逐件物種與用途鑑定，不承接完整清單','待查證',['moonImage','moonHeritage']],
 ['shadow','宴席後的器物與一名女性的影子列為直接觀察','物件、人影與衣裾為可見；宴後及遊女身分改列東京國立博物館解讀','策展推論（非歷史事實）',['moonImage','moonHeritage','moonRutgers']],
 ['universal','月見是江戶庶民與富裕階層的全民文化','保留具名館方對月見地點及宴席的說明；不推定全民參與','不受支持',['moonHeritage','moonRutgers']],
 ['earthquake','1857 年創作時江戶剛經歷 1855 年安政大地震','本次不將這段背景承接進單件解說；未另核讀地震史，並非判定年份錯誤','待查證',[]],
 ['ships','黑船來航與品川建造御台場的社會劇變','未取得足以連結此圖的直接研究，不承接到新版作品詮釋','待查證',[]],
 ['intention','全集帶有祈求災後復興的深意','沒有可靠出處證明該主觀意圖，不承接此結論','不受支持',[]],
 ['clock','午夜不是下班後的娛樂，而是工作才要開始','館方僅說前往工作；刪除午夜才開始的鐘點推定','不受支持',['ferry']],
 ['team','期中簡報第 7 頁分工表：P4 對應劉彥廷','僅可證期中簡報分頁安排；CSV 期末分工仍空白，不逕自補填','一手專案文件直接支持',[]],
])add({id:`MIDTERM-${index}`,field:'前期底稿對照',original,updated,support,keys:['midterm',...keys],file:'docs/期末報告_江戶不打烊_分章修訂稿.md',type:'期中原文審核；不修改歷史原件',limit:'原 PDF／講稿保持原樣。來源只支持具體欄位；沒有讀過的歷史研究不以底稿轉引取代。'});
for(const a of current.filter(a=>a.id.startsWith('A'))){const m=JSON.parse(readFileSync(`docs/evidence/met-api-${a.id}.json`,'utf8'));add({id:a.id,field:'dimensions',original:m.dimensions,keys:[`api-${a.id}`],support:institutional,type:'編目尺寸（本頁印本）',file:'docs/artwork-catalog.csv'});}
for(const [index,part] of ['服務社會的非營利常設機構','研究有形與無形遺產','蒐藏有形與無形遺產','保存有形與無形遺產','詮釋並展示有形與無形遺產','對公眾開放且具可及性、包容性','促進多樣性與永續','以倫理及專業運作與溝通','包含社群參與','提供教育、欣賞、反思與知識分享的多元經驗'].entries())add({id:'ICOM-2022',field:`definition.${index}`,original:part,keys:['icom'],support:institutional,type:'定義逐要素轉述',file:'src/pages/curation/index.astro / 期末報告分章稿'});
for(const [key,text] of [['cherry','陰曆三月暫時移植數百株櫻樹'],['lantern','陰曆七月盂蘭盆期間的玉菊燈籠'],['niwaka','陰曆八月俄祭典']])add({id:'A04',field:`season.${key}`,original:text,keys:['yoshiwara'],support:institutional,type:'季節背景逐項',file:path});
for(const mapId of [4908,4902,4930,4931,4935]){const m=JSON.parse(readFileSync(`docs/evidence/map-${mapId}.json`,'utf8')).items;for(const field of ['issue_year','bbox','source_uri','publisher','owner_id','description'])add({id:`MAP-${mapId}`,field,original:String(m[field]),keys:[`map-${mapId}`,'codh'],support:institutional,type:'圖幅 metadata',limit:'原始 JSON 可重查；bbox 是配準影像外框，並不標示古今地物精確對應或畫家視點。',file:'src/lib/maps.ts / src/components/MapComparison.astro'});}
let reportReview=[];
if(existsSync('docs/evidence/final-report-edits.json')){
 const supplied=JSON.parse(readFileSync('docs/evidence/final-report-edits.json','utf8'));
 reportReview=supplied.review;
 for(const r of reportReview){
  const fragments=String(r.updated).split(/\n|(?<=[。；])/u).map(s=>s.trim()).filter(Boolean);
  for(const [i,fragment] of fragments.entries()){
   const isReference=/書目/.test(r.claimType),keys=r.keys.filter(k=>sourceById[k]);
   let support=keys.length?'館藏／一手資料直接支持':'策展推論（非歷史事實）';
   if(/來源限制|待確認|未提供|草稿/.test(r.claimType)||/仍待|未獨立核實|不可核讀|未取得|尚未/.test(fragment))support='待查證';
   if(/Zimmerli|宴席.*階段|兩說/.test(fragment)&&/解讀|不同|並列/.test(fragment))support='相互矛盾';
   if(/策展|提問|學習|驗證|程式|版本|研究目標/.test(r.claimType)||/本展|不能|不表示|不宣稱|未實施|核對日期|檢索於/.test(fragment))support='策展推論（非歷史事實）';
   if(isReference)support='來源入口／編目對照（依條目讀取範圍）';
   add({id:r.id,field:`${r.location}／修訂句 ${i+1}`,original:r.original,updated:fragment,keys,support,type:r.claimType,file:'docs/期末報告_江戶不打烊_修訂版.docx',checkedDate:'2026-11-19',limit:`原稿 SHA256 ${supplied.sourceSha256}；本列由原欄位對應修訂句，不代表原段每句皆錯。歷史來源核讀於 2026-11-18；原稿同步與排版於 11-19。${keys.map(k=>sourceById[k].scope).join('；')||'專案說明以 Git、CSV、測試原始記錄及原 DOCX 為證；不冒認會議或真人研究。'}`,conclusion:'原 DOCX 實際另存修訂；與網站及既有證據對照，版面另經實際 PDF 檢查'});
  }
 }
}
csv('docs/evidence-register.csv',['claim_id','artwork_id/page','原文','主張類型','source_title','institution/author','accession/DOI','source_url','來源具體段落或可定位位置','核對日期','支持程度','來源限制/歧義','修改後文字','修改檔案','結論'],rows);
// Catalog values and image rights remain separate from another impression's metadata.
const catalog=current.map(a=>{
 const m=a.id.startsWith('A')?JSON.parse(readFileSync(`docs/evidence/met-api-${a.id}.json`,'utf8')):null;
 return {artwork_id:a.id,title:a.title,titleJa:a.titleJa,titleEn:a.titleEn,artist:a.artist,series:a.series,seriesNo:a.seriesNo??'',year:a.year??'館藏未定年',medium:a.medium,dimensions:m?.dimensions??'本頁印本尺寸未獨立核實；不移用其他印本尺寸',collection:a.image.collection,accession:a.image.accession??'本頁印本館藏號未確認',source_url:a.image.sourceUrl,image_url:a.image.src,image_pixels:`${a.image.width}×${a.image.height}`,curatorial_time:a.curatorialTime??'白晝序章',zoom_details:a.details.length,location_confidence:a.location.confidence,location_note:a.location.note??'大致區域，未重建畫家視點',checked:date,evidence_scope:a.id.startsWith('A')?'Met API 的 primaryImage、登錄號、公有領域與本頁圖檔一致':'Commons 檔案可讀；另館編目僅支撐構圖資料，未移用其館藏號',remaining:a.id==='B01'?'原典藏、印次未確認':a.id==='B02'?'原圖限流；已檢正式 500px 同檔縮圖；Brooklyn 原頁不可核讀':a.id==='B03'?'Commons 原頁指 Brooklyn 121623，原館藏全文不可讀；與 30.1478.8 的精確對應待確認':a.id==='A05'?'精確地點與不同解說的活動階段待研究':''};
});
csv('docs/artwork-catalog.csv',Object.keys(catalog[0]),catalog);
const rights=current.map(a=>({artwork_id:a.id,image_url:a.image.src,source_url:a.image.sourceUrl,rights_label:a.image.license,rights_basis:a.id.startsWith('A')?'該件 Met API isPublicDomain=true；Open Access 政策 CC0':'Commons 各檔 PD-Art／Public Domain Mark；不是 Commons 網頁文字的 CC BY-SA',source_chain:a.id==='B01'?'Commons → hiroshige.org.uk 私人整理站；原館藏未確認':a.id==='B02'?'Commons → Brooklyn 舊物件 121713；原頁不可核讀':a.id==='B03'?'Commons → Brooklyn 舊物件 121623；原頁不可核讀':'Met 官方館藏頁 → API primaryImage → 原圖 SHA-256，見 evidence/image-downloads.json',image_state:a.id==='B01'?'Commons 上傳史記載色彩處理，706×1050':a.id==='B02'?'上傳史記載色彩處理；原圖下載受限，核看正式 500px 版本':a.id==='B03'?'Commons 上傳史記載色彩處理／還原，790×1200':'已核看本頁實際高解析原圖',other_impression_warning:'Cleveland／TNM／Keio／Fitzwilliam／Brooklyn 的另印本解說不轉移收藏號、尺寸、色彩或印製狀態',permission_request:'本次未向機構申請額外授權，不宣稱取得額外許可',checked:date,unresolved:a.id.startsWith('B')?'圖像檔的權利標示與原印本來源可信度分列；來源鏈仍需人工確認':'未對各國特殊再利用規定作法律符合性審定'}));
csv('docs/rights-register.csv',Object.keys(rights[0]),rights);
const audits=questions.map(q=>{
 const before=oldQuestions.find(x=>x.id===q.id),keys=[...new Set(q.evidence.flatMap(e=>e.sources))],changed=['prompt','choices','answer','hint','observation','evidence','takeaway','reflection','feedback','focus','focuses'].filter(k=>JSON.stringify(before[k])!==JSON.stringify(q[k]));
 const special={
 'manpachi-series':'補上柳橋地方史，料亭／交通關係明確屬策展合讀，不能用 Met 的餐飲系列簡介單獨證明船宿制度。',
 'moon-objects':'題幹限定東京國立博物館的解讀；Rutgers 另有歌舞中的讀法，故不考唯一客觀活動階段。',
 'moon-offscreen':'移正三味線焦點到前景；不再宣稱右側三味線或演奏已畢；反思只談構圖。',
 'dawn-departure':'移除未核讀 Ashmolean 的太夫身分與離去方向；答案改比較實際人物疏密，索引仍 2。',
 'dawn-freedom':'以 Met 題名與 Geidai 制度背景區分策展觀點，不以街上人物推斷契約。',
 'saruwaka-grain':'另印本木紋解讀可讀；本頁低解析與色彩處理不保證木紋清楚。可由站內材料說明答題。',
 'embankment-contrast':'同檔縮圖核看堤道、轎子、店舖與田野；原圖限流不作細部色彩或人物身分論證。',
 'embankment-route':'Fitzwilliam 提供引手茶屋背景；不從個別人物推定收入。',
 'asakusa-hairpins':'答案是題幹指定的館方推測，不是已證實送禮；保留 likely／we may imagine 的語氣。',
 'asakusa-time':'保留裁圖比較，不再測試策展 00:00 與畫中黃昏的差異。',
 };
 return {question_id:q.id,artwork_id:q.artworkId,題幹中的歷史主張:q.prompt,答案是否可證:`索引 ${q.answer}：${q.choices[q.answer]}；${special[q.id]??'依實際圖像、具名館方解讀或已標示的策展比較作答，並非證明所有其他歷史情境都不可能。'}`,證據URL:keys.map(k=>sources[k].url).join(' | '),來源段落:keys.map(k=>locators[k]).join(' | '),其他選項是否有歧義:'逐項核對三選項、提示與個別回饋；錯誤選項為情境中的誤讀，不當作新的歷史主張。開放反思沒有唯一答案。',修改:changed.length?changed.join('、')+'；'+(special[q.id]??'補清引用範圍'):'保留：畫面與來源支持；沒有為修改而改題',驗證結果:'26 題逐欄人工內容審查；14 項程式測試檢查結構與進度。瀏覽器記錄另見 test-report，不以程式通過等同史實證明',站內線索:(q.readingArtworkIds??[q.artworkId]).map(id=>`/edo-after-dark/artworks/${id}/#artwork-reading`).join(' | '),focus:JSON.stringify(q.focuses??[q.focus]),備註:special[q.id]??'無新增歷史斷言'};
});
csv('docs/question-audit.csv',Object.keys(audits[0]),audits);
const changes=[];
for(const a of current){const b=old.find(x=>x.id===a.id);for(const key of ['title','titleJa','titleEn','artist','series','seriesNo','year','medium','summary',...Object.keys(a.sections).map(k=>'sections.'+k),'location','details','image.collection','image.license']){const get=(o,k)=>k.split('.').reduce((x,p)=>x?.[p],o);const before=get(b,key),after=get(a,key);if(JSON.stringify(before)!==JSON.stringify(after))changes.push({id:a.id,field:key,before:typeof before==='string'?before:JSON.stringify(before),after:typeof after==='string'?after:JSON.stringify(after)});}}
for(const q of questions){const b=oldQuestions.find(x=>x.id===q.id);for(const key of ['prompt','choices','evidence','hint','observation','takeaway','reflection','focus','focuses'])if(JSON.stringify(b[key])!==JSON.stringify(q[key]))changes.push({id:q.id,field:key,before:typeof b[key]==='string'?b[key]:JSON.stringify(b[key])??'',after:typeof q[key]==='string'?q[key]:JSON.stringify(q[key])??''});}
csv('docs/before-after.csv',['id','field','before','after'],changes);
if(reportReview.length)csv('docs/report-before-after.csv',['id','field','before','after','sources'],reportReview.map(r=>({id:r.id,field:r.location,before:r.original,after:r.updated,sources:r.keys.map(k=>sourceById[k]?.url).filter(Boolean).join(' | ')})));
writeFileSync('docs/evidence/audit-counts.json',JSON.stringify({date,reportRevisionDate:reportReview.length?'2026-11-19':null,claims:rows.length,questions:audits.length,catalog:catalog.length,rights:rights.length,changes:changes.length,reportChanges:reportReview.length,sourceEntries:registry.length,artifactsComparedTo:'b61293fab0cdc4de8564d71c2e91016b21ffa53d'},null,2)+'\n');
console.log(JSON.stringify({claims:rows.length,questions:audits.length,catalog:catalog.length,rights:rights.length,changes:changes.length}));
export { rows as evidenceRows, catalog, audits, registry, changes };
