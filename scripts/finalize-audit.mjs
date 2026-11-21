import {readFileSync,writeFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,relative,dirname} from 'node:path';
const sha=b=>createHash('sha256').update(b).digest('hex');
const clean=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const live=readFileSync('docs/evidence/live-index.html','utf8'),built=readFileSync('dist/index.html','utf8');
writeFileSync('docs/evidence/live-comparison.json',JSON.stringify({date:'2026-11-18',comparisonRegenerated:'2026-11-19',liveUrl:'https://richardliang19.github.io/edo-after-dark/',scope:'Baseline live homepage snapshot versus current local built homepage only; not a live deployment or an audit of every deployed page. Snapshot read on November 18, not fetched again on November 19.',liveSha256:sha(live),localSha256:sha(built),liveIntro:clean(live).match(/江戶入夜後[\s\S]*?閱讀策展理念/)?.[0],localIntro:clean(built).match(/江戶入夜後[\s\S]*?閱讀策展理念/)?.[0],firstVisitLinkAdded:built.includes('第一次來')&&!live.includes('第一次來'),deployed:false},null,2)+'\n');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=dir+'/'+e.name;return e.isDirectory()?walk(p):[p];});
const targets=[...walk('src'),...walk('public/concepts'),...walk('tests'),...readdirSync('docs').filter(n=>!statSync('docs/'+n).isDirectory()).map(n=>'docs/'+n),'.gitignore'];
writeFileSync('docs/evidence/deliverable-hashes.json',JSON.stringify({date:'2026-11-19',files:targets.map(path=>({path,bytes:statSync(path).size,sha256:sha(readFileSync(path))}))},null,2)+'\n');
const broken=[];
for(const path of walk('docs').filter(p=>p.endsWith('.md'))){
 const text=readFileSync(path,'utf8');
 for(const m of text.matchAll(/\]\(([^)]+)\)/g)){
  const target=m[1].replace(/^<|>$/g,'').split('#')[0];
  if(!target||/^[a-z]+:/i.test(target)||target.startsWith('/'))continue;
  if(!existsSync(resolve(dirname(path),decodeURIComponent(target))))broken.push({file:path,target});
 }
}
const diff=execFileSync('git',['diff','--check'],{encoding:'utf8'});
const status=execFileSync('git',['status','--short'],{encoding:'utf8'});
const protectedFiles=['package.json','package-lock.json','astro.config.mjs','.github/workflows/deploy.yml'];
const unchanged=protectedFiles.map(path=>({path,unchanged:execFileSync('git',['diff','--name-only','b61293f','--',path],{encoding:'utf8'}).trim()==='',comparison:'Git comparison with configured line-ending normalization'}));
const docx=execFileSync('powershell.exe',['-NoProfile','-Command',"Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead((Resolve-Path 'docs/期末報告_江戶不打烊_修訂版.docx')); try {$r=[IO.StreamReader]::new($z.GetEntry('word/document.xml').Open());$s=$r.ReadToEnd();$r.Dispose();Write-Output $s} finally {$z.Dispose()}"],{encoding:'utf8',maxBuffer:4*1024*1024});
const reportValidation=JSON.parse(readFileSync('docs/evidence/final-report-validation.json','utf8'));
const result={date:'2026-11-19',websiteAuditDate:'2026-11-18',brokenDocumentationLinks:broken,gitDiffCheck:diff.trim()||'pass',protectedFiles:unchanged,wordDocx:{bytes:statSync('docs/期末報告_江戶不打烊_修訂版.docx').size,hasAllNineChapters:['一、策展理念','二、展覽設計','三、文物選件','四、網頁導覽','五、線上博物館','六、分工進度','七、參考文獻','八、驗證與限制','九、結論與後續改善'].every(t=>docx.includes(t)),hasWordToc:docx.includes('TOC'),scope:'Original-derived revision; OOXML structure only; no historical or participant-data validation by keyword tests'},reportValidationPassed:reportValidation.pass,status};
writeFileSync('docs/evidence/final-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,status:undefined}));
if(broken.length||unchanged.some(x=>!x.unchanged)||!result.wordDocx.hasAllNineChapters||!reportValidation.pass)process.exitCode=1;
