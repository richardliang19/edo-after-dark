# 修改報告

日期：2026-11-18。比對基線：`b61293fab0cdc4de8564d71c2e91016b21ffa53d`。網站修改保留既有視覺、11 件作品、8 件核心順序、路由及 GitHub Pages 子路徑；未推送或部署。

**11/19 追加：已收到真正期末原稿並完成另存修訂與 26 頁 PDF 驗收。** 詳見 [原稿修訂說明](./report-revision.md) 與 [153 組文件對照](./report-before-after.csv)。下文「未取得原稿」是 11/18 的階段紀錄，現在已解除；教師格式和三位分工仍未確認。

## 先核實現況

實際收到的 ZIP 為上一層的 `edo-after-dark.zip`，不是指令中的 `edo-after-dark-main.zip`。比對 37 個來源／設定檔，19 相同、18 不同，見 [逐檔雜湊](./evidence/zip-comparison.csv)。以目前工作目錄及原始 Git commit 為修改基線，沒有用 ZIP 覆蓋較新的功能。

基線已具備：四題情境式活動一、活動二短路線預設／26 題模式／個別錯誤回饋／反思及本機保存、六件推鏡、多焦點與自由拖曳、手機時間軸介紹、B01「月下劇場街」標籤、CSV 團隊名單。這些是**檢查、保留並回歸測試**，不是本次從零新增。沒有照舊審查意見重做已正常功能。

## 已修改內容與檔案

| 範圍 | 檔案 | 修改目的 |
| --- | --- | --- |
| 11 件作品與六件細節 | [artworks.json](../src/data/artworks.json) | 刪減難以佐證的身分／動機／地點；標示不同印本；月之岬移正三味線焦點；日文題名依 Met 校正 |
| 全部 26 題與來源 | [observation.ts](../src/data/observation.ts) | 逐欄對讀；修正月之岬、黎明、萬八、駿河町等問題的證據鏈；未核讀來源退出當前題目證據 |
| 活動一背景 | [activities.ts](../src/data/activities.ts) | 保留四題，補清 Cleveland 為另印本解讀及核對日期 |
| 手帖與保存相容 | [ObservationChallenge.astro](../src/components/ObservationChallenge.astro)、[controller](../src/lib/observation-controller.ts)、[session](../src/lib/observation-session.ts)、[notebook](../src/lib/observation-notebook.ts)、[legacy](../src/data/observation-legacy.ts) | 新增純文字手帖下載含來源；原有選填筆記保留。只接受已知舊簽章並嚴格驗證進度，不因文案校正無故丟失筆記 |
| 作品頁 | [作品模板](../src/pages/artworks/[id].astro)、[data](../src/lib/data.ts) | 本印本與另印本解說分開；序號空值不產生「第 null 景」；Commons 同檔縮圖改正式主機 |
| 首頁／策展／時間軸 | [首頁](../src/pages/index.astro)、[策展](../src/pages/curation/index.astro)、[時間軸](../src/pages/timeline/index.astro) | 提供第一次觀展入口；保留時間為策展安排；補年代季節與轉場；ICOM 完整要素；區分可見、館方解讀與推論 |
| 古今地圖 | [MapComparison](../src/components/MapComparison.astro)、[maps](../src/lib/maps.ts) | 核對五幅年份及 metadata，補圖幅來源連結；月之岬精確位置不足，移出定位點並保留待考入口 |
| 參考頁 | [references.json](../src/data/references.json)、[參考頁](../src/pages/references/index.astro) | 新增已核讀機構資料、同構圖交叉編目；區分未核讀／查找線索；不把全部舊日期改為新日期 |
| 公開概念稿 | [concepts](../public/concepts/) 五份 HTML | 同步修正橋上行人、午夜祭典、髮簪禮物與黎明人物去向等舊說；標示概念稿素材尚未逐一核實 |
| 文件與驗證 | [docs](./)、[scripts](../scripts/)、[tests](../tests/)、[gitignore](../.gitignore) | 可追溯證據、九章分章稿、瀏覽器驗收及必要資料／遷移／輸出測試；只為指定 DOCX／預覽 PDF 加版本忽略例外 |

