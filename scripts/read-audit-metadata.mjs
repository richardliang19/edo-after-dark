import { readFileSync, writeFileSync } from 'node:fs';
const requests = [
 ['commons-B02','https://commons.wikimedia.org/wiki/File:100_views_edo_100.jpg'],
 ['moon-Rutgers','https://zimmerli.rutgers.edu/node/356'],
 ['apj-A05','https://artplatform.go.jp/ja/collections/W1032257'],
 ['apj-A06','https://artplatform.go.jp/ja/collections/W1032280'],
 ['apj-A07','https://artplatform.go.jp/ja/collections/W1032276'],
 ['apj-A08','https://artplatform.go.jp/ja/collections/W1032213'],
 ['aic-A08','https://api.artic.edu/api/v1/artworks/150286'],
 ['nenzi-info','https://www.cambridge.org/core/books/japan-after-dark/3149361D47CB1F1D331909733A694D0E'],
];
for (const [id,url] of requests) {
 try {
  const r = await fetch(url,{signal:AbortSignal.timeout(25000)});
  const body = await r.text();
  if (!r.ok) { console.log(id,r.status); continue; }
  const text = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  // Commons metadata is CC BY-SA; save it for the provenance investigation.
  if (id === 'commons-B02') writeFileSync(`docs/evidence/${id}.txt`, text);
  if (id.startsWith('apj') || id.startsWith('aic')) writeFileSync(`docs/evidence/${id}.json`,JSON.stringify({id,url,status:r.status,text: id.startsWith('apj') ? text : JSON.parse(body),date:'2026-11-18'},null,2));
  if(id === 'commons-B02') { const start = text.indexOf('Summary'); console.log(id,text.slice(start,start+10500)); }
  else if(id === 'nenzi-info') { console.log(id,[...body.matchAll(/<meta[^>]+(?:citation_|dc\.)[^>]+>/g)].map(x=>x[0]).join('\n')); }
  else console.log(id,text.slice(text.indexOf('W103'),text.indexOf('W103')+2300) || text.slice(0,4500));
 } catch(e) { console.log(id,String(e)); }
}
for (const id of ['A01','A02','A03','A04','A05','A06','A07','A08']) {
 const m=JSON.parse(readFileSync(`docs/evidence/met-api-${id}.json`,'utf8'));
 console.log(JSON.stringify({id,objectID:m.objectID,title:m.title,objectDate:m.objectDate,objectName:m.objectName,accession:m.accessionNumber,medium:m.medium,dimensions:m.dimensions,image:m.primaryImage,isPublicDomain:m.isPublicDomain,rightsAndReproduction:m.rightsAndReproduction}));
}
