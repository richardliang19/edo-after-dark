$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$root=(Get-Location).Path
$spec=Get-Content -LiteralPath 'docs/evidence/final-report-edits.json' -Raw -Encoding UTF8|ConvertFrom-Json
$source=(Resolve-Path -LiteralPath '../期末報告_江戶不打烊.docx').Path
if((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash -ne $spec.sourceSha256){throw 'Original changed since inspection; inspect it again before editing.'}
$output=Join-Path $root 'docs/期末報告_江戶不打烊_修訂版.docx'
Copy-Item -LiteralPath $source -Destination $output -Force
$zip=[IO.Compression.ZipFile]::Open($output,[IO.Compression.ZipArchiveMode]::Update)
$script:W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$script:R='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
function Read-Part([string]$name){$reader=[IO.StreamReader]::new($zip.GetEntry($name).Open());try{[xml]$part=$reader.ReadToEnd();return ,$part}finally{$reader.Dispose()}}
function Save-Part([string]$name,[xml]$xml){$zip.GetEntry($name).Delete();$entry=$zip.CreateEntry($name);$stream=$entry.Open();$settings=[Xml.XmlWriterSettings]::new();$settings.Encoding=[Text.UTF8Encoding]::new($false);$settings.Indent=$false;$writer=[Xml.XmlWriter]::Create($stream,$settings);try{$xml.Save($writer)}finally{$writer.Dispose();$stream.Dispose()}}
try{
 $script:doc=Read-Part 'word/document.xml'
 $styles=Read-Part 'word/styles.xml';$script:rels=Read-Part 'word/_rels/document.xml.rels';$settings=Read-Part 'word/settings.xml'
 $script:ns=[Xml.XmlNamespaceManager]::new($doc.NameTable);$ns.AddNamespace('w',$W)
 $body=$doc.SelectSingleNode('//w:body',$ns);$old=@($body.ChildNodes)
 $script:normalTemplate=$old[15]
 $script:linkNo=0
 function El([string]$name){return $doc.CreateElement('w',$name,$W)}
 function Attr($node,[string]$name,[string]$value){$a=$doc.CreateAttribute('w',$name,$W);$a.Value=$value;[void]$node.Attributes.Append($a)}
 function Prop($parent,[string]$name,[string]$value=''){$e=El $name;if($value -ne ''){Attr $e 'val' $value};[void]$parent.AppendChild($e);return ,$e}
 function Run([string]$text,$rPr){$r=El 'r';if($null -ne $rPr){[void]$r.AppendChild($rPr.CloneNode($true))};$lines=$text.Split("`n");for($j=0;$j -lt $lines.Length;$j++){if($j -gt 0){[void]$r.AppendChild((El 'br'))};$t=El 't';$space=$doc.CreateAttribute('xml','space','http://www.w3.org/XML/1998/namespace');$space.Value='preserve';[void]$t.Attributes.Append($space);$t.InnerText=$lines[$j];[void]$r.AppendChild($t)};return ,$r}
 function Append-Text($paragraph,[string]$text,$rPr){
  $position=0
  foreach($match in [regex]::Matches($text,'https?://[^\s]+')){
   if($match.Index -gt $position){[void]$paragraph.AppendChild((Run $text.Substring($position,$match.Index-$position) $rPr))}
   $url=$match.Value.TrimEnd('。','；','，','）');$script:linkNo++
   $id='auditLink'+$script:linkNo
   $relationship=$rels.CreateElement('Relationship',$rels.DocumentElement.NamespaceURI);$relationship.SetAttribute('Id',$id);$relationship.SetAttribute('Type',$R+'/hyperlink');$relationship.SetAttribute('Target',$url);$relationship.SetAttribute('TargetMode','External');[void]$rels.DocumentElement.AppendChild($relationship)
   $hyperlink=El 'hyperlink';$rid=$doc.CreateAttribute('r','id',$R);$rid.Value=$id;[void]$hyperlink.Attributes.Append($rid)
   [void]$hyperlink.AppendChild((Run $url $rPr));[void]$paragraph.AppendChild($hyperlink)
   if($match.Value.Length -gt $url.Length){[void]$paragraph.AppendChild((Run $match.Value.Substring($url.Length) $rPr))}
   $position=$match.Index+$match.Length
  }
  if($position -lt $text.Length){[void]$paragraph.AppendChild((Run $text.Substring($position) $rPr))}
 }
 function Replace-Text($paragraph,[string]$text){
  $pPr=$paragraph.SelectSingleNode('./w:pPr',$ns)
  $rPr=$paragraph.SelectSingleNode('./w:r/w:rPr',$ns)
  if($null -ne $rPr){$rPr=$rPr.CloneNode($true)}
  # Do not extend an originally bold lead-in across the whole replacement.
  $style=$paragraph.SelectSingleNode('./w:pPr/w:pStyle',$ns)
  if($null -ne $rPr -and ($null -eq $style -or $style.GetAttribute('val',$W) -notmatch '^Heading')){foreach($bold in @($rPr.SelectNodes('./w:b|./w:bCs',$ns))){[void]$rPr.RemoveChild($bold)}}
  $bookmarks=@($paragraph.SelectNodes('.//w:bookmarkStart|.//w:bookmarkEnd',$ns)|ForEach-Object {$_.CloneNode($true)})
  foreach($child in @($paragraph.ChildNodes)){if($child -ne $pPr){[void]$paragraph.RemoveChild($child)}}
  foreach($b in $bookmarks){if($b.LocalName -eq 'bookmarkStart'){[void]$paragraph.AppendChild($b)}}
  Append-Text $paragraph $text $rPr
  foreach($b in $bookmarks){if($b.LocalName -eq 'bookmarkEnd'){[void]$paragraph.AppendChild($b)}}
 }
 function New-Paragraph([string]$text,[string]$style='',[bool]$cell=$false,[bool]$header=$false){
  $p=El 'p';$pr=El 'pPr';[void]$p.AppendChild($pr)
  if($style -ne ''){$null=Prop $pr 'pStyle' $style}
  if($style -match '^Heading'){$null=Prop $pr 'keepNext';if($style -eq 'Heading1'){$null=Prop $pr 'pageBreakBefore'}}
  $spacing=El 'spacing';Attr $spacing 'after' $(if($cell){'40'}else{'140'});Attr $spacing 'line' $(if($cell){'240'}else{'320'});Attr $spacing 'lineRule' 'auto';[void]$pr.AppendChild($spacing)
  $null=Prop $pr 'widowControl';$null=Prop $pr 'wordWrap'
  $rPr=El 'rPr';$font=El 'rFonts';foreach($name in @('ascii','hAnsi','eastAsia')){Attr $font $name 'Microsoft JhengHei'};[void]$rPr.AppendChild($font)
  if($cell){$null=Prop $rPr 'sz' '19';$null=Prop $rPr 'szCs' '19';if($header){$null=Prop $rPr 'b';$null=Prop $rPr 'color' 'FFFFFF'}}
  elseif($style -notmatch '^Heading'){$null=Prop $rPr 'sz' '22';$null=Prop $rPr 'szCs' '22'}
  Append-Text $p $text $rPr;return ,$p
 }
 function New-Table($specification){
  $headers=@($specification.headers);$widths=@($specification.widths)
  if($widths.Count -ne $headers.Count){$widths=@($headers|ForEach-Object {1})}
  $total=($widths|Measure-Object -Sum).Sum;$widths=@($widths|ForEach-Object {[int][Math]::Floor(9026*$_/$total)})
  $widths[-1]+=9026-($widths|Measure-Object -Sum).Sum
  $table=El 'tbl';$pr=El 'tblPr';[void]$table.AppendChild($pr)
  $tw=El 'tblW';Attr $tw 'w' '9026';Attr $tw 'type' 'dxa';[void]$pr.AppendChild($tw)
  $layout=El 'tblLayout';Attr $layout 'type' 'fixed';[void]$pr.AppendChild($layout)
  $borders=El 'tblBorders';foreach($edge in @('top','left','bottom','right','insideH','insideV')){$e=El $edge;Attr $e 'val' 'single';Attr $e 'sz' '4';Attr $e 'color' 'CBBFB2';[void]$borders.AppendChild($e)};[void]$pr.AppendChild($borders)
  $grid=El 'tblGrid';foreach($width in $widths){$col=El 'gridCol';Attr $col 'w' ([string]$width);[void]$grid.AppendChild($col)};[void]$table.AppendChild($grid)
  $rows=@();$rows+=,@($headers);foreach($row in $specification.rows){$rows+=,@($row)}
  for($i=0;$i -lt $rows.Count;$i++){
   $row=El 'tr';$rowPr=El 'trPr';$null=Prop $rowPr 'cantSplit';if($i -eq 0){$null=Prop $rowPr 'tblHeader'};[void]$row.AppendChild($rowPr)
   for($j=0;$j -lt $headers.Count;$j++){
    $cell=El 'tc';$cellPr=El 'tcPr';$cw=El 'tcW';Attr $cw 'w' ([string]$widths[$j]);Attr $cw 'type' 'dxa';[void]$cellPr.AppendChild($cw)
    $value=[string]$rows[$i][$j];$dark=$i -eq 0 -or $value -eq '●'
    $fill=El 'shd';Attr $fill 'val' 'clear';Attr $fill 'fill' $(if($dark){'1F1A17'}elseif($value -eq '待'){'E5DBCC'}elseif($i%2 -eq 0){'F6F1E9'}else{'FFFFFF'});[void]$cellPr.AppendChild($fill)
    $margins=El 'tcMar';foreach($side in @('top','bottom','left','right')){$m=El $side;Attr $m 'w' '65';Attr $m 'type' 'dxa';[void]$margins.AppendChild($m)};[void]$cellPr.AppendChild($margins)
    [void]$cell.AppendChild($cellPr);$cellParagraph=New-Paragraph $value '' $true $dark
    if($i -lt $rows.Count-1 -or $headers[0] -eq '日期（2026）'){$null=Prop ($cellParagraph.SelectSingleNode('./w:pPr',$ns)) 'keepNext'}
    [void]$cell.AppendChild($cellParagraph);[void]$row.AppendChild($cell)
   };[void]$table.AppendChild($row)
  };return ,$table
 }
 function Block($block){if($block.type -eq 'table'){return ,(New-Table $block)}elseif($block.type -eq 'heading'){return ,(New-Paragraph $block.text ('Heading'+$block.level))}else{return ,(New-Paragraph $block.text)}}
 foreach($node in $old){[void]$body.RemoveChild($node)}
 for($i=0;$i -lt $old.Count;$i++){
  $index=[string]($i+1);$node=$old[$i]
  if($spec.remove -notcontains ($i+1)){
   if($null -ne $spec.paragraphs.PSObject.Properties[$index]){Replace-Text $node $spec.paragraphs.$index.text}
   if($null -ne $spec.tables.PSObject.Properties[$index]){$node=New-Table $spec.tables.$index}
   [void]$body.AppendChild($node)
  }
  if($null -ne $spec.after.PSObject.Properties[$index]){foreach($block in $spec.after.$index){[void]$body.AppendChild((Block $block))}}
 }
 # Retain original screenshots, chapter styling, TOC container and page-number footer.
 # Keep each screenshot with its caption, and each chapter heading with following text.
 foreach($paragraph in $body.SelectNodes('./w:p',$ns)){
  $style=$paragraph.SelectSingleNode('./w:pPr/w:pStyle',$ns)
  if(($null -ne $style -and $style.GetAttribute('val',$W) -eq 'Heading1') -or $paragraph.SelectNodes('.//w:drawing',$ns).Count -gt 0){
   $pr=$paragraph.SelectSingleNode('./w:pPr',$ns);if($null -eq $pr){$pr=El 'pPr';[void]$paragraph.PrependChild($pr)}
   if($null -eq $pr.SelectSingleNode('./w:keepNext',$ns)){$null=Prop $pr 'keepNext'}
   if($null -ne $style -and $style.GetAttribute('val',$W) -eq 'Heading1' -and $null -eq $pr.SelectSingleNode('./w:pageBreakBefore',$ns)){$null=Prop $pr 'pageBreakBefore'}
  }
 }
 # Separate the original cover and TOC; prevent a TOC tail on the cover.
 $tocTitle=$body.SelectNodes('./w:p',$ns)|Where-Object {([string]::Join('',@($_.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText}))) -eq '目錄'}|Select-Object -First 1
 if($null -ne $tocTitle){$pr=$tocTitle.SelectSingleNode('./w:pPr',$ns);if($null -eq $pr){$pr=El 'pPr';[void]$tocTitle.PrependChild($pr)};$null=Prop $pr 'pageBreakBefore';$null=Prop $pr 'keepNext'}
 # Uniform readable body text; retain the original cover and heading palette.
 $inBody=$false;$inBibliography=$false;$inArtwork=$false
 foreach($node in $body.ChildNodes){
  if($node.LocalName -ne 'p'){continue}
  $text=[string]::Join('',@($node.SelectNodes('.//w:t',$ns)|ForEach-Object {$_.InnerText}))
  $style=$node.SelectSingleNode('./w:pPr/w:pStyle',$ns);$styleName=$(if($null -ne $style){$style.GetAttribute('val',$W)}else{''})
  if($text -eq '一、策展理念及主題'){$inBody=$true}
  if(-not $inBody){continue}
  if($styleName -eq 'Heading1'){$inArtwork=$false;$inBibliography=$text -eq '七、參考文獻'}
  if($styleName -eq 'Heading3' -and $text -match '^[AB][0-9]{2} '){$inArtwork=$true}
  $pr=$node.SelectSingleNode('./w:pPr',$ns);if($null -eq $pr){$pr=El 'pPr';[void]$node.PrependChild($pr)}
  if($inArtwork -and $styleName -ne 'Heading1' -and $null -eq $pr.SelectSingleNode('./w:keepNext',$ns)){$null=Prop $pr 'keepNext'}
  if($inArtwork -and $text.StartsWith('圖像來源：')){foreach($keep in @($pr.SelectNodes('./w:keepNext',$ns))){[void]$pr.RemoveChild($keep)};$inArtwork=$false}
  if($styleName -match '^Heading' -or $node.SelectNodes('.//w:drawing',$ns).Count -gt 0){continue}
  $spacing=$pr.SelectSingleNode('./w:spacing',$ns);if($null -eq $spacing){$spacing=El 'spacing';[void]$pr.AppendChild($spacing)}
  Attr $spacing 'after' $(if($inBibliography){'95'}else{'100'});Attr $spacing 'line' $(if($inBibliography){'280'}else{'300'});Attr $spacing 'lineRule' 'auto'
  foreach($r in $node.SelectNodes('.//w:r[w:t]',$ns)){
   $rp=$r.SelectSingleNode('./w:rPr',$ns);if($null -eq $rp){$rp=El 'rPr';[void]$r.PrependChild($rp)}
   $font=$rp.SelectSingleNode('./w:rFonts',$ns);if($null -eq $font){$font=El 'rFonts';[void]$rp.PrependChild($font)};foreach($f in @('ascii','hAnsi','eastAsia')){Attr $font $f 'Microsoft JhengHei'}
   foreach($sz in @($rp.SelectNodes('./w:sz|./w:szCs',$ns))){[void]$rp.RemoveChild($sz)}
   $null=Prop $rp 'sz' $(if($inBibliography -or $text -match '^圖 [123]'){'20'}else{'22'})
  }
 }
 foreach($highlight in @($doc.SelectNodes('//w:highlight',$ns))){[void]$highlight.ParentNode.RemoveChild($highlight)}
 foreach($shading in @($doc.SelectNodes('//w:shd',$ns))){if($shading.GetAttribute('fill',$W) -eq 'FFFF00'){[void]$shading.ParentNode.RemoveChild($shading)}}
 $sns=[Xml.XmlNamespaceManager]::new($styles.NameTable);$sns.AddNamespace('w',$W)
 if($null -eq $styles.SelectSingleNode('//w:style[@w:styleId="Heading3"]',$sns)){
  $s=$styles.CreateElement('w','style',$W);$a=$styles.CreateAttribute('w','type',$W);$a.Value='paragraph';[void]$s.Attributes.Append($a);$a=$styles.CreateAttribute('w','styleId',$W);$a.Value='Heading3';[void]$s.Attributes.Append($a)
  $s.InnerXml='<w:name xmlns:w="'+$W+'" w:val="heading 3"/><w:basedOn xmlns:w="'+$W+'" w:val="Normal"/><w:pPr xmlns:w="'+$W+'"><w:keepNext/><w:outlineLvl w:val="2"/></w:pPr><w:rPr xmlns:w="'+$W+'"><w:b/><w:sz w:val="24"/><w:color w:val="A23B2A"/></w:rPr>';[void]$styles.DocumentElement.AppendChild($s)
 }
 $settingsNs=[Xml.XmlNamespaceManager]::new($settings.NameTable);$settingsNs.AddNamespace('w',$W)
 $update=$settings.SelectSingleNode('//w:updateFields',$settingsNs)
 if($null -eq $update){$update=$settings.CreateElement('w','updateFields',$W);[void]$settings.DocumentElement.AppendChild($update)}
 $a=$settings.CreateAttribute('w','val',$W);$a.Value='true';[void]$update.Attributes.Append($a)
 Save-Part 'word/document.xml' $doc;Save-Part 'word/styles.xml' $styles;Save-Part 'word/_rels/document.xml.rels' $rels;Save-Part 'word/settings.xml' $settings
 Write-Output "Revised original DOCX saved with $linkNo linked source URLs; original media and footer preserved."
}finally{$zip.Dispose()}
if((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash -ne $spec.sourceSha256){throw 'Original file was changed unexpectedly.'}
Get-Item -LiteralPath $output|Select-Object FullName,Length|ConvertTo-Json
