import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { observationQuestions as currentQuestions, observationSources as currentSources, selectObservationSession } from '../src/data/observation.ts';
import { observationQuestions as oldQuestions, observationSources as oldSources, selectObservationSession as oldSelect } from '../docs/evidence/minimal-text-baseline/src/data/observation.ts';
import { parseObservationSnapshot, observationVersion } from '../src/lib/observation-session.ts';

const baseline = 'docs/evidence/minimal-text-baseline/';
const manifest = JSON.parse(readFileSync(baseline+'manifest.json','utf8'));
const before = JSON.parse(readFileSync(baseline+'src/data/artworks.json','utf8'));
const after = JSON.parse(readFileSync('src/data/artworks.json','utf8'));
const hash = b => createHash('sha256').update(b).digest('hex');
const checks = [];
function check(name, fn) { fn(); checks.push({name,result:'pass'}); console.log('PASS',name); }
check('all eleven catalog records retain metadata, summaries, images, locations and detail coordinates',()=>{
  const protectedData = rows => rows.map(({ sections, details, ...a })=>({...a, details:details.map(({text,note,...d})=>d)}));
  assert.deepEqual(protectedData(after), protectedData(before));
  assert.equal(before.length,11);
});
check('question wording, choices, correct indices, feedback, hints, reflections, sources and selection logic are preserved',()=>{
  const protectedData = questions => questions.map(({evidence,...q})=>({...q,evidence:evidence.map(({text,...e})=>e)}));
  assert.deepEqual(protectedData(currentQuestions), protectedData(oldQuestions));
  assert.deepEqual(currentSources,oldSources);
  for(const mode of ['full','random','painting'])assert.deepEqual(selectObservationSession(mode,'A05',()=>0.4),oldSelect(mode,'A05',()=>0.4));
});
check('existing in-progress observations and notes still restore with exactly the same content signature',()=>{
  const version = JSON.stringify(oldQuestions.map(q=>[q.id,q.prompt,q.choices,q.answer,q.reflection]));
  assert.equal(version,observationVersion);
  const session = oldSelect('painting','A05');
  const snapshot={version,mode:'painting',painting:'A05',session,index:1,outcomes:{[session[0]]:'answered'},answers:{[session[0]]:oldQuestions.find(q=>q.id===session[0]).answer},notes:{[session[0]]:'我看到杯碟與人影。'},view:'play'};
  assert.deepEqual(parseObservationSnapshot(JSON.stringify(snapshot)),snapshot);
});
check('unrelated source files and report originals retain their baseline bytes; CSS and script blocks are unchanged',()=>{
  const edited = new Set(['src/data/artworks.json','src/data/observation.ts','src/pages/artworks/[id].astro','src/pages/curation/index.astro','src/pages/timeline/index.astro']);
  for(const entry of manifest.files)if(!edited.has(entry.file.replaceAll('\\','/')) && !entry.file.includes('~$')) assert.equal(hash(readFileSync(entry.file)),entry.sha256,entry.file);
  for(const file of [...edited].filter(f=>f.endsWith('.astro'))){
    const blocks=s=>[...s.matchAll(/<(style|script)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g)].map(m=>m[0]);
    assert.deepEqual(blocks(readFileSync(file,'utf8')),blocks(readFileSync(baseline+file,'utf8')),file);
  }
});
check('all eleven built pages render one summary and one correct time label; source links and reading anchor remain',()=>{
  for(const a of after){
    const html=readFileSync(`dist/artworks/${a.id}/index.html`,'utf8');
    const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    assert.equal([...html.matchAll(new RegExp(`<p(?:\\s[^>]*)?>${escape(a.summary)}</p>`,'g'))].length,1,a.id);
    const label=a.curatorialTime?`${a.curatorialTime}・${a.timeLabel}`:a.timeLabel;
    assert.ok(html.includes(`>${label}</span>`),`${a.id}: ${label}`);
    assert.ok(!html.includes('序章・序章'),a.id);
    assert.ok(html.includes('id="artwork-reading"'));
    if(a.details.length)assert.ok(html.includes('href="#artwork-reading"'));
    assert.ok(html.includes(a.image.sourceUrl.replaceAll('&','&amp;')),a.id);
  }
});
writeFileSync('docs/evidence/minimal-text-validation.json',JSON.stringify({date:new Date().toISOString(),checks,pass:true},null,2)+'\n');
