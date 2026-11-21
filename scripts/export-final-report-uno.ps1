$ErrorActionPreference='Stop'
$docx=(Resolve-Path -LiteralPath 'docs/期末報告_江戶不打烊_修訂版.docx').Path
$pdf=Join-Path (Get-Location).Path 'docs/期末報告_江戶不打烊_修訂版.pdf'
& cscript.exe //nologo 'scripts/export-final-report-uno.js' $docx $pdf
if($LASTEXITCODE -ne 0){throw 'LibreOffice UNO export failed.'}
$result=[ordered]@{date='2026-11-19';renderer='LibreOffice 26.2.5.2 UNO/OLE through Windows JScript';indexes=1;method='同一引擎更新 DOCX 目錄、儲存 DOCX 並匯出 PDF，避免 Word／LibreOffice 分頁差造成目錄不符';docx=$docx;pdf=$pdf;source='https://api.libreoffice.org/docs/idl/ref/interfacecom_1_1sun_1_1star_1_1text_1_1XDocumentIndexesSupplier.html'}
$result|ConvertTo-Json|Set-Content -LiteralPath 'docs/evidence/final-report-render.json' -Encoding UTF8
$result|ConvertTo-Json
