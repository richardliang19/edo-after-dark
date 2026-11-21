import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { observationQuestions, observationSources } from '../src/data/observation.ts';
import { legacyObservationVersion } from '../src/data/observation-legacy.ts';
import { parseObservationSnapshot, observationVersion } from '../src/lib/observation-session.ts';
import { formatObservationNotebook } from '../src/lib/observation-notebook.ts';
const artworks=JSON.parse(readFileSync('src/data/artworks.json','utf8'));

test('catalog IDs, eight core works and six zoom works agree with the report baseline',()=>{
 assert.equal(artworks.length,11);assert.equal(new Set(artworks.map(a=>a.id)).size,11);
 assert.equal(artworks.filter(a=>a.group==='core').length,8);
 assert.deepEqual(artworks.filter(a=>a.details.length).map(a=>a.id),['A03','A04','A05','A06','A07','A08']);
 for(const a of artworks){ assert.ok(a.title && a.artist && a.medium && a.image.sourceUrl);new URL(a.image.sourceUrl); }
});
test('every active explanation avoids unread legacy sources and has matching feedback',()=>{
 for(const q of observationQuestions){
  assert.equal(q.feedback[q.answer],'',q.id);
  for(const e of q.evidence)for(const id of e.sources){
   assert.ok(observationSources[id],`${q.id}: ${id}`);
   assert.ok(!('unverified' in observationSources[id]),`${q.id}: ${id}`);
   assert.equal(new URL(observationSources[id].url).protocol,'https:');
  }
 }
});
test('audit migration retains the exact published IDs, answer indices and personal notes',()=>{
 const old=JSON.parse(legacyObservationVersion);
 assert.equal(old.length,26);
 for(const [id,,,answer] of old)assert.equal(observationQuestions.find(q=>q.id===id).answer,answer,id);
 const ids=observationQuestions.filter(q=>q.artworkId==='A05').map(q=>q.id);
 const snapshot={version:legacyObservationVersion,mode:'painting',painting:'A05',session:ids,index:1,outcomes:{[ids[0]]:'answered'},answers:{[ids[0]]:0},notes:{[ids[0]]:'我仍有疑問：不同館方為何有不同解讀？'},view:'play'};
 assert.deepEqual(parseObservationSnapshot(JSON.stringify(snapshot)),{...snapshot,version:observationVersion});
});
test('notebook export distinguishes exhibition text from visitor writing and retains source URLs',()=>{
 const text=formatObservationNotebook({session:['moon-objects'],outcomes:{'moon-objects':'skipped'},notes:{'moon-objects':'我看到：杯碟。\n我推論：曾有人用過。\n我仍有疑問：宴席是否結束？'}});
 assert.ok(text.includes('畫面線索（展覽）'));assert.ok(text.includes('我的記錄：我看到：杯碟。'));
 assert.ok(text.includes(observationSources.moonHeritage.url));assert.ok(text.includes(observationSources.moonRutgers.url));
 assert.ok(!text.includes(observationSources.moon.url));
});
test('unverified coordinates and A01 date are left unresolved rather than invented',()=>{
 const moon=artworks.find(a=>a.id==='A05'); assert.equal(moon.location.lat,null);assert.equal(moon.location.lng,null);assert.equal(moon.location.confidence,'hypothetical');
 assert.equal(artworks.find(a=>a.id==='A01').year,null);
 assert.ok(!artworks.find(a=>a.id==='A01').summary.includes('橋上有行人'));
});
