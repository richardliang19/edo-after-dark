import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { observationQuestions, observationSources } from '../docs/evidence/minimal-text-baseline/src/data/observation.ts';

const baseline = 'docs/evidence/minimal-text-baseline/';
const artworks = JSON.parse(readFileSync(baseline + 'src/data/artworks.json', 'utf8'));
const changes = [];
const original = file => readFileSync(baseline + file, 'utf8');
const valueAt = (object, path) => path.split('.').reduce((value, key) => value[key], object);
function add(file, field, before, after, reason, sources = [], type = '冗贅') {
  if (before === after || typeof before !== 'string') throw Error(`Invalid change: ${field}`);
  changes.push({ file, field, before, after, reason, type, history: '史實未更動；刪節或整併既有表述', sources });
}
function art(id, field, after, reason, sources = []) {
  add('src/data/artworks.json', `${id}.${field}`, valueAt(artworks.find(a => a.id === id), field), after, reason, sources);
}
function question(id, field, after, reason) {
  const q = observationQuestions.find(q => q.id === id);
  add('src/data/observation.ts', `${id}.${field}`, valueAt(q, field), after, reason, q.evidence.flatMap(e => e.sources));
}
function page(file, before, after, reason, type = '元敘述') {
  add(file, '頁面文字／輸出', before, after, reason, [], type);
}

// P0: explicit redundancy first. The trademark identification remains in observe.
art('B03', 'sections.urban', '越後屋於 1673 年在江戶本町一丁目開業，1683 年遷至駿河町。', '商標辨認已在上一段；本段保留創業與遷店史，刪來源分工及企業史防錯句。', ['suruga', 'mitsuiHistory']);
const workPage = 'src/pages/artworks/[id].astro';
page(workPage, "const timeText = a.curatorialTime ?? '序章';", 'const timeText = a.curatorialTime ? `${a.curatorialTime}・${a.timeLabel}` : a.timeLabel;', '一次組合時間標籤，無策展時間時直接使用既有標籤。', '顯示錯誤');
page(workPage, '{timeText}・{a.timeLabel}', '{timeText}', '主視覺兩個分支共用修正後標籤；不更動作品時間資料。', '顯示錯誤');
page(workPage, '{timeText}　{a.timeLabel}', '{timeText}', '編目列同步避免序章與時段重複。', '顯示錯誤');
page(workPage, '        <h2>作品介紹</h2>\n        <p>{a.summary}</p>', '        <h2>作品介紹</h2>', '保留開場導言與閱讀錨點，刪閱讀區第二次輸出的摘要。', '重複');

