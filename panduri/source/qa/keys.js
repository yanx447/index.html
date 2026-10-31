const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/panduri-app.html');await p.waitForTimeout(500);
await p.evaluate(()=>{PD.store.set('onboarded',true);PD.store.set('auth.skip',true);document.querySelectorAll('.ob,.ag').forEach(o=>o.remove());});
for(const L of ['ka','en']){await p.evaluate(l=>PD.i18n.set(l),L);
for(const r of 'home,learn,songs,practice,profile,progress,settings,daily,trainer,metronome,rhythms,tuner,lesson:poc-three,lesson:poc-fret,lesson:bani-acharuli,community,RHY,path:PATH1'.split(',')){await p.evaluate(r=>{if(r==='RHY')return PD.app.go('rhythm',PD.curriculum.rhythms()[0].id);if(r==='PATH1')return PD.app.go('path',PD.lessons.PATHS[0].id);const [a,b]=r.split(':');PD.app.go(a,b);},r);await p.waitForTimeout(300);
const k=await p.evaluate(()=>(document.querySelector('.page')||document.body).innerText.match(/\b[a-z]{1,6}\.[a-zA-Z]{2,}\b|\bnull\b|\bundefined\b|NaN/g));
if(k)console.log(L,r,[...new Set(k)].join(' '));}}
console.log('errs',errs);await b.close();})();
