import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
const root=resolve('dist'),base='https://audit.example/edo-after-dark/';
function walk(path){return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(path,e.name)):[resolve(path,e.name)]);}
const pages=existsSync(root)?walk(root).filter(p=>p.endsWith('.html')):[];
test('built exhibition includes all nineteen Astro pages and preserved concept pages',()=>{
 assert.ok(pages.length>=24,'run npm run build before this test');
 for(const id of ['A01','A02','A03','A04','A05','A06','A07','A08','B01','B02','B03'])assert.ok(existsSync(resolve(root,'artworks',id,'index.html')));
});
test('all generated internal links, fragments and local assets resolve within the deployment base',()=>{
 const failures=[];let count=0;
 for(const page of pages){
  const text=readFileSync(page,'utf8'),url=new URL(relative(root,page).replaceAll('\\','/'),base);
  for(const match of text.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)){
   const href=match[1].replaceAll('&amp;','&');
   if(/^(?:data:|blob:|mailto:|tel:|javascript:)/.test(href))continue;
   const target=new URL(href,url);if(target.origin!==new URL(base).origin)continue;count++;
   if(!target.pathname.startsWith('/edo-after-dark/')){failures.push(`${relative(root,page)}: escapes base: ${href}`);continue;}
   let file=resolve(root,decodeURIComponent(target.pathname.slice('/edo-after-dark/'.length)));
   if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,'index.html');
   if(!existsSync(file)){failures.push(`${relative(root,page)}: missing ${href}`);continue;}
   if(target.hash && extname(file)==='.html'){
    const id=decodeURIComponent(target.hash.slice(1));
    if(id && !readFileSync(file,'utf8').includes(`id="${id}"`))failures.push(`${relative(root,page)}: missing fragment ${href}`);
   }
  }
 }
 assert.ok(count>300,`only ${count} links found`);assert.deepEqual(failures,[]);
});
test('public HTML has no unfinished drafting prompts or invalid series placeholders',()=>{
 for(const page of pages){
  const text=readFileSync(page,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<!--[^]*?-->/g,'');
  assert.ok(!/待補：|待組員撰寫|黃色欄位|請補上出席者|正式上線前需查證|第 null 景/.test(text),relative(root,page));
 }
});
