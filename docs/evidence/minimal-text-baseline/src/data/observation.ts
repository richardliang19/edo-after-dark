// Independent audit: 2026-11-18. Locators and limitations: docs/evidence-register.csv.
// Texts are concise Chinese paraphrases, not quotations. Other impressions and
// general historical context are identified separately from the displayed image.
export const observationSources = {
  bridge: { institution: 'The Metropolitan Museum of Art', title: 'Twilight Moon at Ryōgoku Bridge', record: 'JP1312', url: 'https://www.metmuseum.org/art/collection/search/45294', scope: '本頁所用印本的館藏解說' },
  manpachi: { institution: 'The Metropolitan Museum of Art', title: 'The Manpachi at Evening in Yanagibashi', record: 'JP1158', url: 'https://www.metmuseum.org/art/collection/search/45306', scope: '本頁所用印本與系列的館藏解說' },
  fireworks: { institution: 'Cleveland Museum of Art', title: 'Fireworks at Ryōgoku', record: '1940.986', url: 'https://www.clevelandart.org/art/1940.986', scope: '同一構圖的另一印本；本頁圖像為 The Met JP642' },
  fireworksImage: { institution: 'The Metropolitan Museum of Art', title: 'Fireworks at Ryōgoku Bridge', record: 'JP642', url: 'https://www.metmuseum.org/art/collection/search/37093', scope: '本頁圖像與作品資料' },
  cherryImage: { institution: 'The Metropolitan Museum of Art', title: 'Yoshiwara Yo Zakura no Zu', record: 'JP608', url: 'https://www.metmuseum.org/art/collection/search/37059', scope: '本頁圖像與作品資料' },
  yoshiwara: { institution: '東京藝術大學大學美術館', title: 'Yoshiwara（2024 年展覽概要）', record: 'Exhibition Outline', url: 'https://museum.geidai.ac.jp/en/exhibit/2024/03/yoshiwara.html', scope: '吉原的歷史背景；非對本頁某一印本的專屬解說' },
  moon: { institution: 'Cornell University · Herbert F. Johnson Museum of Art', title: 'Moon-Viewing Point', record: '56.073（舊版引用，未重新核實登錄號）', url: 'https://emuseum.cornell.edu/objects/33493/moonviewing-point-from-the-series-one-hundred-famous-views', scope: '舊版引用；本次遇驗證頁，未完成全文核對，修訂題目不再以此作依據', unverified: true },
  moonHeritage: { institution: '東京國立博物館／文化遺產線上', title: '名所江戸百景・月の岬', record: '文化遺產線上 559992；ColBase A-10569-7372', url: 'https://online.bunka.go.jp/heritages/detail/559992', scope: '同構圖另一印本；提供品川灣、高地與宴後房間的館方解讀，非 The Met JP1185 的專屬標籤' },
  moonRutgers: { institution: 'Rutgers University · Zimmerli Art Museum', title: 'Musings by Moonlight: Shadow and Silhouette', record: 'Irene Hu、Paisley Murray、Megan Williams 署名展覽文章', url: 'https://zimmerli.rutgers.edu/node/356', scope: '同構圖另一印本；文章把場景讀為月見會中的歌舞，與東京國立博物館的宴後解讀有差異，不能合併為唯一活動階段' },
  moonImage: { institution: 'The Metropolitan Museum of Art', title: 'Moon-Viewing Location (Tsuki no Misaki)', record: 'JP1185（物件 55095）', url: 'https://www.metmuseum.org/art/collection/search/55095', scope: '本頁圖像與作品資料' },
  ferry: { institution: 'The Metropolitan Museum of Art', title: 'Ommayagashi, Sumida River', record: 'JP1547', url: 'https://www.metmuseum.org/art/collection/search/55712', scope: '本頁所用印本的館藏解說' },
  asakusa: { institution: 'The Metropolitan Museum of Art', title: 'Pilgrimage to the Torinomachi Festival across the Ricefields of Asakusa', record: 'JP60', url: 'https://www.metmuseum.org/art/collection/search/36539', scope: '本頁所用印本的館藏解說' },
  dawn: { institution: 'University of Oxford · Ashmolean Museum', title: 'Dawn Inside the Yoshiwara', record: 'Eastern Art Online · object 21196（舊版引用）', url: 'https://jameelcentre.ashmolean.org/collection/921/per_page/-500/offset/0/sort_by/date/start/1800/end/1895/object/21196', scope: '本次無法讀取全文；不再以此確認人物為太夫或判定移動方向', unverified: true },
  dawnImage: { institution: 'The Metropolitan Museum of Art', title: 'The Entrance to the Yoshiwara at Dawn', record: 'JP1024', url: 'https://www.metmuseum.org/art/collection/search/54931', scope: '本頁圖像、題名與作品資料' },
  saruwaka: { institution: '慶應義塾大學圖書館', title: '名所江戸百景・猿わか町よるの景', record: '200X@5-56 · 日野原健司解說', url: 'https://dcollections.lib.keio.ac.jp/en/ukiyoe/0456', scope: '同一構圖的另一印本；本頁沿用專案的 Wikimedia Commons 圖像' },
  embankment: { institution: '台東區立中央圖書館（NDL Search 收錄）', title: '名所江戸百景・よし原日本堤', record: '「吉原細見の世界Ⅱ」解說', url: 'https://ndlsearch.ndl.go.jp/books/R100000094-I906', scope: '同一構圖的另一印本；本頁沿用 Brooklyn Museum／Wikimedia 圖像' },
  embankmentRoute: { institution: 'University of Cambridge · Fitzwilliam Museum', title: 'Nihon Embankment, Yoshiwara', record: 'P.3577-R · The Night of Longing', url: 'https://nightoflonging.fitzmuseum.cam.ac.uk/explore/sex-for-sale', scope: '同一構圖的另一印本與通往吉原的交通背景' },
  suruga: { institution: 'Brooklyn Museum（Google Arts & Culture 館方供稿）', title: 'Suruga-cho, No. 8 in One Hundred Famous Views of Edo', record: '30.1478.8', url: 'https://artsandculture.google.com/asset/suruga-cho-no-8-in-one-hundred-famous-views-of-edo-utagawa-hiroshige-ando-japanese-1797-1858/KgG9YbG9Rf98Vg', scope: '館方對本構圖的解說；Commons 圖像記載來自 Brooklyn，但與此館藏號的精確對應仍須核實' },
  moonSpace: { institution: 'Seattle Art Museum', title: 'Moon Cape', record: '2017.23.23（舊版引用，未重新核實登錄號）', url: 'https://art.seattleartmuseum.org/en/objects/34881/moon-cape-from-the-series-one-hundred-views-of-famous-place', scope: '本次遭拒絕存取，未完成全文核對；修訂題目不再以此作依據', unverified: true },
  yanagibashiLocal: { institution: '台東區文化探訪', title: '史跡・名所案内：17. 柳橋', record: '柳橋 1-1-1', url: 'https://www.culture.city.taito.lg.jp/bunkatanbou/landscape/japanese/taito_01.html', scope: '地方史背景：河口、船宿、花柳界與 1929 年現橋；不是萬八印本的人物職業紀錄' },
  bridgesLocal: { institution: '墨田區鄉土文化資料館', title: '今と昔の橋物語：隅田川に架かる橋', record: '「隅田川に架かる今の橋」之兩國橋、廄橋項', url: 'https://www.city.sumida.lg.jp/sisetu_info/siryou/kyoudobunka/sonota/tenzi/h14/kikakuten_sumidagawa_hasi.html', scope: '橋梁年代與渡口地名背景；不證明畫家精確觀看點' },
  ryogokuLocal: { institution: '國立國會圖書館', title: '錦絵と写真でめぐる日本の名所：両国橋', record: '地點沿革首段', url: 'https://www.ndl.go.jp/landmarks/sights/ryogokubashi', scope: '架橋、廣小路與川開き背景；不是畫中精確日期' },
  fireworksModern: { institution: '隅田川花火大會', title: '大会について', record: '隅田川花火大会の歴史', url: 'https://sumidagawa-hanabi.com/about/', scope: '現代大會中斷、1978 年復辦與上游會場；起源說僅作官方敘事，不裁定爭議' },
  festivalLocal: { institution: '台東區', title: '酉の市', record: '頁面 173283461，更新 2026-09-24', url: 'https://www.city.taito.lg.jp/event/kanko/torinoithi.html', scope: '今日國曆十一月的酉日與祭典地點，不反推江戶畫面鐘點' },
  mitsuiHistory: { institution: '三井廣報委員會', title: '幕府御用達と維新政府への支援', record: '創業、遷移年份段落', url: 'https://www.mitsuipr.com/history/columns/010/', scope: '企業自身沿革：1673 年本町創業、1683 年移到駿河町；不代表現存建築未變' },
  yoshiwaraLocal: { institution: '台東區立中央圖書館', title: '吉原を知る', record: '2024 年改訂第 4 版，第 1 頁', url: 'https://www.city.taito.lg.jp/library/service/sonota/pathfinder.files/kyodo_no5_yoshiwara4.pdf', scope: '地方史資料指南轉引地名辭典；區分遷移、戰後制度與 1958 年沿革' },
} as const;

