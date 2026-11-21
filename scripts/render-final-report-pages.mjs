import {connectBrowser} from './browser-cdp.mjs';
import {writeFileSync,mkdirSync,readFileSync,readdirSync,unlinkSync} from 'node:fs';
const b=await connectBrowser();await b.go('http://127.0.0.1:4333/');await b.waitFor('window.pdfToolsReady');
const results=[];
for(const kind of ['original','revised']){
 const count=await b.evaluate(`window.loadPdf('/${kind}.pdf')`),root=`docs/evidence/final-report-${kind}/pages`;mkdirSync(root,{recursive:true});
 for(const name of readdirSync(root)){
  const page=name.match(/^page-(\d+)\.png$/),contact=name.match(/^contact-(\d+)\.png$/);
  if((page&&Number(page[1])>count)||(contact&&Number(contact[1])>count))unlinkSync(root+'/'+name);
 }
 const pages=[];
 for(let i=1;i<=count;i++){
  const r=await b.evaluate(`(async()=>{const p=await window.pdf.getPage(${i});const t=await p.getTextContent();const v=p.getViewport({scale:1.1});const c=document.querySelector('canvas');c.width=v.width;c.height=v.height;await p.render({canvasContext:c.getContext('2d'),viewport:v}).promise;const entries=t.items.filter(x=>'str'in x).map(x=>({text:x.str,x:x.transform[4],y:x.transform[5],width:x.width,height:x.height}));const links=[];for(const a of await p.getAnnotations()){if(a.subtype!=='Link')continue;let dest=typeof a.dest==='string'?await window.pdf.getDestination(a.dest):a.dest;let destinationPage=null;if(dest&&dest[0]){destinationPage=typeof dest[0]==='number'?dest[0]+1:(await window.pdf.getPageIndex(dest[0]))+1;}links.push({url:a.url??null,destinationPage,rect:a.rect});}return {image:c.toDataURL('image/png').split(',')[1],text:entries.map(x=>x.text).join(String.fromCharCode(10)),entries,links,pageWidth:p.view[2],pageHeight:p.view[3]};})()`);
  writeFileSync(`${root}/page-${String(i).padStart(2,'0')}.png`,Buffer.from(r.image,'base64'));delete r.image;pages.push({page:i,...r});
 }
 for(let start=1;start<=count;start+=8){
  const files=Array.from({length:Math.min(8,count-start+1)},(_,i)=>({page:start+i,data:readFileSync(`${root}/page-${String(start+i).padStart(2,'0')}.png`).toString('base64')}));
  const data=await b.evaluate(`(async()=>{const files=${JSON.stringify(files)},c=document.createElement('canvas');c.width=1600;c.height=1160;const x=c.getContext('2d');x.fillStyle='#ccc';x.fillRect(0,0,c.width,c.height);for(const [i,f] of files.entries()){const img=new Image();img.src='data:image/png;base64,'+f.data;await img.decode();const a=(i%4)*400,d=Math.floor(i/4)*580;x.drawImage(img,a+8,d+24,384,543);x.fillStyle='#000';x.font='16px sans-serif';x.fillText('${kind} '+f.page,a+8,d+18);}return c.toDataURL('image/png').split(',')[1];})()`);
  writeFileSync(`${root}/contact-${start}.png`,Buffer.from(data,'base64'));
 }
 const overflows=pages.flatMap(p=>p.entries.filter(e=>e.text.trim()&&(e.x < -1 || e.x+e.width>p.pageWidth+2||e.y < -1||e.y>p.pageHeight+2)).map(e=>({page:p.page,...e})));
 writeFileSync(`docs/evidence/final-report-${kind}/pdf-inspection.json`,JSON.stringify({date:'2026-11-19',renderer:'LibreOffice 26.2.5.2 → PDF.js 6.5.438',scope:'Actual DOCX rendered to PDF, not an HTML preview',pages,overflows},null,2)+'\n');
 results.push({kind,pages:count,overflows:overflows.length});
}
console.log(JSON.stringify(results));await b.close();
