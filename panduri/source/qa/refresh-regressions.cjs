const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true});
 for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:950},serviceWorkers:'block'});
  const page=await context.newPage(), errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.addInitScript(()=>{ localStorage.setItem('pd2:lang','"ka"'); localStorage.setItem('pd2:onboarded','true'); });
  await page.goto('http://localhost:8183/panduri/app/');
  await page.waitForFunction(()=>window.PD?.app);
  await page.evaluate(()=>document.querySelectorAll('.ag,.ob,.lf,.cine,.cine-boot').forEach(e=>e.remove()));
  for(const route of ['home','learn','chords','settings','progress','tuner']) {
   await page.evaluate(r=>PD.app.go(r),route); await page.waitForTimeout(450);
   assert.ok(await page.evaluate(()=>document.getElementById('page').scrollWidth<=document.getElementById('page').clientWidth+1),`${width} ${route} overflow`);
  }
  const frame=page.frames().find(f=>f.url().includes('tuner/index.html'));
  await frame.waitForFunction(()=>window.__panduri);
  assert.equal(await frame.locator('#app').count(),1);
  assert.equal(await page.evaluate(()=>typeof PD.tools.tuner),'undefined');
  const original=await frame.evaluate(()=>{window.__retained='same';return location.href});
  await page.evaluate(()=>PD.app.go('home')); await page.waitForTimeout(300);
  assert.equal(await page.locator('.ss-integrated').isVisible(),false);
  assert.equal(await frame.evaluate(()=>__panduri.running),false);
  await page.evaluate(()=>PD.app.go('tuner')); await page.waitForTimeout(300);
  assert.equal(await frame.evaluate(()=>window.__retained),'same');
  assert.equal(frame.url(),original);
  await page.screenshot({path:`/tmp/panduri-${width}-tuner.png`});
  // Decaying string: freeze the reading before a late harmonic/noise changes string.
  const trackerResult=await frame.evaluate(async()=>{
   const {PitchTracker}=await import('./js/tracker.js');const tr=new PitchTracker();
   tr.configure({strings:[{freq:220},{freq:277.1826},{freq:329.6276}],mode:'auto'});tr.begin(0);
   for(let t=0;t<=1000;t+=33)tr.update({freq:0,clarity:0,periodicity:0,rms:.001},t);
   for(let t=1033;t<=1700;t+=33)tr.update({freq:221,clarity:.99,periodicity:.99,rms:.08},t);
   const before={...tr.snap};
   for(let t=1733;t<=2200;t+=33)tr.update({freq:330,clarity:.99,periodicity:.99,rms:.004},t);
   return {before,after:{...tr.snap}};
  });
  assert.equal(trackerResult.before.stringIndex,0);assert.equal(trackerResult.after.stringIndex,0);
  assert.equal(trackerResult.after.cents,trackerResult.before.cents);
  await page.evaluate(()=>PD.app.go('settings')); await page.waitForTimeout(350);
  assert.equal(await page.locator('[data-t="rf.appearance"]').count(),1);
  assert.equal(await page.evaluate(()=>PD.i18n.t('dv.title')),'შენი მოწყობილობები');
  await page.evaluate(()=>PD.app.go('home'));await page.waitForTimeout(350);
  await page.screenshot({path:`/tmp/panduri-${width}-home.png`});
  await page.reload();await page.waitForFunction(()=>window.PD?.app);
  assert.equal(await page.locator('.lf').count(),0);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,routes:6,tunerRetained:true,decayHold:true,languagePersists:true,errors}));
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