art('A01', 'sections.urban', artworks[0].sections.urban.replace('這兩類資料分別說明橋的沿革與館方對構圖的理解。', ''), '只刪來源分工句，保留橋史與館方對支撐結構的解讀。', ['ryogokuLocal', 'bridge']);
art('A01', 'sections.modern', '墨田區鄉土文化資料館記載，現今的兩國橋於 1932 年完工；國立國會圖書館也指出，江戶初建的橋位比現橋稍偏下游。地圖標示現橋附近的大致區域。', '保留橋位差異及大致區域限定，刪未曾提出的觀看點反駁。', ['bridgesLocal', 'ryogokuLocal']);
art('A02', 'sections.urban', '柳橋位於神田川注入隅田川的地方。台東區的史跡介紹記載，江戶時代橋畔有船宿，幕末至明治以後又以花柳界聞名。畫中料亭面向水面，店內的聚會與河岸的往來如何相接？', '保留地方史及策展提問，刪合讀程序與職業辨認旁白。', ['yanagibashiLocal']);
art('A02', 'sections.people', 'The Met 將這個系列介紹為江戶知名餐飲場所的巡禮，並提到形形色色的城市居民。圖中可見樓上席間人物、橋上行人與河船。', '刪重複的身分未明及上一段已有的聚會／河岸提問。', ['manpachi']);
art('A03', 'sections.observe', '近景是橋與散布河面的船，橋上可見密集小人影；上方的煙火與細長軌跡被大片深色天空包圍。Cleveland Museum of Art 對同一構圖另一印本（1940.986）的解說指出，夜空占了將近一半畫面。', '保留另一印本的明確歸屬，刪主文與來源區重複的印製差異提醒。', ['fireworks']);
art('A03', 'sections.urban', '國立國會圖書館介紹，兩國的川開き與夏季納涼期間有煙火活動。Cleveland 對另一印本的解說列出橋、河岸、茶屋與租用遊船等觀賞位置，並指出 1850 年代沿河餐館與商家常贊助煙火。', '只刪人物身分紀錄的預防性反駁。', ['ryogokuLocal', 'fireworks']);
art('A03', 'sections.people', '船上可辨認操船的人影。有人仰望煙火，也有人讓船在河上移動；遊賞與載客工作同時出現在河景中。', '商家贊助已在上一段；保留船夫線索與勞動比較，刪職業、付費、動機清單。', ['fireworks']);
art('A03', 'sections.modern', '隅田川花火大會的官方沿革記載，活動曾中斷，1978 年以現名復辦，打上地點也移往更上游，設為兩個會場。官方沿用 1733 年的起源說，但這不表示畫中描繪的就是該年活動。', '保留中斷、移址與起源說的限定；刪研究者未核讀的過程敘述。', ['fireworksModern']);
art('A04', 'sections.urban', '東京藝術大學美術館的吉原展覽概要介紹，仲之町在陰曆三月暫時移植數百株櫻樹，供人賞花。', '刪本作未描繪的七、八月活動與逐株紀錄旁白；明示陰曆，避免混用月份。', ['yoshiwara']);
art('A04', 'sections.people', '遊客、茶屋與遊女構成了這個熱鬧的春夜。同一份展覽說明也指出：吉原的繁華，建立在遊女因債務受役、無法依自己意願離開的犧牲上。賞花的人與在此工作的人，處境並不相同。', '保留有來源的制度背景；不指認個別人物，刪重複服飾、站位防錯句。', ['yoshiwara']);
art('A04', 'details.0.note', '吉原的季節活動背景，依東京藝術大學美術館展覽概要。', '刪逐株樹木紀錄的預防性反駁，保留來源。', ['yoshiwara']);
art('A04', 'details.1.note', '遊女的債務服役條件依東京藝術大學美術館的展覽概要整理。', '保留制度背景出處，刪主文已有的身分辨認旁白。', ['yoshiwara']);
art('A05', 'sections.observe', '榻榻米上可見托盤、杯碟等器物，前景有局部露出的樂器，左側障子映出人影，右邊則露出人物衣裾與腳部。窗外是滿月、船與海面。文化遺產線上收錄的東京國立博物館同構圖印本，將這個尚未收拾的房間解讀為月見宴結束後的妓樓二樓。', '同一句已明示館方解讀；刪句尾重複說明，保留另一印本區別。', ['moonHeritage']);
art('A05', 'sections.urban', '東京國立博物館的解說將月之岬介紹為可眺望品川灣、以中秋賞月聞名的高地。', '現代街址未定集中留在現代地點對照與定位列，避免兩段重複。', ['moonHeritage']);
art('A05', 'sections.people', '東京國立博物館將障子上的影子解讀為離開的遊女。本頁前景也可見三味線的一部分；器物、衣裾與影子使沒有完整出現的人仍可被察覺。這些線索如何把室內活動與開闊海景放在一起？Rutgers University 的 Zimmerli Art Museum 署名展覽文章則把同構圖讀為月見會中的歌舞，與東京國立博物館的宴後解讀不同。', '保留兩館實質分歧與開放提問；刪創作動機、演奏時間的預防性反駁及保留分歧的自我宣告。', ['moonHeritage', 'moonRutgers']);
art('A05', 'sections.modern', '「月之岬」的精確地點仍待確認。館方資料說明品川灣與高地的關係，未提供可直接對應的現代街址，因此地圖暫不標示座標。', '保留街址未知與未定位的實際限制，刪稽核動作及誤認情境。', ['moonHeritage']);
art('A05', 'details.1.note', '人物身分與動作依東京國立博物館對同構圖印本的解讀。', '保留解讀出處及另一印本區別，刪重複證明旁白。', ['moonHeritage']);
art('A05', 'details.2.note', '三味線的辨認可參見 Zimmerli Art Museum 對同構圖印本的解說。', '用既有樂器解讀出處取代無關樂曲與演奏時刻的防錯清單。', ['moonRutgers']);
art('A06', 'sections.urban', '墨田區鄉土文化資料館介紹，御廄河岸的地名與幕府米倉附屬的御廄有關，此處曾有渡船。', '夜鷹解讀已在前後段；刪北齋／廣重不可混淆的稽核提醒。', ['bridgesLocal']);
art('A06', 'sections.modern', '墨田區鄉土文化資料館將這一帶的渡船與今日廄橋相連，並記載現橋於 1929 年完成。地圖以廄橋附近標示渡口的大致區域。', '保留大致區域限定，不再假設觀眾將橋頭當成精確渡口。', ['bridgesLocal']);
art('A07', 'sections.modern', '畫中的觀看位置在新吉原一帶，遠方人群則前往鷲大明神。今日台東區仍介紹每年十一月酉日於鷲神社與長國寺舉行的酉之市；今日國曆日期不等同畫中江戶時期的陰曆月份。地圖標記僅供比較大致區域。', '整併觀看點與目的地的同義句；保留新舊曆及區域限定。', ['asakusa', 'festivalLocal']);
art('A07', 'details.0.text', '貓背對觀眾望向窗外。房間裡還有衣物與飾物，卻不見完整人物。', '只刪物件屬於誰的預防性反駁。', ['asakusa']);
art('A07', 'details.3.note', '依 The Met 館藏 JP60 解說保留推測語氣。', '保留館方推測限定；刪髮簪不能證明親自參祭的重複提醒。', ['asakusa']);
art('A08', 'sections.observe', '吉原的街道向遠處延伸，幾組人物沿路分布，右側有花木。The Met 的英文題名將場景定位為吉原入口的黎明。與《吉原夜櫻之圖》相比，這幅畫的人群較為疏落。', '保留題名與跨作品比較；同夜限定已在時間軸入口，人物未被逐一指認。', ['dawnImage', 'cherryImage']);
art('A08', 'sections.urban', 'Fitzwilliam Museum 對《吉原日本堤》另一印本的介紹，將堤道、引手茶屋與吉原入口相連。沿著這條路線，也可以從訪客的抵達與離去理解吉原街景。', '保留交通背景的作品歸屬與閱讀提議，刪個人行程紀錄反駁。', ['embankmentRoute']);
art('A08', 'sections.people', '東京藝術大學美術館的展覽概要指出，遊女受到債務服役制度拘束，不能依自己的意願離開。回看黎明街景，遊客的遊賞可以結束，待客者的勞動處境卻不會隨天亮消失。', '保留制度及策展比較，刪收束提問與個人契約證明的旁白。', ['yoshiwara']);
art('A08', 'sections.modern', 'Fitzwilliam Museum 在《吉原日本堤》的介紹中提到入口附近的「見返柳」，並轉述離去客人回望的說法。今日柳樹與江戶原樹的連續性仍未核實。', '保留傳說歸屬及原樹連續性疑問，刪無關人物方向的反駁。', ['embankmentRoute']);
art('A08', 'details.0.note', '黎明依 The Met 館藏題名。', '保留時段出處；刪未逐一辨明身分的重複提醒。', ['dawnImage']);
art('A08', 'details.1.note', '兩幅作品的比較，不代表它們描繪同一夜。', '保留跨作品比較必要限定，刪對服役結束的重複反駁。', ['dawnImage', 'cherryImage']);
art('B01', 'sections.observe', '劇場街向畫面深處延伸，滿月與人物腳下的影子呼應。慶應義塾大學圖書館對同構圖另一印本的解說指出，夜空刻意保留版木木紋。不同印本與數位影像中，木紋的清晰程度不盡相同。', '保留他館印本與可見度限制；色彩處理、原典藏未確認已留在收藏／授權與來源區。', ['saruwaka']);
art('B01', 'sections.urban', '慶應圖書館的解說將猿若町的劇場集中，連到天保改革時的強制遷置：三座劇場沿同一條街排列，遠近法把這段街景收在畫面裡。', '保留劇場街歷史，原圖典藏未明留在收藏／授權及來源範圍。', ['saruwaka']);
art('B01', 'sections.modern', '地圖標示淺草六丁目一帶的大致區域，各劇場舊址與現代街廓的對應仍待確認。', '主文只留地點精度；不以慶應補填原典藏，既有收藏與授權欄不動。', ['saruwaka']);
art('B02', 'sections.observe', '上方可見月亮與斜飛的鳥群，堤道上是行人、轎子與沿路店舖，周圍田野較為空曠。台東區立中央圖書館對同構圖另一印本的解說，將時段介紹為黃昏，並比較堤道的繁忙與田野的安靜。', '保留館方黃昏解讀與異印本歸屬，刪月亮／深夜反駁及核看縮圖紀錄。', ['embankment']);
art('B02', 'sections.urban', 'Fitzwilliam Museum 對同構圖另一印本的解說，把日本堤介紹為穿過淺草田野、通往新吉原的路線。', '田野疏密已在上一段，刪重複來源與未使用的路程推算反駁。', ['embankmentRoute']);
art('B02', 'sections.people', 'Fitzwilliam Museum 介紹訪客步行、乘轎，以及沿途引手茶屋預先安排遊郭接待的功能。前往吉原的路上，交通與待客服務已經開始。', '保留服務功能及策展觀察，刪個人收入、行程的假想防錯句。', ['embankmentRoute']);
art('B02', 'sections.modern', '地圖以日本堤一帶作為區域對照，畫中各段堤道與今日道路的精確對應仍待確認。', '保留位置未定的實質限定；古今配準方法留在地圖來源說明。', ['embankmentRoute']);

