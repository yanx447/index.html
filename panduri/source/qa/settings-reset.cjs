// Isolated local browser storage; never touches an actual account.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({serviceWorkers:'block'});
  const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('ERROR',e.message)});
  await page.route('https://**/*',r=>r.abort());
  await page.goto(process.env.APP_URL||'http://localhost:8181/panduri/source/dist/app/');
  async function settings(){await page.waitForFunction(()=>window.PD?.app&&document.querySelector('#main'));await page.evaluate(()=>{document.querySelectorAll('.ag,.lf,.ob').forEach(e=>e.remove());PD.app.go('settings')});const storage=await page.evaluate(()=>PD.i18n.t('set.gApp'));await page.getByRole('button',{name:storage,exact:true}).click();}
  async function confirmReload(){await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('.sheet-back:not(.out) .btn.primary').click()]);await settings();}
  await settings();
  await page.evaluate(()=>{PD.store.set('goalMin',30);PD.store.set('quality','low');PD.store.set('vol',{inst:.2,metro:.1,ui:.3,ref:.4,master:.5});PD.store.set('qa.progress',{lesson:7});PD.store.set('qa.calibration',{latency:83});});
  const preserved=await page.evaluate(()=>[PD.store.get('qa.progress'),PD.store.get('qa.calibration'),PD.i18n.lang]);
  await page.locator('button[data-t="set.restoreRecommended"]').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>PD.store.get('goalMin')),30,'cancel preserves settings');
  await page.locator('button[data-t="set.restoreRecommended"]').click();await confirmReload();
  assert.deepEqual(await page.evaluate(()=>[PD.store.get('goalMin',15),PD.store.get('quality','auto'),PD.audio.vol.inst]),[15,'auto',.8]);
  assert.deepEqual(await page.evaluate(()=>[PD.store.get('qa.progress'),PD.store.get('qa.calibration'),PD.i18n.lang]),preserved);
  await page.locator('button[data-t="set.undoRecommended"]').click();await confirmReload();
  assert.deepEqual(await page.evaluate(()=>[PD.store.get('goalMin'),PD.store.get('quality'),PD.audio.vol.inst]),[30,'low',.2]);
  assert.equal(await page.locator('button[data-t="set.undoRecommended"]').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: cancel, restore defaults, audio reload, preserved unrelated data/language, undo, zero runtime errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
