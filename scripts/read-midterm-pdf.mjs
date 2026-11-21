import { connectBrowser } from './browser-cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const b=await connectBrowser();
await b.go('http://127.0.0.1:4332/');await b.waitFor('window.pdfToolsReady');
const count=await b.evaluate("window.loadPdf('/source.pdf')");
const pages=[];
mkdirSync('docs/evidence/recovered/pages',{recursive:true});
for(let i=1;i<=count;i++){
 const page=await b.evaluate(`(async()=>{const p=await window.pdf.getPage(${i});const text=await p.getTextContent();return {page:${i},text:text.items.filter(x=>'str'in x).map(x=>x.str).join(String.fromCharCode(10))};})()`);pages.push(page);
 const data=await b.evaluate(`(async()=>{const p=await window.pdf.getPage(${i});const v=p.getViewport({scale:.8});const canvas=document.querySelector('canvas');canvas.width=v.width;canvas.height=v.height;await p.render({canvasContext:canvas.getContext('2d'),viewport:v}).promise;return canvas.toDataURL('image/png').split(',')[1];})()`);
 writeFileSync(`docs/evidence/recovered/pages/midterm-${String(i).padStart(2,'0')}.png`,Buffer.from(data,'base64'));
}
writeFileSync('docs/evidence/recovered/midterm-pdf-text.json',JSON.stringify({sourceCommit:'f6f3650',type:'本組期中報告，非期末原稿／教師範例',pages},null,2)+'\n');
console.log(JSON.stringify({pages:count,characters:pages.reduce((n,p)=>n+p.text.length,0)}));await b.close();
