param([switch]$ExportPdf)
$ErrorActionPreference = 'Stop'
$reportInput = (Resolve-Path -LiteralPath 'docs/期末報告_江戶不打烊_分章修訂稿.docx').Path
$reportDocx = Join-Path (Get-Location).Path 'docs/期末報告_江戶不打烊_分章修訂稿.docx'
$reportPdf = Join-Path (Get-Location).Path 'docs/期末報告_江戶不打烊_分章修訂稿.pdf'
$word = $null
$document = $null
try {
    Write-Output 'Starting isolated Word automation for the generated DOCX draft.'
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.AutomationSecurity = 3
    Write-Output 'Word connected; opening generated OOXML draft.'
    $document = $word.Documents.Open($reportInput, $false, $false, $false)
    Write-Output 'DOCX opened; applying layout and updating fields.'
    # A4, margins, fonts, heading levels, repeated table headers and cantSplit
    # are already in the generated OOXML. Do not query the system printer.
    $chapter = $document.Content.Duplicate
    if ($document.TablesOfContents.Count -eq 0 -and $chapter.Find.Execute('第一章　研究問題與策展方法')) {
        $start = $chapter.Paragraphs.Item(1).Range.Start
        $tocRange = $document.Range($start, $start)
        $tocRange.InsertBefore("目錄`r")
        $tocRange = $document.Range($start + 3, $start + 3)
        $null = $document.TablesOfContents.Add($tocRange, $true, 1, 2)
    }
    Write-Output 'Updating table of contents.'
    foreach ($toc in $document.TablesOfContents) { $toc.Update() }
    Write-Output 'Updating remaining fields.'
    $document.Fields.Update() | Out-Null
    Write-Output 'Saving updated fields before PDF export.'
    $document.Save()
    if ($ExportPdf) {
        Write-Output 'Updated DOCX saved; exporting PDF.'
        $document.ExportAsFixedFormat($reportPdf, 17)
        Write-Output 'PDF export completed.'
    }
    $stats = [pscustomobject]@{
        status='分章修訂稿輸出；未取得原始 DOCX，並非原稿修訂版'
        renderer='Microsoft Word 16 COM；開啟、更新目錄／欄位與儲存；未完成 PDF 匯出'
        wordVersion=$word.Version
        pages='未執行最後 PDF 分頁驗收'
        tables=$document.Tables.Count
        tableOfContents=$document.TablesOfContents.Count
        hyperlinks=$document.Hyperlinks.Count
        splitTableRows='OOXML 設定 cantSplit；尚未以 Word PDF 逐頁確認'
        docx=$reportDocx
        pdf=$(if ($ExportPdf) { $reportPdf } else { '本機 ExportAsFixedFormat 未返回；未產生 Word PDF' })
        date='2026-11-18'
        visualInspection='另見逐頁渲染紀錄；此統計本身不等於逐頁目視驗收'
    }
    $stats | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath 'docs/evidence/report-render.json' -Encoding utf8
    $stats | ConvertTo-Json -Depth 5
} finally {
    if ($null -ne $document) { $document.Close(0) }
    if ($null -ne $word) { $word.Quit(); [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($word) }
}
