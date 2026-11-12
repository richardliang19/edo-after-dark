// Primary institutional records consulted on 2026-11-13.
// Texts are concise Chinese paraphrases, not quotations. Other impressions and
// general historical context are identified separately from the displayed image.
export const observationSources = {
  bridge: { institution: 'The Metropolitan Museum of Art', title: 'Twilight Moon at Ryōgoku Bridge', record: 'JP1312', url: 'https://www.metmuseum.org/art/collection/search/45294', scope: '本頁所用印本的館藏解說' },
  manpachi: { institution: 'The Metropolitan Museum of Art', title: 'The Manpachi at Evening in Yanagibashi', record: 'JP1158', url: 'https://www.metmuseum.org/art/collection/search/45306', scope: '本頁所用印本與系列的館藏解說' },
  fireworks: { institution: 'Cleveland Museum of Art', title: 'Fireworks at Ryōgoku', record: '1940.986', url: 'https://www.clevelandart.org/art/1940.986', scope: '同一構圖的另一印本；本頁圖像為 The Met JP642' },
  fireworksImage: { institution: 'The Metropolitan Museum of Art', title: 'Fireworks at Ryōgoku Bridge', record: 'JP642', url: 'https://www.metmuseum.org/art/collection/search/37093', scope: '本頁圖像與作品資料' },
  cherryImage: { institution: 'The Metropolitan Museum of Art', title: 'Yoshiwara Yo Zakura no Zu', record: 'JP608', url: 'https://www.metmuseum.org/art/collection/search/37059', scope: '本頁圖像與作品資料' },
  yoshiwara: { institution: '東京藝術大學大學美術館', title: 'Yoshiwara（2024 年展覽概要）', record: 'Exhibition Outline', url: 'https://museum.geidai.ac.jp/en/exhibit/2024/03/yoshiwara.html', scope: '吉原的歷史背景；非對本頁某一印本的專屬解說' },
  moon: { institution: 'Cornell University · Herbert F. Johnson Museum of Art', title: 'Moon-Viewing Point', record: '56.073 · Label Copy', url: 'https://emuseum.cornell.edu/objects/33493/moonviewing-point-from-the-series-one-hundred-famous-views', scope: '同一構圖的另一印本；本頁圖像為 The Met JP1185' },
  moonImage: { institution: 'The Metropolitan Museum of Art', title: 'Moon-Viewing Location (Tsuki no Misaki)', record: '館藏 55095', url: 'https://www.metmuseum.org/art/collection/search/55095', scope: '本頁圖像與作品資料' },
  ferry: { institution: 'The Metropolitan Museum of Art', title: 'Ommayagashi, Sumida River', record: 'JP1547', url: 'https://www.metmuseum.org/art/collection/search/55712', scope: '本頁所用印本的館藏解說' },
  asakusa: { institution: 'The Metropolitan Museum of Art', title: 'Pilgrimage to the Torinomachi Festival across the Ricefields of Asakusa', record: 'JP60', url: 'https://www.metmuseum.org/art/collection/search/36539', scope: '本頁所用印本的館藏解說' },
  dawn: { institution: 'University of Oxford · Ashmolean Museum', title: 'Dawn Inside the Yoshiwara', record: 'Eastern Art Online · object 21196', url: 'https://jameelcentre.ashmolean.org/collection/921/per_page/-500/offset/0/sort_by/date/start/1800/end/1895/object/21196', scope: '同一構圖的另一印本；本頁圖像為 The Met JP1024' },
  dawnImage: { institution: 'The Metropolitan Museum of Art', title: 'The Entrance to the Yoshiwara at Dawn', record: 'JP1024', url: 'https://www.metmuseum.org/art/collection/search/54931', scope: '本頁圖像、題名與作品資料' },
  saruwaka: { institution: '慶應義塾大學圖書館', title: '名所江戸百景・猿わか町よるの景', record: '200X@5-56 · 日野原健司解說', url: 'https://dcollections.lib.keio.ac.jp/en/ukiyoe/0456', scope: '同一構圖的另一印本；本頁沿用專案的 Wikimedia Commons 圖像' },
  embankment: { institution: '台東區立中央圖書館（NDL Search 收錄）', title: '名所江戸百景・よし原日本堤', record: '「吉原細見の世界Ⅱ」解說', url: 'https://ndlsearch.ndl.go.jp/books/R100000094-I906', scope: '同一構圖的另一印本；本頁沿用 Brooklyn Museum／Wikimedia 圖像' },
  embankmentRoute: { institution: 'University of Cambridge · Fitzwilliam Museum', title: 'Nihon Embankment, Yoshiwara', record: 'P.3577-R · The Night of Longing', url: 'https://nightoflonging.fitzmuseum.cam.ac.uk/explore/sex-for-sale', scope: '同一構圖的另一印本與通往吉原的交通背景' },
  suruga: { institution: 'Brooklyn Museum（Google Arts & Culture 館方供稿）', title: 'Suruga-cho, No. 8 in One Hundred Famous Views of Edo', record: '30.1478.8', url: 'https://artsandculture.google.com/asset/suruga-cho-no-8-in-one-hundred-famous-views-of-edo-utagawa-hiroshige-ando-japanese-1797-1858/KgG9YbG9Rf98Vg', scope: '館方對本構圖的解說；本頁沿用 Wikimedia 所收錄的 Brooklyn 圖像' },
} as const;

