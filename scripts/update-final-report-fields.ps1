param([switch]$ReadOnlyCheck)
$ErrorActionPreference='Stop'
$reportPath=(Resolve-Path -LiteralPath 'docs/期末報告_江戶不打烊_修訂版.docx').Path
$word=$null;$report=$null
try{
 $word=New-Object -ComObject Word.Application
 $word.Visible=$false;$word.DisplayAlerts=0;$word.AutomationSecurity=3
 $report=$word.Documents.Open($reportPath,$false,[bool]$ReadOnlyCheck,$false)
 if($ReadOnlyCheck){Write-Output 'Final revision opened read-only in Word; no fields or file content are changed.'}
 else{Write-Output 'Original-derived revision opened in Word; updating existing TOC and fields.';foreach($toc in $report.TablesOfContents){$toc.Update()};$report.Fields.Update()|Out-Null;$report.Save()}
 $result=[ordered]@{date='2026-11-19';file=$reportPath;source='使用者提供的原期末報告 DOCX，另存修訂版';application='Microsoft Word '+$word.Version;toc=$report.TablesOfContents.Count;tables=$report.Tables.Count;inlinePictures=$report.InlineShapes.Count;links=$report.Hyperlinks.Count;status=$(if($ReadOnlyCheck){'最終檔可由 Word 唯讀開啟；沒有重新儲存或改變 PDF 對應快取。Word 原生逐頁列印未驗收。'}else{'已開啟、更新既有目錄及欄位並儲存；另以 LibreOffice 渲染 PDF 驗收'})}
 $record=$(if($ReadOnlyCheck){'docs/evidence/final-report-word-readonly.json'}else{'docs/evidence/final-report-word.json'})
 $result|ConvertTo-Json|Set-Content -LiteralPath $record -Encoding UTF8
 $result|ConvertTo-Json
}finally{
 if($null -ne $report){$report.Close(0)}
 if($null -ne $word){$word.Quit();[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($word)}
}
