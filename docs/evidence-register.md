# 證據登錄表讀法

本次以 [CSV](./evidence-register.csv) 為完整登錄表；網站與來源核對日期 2026-11-18，原期末稿同步修訂 2026-11-19。主鍵 claim_id，並列作品／題目／頁面、原文、來源、可定位段落、支持程度、改文及檔案欄位。共 1,447 筆，含新增原 DOCX 對照；不應只讀「原文」便當成現版展覽主張。

## 判讀規則

- **館藏／一手資料直接支持**：該欄位或歸屬明確的說法可在具名館方正文／API 找到。不是宣稱機構解讀等於無爭議的事件重建。
- **直接觀察**：核看目前展示的實際圖像；不由局部人影推定姓名、階級、職業或心理。本次八件 Met 原圖與 B01、B03 原檔均已核看；B02 僅取得正式同檔 500px 縮圖，未作原圖細節鑑定。
- **學術研究支持**：需具名且已讀的段落。Nenzi 限出版社公開摘要，沒有取得全書，不引用不存在的頁碼。
- **策展推論**：比較、裁圖假設、敘事順序與開放問題，不是新增歷史事實。
- **相互矛盾**：例如《月之岬》活動階段存在不同館方讀法，保留分歧，不能任選一說補成確定事件。
- **待查證／不受支持**：目前證據不足或只支持原文一部分。不是一律判定原句每一細節皆錯；先刪減、改歸屬或停止承接。
- **來源頁聲明**：Commons 的來源與 PD-Art 標示只證明頁面如此記載，與原印本收藏是否已獨立核實分開。
- **錯誤選項**：標「不受支持」是本題所設定的誤讀，不可當作展覽對歷史的正面主張。來源也不能證明該選項在所有歷史情境絕無可能。

## 代表性證據鏈

| 登錄鍵 | 判斷 | 可回查證據 |
| --- | --- | --- |
| A01／C0016–C0017 | 不再寫難以辨認的橋上行人；改看橋架與船 | [The Met JP1312](https://www.metmuseum.org/art/collection/search/45294) Description 與實際原圖 |
| A05／C0180–C0181、moon-objects、moon-offscreen | 人影與器物可見；宴後是具名館方讀法，另有歌舞中的解釋 | [TNM／文化遺產線上](https://online.bunka.go.jp/heritages/detail/559992)「解説」、[Zimmerli 署名文章](https://zimmerli.rutgers.edu/node/356) Moon-Viewing Point 段 |
| A06／sections.urban | 同一 Met 段落前半北齋、後半廣重不能混用；館方說前往工作，沒說 23:00 | [The Met JP1547](https://www.metmuseum.org/art/collection/search/55712) Description |
| B01／C0386 | Commons 的權利聲明不等於慶應持有本頁印本 | [檔案頁](https://commons.wikimedia.org/wiki/File:Hiroshige_Night_View_of_Saruwaka-machi.jpg) Summary／File history；[慶應另印本](https://dcollections.lib.keio.ac.jp/en/ukiyoe/0456) |
| MIDTERM-intention／C0829 | 不承接祈求災後復興的主觀意圖 | 原期中 PDF 第 4 頁；沒有可靠論證來源，標明不受支持，未增加新意圖 |
| ICOM-2022／C0840 起 | 定義逐要素核對，與學生網站實際職能分開 | [ICOM 完整定義](https://icom.museum/en/resources/standards-guidelines/museum-definition/) |

數字 claim_id 依本次生成順序，不作永久外部識別；作品 ID、題目 ID 及欄位路徑亦保留，後續重排仍可定位。

原稿新增項以 `DOCX-P30` 等原 body 節點、`DOCX-A...` 新增位置定位；同段改文拆為逐句，來源日期與文件修訂日分記。例：C0900–C0902 對應《月之岬》的 TNM／Zimmerli 解讀及保留差異。舊 882 筆的位置保持不變；新列從 C0883 開始。原檔及修改對照另見 [原稿修訂報告](./report-revision.md)。

## 保存與限制

已保存機構 API JSON、APJ 可讀編目、Map Warper JSON、Commons 來源鏈、下載狀態／雜湊及核看影像。一般網頁以精確 URL、段落定位、閱讀範圍及簡短轉述保存，未複製全部受著作權保護的文章。HTTP 狀態記錄和閱讀紀錄分開：直接請求可能 429，而瀏覽工具能讀到正文；兩者不互相冒充。

Cornell、Seattle、Ashmolean 本次未完成全文核讀，不用作現版題目證明；參考頁保留為「舊版來源／未核讀」供後續追查。UC Press《Selling Women》僅取得入口，亦未用來支持新增制度細節。維基保留查找線索，不作唯一史實證據。

其他館的**同構圖不同印本**可提供圖像解釋，不能把其尺寸、登錄號、色彩或印製狀態移給目前展示印本。Met API 的每件 primaryImage、登錄號與 isPublicDomain 已另核對；Commons 三件來源鏈仍有不同程度缺口，詳見 [權利表](./rights-register.csv)。
