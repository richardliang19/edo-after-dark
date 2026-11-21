import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
const args=['-env:UserInstallation=file:///C:/Users/Benini/AppData/Local/Temp/vscode-agent-codex-sandbox-KXD9WW/edo-report-lo-profile','--headless','--convert-to','pdf:writer_pdf_Export:'+JSON.stringify({UseLosslessCompression:{type:'boolean',value:'true'},ReduceImageResolution:{type:'boolean',value:'false'}}),'--outdir','docs','docs/期末報告_江戶不打烊_修訂版.docx'];
const output=execFileSync('C:/Program Files/LibreOffice/program/soffice.com',args,{encoding:'utf8',windowsHide:true,timeout:60000});
writeFileSync('docs/evidence/final-report-conversion.txt',output);
const record=JSON.parse(readFileSync('docs/evidence/final-report-render.json','utf8').replace(/^\uFEFF/,''));
record.method='LibreOffice UNO 更新目錄並儲存 DOCX；CLI 重新載入、以完整原圖輸出 PDF；目錄快取依實際 PDF 頁碼校正。保留可更新欄位及書籤，跨軟體再次更新可能重新分頁。';record.finalExport='LibreOffice CLI writer_pdf_Export';record.imageOptions={UseLosslessCompression:true,ReduceImageResolution:false};
writeFileSync('docs/evidence/final-report-render.json',JSON.stringify(record,null,2)+'\n');console.log(output.trim());
