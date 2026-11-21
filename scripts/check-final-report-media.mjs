import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readZip} from './ooxml-package.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const reports={original:'../期末報告_江戶不打烊.docx',revised:'docs/期末報告_江戶不打烊_修訂版.docx'};
const result={};
for(const [name,path] of Object.entries(reports)){
 const entries=readZip(readFileSync(path));
 result[name]={packageBytes:readFileSync(path).length,media:entries.filter(([p])=>p.startsWith('word/media/')).map(([p,b])=>({path:p,bytes:b.length,sha256:hash(b)}))};
 mkdirSync(`docs/evidence/final-report-${name}/media`,{recursive:true});
 for(const [p,b] of entries.filter(([p])=>p.startsWith('word/media/')))writeFileSync(`docs/evidence/final-report-${name}/media/${p.split('/').pop()}`,b);
}
result.allOriginalImageBytesPreserved=result.original.media.every(m=>result.revised.media.some(n=>n.sha256===m.sha256));
writeFileSync('docs/evidence/final-report-media.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