// P1: keep questions, choices, answer indices and source associations intact.
question('bridge-boating', 'evidence.0.text', 'The Met 將屋形船連到江戶中產階層的遊河生活。乘客觀看橋景、船夫維持船行，兩種經驗共同構成這趟遊河；這是從畫面與背景提出的比較。', '刪合讀動作與兩次策展自述，仍標示比較的性質。');
question('manpachi-cartouche', 'evidence.0.text', 'The Met 指出，《江戶高名會亭盡》用扇形題籤中的雙關短詩呼應各個場所，文字與景色共同介紹名店。', '刪未翻譯詩句及菜單反駁，不改雙關短詩的答案線索。');
question('manpachi-series', 'evidence.0.text', 'The Met 介紹本系列的餐飲場所主題，台東區地方史另記載柳橋的河口與船宿。面水的座敷如何接上河岸往來，是結合畫面與這些背景提出的問題。', '保留推論層次，刪合讀程序與人物職業反駁。');
question('fireworks-viewers', 'evidence.0.text', 'Cleveland 館藏解說列出橋上、沿岸、茶屋與租用遊船等觀賞位置。畫中最容易對照的是橋面與河面的疏密、高低差別。', '只刪指定微小人物身分的無關提醒。');
question('cherry-staging', 'evidence.0.text', '東京藝術大學美術館介紹，仲之町在陰曆三月暫時移植數百株櫻樹供人賞花。畫中沿街排列的花木，可以放在這項季節活動的背景下理解。', '保留背景與圖像的關係，刪逐株樹木紀錄反駁。');
question('cherry-social-context', 'evidence.0.text', '東京藝術大學美術館介紹吉原的節令活動，也指出遊女因債務受役、無法依自己的意願離開。賞花的訪客與待客的遊女，參與同一場活動的處境並不相同。', '保留勞動制度，站位誤解已由本題答錯回饋處理。');
question('moon-objects', 'evidence.0.text', '東京國立博物館對同構圖印本的解說，將未收拾的房間讀作月見宴之後；Zimmerli 的署名展覽文章則讀為月見會中的歌舞。兩者對活動階段有不同理解，本題採東京國立博物館的解讀。', '保留兩份解說的分歧與本題指定依據，刪重複唯一時刻反駁。');
question('moon-offscreen', 'evidence.0.text', '東京國立博物館解讀障子上的人物影子，Zimmerli 的展覽文章則指出三味線。雖然兩份解說對活動階段有差異，人影、樂器與器物仍讓我們察覺畫邊的人物活動。', '保留實質分歧，刪演奏結束與畫家主觀意圖的防錯旁白。');
question('asakusa-hairpins', 'evidence.0.text', 'The Met 推測，髮簪可能是男客從祭典買給遊女的小禮物。這個解讀把房間裡的飾物與戶外的祭典連起來。', '保留可能與館方歸屬，刪宣告保留可能及送禮未被畫出的重複句。');
question('asakusa-time', 'evidence.0.text', 'The Met 介紹二樓房間、貓與髮簪。裁去這些近景後，田間參拜活動仍在，觀眾卻失去了從特定室內望出去的位置。', '保留構圖比較，刪畫家代替某人發言的無關反駁。');
question('dawn-departure', 'evidence.0.text', 'The Met 的題名指向吉原入口的黎明。夜櫻圖聚集花下人群，黎明圖的街道則較疏落。兩幅作品各有年代與構圖，這是街景的比較，不是同一夜的前後紀錄。', '刪 Ashmolean 無法核讀的內部過程，保留跨作品的時序限定。');
question('dawn-freedom', 'evidence.0.text', 'The Met 的題名交代黎明；東京藝術大學美術館說明遊女的債務服役背景。以此回看街景，遊賞可以結束，勞動條件卻不會隨天亮消失。', '保留制度與策展比較，刪個人行程契約防錯句。');
question('saruwaka-shadows', 'evidence.0.text', '慶應圖書館將滿月與看戲歸來的人腳下的鮮明影子連讀。夜晚的光線既在天空，也表現在街面與人物的明暗關係中。', '只刪本展據此觀察的元敘述。');
question('embankment-contrast', 'evidence.0.text', '台東區立中央圖書館指出，繁忙的堤道與安靜田野形成對比。日本堤通往吉原，往來活動沿路集中，周圍仍有開闊的田野。', '刪周圍皆為商街的預防性反駁，保留道路、田野比較。');
question('embankment-route', 'evidence.0.text', 'Fitzwilliam 介紹訪客步行、乘轎，以及沿途引手茶屋安排接待的功能。前往吉原的路上，交通與待客服務已經接續展開。', '刪兩類資料如何並讀的程序，不動既有來源關係。');
question('suruga-clouds', 'evidence.0.text', 'Brooklyn Museum 將雲帶介紹為傳統分景手法，並指出它柔化街景的對稱。上方的富士山與下方的商街，由雲帶分隔出觀看層次。', '刪策展據此比較與氣象紀錄反駁。');

