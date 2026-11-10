const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const output = require('node:path').join(require('node:os').tmpdir(), 'panduri-ui');
require('node:fs').mkdirSync(output, {recursive:true});
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 for (const width of (process.env.WIDTHS || '390,1440,1920').split(',').map(Number)) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},serviceWorkers:'block'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.APP_URL || 'http://localhost:8181/panduri/app/'));
  await page.waitForFunction(()=>window.PD && PD.app && document.querySelector('#page'));
  // Only this isolated test context bypasses the welcome overlay; production auth stays intact.
  await page.evaluate(()=>{document.querySelectorAll('.ag,.ob,.cine,.cine-boot').forEach(x=>x.remove());PD.store.set('sima.nudge',false);PD.app.go('home',null,true)});
  for (const route of ['home','learn','chords','progress','settings']) {
   await page.evaluate(r=>PD.app.go(r),route);await page.waitForTimeout(800);
   const state=await page.evaluate(()=>({pages:document.querySelectorAll('.page').length,overflow:document.querySelector('#page').scrollWidth-document.querySelector('#page').clientWidth,missing:[...document.querySelectorAll('#page [data-t]')].filter(e=>e.dataset.t.startsWith('room.')&&e.textContent===e.dataset.t).map(e=>e.dataset.t)}));
   assert.equal(state.pages,1,route+' transition cleanup');assert.ok(state.overflow<=1,route+' overflow '+state.overflow);assert.deepEqual(state.missing,[]);
   if(route==='home'||(width===390&&route==='chords'))await page.screenshot({path:`${output}/${width}-${route}.png`});
  }
  await page.evaluate(()=>PD.app.go('home'));await page.waitForTimeout(700);
  await page.locator('.hq').nth(2).focus();await page.keyboard.press('Enter');await page.waitForTimeout(700);
  assert.equal(await page.evaluate(()=>PD.app.route),'chords');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>PD.app.go('home'));await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.page').length),1);
  assert.equal(await page.evaluate(()=>PD.motion.ok()),false);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>{PD.app.go('learn');document.documentElement.classList.add('rm')});await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>document.querySelectorAll('.page').length),1);
  await page.evaluate(()=>{document.documentElement.classList.remove('rm');PD.i18n.set('en');PD.app.go('home')});await page.waitForTimeout(700);
  assert.equal(await page.locator('.room-eyebrow').textContent(),'PANDURI · YOUR PRACTICE SPACE');
  assert.deepEqual(errors,[]);results.push({width,routes:5,errors,overflow:false,keyboard:true,reducedMotion:true});
  await context.close();
 }
 console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
