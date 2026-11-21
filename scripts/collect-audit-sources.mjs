import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
mkdirSync('docs/evidence', { recursive: true });
const artworks = JSON.parse(readFileSync('src/data/artworks.json', 'utf8'));
const extra = [
 ['moonHeritage', 'https://online.bunka.go.jp/heritages/detail/559992'],
 ['moonCornell', 'https://emuseum.cornell.edu/objects/33493/moonviewing-point-from-the-series-one-hundred-famous-views'],
 ['moonSeattle', 'https://art.seattleartmuseum.org/objects/34881'],
 ['dawnOxford', 'https://jameelcentre.ashmolean.org/collection/921/object/21196'],
 ['cleveland', 'https://www.clevelandart.org/art/1940.986'],
 ['geidai', 'https://museum.geidai.ac.jp/en/exhibit/2024/03/yoshiwara.html'],
 ['keio', 'https://dcollections.lib.keio.ac.jp/en/ukiyoe/0456'],
 ['ndlEmbankment', 'https://ndlsearch.ndl.go.jp/books/R100000094-I906'],
 ['fitz', 'https://nightoflonging.fitzmuseum.cam.ac.uk/explore/sex-for-sale'],
 ['surugaBrooklyn', 'https://artsandculture.google.com/asset/suruga-cho-no-8-in-one-hundred-famous-views-of-edo-utagawa-hiroshige-ando-japanese-1797-1858/KgG9YbG9Rf98Vg'],
 ['bridgeNdl', 'https://www.ndl.go.jp/landmarks/sights/ryogokubashi'],
 ['bridgesSumida', 'https://www.city.sumida.lg.jp/sisetu_info/siryou/kyoudobunka/sonota/tenzi/h14/kikakuten_sumidagawa_hasi.html'],
 ['yanagibashi', 'https://www.culture.city.taito.lg.jp/bunkatanbou/landscape/japanese/taito_01.html'],
 ['mitsui', 'https://www.mitsuipr.com/history/columns/010/'],
 ['fireworksModern', 'https://sumidagawa-hanabi.com/about/'],
 ['festivalModern', 'https://www.city.taito.lg.jp/event/kanko/torinoithi.html'],
 ['festivalNdl', 'https://www.ndl.go.jp/imagebank/column/torinoichi'],
 ['icom', 'https://icom.museum/en/resources/standards-guidelines/museum-definition/'],
 ['nenzi', 'https://www.cambridge.org/core/books/japan-after-dark/3149361D47CB1F1D331909733A694D0E'],
 ['stanley', 'https://www.ucpress.edu/book/9780520270909/selling-women'],
 ['metRights', 'https://www.metmuseum.org/hubs/open-access'],
 ['wcag', 'https://www.w3.org/TR/WCAG22/'],
 ['codh', 'https://codh.rois.ac.jp/edo-maps/'],
 ['live', 'https://richardliang19.github.io/edo-after-dark/'],
 ['yoshiwaraPdf', 'https://www.city.taito.lg.jp/library/service/sonota/pathfinder.files/kyodo_no5_yoshiwara4.pdf'],
];
const urls = [...artworks.map(a => [a.id, a.image.sourceUrl]), ...extra,
 ...['03','05','16','17','21'].map(s => [`codh-${s}`, `https://codh.rois.ac.jp/edo-maps/owariya/${s}/georef/`]),
 ...[4908,4902,4930,4931,4935].map(id => [`map-${id}`, `https://mapwarper.h-gis.jp/maps/${id}.json`]),
 ...artworks.filter(a => a.id.startsWith('A')).map(a => [`met-api-${a.id}`, `https://collectionapi.metmuseum.org/public/collection/v1/objects/${a.image.sourceUrl.split('/').pop()}`]),
];
const results = [];
for (let i = 0; i < urls.length; i += 4) {
 for (const result of await Promise.all(urls.slice(i, i + 4).map(async ([id, url]) => {
  try {
   const r = await fetch(url, { headers: { 'User-Agent': 'EdoAfterDarkStudentAudit/1.0 (educational source verification)' }, signal: AbortSignal.timeout(25000) });
   const buffer = Buffer.from(await r.arrayBuffer());
   const contentType = r.headers.get('content-type') ?? '';
   // Save machine-readable public metadata, and the supplied public library PDF.
   // HTML evidence is represented by a hash, URL and manually reviewed locators.
   let path;
   if (r.ok && (contentType.includes('json') || id === 'yoshiwaraPdf')) {
     path = `docs/evidence/${id}.${id === 'yoshiwaraPdf' ? 'pdf' : 'json'}`;
     writeFileSync(path, buffer);
   }
   if (r.ok && id === 'live') writeFileSync('docs/evidence/live-index.html', buffer);
   const title = contentType.includes('html') ? buffer.toString().match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() : undefined;
   return { id, url, finalUrl: r.url, status: r.status, contentType, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), title, path, date: '2026-11-18', caution: 'HTTP success is not historical verification; see sources.json and evidence-register.csv for what was actually readable and supported.' };
  } catch (e) { return { id, url, error: String(e), date: '2026-11-18' }; }
 }))) { results.push(result); console.log(`${result.id}: ${result.status ?? result.error}`); }
 writeFileSync('docs/evidence/source-fetches.json', JSON.stringify(results, null, 2) + '\n');
}
// One later retry for the two images initially rate-limited by Commons.
const downloads = JSON.parse(readFileSync('docs/evidence/image-downloads.json','utf8'));
for (const id of ['B01','B02']) {
 const a = artworks.find(a => a.id === id);
 const response = await fetch(a.image.src, { signal: AbortSignal.timeout(25000) });
 if (!response.ok) { console.log(`${id} image retry: HTTP ${response.status}`); continue; }
 const data = Buffer.from(await response.arrayBuffer()), path = `docs/evidence/images/${id}.jpg`;
 writeFileSync(path, data);
 Object.assign(downloads.find(x => x.id === id), { path, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), status: 200, error: undefined });
}
writeFileSync('docs/evidence/image-downloads.json', JSON.stringify(downloads,null,2) + '\n');