export type ObservationSourceId = keyof typeof observationSources;
export type Evidence = { kind: '館藏解讀' | '歷史背景' | '策展說明'; text: string; sources: ObservationSourceId[] };
export type ObservationQuestion = {
  id: string; artworkId: string; title: string; theme: string;
  prompt: string; choices: string[]; answer: number; hint: string;
  phase: '觀察' | '理解' | '反思' | '延伸';
  feedback: string[];
  readingArtworkIds?: string[];
  compareArtworkId?: string;
  focuses?: { label: string; x: number; y: number; scale: number }[];
  focus: { x: number; y: number; scale: number };
  observation: string; evidence: Evidence[]; takeaway: string; reflection: string;
};

export const observationQuestions: ObservationQuestion[] = [
  {
    id: "bridge-frame", artworkId: "A01", title: "橋樑如何切分風景", theme: "構圖", phase: "觀察",
    prompt: "近處的斜木交叉成 X 形。若改站在橋面上看河景，哪一種構圖效果會消失？",
    choices: ["河岸建築向遠處縮小的層次","從橋下木架的空隙看見月亮與河景","河面遊船與遠岸彼此相隔的距離"], answer: 1,
    feedback: ["遠近層次在橋上也看得到。請找出只有站在橋下才會擋住視線的東西。","","船與岸的距離仍在；想想移到橋面後，眼前會少掉哪一層遮擋。"],
    hint: "看全圖，再讀作品頁的畫面觀察。注意斜木在觀眾與遠景之間的位置。", focus: {"x":0.5,"y":0.5,"scale":1.5},
    observation: "粗大的木架遮在近處，月亮、雲帶與河水分別從空隙露出。",
    evidence: [{"kind":"館藏解讀","text":"The Met 說明，交叉橋基疊在滿月與曲折雲帶前方，呼應乘船從橋下觀看的經驗。移到橋面上，仍能看河景，卻失去了這一層遮擋。","sources":["bridge"]}],
    takeaway: "觀看位置改變，橋就會從遠景中的地標變成眼前切分風景的木架。", reflection: "選一個木架間的空隙：它像一張怎樣的小風景？",
  },
  {
    id: "bridge-boating", artworkId: "A01", title: "同一艘遊船上的兩種經驗", theme: "城市生活", phase: "理解",
    prompt: "作品頁介紹屋形船的遊賞，也提到船夫。若替這趟遊河寫兩段導覽，最適合採用哪一組視角？",
    choices: ["乘客觀看橋景，船夫維持船的移動","乘客在船上用餐，船夫則等靠岸才開始工作","乘客把船當作渡河工具，船夫負責儘快送達對岸"], answer: 0,
    feedback: ["","乘客正在遊賞時，船也在行進。船夫的工作是否要等靠岸後才開始？","渡河和遊河都會搭船；本頁的屋形船被介紹成哪一種活動？"],
    hint: "在「當時的人們在做什麼？」找出乘客和船夫各自在做的事，再看船的位置。", focus: {"x":0.5,"y":0.72,"scale":1.6},
    observation: "有屋頂的船行經橋下；橋的巨大木架與船上的活動同時出現在畫裡。",
    evidence: [{"kind":"館藏解讀","text":"The Met 將屋形船連到江戶中產階層的遊河生活。作品頁進一步把乘客的觀看與船夫的工作並讀：同一段遊河經驗，需要不同的人一起完成。後一層比較是本展的策展觀點。","sources":["bridge"]}],
    takeaway: "一幅遊賞風景，也包含維持遊賞所需的工作。", reflection: "如果改由船夫介紹這幅畫，你會先問他哪一件事？",
  },
  {
    id: "manpachi-cartouche", artworkId: "A02", title: "扇形題籤也在說故事", theme: "圖文關係", phase: "觀察",
    prompt: "右上角的扇形題籤和下方河岸景色一起出現。依作品介紹，這段文字如何參與介紹萬八？",
    choices: ["列出料理次序，補充畫中沒有出現的菜色","記錄到店路線，讓觀眾沿河辨認轉彎處","用呼應場所的雙關短詩，與景色互相搭配"], answer: 2,
    feedback: ["題籤確實能補充景物，但館方如何介紹它的文體？先回看「短詩」那一句。","水路與場所相關，題籤的內容卻需要另看文字說明；它是怎樣的一段文字？",""],
    hint: "先找扇形題籤，再看作品頁「畫面中可以觀察到什麼？」對短詩的說明。", focus: {"x":0.76,"y":0.2,"scale":2},
    observation: "扇形題籤占據右上方，文字與料亭、人物、水面共同出現在橫幅中。",
    evidence: [{"kind":"館藏解讀","text":"The Met 指出，《江戶高名會亭盡》用扇形題籤中的雙關短詩呼應各個場所。這裡的文字參與了名店的介紹；本展沒有另行翻譯詩句或把它當成菜單。","sources":["manpachi"]}],
    takeaway: "看名所圖時，也可以留意畫中的文字如何介紹場所。", reflection: "如果裁掉題籤，剩下的景色還能用哪些細節介紹這家店？",
  },
  {
    id: "manpachi-series", artworkId: "A02", title: "面向河面的料亭", theme: "餐飲與城市", phase: "理解",
    prompt: "面向河水的座敷與室內外人物，如何和柳橋的城市背景一起讀？",
    choices: ["待客活動接上船宿與水路往來","宴席自成一處，和沿岸往來分開","河岸供人觀景，與餐飲服務各自運作"], answer: 0,
    feedback: ["","看看人物的往來，再讀柳橋船宿的介紹。宴席與沿岸活動是彼此分開，還是有所接續？","景色也是待客的一部分。回讀作品頁，柳橋的交通與料亭之間有哪些連結？"],
    hint: "讀「畫面中的城市空間」與「當時的人們在做什麼？」。從座敷向外看，店裡的活動如何和河岸接上？", focus: {"x":0.5,"y":0.55,"scale":1.4},
    observation: "料亭建築面向水面，人物在室內外活動；河岸並非被排除在店外的背景。",
    evidence: [{"kind":"歷史背景","text":"The Met 介紹本系列的餐飲場所主題，台東區地方史另記載柳橋的河口與船宿。本展把這兩項資料與畫面合讀，提出待客活動和水路往來的關係；這層連結是策展推論，不是已查明每位人物的職業。","sources":["manpachi","yanagibashiLocal"]}],
    takeaway: "一間面向河面的料亭，可以把用餐、待客與城市交通連在一起。", reflection: "若把河面裁掉，只看建築，你對這家店與城市的關係會少理解哪一點？",
  },
  {
    id: "fireworks-viewers", artworkId: "A03", title: "同一場煙火，幾種看法", theme: "城市生活", phase: "觀察",
    prompt: "先看橋，再看橋下的船。哪一種描述最能呈現畫中的觀賞位置？",
    choices: ["橋上人群連成一線，河面遊船則散布在不同位置","觀眾沿兩岸排開，河中央留給煙火船航行","遊船靠著橋下聚集，觀眾的視線與橋面齊平"], answer: 0,
    feedback: ["","河中央真的空了出來嗎？把視線移到橋的下方，找一找船的分布。","注意橋面與水面的高度差，再看看船是否只停在橋下。"],
    hint: "用全圖比較橋面與河面，再看作品頁介紹的橋、河岸、茶屋與租船等位置。", focus: {"x":0.49,"y":0.84,"scale":3},
    observation: "橋上是密集的小人影，橋下的船散布在水面，觀看高度也不同。",
    evidence: [{"kind":"館藏解讀","text":"Cleveland 館藏解說列出橋上、沿岸、茶屋與租用遊船等觀賞位置。畫中最容易對照的是橋面與河面的疏密、高低差別；不必先替微小人物指定身分，也能理解這些看台。","sources":["fireworks"]}],
    takeaway: "煙火把橋、河岸與水面都變成了觀看的場所。", reflection: "在橋上和船上看同一場煙火，你想比較哪一種視野差別？",
  },
  {
    id: "fireworks-business", artworkId: "A03", title: "煙火背後的商業網絡", theme: "歷史背景", phase: "理解",
    prompt: "作品頁提到沿河商家贊助煙火。把這項背景與船、人群一起看，哪組關係最貼近這場夜間活動？",
    choices: ["商家出資，船夫與茶屋等散場後才開始服務","商家出資吸引人群，船夫與茶屋在遊賞中提供服務","商家供應餐飲，觀眾則自己安排航行與觀看"], answer: 1,
    feedback: ["想一想，觀眾正在船上遊賞時，誰讓船持續移動？服務是否要等散場才發生？","","畫中的遊船需要怎樣的工作才能行進？再讀作品頁對船夫的介紹。"],
    hint: "回看「畫面中的城市空間」的贊助背景，再讀「當時的人們在做什麼？」的工作分工。", focus: {"x":0.5,"y":0.67,"scale":1.5},
    observation: "抬頭看是煙火，往下看則是橋、船與密集人群，娛樂和服務在同一張圖裡。",
    evidence: [{"kind":"館藏解讀","text":"Cleveland 指出，1850 年代沿河餐館與商家常贊助煙火，吸引觀眾聚集。作品頁把這項背景與船夫載客、茶屋待客並讀，呈現遊賞所需的資金與工作。","sources":["fireworks"]}],
    takeaway: "一場煙火需要有人出資，也需要有人在觀眾遊賞時工作。", reflection: "如果只追著煙火看，你最容易略過哪一種工作？",
  },
  {
    id: "fireworks-sky", artworkId: "A03", title: "裁去夜空會改變什麼", theme: "構圖", phase: "反思",
    prompt: "若保留煙火、橋與船，卻裁掉它們周圍大半的暗色天空，觀看感受會如何改變？",
    choices: ["橋與船的距離感增強，夜空更顯開闊","人群成為遠景，煙火退到畫面之外","煙火周圍的空間縮小，上下的疏密對比減弱"], answer: 2,
    feedback: ["把畫框往內收時，留下的是更寬還是更窄的天空？可先用手遮住螢幕邊緣試看。","題目保留了煙火與人群。試著比較它們周圍空間的多寡，而非景物是否消失。",""],
    hint: "用全圖看夜空占了多少，再想像把畫框往煙火周圍收緊。作品頁也說明這片暗部的比例。", focus: {"x":0.5,"y":0.3,"scale":1.5},
    observation: "細長軌跡與右上方的煙火周圍留有大片深色天空，下方則是密集的船與人。",
    evidence: [{"kind":"館藏解讀","text":"Cleveland 解說指出，夜空占了將近一半構圖。本展由此比較上方留空與下方密集活動的關係：裁圖即使沒有刪掉主要景物，也會改變觀看時的比例與空間感。","sources":["fireworks"]}],
    takeaway: "夜空看似沒有多少景物，卻影響了煙火的高遠感。", reflection: "留白與暗部之中，你的目光會停在哪裡？",
  },
  {
    id: "cherry-staging", artworkId: "A04", title: "被安排出來的春天", theme: "歷史背景", phase: "觀察",
    prompt: "兩側的櫻樹與燈籠沿街排列。結合作品頁的季節背景，這個街景是怎樣形成的？",
    choices: ["田野原有的櫻林，隨街屋擴建而留下","配合賞花季暫植櫻樹，形成節令街景","庭園中的花木，專供各家住戶日常觀賞"], answer: 1,
    feedback: ["畫面像一條花街，但樹木的來歷需要背景資料。請找作品頁的「暫時移植」。","","想想花木朝向的是各家的庭院，還是人群往來的街道，再對照賞花背景。"],
    hint: "先看櫻樹與建築的排列，再讀「畫面中的城市空間」對陰曆三月的說明。", focus: {"x":0.5,"y":0.5,"scale":1.4},
    observation: "櫻樹、燈籠和兩側建築排列在街上，賞花的人群從花下經過。",
    evidence: [{"kind":"歷史背景","text":"東京藝術大學美術館介紹，仲之町在陰曆三月暫時移植數百株櫻樹。這是理解本圖的季節背景，讓街上的花木可以放回賞櫻活動中閱讀；並非本圖逐株樹木的紀錄。","sources":["yoshiwara"]}],
    takeaway: "畫中繁花與街道的關係，也包含季節活動的安排。", reflection: "如果沒有櫻樹與燈籠，這條街會帶給你怎樣的第一印象？",
  },
  {
    id: "cherry-social-context", artworkId: "A04", title: "看花的人，待客的人", theme: "社會史", phase: "理解",
    prompt: "讀過作品頁的遊女處境，再看花下往來的人群，哪一組差別最值得放進賞櫻導覽？",
    choices: ["靠近花木的人看景，靠近建築的人與賞花無關","街上的人正在休息，室內的人才算工作","訪客為遊賞而來，遊女的待客受債務服役條件拘束"], answer: 2,
    feedback: ["在花下也可能待客，站的位置不足以區分工作與遊賞。再讀遊女的服役背景。","工作也會發生在街上。試著把地點的區分，換成訪客與待客者處境的比較。",""],
    hint: "不要單靠人物站的位置分類。作品頁「當時的人們在做什麼？」提供了哪些畫面外的勞動背景？", focus: {"x":0.5,"y":0.65,"scale":1.3},
    observation: "花與人群呈現熱鬧的街景，勞動條件卻不會像櫻樹一樣直接出現在畫面上。",
    evidence: [{"kind":"歷史背景","text":"東京藝術大學美術館一面介紹吉原的節令活動，一面指出遊女因債務受役、無法依自己的意願離開。這項背景讓本展區分遊客的賞花與工作者的待客經驗，而不是按人物在街上或屋內替他們分類。","sources":["yoshiwara"]}],
    takeaway: "同一場賞花活動，對訪客與遊女有不同的意義。", reflection: "如果選一個細節寫展標，你會如何保留賞花的景象，也讓觀眾注意到待客的工作？",
  },
  {
    id: "moon-objects", artworkId: "A05", title: "宴席留下了什麼", theme: "物件敘事", phase: "觀察",
    prompt: "看座敷留下的器物，再讀作品介紹：東京國立博物館將這個房間解讀為哪個階段？",
    choices: ["宴飲已經進行過，器物尚留在席間","開席前剛備妥餐具，正等候客人入座","平日收存器物時，將餐具集中分類"], answer: 0,
    feedback: ["","備席與散席都會出現餐具；請比較物件是整齊就位，還是散置在使用過的空間裡。","看看器物是否集中在收納處，再讀館方如何理解它們的位置。"],
    hint: "放大榻榻米上的器物，再讀作品頁所列的東京國立博物館解讀；另一份展覽文章有不同的活動階段解讀。", focus: {"x":0.67,"y":0.53,"scale":2.5},
    observation: "榻榻米上可見托盤、杯碟等器物，人物只以局部與影子出現。",
    evidence: [{"kind":"館藏解讀","text":"東京國立博物館對同構圖印本的解說，將未收拾的房間讀作月見宴之後。本題問的是這份解說；Zimmerli 的署名展覽文章則把場景讀成月見會中的歌舞，兩者對活動階段有不同理解，不能把宴後當成圖像唯一可證的時刻。","sources":["moonHeritage","moonRutgers"]}],
    takeaway: "器物能提示活動，但宴席處於哪個階段，仍要區分不同解說的判讀。", reflection: "如果托盤與杯碟都被收走，你對這個空間曾發生什麼事的理解，會有什麼改變？",
  },
  {
    id: "moon-offscreen", artworkId: "A05", title: "畫邊與障子後的人", theme: "間接線索", phase: "理解",
    prompt: "左側障子的人影、前景局部露出的三味線，與座敷留下的器物有什麼關係？",
    choices: ["人影是賞景的主角，樂器則是房間的陳設","餐具與樂器為開席準備，人影提示客人即將入座","人影與樂器承接宴飲痕跡，把活動延伸到畫邊"], answer: 2,
    feedback: ["人影確實引人注意；再看完整座敷，並讀館方對樂器的解讀。把它當成陳設會忽略什麼？","備席與散席都會有器物。請把三味線和散置的餐具合讀，再核對館方對活動階段的解釋。",""],
    hint: "分別切換「左側人影」與「前景樂器」，再讀作品頁。人物是否需要完整出現，活動才會被察覺？", focus: {"x":0.12,"y":0.31,"scale":2.4},
    focuses: [{"label":"左側人影","x":0.12,"y":0.31,"scale":2.4},{"label":"前景樂器","x":0.58,"y":0.84,"scale":2.4}],
    observation: "人影落在左側障子上，前景樂器露出局部，右側還有人物衣裾與腳部。視線仍能穿過座敷看向海灣。",
    evidence: [{"kind":"策展說明","text":"東京國立博物館解讀障子上的人物影子，Zimmerli 的展覽文章則指出三味線。兩份解說對活動階段有差異。本題比較的是局部與影子如何讓人察覺活動，不要求據此判定演奏已結束，也不推定畫家的主觀意圖。","sources":["moonHeritage","moonRutgers"]}],
    takeaway: "人的存在也可以由影子、局部樂器與用過的空間呈現。", reflection: "如果把人影與三味線都移到畫面正中央，座敷與海灣還會同樣引人注意嗎？",
  },
  {
    id: "ferry-workers", artworkId: "A06", title: "靠近船頭，望向對岸", theme: "觀看位置", phase: "觀察",
    prompt: "船頭人物貼近左側畫邊，河水延伸到對岸。這樣的安排讓觀眾從哪裡接近這段渡河場景？",
    choices: ["從對岸遠望，把渡船看成河面上的小點","靠近船頭人物，再沿水面望向遠岸","從橋上向下看，把船與兩岸收在腳下"], answer: 1,
    feedback: ["看看船頭人物的比例：它們像是遠岸上的小點，還是就在觀眾身旁？","","畫裡沒有俯視橋面的視野。比較船頭人物、右側樹木與遠岸的高度和大小。"],
    hint: "先看完整作品，再放大左側人物。比較近處人物與對岸樹影的大小；作品頁也介紹渡河的活動。", focus: {"x":0.17,"y":0.59,"scale":2.6},
    observation: "左側船頭與人物被畫邊截住，對岸則縮成較遠的岸線；右側樹木也貼近觀眾。",
    evidence: [{"kind":"館藏解讀","text":"本題的遠近比較來自畫面。The Met 的人物解讀補充：這趟渡河中有前往工作的夜鷹。先接近乘客，再讀她們的行程，可以從風景轉向使用水路的人。","sources":["ferry"]}],
    takeaway: "渡河者不只是遠景中的點綴；近處人物能成為閱讀河景的起點。", reflection: "如果把左側船頭與人物裁掉，這張河景會少掉怎樣的觀看位置？",
  },
  {
    id: "ferry-multiple-uses", artworkId: "A06", title: "從煙火遊船到渡河上工", theme: "跨作品比較", phase: "理解",
    prompt: "比較《御廄河岸》與《兩國花火》及兩頁人物介紹，哪一段最適合把這兩張河景連起來？",
    choices: ["遊船載人看煙火，渡船也載著前往工作的人","遊船上的人在消費，渡船上的人則已結束一天的工作","熱鬧河段供人遊賞，安靜河段便與娛樂服務無關"], answer: 0,
    feedback: ["","「下班」與「上工」是不同的行程。請核對 The Met 在作品頁如何介紹渡船乘客。","安靜的畫面也可能包含工作與交通。回到人物行程，再想這條河如何連接娛樂場所。"],
    hint: "切換比較作品，讀兩頁「當時的人們在做什麼？」。分別找出看煙火的人、載客的人與前往工作的人。", focus: {"x":0.5,"y":0.6,"scale":1},
    readingArtworkIds: ["A06","A03"],
    compareArtworkId: "A03",
    observation: "《兩國花火》的橋與船較密集；《御廄河岸》讓近處船頭與大片水面形成另一種河景。",
    evidence: [{"kind":"館藏解讀","text":"Cleveland 介紹遊船上的煙火觀眾，The Met 則將《御廄河岸》的部分乘客解讀為前往工作的夜鷹。兩幅作品也都涉及載客工作。本展以此比較乘船目的，而不把熱鬧與安靜直接對應成遊樂與休息。","sources":["ferry","fireworks"]}],
    takeaway: "同一條河連著遊賞與工作；看似相近的夜間移動，目的可以不同。", reflection: "若把兩幅畫並排，你會替它們寫什麼共同展標？",
  },
  {
    id: "asakusa-viewpoint", artworkId: "A07", title: "先看見貓，還是先看見人群", theme: "視點", phase: "觀察",
    prompt: "貓、窗框與田間人潮的大小和位置，讓我們從哪裡觀看酉之町祭的周邊？",
    choices: ["站在田間路上，回望窗邊休息的貓","從樓上室內往外看，隔著窗框望向田間","從神社院內向外看，人潮正迎面而來"], answer: 1,
    feedback: ["如果站在田間，貓與窗框還會這麼接近嗎？先確認近景位於窗的哪一側。","","題名提到祭典，但視線先穿過了什麼？用貓和窗框找出觀眾的位置。"],
    hint: "用全圖比較窗框、貓與遠處人影。作品頁的畫面觀察也交代了房間的位置。", focus: {"x":0.34,"y":0.6,"scale":3.2},
    observation: "貓與窗框占據近景，田野、人群和富士山隔著窗戶出現在遠處。",
    evidence: [{"kind":"館藏解讀","text":"The Met 將觀看位置介紹為淺草田圃附近妓樓的二樓房間。題名雖談參拜，畫面卻先給了觀眾一個室內的位置，再讓我們望向遠方的參拜活動。","sources":["asakusa"]}],
    takeaway: "作品從室內看祭典周邊，與站在人潮之中有不同的觀看距離。", reflection: "在這個位置，哪些活動看得清楚，哪些只能遠遠察覺？",
  },
  {
    id: "asakusa-pilgrims", artworkId: "A07", title: "遠處人潮與近處飾物", theme: "宗教與移動", phase: "理解",
    prompt: "田間人潮與左下髮簪相距很遠，哪一項背景能把兩處細節連起來？",
    choices: ["人群前往花市，室內飾物配合賞花打扮","人群前往劇場，室內飾物呼應演出道具","人群前往酉之町祭，熊手形髮簪呼應招福熊手"], answer: 2,
    feedback: ["留意髮簪的形狀，再回看祭典攤販出售的物品；這裡的重點不是花。","遠方人群的目的地要由作品介紹補充。看看本圖的祭典與劇場街有什麼不同。",""],
    hint: "在兩個細節間切換，再讀作品頁的祭典介紹。熊手是什麼形狀的招福物？", focus: {"x":0.73,"y":0.47,"scale":3},
    focuses: [{"label":"田間人潮","x":0.73,"y":0.47,"scale":3},{"label":"熊手形髮簪","x":0.18,"y":0.88,"scale":3.2}],
    observation: "細小人影沿田間路徑移動；近處的髮簪則做成與熊手相似的形狀。",
    evidence: [{"kind":"館藏解讀","text":"The Met 介紹，人群前往鷲神社參加酉之町祭，攤販出售招福熊手等物品，也指出房間左下角的熊手形髮簪。兩組線索讓室內與戶外祭典產生呼應。","sources":["asakusa"]}],
    takeaway: "祭典可以由遠方的人潮與近處的小物件共同呈現。", reflection: "如果只能保留其中一處細節，你會失去對祭典哪一面的理解？",
  },
  {
    id: "asakusa-hairpins", artworkId: "A07", title: "祭典如何來到房間裡", theme: "證據與推論", phase: "理解",
    prompt: "依作品頁保留的館方推測，熊手形髮簪如何可能把戶外祭典帶進這個房間？",
    choices: ["男客把祭典買來的飾物，當作禮物帶給遊女","房間主人穿戴祭典服飾，準備出門參加遊行","店家在室內整理飾物，準備帶到神社販售"], answer: 0,
    feedback: ["","準備出門是一種想像，但不是這頁引用的館方解讀。請找出誰可能購買、誰可能收到髮簪。","畫面留有飾物，但沒有攤販陳列的場景。回看館方提出的送禮情境。"],
    hint: "讀「當時的人們在做什麼？」。館方提出的是一種送禮情境；不用假設房間主人曾經出門。", focus: {"x":0.18,"y":0.88,"scale":3.2},
    observation: "髮簪留在房間一角，畫面沒有直接畫出買賣或送禮的過程。",
    evidence: [{"kind":"館藏解讀","text":"The Met 推測，髮簪可能是男客從祭典買給遊女的小禮物。本展保留「可能」：這是物品如何進入房間的一種解讀，並不是畫面已經呈現了一場送禮。","sources":["asakusa"]}],
    takeaway: "物品可能隨著人的往來，把房間與外面的活動連起來。", reflection: "除了人物，哪些物品也能讓我們察覺室內與城市的往來？",
  },
  {
    id: "asakusa-time", artworkId: "A07", title: "把室內裁掉之後", theme: "構圖", phase: "反思",
    prompt: "若只留下窗外田野與人群，把貓、窗框和髮簪都裁去，這幅畫會少掉哪一層觀看經驗？",
    choices: ["跟著田間人群，近距離走進祭典隊伍","從有人生活的室內，隔窗觀看遠方活動","從田野回望窗邊，把祭典人潮放在身後"], answer: 1,
    feedback: ["原圖的人群在遠處，觀眾並沒有走進隊伍。請找出近景原先為觀看安排的位置。","","先看貓、窗框和髮簪位於視線的哪一側；我們是從田野回望房間，還是從房間往外看？"],
    hint: "回到全圖，想想近景物件讓你站在哪裡。可合讀作品頁的畫面觀察與人物介紹。", focus: {"x":0.5,"y":0.64,"scale":1},
    observation: "窗框把內外分開；貓和小物件使近景像一個有人使用、此刻卻不見完整人物的房間。",
    evidence: [{"kind":"館藏解讀","text":"作品頁依 The Met 交代二樓房間、貓與髮簪。裁去這些近景後，田間參拜活動仍在，觀眾卻失去了從特定室內望出去的位置。這是本展依構圖提出的比較，不推定畫家刻意代替某人發言。","sources":["asakusa"]}],
    takeaway: "近景中的日常物件，會改變我們接近一場城市活動的方式。", reflection: "若用這個房間的視角寫一句展標，你會怎麼介紹窗外的人潮？",
  },
  {
    id: "dawn-departure", artworkId: "A08", title: "夜櫻之後，再看黎明", theme: "跨作品比較", phase: "觀察",
    prompt: "把《廓中東雲》與《吉原夜櫻之圖》並排，再讀人物介紹，哪種比較最貼近兩幅作品？",
    choices: ["夜櫻街道較空，黎明則以密集的人群迎接活動","兩幅都以滿街人群為重點，差別主要在天色","夜櫻圖聚集花下人群，黎明圖的街道只有幾組人物"], answer: 2,
    feedback: ["先比較兩幅街上人物的數量與分布，看看哪一幅較密集。","天色有差，人物的聚散也有差。再讀黎明圖如何介紹街上人物。",""],
    hint: "先比較人物的疏密，再讀《廓中東雲》的畫面觀察。這是兩幅不同作品的比較，不是同一夜的前後紀錄。", focus: {"x":0.36,"y":0.69,"scale":2},
    readingArtworkIds: ["A08","A04"],
    compareArtworkId: "A04",
    observation: "黎明街巷只見幾組人物；夜櫻圖的人群、花木與燈籠集中在街道兩側。",
    evidence: [{"kind":"策展說明","text":"The Met 的題名指向吉原入口的黎明。本展比較兩件實際圖像的人物疏密，不再以本次無法讀取的 Ashmolean 頁面指定人物為太夫。兩圖的年代與構圖各自獨立，不能拼成同一夜的前後紀錄。","sources":["dawnImage","cherryImage"]}],
    takeaway: "由密集人群轉向疏落街景，吉原的形象也跟著改變。", reflection: "在人少下來的街上，你會比賞花時更注意到什麼？",
  },
  {
    id: "dawn-freedom", artworkId: "A08", title: "誰的一夜結束了", theme: "展覽收束", phase: "反思",
    prompt: "若用《廓中東雲》作為夜間導覽的結尾，結合作品頁對遊客與遊女的介紹，哪一句最適合接續這幅街景？",
    choices: ["黎明讓導覽回到客人的返程，待客者留在賞花段落","客人的遊興告一段落，待客者仍面對各自的勞動處境","街面回到安靜，遊賞與待客便可用相同方式收束"], answer: 1,
    feedback: ["返程值得看，但為何只在賞花時介紹待客者？回讀人物段落，想想結尾還能留下誰的處境。","","安靜是畫面的感受。再回讀人物介紹，遊賞結束與勞動條件的改變是否相同？"],
    hint: "讀「當時的人們在做什麼？」。散場對訪客與工作者，是否是同一件事？", focus: {"x":0.5,"y":0.5,"scale":1},
    observation: "黎明街景的人影較少，畫面沒有交代每一種工作的後續。",
    evidence: [{"kind":"策展說明","text":"The Met 的題名交代黎明；東京藝術大學美術館另說明債務服役背景。本展由此提出導覽結尾的觀點：遊賞的收束不代表勞動條件改變。這是有制度背景支持的策展比較，不是對畫中個別人物行程與契約的認定。","sources":["dawnImage","yoshiwara"]}],
    takeaway: "天亮可以結束一段遊賞，卻不會抹平遊客與工作者的處境差別。", reflection: "回想看過的作品：誰的工作最容易被夜景的美感蓋過？你會把哪一幅再看一次？",
  },
  {
    id: "saruwaka-perspective", artworkId: "B01", title: "通向遠方的劇場街", theme: "構圖", phase: "觀察",
    prompt: "兩側屋簷與街道向遠處縮小。這種安排最適合讓觀眾看見劇場街的哪個特徵？",
    choices: ["劇場各自朝向不同巷道，彼此的往來不明顯","單座劇場的正面，比整條街的排列更突出","劇場沿著同一條街並列，街道向深處延伸"], answer: 2,
    feedback: ["先沿街道把視線往後移，看看建築是被分開的小巷隔斷，還是接在同一條路上。","看看屋簷與路面的線條朝哪裡延伸，再比較近處與遠處建築的大小。",""],
    hint: "沿兩側建築的線條往遠處看，再讀作品頁的街區介紹。", focus: {"x":0.5,"y":0.54,"scale":1.5},
    observation: "近處建築較大，屋簷與路面向遠方收攏，形成明顯的街道縱深。",
    evidence: [{"kind":"館藏解讀","text":"慶應圖書館解說，作品運用遠近法呈現三座劇場沿同一條街並列的景象，也交代天保改革時強制遷置的背景。畫面中的集中街景，可以連到城市管制的歷史。","sources":["saruwaka"]}],
    takeaway: "遠近法讓整條劇場街的排列成為可觀看的景象。", reflection: "如果改成正面畫一座劇場，會少掉對街區哪一部分的認識？",
  },
  {
    id: "saruwaka-shadows", artworkId: "B01", title: "從腳下辨認月光", theme: "光與影", phase: "理解",
    prompt: "滿月之外，人物腳下清楚的影子，為街景補上了哪一種夜間感受？",
    choices: ["月光落到地面，人物與街面的明暗關係變得鮮明","街上人數增加，散戲人潮顯得更加擁擠","道路鋪設出深淺相間的圖案，標出各家劇場的範圍"], answer: 0,
    feedback: ["","影子會重複人物的形狀，但不等於多了一個人。請找每個暗色輪廓與人物的連接處。","看暗色形狀是否跟著人物，而非建築邊界排列，再回讀月光的說明。"],
    hint: "把人物和腳下的影子成對看，再讀作品頁的畫面觀察。影子和天空中的光源如何呼應？", focus: {"x":0.5,"y":0.78,"scale":2},
    observation: "地上的暗色輪廓緊接人物，滿月則出現在街道上方。",
    evidence: [{"kind":"館藏解讀","text":"慶應圖書館將滿月與看戲歸來的人腳下的鮮明影子連讀。本展據此觀察：夜晚的光線既在天空，也透過地面與人物的明暗關係表現。","sources":["saruwaka"]}],
    takeaway: "月夜不只靠畫一輪月亮，也靠地面上的影子來呈現。", reflection: "把月亮遮住，只看街面，你還會怎麼描述光線？",
  },
  {
    id: "saruwaka-grain", artworkId: "B01", title: "木紋也參與了夜空的表現", theme: "版畫技法", phase: "理解",
    prompt: "作品頁說夜空刻意保留了版木木紋。看到空中的細紋時，哪種看法能把這項資料用進來？",
    choices: ["把細紋讀成薄雲，主要從當日天氣理解夜色","把木版留下的紋理，也當成夜空的視覺效果","把細紋讀成紙張老化，與原來的印製效果分開"], answer: 1,
    feedback: ["雲是可能的第一印象，但題目提供了版木的背景；請把材料也納入觀看。","","先區分紙張留下的痕跡，與館方所說「刻意保留」的版木效果。"],
    hint: "縮圖不一定能看清木紋；可直接讀作品頁「畫面中可以觀察到什麼？」的材料說明。", focus: {"x":0.48,"y":0.2,"scale":2.2},
    observation: "夜空的色面也有紋理；不同印本和數位影像中，細紋的清楚程度不盡相同。",
    evidence: [{"kind":"館藏解讀","text":"慶應圖書館指出，夜空刻意留有版木的木紋。這項解說來自另一印本，不能要求本頁較小圖像呈現相同清晰度；它提示我們也從材料和印製理解夜色。","sources":["saruwaka"]}],
    takeaway: "夜空的效果還包含印製材料，細紋未必都是景物或老化痕跡。", reflection: "得知木紋來自版木後，你會如何重新描述這片夜空？",
  },
  {
    id: "embankment-contrast", artworkId: "B02", title: "熱鬧的一線，安靜的一片", theme: "構圖與地景", phase: "觀察",
    prompt: "日本堤上的行人、轎子和茶店集中成一條帶，周圍田野卻很空曠。哪一種描述最貼近這種疏密安排？",
    choices: ["熱鬧分布在整片田野，堤道退到畫面之外","堤道與田野各自聚集人群，彼此沒有明顯差別","往來活動沿堤道集中，與周圍開闊的田野形成對照"], answer: 2,
    feedback: ["找找轎子與茶店的位置，活動真的散布到整片田野了嗎？","比較人影密集的位置與田野的空白，兩者的密度是否相同？",""],
    hint: "先用全圖看人的分布，再讀作品頁對堤道目的地與田野的說明。", focus: {"x":0.5,"y":0.58,"scale":1.2},
    observation: "堤道上的活動較密，田野留有較大的空間，兩者形成不同的節奏。",
    evidence: [{"kind":"館藏解讀","text":"台東區立中央圖書館特別指出，繁忙的堤道與安靜田野形成對比。作品頁也介紹日本堤通往吉原；交通集中在一線，並不表示周圍都已成為商街。","sources":["embankment"]}],
    takeaway: "通往遊里的道路，與城邊田野可以同時存在於一張城市風景中。", reflection: "如果把田野裁掉，只看堤道，這條路還會同樣醒目嗎？",
  },
  {
    id: "embankment-route", artworkId: "B02", title: "目的地之前的一段城市", theme: "交通與消費", phase: "理解",
    prompt: "作品頁介紹步行、乘轎和引手茶屋。若從訪客的行程來看，這條路上的服務如何接續？",
    choices: ["轎子接續路程，茶屋還可在抵達前安排遊郭接待","轎子載客抵達，茶屋以售賣旅途用品為主要工作","轎子往來茶屋之間，訪客在堤上就完成遊郭行程"], answer: 0,
    feedback: ["","旅途用品不是這頁介紹的重點。再找「預先安排」後面接的是哪種服務。","堤道是接近吉原的一段路。茶屋能協助安排，但它與最後的目的地有何差別？"],
    hint: "讀「當時的人們在做什麼？」。引手茶屋除了歇腳飲茶，還能在旅程中做什麼？", focus: {"x":0.5,"y":0.65,"scale":1.5},
    observation: "行人、轎子與店舖讓堤道成為發生活動的地方，而非通往吉原的一條空線。",
    evidence: [{"kind":"館藏解讀","text":"Fitzwilliam 介紹步行、乘轎與沿途引手茶屋的安排接待功能，台東圖書館則描述堤上的往來。本展把兩項背景並讀，讓交通和待客服務接在同一段行程上。","sources":["embankmentRoute","embankment"]}],
    takeaway: "遊賞還沒抵達目的地，交通與接待工作便已開始。", reflection: "只介紹目的地、略去這段路，會漏掉哪些工作者？",
  },
  {
    id: "suruga-clouds", artworkId: "B03", title: "雲帶如何分隔街景與富士山", theme: "構圖", phase: "觀察",
    prompt: "雲帶橫在富士山與商街之間，形狀卻不規則。它在這幅畫裡形成怎樣的觀看層次？",
    choices: ["把街道兩側連成平直的對稱邊界","分開遠山與街市，也鬆動兩側建築的對稱","把山腳建築放大，讓遠山成為街道的近景"], answer: 1,
    feedback: ["觀察雲帶的邊緣：它是筆直的嗎？再比較建築兩側的整齊排列。","","看看山與人物的比例。雲帶讓遠近分層，還是把山腳拉近了？"],
    hint: "先比較街道兩側，再看雲帶邊緣；作品頁的畫面觀察與人物段落介紹了分景手法。", focus: {"x":0.5,"y":0.39,"scale":1.4},
    observation: "街道接近對稱，雲帶邊緣卻起伏不齊；富士山在上，城市往來在下。",
    evidence: [{"kind":"館藏解讀","text":"Brooklyn Museum 將雲帶介紹為傳統分景手法，並指出它柔化街景的對稱。本展據此比較上方山景與下方商街的安排，而不是把雲當成氣象紀錄。","sources":["suruga"]}],
    takeaway: "白天的序章也能練習讀構圖：遠山、雲與街市各有位置。", reflection: "先看山，再看商店，你的目光如何穿過雲帶？",
  },
  {
    id: "suruga-brand", artworkId: "B03", title: "延伸探究：由布簾找回店名", theme: "商業與圖像", phase: "延伸",
    prompt: "由布簾辨認越後屋，再讀現代地點對照，哪種追查方式能分開商家沿革與建築的問題？",
    choices: ["追查越後屋與三越的關係，另找建築是否留存的證據","先以今日店名對應原店面，再由富士山定位建築","沿著延續的商標，整理同一棟店面的保存沿革"], answer: 0,
    feedback: ["","店名、遠山和建築位置提供不同線索；館方的商標辨認，是否已經核實了今日店面的精確位置？","同一商家的後續發展，不等於已確認同一棟建築保存。請分開看本頁給出的沿革與仍待查的問題。"],
    hint: "讀「畫面中可以觀察到什麼？」與「現代地點對照」。辨認商家後，再找哪些事情仍需要建築或地理證據。", focus: {"x":0.25,"y":0.7,"scale":2},
    observation: "布簾上的標誌使商店可以被辨認，遠處仍看得見富士山。",
    evidence: [{"kind":"策展說明","text":"Brooklyn Museum 辨認越後屋標誌並連到後來的三越，三井沿革另提供創業與遷移年份。這些資料可追索商家發展；本題不把商標延續等同原建築留存，也不保證今日能重現畫中視野。","sources":["suruga","mitsuiHistory"]}],
    takeaway: "商標可協助追索商家沿革，建築是否留存則要另外找證據。", reflection: "今天若畫這條街，你會用什麼細節讓後來的人辨認店家？",
  },
];

export const observationArtworkOrder = ['B03', 'A01', 'A02', 'A03', 'A04', 'B02', 'A05', 'B01', 'A06', 'A07', 'A08'];
export type ObservationMode = 'full' | 'random' | 'painting';

export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectObservationSession(mode: ObservationMode, artworkId = 'A03', random: () => number = Math.random): string[] {
  const group = (id: string) => observationQuestions.filter((q) => q.artworkId === id);
  if (mode === 'painting') return group(artworkId).map((q) => q.id);
  if (mode === 'random') return shuffled(observationArtworkOrder.filter((id) => id.startsWith('A')), random).slice(0, 3).flatMap((id) => {
    const questions = group(id);
    // Begin with the introductory question, then sample one deeper question.
    // Keep each painting together so that randomness does not break its context.
    return [questions[0].id, shuffled(questions.slice(1), random)[0].id];
  });
  return observationArtworkOrder.flatMap((id) => group(id).map((q) => q.id));
}