export type ObservationSourceId = keyof typeof observationSources;
export type Evidence = { kind: '館藏解讀' | '歷史背景' | '策展說明'; text: string; sources: ObservationSourceId[] };
export type ObservationQuestion = {
  id: string; artworkId: string; title: string; theme: string;
  prompt: string; choices: string[]; answer: number; hint: string;
  focus: { x: number; y: number; scale: number };
  observation: string; evidence: Evidence[]; takeaway: string; reflection: string;
};

export const observationQuestions: ObservationQuestion[] = [
  {
    id: 'bridge-frame', artworkId: 'A01', title: '橋不是背景，而是取景框', theme: '構圖',
    prompt: 'The Met 認為，這幅畫最鮮明的構圖主角是什麼？',
    choices: ['遠處一座完整的山', '近景交叉的橋樑支撐結構', '正面排列的店舖招牌'], answer: 1,
    hint: '先別只找月亮，看看大幅切過畫面的粗大斜線。', focus: { x: .5, y: .5, scale: 1.5 },
    observation: '支撐橋面的斜木形成交叉，月亮、雲與水面透過結構之間的空隙露出。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 特別指出雙重 X 形橋基與滿月、曲折雲帶的疊置。橋的支撐系統因此同時是城市工程與切割風景的視覺結構。', sources: ['bridge'] }],
    takeaway: '近景的橋樑可以主導觀看方式，而不只是標示地點。', reflection: '試著用手遮住斜木：沒有這些線條，畫面的力道會如何改變？',
  },
  {
    id: 'bridge-boating', artworkId: 'A01', title: '從誰的位置看河？', theme: '城市生活',
    prompt: '館方把畫中有頂篷的船，連結到江戶哪一種城市活動？',
    choices: ['中間階層的遊船休閒', '遠洋軍艦操演', '高山採礦運輸'], answer: 0,
    hint: '想想有頂篷、供乘客欣賞河景的屋形船，而不是只看橋上的行人。', focus: { x: .5, y: .72, scale: 1.6 },
    observation: '河面與橋下空間也有船隻活動；同一條河可以從岸上、橋上與水面觀看。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 將屋形船與江戶中間階層的休閒遊船連結，並指出從船上看出去時，橋墩會把風景分成出人意料的形狀。', sources: ['bridge'] }],
    takeaway: '讀風景，也要問觀看風景的人坐在哪裡。', reflection: '如果站到橋上，還能看見同樣巨大的交叉橋基嗎？',
  },
  {
    id: 'manpachi-cartouche', artworkId: 'A02', title: '扇形題籤也在說故事', theme: '圖文關係',
    prompt: '依 The Met 的系列解說，右上角扇形題籤中的文字有什麼作用？',
    choices: ['精確列出所有菜餚價格', '只記錄天文觀測數字', '以帶雙關的短詩呼應場所'], answer: 2,
    hint: '把這些形狀當成圖像的一部分，也把它們當成能閱讀的文字空間。', focus: { x: .76, y: .2, scale: 2 },
    observation: '上方的題籤與下方的城市場景並置；作品不只有景物，還安排了文字。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 說明，此系列在右上扇形題籤中，以帶雙關意味的兩行詩呼應各處場所。此處依館方解說介紹功能，沒有自行翻譯畫中文字。', sources: ['manpachi'] }],
    takeaway: '題籤能把名所圖變成圖像與文字共同運作的作品。', reflection: '如果去掉文字，你對這個場所的認識會少掉什麼？',
  },
  {
    id: 'manpachi-series', artworkId: 'A02', title: '名所，也可以是餐飲場所', theme: '消費空間',
    prompt: '這幅作品所屬系列的主題，依館方介紹應如何理解？',
    choices: ['對江戶知名餐飲場所的描繪', '只記錄戰場的地形', '《名所江戶百景》的第 98 景'], answer: 0,
    hint: '留意館藏題名與系列《江戶高名會亭盡》，不要把所有廣重作品都當成同一系列。', focus: { x: .5, y: .5, scale: 1 },
    observation: '此畫為橫向場景，與本展許多直式《名所江戶百景》作品的格式不同。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 將本系列介紹為江戶知名餐飲場所的巡覽，也提到畫中多樣的城市人物。這提供了從餐飲與社交閱讀風景的入口。', sources: ['manpachi'] }],
    takeaway: '先確認作品的系列，才能理解它為何挑選這種場所。', reflection: '今天的城市導覽若只收錄餐飲場所，會呈現出哪一種城市？',
  },
  {
    id: 'fireworks-viewers', artworkId: 'A03', title: '河面也是觀眾席', theme: '城市生活',
    prompt: '除了橋上，Cleveland 館方還指出觀眾會在哪裡欣賞煙火？',
    choices: ['租用的遊船上', '只有封閉的宮殿裡', '只能在遠方山頂'], answer: 0,
    hint: '看橋下河面上的屋形船。', focus: { x: .49, y: .84, scale: 3 },
    observation: '橋面的人群與河上的船，形成不同高度的觀看位置。',
    evidence: [{ kind: '館藏解讀', text: 'Cleveland 指出，觀眾聚集在橋上、河岸、茶屋與租用的遊船上。遊船把水面也變成了觀賞空間。', sources: ['fireworks'] }],
    takeaway: '同一場景裡，人們未必擁有同樣的觀看位置。', reflection: '橋上的密集人群，和船上較分散的座席，帶來什麼不同感受？',
  },
  {
    id: 'fireworks-business', artworkId: 'A03', title: '煙火背後的商業網絡', theme: '歷史背景',
    prompt: '依 Cleveland 的解說，1850 年代誰常贊助這些煙火活動？',
    choices: ['只有畫家本人', '沿岸餐館與其他商家', '固定由每位船客輪流主持'], answer: 1,
    hint: '把目光從夜空轉到河岸：熱鬧能吸引哪些場所的客人？', focus: { x: .5, y: .67, scale: 1.5 },
    observation: '空中的煙火，與橋、船和河岸的活動被畫在同一個城市場景裡。',
    evidence: [{ kind: '館藏解讀', text: 'Cleveland 的館藏解說將煙火與沿河餐館、商家贊助連結。這使遊賞景象也能被讀成商業活動與觀眾聚集的關係。', sources: ['fireworks'] }],
    takeaway: '娛樂景觀也有支撐它的經濟關係。', reflection: '畫面裡沒有畫出贊助契約；這個資訊為何需要文獻補充？',
  },
  {
    id: 'fireworks-sky', artworkId: 'A03', title: '夜空為何佔這麼大？', theme: '構圖',
    prompt: '依 Cleveland 對構圖的描述，夜空約佔畫面多大比例？',
    choices: ['幾乎完全不見', '只剩最下方一條窄帶', '接近一半'], answer: 2,
    hint: '比較橋與河面所在的下半部，以及上方留下的天空。', focus: { x: .5, y: .3, scale: 1.5 },
    observation: '細長的升空軌跡和右上煙火，落在一大片深色夜空中。',
    evidence: [{ kind: '館藏解讀', text: 'Cleveland 指出，廣重把近半構圖交給閃耀煙火的夜空。大面積暗色使少量亮點更醒目。', sources: ['fireworks'] }],
    takeaway: '空白與暗部，也能成為安排視線的積極手段。', reflection: '若把天空裁掉一半，煙火還會有同樣的高遠感嗎？',
  },
  {
    id: 'cherry-staging', artworkId: 'A04', title: '被安排出來的春天', theme: '歷史背景',
    prompt: '東京藝術大學美術館介紹的「仲之町之櫻」，有哪項值得注意的做法？',
    choices: ['禁止任何人賞花', '在陰曆三月暫時種植大量櫻樹供觀賞', '把櫻花種在海底'], answer: 1,
    hint: '思考「自然美景」也可能依照節令被人為安排。', focus: { x: .5, y: .48, scale: 1.4 },
    observation: '花木、建築與人物共同構成吉原的賞櫻場景。',
    evidence: [{ kind: '歷史背景', text: '東京藝術大學美術館介紹，仲之町賞櫻會在陰曆三月暫植數百株櫻樹。這是吉原季節活動的背景，並非本圖每株樹的種植紀錄。', sources: ['yoshiwara'] }],
    takeaway: '畫中的季節景觀，可能也包含城市的營造與展示。', reflection: '哪些是畫面能直接看見的線索，哪些必須靠背景研究才能知道？',
  },
  {
    id: 'cherry-social-context', artworkId: 'A04', title: '繁華之下，誰能自由離開？', theme: '社會史',
    prompt: '閱讀吉原的華麗景象時，館方提醒我們必須同時理解什麼？',
    choices: ['所有在場者都能自由出入並隨時離職', '美麗的景象足以證明制度平等', '遊女可能受債務與服役制度拘束，不能自由離開'], answer: 2,
    hint: '區分觀看與消費的人，和必須在其中工作的人。', focus: { x: .5, y: .65, scale: 1.3 },
    observation: '繁花與人群展現出熱鬧的一面；工作者的契約與處境卻不會完整出現在這張風景裡。',
    evidence: [{ kind: '歷史背景', text: '東京藝術大學美術館指出，吉原的繁華建立在遊女因債務受役、無法自由離職的犧牲上；文化成就不能抹去這種制度背景。', sources: ['yoshiwara'] }],
    takeaway: '不能把畫中的華美，直接當成所有人生活自由的證據。', reflection: '如果替這幅畫寫兩句展標，你會如何同時呈現美感與勞動處境？',
  },
  {
    id: 'moon-objects', artworkId: 'A05', title: '人不在，宴席的痕跡還在', theme: '物件敘事',
    prompt: 'Cornell 館方把地上的餐具、托盤與瓶子，讀成什麼線索？',
    choices: ['剛發生過飲食與飲酒活動', '房間從未有人使用', '確定有人在此交易房屋'], answer: 0,
    hint: '留意地面上留下的物品，而不只看窗外的月亮。', focus: { x: .48, y: .78, scale: 1.8 },
    observation: '前景與室內的器物沒有被收得整整齊齊，空間裡留有活動的痕跡。',
    evidence: [{ kind: '館藏解讀', text: 'Cornell 的館藏標籤將散置的餐具、托盤和器物視為用餐已畢的線索，並把前方大瓶子與飲酒連結。', sources: ['moon'] }],
    takeaway: '靜物可以讓一幅沒有完整人物的畫面，仍然暗示剛剛發生的事。', reflection: '這些線索足以推測用過餐，卻能讓我們知道客人的姓名嗎？',
  },
  {
    id: 'moon-offscreen', artworkId: 'A05', title: '屏風後面，故事沒有畫完', theme: '證據與推論',
    prompt: '對屏風邊露出的三味線與人影，哪一種閱讀方式最符合館方解說的分寸？',
    choices: ['能證明對話的每一句內容', '只當成完全無意義的裝飾', '把它們當成音樂與人物活動的間接暗示'], answer: 2,
    hint: '「暗示」與「完整記錄」是不同的證據強度。', focus: { x: .5, y: .58, scale: 1.5 },
    observation: '畫面以局部器物與屏障遮掩人物，觀眾並沒有看見完整情節。',
    evidence: [{ kind: '館藏解讀', text: 'Cornell 將屏風旁的三味線理解為演奏結束的暗示，也討論屏風上的人物影子。這些是館方從局部細節提出的情節解讀。', sources: ['moon'] }],
    takeaway: '敘事可以由畫外與遮蔽構成，但推論仍應保留分寸。', reflection: '請分別說出一件你確實看見的物品，以及一個你據此提出的推測。',
  },
  {
    id: 'ferry-workers', artworkId: 'A06', title: '乘船的人也可能正要上工', theme: '勞動',
    prompt: 'The Met 如何解讀這幅畫的部分渡船乘客？',
    choices: ['都是同一個劇團的演員', '是正前往工作的街頭性工作者（夜鷹）', '都是已確認姓名的官員'], answer: 1,
    hint: '不要把夜裡乘船的人一概視為遊客；先讀館藏對人物的解說。', focus: { x: .5, y: .68, scale: 1.6 },
    observation: '船上的人物共享同一段渡河旅程，但畫面沒有逐一標出姓名。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 將本圖的部分乘客辨識為前往工作的夜鷹。這裡採用館方的身分解讀，並不宣稱已確認每個人物的個人資料。', sources: ['ferry'] }],
    takeaway: '夜間交通同時連接休閒與勞動。', reflection: '把這幅畫和《兩國花火》的遊船相比：同樣在船上，目的是否相同？',
  },
  {
    id: 'ferry-multiple-uses', artworkId: 'A06', title: '一條河，不只一種用途', theme: '交通',
    prompt: '依 The Met 對御廄河岸渡船的介紹，以下哪種說法較完整？',
    choices: ['渡船既可跨越隅田川，也可在途中觀賞名所', '渡船只能供賞煙火使用', '渡船不可能與日常交通有關'], answer: 0,
    hint: '區分渡船的交通功能，和乘客沿途看到的城市景色。', focus: { x: .5, y: .5, scale: 1 },
    observation: '渡船把岸邊與河面連在一起，也讓乘客在移動中接觸城市風景。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 介紹御廄河岸渡船是穿越隅田川的常用方式，乘客也能從船上欣賞名所。交通與觀看在同一趟移動中發生。', sources: ['ferry'] }],
    takeaway: '先分辨船的用途，再解釋乘客與城市的關係。', reflection: '現代通勤時能看見的風景，會不會影響你對一座城市的理解？',
  },
  {
    id: 'asakusa-viewpoint', artworkId: 'A07', title: '貓把我們帶進哪一個位置？', theme: '視點',
    prompt: '依 The Met 的解說，我們是從哪裡看向田野？',
    choices: ['橋中央的觀景台', '吉原附近一間妓樓的樓上房間', '神社正殿內部'], answer: 1,
    hint: '窗框、貓與室內物品都在近景；參拜人群則很遠。', focus: { x: .34, y: .6, scale: 3.2 },
    observation: '窗邊的貓在近處，田野與遠方景物在窗外。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 將觀看位置說明為吉原附近妓樓的二樓房間。窗外的風景因此不能直接當成觀察者就站在神社。', sources: ['asakusa'] }],
    takeaway: '畫面的觀看位置，與畫中人物的目的地可以不同。', reflection: '如果只讀作品題名，你是否會以為觀察者已經站在祭典現場？',
  },
  {
    id: 'asakusa-pilgrims', artworkId: 'A07', title: '人潮正在走向畫外', theme: '宗教與移動',
    prompt: 'The Met 說明，田間小路上的人群正前往哪裡？',
    choices: ['畫中房間的窗台', '兩國橋下的船屋', '鷲大明神（鷲神社）的酉之町祭'], answer: 2,
    hint: '追蹤細小的人影，而不要把遠處的人群與近景房間混為一處。', focus: { x: .73, y: .47, scale: 3 },
    observation: '細小的人影沿田間路徑移動，與近景的安靜室內形成對比。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 將人群連結到前往鷲神社的酉之町祭。細小人物讓遠處的參拜活動進入這個室內視點。', sources: ['asakusa'] }],
    takeaway: '一串很小的人影，也能提示整座城市的活動方向。', reflection: '把人影遮住後，你還能從哪些細節認出祭典線索？',
  },
  {
    id: 'asakusa-hairpins', artworkId: 'A07', title: '小髮簪，與一個「可能」的故事', theme: '證據與推論',
    prompt: '對左下的熊手形髮簪，哪種敘述保留了 The Met 原有的不確定性？',
    choices: ['可能是男性客人從祭典買給遊女的飾物', '已查明買主姓名與購買時間', '證明房間裡的人一定剛去過神社'], answer: 0,
    hint: '館方使用想像與可能性的語氣；物件不等於完整事件紀錄。', focus: { x: .18, y: .88, scale: 3.2 },
    observation: '左下方的小飾物形狀，與祭典的熊手意象形成呼應。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 提出髮簪可能是客人從祭典帶給遊女的禮物；這是解讀，而非已證實的購買紀錄。', sources: ['asakusa'] }],
    takeaway: '引用館方解讀時，也要保留它原本的「可能」。', reflection: '若把「可能」兩字刪掉，這段展覽文字的意思會如何改變？',
  },
  {
    id: 'asakusa-time', artworkId: 'A07', title: '暮色，並不等於午夜', theme: '策展判讀',
    prompt: '本展的「00:00」標示，與這幅畫的天色應如何一起閱讀？',
    choices: ['標示能證明畫中一定是午夜', '是導覽順序；館方描述的畫面是暮色', '00:00 是版畫的出版年份'], answer: 1,
    hint: '把館藏對天空的說明，和網站安排的導覽時刻分開。', focus: { x: .37, y: .35, scale: 3.4 },
    observation: '地平線附近有暖色，遠方可見富士山。',
    evidence: [{ kind: '館藏解讀', text: 'The Met 明確將此景描述為暮色（twilight）。', sources: ['asakusa'] }, { kind: '策展說明', text: '00:00 是本展安排的敘事位置，不是作品時刻的歷史證據。', sources: [] }],
    takeaway: '作品描繪的時間與展覽安排的時間，必須分開核對。', reflection: '另一幅作品的「22:00」標示，也能直接當成史實嗎？',
  },
  {
    id: 'dawn-departure', artworkId: 'A08', title: '熱鬧之後的離開', theme: '時間與敘事',
    prompt: 'Ashmolean 如何介紹《廓中東雲》中的活動？',
    choices: ['正午的軍事操演', '颱風來襲前的撤離', '黎明時，客人與太夫在一夜活動後返去'], answer: 2,
    hint: '「東雲」與英文題名 Dawn，都指向夜晚結束的時段。', focus: { x: .5, y: .68, scale: 1.6 },
    observation: '街道上的人物正移動，與上方逐漸變化的天色共同構成結束一夜的場景。',
    evidence: [{ kind: '館藏解讀', text: 'Ashmolean 將這幅畫介紹為黎明的吉原街巷，客人與一位太夫在一夜活動後返去；The Met 的題名也明確指出黎明。', sources: ['dawn', 'dawnImage'] }],
    takeaway: '夜生活的敘事，也可以由離去與散場構成。', reflection: '把此圖放在《兩國花火》之後，展覽節奏會產生什麼改變？',
  },
  {
    id: 'dawn-freedom', artworkId: 'A08', title: '散場，不代表每個人都自由', theme: '社會史',
    prompt: '看到黎明的離去場景，以下哪個推論需要避免？',
    choices: ['畫面可安排成一夜導覽的結尾', '畫中有人離開，所以所有遊女都能自由離職', '還需要背景資料理解工作者的處境'], answer: 1,
    hint: '一張街景無法自動證明整個制度中的自由程度。', focus: { x: .5, y: .5, scale: 1 },
    observation: '這張圖描繪一個街道片刻，沒有呈現所有人的契約與日常。',
    evidence: [{ kind: '歷史背景', text: '東京藝術大學美術館提醒，吉原遊女受債務服役制度拘束，無法自由離職。這是制度背景，不能因某個離去場景而忽略。', sources: ['yoshiwara'] }],
    takeaway: '場景中的移動，不能直接證明所有人的社會自由。', reflection: '你會如何避免把繁華的遊里圖讀成單純的觀光廣告？',
  },
  {
    id: 'saruwaka-perspective', artworkId: 'B01', title: '通向遠方的劇場街', theme: '構圖',
    prompt: '慶應圖書館指出，廣重用什麼方式呈現三座劇場沿街並列的景象？',
    choices: ['把所有屋頂畫成一樣大', '完全省去街道深度', '運用遠近法讓街道向深處延伸'], answer: 2,
    hint: '順著屋簷與道路兩側的線條，看它們往哪裡集中。', focus: { x: .5, y: .54, scale: 1.5 },
    observation: '街道與建築向遠方縮小，把視線帶向畫面深處。',
    evidence: [{ kind: '館藏解讀', text: '慶應圖書館以遠近法說明這幅劇場街景；同時指出，天保改革把江戶市內的劇場集中到猿若町。', sources: ['saruwaka'] }],
    takeaway: '構圖的深度，也能呈現娛樂場所被集中安排的城市空間。', reflection: '若把街道改成從側面觀看，還會有同樣的縱深嗎？',
  },
  {
    id: 'saruwaka-shadows', artworkId: 'B01', title: '從腳下辨認月光', theme: '光與影',
    prompt: '依慶應圖書館的解說，腳下清楚的人影與哪一個光源連結？',
    choices: ['天空的滿月', '現代電力探照燈', '畫外已確認的攝影閃光燈'], answer: 0,
    hint: '把天空的圓月和街上人物腳下的影子一起看。', focus: { x: .5, y: .78, scale: 2 },
    observation: '人物腳下的深色影子，使平坦街面多了方向與節奏。',
    evidence: [{ kind: '館藏解讀', text: '慶應的解說特別提到，滿月照著看戲歸來的人，並在腳下留下鮮明影子。', sources: ['saruwaka'] }],
    takeaway: '夜景不只靠天空變暗，也能靠投影讓人感到光線。', reflection: '遮住月亮後，人物腳下的影子是否仍會讓你想到光源？',
  },
  {
    id: 'saruwaka-grain', artworkId: 'B01', title: '夜空裡的木頭痕跡', theme: '版畫技法',
    prompt: '慶應的館藏解說指出，夜空中刻意保留了什麼痕跡？',
    choices: ['現代相機日期浮水印', '版木的木紋', '每個路人的簽名'], answer: 1,
    hint: '看夜空的細微紋理；這不是在問雲的名稱。', focus: { x: .48, y: .2, scale: 2.2 },
    observation: '夜空並非完全平滑的色塊；細部紋理的清楚程度會因印本與數位影像而不同。',
    evidence: [{ kind: '館藏解讀', text: '慶應圖書館指出，夜空刻意留下版木木紋，形成浮世繪的情緒效果。這也提醒我們：眼前的風景是透過木版印製出來的。', sources: ['saruwaka'] }],
    takeaway: '材料留下的痕跡，也可能是畫面表現的一部分。', reflection: '如果目前縮圖看不清木紋，可以先閱讀館方的高解析圖，而不必猜測紋理。',
  },
  {
    id: 'embankment-contrast', artworkId: 'B02', title: '熱鬧的一線，安靜的一片', theme: '構圖與地景',
    prompt: '台東區立中央圖書館的解說，特別強調哪種對比？',
    choices: ['同樣密集的兩條商店街', '海底與高山', '擁擠的堤道與周圍安靜的田野'], answer: 2,
    hint: '看路上密集的活動，再看道路外大片留出的田野。', focus: { x: .5, y: .58, scale: 1.2 },
    observation: '堤道上的人與轎子集中成一條活動帶，周圍景物則較疏。',
    evidence: [{ kind: '館藏解讀', text: '台東區立中央圖書館的解說將堤上往來的轎子、簡易店舖，與四周靜謐田野對照；這份解說由 NDL Search 收錄。', sources: ['embankment'] }],
    takeaway: '畫面的熱鬧可以靠密集與空曠的並置來呈現。', reflection: '若把田野裁掉，只留下堤道，這種對比還會存在嗎？',
  },
  {
    id: 'embankment-route', artworkId: 'B02', title: '目的地之前的一段城市', theme: '交通與消費',
    prompt: 'Fitzwilliam 將日本堤介紹為何種路線？',
    choices: ['前往吉原遊郭的最後一段路程', '連接日本所有島嶼的道路', '供遠洋軍艦停泊的碼頭'], answer: 0,
    hint: '畫面描繪的不只是目的地，還有抵達之前的移動。', focus: { x: .5, y: .65, scale: 1.5 },
    observation: '行人、轎子與沿途店舖，把道路畫成持續發生活動的空間。',
    evidence: [{ kind: '館藏解讀', text: 'Fitzwilliam 的解說將日本堤視為抵達吉原前的路段，訪客可步行或乘轎，沿路茶屋也參與接待與安排。', sources: ['embankmentRoute'] }],
    takeaway: '前往娛樂場所的路線，本身就有交通與商業活動。', reflection: '比較《御廄河岸》的水路與這裡的陸路：城市活動如何被交通連接？',
  },
  {
    id: 'suruga-clouds', artworkId: 'B03', title: '雲不是氣象報告', theme: '構圖',
    prompt: 'Brooklyn Museum 如何解釋街景與富士山之間的樣式化雲帶？',
    choices: ['能精確推算當天風速的氣象紀錄', '用來分隔敘事場景、組織觀看的繪畫手法', '畫紙已損壞，所以畫家沒有完成'], answer: 1,
    hint: '比較下方街道的近景，和上方富士山的遠景如何被分成層次。', focus: { x: .5, y: .39, scale: 1.4 },
    observation: '接近對稱的街道、遠山與不規則雲帶，把畫面分成不同層次。',
    evidence: [{ kind: '館藏解讀', text: 'Brooklyn Museum 指出，強烈對稱被樣式化的雲形柔化；這種傳統分景手法把視線分別引向上方富士山與下方城市活動。', sources: ['suruga'] }],
    takeaway: '名所圖可以運用敘事性的雲帶，而不是只複製肉眼景象。', reflection: '如果把雲當成純粹的天氣，而不看成構圖，會漏讀哪些安排？',
  },
  {
    id: 'suruga-brand', artworkId: 'B03', title: '從圓圈裡讀出商家', theme: '商業與圖像',
    prompt: '依 Brooklyn Museum 解說，圈住「三」與「井」的標誌辨識了哪一個商家？',
    choices: ['三井越後屋', '作品中的所有店家都是同一家神社', '這只是沒有意義的裝飾'], answer: 0,
    hint: '注意店舖上的標記；它可以像今天的商標一樣被辨認。', focus: { x: .25, y: .7, scale: 2 },
    observation: '商店建築上的標記，把風景中的場所變成可以辨識的商業空間。',
    evidence: [{ kind: '館藏解讀', text: 'Brooklyn Museum 將圓形標誌中的「三」「井」讀作 Mitsui，並將畫中商家辨識為越後屋。風景圖也留下了商家身分的線索。', sources: ['suruga'] }],
    takeaway: '招牌與標誌能讓城市景觀成為商業史的閱讀材料。', reflection: '這與《柳橋夜景・萬八》的題籤有什麼不同？兩者如何讓地點變得可辨識？',
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
  if (mode === 'random') return shuffled(observationArtworkOrder, random).slice(0, 3).flatMap((id) => {
    const questions = group(id);
    // Begin with the introductory question, then sample one deeper question.
    // Keep each painting together so that randomness does not break its context.
    return [questions[0].id, shuffled(questions.slice(1), random)[0].id];
  });
  return observationArtworkOrder.flatMap((id) => group(id).map((q) => q.id));
}
