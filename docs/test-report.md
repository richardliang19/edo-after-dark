# 驗證紀錄

日期：2026-11-18。環境：Windows、Node 24.19.0、npm 11.17.0、Astro 7.4.7、GSAP 3.15.1、Leaflet 1.9.4。測試對象為本地最新建置，不是已部署網站。沒有真人受測者。

**11/19 原稿補件後的更新**：已完成真正期末 DOCX 修訂與 LibreOffice CLI 的 26 頁實際 PDF 渲染，取代先前僅有分章稿 HTML 預覽的限制。下方舊文件段落保留為階段紀錄；最新驗收見 [原稿修訂與測試報告](./report-revision.md) 及 [機器可讀結果](./evidence/final-report-validation.json)。本次只修報告與查核文件，沒有再改網站功能；11/18 網站建置與瀏覽器記錄維持原日期，不冒稱於 11/19 重測。

## 安裝、建置與型別

| 項目 | 結果 | 範圍／限制 |
| --- | --- | --- |
| `npm ci` | 成功 | 依現有鎖定檔乾淨安裝；未修改套件清單或鎖定檔 |
| 原生 `npm run build` | **失敗** | Windows 應用程式控制阻擋 satteri 原生 `.node`；提升權限亦未解除，沒有更改系統政策 |
| 官方同版本 WASM 後端建置 | **成功** | 本機安裝 `@bruits/satteri-wasm32-wasi@0.11.7`，設定 `NAPI_RS_FORCE_WASI=true` 後執行 `npm run build`；19 個 Astro 頁面及五個公開概念稿輸出 |
| TypeScript 模組 | 成功，exit 0 | 暫存 CLI `tsc --noEmit --strict`；含活動資料、controller、session、notebook、maps、data、url；不是完整 `astro check` |
| 編輯器 Problems | 未回報錯誤 | 工具結果本身不是全站型別認證 |
| `npm audit --json` | exit 1，9 項 high | 既有鎖定相依圖包含 Astro／Vite 等公告；未自動修正或採用工具建議的主要版本變更。需另行評估建置環境與公告適用性 |

本機 WASM 安裝命令（不是專案新增依賴）：

```powershell
npm.cmd install --no-save --ignore-scripts --force @bruits/satteri-wasm32-wasi@0.11.7
$env:NAPI_RS_FORCE_WASI = 'true'
npm.cmd run build
```

`--force` 是繞過此 WASM 套件的 npm 平台宣告，沒有停用 Windows 應用程式控制。這只是本機替代建置方法，不證明原生後端可用；GitHub Actions 未在本次執行。最終輸出：[build-final.txt](./evidence/build-final.txt)、[型別檢查輸出](./evidence/typescript-check.txt)、[依賴公告原始 JSON](./evidence/npm-audit.json)。

## 程式測試：17 / 17

```powershell
node --experimental-strip-types --test tests/*.test.mjs
```

- 原有九項：短路線／完整題庫／單畫、選項與答案索引、進度、無效資料拒絕、活動一等。
- 新增五項：編目與可定位圖像來源、未核讀來源不當現行證據、精確地點缺證、已知舊簽章進度遷移、純文字手帖的來源與觀眾記錄。
- 新增三項：19 個頁面及概念稿、子路徑下內部 href／src／fragment 可解析、公開 HTML 不顯示未完成提示或空值序號。

見 [Node 完整結果](./evidence/node-tests-final.txt)。測試不會查證歷史真假，也沒有將 882 筆記錄全標成已證實。

## 真實瀏覽器：8 + 3 組通過

整合瀏覽器工具無法取得 invocation context，改以隔離的本機 Edge 157.0.4341.60 headless，透過 CDP 發送原生滑鼠、鍵盤與觸控事件。靜態伺服器僅監聽 `127.0.0.1:4331`，保留 `/edo-after-dark/` 子路徑。畫面與文字檢查使用瀏覽器 DOM，不是只讀建置檔。

