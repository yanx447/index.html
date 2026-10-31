const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/ui/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home', null, true); });
  await p.waitForTimeout(600);
  const snap = async (name, ms) => { await p.waitForTimeout(ms); await p.screenshot({ path: OUT + 'm-' + name + '.png' }); };
  const info = () => p.evaluate(() => [...document.querySelectorAll('.page')].map(x => x.className + ' op=' + getComputedStyle(x).opacity.slice(0, 4) + ' tf=' + getComputedStyle(x).transform.slice(0, 30)).join(' | '));
  // forward: home → lesson
  await p.evaluate(() => PD.app.go('lesson', 'bani-acharuli')); await p.waitForTimeout(90); console.log('fwd @90ms:', await info()); await snap('fwd', 0);
  await p.waitForTimeout(500); console.log('fwd done:', await info());
  // back
  await p.evaluate(() => history.back()); await p.waitForTimeout(90); console.log('back @90ms:', await info()); await snap('back', 0);
  await p.waitForTimeout(500);
  // tab switch
  await p.evaluate(() => document.querySelector('.tabbar .navb[data-go="learn"]').click()); await p.waitForTimeout(90); console.log('tab @90ms:', await info());
  await p.waitForTimeout(150); console.log('ind:', await p.evaluate(() => { const i = document.querySelector('.tabbar .tab-ind'); return i.className + ' ' + i.style.transform; }));
  await p.waitForTimeout(400);
  // same page re-render keeps scroll
  await p.evaluate(() => { const pg = document.querySelector('#page'); pg.style.scrollBehavior = 'auto'; pg.scrollTop = 300; PD.app.render(); }); await p.waitForTimeout(50);
  console.log('re-render scroll:', await p.evaluate(() => document.querySelector('#page').scrollTop), 'pages:', await p.evaluate(() => document.querySelectorAll('.page').length));
  // sheet in/out
  await p.evaluate(() => PD.ui.confirm('test', () => {})); await p.waitForTimeout(120); await snap('sheetin', 0);
  await p.keyboard.press('Escape'); await p.waitForTimeout(80); console.log('sheet closing:', await p.evaluate(() => [...document.querySelectorAll('.sheet-back')].map(x => x.className).join(',')));
  await p.waitForTimeout(300); console.log('sheet gone:', await p.evaluate(() => document.querySelectorAll('.sheet-back').length));
  // practice in/out
  await p.evaluate(() => { PD.store.set('devTouch', true); PD.app.startStage(PD.lessons.get('poc-three'), 'wait'); }); await p.waitForTimeout(120); await snap('pzin', 0);
  await p.waitForTimeout(800);
  await p.evaluate(() => PD.practice.close()); await p.waitForTimeout(100); console.log('pz closing:', await p.evaluate(() => [...document.querySelectorAll('.pz')].map(x => x.className).join(',')));
  await p.waitForTimeout(300); console.log('pz gone:', await p.evaluate(() => document.querySelectorAll('.pz').length));
  // toast
  await p.evaluate(() => PD.ui.toast('სატესტო', 400)); await p.waitForTimeout(500); console.log('toast:', await p.evaluate(() => document.querySelector('#toast').className + ' hidden=' + document.querySelector('#toast').hidden));
  await p.waitForTimeout(300); console.log('toast later hidden=', await p.evaluate(() => document.querySelector('#toast').hidden));
  // reduced motion: no leave layers
  await p.emulateMedia({ reducedMotion: 'reduce' }); await p.evaluate(() => PD.app.go('songs')); await p.waitForTimeout(30); console.log('reduced: pages', await p.evaluate(() => document.querySelectorAll('.page').length));
  console.log('ERRS', JSON.stringify(errs));
  await b.close();
})();
