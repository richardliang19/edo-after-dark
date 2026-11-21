// Browser printing is an HTML preview, never evidence of Word pagination.
import {connectBrowser} from './browser-cdp.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const b=await connectBrowser();
await b.send('Emulation.setDeviceMetricsOverride',{width:1100,height:1000,deviceScaleFactor:1,mobile:false});
await b.go('about:blank');
await b.send('Page.setDocumentContent',{frameId:(await b.send('Page.getFrameTree')).frameTree.frame.id,html:readFileSync('docs/report-draft.html','utf8')});
await b.evaluate('document.fonts.ready.then(()=>true)');
const print=await b.send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#666">HTML 預覽（非 Word 分頁）｜<span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
writeFileSync('docs/期末報告_江戶不打烊_分章修訂稿_HTML預覽.pdf',Buffer.from(print.data,'base64'));
await b.go('http://127.0.0.1:4332/');await b.waitFor('window.pdfToolsReady');
const count=await b.evaluate("window.loadPdf('/draft-preview.pdf')");
mkdirSync('docs/evidence/report-preview',{recursive:true});
const pages=[];
for(let i=1;i<=count;i++){
 const record=await b.evaluate(`(async()=>{const p=await window.pdf.getPage(${i});const t=await p.getTextContent();const v=p.getViewport({scale:.8});const c=document.querySelector('canvas');c.width=v.width;c.height=v.height;await p.render({canvasContext:c.getContext('2d'),viewport:v}).promise;return {text:t.items.filter(x=>'str'in x).map(x=>x.str).join(String.fromCharCode(10)),image:c.toDataURL('image/png').split(',')[1],width:v.width,height:v.height};})()`);
 writeFileSync(`docs/evidence/report-preview/page-${String(i).padStart(2,'0')}.png`,Buffer.from(record.image,'base64'));
 pages.push({page:i,text:record.text,width:record.width,height:record.height});
}
// Contact sheets for inspection; full-size renders remain available.
for(let start=1;start<=count;start+=8){
 const files=Array.from({length:Math.min(8,count-start+1)},(_,i)=>({page:start+i,data:readFileSync(`docs/evidence/report-preview/page-${String(start+i).padStart(2,'0')}.png`).toString('base64')}));
 const sheet=await b.evaluate(`(async()=>{const files=${JSON.stringify(files)};const c=document.createElement('canvas');c.width=1600;c.height=1160;const x=c.getContext('2d');x.fillStyle='#ddd';x.fillRect(0,0,c.width,c.height);for(const [i,f] of files.entries()){const img=new Image();img.src='data:image/png;base64,'+f.data;await img.decode();const left=(i%4)*400,top=Math.floor(i/4)*580;x.drawImage(img,left+8,top+22,384,544);x.fillStyle='#000';x.font='16px sans-serif';x.fillText('Page '+f.page,left+8,top+17);}return c.toDataURL('image/png').split(',')[1];})()`);
 writeFileSync(`docs/evidence/report-preview/contact-${start}.png`,Buffer.from(sheet,'base64'));
}
writeFileSync('docs/evidence/report-preview/inspection.json',JSON.stringify({date:'2026-11-18',renderer:'Edge HTML print → PDF.js',scope:'HTML preview only; not Word DOCX page-layout verification',pages},null,2)+'\n');
console.log(JSON.stringify({htmlPreviewPages:count,wordPdf:false,renderedAllPages:true}));await b.close();
