const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const c=await b.newContext({viewport:{width:390,height:844},permissions:['microphone']});const p=await c.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/panduri-app.html');await p.waitForTimeout(800);
const shot=async n=>{await p.screenshot({path:'qa/ob-'+n+'.png'});};
const click=async sel=>{await p.click(sel);await p.waitForTimeout(250);};
await shot(0); await click('.ob .btn.primary');
await shot(1); await click('.ob .opt >> nth=0');
await shot(2); await click('.ob .opt >> nth=0');
await shot(3); await click('.ob .opt >> nth=0'); await click('.ob .opt >> nth=1'); await shot('3b'); await click('.ob .btn.primary');
await shot(4); await click('.ob .opt >> nth=2');
await shot(5); await click('.ob .btn.primary'); await p.waitForTimeout(1200); await shot('5cal');
// go through calibration
for(let i=0;i<4;i++){await p.evaluate(()=>{const bs=[...document.querySelectorAll('.ob:not([hidden]) .btn.primary')];bs[bs.length-1].click();});await p.waitForTimeout(400);await shot('cal'+i);}
await p.waitForTimeout(500); await shot(6); await click('.ob:not([hidden]) .row:last-child .btn.primary');
await shot(7); await click('.ob .btn.primary'); await p.waitForTimeout(1500); await shot(8);
console.log(await p.evaluate(()=>({ob:PD.store.get('onboarded'),goals:PD.store.get('goals'),min:PD.store.get('goalMin'),mic:PD.detector.active,pz:!!document.querySelector('.pz')})));
console.log('errs',errs);await b.close();})();