const curation = 'src/pages/curation/index.astro';
page(curation, '這是閱讀圖像的方法，不用來猜測每件作品的特定創作動機。', '', '前句已提出圖像閱讀問題；不需要另加創作動機反駁。');
page(curation, '本次只核讀公開摘要，具體作品的解說仍各自核對館藏資料。', '', '來源核讀範圍完整留在參考資料及研究紀錄，不打斷主題介紹。');
page(curation, '本展保留差異，不把活動階段當成唯一的圖像事實。', '兩份解說對宴席階段的判讀不同。', '保留分歧，改以兩份解說為主詞。');
page(curation, '館方沒有給出上工的精確鐘點。', '', '策展時刻與畫中鐘點已在相鄰專節說明。');
page(curation, '活動中可以比較不同作品；放大的清晰程度仍受各張影像的解析度限制，不能保證每件印本都看得見相同木紋。', '活動中可以比較不同作品；放大的清晰程度仍受各張影像的解析度限制。', '保留解析度限制，刪此處無須重複的木紋提醒。');
page('src/pages/timeline/index.astro', '這一站借室內與祭典的關係接續夜行；畫中實為黃昏。下一站轉到黎明，並不補畫兩幅作品之間沒有記錄的夜間經過。', '畫中雖是黃昏，這一站仍從窗內與祭典的關係接續夜行。下一站轉到黎明的吉原，看看人群散去後的街道。', '保留黃昏與策展時間區別，刪沒有補畫未記錄經過的旁白。');

