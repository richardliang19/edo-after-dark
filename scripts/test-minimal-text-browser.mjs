// Reuse the existing browser acceptance flow, writing this round's evidence separately.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const folder = 'docs/evidence/minimal-text-browser';
mkdirSync(folder,{recursive:true});
let code = readFileSync('scripts/test-browser.mjs','utf8')
  .replace("from './browser-cdp.mjs'", "from '../../../scripts/browser-cdp.mjs'")
  .replaceAll('docs/evidence/', folder+'/')
  .replace("date:'2026-11-18'", 'date:new Date().toISOString()');
const extra = `
await test('minimal text / eleven single summaries, time labels, retained reading path on desktop and mobile',async()=>{
 const artworks=JSON.parse(readFileSync('src/data/artworks.json','utf8'));
 const rows=[];
 for(const width of [1440,390]){
  await b.send('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
  for(const a of artworks){
   await b.go(base+'artworks/'+a.id+'/');await b.waitFor("document.querySelector('#artwork-reading')");
   const row=await value('('+(()=>{
    const a=ARTWORK;
    const badge=document.querySelector('.plain-txt .seal, .step:first-child .seal');
    return {id:a.id,summaries:[...document.querySelectorAll('main p')].filter(p=>p.textContent===a.summary).length,label:badge.textContent,sections:document.querySelectorAll('.text h2').length,readingAnchor:!!document.querySelector('#artwork-reading'),jump:!!document.querySelector('.reading-jump'),steps:document.querySelectorAll('.step').length,overflow:document.documentElement.scrollWidth>innerWidth+1};
   }).toString().replace('ARTWORK',JSON.stringify(a))+')()');
   assert.equal(row.summaries,1,a.id);assert.equal(row.label,a.curatorialTime?a.curatorialTime+'・'+a.timeLabel:a.timeLabel,a.id);
   assert.ok(row.readingAnchor);assert.ok(!row.overflow,a.id);
   if(a.details.length){assert.ok(row.jump);assert.equal(row.steps,a.details.length+2);}
   rows.push({...row,width});
   if(['B03','A05'].includes(a.id)){
    if(a.id==='A05')await value("document.querySelector('#artwork-reading').scrollIntoView()");
    await b.screenshot('docs/evidence/minimal-text-browser/'+a.id+'-'+width+'.png');
   }
  }
 }
 await b.go(base+'artworks/A05/');
 await value("document.querySelector('.reading-jump').focus()");await key('Enter');
 await b.waitFor("location.hash==='#artwork-reading'");
 return {rows,keyboardReadingJump:true};
});
`;
code=code.replace('save();await b.close();',extra+'\nsave();await b.close();');
writeFileSync(folder+'/run.mjs',code);
execFileSync(process.execPath,[folder+'/run.mjs'],{stdio:'inherit',windowsHide:true,timeout:180000});
