import { connectBrowser } from './browser-cdp.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const cdp = await connectBrowser();
const url='https://upload.wikimedia.org/wikipedia/commons/e/e6/100_views_edo_100.jpg';
await cdp.go(url);
await cdp.waitFor('document.images.length && document.images[0].complete',15000).catch(()=>{});
const result=await cdp.evaluate('({title:document.title,image:document.images[0] ? {src:document.images[0].src,width:document.images[0].naturalWidth,height:document.images[0].naturalHeight}:null,text:document.body.innerText.slice(0,500)})');
console.log(JSON.stringify(result));
if(result.image?.src === url && result.image.width === 789 && result.image.height === 1200) {
 const resource=await cdp.send('Page.getResourceContent',{frameId:(await cdp.send('Page.getFrameTree')).frameTree.frame.id,url});
 const buffer=Buffer.from(resource.content,resource.base64Encoded?'base64':'utf8');
 writeFileSync('docs/evidence/images/B02.jpg',buffer);
 const data=JSON.parse(readFileSync('docs/evidence/image-downloads.json','utf8'));
 Object.assign(data.find(d=>d.id==='B02'),{status:200,path:'docs/evidence/images/B02.jpg',bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex'),error:undefined});
 writeFileSync('docs/evidence/image-downloads.json',JSON.stringify(data,null,2)+'\n');
}
await cdp.screenshot('docs/evidence/B02-browser.png');
await cdp.close();
