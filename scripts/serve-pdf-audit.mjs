import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { readdirSync } from 'node:fs';
const pkg=resolve('C:/Users/Benini/AppData/Local/Temp/vscode-agent-codex-sandbox-KXD9WW/edo-audit-pdf-tools/package');
const source=resolve('docs/evidence/recovered',readdirSync('docs/evidence/recovered').find(n=>n.endsWith('.pdf')));
const viewer=`<!doctype html><meta charset="utf-8"><title>本機文件查核</title><body style="margin:0;background:#ddd"><canvas id="page"></canvas><script type="module">import{getDocument,GlobalWorkerOptions}from'/pdfjs/build/pdf.mjs';GlobalWorkerOptions.workerSrc='/pdfjs/build/pdf.worker.mjs';window.loadPdf=async(url)=>{window.pdf=await getDocument({url,cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdfjs/standard_fonts/',wasmUrl:'/pdfjs/wasm/'}).promise;return window.pdf.numPages;};window.pdfToolsReady=true;</script>`;
createServer(async(req,res)=>{try{const path=new URL(req.url,'http://127.0.0.1:4332').pathname;let file;
 if(path==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(viewer);return;}
 if(path==='/source.pdf')file=source;
 else if(path==='/draft-preview.pdf')file=resolve('docs/期末報告_江戶不打烊_分章修訂稿_HTML預覽.pdf');
 else if(path.startsWith('/pdfjs/')){file=resolve(pkg,path.slice(7));if(!file.startsWith(pkg+sep))throw new Error('Outside allowed library root');}
 else{res.writeHead(404);res.end();return;}
 const data=await readFile(file);res.writeHead(200,{'Content-Type':{'.mjs':'text/javascript','.pdf':'application/pdf','.wasm':'application/wasm'}[extname(file)]??'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end();}}).listen(4332,'127.0.0.1',()=>console.log('Local PDF audit server on port 4332; only whitelisted documents and PDF.js are served.'));
