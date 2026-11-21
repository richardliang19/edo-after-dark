import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const out = 'docs/evidence';
mkdirSync(`${out}/images`, { recursive: true });
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const artworks = JSON.parse(readFileSync('src/data/artworks.json', 'utf8'));
const baseline = { date: '2026-11-18', commit: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'), initialStatus: git('status', '--short'), node: process.version, artworks: artworks.map(a => ({ id: a.id, title: a.title, details: a.details.length, image: a.image.src })), note: 'Initial working tree was clean before audit deliverables were created. No DOCX/PDF was found in the workspace, parent directory or supplied ZIP.' };
if (!existsSync(`${out}/baseline.json`)) writeFileSync(`${out}/baseline.json`, JSON.stringify(baseline, null, 2) + '\n');
const results = [];
for (let offset = 0; offset < artworks.length; offset += 3) {
  results.push(...await Promise.all(artworks.slice(offset, offset + 3).map(async a => {
    try {
      const response = await fetch(a.image.src, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const path = `${out}/images/${a.id}.jpg`;
      writeFileSync(path, buffer);
      return { id: a.id, url: a.image.src, path, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), status: response.status, date: '2026-11-18' };
    } catch (error) { return { id: a.id, url: a.image.src, error: String(error), date: '2026-11-18' }; }
  })));
  console.log(JSON.stringify(results.slice(offset)));
}
writeFileSync(`${out}/image-downloads.json`, JSON.stringify(results, null, 2) + '\n');
