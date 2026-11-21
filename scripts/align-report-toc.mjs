// Match cached TOC page numbers to the actual fixed-layout PDF. Preserve fields
// and bookmark targets so users can still refresh them in their own Word setup.
import {readFileSync,writeFileSync} from 'node:fs';
import {readZip} from './ooxml-package.mjs';
import {zip} from './docx-draft.mjs';
const path='docs/期末報告_江戶不打烊_修訂版.docx',entries=readZip(readFileSync(path));
const item=entries.find(([p])=>p==='word/document.xml');let xml=item[1].toString('utf8');
const pdf=JSON.parse(readFileSync('docs/evidence/final-report-revised/pdf-inspection.json','utf8'));
const clean=s=>s.normalize('NFKC').replace(/\s+/g,'');
const corrections=[];
xml=xml.replace(/<w:sdt>[\s\S]*?<\/w:sdt>/,toc=>toc.replace(/<w:hyperlink\b[^>]*w:tooltip="([^"]+)"[^>]*>[\s\S]*?<\/w:hyperlink>/g,(link,title)=>{
 const decoded=title.replaceAll('&amp;','&').replaceAll('&quot;','"');
 const page=pdf.pages.slice(2).find(p=>clean(p.text).includes(clean(decoded)))?.page;
 if(!page)throw new Error('Cannot locate heading in rendered PDF: '+title);
 const prior=link.match(/<w:t[^>]*>(\d+)<\/w:t>/)?.[1];
 if(!prior)throw new Error('TOC page field missing: '+title);
 corrections.push({title:decoded,before:Number(prior),after:page});
 return link.replace(/(<w:t[^>]*>)\d+(<\/w:t>)/g,'$1'+page+'$2');
}));
item[1]=Buffer.from(xml);writeFileSync(path,zip(entries));
writeFileSync('docs/evidence/final-report-toc.json',JSON.stringify({date:'2026-11-19',method:'Actual LibreOffice CLI PDF page locations; cached TOC values aligned, fields and bookmark destinations preserved.',corrections},null,2)+'\n');
console.log(JSON.stringify({entries:corrections.length,changed:corrections.filter(c=>c.before!==c.after)}));
