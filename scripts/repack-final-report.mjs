import {readFileSync,writeFileSync} from 'node:fs';
import {readZip} from './ooxml-package.mjs';
import {zip} from './docx-draft.mjs';
const path='docs/期末報告_江戶不打烊_修訂版.docx';
const entries=readZip(readFileSync(path));
writeFileSync(path,zip(entries));
console.log('Standard ZIP container rebuilt without modifying any OOXML part: '+entries.length+' parts.');
