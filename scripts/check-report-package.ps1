$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root=Join-Path (Get-Location).Path 'docs/evidence/report-compatibility'
[void][IO.Directory]::CreateDirectory($root)
$original=(Resolve-Path '../期末報告_江戶不打烊.docx').Path
$revised=[IO.Compression.ZipFile]::OpenRead((Resolve-Path 'docs/期末報告_江戶不打烊_修訂版.docx'))
try{
 Copy-Item -LiteralPath $original -Destination (Join-Path $root 'original-control.docx') -Force
 foreach($part in @('document','styles','settings','rels')){
  $name=$(if($part -eq 'rels'){'word/_rels/document.xml.rels'}else{'word/'+$part+'.xml'})
  $target=Join-Path $root ($part+'-only.docx');Copy-Item -LiteralPath $original -Destination $target -Force
  $z=[IO.Compression.ZipFile]::Open($target,[IO.Compression.ZipArchiveMode]::Update)
  try{$z.GetEntry($name).Delete();$entry=$z.CreateEntry($name);$to=$entry.Open();$from=$revised.GetEntry($name).Open();try{$from.CopyTo($to)}finally{$from.Dispose();$to.Dispose()}}finally{$z.Dispose()}
 }
}finally{$revised.Dispose()}
