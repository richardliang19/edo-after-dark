$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$reportSource = (Resolve-Path -LiteralPath '../期末報告_江戶不打烊.docx').Path
$evidenceRoot = Join-Path (Get-Location).Path 'docs/evidence/final-report-original'
[void][IO.Directory]::CreateDirectory($evidenceRoot)
$archive = [IO.Compression.ZipFile]::OpenRead($reportSource)
try {
    foreach ($entry in $archive.Entries) {
        if ($entry.FullName -notmatch '^(word/.*\.(xml|rels|png|jpg|jpeg|emf|wmf)|docProps/.*\.xml)$') { continue }
        $target = [IO.Path]::GetFullPath((Join-Path $evidenceRoot $entry.FullName))
        if (-not $target.StartsWith($evidenceRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe archive path' }
        [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($target))
        [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $target, $true)
    }
    $reader = [IO.StreamReader]::new($archive.GetEntry('word/document.xml').Open())
    try { [xml]$document = $reader.ReadToEnd() } finally { $reader.Dispose() }
    $ns = [Xml.XmlNamespaceManager]::new($document.NameTable)
    $ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
    $ns.AddNamespace('r','http://schemas.openxmlformats.org/officeDocument/2006/relationships')
    $blocks = @(); $number=0
    foreach ($node in $document.SelectSingleNode('//w:body',$ns).ChildNodes) {
        $number++
        if ($node.LocalName -eq 'p') {
            $styleNode=$node.SelectSingleNode('./w:pPr/w:pStyle',$ns)
            $style=''
            if ($null -ne $styleNode) {$style=$styleNode.GetAttribute('val',$ns.LookupNamespace('w'))}
            $blocks += [ordered]@{index=$number;type='paragraph';style=$style;text=([string]::Join('',@($node.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText})));pictures=$node.SelectNodes('.//w:drawing|.//w:pict',$ns).Count;highlight=@($node.SelectNodes('.//w:highlight',$ns)|ForEach-Object {$_.GetAttribute('val',$ns.LookupNamespace('w'))})}
        } elseif ($node.LocalName -eq 'tbl') {
            $rows=@($node.SelectNodes('./w:tr',$ns)|ForEach-Object { ,@($_.SelectNodes('./w:tc',$ns)|ForEach-Object {[string]::Join(' / ',@($_.SelectNodes('.//w:p',$ns)|ForEach-Object {[string]::Join('',@($_.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText}))}))}) })
            $blocks += [ordered]@{index=$number;type='table';rows=$rows}
        }
    }
    $result=[ordered]@{source=$reportSource;sha256=(Get-FileHash -LiteralPath $reportSource -Algorithm SHA256).Hash;bytes=(Get-Item -LiteralPath $reportSource).Length;received='2026-11-18';blocks=$blocks;entries=@($archive.Entries|ForEach-Object {$_.FullName})}
    $result|ConvertTo-Json -Depth 25|Set-Content -LiteralPath (Join-Path $evidenceRoot 'inventory.json') -Encoding UTF8
    $blocks|ForEach-Object { if($_.type -eq 'paragraph'){"[$($_.index)] [$($_.style)] $($_.text)"}else{"[$($_.index)] TABLE`n"+($_.rows|ForEach-Object {$_ -join ' | '}) -join "`n"} }|Set-Content -LiteralPath (Join-Path $evidenceRoot 'text.txt') -Encoding UTF8
    Write-Output "Original report inspected: $($blocks.Count) body blocks; SHA256 $($result.sha256)."
} finally { $archive.Dispose() }
