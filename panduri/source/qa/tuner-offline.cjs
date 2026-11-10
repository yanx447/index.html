const { chromium }=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});const ctx=await browser.newContext();const page=await ctx.newPage();
 await page.addInitScript(()=>localStorage.setItem('pd2:lang','"ka"'));
 await page.goto('http://localhost:8183/panduri/app/');
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
 await page.waitForFunction(()=>navigator.serviceWorker.controller && window.PD?.app);
 async function open(){
  await page.evaluate(()=>{document.querySelectorAll('.ag,.lf,.ob,.cine,.cine-boot').forEach(e=>e.remove());PD.app.go('tuner')});
  await page.frameLocator('.ss-integrated').locator('#micBtn').waitFor();
  const frame=page.frames().find(f=>f.url().includes('tuner/index'));await frame.waitForFunction(()=>window.__panduri);
  return frame;
 }
 await open();await ctx.setOffline(true);await page.reload();await page.waitForFunction(()=>window.PD?.app);
 assert.equal(await page.locator('#shell').count(),1);const frame=await open();assert.equal(await frame.locator('#micBtn').count(),1);
 console.log('Offline: app shell and Sami Simi load independently; tuner navigation does not overwrite app HTML.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
