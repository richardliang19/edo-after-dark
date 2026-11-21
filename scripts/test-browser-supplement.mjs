import {connectBrowser} from './browser-cdp.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const b=await connectBrowser(),base='http://127.0.0.1:4331/edo-after-dark/',results=[];
const key=async(key,code)=>{for(const type of ['keyDown','keyUp'])await b.send('Input.dispatchKeyEvent',{type,key,code:key===' '?'Space':key,windowsVirtualKeyCode:code,nativeVirtualKeyCode:code,...(type==='keyDown'&&key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});};
async function test(name,fn){try{results.push({name,result:'pass',evidence:await fn()});console.log('PASS',name);}catch(error){results.push({name,result:'fail',error:String(error)});console.log('FAIL',name,String(error));}}
await b.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
await test('desktop GSAP timeline / next stations, keyboard End and Home',async()=>{
 await b.go(base+'timeline/');await b.waitFor("document.documentElement.hasAttribute('data-timeline-animated') && !document.querySelector('[data-timeline-next]').disabled");await b.waitForListener('[data-timeline-next]','click');
 const positions=[];
 for(let i=0;i<4;i++){await b.click('[data-timeline-next]');await new Promise(r=>setTimeout(r,250));positions.push(await b.evaluate("({y:scrollY,x:getComputedStyle(document.querySelector('#track')).transform,label:document.querySelector('#nowLabel').textContent})"));}
 assert.ok(positions.every((p,i)=>i===0||p.y>positions[i-1].y));
 await b.evaluate("document.querySelector('#wrap').focus()");await key('End',35);await b.waitFor("document.querySelector('[data-timeline-next]').disabled");
 const end=await b.evaluate("({label:document.querySelector('#nowLabel').textContent,y:scrollY})");
 await key('Home',36);await b.waitFor("document.querySelector('[data-timeline-prev]').disabled");
 await b.screenshot('docs/evidence/timeline-motion-desktop.png');return {positions,end,home:await b.evaluate('scrollY')};
});
await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await test('artwork image network failure / readable text and source fallback',async()=>{
 await b.send('Network.setCacheDisabled',{cacheDisabled:true});await b.send('Network.setBlockedURLs',{urls:['*images.metmuseum.org*DP121524*']});
 await b.go(base+'artworks/A03/');await b.waitFor("!document.querySelector('[data-artwork-image-error]').hidden");
 const r=await b.evaluate("({fallback:document.querySelector('[data-artwork-image-error]').textContent,source:document.querySelector('[data-artwork-image-error] a').href,readable:document.querySelector('#artwork-reading').textContent.length>200,sectionCount:document.querySelectorAll('.text h2').length})");assert.ok(r.readable);assert.ok(r.sectionCount>=6);assert.ok(r.source.startsWith('https://www.metmuseum.org/'));
 await b.send('Network.setBlockedURLs',{urls:[]});return r;
});
await test('activity keyboard controls and native mobile touch image pan',async()=>{
 await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await b.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
 await b.go(base+'events/');await b.waitFor("!document.querySelector('.event-start[data-activity-open=observation]').disabled");await b.waitForListener('.event-start[data-activity-open="observation"]','click');await b.waitForListener('[data-session-form]','submit');
 await b.evaluate("document.querySelector('.event-start[data-activity-open=observation]').focus()");await key('Enter',13);await b.waitFor("!document.querySelector('#observation-challenge').hidden");
 if(await b.evaluate("!document.querySelector('[data-session-clear]').hidden")){await b.evaluate("document.querySelector('[data-session-clear]').focus()");await key('Enter',13);}
 await b.evaluate("document.querySelector('[data-session-form] button[type=submit]').focus()");await key('Enter',13);await b.waitFor("document.querySelector('[data-observation-round]:not([hidden])')");
 const q='[data-observation-round]:not([hidden])';
 const answer=await b.evaluate(`Number(document.querySelector('${q}').dataset.answer)`);
 await b.evaluate(`document.querySelector('${q} input[value="${answer}"]').focus()`);await key(' ',32);
 await b.evaluate(`document.querySelector('${q} [data-check]').focus()`);await key('Enter',13);await b.waitFor(`!document.querySelector('${q} [data-explanation]').hidden`);
 await b.click(`${q} [data-view-in]`);
 const rect=await b.evaluate(`(async()=>{const e=document.querySelector('${q} .art-stage');e.scrollIntoView({block:'center',behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`);
 const before=await b.evaluate(`document.querySelector('${q} img').style.transform`);
 await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...rect,id:1,radiusX:2,radiusY:2,force:1}]});
 await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:rect.x-45,y:rect.y-30,id:1,radiusX:2,radiusY:2,force:1}]});
 await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const after=await b.evaluate(`document.querySelector('${q} img').style.transform`);assert.notEqual(after,before);
 await b.screenshot('docs/evidence/activity-touch-mobile.png');return {answerRevealed:true,before,after,scope:'Keyboard controls tested using explicit focus; not a complete Tab-order or screen-reader review. Touch is browser emulation, not a physical handset.'};
});
writeFileSync('docs/evidence/browser-supplement.json',JSON.stringify({date:'2026-11-18',results,exceptions:b.events.filter(e=>e.method==='Runtime.exceptionThrown')},null,2)+'\n');await b.close();
if(results.some(r=>r.result!=='pass'))process.exitCode=1;
