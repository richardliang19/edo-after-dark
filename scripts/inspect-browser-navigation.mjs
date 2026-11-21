import { connectBrowser } from './browser-cdp.mjs';
const b=await connectBrowser();
await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await b.go('http://127.0.0.1:4331/edo-after-dark/timeline/');await b.waitFor("document.querySelector('[data-timeline-next]')");
const inspect=()=>b.evaluate("({ready:document.readyState,width:innerWidth,height:innerHeight,reduce:matchMedia('(prefers-reduced-motion:reduce)').matches,position:document.querySelector('#wrap').scrollLeft,panelOffsets:[...document.querySelectorAll('.panel')].map(x=>x.offsetLeft),buttonDisabled:document.querySelector('[data-timeline-next]').disabled,buttonRect:document.querySelector('[data-timeline-next]').getBoundingClientRect().toJSON(),scrollHeight:document.documentElement.scrollHeight,active:document.activeElement?.outerHTML.slice(0,100)})");
console.log('before',JSON.stringify(await inspect()));await b.click('[data-timeline-next]');await new Promise(r=>setTimeout(r,800));console.log('after',JSON.stringify(await inspect()));
await b.evaluate("document.querySelector('#wrap').focus()");await b.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39,nativeVirtualKeyCode:39});await b.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39,nativeVirtualKeyCode:39});await new Promise(r=>setTimeout(r,200));console.log('key',JSON.stringify(await inspect()));
await b.screenshot('docs/evidence/timeline-mobile-diagnostic.png');await b.close();
