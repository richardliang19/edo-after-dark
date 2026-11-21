import { readFileSync, writeFileSync } from 'node:fs';
import { observationSources } from '../src/data/observation.ts';
const p='src/data/artworks.json', a=JSON.parse(readFileSync(p,'utf8'));
const moon=a.find(a=>a.id==='A05');
moon.sections.people += ' Rutgers University 的 Zimmerli Art Museum 署名展覽文章把同構圖讀為月見會中的歌舞，和東京國立博物館的宴後解讀不同。本展保留這項分歧，不把任一活動階段當成畫面唯一可證的事實。';
for (const id of ['B02','B03']) {
 const x=a.find(a=>a.id===id);
 x.image.collection='Brooklyn Museum（依 Commons 檔案記載；原館藏連結本次未能核讀）';
 x.image.license='Commons 標示公有領域（PD-Art）；原館藏對應仍待確認';
}
writeFileSync(p,JSON.stringify(a,null,2)+'\n');
// Preserve existing bibliography entries, distinguish discovery leads from evidence.
const rpath='src/data/references.json', refs=JSON.parse(readFileSync(rpath,'utf8'));
for(const category of refs) {
 if(category.category==='作品文案：現代地點與地方史') category.category='舊版查找線索：非本次史實依據';
 for(const item of category.items) {
  if(item.url.includes('wikipedia.org')) item.note='舊版查找線索；本次未作關鍵史實的單獨依據。已改用作品頁所列館藏、官方地方史；未核實項目保留疑點。';
  else if(!item.url.includes('laws.e-gov')) item.apa=item.apa.replace(/Retrieved November (?:9|13|15), 2026/g,'Retrieved November 18, 2026');
  if(item.url.includes('laws.e-gov')) item.note='舊版法律連結；本次未完成法條全文核對。修訂版只依台東區圖書館已核讀的沿革指南說明歷史，不新增精確法律條號或效力判斷。';
 }
}
refs.push({category:'研究方法與本次查核增補',items:[
 {apa:'Department of Asian Art, The Metropolitan Museum of Art. (2003, October). *Woodblock prints in the Ukiyo-e style*. Retrieved November 18, 2026, from https://www.metmuseum.org/essays/woodblock-prints-in-the-ukiyo-e-style',url:'https://www.metmuseum.org/essays/woodblock-prints-in-the-ukiyo-e-style',note:'已核讀文章；支撐複數印本、出版者參與與商業製作的閱讀方法，不能據此推定某張圖的個別創作意圖。'},
 {apa:'Cambridge University Press. (n.d.). *Japan After Dark*, by Laura Nenzi [Book description]. Retrieved November 18, 2026, from https://www.cambridge.org/core/books/japan-after-dark/3149361D47CB1F1D331909733A694D0E',url:'https://www.cambridge.org/core/books/japan-after-dark/3149361D47CB1F1D331909733A694D0E',note:'本次只核讀出版社公開摘要及目錄；沒有閱讀全書，不列未讀頁碼。'},
 {apa:'World Wide Web Consortium. (2024, December 12). *Web Content Accessibility Guidelines (WCAG) 2.2*. Retrieved November 18, 2026, from https://www.w3.org/TR/WCAG22/',url:'https://www.w3.org/TR/WCAG22/',note:'作為設計與測試參照；本展未取得無障礙認證或全面符合性審定。'},
 ...Object.values(observationSources).filter(s=>!('unverified' in s) && ['moonHeritage','moonRutgers','yanagibashiLocal','bridgesLocal','ryogokuLocal','fireworksModern','festivalLocal','mitsuiHistory'].some(k=>observationSources[k]===s)).map(s=>({apa:`${s.institution}. (n.d.). *${s.title}* (${s.record}). Retrieved November 18, 2026, from ${s.url}`,url:s.url,note:s.scope})),
]});
writeFileSync(rpath,JSON.stringify(refs,null,2)+'\n');
// Correct publicly reachable concept drafts as well as production pages.
for(const name of ['emaki','lantern','fonts','zoom','index']) {
 const path=`public/concepts/${name}.html`;let text=readFileSync(path,'utf8');
 for(const [old,newText] of [
 ['日落時分，橋上有行人，橋下的河面也有遊船往來。',a.find(a=>a.id==='A01').summary],
 ['河岸料亭點起燈火，宴席從這裡開始。',a.find(a=>a.id==='A02').summary],
 ['通往吉原的堤道上，轎子與行人在月下前行。',a.find(a=>a.id==='B02').summary],
 ['宴席後的器物散落一地，窗外滿月懸在海灣上。',moon.summary],
 ['天色微亮，送客的身影走出大門，江戶的夜結束了。',a.find(a=>a.id==='A08').summary],
 ['房間的主人沒有出現在畫面裡，只留下了她的物品。','房間裡有物件，卻不見完整人物；物品各屬於誰，畫面沒有交代。'],
 ['地上的懷紙裡，髮簪做成熊手的樣子——熊手是酉之市的招福吉祥物，暗示有人剛從祭典回來。','地上的熊手形髮簪呼應酉之市。The Met 推測，它們可能是男客買給遊女的禮物，並不能證明房間主人剛從祭典回來。'],
 ['常見解讀，正式上線前需查證出處。','解讀依 The Met JP60，保留推測語氣。<a href="https://www.metmuseum.org/art/collection/search/36539">查看來源</a>。'],
 ['零時・午夜祭典','策展零時・畫中黃昏'],['data-label="午夜祭典"','data-label="窗內與祭典"'],['data-label="深夜宴席"','data-label="宴飲之後"'],
 ['日落之後，兩國橋上煙火升起，吉原的燈籠一盞盞亮起，淺草的參拜人潮走過田間小路。','廣重的畫裡，兩國煙火、吉原夜櫻與淺草參拜人潮分別留下城市片刻；它們並非同一季節、同一年或同一夜的紀錄。'],
 ['當日落後，兩國橋上煙火升起，吉原的燈籠一盞盞亮起，淺草的參拜人潮走過田間小路。','廣重的畫裡，兩國煙火、吉原夜櫻與淺草參拜人潮分別留下城市片刻；它們並非同一季節、同一年或同一夜的紀錄。'],
 ['概念稿文案皆為暫定，需組員查證。','此為保留的視覺概念稿；正式展覽與逐件來源請由主站作品頁閱讀。'],
 ['作品圖待補','概念稿示意位置，請由主站閱讀作品'],
 ]) text=text.replaceAll(old,newText);
 if(name==='emaki') text=text.replace('<div class="go">向下捲動・沿河前行 →</div>','<div class="go">18:00–05:00 為策展安排，作品非同一夜紀錄。<br>向下捲動・沿河前行 →</div>');
 // Explain the source scope of draft images; do not invent their accession numbers.
 if(['index','lantern','emaki','zoom'].includes(name)) text=text.replace(/圖像：歌川廣重《名所江戶百景》，Brooklyn Museum 藏，經 Wikimedia Commons（公有領域）/g,'圖像：沿用 Wikimedia Commons 歌川廣重作品。概念稿圖檔的原館藏對應尚待逐檔核實；<a href="../../artworks/">正式展覽的逐件來源</a>另列於作品頁');
 writeFileSync(path,text);
}