## 代表性修改前後

完整精確字串見 [before-after.csv](./before-after.csv)；下表為摘要，非冒稱逐字引文。

| 原來的問題 | 現版處理 | 原因／證據定位 |
| --- | --- | --- |
| A01 摘要以橋上行人為重點 | 改看橋架、船與遠景 | 原圖不能穩定辨認行人；Met Description 著重 X 形橋基、滿月與屋形船；C0016–C0017 |
| 萬八敘述剛點燈、宴席正開始及特定職業 | 保留可見的提燈和室內外往來；船宿背景另引柳橋地方史 | 光亮不能證明活動階段；來源為 Met JP1158、台東區「17.柳橋」 |
| 《月之岬》右側細節誤指三味線 | 焦點移到實際前景局部樂器，另可切人影與衣裾 | 核看 Met DP121535 原圖；moon-offscreen |
| 月之岬宴後被當作唯一事實 | 題幹限定 TNM 解讀，解說並列 Zimmerli 不同階段讀法 | TNM「解説」及 Rutgers 署名文章；moon-objects |
| 月之岬既有文字與座標指向不一致 | 暫撤精確數值，保留品川灣高地的具名館方描述 | 未取得足夠定位證據，不另猜經緯度；A05 location |
| 《御廄河岸》把北齋遊賞敘述接到廣重圖，並推午夜上工 | 分清同一段中的兩幅畫；只說館方辨識夜鷹前往工作 | Met JP1547 Description；A06 sections.urban、MIDTERM-clock |
| 髮簪被寫成確定送禮、物品歸同一女子 | 保留館方「可能是禮物」及可見物件，不定所有權 | Met JP60 likely／we may imagine；asakusa-hairpins |
| 黎明圖指定太夫或所有人離開方向 | 以可見的街道疏密比較夜櫻場景 | 未核讀 Ashmolean，不借其權威補身分；Met JP1024 題名及 A08 原圖 |
| 駿河町延伸題先假定現代建築與視野對照正確 | 比較商業沿革能證明什麼，建築／視野仍待另證 | Brooklyn 供稿與三井 1673／1683 沿革；suruga-brand |
| 前期底稿以復興意圖及全民月見解釋本作 | 新稿不承接無來源的意圖與全民概括，原件不改寫 | MIDTERM-universal、C0829／MIDTERM-intention |

這次避免把「館方可能如此讀」修飾成歷史定論，也不以華麗句型補足缺乏證據的內容。原本清楚的圖像提問、四個情境、角色推薦與版面繼續保留。

## 文件處理

找回本組期中 PDF／講稿後，逐頁核對，記錄第 4 頁歷史論述與第 7 頁分頁安排。期中分頁表可作劉彥廷 P4 的證據，**不能直接補作期末分工**；網站仍依原 CSV，沒有虛構三位空白者的工作或會議紀錄。

沒有原期末 DOCX，依指令提供 [分章稿](./期末報告_江戶不打烊_分章修訂稿.docx) 與 [未完成清單](./unresolved-issues.md)。Word 16 已開啟、更新目錄與欄位並儲存；PDF 匯出曾不返回，停止該次隔離程序，未聲稱 Word 分頁驗收成功。另以 Edge 產出 [21 頁 HTML 預覽](./期末報告_江戶不打烊_分章修訂稿_HTML預覽.pdf)，全部頁面已渲染、核看聯絡表；它不是 Word 渲染結果。

## 保留與風險

深色江戶夜景、字體、圖片主體、八件順序、GSAP／Leaflet 與互動邏輯大部保留。沒有改套件清單、鎖定檔、Astro 設定及部署流程。歷史來源仍有缺口，見 [未完成事項](./unresolved-issues.md)；測試結果與範圍見 [驗收紀錄](./test-report.md)。
