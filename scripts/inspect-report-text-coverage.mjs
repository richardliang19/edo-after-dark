import {readFileSync} from 'node:fs';
const v=JSON.parse(readFileSync('docs/evidence/final-report-validation.json','utf8'));
const p=JSON.parse(readFileSync('docs/evidence/final-report-revised/pdf-inspection.json','utf8'));
const norm=s=>s.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu,'');
const hay=norm(p.pages.map(p=>p.text).join('\n'));
for(const text of v.expectedContentMissing){
 const needle=norm(text);let best={length:0,at:0};
 for(let at=hay.indexOf(needle.slice(0,10));at>=0;at=hay.indexOf(needle.slice(0,10),at+1)){let n=0;while(needle[n]===hay[at+n]&&n<needle.length)n++;if(n>best.length)best={length:n,at};}
 console.log(JSON.stringify({prefix:text.slice(0,24),matched:best.length,expected:needle.slice(Math.max(0,best.length-25),best.length+45),actual:hay.slice(best.at+Math.max(0,best.length-25),best.at+best.length+45)}));
}