| 情境 | 實際結果 |
| --- | --- |
| 桌面 1440×1000，降低動態 | 首頁可讀、完整圖、不依賴提燈遮罩；第一次觀展入口存在 |
| 11 件作品頁 | 基本資料、六段文字、前後作品連結與文件水平寬度通過；逐頁快速切換時部分圖片未載完，沒有宣稱所有外部圖片當場成功 |
| 活動一 | 四題原生選擇、結果、作品推薦及視角地圖連結通過 |
| 活動二隨機六題 | 個別答錯回饋、提示、縮放／Home、選填反思、六題完成、手帖、重新整理恢復與純文字下載通過；下載檔確實落地且有我的記錄，不只檢查成功訊息 |
| 活動二完整二十六題 | 26 個唯一題 ID 均實際作答到手帖，解說來源皆為 HTTPS；答案採資料中的正確索引以驗證互動，不冒充受測者理解測驗 |
| 雙地圖 | 兩個 Leaflet 畫布、縮放與原生方向鍵移動同步；本輪古圖 27/27、現代圖 12/12 圖磚載入；不保證外部服務長期可用 |
| 手機版面 390×844 | 時間軸介紹全部顯示、前後站可移動、頁面無水平溢出；月之岬多焦點及選填反思可用 |
| 一般動態桌面時間軸 | GSAP 啟用，四次下一站位置遞增；鍵盤 End 到結尾、Home 回起點，沒有因低動態測試漏掉一般模式 |
| 故意封鎖作品圖像 | A03 顯示既有失敗提示與原始來源連結，下方解說仍可閱讀 |
| 鍵盤與觸控補測 | 活動開啟／開始／選取／確認可用原生 Enter／Space；放大圖像以觸控事件拖曳後 transform 改變。此處使用明確程式焦點定位，不等於完整 Tab 順序或螢幕閱讀器審查 |

主要原始記錄：[browser-tests.json](./evidence/browser-tests.json)、[browser-supplement.json](./evidence/browser-supplement.json)。兩份最後一次執行皆沒有應用程式 Runtime exception。手機為瀏覽器模擬尺寸與觸控，未使用實體手機。

初期瀏覽器測試曾因測試器沒有等待事件綁定、方向鍵碼不全、Enter 缺文字事件及錯把作品標題預期在閱讀區而失敗。修正的是測試腳本，再以原生輸入重跑；沒有以 JavaScript 直接呼叫答題處理函式來冒充操作通過。外部 Commons 原圖限流則是來源服務限制，保留在未完成清單。

## 文件輸出

分章稿產生後，Microsoft Word 16 已實際開啟 DOCX，更新目錄和欄位並儲存：1 個目錄、7 個表格、81 個超連結。見 [Word 紀錄](./evidence/report-render.json)。最早關閉 Word 時遇到 COM 參數錯誤，改用無參數 Quit 後再次完整執行成功。

Word `ExportAsFixedFormat` 曾不返回，該次代理開啟的隔離程序已停止，**未取得 Word PDF，未完成 Word 逐頁排版驗收**。另以 Edge 列印產生 21 頁 HTML 預覽，再由 PDF.js 渲染全部頁面，核看三張聯絡表；正文、表格、連結、中文字可見，未見明顯疊字或水平截斷。部分作品連結跨頁可再細修，但這不是 Word 版的排版結論。

[預覽 PDF](./期末報告_江戶不打烊_分章修訂稿_HTML預覽.pdf)、[逐頁抽文／渲染資訊](./evidence/report-preview/inspection.json)、[第 1–8 頁](./evidence/report-preview/contact-1.png)、[第 9–16 頁](./evidence/report-preview/contact-9.png)、[第 17–21 頁](./evidence/report-preview/contact-17.png)。原期末稿未取得，無從驗證其封面、圖說與原表格保留。

## 明確未驗證

- 真實約五位觀眾的理解、耗時、滿意度與學習效果；目前只有[研究腳本和空表](./audience-test-template.md)。
- 螢幕閱讀器、完整全站 Tab 路徑、所有狀態對比度、200% 文字放大、iOS／Safari／Firefox、實體手機與各網速。
- Word 原稿的逐頁排版、老師格式符合性；原期末 DOCX／教師規範缺件。
- GitHub Actions 的實際遠端建置、部署後端到端與外部服務長期可用性；本次沒有部署。
- B01 原典藏、B02/B03 原館藏號對應、月之岬精確地點與爭議解讀的最終裁定。這些是內容查核限制，不能以測試通過消除。

WCAG 2.2 AA 為設計目標，沒有宣稱取得認證或已完全符合。

## 最後完整性檢查

`git diff --check` 通過；Git 的行尾正規化比對確認套件清單、鎖定檔、Astro 設定及部署工作流程均未改動。文件相對連結無缺檔，DOCX OOXML 包含九章及 Word 目錄欄位。見 [final-validation.json](./evidence/final-validation.json) 及 [交付雜湊](./evidence/deliverable-hashes.json)。這些是檔案結構與版本檢查，不會驗證史實或取代逐頁排版驗收。
