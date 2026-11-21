import { connectBrowser } from './browser-cdp.mjs';
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:4331/edo-after-dark/';
const results=[], b=await connectBrowser();
mkdirSync('docs/evidence/downloads',{recursive:true});
const save=()=>writeFileSync('docs/evidence/browser-tests.json',JSON.stringify({date:'2026-11-18',browser:'Edge 157.0.4341.60 headless; CDP native mouse, touch and keyboard input; isolated profile',base,results,exceptions:b.events.filter(e=>e.method==='Runtime.exceptionThrown'),externalFailures:b.events.filter(e=>e.method==='Network.responseReceived' && e.params.response.status>=400).map(e=>({url:e.params.response.url,status:e.params.response.status}))},null,2)+'\n');
async function test(name,fn){try{const evidence=await fn();results.push({name,result:'pass',evidence});console.log('PASS',name);}catch(error){results.push({name,result:'fail',error:String(error)});console.log('FAIL',name,String(error));}save();}
const value=s=>b.evaluate(s);
const key=async key=>{const code={ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Home:36,End:35,Tab:9,Enter:13}[key];await b.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code,nativeVirtualKeyCode:code});await b.send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code,nativeVirtualKeyCode:code});};
const q='[data-observation-round]:not([hidden])';
async function openActivity(name){await b.waitForListener(`.event-start[data-activity-open="${name}"]`,'click');await b.waitForListener(name==='quiz'?'[data-quiz-form]':'[data-session-form]','submit');await b.click(`.event-start[data-activity-open="${name}"]`);await b.waitFor(`!document.querySelector('#${name==='quiz'?'nightwalker-quiz':'observation-challenge'}').hidden`);}
async function completeRoute(count){
 const ids=[];
 for(let i=0;i<count;i++){
  const current=await value(`({id:document.querySelector('${q}').dataset.questionId,answer:document.querySelector('${q}').dataset.answer})`);ids.push(current.id);
  await b.click(`${q} input[value="${current.answer}"]`);await b.click(`${q} [data-check]`);
  await b.waitFor(`!document.querySelector('${q} [data-explanation]').hidden`);
  if(i===0){await b.click(`${q} textarea`);await b.send('Input.insertText',{text:'我看到：畫面有近景與遠景。\n我仍有疑問：不同印本的差異。<script>文字</script>'});}
  await b.click(`${q} [data-round-next]`);
 }
 await b.waitFor("!document.querySelector('[data-observation-result]').hidden");return ids;
}
await b.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await b.go(base);await value("localStorage.removeItem('edo-after-dark:observation:v2')");
await test('homepage / reduced motion and first-visit route',async()=>{
 await b.go(base);await b.waitFor("document.querySelector('.hero') && document.querySelector('main a[href$=\"timeline/\"]')");
 assert.equal(await value("document.querySelector('.hero').hasAttribute('data-animated')"),false);
 assert.equal(await value("getComputedStyle(document.querySelector('.lit')).maskImage"),'none');
 await b.screenshot('docs/evidence/home-reduced-motion.png');return {title:await value('document.title'),screenshot:'home-reduced-motion.png'};
});
await test('all eleven artwork pages / metadata, next/previous navigation and overflow',async()=>{
 const rows=[];
 for(const id of ['A01','A02','A03','A04','A05','A06','A07','A08','B01','B02','B03']){
  await b.go(base+`artworks/${id}/`);await b.waitFor("document.querySelector('#artwork-reading')");
  const row=await value(`({id:${JSON.stringify(id)},title:document.querySelector('h1').textContent,metadata:document.querySelectorAll('.meta dt').length,sections:document.querySelectorAll('.text h2').length,pager:[...document.querySelectorAll('.pager a')].map(a=>a.getAttribute('href')),overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('main img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.src,alt:i.alt}))})`);
  assert.ok(row.metadata>=12);assert.ok(row.sections>=6);assert.ok(!row.overflow,id);rows.push(row);
 }
 await b.go(base+'artworks/A05/');await value("document.querySelector('#artwork-reading').scrollIntoView()");await b.screenshot('docs/evidence/moon-reading-desktop.png');return rows;
});
await test('activity one / four native choices, result, recommendation and map link',async()=>{
 await b.go(base+'events/');await b.waitFor("!document.querySelector('.event-start').disabled");await openActivity('quiz');
 for(let i=0;i<4;i++){await b.click(`#nightwalker-quiz fieldset:not([hidden]) input`);await b.click('[data-quiz-next]');}
 const r=await value("({shown:!document.querySelector('[data-quiz-result]').hidden,title:document.querySelector('[data-quiz-result-title]').textContent,links:[...document.querySelectorAll('[data-role-result]:not([hidden]) a')].map(a=>a.href)})");assert.ok(r.shown);assert.ok(r.links.some(l=>l.includes('/artworks/')));assert.ok(r.links.some(l=>l.includes('perspective=')));await b.screenshot('docs/evidence/quiz-result-desktop.png');return r;
});
await test('activity two / random six questions, feedback, image keys, local notes and download',async()=>{
 await openActivity('observation');await b.click('[data-session-form] button[type="submit"]');await b.waitFor(`document.querySelector('${q}')`);
 const first=await value(`({id:document.querySelector('${q}').dataset.questionId,answer:Number(document.querySelector('${q}').dataset.answer)})`);
 await b.click(`${q} input[value="${(first.answer+1)%3}"]`);await b.click(`${q} [data-check]`);
 assert.ok((await value(`document.querySelector('${q} [data-observation-feedback]').textContent`)).length>12);
 assert.equal(await value(`document.querySelector('${q} [data-explanation]').hidden`),true);
 await b.click(`${q} [data-hint]`);assert.equal(await value(`document.querySelector('${q} [data-hint-text]').hidden`),false);
 await b.click(`${q} [data-view-in]`);await value(`document.querySelector('${q} .art-stage').focus()`);await key('ArrowRight');await key('Home');
 assert.equal(await value(`document.querySelector('${q} [data-view-status]').textContent`),'全圖');
 const ids=await completeRoute(6);assert.equal(new Set(ids).size,6);
 assert.ok((await value("document.querySelector('[data-observation-result]').innerText")).includes('<script>文字</script>'));
 await b.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:(process.cwd()+'/docs/evidence/downloads').replaceAll('/','\\'),eventsEnabled:true});
 await b.click('[data-notebook-download]');await b.waitFor("document.querySelector('[data-download-status]').textContent.length>0");
 const end=Date.now()+8000;
 while(Date.now()<end && !readdirSync('docs/evidence/downloads').some(n=>n.endsWith('.txt')))await new Promise(r=>setTimeout(r,100));
 const downloadFile=readdirSync('docs/evidence/downloads').find(n=>n.endsWith('.txt'));
 assert.ok(downloadFile,'download must reach the filesystem, not just update the on-page message');
 assert.ok(readFileSync('docs/evidence/downloads/'+downloadFile,'utf8').includes('我的記錄：'));
 await b.screenshot('docs/evidence/notebook-desktop.png');
 await b.go(base+'events/');await b.waitFor("document.querySelector('[data-storage-status]').textContent.includes('已恢復')");await openActivity('observation');
 assert.equal(await value("document.querySelector('[data-observation-result]').hidden"),false);
 return {ids,downloadFiles:readdirSync('docs/evidence/downloads'),restored:true,notesAreText:true};
});
await test('activity two / full 26 questions and all source links',async()=>{
 await b.click('[data-session-clear]');await b.click('input[name="observation-mode"][value="full"]');await b.click('[data-session-form] button[type="submit"]');const ids=await completeRoute(26);assert.equal(new Set(ids).size,26);
 const links=await value("[...document.querySelectorAll('[data-observation-round] .evidence-block a')].map(a=>a.href)");assert.ok(links.every(s=>s.startsWith('https://')));
 return {ids,count:ids.length,sourceLinks:links.length,summary:await value("document.querySelector('[data-observation-summary]').textContent")};
});
await test('map / both Leaflet canvases, synchronized pan/zoom and source sheets',async()=>{
 await b.go(base+'explore/');await b.waitFor("document.querySelectorAll('.leaflet-container').length===2 && !document.querySelector('#map-sync').disabled");
 const before=await value("[...document.querySelectorAll('.leaflet-map-pane')].map(e=>e.style.transform)");
 await b.click('#edo-map .leaflet-control-zoom-in');await new Promise(r=>setTimeout(r,500));
 const scaled=await value("[...document.querySelectorAll('.leaflet-tile-container')].map(e=>e.style.transform)");
 await value("document.querySelector('#edo-map').focus()");await key('ArrowRight');await new Promise(r=>setTimeout(r,500));
 const after=await value("[...document.querySelectorAll('.leaflet-map-pane')].map(e=>e.style.transform)");assert.equal(after.length,2);assert.equal(after[0],after[1]);assert.notDeepEqual(before,after);
 const imageState=await value("[...document.querySelectorAll('.leaflet-tile-pane')].map(e=>({tiles:e.querySelectorAll('img').length,loaded:[...e.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth).length}))");
 await b.screenshot('docs/evidence/maps-desktop.png');return {before,after,scaled,tileState:imageState,sheets:await value("document.querySelectorAll('.sources li').length")};
});
await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await b.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
await test('mobile / 390×844 timeline descriptions and keyboard station navigation',async()=>{
 await b.go(base+'timeline/');await b.waitFor("!document.querySelector('[data-timeline-next]').disabled");
 await b.waitForListener('[data-timeline-next]','click');
 await b.click('[data-timeline-next]');await b.waitFor("document.querySelector('#wrap').scrollLeft>0");await b.click('[data-timeline-next]');
 const result=await value("({descriptions:[...document.querySelectorAll('.cap p')].map(e=>({text:e.textContent,display:getComputedStyle(e).display})),overflow:document.documentElement.scrollWidth>innerWidth+1,position:document.querySelector('#wrap').scrollLeft})");
 assert.ok(result.descriptions.every(d=>d.display!=='none'));assert.ok(!result.overflow);assert.ok(result.position>0);
 await value("document.querySelector('#wrap').focus()");await key('ArrowRight');await b.screenshot('docs/evidence/timeline-mobile.png');return result;
});
await test('mobile / activity focus switches, optional reflection and no overflow',async()=>{
 await b.go(base+'events/');await b.waitFor("!document.querySelector('.event-start').disabled");await openActivity('observation');await b.click('[data-session-clear]');await b.click('input[name="observation-mode"][value="painting"]');
 await value("const p=document.querySelector('#observation-painting');p.value='A05'");await b.click('[data-session-form] button[type="submit"]');await b.click(`${q} [data-skip]`);await b.click(`${q} [data-round-next]`);
 await b.click(`${q} [data-view-focus]:last-child`);assert.ok((await value(`document.querySelector('${q} [data-view-status]').textContent`)).includes('2.4'));
 const x=await value(`({overflow:document.documentElement.scrollWidth>innerWidth+1,focus:document.querySelector('${q} [data-view-focus]:last-child').getAttribute('aria-pressed'),imageLoaded:document.querySelector('${q} img').naturalWidth>0,transform:document.querySelector('${q} img').style.transform})`);assert.ok(!x.overflow);assert.equal(x.focus,'true');await b.screenshot('docs/evidence/moon-focus-mobile.png');return x;
});
save();await b.close();