const esc = s => String(s).replaceAll('|', '\\|').replaceAll('\r', '').replaceAll('\n', '<br>');
const review = [];
for (const a of artworks) {
  for (const field of ['summary', ...Object.keys(a.sections).map(k => 'sections.' + k), ...a.details.flatMap((d, i) => ['title', 'text', ...(d.note ? ['note'] : [])].map(k => `details.${i}.${k}`))]) {
    const c = changes.find(c => c.field === `${a.id}.${field}`);
    review.push({ file:'src/data/artworks.json', field:`${a.id}.${field}`, decision:c ? '修改' : '保留', before:valueAt(a, field), reason:c?.reason ?? '準確、有用，沒有必須刪除的元敘述。', checks: c ? '保留有效知識；刪重複或程序；維持必要限定；未增加史實。' : '有知識或導覽用途；未與相鄰段不必要重複；非純查證旁白；限定有必要。' });
  }
}
for (const q of observationQuestions) {
  const edits = changes.filter(c => c.field.startsWith(q.id + '.'));
  review.push({ file:'src/data/observation.ts', field:q.id, decision:edits.length ? '局部修改' : '保留', before:q.prompt, reason:edits.length ? edits.map(c => c.reason).join('；') : '題意、回饋及反思清楚，保留原文。', checks:'已讀題幹、三選項、提示、回饋、解說、反思；題 ID、選項、答案、來源關係及選題規則保留。' });
}
for (const file of ['src/pages/index.astro','src/pages/references/index.astro']) review.push({file,field:'公開文字',decision:'保留',before:'全文審閱',reason:'首頁的跨年代限定、參考資料的未核讀範圍與印本差異均有實際作用。',checks:'不為統一風格而改寫。'});
const candidate = '# 最小文字修訂：編輯前判斷\n\n依本輪開始時的工作區快照審查；並非與 Git HEAD 的全任務差異。每個作品摘要、四段主文、細節文字及 26 題都已逐項閱讀。無需修改者明列保留。\n\n| 檔案／欄位 | 判斷 | 原文／題目 | 原因 | 四項檢查 |\n| --- | --- | --- | --- | --- |\n' + review.map(r => `| ${r.file}／${r.field} | ${r.decision} | ${esc(r.before)} | ${esc(r.reason)} | ${esc(r.checks)} |`).join('\n') + '\n\n## 預計改文\n\n| 檔案／欄位 | 問題類型 | 原文 | 預計修改 | 原因 | 史實 |\n| --- | --- | --- | --- | --- | --- |\n' + changes.map(c => `| ${c.file}／${c.field} | ${c.type} | ${esc(c.before)} | ${esc(c.after || '（刪除）')} | ${esc(c.reason)} | ${c.history} |`).join('\n') + '\n';
writeFileSync('docs/最小文字修訂_候選與保留.md', candidate);
writeFileSync('docs/evidence/minimal-text-changes.json', JSON.stringify({date:new Date().toISOString(),review,changes},null,2)+'\n');
if (!process.argv.includes('--apply')) {
  console.log(`Review saved: ${review.length} items, ${changes.length} local edits. No source files modified.`);
} else {
  const files = [...new Set(changes.map(c => c.file))];
  for (const file of files) {
    let text = original(file);
    if (readFileSync(file,'utf8') !== text) throw Error(`Source differs from baseline: ${file}`);
    for (const c of changes.filter(c => c.file === file)) {
      const jsonString = file.endsWith('.json');
      const from = jsonString ? JSON.stringify(c.before) : c.before;
      const to = jsonString ? JSON.stringify(c.after) : c.after;
      // Preserve the original line endings and JSON formatting.
      const needle = file.endsWith('.astro') ? from.replaceAll('\n', text.includes('\r\n') ? '\r\n' : '\n') : from;
      const replacement = file.endsWith('.astro') ? to.replaceAll('\n', text.includes('\r\n') ? '\r\n' : '\n') : to;
      if (!text.includes(needle)) throw Error(`Missing before text: ${c.field}`);
      if (c.before === '{timeText}・{a.timeLabel}') text = text.replaceAll(needle, replacement);
      else text = text.replace(needle, replacement);
    }
    writeFileSync(file, text);
    console.log('Updated', file, createHash('sha256').update(text).digest('hex'));
  }
}
const report = '# 最小必要文字修訂：逐項對照\n\n相對本輪開始時的工作區快照，共 '+changes.length+' 處局部調整。下表列全部實際修改，未改者另見[候選與保留清單](./最小文字修訂_候選與保留.md)。沒有新增史實；來源與必要限定保留。\n\n| 檔案／作品或欄位 | 原文 | 修改後 | 原因 |\n| --- | --- | --- | --- |\n'+changes.map(c=>`| ${esc(c.file+'／'+c.field)} | ${esc(c.before)} | ${esc(c.after||'（刪除重複輸出／旁白）')} | ${esc(c.reason)} |`).join('\n')+'\n\n原始差異見 [本輪 patch](./evidence/minimal-text.patch)，來源確認與測試見[交付紀錄](./最小文字修訂_交付紀錄.md)。\n';
writeFileSync('docs/最小文字修訂_逐項對照.md', report);
