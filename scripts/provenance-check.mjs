import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const results=[];
for(const id of ['B02','B03']) {
 const a=JSON.parse(readFileSync('src/data/artworks.json','utf8')).find(a=>a.id===id);
 const r=await fetch(a.image.sourceUrl,{signal:AbortSignal.timeout(25000)});
 const html=await r.text();
 const links=[...html.matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].filter(m=> /brooklynmuseum\.org/.test(m[1])).map(m=>({url:m[1].replaceAll('&amp;','&'),label:m[2].replace(/<[^>]+>/g,'')}));
 results.push({id,url:a.image.sourceUrl,status:r.status,links,date:'2026-11-18'});
 console.log(id,JSON.stringify(links));
}
const a=JSON.parse(readFileSync('src/data/artworks.json','utf8')).find(a=>a.id==='B02');
const r=await fetch(a.image.src,{headers:{'User-Agent':'EdoAfterDarkStudentAudit/1.0 (educational source verification)'},signal:AbortSignal.timeout(25000)});
if(r.ok){const bytes=Buffer.from(await r.arrayBuffer());writeFileSync('docs/evidence/images/B02.jpg',bytes);const data=JSON.parse(readFileSync('docs/evidence/image-downloads.json','utf8'));Object.assign(data.find(d=>d.id==='B02'),{status:200,path:'docs/evidence/images/B02.jpg',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),error:undefined});writeFileSync('docs/evidence/image-downloads.json',JSON.stringify(data,null,2)+'\n');}console.log('B02 image:',r.status);
writeFileSync('docs/evidence/commons-source-links.json',JSON.stringify(results,null,2)+'\n');
