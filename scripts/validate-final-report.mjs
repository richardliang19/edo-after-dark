import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readZip} from './ooxml-package.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const original=read('docs/evidence/final-report-original/inventory.json'),spec=read('docs/evidence/final-report-edits.json');
const originalBytes=readFileSync('../期末報告_江戶不打烊.docx'),revision=readFileSync('docs/期末報告_江戶不打烊_修訂版.docx');
const files=Object.fromEntries(readZip(revision)),xml=files['word/document.xml'].toString('utf8');
const text=s=>s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>');
const clean=s=>s.normalize('NFKC').replace(/\s+/g,'');
const pdf=read('docs/evidence/final-report-revised/pdf-inspection.json'),all=clean(pdf.pages.map(p=>p.text).join('\n'));
const media=read('docs/evidence/final-report-media.json');
const toc=xml.match(/<w:sdt>[\s\S]*?<\/w:sdt>/)?.[0];
const tocRows=[...toc.matchAll(/<w:hyperlink\b[^>]*w:tooltip="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>/g)].map(([,title,content])=>{
 const page=Number(content.match(/<w:t[^>]*>(\d+)<\/w:t>/)?.[1]);
 const actual=pdf.pages.slice(2).find(p=>clean(p.text).includes(clean(text(title))))?.page;
 return {title:text(title),cachedPage:page,actualPage:actual,pass:page===actual};
});
const tocAnchorTargets=[...toc.matchAll(/<w:hyperlink\b[^>]*w:anchor="([^"]+)"/g)].map(([,anchor])=>({anchor,exists:xml.includes('w:name="'+anchor+'"')}));
const letters=s=>s.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu,'');
const bodyEntries=p=>p.entries.filter(e=>e.y>65&&e.y<p.pageHeight-35);
const orderLines=entries=>{
 const lines=[];
 for(const e of [...entries].sort((a,b)=>b.y-a.y)){
  let line=lines.find(l=>Math.abs(l.y-e.y)<2.5);
  if(!line){line={y:e.y,items:[]};lines.push(line);}line.items.push(e);
 }
 return lines.sort((a,b)=>b.y-a.y).map(l=>l.items.sort((a,b)=>a.x-b.x).map(e=>e.text).join('')).join('\n');
};
const coverageCandidates=[letters(pdf.pages.map(p=>bodyEntries(p).map(e=>e.text).join('')).join('')),letters(pdf.pages.map(p=>orderLines(bodyEntries(p))).join(''))];
const expected=[...Object.values(spec.paragraphs),...Object.values(spec.tables),...Object.values(spec.after).flat()].flatMap(b=>b.type==='table'?[b.headers,...b.rows].flat():[b.text]).filter(Boolean);
const expectedContentMissing=[...new Set(expected)].filter(t=>!coverageCandidates.some(c=>c.includes(letters(t))));
const tables=[...xml.matchAll(/<w:tbl\b[^>]*>[\s\S]*?<\/w:tbl>/g)].map(([table],i)=>{
 const rows=[...table.matchAll(/<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g)].map(([row])=>[...row.matchAll(/<w:tc\b[^>]*>[\s\S]*?<\/w:tc>/g)].map(([cell])=>text(cell)));
 const pages=pdf.pages.filter(p=>rows[0].every(c=>clean(p.text).includes(clean(c)))&&rows.at(-1).every(c=>clean(p.text).includes(clean(c)))).map(p=>p.page);
 return {table:i+1,headers:rows[0],rowCount:rows.length,wholeOnPage:pages,pass:pages.length>0};
});
const urls=[...files['word/_rels/document.xml.rels'].toString('utf8').matchAll(/<Relationship\b[^>]*Type="[^"]+\/hyperlink"[^>]*Target="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
const badUrls=urls.filter(url=>{try{return !['https:','http:'].includes(new URL(url).protocol);}catch{return true;}});
const links=pdf.pages.flatMap(p=>(p.links??[]).map(l=>({page:p.page,...l})));
const findings={date:'2026-11-19',originalSha256:hash(originalBytes),originalUnchanged:hash(originalBytes).toUpperCase()===original.sha256,revisionSha256:hash(revision),pdfSha256:hash(readFileSync('docs/期末報告_江戶不打烊_修訂版.pdf')),pdfPages:pdf.pages.length,allOriginalImageBytesPreserved:media.allOriginalImageBytesPreserved,pictures:(xml.match(/<w:drawing\b/g)??[]).length,tables,tocRows,tocAnchorTargets,expectedTextBlocks:expected.length,expectedContentMissing,allNineChapters:tocRows.filter(r=>/^[一二三四五六七八九]、/.test(r.title)).length===9,highlights:(xml.match(/<w:highlight\b/g)??[]).length,unfinishedPrompts:['黃色欄位的組員負責項目請補上','期中報告之前的階段請依實際日期補上','請補上出席者','組別：＿＿','學號：＿＿','繳交日期：＿＿'].filter(s=>all.includes(clean(s))),overflowCount:pdf.overflows.length,externalUrls:urls.length,badUrls,pdfLinks:links.length,pdfInternalLinks:links.filter(l=>l.destinationPage!==null).length,pdfBadInternalDestinations:links.filter(l=>l.destinationPage!==null&&(l.destinationPage<1||l.destinationPage>pdf.pages.length)),scope:'Structural consistency and actual rendered pagination only; history and source limits remain in the evidence register. PDF TOC has printed page numbers; DOCX bookmark targets are checked separately.'};
findings.pass=findings.originalUnchanged&&findings.allOriginalImageBytesPreserved&&findings.pictures===3&&findings.tables.length===10&&findings.tables.every(t=>t.pass)&&findings.tocRows.length===10&&findings.tocRows.every(r=>r.pass)&&findings.tocAnchorTargets.every(r=>r.exists)&&findings.expectedContentMissing.length===0&&findings.allNineChapters&&findings.highlights===0&&findings.unfinishedPrompts.length===0&&findings.overflowCount===0&&badUrls.length===0&&findings.pdfBadInternalDestinations.length===0;
writeFileSync('docs/evidence/final-report-validation.json',JSON.stringify(findings,null,2)+'\n');console.log(JSON.stringify({...findings,tables:findings.tables.map(t=>({table:t.table,wholeOnPage:t.wholeOnPage,pass:t.pass}))}));if(!findings.pass)process.exitCode=1;
