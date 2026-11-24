// Catalogue integrity plus the real pack picker, legacy IDs, favorites, paging and sending.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const src=path.resolve(__dirname,'../src'),out=process.env.PANDURI_QA_OUT||path.resolve(__dirname,'../../../docs/v2-review/sticker-packs');fs.mkdirSync(out,{recursive:true});
const app=process.env.PANDURI_QA_APP||path.resolve(__dirname,'../dist/app');
const appUrl='https://panduri-qa.test/index.html/panduri/app/';
const instrumentPacks={
  folkstrings:['panduri','chonguri','changi','chuniri'],
  folkwinds:['doli','salamuri','daira','larchemi'],
  acoustic:['guitar','violin','cello','mandolin'],
  jazz:['trumpet','saxophone','piano','drumkit']
};
const originalInstruments=[...instrumentPacks.folkstrings,...instrumentPacks.folkwinds,'duduki','garmoni','diplipito','chiboni'];
const instrumentFile=slug=>'instrument-'+slug+'-still.webp';
const assetsScript=path.join(app,'js/assets.js');
assert.ok(fs.existsSync(assetsScript),'Build the application before running sticker QA');
const serviceWorker=fs.readFileSync(path.join(app,'sw.js'),'utf8');
for(const slug of [...originalInstruments,...instrumentPacks.acoustic,...instrumentPacks.jazz]){
  const file=instrumentFile(slug);
  assert.ok(fs.existsSync(path.join(app,'stickers',file)),file+' is missing from the build');
  assert.ok(serviceWorker.includes('"stickers/'+file+'"'),file+' is missing from the offline shell');
}
const labels={},context={PD:{i18n:{add:o=>Object.assign(labels,o),t:(k,v)=>{let s=labels[k]?.[0]||k;for(const [n,x]of Object.entries(v||{}))s=s.replaceAll('{'+n+'}',String(x));return s;}},h(){}}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(src,'stickers.js'),'utf8'),context);
const library=context.PD.stickers;
assert.equal(library.packs.length,22);
assert.equal(library.catalog.length,294);
assert.equal(new Set(library.STICKERS).size,294);
for(const pack of library.packs){
  const slugs=instrumentPacks[pack.id];
  if(slugs)assert.deepEqual(Array.from(pack.ids),slugs.map(slug=>pack.id+'-'+slug));
  else assert.equal(pack.ids.length,pack.id==='session'?6:16);
}
assert.match(library.artMarkup('folkstrings-panduri'),/^<svg /);
const fanduriFallback = library.svg('folkstrings-panduri');
assert.equal((fanduriFallback.match(/class="sp-panduri-string"/g) || []).length, 3);
assert.equal((fanduriFallback.match(/class="sp-panduri-peg"/g) || []).length, 3);
assert.ok(library.STICKERS.every(id=>/^[a-z0-9_-]{1,32}$/.test(id)));
const drawings=library.STICKERS.map(id=>library.svg(id));assert.equal(new Set(drawings.map(x=>crypto.createHash('sha256').update(x).digest('hex'))).size,294);assert.ok(drawings.every(svg=>!svg.includes('undefined')&&!svg.includes('NaN')&&!svg.includes('ck-character')));
assert.equal(Object.keys(library.LEGACY).length,36);for(const id of Object.keys(library.LEGACY))assert.ok(library.resolve(id),id);
async function checkInstrument(image,slug){
  const uri=appUrl+'stickers/'+instrumentFile(slug);
  await image.scrollIntoViewIfNeeded();
  assert.deepEqual(await image.evaluate(async img=>{
    await img.decode();
    return [img.currentSrc,img.naturalWidth>0];
  }),[uri,true]);
}
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
  for(const [width,height]of [[320,740],[390,844],[820,1180],[1440,900],[844,390]]){
    const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route(appUrl+'stickers/*.webp',route=>route.fulfill({
      path:path.join(app,'stickers',path.basename(new URL(route.request().url()).pathname)),
      contentType:'image/webp'
    }));
    await page.setContent('<base href="'+appUrl+'"><div id="host" style="position:fixed;bottom:20px;left:16px;right:16px"><textarea id="input" aria-label="Message" style="width:100%;height:42px"></textarea></div>');
    for(const file of ['app.css','design.css','v2.css','messenger.css'])await page.addStyleTag({path:path.join(src,file)});
    await page.evaluate(()=>{const labels={},storage={};window.PD={assets:{stickerMotion:{}},esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),cloud:{gifs:{probe:async()=>({on:false})}},store:{get:(k,d)=>storage[k]??d,set:(k,v)=>storage[k]=v},i18n:{add:o=>Object.assign(labels,o),t:(k,v)=>{let s=labels[k]?.[window.previewKa?0:1]||k;for(const [n,x]of Object.entries(v||{}))s=s.replaceAll('{'+n+'}',String(x));return s;}},h:(tag,a,kids=[])=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(a||{})){if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else if(k==='text')e.textContent=v;else if(k==='hidden')e.hidden=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v);}for(const c of kids)if(c!=null)e.append(c);return e;}};window.t=PD.i18n.t;});
    await page.addScriptTag({path:assetsScript});
    for(const file of ['stickers.js','chatkit.js'])await page.addScriptTag({path:path.join(src,file)});
    await page.evaluate(()=>{window.kit=PD.chatkit.panel({input:document.querySelector('#input'),onSticker:id=>window.sent=id});kit.toggle('stickers');});
    await page.waitForTimeout(250);
    const packCards=page.locator('.sp-pack-card');
    assert.equal(await packCards.count(),22);
    assert.equal(await packCards.first().getAttribute('data-pack'),'folkstrings');
    assert.ok(await packCards.evaluateAll(cards=>cards.every(card=>card.lastElementChild.getBoundingClientRect().bottom<=card.getBoundingClientRect().bottom-3)));
    await checkInstrument(packCards.first().locator('img.stk-instrument'),'panduri');
    await page.screenshot({path:path.join(out,`packs-${width}.png`)});
    const toolsY=await page.locator('.sp-search-row').evaluate(e=>e.getBoundingClientRect().top);await page.locator('.sp-content').evaluate(e=>e.scrollTop=450);assert.equal(await page.locator('.sp-search-row').evaluate(e=>e.getBoundingClientRect().top),toolsY);await page.locator('.sp-content').evaluate(e=>e.scrollTop=0);
    const bounds=await page.locator('.ck-panel').boundingBox();assert.ok(bounds.height<=height*.65,JSON.stringify(bounds));assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1,JSON.stringify(bounds));
    if(width===1440){
      for(const [pack,slugs]of Object.entries(instrumentPacks)){
        const label=labels[library.packs.find(item=>item.id===pack).key][1];
        await page.getByRole('tab',{name:label,exact:true}).click();
        assert.equal(await page.locator('.ck-stb').count(),4);
        for(const slug of slugs)await checkInstrument(page.locator('[data-sticker="'+pack+'-'+slug+'"] img.stk-instrument'),slug);
      }
      const jazzSticker=page.locator('[data-sticker="jazz-trumpet"] .sp-pick');
      await jazzSticker.click();
      assert.equal(await page.evaluate(()=>window.sent),'jazz-trumpet');
      await page.evaluate(()=>{delete window.sent;kit.toggle('stickers');});
    }
    await page.getByRole('tab',{name:'Georgian instruments',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),16);
    for(const slug of width===1440?originalInstruments:['panduri'])await checkInstrument(page.locator('[data-sticker="instruments-'+slug+'"] img.stk-instrument'),slug);
    const moving=page.locator('[data-sticker="instruments-strings"] .sp-moving');const before=await moving.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(550);const after=await moving.evaluate(e=>getComputedStyle(e).transform);assert.notEqual(before,after);await page.getByRole('button',{name:'Pause animations',exact:true}).click();assert.equal(await moving.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');await page.getByRole('button',{name:'Play animations',exact:true}).click();
    const favorite=page.locator('[data-sticker="instruments-panduri"] .sp-favorite');await favorite.click();assert.equal(await page.locator('[data-sticker="instruments-panduri"] .sp-favorite').getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>window.sent),undefined);
    await page.getByRole('tab',{name:'Favorites',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),1);await page.locator('[data-sticker="instruments-panduri"] .sp-pick').click();assert.equal(await page.evaluate(()=>sent),'instruments-panduri');assert.equal(await page.locator('.ck-panel').isVisible(),false);
    await page.evaluate(()=>kit.toggle('stickers'));await page.getByRole('tab',{name:'Recent',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),width===1440?2:1);
    await page.locator('.sp-search').fill('ფანდური');
    assert.equal(await page.locator('[data-sticker="instruments-panduri"]').count(),1);
    assert.equal(await page.locator('[data-sticker="folkstrings-panduri"]').count(),1);
    await page.locator('.sp-search').fill('zznotasticker');assert.equal(await page.locator('.ck-stb').count(),0);assert.match(await page.locator('.sp-empty').textContent(),/No stickers/);
    await page.getByRole('tab',{name:'All stickers',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),48);await page.locator('.sp-more').click();assert.equal(await page.locator('.ck-stb').count(),96);
    await page.getByRole('tab',{name:'Georgian words',exact:true}).click();assert.equal(await page.locator('.ck-stb').count(),16);await page.screenshot({path:path.join(out,`words-${width}.png`)});
    await page.getByRole('tab',{name:'Sculpted · 3D',exact:true}).click();assert.equal(await page.locator('.sp-sculpture img').count(),16);await page.waitForFunction(()=>[...document.querySelectorAll('.sp-sculpture img')].slice(0,3).every(i=>i.complete&&i.naturalWidth===256));const sculpture=page.locator('[data-sticker="sculpt-heart"] .sp-sculpture');const frameA=await sculpture.screenshot();await page.waitForTimeout(650);const frameB=await sculpture.screenshot();assert.notDeepEqual(frameA,frameB);await page.getByRole('button',{name:'Pause animations',exact:true}).click();assert.equal(await sculpture.locator('img').evaluate(e=>e.getAttribute('src')===e.dataset.still),true);await page.getByRole('button',{name:'Play animations',exact:true}).click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>{const i=document.querySelector('[data-sticker="sculpt-heart"] img');return i.currentSrc===new URL(i.dataset.still,document.baseURI).href;});assert.equal(await sculpture.locator('img').evaluate(e=>e.currentSrc===new URL(e.dataset.still,document.baseURI).href),true);await page.emulateMedia({reducedMotion:'no-preference'});
    assert.ok(await page.locator('.sp-tile').evaluateAll(items=>items.every(e=>e.scrollWidth<=e.clientWidth+1)));
    await page.evaluate(()=>document.body.append(PD.chatkit.sticker('panduri')));
    await checkInstrument(page.locator('.ck-st--panduri img.stk-instrument'),'panduri');
    await page.evaluate(()=>window.previewKa=true);for(const pack of library.packs){await page.evaluate(id=>{document.body.innerHTML='<main class="proof-grid"></main>';const host=document.querySelector('main');for(const s of PD.stickers.catalog.filter(s=>s.pack===id)){const tile=document.createElement('div');tile.append(PD.stickers.render(s.id,true));host.append(tile);}},pack.id);await page.addStyleTag({content:'.proof-grid{display:grid;grid-template-columns:repeat(4,170px);gap:16px;background:#151719;padding:24px;width:744px}.proof-grid>div{padding:12px;border:1px solid #3b3c3d;border-radius:12px}.proof-grid .ck-art{max-width:140px!important;width:140px!important;height:140px!important}.proof-grid .ck-st b{color:#ece8dd!important;font:12px sans-serif!important}'});if(width===1440)await page.locator('.proof-grid').screenshot({path:path.join(out,pack.id+'.png')});}
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS: 22 packs, 294 sticker IDs, 20 instrument WebPs in the built offline shell, 36 legacy IDs, viewport bounds, bilingual search, favorites/recent persistence, paging, stable send IDs, contact sheets, 2D/3D motion, pause and reduced motion.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
