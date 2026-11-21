// Small CDP harness for an isolated local Edge session; no browser dependency.
import { writeFileSync } from 'node:fs';
export async function connectBrowser() {
  const target = await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let seq = 0;
  const pending = new Map(), events = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(String(data));
    if (message.id) { const p = pending.get(message.id); pending.delete(message.id); message.error ? p?.reject(new Error(JSON.stringify(message.error))) : p?.resolve(message.result); }
    else events.push(message);
  };
  const send = (method, params = {}) => new Promise((resolve,reject) => { const id = ++seq; pending.set(id,{resolve,reject}); socket.send(JSON.stringify({id,method,params})); });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const waitFor = async (expression, timeout = 15000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) { if (await evaluate(expression)) return; await new Promise(r=>setTimeout(r,100)); }
    throw new Error(`Timed out: ${expression}`);
  };
  const go = async url => { await send('Page.navigate', {url}); await waitFor(`location.href === ${JSON.stringify(url)} && document.readyState !== 'loading'`, 30000); };
  const click = async selector => {
    const position = await evaluate(`(async () => { const e = document.querySelector(${JSON.stringify(selector)}); if(!e) throw new Error('Missing element'); e.scrollIntoView({behavior:'instant',block:'center'}); await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
    await send('Input.dispatchMouseEvent',{type:'mousePressed',...position,button:'left',clickCount:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',...position,button:'left',clickCount:1});
  };
  const screenshot = async path => { const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(path,Buffer.from(r.data,'base64')); };
  const waitForListener = async (selector,type) => {
    const end=Date.now()+15000;
    while(Date.now()<end){
      const object=await send('Runtime.evaluate',{expression:`document.querySelector(${JSON.stringify(selector)})`});
      if(object.result.objectId){const result=await send('DOMDebugger.getEventListeners',{objectId:object.result.objectId});await send('Runtime.releaseObject',{objectId:object.result.objectId});if(result.listeners.some(l=>l.type===type))return;}
      await new Promise(r=>setTimeout(r,100));
    }
    throw new Error(`Listener not initialized: ${selector} ${type}`);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  return { send, evaluate, waitFor, waitForListener, go, click, screenshot, events, close: async()=>{await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);socket.close();} };
}
