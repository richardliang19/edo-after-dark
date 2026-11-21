import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
const pkg=resolve('C:/Users/Benini/AppData/Local/Temp/vscode-agent-codex-sandbox-KXD9WW/edo-audit-pdf-tools/package');
const files={'/original.pdf':resolve('docs/evidence/final-report-original/期末報告_江戶不打烊.pdf'),'/revised.pdf':resolve('docs/期末報告_江戶不打烊_修訂版.pdf')};
const viewer=`<!doctype html><meta charset="utf-8"><title>期末原稿／修訂稿文件驗收</title><canvas></canvas><script type="module">import{getDocument,GlobalWorkerOptions}from'/pdfjs/build/pdf.mjs';GlobalWorkerOptions.workerSrc='/pdfjs/build/pdf.worker.mjs';window.loadPdf=async url=>{window.pdf=await getDocument({url,cMapUrl:'/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdfjs/standard_fonts/',wasmUrl:'/pdfjs/wasm/'}).promise;return window.pdf.numPages;};window.pdfToolsReady=true;</script>`;
createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://127.0.0.1:4333').pathname;
 if(path==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(viewer);return;}
 let file=files[path];
 if(path.startsWith('/pdfjs/')){file=resolve(pkg,path.slice(7));if(!file.startsWith(pkg+sep))throw new Error('Outside library');}
 if(!file){res.writeHead(404);res.end();return;}
 const data=await readFile(file);res.writeHead(200,{'Content-Type':{'.pdf':'application/pdf','.mjs':'text/javascript','.wasm':'application/wasm'}[extname(file)]??'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end();}
}).listen(4333,'127.0.0.1',()=>console.log('Whitelisted report PDFs and local PDF.js served on loopback 4333.'));
